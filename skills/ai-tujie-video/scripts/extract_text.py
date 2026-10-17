# 把图组 HTML 每一页的文字抽出来，按页输出 markdown（写口播稿用）
# 用法：python3 extract_text.py <图组.html>
import re, sys, html
s = open(sys.argv[1], encoding="utf-8").read()
s = re.sub(r"<(style|script)[^>]*>.*?</\1>", "", s, flags=re.S)
pages = re.split(r'<section class="page"', s)[1:]
for i, p in enumerate(pages, 1):
    t = html.unescape(re.sub(r"<[^>]+>", " ", "<x" + p))
    lines = [re.sub(r"\s+", " ", l).strip() for l in t.split("\n")]
    print(f"## 第 {i} 页（assets/src/{i:02d}.png）\n")
    print("\n".join(l for l in lines if l) + "\n")
