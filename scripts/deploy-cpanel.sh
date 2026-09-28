#!/usr/bin/env bash
set -euo pipefail

APP_ROOT="/home/bandidnl/signalblotter.com"
APP_USER="bandidnl"
APP_DOMAIN="signalblotter.com"
NODE_VERSION="24"

VENV="/home/${APP_USER}/nodevenv/${APP_DOMAIN}/${NODE_VERSION}"
VENV_MODULES="${VENV}/lib/node_modules"

export PATH="${VENV}/bin:${PATH}"

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
SOURCE_ROOT="$(cd -- "${SCRIPT_DIR}/.." && pwd)"
BUILD_COMMIT="$(git -C "${SOURCE_ROOT}" rev-parse HEAD)"

RUNTIME_STAGE=""
CREATED_REPO_NODE_MODULES=0

log() {
  printf '[deploy] %s\n' "$*"
}

fail() {
  printf '[deploy] ERROR: %s\n' "$*" >&2
  exit 1
}

cleanup() {
  if [ "${CREATED_REPO_NODE_MODULES}" -eq 1 ]; then
    rm -f "${SOURCE_ROOT}/node_modules"
  fi

  if [ -n "${RUNTIME_STAGE}" ] && [ -d "${RUNTIME_STAGE}" ]; then
    rm -rf "${RUNTIME_STAGE}"
  fi
}

trap cleanup EXIT

ensure_source_protection() {
  if ! grep -qF '# SIGNAL BLOTTER SOURCE EXPOSURE PROTECTION' "${APP_ROOT}/.htaccess"; then
    log "Adding source-exposure protection to .htaccess"

    cat >> "${APP_ROOT}/.htaccess" <<'HTACCESS_RULES'

# SIGNAL BLOTTER SOURCE EXPOSURE PROTECTION
<FilesMatch "^(package(-lock)?\.json|server\.js|vite\.config\.js|\.env.*|.*\.md)$">
  Require all denied
</FilesMatch>

RewriteEngine On
RewriteRule ^(?:src|server|scripts|config|tools|build|docs|pinokio)(?:/|$) - [F,L,NC]
HTACCESS_RULES
  fi
}

stage_file() {
  local relative="$1"

  test -f "${SOURCE_ROOT}/${relative}" ||
    fail "Required runtime file missing: ${relative}"

  install -D -m 0644 \
    "${SOURCE_ROOT}/${relative}" \
    "${RUNTIME_STAGE}/${relative}"
}

log "Deploying commit ${BUILD_COMMIT}"

test -f "${SOURCE_ROOT}/package.json" ||
  fail "package.json not found"

test -f "${SOURCE_ROOT}/package-lock.json" ||
  fail "package-lock.json not found"

test -f "${SOURCE_ROOT}/index.html" ||
  fail "Vite source index.html not found"

test -f "${SOURCE_ROOT}/server.js" ||
  fail "server.js not found"

test -f "${VENV}/bin/node" ||
  fail "CloudLinux Node environment not found: ${VENV}"

test -f "${VENV}/bin/npm" ||
  fail "CloudLinux npm not found: ${VENV}"

test -d "${VENV_MODULES}" ||
  fail "CloudLinux node_modules directory not found: ${VENV_MODULES}"

command -v rsync >/dev/null 2>&1 ||
  fail "rsync is not available"

command -v cloudlinux-selector >/dev/null 2>&1 ||
  fail "cloudlinux-selector is not available"

command -v curl >/dev/null 2>&1 ||
  fail "curl is not available"

command -v mktemp >/dev/null 2>&1 ||
  fail "mktemp is not available"

command -v install >/dev/null 2>&1 ||
  fail "install is not available"

mkdir -p "${APP_ROOT}"

# Namecheap/LiteSpeed required 0755 for Passenger routing.
chmod 0755 "${APP_ROOT}"

# CloudLinux/cPanel owns this file. Never overwrite or delete it.
test -f "${APP_ROOT}/.htaccess" ||
  fail "Passenger .htaccess is missing; refusing to deploy"

ensure_source_protection

log "Updating dependency manifests for CloudLinux"

cp "${SOURCE_ROOT}/package.json" "${APP_ROOT}/package.json"
cp "${SOURCE_ROOT}/package-lock.json" "${APP_ROOT}/package-lock.json"

log "Installing dependencies through CloudLinux Node.js Selector"

cloudlinux-selector install-modules \
  --json \
  --interpreter nodejs \
  --user "${APP_USER}" \
  --app-root "${APP_DOMAIN}" \
  --skip-web-check

ensure_source_protection

log "Preparing private repository build environment"

if [ -e "${SOURCE_ROOT}/node_modules" ]; then
  if [ ! -L "${SOURCE_ROOT}/node_modules" ]; then
    fail "Repository node_modules exists but is not a symlink"
  fi

  EXISTING_MODULES="$(
    readlink -f "${SOURCE_ROOT}/node_modules"
  )"

  if [ "${EXISTING_MODULES}" != "${VENV_MODULES}" ]; then
    fail "Repository node_modules points to unexpected location: ${EXISTING_MODULES}"
  fi
else
  ln -s "${VENV_MODULES}" "${SOURCE_ROOT}/node_modules"
  CREATED_REPO_NODE_MODULES=1
fi

log "Building production frontend in private Git checkout"

cd "${SOURCE_ROOT}"
"${VENV}/bin/npm" run build

test -f "${SOURCE_ROOT}/dist/index.html" ||
  fail "Production build did not create dist/index.html"

if grep -q '/src/main.js' "${SOURCE_ROOT}/dist/index.html"; then
  fail "Built index.html still references raw source"
fi

log "Running repository production smoke test"

GEV_BUILD_COMMIT="${BUILD_COMMIT}" \
NODE_ENV=production \
"${VENV}/bin/node" server/production/real-build-smoke.mjs

log "Creating minimal production runtime"

RUNTIME_STAGE="$(
  mktemp -d "/home/${APP_USER}/.signalblotter-runtime.XXXXXX"
)"

chmod 0755 "${RUNTIME_STAGE}"

stage_file "package.json"
stage_file "package-lock.json"
stage_file "server.js"

stage_file "server/production/application.js"
stage_file "server/production/http-server.js"
stage_file "server/production/middleware-stack.js"
stage_file "server/production/real-build-smoke.mjs"

stage_file "server/providers/public-incidents.js"
stage_file "server/providers/firms.js"
stage_file "server/providers/common/http.js"
stage_file "server/providers/common/rate-limit.js"

stage_file "server/providers/regional/place.js"
stage_file "server/providers/regional/http.js"

stage_file "server/standalone/api-not-found.js"

stage_file "src/layers/publicIncidents/providers.js"
stage_file "src/data/firmsCsv.js"
stage_file "src/sources/httpBody.js"
stage_file "src/sources/rateLimit.js"
stage_file "src/data/regionalModel.js"
stage_file "src/nominatimGeocode.js"

log "Adding verified frontend build to staged runtime"

mkdir -p "${RUNTIME_STAGE}/dist"

rsync -a \
  --chmod=D755,F644 \
  "${SOURCE_ROOT}/dist/" \
  "${RUNTIME_STAGE}/dist/"

ln -s "${VENV_MODULES}" "${RUNTIME_STAGE}/node_modules"

log "Smoke-testing exact staged production runtime"

(
  cd "${RUNTIME_STAGE}"

  GEV_BUILD_COMMIT="${BUILD_COMMIT}" \
  NODE_ENV=production \
  "${VENV}/bin/node" server/production/real-build-smoke.mjs
)

log "Staged production runtime passed smoke test"

# Test-only files do not belong in the public runtime package.
rm -f "${RUNTIME_STAGE}/server/production/real-build-smoke.mjs"
rm -f "${RUNTIME_STAGE}/node_modules"

test ! -e "${RUNTIME_STAGE}/index.html" ||
  fail "Source-root index.html unexpectedly exists in runtime package"

log "Synchronizing verified minimal production runtime"

rsync -a --delete \
  --chmod=D755,F644 \
  --exclude '.*' \
  --exclude 'node_modules' \
  --exclude 'tmp' \
  --exclude '.gev-cache' \
  --exclude '.gev-logs' \
  --exclude '*.log' \
  "${RUNTIME_STAGE}/" \
  "${APP_ROOT}/"

# Belt and suspenders: LiteSpeed must never find Vite's source entry here.
rm -f \
  "${APP_ROOT}/index.html" \
  "${APP_ROOT}/index.source.html"

chmod 0755 "${APP_ROOT}"

test -f "${APP_ROOT}/dist/index.html" ||
  fail "Deployed dist/index.html is missing"

ensure_source_protection

log "Recording deployed commit"

printf '%s\n' "${BUILD_COMMIT}" > "${APP_ROOT}/.deployed-commit"

log "Restarting application through CloudLinux"

cloudlinux-selector restart \
  --json \
  --interpreter nodejs \
  --user "${APP_USER}" \
  --app-root "${APP_DOMAIN}"

log "Waiting for production health check"

HEALTH=""

for attempt in 1 2 3 4 5; do
  HEALTH="$(
    curl -fsS \
      "https://${APP_DOMAIN}/healthz" \
      2>/dev/null || true
  )"

  if printf '%s' "${HEALTH}" | grep -q "${BUILD_COMMIT}"; then
    break
  fi

  sleep 2
done

printf '%s\n' "${HEALTH}" | grep -q "${BUILD_COMMIT}" ||
  fail "Production health check did not report commit ${BUILD_COMMIT}"

log "Verifying production root"

ROOT_STATUS="$(
  curl -sS \
    -o /dev/null \
    -w '%{http_code}' \
    "https://${APP_DOMAIN}/"
)"

test "${ROOT_STATUS}" = "200" ||
  fail "Production root returned HTTP ${ROOT_STATUS}"

log "Verifying source-code protection"

for path in \
  package.json \
  package-lock.json \
  server.js \
  server/production/application.js \
  server/providers/public-incidents.js \
  src/layers/publicIncidents/providers.js \
  src/sources/httpBody.js
do
  STATUS="$(
    curl -sS \
      -o /dev/null \
      -w '%{http_code}' \
      "https://${APP_DOMAIN}/${path}"
  )"

  case "${STATUS}" in
    403|404)
      ;;
    *)
      fail "Sensitive source path /${path} returned HTTP ${STATUS}"
      ;;
  esac
done

log "Verifying unknown API isolation"

UNKNOWN_API_STATUS="$(
  curl -sS \
    -o /dev/null \
    -w '%{http_code}' \
    "https://${APP_DOMAIN}/api/this-route-must-not-exist"
)"

test "${UNKNOWN_API_STATUS}" = "404" ||
  fail "Unknown API returned HTTP ${UNKNOWN_API_STATUS}"

log "Deployment verified: ${BUILD_COMMIT}"
