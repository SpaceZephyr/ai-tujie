#!/bin/bash
# 从一套图组建视频项目：bash scripts/init.sh <图组目录> <项目目录>
#   例：bash scripts/init.sh ~/ai-tujie/16-Skill运行原理 ~/Videos/16-Skill运行原理
# 会做：拷引擎、链 node_modules、拷 7 张原图到 assets/src/、抽出图组文字到 source.md、放封面模板、写默认 config.json
set -e
S="$(cd "$(dirname "$0")" && pwd)"; SRC="$(cd "$1" && pwd)"; P="$2"
[ -z "$P" ] && { echo "用法: bash init.sh <图组目录> <项目目录>"; exit 1; }
[ -d "$S/node_modules" ] || (cd "$S" && npm i --silent)
mkdir -p "$P"/{engine,cover,voice_raw,voice,voice_fast,out,assets/src}
cp "$S"/engine/{lib.mjs,runtime.js,style.css} "$P/engine/"
ln -sfn "$S/node_modules" "$P/node_modules"
cp "$SRC"/*.png "$P/assets/src/" 2>/dev/null || true
HTML=$(ls "$SRC"/*.html | head -1)
python3 "$S/extract_text.py" "$HTML" > "$P/source.md"
NUM=$(basename "$SRC" | grep -oE '^[0-9]+' || echo "")
sed "s/__NUM__/$NUM/" "$S/cover/cover.template.mjs" > "$P/cover/cover.mjs"
cp "$S/../assets/ip.png" "$P/cover/ip-default.png"
[ -f "$P/config.json" ] || cat > "$P/config.json" <<EOT
{ "W": 1080, "H": 1440, "speed": 1.0, "lead": 0.15, "tail": 0.2,
  "voice": "zh-CN-YunyangNeural", "rate": "+15%", "bgmLUFS": -32 }
EOT
[ -f "$P/lines.json" ] || echo '[]' > "$P/lines.json"
[ -f "$P/scenes.mjs" ] || cat > "$P/scenes.mjs" <<'EOT'
// 每一句旁白对应一场画面。写法见 references/scene-patterns.md，完整例子见 examples/16-Skill运行原理/scenes.mjs
import { A, R, ICON, sk, hand, box, shot, BLUE, INK } from "./engine/lib.mjs";
const OR = BLUE, IMG = i => `assets/src/0${i}.png`;   // BLUE 已是系列橙 #EE6A1F
const head = (c, n, label, title) =>
  `<div ${A({ at: c.t(0.05), fx: "wipe", d: .6, cls: "tag" })}>${n ? `<b>${n}</b>` : ""}${label}</div>` +
  `<div ${A({ at: c.t(0.15), fx: "up" })}><div class="title">${title}</div></div>`;
export const SCENES = [];
EOT
echo "项目已建好：${P}（图组文字见 source.md，原图在 assets/src/）"
