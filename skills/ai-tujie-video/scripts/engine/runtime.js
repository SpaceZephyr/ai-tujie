// 确定性动画：seek(t) 按 data-at/data-fx/data-kf 计算每个元素的状态
(function () {
  const clamp = v => v < 0 ? 0 : v > 1 ? 1 : v;
  const eo = p => 1 - Math.pow(1 - p, 3);
  const eio = p => p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
  const back = p => { const c = 1.6; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); };
  const D = { draw: 0.9, fade: 0.45, up: 0.55, pop: 0.5, wipe: 0.7, type: 1.2, ripple: 0.6, none: 0, count: 1.2 };
  let els, scenes, caps, capEl;
  function init() {
    els = [...document.querySelectorAll(".a")].map(el => {
      const o = { el, at: +el.dataset.at, fx: el.dataset.fx, out: el.dataset.out ? +el.dataset.out : null, kf: el.dataset.kf ? JSON.parse(el.dataset.kf) : null };
      o.d = el.dataset.d ? +el.dataset.d : D[o.fx] ?? .5;
      if (o.fx === "draw") o.paths = [...el.querySelectorAll("path")];
      if (o.fx === "type") { o.full = el.dataset.text; }
      if (o.fx === "count") { o.c = el.dataset.count.split(",").map(Number); }
      return o;
    });
    scenes = [...document.querySelectorAll(".scene")].map(el => ({ el, a: +el.dataset.start, b: +el.dataset.end }));
    caps = window.PV_CAPS; capEl = document.getElementById("cap");
  }
  function kfAt(kf, t) {
    if (t <= kf[0][0]) return kf[0][1];
    for (let i = 1; i < kf.length; i++) if (t < kf[i][0]) {
      const [t0, v0] = kf[i - 1], [t1, v1] = kf[i]; const p = eio((t - t0) / (t1 - t0)); const r = {};
      for (const k of new Set([...Object.keys(v0), ...Object.keys(v1)])) { const a = v0[k] ?? (k === "s" || k === "o" ? 1 : 0), b = v1[k] ?? (k === "s" || k === "o" ? 1 : 0); r[k] = a + (b - a) * p; }
      return r;
    }
    return kf[kf.length - 1][1];
  }
  window.seek = function (t) {
    if (!els) init();
    for (const s of scenes) {
      const vin = clamp((t - (s.a - .35)) / .35), vout = clamp(((s.b + .35) - t) / .35);
      const v = Math.min(vin, vout);
      s.el.style.display = v <= 0 ? "none" : "block";
      s.el.style.opacity = v;
      s.el.style.transform = `translateY(${(1 - vin) * 24 - (1 - vout) * 24}px)`;
    }
    for (const o of els) {
      const p = o.d ? clamp((t - o.at) / o.d) : (t >= o.at ? 1 : 0);
      let op = 1, x = 0, y = 0, s = 1, r = 0;
      switch (o.fx) {
        case "fade": op = eo(p); break;
        case "up": op = eo(p); y = (1 - eo(p)) * 36; break;
        case "pop": op = clamp(p * 3); s = p >= 1 ? 1 : .6 + .4 * back(p); break;
        case "wipe": op = p > 0 ? 1 : 0; o.el.style.clipPath = `inset(-20% ${(1 - eo(p)) * 100}% -20% -5%)`; break;
        case "ripple": op = p > 0 && p < 1 ? 1 - p : 0; s = .3 + p * 1.2; break;
        case "draw": {
          op = p > 0 ? 1 : 0; const n = o.paths.length;
          o.paths.forEach((pa, i) => {
            const q = clamp(p * n - i);
            if (pa.classList.contains("fillp")) pa.style.opacity = q;
            else { pa.style.strokeDasharray = "1 1"; pa.style.strokeDashoffset = 1 - q; }
          });
          break;
        }
        case "type": { const n = Math.round(o.full.length * p); o.el.textContent = o.full.slice(0, n); op = 1; break; }
        case "count": { const v = o.c[0] + (o.c[1] - o.c[0]) * eo(p); o.el.textContent = Math.round(v); op = 1; break; }
        case "none": op = p >= 1 ? 1 : 0; break;
      }
      if (o.out != null) op *= 1 - clamp((t - o.out) / .35);
      if (o.kf) { const k = kfAt(o.kf, t); x += k.x || 0; y += k.y || 0; s *= k.s ?? 1; r += k.r || 0; op *= k.o ?? 1; }
      o.el.style.opacity = op;
      o.el.style.transform = (x || y || s !== 1 || r) ? `translate(${x}px,${y}px) scale(${s}) rotate(${r}deg)` : "";
    }
    const c = caps.find(c => t >= c.a && t < c.b);
    const txt = c ? c.text : "";
    if (capEl.textContent !== txt) capEl.textContent = txt;
  };
  window.addEventListener("load", () => { if (!window.__PV_RENDER__) { const t0 = performance.now(); (function f() { seek(((performance.now() - t0) / 1000) % PV_TIMELINE.duration); requestAnimationFrame(f); })(); } else seek(0); });
})();
