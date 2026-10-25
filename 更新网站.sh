#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
if ! python3 -c 'import mistune, bs4, pygments' 2>/dev/null; then
  echo '缺少依赖，安装 requirements.txt ...'
  python3 -m pip install -r requirements.txt
fi
python3 build.py
printf '\n构建完成：打开 index.html\n'
