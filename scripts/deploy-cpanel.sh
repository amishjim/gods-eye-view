#!/usr/bin/env bash
set -euo pipefail

APP_ROOT="/home/bandidnl/signalblotter.com"
APP_USER="bandidnl"
NODE_VERSION="24"
VENV="/home/${APP_USER}/nodevenv/signalblotter.com/${NODE_VERSION}"

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
SOURCE_ROOT="$(cd -- "${SCRIPT_DIR}/.." && pwd)"
BUILD_COMMIT="$(git -C "${SOURCE_ROOT}" rev-parse HEAD)"

log() {
  printf '[deploy] %s\n' "$*"
}

fail() {
  printf '[deploy] ERROR: %s\n' "$*" >&2
  exit 1
}

log "Deploying commit ${BUILD_COMMIT}"

test -f "${SOURCE_ROOT}/package.json" ||
  fail "package.json not found in deployment source"

test -f "${SOURCE_ROOT}/package-lock.json" ||
  fail "package-lock.json not found in deployment source"

test -f "${SOURCE_ROOT}/server.js" ||
  fail "server.js not found in deployment source"

test -f "${VENV}/bin/node" ||
  fail "CloudLinux Node environment not found: ${VENV}"

command -v rsync >/dev/null 2>&1 ||
  fail "rsync is not available"

command -v cloudlinux-selector >/dev/null 2>&1 ||
  fail "cloudlinux-selector is not available"

mkdir -p "${APP_ROOT}"

log "Synchronizing application source"

rsync -a --delete \
  --exclude '.git' \
  --exclude '.github' \
  --exclude '.env' \
  --exclude 'node_modules' \
  --exclude 'dist' \
  --exclude '.deployed-commit' \
  --exclude '.gev-cache' \
  --exclude '.gev-logs' \
  --exclude 'screenshots' \
  --exclude 'qa-shots' \
  --exclude 'output' \
  "${SOURCE_ROOT}/" \
  "${APP_ROOT}/"

log "Installing dependencies through CloudLinux Node.js Selector"

cloudlinux-selector install-modules \
  --json \
  --interpreter nodejs \
  --user "${APP_USER}" \
  --app-root "signalblotter.com" \
  --skip-web-check

log "Building production frontend through CloudLinux"

cloudlinux-selector run-script \
  --json \
  --interpreter nodejs \
  --user "${APP_USER}" \
  --app-root "signalblotter.com" \
  --script-name build

test -f "${APP_ROOT}/dist/index.html" ||
  fail "Production build did not create dist/index.html"

if grep -q '/src/main.js' "${APP_ROOT}/dist/index.html"; then
  fail "Built index.html still references raw source"
fi

log "Running production smoke test"

cd "${APP_ROOT}"

GEV_BUILD_COMMIT="${BUILD_COMMIT}" \
NODE_ENV=production \
"${VENV}/bin/node" server/production/real-build-smoke.mjs

log "Recording deployed commit"

printf '%s\n' "${BUILD_COMMIT}" > "${APP_ROOT}/.deployed-commit"

log "Restarting application through CloudLinux"

cloudlinux-selector restart \
  --json \
  --interpreter nodejs \
  --user "${APP_USER}" \
  --app-root "signalblotter.com"

log "Deployment complete: ${BUILD_COMMIT}"