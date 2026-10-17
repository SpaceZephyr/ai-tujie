#!/bin/bash
# 配音后处理：收紧停顿 → （有 Whisper 时）标点补停顿 + 逐字对齐 + 逐句对稿 → voice/、voice_fast/、align.json
# 用法：bash prepare.sh <项目> [句号...]
#   Whisper 环境：PY 指向装了 mlx-audio、pypinyin、numpy 的 Python（默认 ~/.cache/promo-tts/.venv/bin/python）
#   没有 Whisper 时直接拷贝，build.mjs 会按字数估算每个字的时间（动画会略有偏差）
set -e
V="$(cd "$(dirname "$0")" && pwd)"; P="$(cd "$1" && pwd)"; shift
PY="${PY:-$HOME/.cache/promo-tts/.venv/bin/python}"; [ -x "$PY" ] || PY=python3
"$PY" "$V/tighten.py" "$P" "$@"
if "$PY" -c "import mlx_audio, pypinyin" 2>/dev/null; then
  export HF_HUB_OFFLINE=1
  (cd "$V" && "$PY" repause.py "$P" "$@" && "$PY" finalize.py "$P" "$@")
else
  echo "没有 Whisper（mlx-audio），跳过对齐和对稿"; rm -f "$P/align.json"
  for f in "$P"/voice_raw/s*.wav; do cp "$f" "$P/voice/"; cp "$f" "$P/voice_fast/"; done
fi
