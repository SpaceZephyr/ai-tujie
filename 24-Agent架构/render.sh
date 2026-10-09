#!/bin/bash
# 把图组 HTML 的每一页导出成 PNG（1080×1440 CSS 像素，2x 即 2160×2880，比例 3:4）
# 用法：render.sh <图组.html> [页数]
#   页数不填时，自动数 <section class="page"> 的个数
#   输出 01.png、02.png… 到 HTML 所在目录
set -e
HTML_IN="$1"
[ -z "$HTML_IN" ] && { echo "用法：render.sh <图组.html> [页数]"; exit 1; }
DIR="$(cd "$(dirname "$HTML_IN")" && pwd)"
HTML="$DIR/$(basename "$HTML_IN")"
N="$2"
[ -z "$N" ] && N=$(grep -o '<section class="page"' "$HTML" | wc -l | tr -d ' ')

# 找 Chrome / Chromium
CHROME="${CHROME:-}"
for c in "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
         "/Applications/Chromium.app/Contents/MacOS/Chromium" \
         "$(command -v google-chrome 2>/dev/null)" "$(command -v chromium 2>/dev/null)" "$(command -v chromium-browser 2>/dev/null)"; do
  [ -z "$CHROME" ] && [ -n "$c" ] && [ -x "$c" ] && CHROME="$c"
done
[ -z "$CHROME" ] && { echo "找不到 Chrome，设置环境变量 CHROME=/path/to/chrome"; exit 1; }

for i in $(seq 1 "$N"); do
  out=$(printf "%02d.png" "$i")
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=2 \
    --window-size=1080,1440 --virtual-time-budget=1500 \
    --screenshot="$DIR/$out" "file://$HTML?only=$i" >/dev/null 2>&1
  echo "$DIR/$out"
done
