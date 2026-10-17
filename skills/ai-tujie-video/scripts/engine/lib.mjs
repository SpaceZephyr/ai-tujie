// 手绘线稿（rough.js 生成路径）+ 动画属性 + 真实界面组件
import rough from "roughjs/bundled/rough.esm.js";

export const INK = "#1f1f22", BLUE = "#EE6A1F", GRAY = "#9a9aa0";
const gen = rough.generator();
let seed = 7;

// 动画属性：at 绝对秒；fx = draw|fade|up|pop|wipe|type|none；out 绝对秒（淡出）；kf 关键帧 [[t,{x,y,s,r,o}]]
export function A({ at = 0, fx = "up", d, out, kf, cls = "" } = {}) {
  let s = `class="a ${cls}" data-at="${(+at).toFixed(3)}" data-fx="${fx}"`;
  if (d != null) s += ` data-d="${d}"`;
  if (out != null) s += ` data-out="${(+out).toFixed(3)}"`;
  if (kf) s += ` data-kf='${JSON.stringify(kf.map(([t, v]) => [+t.toFixed(3), v]))}'`;
  return s;
}

const paths = (dr, color, w) => gen.toPaths(dr).map(p =>
  `<path pathLength="1" d="${p.d}" stroke="${p.stroke === "none" ? "none" : color}" stroke-width="${w}" fill="${p.fill && p.fill !== "none" ? p.fill : "none"}" ${p.fill && p.fill !== "none" ? 'class="fillp"' : ""}/>`).join("");

const o = (x = {}) => ({ roughness: 1.3, bowing: 1.2, seed: seed++, strokeWidth: 3, ...x });

// 线稿形状（返回 path 串，可拼接后用 sk() 包起来）
export const R = {
  rect: (x, y, w, h, opt = {}) => paths(gen.rectangle(x, y, w, h, o(opt)), opt.color || INK, opt.w || 3),
  fillRect: (x, y, w, h, color = BLUE, opt = {}) => paths(gen.rectangle(x, y, w, h, o({ fill: color, fillStyle: "solid", stroke: "none", ...opt })), color, 0),
  ell: (cx, cy, w, h, opt = {}) => paths(gen.ellipse(cx, cy, w, h, o({ roughness: 1.6, ...opt })), opt.color || INK, opt.w || 3),
  fillEll: (cx, cy, w, h, color = BLUE) => paths(gen.ellipse(cx, cy, w, h, o({ fill: color, fillStyle: "solid", stroke: "none" })), color, 0),
  line: (x1, y1, x2, y2, opt = {}) => paths(gen.line(x1, y1, x2, y2, o(opt)), opt.color || INK, opt.w || 3),
  curve: (pts, opt = {}) => paths(gen.curve(pts, o({ roughness: 0.9, ...opt })), opt.color || INK, opt.w || 3),
  poly: (pts, opt = {}) => paths(gen.linearPath(pts, o(opt)), opt.color || INK, opt.w || 3),
  // 弯曲箭头：pts 至少 2 个点，箭头画在最后一段
  arrow: (pts, opt = {}) => {
    const c = opt.color || INK, w = opt.w || 3;
    const body = pts.length > 2 ? gen.curve(pts, o({ roughness: 0.8, ...opt })) : gen.line(...pts[0], ...pts[1], o({ roughness: 0.8, ...opt }));
    const [a, b] = [pts[pts.length - 2], pts[pts.length - 1]];
    const ang = Math.atan2(b[1] - a[1], b[0] - a[0]), L = opt.head || 22;
    const h1 = [b[0] - L * Math.cos(ang - 0.45), b[1] - L * Math.sin(ang - 0.45)];
    const h2 = [b[0] - L * Math.cos(ang + 0.45), b[1] - L * Math.sin(ang + 0.45)];
    return paths(body, c, w) + paths(gen.linearPath([h1, b, h2], o({ roughness: 0.6 })), c, w);
  },
  check: (x, y, s = 1, opt = {}) => paths(gen.linearPath([[x, y], [x + 12 * s, y + 13 * s], [x + 34 * s, y - 16 * s]], o({ roughness: 0.6, ...opt })), opt.color || BLUE, opt.w || 5),
  cross: (x, y, s = 40, opt = {}) => paths(gen.line(x - s, y - s, x + s, y + s, o(opt)), opt.color || INK, opt.w || 4) + paths(gen.line(x + s, y - s, x - s, y + s, o(opt)), opt.color || INK, opt.w || 4),
};

// 线稿图标（以 cx,cy 为中心，约 s 大小）
export const ICON = {
  bulb: (cx, cy, s = 80, c = INK) => R.ell(cx, cy - s * .12, s * .72, s * .72, { color: c }) + R.line(cx - s * .16, cy + s * .3, cx + s * .16, cy + s * .3, { color: c }) + R.line(cx - s * .12, cy + s * .42, cx + s * .12, cy + s * .42, { color: c }) + R.line(cx - s * .08, cy + s * .2, cx - s * .08, cy + s * .08, { color: c, w: 2.5 }) + R.line(cx + s * .08, cy + s * .2, cx + s * .08, cy + s * .08, { color: c, w: 2.5 }),
  sketch: (cx, cy, s = 80, c = INK) => R.rect(cx - s * .45, cy - s * .4, s * .9, s * .8, { color: c }) + R.rect(cx - s * .32, cy - s * .27, s * .64, s * .16, { color: c, w: 2.5 }) + R.rect(cx - s * .32, cy - s * .02, s * .28, s * .28, { color: c, w: 2.5 }) + R.line(cx + .04 * s, cy + .02 * s, cx + s * .32, cy + .02 * s, { color: c, w: 2.5 }) + R.line(cx + .04 * s, cy + .16 * s, cx + s * .26, cy + .16 * s, { color: c, w: 2.5 }),
  crop: (cx, cy, s = 80, c = INK) => R.poly([[cx - s * .3, cy - s * .48], [cx - s * .3, cy + s * .3], [cx + s * .48, cy + s * .3]], { color: c }) + R.poly([[cx - s * .48, cy - s * .3], [cx + s * .3, cy - s * .3], [cx + s * .3, cy + s * .48]], { color: c }),
  globe: (cx, cy, s = 80, c = INK) => R.ell(cx, cy, s * .86, s * .86, { color: c }) + R.ell(cx, cy, s * .38, s * .86, { color: c, w: 2.5 }) + R.line(cx - s * .43, cy, cx + s * .43, cy, { color: c, w: 2.5 }),
  code: (cx, cy, s = 80, c = INK) => R.poly([[cx - s * .18, cy - s * .28], [cx - s * .44, cy], [cx - s * .18, cy + s * .28]], { color: c }) + R.poly([[cx + s * .18, cy - s * .28], [cx + s * .44, cy], [cx + s * .18, cy + s * .28]], { color: c }) + R.line(cx + s * .08, cy - s * .36, cx - s * .08, cy + s * .36, { color: c }),
  doc: (cx, cy, s = 80, c = INK) => R.poly([[cx - s * .34, cy - s * .44], [cx + s * .14, cy - s * .44], [cx + s * .34, cy - s * .24], [cx + s * .34, cy + s * .44], [cx - s * .34, cy + s * .44], [cx - s * .34, cy - s * .44]], { color: c }) + R.line(cx - s * .2, cy - s * .08, cx + s * .2, cy - s * .08, { color: c, w: 2.5 }) + R.line(cx - s * .2, cy + s * .08, cx + s * .2, cy + s * .08, { color: c, w: 2.5 }) + R.line(cx - s * .2, cy + s * .24, cx + s * .08, cy + s * .24, { color: c, w: 2.5 }),
  pen: (cx, cy, s = 80, c = INK) => R.poly([[cx, cy - s * .46], [cx + s * .3, cy + s * .02], [cx + s * .14, cy + s * .34], [cx - s * .14, cy + s * .34], [cx - s * .3, cy + s * .02], [cx, cy - s * .46]], { color: c }) + R.line(cx, cy - s * .46, cx, cy + s * .02, { color: c, w: 2.5 }) + R.ell(cx, cy + s * .06, s * .1, s * .1, { color: c, w: 2.5 }) + R.line(cx - s * .16, cy + s * .46, cx + s * .16, cy + s * .46, { color: c }),
  image: (cx, cy, s = 80, c = INK) => R.rect(cx - s * .44, cy - s * .36, s * .88, s * .72, { color: c }) + R.poly([[cx - s * .38, cy + s * .26], [cx - s * .1, cy - s * .04], [cx + s * .06, cy + s * .12], [cx + s * .18, cy + s * .02], [cx + s * .38, cy + s * .26]], { color: c, w: 2.5 }) + R.ell(cx + s * .2, cy - s * .16, s * .14, s * .14, { color: c, w: 2.5 }),
  clock: (cx, cy, s = 80, c = INK) => R.ell(cx, cy, s, s, { color: c }) + R.line(cx, cy, cx, cy - s * .32, { color: c }) + R.line(cx, cy, cx + s * .22, cy + s * .08, { color: c }),
  cloud: (cx, cy, s = 160, c = INK) => R.curve([[cx - s * .4, cy + s * .2], [cx - s * .5, cy], [cx - s * .32, cy - s * .16], [cx - s * .14, cy - s * .3], [cx + s * .1, cy - s * .26], [cx + s * .3, cy - s * .12], [cx + s * .5, cy + s * .02], [cx + s * .4, cy + s * .2], [cx - s * .4, cy + s * .2]], { color: c }),
  folder: (cx, cy, s = 100, c = INK) => R.poly([[cx - s * .5, cy - s * .3], [cx - s * .14, cy - s * .3], [cx - s * .04, cy - s * .2], [cx + s * .5, cy - s * .2], [cx + s * .5, cy + s * .34], [cx - s * .5, cy + s * .34], [cx - s * .5, cy - s * .3]], { color: c }),
  lock: (cx, cy, s = 60, c = INK) => R.rect(cx - s * .36, cy - s * .06, s * .72, s * .54, { color: c }) + R.curve([[cx - s * .22, cy - s * .06], [cx - s * .22, cy - s * .34], [cx, cy - s * .46], [cx + s * .22, cy - s * .34], [cx + s * .22, cy - s * .06]], { color: c }),
  hand: (cx, cy, s = 60, c = INK) => R.curve([[cx - s * .3, cy + s * .4], [cx - s * .32, cy], [cx - s * .2, cy - s * .1], [cx - s * .1, cy - s * .42], [cx, cy - s * .44], [cx + s * .04, cy - s * .12], [cx + s * .3, cy - s * .06], [cx + s * .32, cy + s * .2], [cx + s * .2, cy + s * .42]], { color: c }),
};

// 一层线稿：整块舞台大小的 svg，按 path 顺序画出
export const sk = (inner, a) => `<svg ${a} viewBox="0 0 1080 960" width="1080" height="960" style="position:absolute;left:0;top:0;overflow:visible">${inner}</svg>`;
// 手写字
export const hand = (x, y, text, a, st = "") => `<div ${a} style="position:absolute;left:${x}px;top:${y}px;${st}"><span class="hand">${text}</span></div>`;
// 绝对定位盒子
export const box = (x, y, w, h, inner, a, st = "") => `<div ${a} style="position:absolute;left:${x}px;top:${y}px;width:${w}px;${h ? `height:${h}px;` : ""}${st}">${inner}</div>`;

// ---- 真实界面组件 ----
export const phone = (inner, st = "") => `<div class="phone" style="${st}"><div class="ph-sb"><span>9:41</span><i></i></div><div class="ph-in">${inner}</div></div>`;
export const browser = (url, inner, st = "", urlA = "") => `<div class="win" style="${st}"><div class="win-bar"><i></i><i></i><i></i><div class="win-url" ${urlA}>${url}</div></div><div class="win-in">${inner}</div></div>`;
export const cursor = (a) => `<svg ${a} width="40" height="40" viewBox="0 0 24 24" style="position:absolute;left:0;top:0"><path d="M4 2 L4 19 L8.5 15 L11.5 21.5 L14 20.5 L11 14 L17 14 Z" fill="#111" stroke="#fff" stroke-width="1.4" stroke-linejoin="round"/></svg>`;
export const tap = (x, y, at) => `<div ${A({ at, fx: "ripple", d: 0.6 })} style="position:absolute;left:${x - 40}px;top:${y - 40}px;width:80px;height:80px;border-radius:50%;border:4px solid ${BLUE}"></div>`;

// ---- 素材：文章配图、产品图标 ----
// 截图卡片：把文章里的截图放成带阴影的圆角卡片；fit=cover 时按 pos 裁（默认顶部）
export const shot = (src, w, h, { fit = "cover", pos = "top", st = "" } = {}) => `<div style="width:${w}px;${h ? `height:${h}px;` : ""}border-radius:16px;overflow:hidden;background:#fff;box-shadow:0 18px 44px rgba(30,30,40,.16),0 0 0 1.5px #e6e3dc;${st}"><img src="${src}" style="width:100%;${h ? `height:100%;object-fit:${fit};object-position:${pos};` : ""}display:block"></div>`;
// 产品图标：白色圆角方块，clip 用圆形遮罩去掉裁图碎片，badge 是右下角公司小图标
export const appIcon = (src, s = 120, { clip = false, badge } = {}) => `<div style="position:relative;width:${s}px;height:${s}px;border-radius:${s * .26}px;background:#fff;box-shadow:0 10px 26px rgba(30,30,40,.14),0 0 0 1.5px #ece9e2;display:grid;place-items:center"><img src="${src}" style="width:${s * .72}px;height:${s * .72}px;object-fit:contain;${clip ? "clip-path:circle(47% at 50% 50%);" : ""}">${badge ? `<img src="${badge}" style="position:absolute;right:-${s * .08}px;bottom:-${s * .08}px;width:${s * .34}px;height:${s * .34}px;border-radius:${s * .1}px;background:#fff;box-shadow:0 0 0 2px #fff,0 3px 8px rgba(0,0,0,.18)">` : ""}</div>`;
