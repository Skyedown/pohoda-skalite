#!/bin/sh
#
# Vite inlines VITE_* at build time, which would mean a rebuild for every
# config change. Instead the image ships config-less and this script — picked
# up by nginx's /docker-entrypoint.d/ hook — writes the values from the
# container's environment before nginx starts. One image, any .env.
#
# src/config.ts reads window.__APP_CONFIG__ and falls back to its own defaults
# for anything left empty here.

set -eu

CONFIG_FILE=/usr/share/nginx/html/config.js

# Values are plain strings (ids, times, an email, a password); escape the two
# characters that would otherwise break out of the JS string literal.
esc() {
  printf '%s' "${1:-}" | sed -e 's/\\/\\\\/g' -e 's/"/\\"/g'
}

cat >"$CONFIG_FILE" <<EOF
window.__APP_CONFIG__ = {
  apiUrl: "$(esc "${VITE_API_URL:-}")",
  restaurantEmail: "$(esc "${VITE_RESTAURANT_EMAIL:-}")",
  restaurantPhone: "$(esc "${VITE_RESTAURANT_PHONE:-}")",
  preorderStartTime: "$(esc "${VITE_PREORDER_START_TIME:-}")",
  openingTime: "$(esc "${VITE_OPENING_TIME:-}")",
  lastOrderTime: "$(esc "${VITE_LAST_ORDER_TIME:-}")",
  closingTime: "$(esc "${VITE_CLOSING_TIME:-}")",
  companyIco: "$(esc "${VITE_COMPANY_ICO:-}")",
  companyDic: "$(esc "${VITE_COMPANY_DIC:-}")",
  companyIcDph: "$(esc "${VITE_COMPANY_IC_DPH:-}")",
  gaIdSk: "$(esc "${VITE_GA_ID_SK:-}")",
  gaIdPl: "$(esc "${VITE_GA_ID_PL:-}")",
  metaPixelId: "$(esc "${VITE_META_PIXEL_ID:-}")"
};
EOF

echo "40-app-config.sh: wrote $CONFIG_FILE"
