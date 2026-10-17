// Skill 怎么运行？——AI 原理图解 16。强调色沿用系列橙色（engine 里的 BLUE 已改成 #EE6A1F）
import { A, R, ICON, sk, hand, box, shot, BLUE, INK } from "./engine/lib.mjs";

const OR = BLUE, IMG = i => `assets/src/0${i}.png`;
const head = (c, n, label, title) =>
  `<div ${A({ at: c.t(0.05), fx: "wipe", d: .6, cls: "tag" })}>${n ? `<b>${n}</b>` : ""}${label}</div>` +
  `<div ${A({ at: c.t(0.15), fx: "up" })}><div class="title">${title}</div></div>`;

// 小部件
const card = (inner, st = "") => `<div class="u-card" style="border:1.5px solid #e6e3dc;box-shadow:0 14px 34px rgba(30,30,40,.10);${st}">${inner}</div>`;
const winTitle = (t, st = "") => `<div style="height:48px;display:flex;align-items:center;gap:8px;padding:0 18px;background:#F2F1EE;font-size:18px;color:#6b6b72;${st}"><i style="width:12px;height:12px;border-radius:50%;background:#d6d4cf"></i><i style="width:12px;height:12px;border-radius:50%;background:#d6d4cf"></i><i style="width:12px;height:12px;border-radius:50%;background:#d6d4cf;margin-right:10px"></i>${t}</div>`;
const nameCard = (n, d, st = "") => `<div class="row" style="gap:14px;padding:14px 20px;font-size:21px;line-height:1.4;${st}"><span class="mono" style="font-weight:600;white-space:nowrap">${n}</span><span class="u-muted" style="overflow:hidden;white-space:nowrap;text-overflow:ellipsis">${d}</span></div>`;
const ctxBox = (inner, st = "") => `<div style="border-radius:16px;border:3px dashed #d9d6cf;background:#fff;${st}"><div style="padding:14px 18px 8px;font-size:20px;font-weight:600;color:#6b6b72">上下文</div>${inner}</div>`;
const chip = (t, st = "") => `<div style="margin:8px 16px;padding:12px 16px;border-radius:10px;background:#f2f1ee;font-size:18px;${st}">${t}</div>`;
const SK = [["pdf-processing", "提取 PDF 里的文字和表格、填表、合并文件"], ["xlsx", "创建表格、分析数据、生成带图表的报告"], ["pptx", "做演示文稿、改幻灯片"]];

// ---------- 1 痛点 ----------
function s1(c) {
  const many = c.at("几十个"), ask = c.at("常有人问我"), ctx = c.at("上下文"), full = c.at("塞满");
  const names = ["pdf", "xlsx", "pptx", "docx", "周报", "封面图", "文章配图", "小红书", "公众号", "播客整理", "翻译", "做原型", "讲解视频", "读书笔记", "日报", "飞书文档", "地图动画", "思维导图", "数据分析", "代码审查"];
  return head(c, "", "Skill 怎么运行", "装几十个 Skill，<em>AI 会变慢吗？</em>") + `<div class="stage">
  ${names.map((n, i) => box(60 + (i % 4) * 245, 10 + Math.floor(i / 4) * 82, 225, 64, `<div style="height:64px;border-radius:12px;background:#fff;border:1.5px solid #e6e3dc;display:flex;align-items:center;gap:10px;padding:0 16px;font-size:21px"><i style="width:14px;height:14px;border-radius:4px;background:${i < 3 ? OR : "#d9d6cf"}"></i>${n}</div>`, A({ at: many - .3 + i * .06, fx: "pop" }))).join("")}
  ${hand(60, 440, "我装的技能，几十个", A({ at: many + 1.1, fx: "wipe", cls: "s" }))}
  <div ${A({ at: ask + .2, fx: "up", cls: "bubble ai" })} style="left:60px;top:520px;font-size:30px">装这么多，AI 不会变慢吗？</div>
  ${hand(60, 660, "上下文", A({ at: ctx - .2, fx: "wipe" }))}
  ${box(220, 664, 640, 44, "", A({ at: ctx - .2, fx: "fade" }), "border-radius:22px;background:#eeece7")}
  ${box(220, 664, 600, 44, "", A({ at: ctx, fx: "wipe", d: 1.4 }), `border-radius:22px;background:${OR}`)}
  ${hand(880, 640, "塞满？", A({ at: full, fx: "wipe", cls: "b l" }))}
  ${sk(R.arrow([[700, 800], [760, 760], [800, 720]], { color: OR }), A({ at: full + .2, fx: "draw", d: .4 }))}
  </div>`;
}

// ---------- 2 答案 ----------
function s2(c) {
  const no = c.at("其实不会"), one = c.at("只露一行描述"), open = c.at("用到才展开");
  return head(c, "", "答案", "只露一行描述，<em>用到才展开</em>") + `<div class="stage">
  ${box(50, 10, 420, null, shot(IMG(1), 420), A({ at: c.t(.3), fx: "up" }))}
  ${hand(80, 600, "原图 01：加载时序", A({ at: c.t(.8), fx: "wipe", cls: "s" }))}
  ${hand(530, 20, "其实不会", A({ at: no, fx: "wipe", cls: "l" }))}
  ${sk(R.check(800, 50, 1.2), A({ at: no + .5, fx: "draw", d: .4 }))}
  ${hand(530, 130, "平时：一行名片", A({ at: one - .2, fx: "wipe", cls: "s" }))}
  ${box(530, 180, 500, null, card(nameCard(...SK[0])), A({ at: one, fx: "up" }))}
  ${hand(530, 300, "用到时：整本展开", A({ at: open - .2, fx: "wipe", cls: "s" }))}
  ${box(530, 350, 500, 330, card(`<div style="padding:18px 22px;font-size:20px;line-height:1.75"><div class="mono" style="font-weight:600">SKILL.md</div><div class="u-muted">## 步骤</div><div>1. 读取文件，判断有没有表单</div><div>2. 提取文字和表格</div><div>3. 整理成摘要</div><div class="u-muted">## 注意</div><div>扫描件先做文字识别</div></div>`, "height:330px"), A({ at: open, fx: "up", d: .7 }))}
  ${sk(R.arrow([[780, 250], [810, 300], [780, 345]], { color: OR }), A({ at: open - .1, fx: "draw", d: .4 }))}
  ${box(50, 730, 980, 120, card(`<div style="height:120px;display:grid;place-items:center;font-size:32px;font-weight:600;white-space:nowrap"><div>装得再多，平时也只占<span style="color:${OR}">一行描述</span>。</div></div>`), A({ at: one + 1.2, fx: "up" }))}
  </div>`;
}

// ---------- 3 是什么 ----------
function s3(c) {
  const fd = c.at("一个文件夹"), m = c.at("方法"), its = ["按什么步骤", "用什么格式", "参考什么例子"];
  return head(c, "", "先认识一下", "Skill，是给 AI 的<em>操作手册</em>") + `<div class="stage">
  ${sk(ICON.folder(270, 300, 400), A({ at: fd - .2, fx: "draw", d: .8 }))}
  ${hand(195, 300, "Skill", A({ at: fd + .5, fx: "wipe", cls: "l" }))}
  ${hand(90, 500, "= 一本操作手册", A({ at: m, fx: "wipe", cls: "b l" }))}
  ${its.map((t, i) => sk(R.check(560, 140 + i * 130, 1.1), A({ at: c.at(t) - .1, fx: "draw", d: .35 })) + hand(620, 105 + i * 130, t, A({ at: c.at(t), fx: "wipe" }))).join("")}
  ${sk(R.rect(540, 60, 470, 400, { color: "#d9d6cf", w: 2 }), A({ at: c.at(its[0]) - .4, fx: "draw", d: .6 }))}
  ${box(60, 640, 960, 200, card(`<div class="row" style="height:200px;gap:28px;padding:0 36px"><div class="u-btn" style="width:150px;height:80px;font-size:28px">Agent</div><div style="font-size:30px;line-height:1.6">遇到这类任务，<br>就翻开这本手册，<b style="color:${OR}">照着做</b>。</div></div>`), A({ at: c.at(its[1]), fx: "up" }))}
  </div>`;
}

// ---------- 4 文件夹结构 ----------
function s4(c) {
  const md = c.at("SKILL.md"), must = c.at("唯一必需"), nd = c.at("名字和描述"), body = c.at("正文写步骤");
  const rows = [["pdf-processing/", "", 0, 0], ["SKILL.md", "必需", md, 1], ["references/", "参考资料", c.at("参考资料"), 1], ["scripts/", "脚本", c.at("脚本和"), 1], ["assets/", "模板", c.at("模板"), 1]];
  const k = s => `<span style="color:#C792EA">${s}</span>`, v = s => `<span style="color:#C3E88D">${s}</span>`, g = s => `<span style="color:#6B6F7B">${s}</span>`;
  return head(c, "", "先认识一下", "文件夹里，<em>SKILL.md</em> 必须有") + `<div class="stage">
  ${box(40, 10, 440, 470, card(winTitle("文件") + `<div style="height:20px"></div>`, "height:470px;overflow:hidden"), A({ at: c.t(.3), fx: "up" }))}
  ${rows.map(([n, note, t, ind], i) => box(64 + ind * 40, 80 + i * 76, 380, 60, `<div class="row mono" style="height:60px;gap:14px;font-size:24px">${n.endsWith("/") ? `<i style="width:26px;height:20px;border-radius:4px;border:2.5px solid ${INK}"></i>` : `<i style="width:20px;height:26px;border-radius:3px;border:2.5px solid ${OR}"></i>`}${n}<span style="font:22px 'Hannotate SC';color:#8b8b92">${note}</span></div>`, A({ at: t ? t - .2 : c.t(.5), fx: "up" }))).join("")}
  ${sk(R.ell(220, 192, 330, 84, { color: OR, w: 4 }), A({ at: must - .1, fx: "draw", d: .5 }))}
  ${hand(80, 520, "唯一必需的文件", A({ at: must, fx: "wipe", cls: "b" }))}
  ${box(520, 10, 520, 640, `<div style="height:640px;border-radius:16px;background:#1E1F24;overflow:hidden;box-shadow:0 24px 60px rgba(30,30,40,.18)"><div style="padding:14px 22px;color:#8a8d98;font:16px 'SF Mono',Menlo,monospace;border-bottom:1px solid #2c2e35">SKILL.md</div>
    <div style="padding:16px 22px;font:20px/1.8 'SF Mono',Menlo,monospace;color:#d7d9e0">
      <div ${A({ at: nd - .2, fx: "fade" })}>${g("---")}<br>${k("name")}: ${v("pdf-processing")}<br>${k("description")}: ${v("提取 PDF 里的<br>&nbsp;&nbsp;文字和表格、填表、<br>&nbsp;&nbsp;合并文件……")}<br>${g("---")}</div>
      <div ${A({ at: body - .1, fx: "fade" })} style="margin-top:12px"># PDF 处理<br>${g("## 步骤")}<br>1. 读取文件<br>2. 提取文字和表格<br>3. 整理成摘要</div>
    </div></div>`, A({ at: md + .3, fx: "up" }))}
  ${sk(R.rect(530, 70, 500, 200, { color: OR, w: 4 }), A({ at: nd + .3, fx: "draw", d: .5 }))}
  ${hand(560, 680, "开头：名字 + 描述", A({ at: nd + .4, fx: "wipe", cls: "b" }))}
  ${hand(560, 740, "正文：步骤", A({ at: body + .2, fx: "wipe" }))}
  ${hand(80, 600, "旁边放资料、脚本、模板", A({ at: c.at("参考资料"), fx: "wipe", cls: "s" }))}
  </div>`;
}

// ---------- 5 启动时 ----------
function s5(c) {
  const three = c.at("三步"), boot = c.at("启动时"), nd = c.at("名字和描述"), sys = c.at("系统提示"), hund = c.at("一百个");
  return head(c, "①", "启动时", "启动时，<em>只看一行描述</em>") + `<div class="stage">
  ${["① 启动时", "② 触发时", "③ 用到时"].map((t, i) => box(60 + i * 330, 0, 300, 72, `<div style="height:72px;border-radius:14px;display:grid;place-items:center;font-size:28px;font-weight:600;background:#fff;border:2px solid #e6e3dc;color:#8b8b92">${t}</div>`, A({ at: three + i * .25, fx: "pop" }))).join("")}
  ${box(60, 0, 300, 72, `<div style="height:72px;border-radius:14px;display:grid;place-items:center;font-size:28px;font-weight:600;background:${OR};color:#fff">① 启动时</div>`, A({ at: boot, fx: "fade" }))}
  ${box(60, 130, 960, 440, card(winTitle("系统提示 · 每次对话都带上") + `<div style="height:392px"></div>`, "height:440px;overflow:hidden"), A({ at: sys - .6, fx: "up" }))}
  ${SK.map((s, i) => box(70, 190 + i * 86, 940, 70, nameCard(...s, "background:#FBF3EC;border-radius:10px"), A({ at: nd + i * .35, fx: "up" }))).join("")}
  ${box(70, 450, 940, 60, `<div style="font-size:21px;color:#8b8b92;padding:14px 20px">…… 其余 Skill 同样各占一行</div>`, A({ at: nd + 1.2, fx: "fade" }))}
  ${sk(R.line(1030, 196, 1030, 440, { color: OR, w: 4 }), A({ at: hund - .4, fx: "draw", d: .4 }))}
  ${hand(560, 610, "≈ 100 Token / 个", A({ at: hund, fx: "wipe", cls: "b l" }))}
  ${sk(R.arrow([[860, 620], [960, 600], [1010, 470]], { color: OR }), A({ at: hund + .3, fx: "draw", d: .4 }))}
  ${box(60, 720, 960, 130, card(`<div class="row" style="height:130px;gap:24px;padding:0 32px;font-size:26px"><span style="width:56px;height:56px;border-radius:50%;background:#f2f1ee;display:grid;place-items:center;font-weight:600">!</span>正文、资料、脚本：还在文件夹里，<b>一个字没读</b></div>`), A({ at: c.ve - .6, fx: "up" }))}
  </div>`;
}

// ---------- 6 五十个 ----------
function s6(c) {
  const fifty = c.at("五十个"), k5 = c.at("五千"), body = c.at("正文"), none = c.at("一个字都没读"), nc = c.at("名片");
  return head(c, "①", "启动时", "装五十个，<em>也就五千 Token</em>") + `<div class="stage">
  ${Array.from({ length: 50 }, (_, i) => box(60 + (i % 10) * 97, 0 + Math.floor(i / 10) * 50, 84, 38, "", A({ at: fifty - .3 + i * .025, fx: "pop", d: .3 }), `border-radius:8px;background:${i % 7 === 0 ? OR : "#e9e6df"}`)).join("")}
  ${hand(60, 270, "上下文窗口", A({ at: k5 - .4, fx: "wipe", cls: "s" }))}
  ${box(60, 320, 960, 56, "", A({ at: k5 - .4, fx: "fade" }), "border-radius:12px;background:#eeece7")}
  ${box(60, 320, 48, 56, "", A({ at: k5, fx: "wipe", d: .5 }), `border-radius:12px 0 0 12px;background:${OR}`)}
  ${sk(R.arrow([[230, 440], [150, 420], [90, 385]], { color: OR }), A({ at: k5 + .3, fx: "draw", d: .4 }))}
  ${hand(250, 420, "≈ 5,000 Token，只占一小截", A({ at: k5 + .4, fx: "wipe", cls: "b" }))}
  ${["SKILL.md 正文", "参考资料", "脚本"].map((t, i) => box(60 + i * 330, 520, 300, 150, `<div style="height:150px;border-radius:14px;border:3px dashed #d4d1ca;display:grid;place-items:center;font-size:26px;color:#9a9aa0">${t}</div>`, A({ at: body + i * .3, fx: "up" }))).join("")}
  ${[0, 1, 2].map(i => sk(ICON.lock(330 + i * 330, 560, 50, OR), A({ at: none + i * .15, fx: "draw", d: .4 }))).join("")}
  ${hand(60, 690, "一个字都没读", A({ at: none + .2, fx: "wipe" }))}
  ${box(560, 760, 460, null, card(nameCard(...SK[0]), "border:2.5px solid " + OR), A({ at: nc - .8, fx: "pop" }))}
  ${hand(330, 774, "只露名片", A({ at: nc - .5, fx: "wipe", cls: "b", d: .5 }))}
  </div>`;
}

// ---------- 7 触发时 ----------
function s7(c) {
  const task = c.at("提出任务"), cmp = c.at("比对"), hit = c.at("对上了"), rd = c.at("正文读进来");
  const list = [...SK, ["weekly-report", "按固定格式写周报"]];
  return head(c, "②", "触发时", "对上描述，<em>才读正文</em>") + `<div class="stage">
  <div ${A({ at: task, fx: "up", cls: "bubble me" })} style="left:330px;top:0;font-size:28px">把这个 PDF 里的文字提出来，总结一下</div>
  ${hand(60, 20, "用户", A({ at: task, fx: "wipe", cls: "s" }))}
  ${box(60, 150, 600, 420, card(winTitle("Skill 描述") + list.map(s => nameCard(...s, "border-bottom:1px solid #f0efec;font-size:19px")).join(""), "height:420px;overflow:hidden"), A({ at: cmp - .8, fx: "up" }))}
  ${box(62, 200, 596, 70, "", A({ at: cmp, fx: "fade", out: hit + .1, kf: [[cmp, { y: 0 }], [cmp + .4, { y: 210 }], [cmp + .8, { y: 0 }], [hit - .1, { y: 0 }]] }), `background:rgba(238,106,31,.14);border-radius:6px`)}
  ${sk(R.rect(62, 200, 596, 70, { color: OR, w: 4 }), A({ at: hit, fx: "draw", d: .4 }))}
  ${sk(R.check(600, 240, 1), A({ at: hit + .2, fx: "draw", d: .3 }))}
  ${hand(60, 590, "对上了：pdf-processing", A({ at: hit + .3, fx: "wipe", cls: "b" }))}
  ${box(720, 150, 300, 600, ctxBox(chip("系统提示 · 名片", "color:#8b8b92") + `<div ${A({ at: rd + .4, fx: "up" })}>${chip(`<b>SKILL.md 正文</b><br><span style="font-size:15px;color:#8b8b92">这时候才开始占上下文</span>`, `background:#FBF3EC;border:2px solid ${OR}`)}</div>`, "height:600px"), A({ at: cmp - .6, fx: "up" }))}
  ${sk(R.arrow([[660, 235], [700, 260], [740, 300]], { color: OR }), A({ at: rd, fx: "draw", d: .4 }))}
  </div>`;
}

// ---------- 8 正文上限 ----------
function s8(c) {
  const k5 = c.at("五千"), split = c.at("拆到"), need = c.at("需要时");
  return head(c, "②", "触发时", "正文控制在 <em>5k Token</em> 以内") + `<div class="stage">
  ${box(60, 10, 560, 700, card(winTitle("SKILL.md") + `<div style="padding:22px 28px;font-size:22px;line-height:1.8">
    <div style="font-size:28px;font-weight:700"># PDF 处理</div><div class="u-muted">## 步骤</div><div>1. 读取文件，看有没有表单</div><div>2. 提取文字和表格</div><div>3. 整理成摘要</div><div class="u-muted">## 注意</div><div>扫描件先做文字识别</div>
    <div style="margin-top:14px">需要填表时，看 <b class="mono">FORMS.md</b></div><div>接口细节，看 <b class="mono">REFERENCE.md</b></div></div>`, "height:700px;overflow:hidden"), A({ at: c.t(.3), fx: "up" }))}
  ${sk(R.line(90, 600, 560, 600, { color: OR, w: 4 }) + R.line(90, 642, 560, 642, { color: OR, w: 4 }), A({ at: need, fx: "draw", d: .6 }))}
  ${hand(680, 20, "官方建议", A({ at: c.at("官方建议"), fx: "wipe", cls: "s" }))}
  ${box(680, 70, 340, 130, `<div style="font-size:72px;font-weight:700;color:${OR};line-height:130px">≤ 5k</div>`, A({ at: k5, fx: "pop" }))}
  ${hand(680, 200, "正文的 Token 上限", A({ at: k5 + .4, fx: "wipe" }))}
  ${["FORMS.md|表单说明", "REFERENCE.md|接口参考"].map((s, i) => { const [n, d] = s.split("|"); return box(700, 320 + i * 180, 320, 130, card(`<div style="padding:22px 24px"><div class="mono" style="font-size:24px;font-weight:600">${n}</div><div class="u-muted" style="font-size:20px;margin-top:6px">${d}</div></div>`), A({ at: split + .2 + i * .3, fx: "up" })); }).join("")}
  ${hand(700, 680, "长资料拆出去", A({ at: split + .8, fx: "wipe", cls: "b" }))}
  ${sk(R.arrow([[565, 600], [630, 520], [695, 385]], { color: OR }) + R.arrow([[565, 642], [640, 610], [695, 565]], { color: OR }), A({ at: need + .4, fx: "draw", d: .6 }))}
  </div>`;
}

// ---------- 9 用到时：附件 ----------
function s9(c) {
  const other = c.at("其他文件"), real = c.at("真用到了"), form = c.at("不用填表"), never = c.at("一直不读");
  const rows = [["SKILL.md", "已读", "触发时读进来", other], ["REFERENCE.md", "翻一下", "碰到不懂的接口才看", real], ["FORMS.md", "不读", "这次不用填表", form], ["scripts/fill_form.py", "只运行", "下一步讲", other + .6]];
  return head(c, "③", "用到时", "用到时，<em>才去读附件</em>") + `<div class="stage">
  ${hand(60, 0, "这次只要提取文字", A({ at: c.t(.4), fx: "wipe", cls: "s" }))}
  ${box(60, 60, 960, 560, card(`<div style="height:560px"></div>`), A({ at: c.t(.3), fx: "up" }))}
  ${rows.map(([n, st, d, t], i) => box(90, 90 + i * 128, 900, 110, `<div class="row" style="height:110px;gap:20px;border-bottom:${i < 3 ? "1px solid #f0efec" : "0"}"><span class="mono" style="font-size:26px;font-weight:600;width:340px">${n}</span><span style="font-size:22px;color:#8b8b92;flex:1">${d}</span></div>`, A({ at: t, fx: "up" }))).join("")}
  ${box(820, 118, 150, 54, `<div style="height:54px;border-radius:27px;background:${OR};color:#fff;display:grid;place-items:center;font-size:22px;font-weight:600">已读</div>`, A({ at: other + .4, fx: "pop" }))}
  ${box(820, 246, 150, 54, `<div style="height:54px;border-radius:27px;border:2.5px solid ${OR};color:${OR};display:grid;place-items:center;font-size:22px;font-weight:600">翻一下</div>`, A({ at: real + .3, fx: "pop" }))}
  ${box(820, 374, 150, 54, `<div style="height:54px;border-radius:27px;background:#eeece7;color:#8b8b92;display:grid;place-items:center;font-size:22px;font-weight:600">不读</div>`, A({ at: form + .4, fx: "pop" }))}
  ${sk(R.line(100, 402, 780, 402, { w: 3, color: "#9a9aa0" }), A({ at: form + .3, fx: "draw", d: .5 }))}
  ${box(820, 502, 150, 54, `<div style="height:54px;border-radius:27px;background:#1f1f22;color:#fff;display:grid;place-items:center;font-size:22px;font-weight:600">只运行</div>`, A({ at: other + .9, fx: "pop" }))}
  ${hand(60, 680, "没用到的，一个 Token 都不花", A({ at: form, fx: "wipe", cls: "b l" }))}
  ${hand(60, 770, "表单说明那份，从头到尾没进过上下文", A({ at: never - .3, fx: "wipe", cls: "s", d: .5 }))}
  </div>`;
}

// ---------- 10 脚本 ----------
function s10(c) {
  const run = c.at("直接运行"), code = c.at("代码本身"), res = c.at("只有结果"), ok = c.at("校验通过"), err = c.at("报错");
  const k = s => `<span style="color:#C792EA">${s}</span>`, v = s => `<span style="color:#C3E88D">${s}</span>`, g = s => `<span style="color:#6B6F7B">${s}</span>`;
  const src = [g("# fill_form.py"), `${k("import")} sys, json`, `${k("from")} pypdf ${k("import")} PdfReader`, "", `${k("def")} check(fields):`, `  ${k("for")} f ${k("in")} REQUIRED:`, `    ${k("if")} f ${k("not in")} fields:`, `      ${k("raise")} ValueError(f)`, "", `${k("def")} fill(path, data):`, `  reader = PdfReader(path)`, `  ...`, `  print(${v('"校验通过"')})`];
  return head(c, "③", "用到时", "脚本只回传结果，<em>代码不进上下文</em>") + `<div class="stage">
  ${box(40, 10, 520, 560, `<div style="height:560px;border-radius:16px;background:#1E1F24;padding:22px 24px;font:19px/1.75 'SF Mono',Menlo,monospace;color:#d7d9e0;box-shadow:0 24px 60px rgba(30,30,40,.18)">${src.map(l => `<div>${l || "&nbsp;"}</div>`).join("")}</div>`, A({ at: c.t(.3), fx: "up" }))}
  ${sk(R.cross(300, 290, 120, { color: OR, w: 7 }), A({ at: code, fx: "draw", d: .5 }))}
  ${hand(80, 600, "代码本身：不进上下文", A({ at: code + .4, fx: "wipe", cls: "b" }))}
  ${box(600, 10, 440, 250, `<div style="height:250px;border-radius:16px;background:#111214;padding:20px 22px;font:19px/1.8 'SF Mono',Menlo,monospace;color:#d7d9e0">
    <div><span style="color:#8a8d98">$</span> <span ${A({ at: run, fx: "type", d: 1 })} data-text="python scripts/fill_form.py"></span></div>
    <div ${A({ at: ok, fx: "fade" })} style="color:#C3E88D">校验通过</div>
    <div ${A({ at: err, fx: "fade" })} style="color:#FF8A65">或：缺少字段 name</div></div>`, A({ at: run - .4, fx: "up" }))}
  ${box(600, 320, 440, 360, ctxBox(chip("系统提示 · 名片", "color:#8b8b92") + chip("SKILL.md 正文", "color:#8b8b92") + `<div ${A({ at: res + .3, fx: "up" })}>${chip(`<b>运行结果</b>：校验通过`, `background:#FBF3EC;border:2px solid ${OR}`)}</div>`, "height:360px"), A({ at: res - .5, fx: "up" }))}
  ${sk(R.arrow([[820, 265], [850, 300], [820, 340]], { color: OR }), A({ at: res, fx: "draw", d: .4 }))}
  ${hand(600, 720, "只进来一句结果", A({ at: res + .6, fx: "wipe", cls: "b" }))}
  ${hand(80, 720, "比现场写代码，又快又稳", A({ at: ok, fx: "wipe", cls: "s" }))}
  </div>`;
}

// ---------- 11 不占地方 + 安全 ----------
function s11(c) {
  const lots = c.at("很多资料"), zero = c.at("不占地方"), un = c.at("来路不明"), dont = c.at("别随便装");
  return head(c, "③", "用到时", "带再多也不占地方，<em>但别乱装</em>") + `<div class="stage">
  ${box(50, 10, 420, null, shot(IMG(5), 420), A({ at: c.t(.3), fx: "up" }))}
  ${sk(R.ell(260, 300, 440, 150, { color: OR, w: 4 }), A({ at: lots, fx: "draw", d: .6 }))}
  ${hand(60, 600, "原图 05", A({ at: c.t(.8), fx: "wipe", cls: "s" }))}
  ${hand(540, 20, "放着不用", A({ at: zero - .4, fx: "wipe" }))}
  ${box(540, 70, 480, 120, `<div style="font-size:84px;font-weight:700;line-height:120px"><span ${A({ at: zero, fx: "count" })} data-count="5000,0">5000</span> <span style="font-size:40px">Token</span></div>`, A({ at: zero - .2, fx: "fade" }))}
  ${sk(ICON.folder(640, 380, 170) , A({ at: un - .2, fx: "draw", d: .6 }))}
  ${hand(616, 340, "？", A({ at: un + .2, fx: "pop", cls: "b l" }))}
  ${hand(750, 360, "来路不明", A({ at: un, fx: "wipe" }))}
  ${sk(R.arrow([[640, 460], [640, 540]], { color: OR }), A({ at: dont - .3, fx: "draw", d: .4 }))}
  ${box(540, 560, 480, 160, card(`<div style="padding:24px 26px;font-size:26px;line-height:1.6">装之前，把里面的<br><b style="color:${OR}">文件和脚本都看一遍</b></div>`, `border:2.5px solid ${OR}`), A({ at: dont, fx: "up" }))}
  </div>`;
}

// ---------- 12 描述最关键 ----------
function s12(c) {
  const key = c.at("描述最关键"), only = c.at("只靠它"), bad = c.at("没写好"), lie = c.at("躺在");
  return head(c, "", "写的时候", "描述没写好，<em>Skill 就用不上</em>") + `<div class="stage">
  ${box(60, 20, 960, 130, card(`<div class="mono" style="padding:0 30px;height:130px;display:flex;align-items:center;font-size:24px;line-height:1.5"><span style="color:#C792EA;margin-right:12px">description:</span>提取 PDF 里的文字和表格、填表、合并文件……</div>`), A({ at: c.t(.3), fx: "up" }))}
  ${sk(R.rect(50, 10, 980, 150, { color: OR, w: 5 }), A({ at: key, fx: "draw", d: .5 }))}
  ${box(60, 330, 200, 90, `<div class="u-btn" style="height:90px;font-size:32px">Agent</div>`, A({ at: only - .3, fx: "pop" }))}
  ${sk(R.arrow([[160, 320], [200, 240], [260, 170]], { color: OR }), A({ at: only, fx: "draw", d: .4 }))}
  ${hand(300, 220, "只看这一行，决定用不用", A({ at: only + .3, fx: "wipe", cls: "b" }))}
  ${sk(R.cross(540, 85, 50, { color: "#9a9aa0", w: 5 }), A({ at: bad, fx: "draw", d: .4 }))}
  ${sk(ICON.folder(760, 640, 300), A({ at: lie - .5, fx: "draw", d: .7 }))}
  ${hand(870, 470, "z z z", A({ at: lie, fx: "wipe", cls: "s" }))}
  ${hand(600, 790, "一直躺在文件夹里", A({ at: lie + .3, fx: "wipe" }))}
  </div>`;
}

// ---------- 13 怎么写描述 ----------
function s13(c) {
  const only = c.at("只写"), short = c.at("太短了"), when = c.at("什么时候该用"), chance = c.at("机会");
  const seg = [["提取 PDF 里的文字和表格、", c.at("提取文字")], ["填表、", c.at("填表")], ["合并文件。", c.at("合并文件")], ["处理 PDF，或者用户提到 PDF、表单时使用", when]];
  return head(c, "", "写的时候", "能做什么、什么时候用，<em>都写上</em>") + `<div class="stage">
  ${box(60, 10, 960, 130, card(`<div class="row" style="height:130px;gap:24px;padding:0 30px"><span style="font:30px 'Hannotate SC';color:#8b8b92">写得太短</span><span style="font-size:32px;font-weight:600">处理 PDF</span></div>`), A({ at: only, fx: "up" }))}
  ${sk(R.cross(940, 75, 32, { color: OR, w: 6 }), A({ at: short, fx: "draw", d: .4 }))}
  ${box(60, 190, 960, 300, card(`<div style="padding:26px 30px"><div style="font:30px 'Hannotate SC';color:${OR};margin-bottom:12px">写得清楚</div><div style="font-size:30px;line-height:1.65;font-weight:500">${seg.map(([t, at]) => `<span ${A({ at: at - .2, fx: "fade" })}>${t}</span>`).join("")}</div></div>`, `height:300px;border:2.5px solid ${OR}`), A({ at: seg[0][1] - .5, fx: "up" }))}
  ${hand(80, 510, "能做什么", A({ at: seg[2][1] + .2, fx: "wipe", cls: "b" }))}
  ${hand(420, 510, "＋ 什么时候用", A({ at: when + .3, fx: "wipe", cls: "b" }))}
  ${hand(60, 620, "对上的机会", A({ at: chance - .3, fx: "wipe", cls: "s" }))}
  ${["太短", "写清楚"].map((t, i) => hand(60, 690 + i * 90, t, A({ at: chance + i * .3, fx: "fade" })) + box(260, 696 + i * 90, i ? 740 : 160, 48, "", A({ at: chance + i * .3, fx: "wipe", d: .8 }), `border-radius:24px;background:${i ? OR : "#d9d6cf"}`)).join("")}
  </div>`;
}

// ---------- 14 三样东西 ----------
function s14(c) {
  const cols = [["提示词", "这一次对话的要求<br>说完就过去了", "“这篇写短一点”", c.at("提示词"), ICON.doc], ["Skill", "一类任务的做法<br>存成文件，用到才加载", "“周报都按这个格式写”", c.at("一类任务"), ICON.folder], ["MCP", "接外部系统的统一接口<br>让 AI 够得着数据", "“查一下飞书文档”", c.at("MCP"), ICON.globe]];
  return head(c, "", "放在一起看", "提示词、Skill、MCP，<em>各管一段</em>") + `<div class="stage">
  ${cols.map(([t, d, e, at, ic], i) => box(60 + i * 330, 20, 300, 640, card(`<div style="padding:200px 24px 0;text-align:center"><div style="font-size:40px;font-weight:700;${i === 1 ? `color:${OR}` : ""}">${t}</div><div style="font-size:22px;line-height:1.6;color:#555;margin-top:18px">${d}</div><div style="font:26px 'Hannotate SC';color:#8b8b92;margin-top:40px">${e}</div></div>`, `height:640px;${i === 1 ? `border:2.5px solid ${OR}` : ""}`), A({ at: at - .2, fx: "up" })) + sk(ic(210 + i * 330, 130, i === 1 ? 130 : 110, i === 1 ? OR : INK), A({ at: at, fx: "draw", d: .6 }))).join("")}
  ${hand(60, 720, "管这一次", A({ at: cols[0][3] + .6, fx: "wipe", cls: "s" }))}
  ${hand(390, 720, "管一类事", A({ at: cols[1][3] + .6, fx: "wipe", cls: "b" }))}
  ${hand(720, 720, "管够不够得着", A({ at: c.at("外部系统"), fx: "wipe", cls: "s" }))}
  </div>`;
}

// ---------- 15 怎么判断 ----------
function s15(c) {
  const a = c.at("不会做"), b = c.at("够不着"), three = c.at("第三遍"), write = c.at("写成");
  const row = (y, q, ans, t1, t2, dark) => box(60, y, 380, 110, `<div style="height:110px;border-radius:16px;border:2.5px solid #e6e3dc;background:#fff;display:grid;place-items:center;font-size:36px;font-weight:600">${q}</div>`, A({ at: t1, fx: "up" })) +
    sk(R.arrow([[470, y + 55], [600, y + 55]], { color: OR, w: 4 }), A({ at: t2 - .3, fx: "draw", d: .3 })) +
    box(630, y, 380, 110, `<div style="height:110px;border-radius:16px;background:${dark ? INK : OR};color:#fff;display:grid;place-items:center;font-size:40px;font-weight:700">${ans}</div>`, A({ at: t2, fx: "pop" }));
  return head(c, "", "放在一起看", "不会做找 Skill，<em>够不着找 MCP</em>") + `<div class="stage">
  ${row(20, "AI 不会做", "Skill", a, c.at("是 Skill"))}
  ${row(170, "AI 够不着", "MCP", b, c.at("是 MCP"), 1)}
  ${hand(60, 360, "同一件事的做法，交代了几遍？", A({ at: three - .8, fx: "wipe", cls: "s" }))}
  ${["第 1 遍", "第 2 遍", "第 3 遍"].map((t, i) => `<div ${A({ at: three - .4 + i * .3, fx: "pop", cls: "bubble me" })} style="left:${60 + i * 200}px;top:${430 + i * 70}px;font-size:24px;${i === 2 ? `background:${OR}` : ""}">${t}</div>`).join("")}
  ${sk(R.arrow([[660, 600], [740, 560], [800, 500]], { color: OR }), A({ at: write - .2, fx: "draw", d: .4 }))}
  ${box(780, 380, 240, 180, card(`<div style="height:180px;display:grid;place-items:center;text-align:center"><div><div class="mono" style="font-size:26px;font-weight:600">SKILL.md</div><div style="font:28px 'Hannotate SC';color:${OR};margin-top:10px">写下来</div></div></div>`, `border:2.5px solid ${OR}`), A({ at: write - .4, fx: "up" }))}
  ${hand(60, 720, "说到第三遍，就该写成 Skill", A({ at: write - .2, fx: "wipe", cls: "b l", d: .5 }))}
  </div>`;
}

// ---------- 16 收尾 ----------
function s16(c) {
  const no = c.at("第十六篇"), seven = c.at("七张原图"), repo = c.at("开源仓库"), next = c.at("下一篇");
  return head(c, "", "AI 原理图解 16", "七张图，<em>都在开源仓库里</em>") + `<div class="stage">
  ${[1, 2, 3, 4, 5, 6, 7].map(i => box(50 + (i - 1) * 140, 30 + Math.abs(i - 4) * 18, 160, null, shot(IMG(i), 160), A({ at: seven - .3 + (i - 1) * .15, fx: "up", kf: [[0, { r: (i - 4) * 3 }]] }))).join("")}
  ${hand(60, 330, "AI 原理图解 · 第 16 篇", A({ at: no, fx: "wipe", cls: "s" }))}
  ${box(60, 420, 960, 130, card(`<div class="row" style="height:130px;gap:24px;padding:0 34px"><span style="font:30px 'Hannotate SC';color:#8b8b92">开源仓库</span><span class="mono" style="font-size:32px;font-weight:600">github.com/SpaceZephyr/<span style="color:${OR}">ai-tujie</span></span></div>`), A({ at: repo, fx: "up" }))}
  ${box(60, 600, 960, 150, card(`<div class="row" style="height:150px;gap:24px;padding:0 34px"><span style="font:30px 'Hannotate SC';color:${OR}">下一篇</span><span style="font-size:44px;font-weight:700">模型 API 怎么调？</span></div>`, `border:2.5px solid ${OR}`), A({ at: next, fx: "up" }))}
  </div>`;
}

export const SCENES = [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16];
