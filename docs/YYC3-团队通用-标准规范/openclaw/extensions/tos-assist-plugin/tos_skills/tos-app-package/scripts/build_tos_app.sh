#!/bin/bash
# TOS App Build & Package Script
# Usage: bash build_tos_app.sh <APP_ID> <BUILD_DIR> [FRONTEND_DIR]
#
# Example: bash build_tos_app.sh Deduplication_Manager /tmp/dedup_build /path/to/frontend
#
# Steps:
#   1. Build frontend (if FRONTEND_DIR provided)
#   2. Copy frontend dist to output/webui/
#   3. Generate lang archive
#   4. Run makeapp_x64_real to create .tpk
#
# Prerequisites:
#   - makeapp_x64_real at /tmp/makeapp_x64_real
#   - Node.js (for frontend build)
#   - Frontend project with npm build script

set -e

APP_ID="${1:?Usage: build_tos_app.sh <APP_ID> <BUILD_DIR> [FRONTEND_DIR]}"
BUILD_DIR="${2:?Usage: build_tos_app.sh <APP_ID> <BUILD_DIR> [FRONTEND_DIR]}"
FRONTEND_DIR="${3:-}"

OUTPUT_DIR="${BUILD_DIR}/${APP_ID}/output"
MAKEAPP="/tmp/makeapp_x64_real"
TPK_OUTPUT="/tmp/dist/tmp"

echo "=== TOS App Build: ${APP_ID} ==="
echo "Build dir: ${BUILD_DIR}"
echo "Output dir: ${OUTPUT_DIR}"

# Validate
if [ ! -f "${MAKEAPP}" ]; then
    echo "ERROR: makeapp_x64_real not found at ${MAKEAPP}"
    echo "Download from TerraMaster app-pkg-tools and place at ${MAKEAPP}"
    exit 1
fi

if [ ! -d "${OUTPUT_DIR}" ]; then
    echo "ERROR: Output directory not found: ${OUTPUT_DIR}"
    echo "Expected structure: ${BUILD_DIR}/${APP_ID}/output/"
    exit 1
fi

# Step 1: Build frontend (if provided)
if [ -n "${FRONTEND_DIR}" ] && [ -d "${FRONTEND_DIR}" ]; then
    echo ""
    echo "[1/3] Building frontend from ${FRONTEND_DIR}..."
    cd "${FRONTEND_DIR}"
    npm install
    npm run build

    # Copy dist to webui directory
    echo "Copying frontend dist to ${OUTPUT_DIR}/webui/..."
    rm -rf "${OUTPUT_DIR}/webui"
    mkdir -p "${OUTPUT_DIR}/webui"
    cp -r dist/* "${OUTPUT_DIR}/webui/"
else
    echo ""
    echo "[1/3] No frontend directory provided, skipping frontend build."
    if [ ! -d "${OUTPUT_DIR}/webui" ] || [ ! -f "${OUTPUT_DIR}/webui/index.html" ]; then
        echo "WARNING: webui/ directory missing or has no index.html!"
    fi
fi

# Step 2: Prepare lang directory structure for makeapp
echo ""
echo "[2/3] Preparing lang directory..."
if [ -d "${OUTPUT_DIR}/lang_tar" ] && [ ! -d "${OUTPUT_DIR}/lang" ]; then
    # makeapp expects lang/ directory, not lang_tar/
    cp -r "${OUTPUT_DIR}/lang_tar" "${OUTPUT_DIR}/lang"
fi

# Clean up any stale generated files
rm -f "${OUTPUT_DIR}/webui.bz2"
rm -f "${OUTPUT_DIR}/lang.bz2"
rm -f "${OUTPUT_DIR}/INFO"

# Step 3: Run makeapp_x64_real
echo ""
echo "[3/3] Running makeapp_x64_real..."
cd /tmp
"${MAKEAPP}" -path "${BUILD_DIR}"

# Find and report output
echo ""
echo "=== Build Complete ==="
if [ -d "${TPK_OUTPUT}" ]; then
    TPK_FILE=$(find "${TPK_OUTPUT}" -name "*.tpk" -type f 2>/dev/null | head -1)
    if [ -n "${TPK_FILE}" ]; then
        TPK_SIZE=$(du -h "${TPK_FILE}" | cut -f1)
        echo "TPK file: ${TPK_FILE} (${TPK_SIZE})"
        echo ""
        echo "To install: Upload via TOS App Center → Manual Install"
    else
        echo "WARNING: No .tpk file found in ${TPK_OUTPUT}"
        ls -la "${TPK_OUTPUT}/"
    fi
else
    echo "WARNING: Output directory ${TPK_OUTPUT} not found"
fi
