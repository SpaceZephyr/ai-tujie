// 封面：个人 IP 形象 + 大字标题 + 和内容相关的手绘装饰。改顶部 C 里的内容，然后 node <skill>/scripts/cover/shot.mjs <项目>
// 规矩：标题用图组第 1 页的原标题；缩到 300px 宽还要能读清；只用系列橙强调；IP 放右下角手绘圆圈里
import { writeFileSync, existsSync } from "node:fs";
import { R, ICON, phone, BLUE, INK } from "../engine/lib.mjs";
const C = {
  tag: "AI 原理图解 __NUM__",           // 手写体小标签（init.sh 自动填编号）
  big: ["Skill", ""],                  // 第一行：[橙色大号部分, 黑色部分]，用图组第 1 页标题拆
  line2: "怎么运行？",                  // 第二行
  bubble: "只露一行描述，<br>用到才展开", // IP 旁边的对话气泡（≤14 字，用第 1 页副标题）
  name: "空格",
  // 手绘装饰图标：bulb sketch crop globe code doc pen image clock cloud folder lock hand，[名字, x, y]
  icons: [["folder", 150, 900], ["doc", 320, 1010], ["code", 130, 1110], ["lock", 280, 1210], ["clock", 130, 1320], ["bulb", 420, 1300]],
  numbered: false,
  card: ["SKILL.md", "name: pdf", "description: …"],  // 中间的小卡片：[标题, 橙色行1, 橙色行2]，换成本期的关键对象
};
const ip = existsSync(new URL("./ip.png", import.meta.url)) ? "ip.png" : "ip-default.png";
const svg = inner => `<svg viewBox="0 0 1080 1440" width="1080" height="1440" style="position:absolute;left:0;top:0">${inner}</svg>`;
const nums = C.numbered ? C.icons.map(([k, x, y], i) => `<div style="position:absolute;left:${x + 34}px;top:${y - 66}px;width:36px;height:36px;border-radius:50%;background:${BLUE};color:#fff;display:grid;place-items:center;font:600 20px 'PingFang SC'">${i + 1}</div>`).join("") : "";
const html = `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="../engine/style.css"><style>body{background:#FBFAF7}.t{position:absolute;left:84px;font-weight:800;color:${INK};letter-spacing:2px;line-height:1}</style></head><body>
${svg((C.tag ? R.ell(340, 168, 600, 130, { color: BLUE, w: 5 }) : "") + R.line(88, 690, 700, 680, { color: BLUE, w: 9 }) + C.icons.map(([k, x, y]) => ICON[k](x, y, 78)).join("") +
  R.ell(860, 1160, 420, 420, { color: BLUE, w: 5 }) +
  R.curve([[650, 830], [690, 765], [830, 745], [990, 765], [1035, 830], [990, 895], [830, 912], [740, 905], [690, 960], [705, 900], [665, 885], [650, 830]], { w: 3.5 }))}
<div class="hand" style="position:absolute;left:96px;top:128px;font-size:72px;color:${BLUE}">${C.tag}</div>
<div class="t" style="top:250px;font-size:200px"><span style="color:${BLUE};font-size:260px">${C.big[0]}</span>${C.big[1]}</div>
<div class="t" style="top:520px;font-size:140px">${C.line2}</div>
<div class="hand" style="position:absolute;left:690px;top:782px;font-size:38px;line-height:1.3">${C.bubble}</div>
<div style="position:absolute;left:660px;top:960px;width:400px;height:400px;border-radius:50%;overflow:hidden;background:#fff"><img src="${ip}" style="width:400px;height:400px;display:block"></div>
<div class="hand" style="position:absolute;left:900px;top:1370px;font-size:44px">${C.name}</div>
${nums}
<div style="position:absolute;left:440px;top:800px;transform:rotate(-5deg);width:200px;background:#fff;border-radius:14px;box-shadow:0 14px 30px rgba(30,30,40,.14),0 0 0 1.5px #e6e3dc;padding:14px 16px;font:13px/1.6 'SF Mono',Menlo,monospace"><b style="font-size:16px">${C.card[0]}</b><div style="color:${BLUE}">${C.card[1]}</div><div style="color:${BLUE}">${C.card[2]}</div><div style="height:8px;background:#eeece7;border-radius:3px;margin-top:8px"></div><div style="height:8px;width:70%;background:#eeece7;border-radius:3px;margin-top:6px"></div></div>
</body></html>`;
writeFileSync(new URL("./cover.html", import.meta.url), html);
