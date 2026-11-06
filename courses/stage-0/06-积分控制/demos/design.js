/* 第 6 课：观察积分累积、扰动补偿与执行器饱和。 */
(function () {
  'use strict';
  window.NoteDemos.register('design', function (node, u) {
    node.innerHTML =
      '<p class="demo-title">扰动下的积分补偿与限幅</p>' +
      '<p class="demo-note">调整比例增益、积分增益和外扰，观察积分如何消除静差，以及力矩上限带来的影响。</p>' +
      '<div class="demo-controls">' +
      '<div class="control"><label>Kp <output data-o="kp"></output></label><input data-p="kp" type="range" min="4" max="30" step="1" value="16"></div>' +
      '<div class="control"><label>Ki <output data-o="ki"></output></label><input data-p="ki" type="range" min="0" max="12" step="0.5" value="4"></div>' +
      '<div class="control"><label>外扰 d <output data-o="d"></output></label><input data-p="d" type="range" min="0" max="8" step="0.5" value="2"></div></div>' +
      '<canvas class="demo-canvas" role="img" aria-label="PD 和 PID 角度响应曲线"></canvas>' +
      '<div class="demo-meta" aria-live="polite"></div>' +
      '<p class="demo-caption">PD 曲线最终需要保留误差来抵消恒定外扰；PID 曲线在未饱和时可逐渐消除该误差。</p>';
    const canvas = node.querySelector('canvas');
    const controls = Object.fromEntries([...node.querySelectorAll('input[data-p]')].map(x => [x.dataset.p, x]));
    const meta = node.querySelector('.demo-meta');
    function draw() {
      const kp = +controls.kp.value, ki = +controls.ki.value, d = +controls.d.value;
      Object.keys(controls).forEach(k => node.querySelector('[data-o="' + k + '"]').textContent = +controls[k].value);
      const dt = 0.01, J = 1, qd = 1.2, kd = 2.5;
      const pd = [], pid = [];
      let a = 0, av = 0, b = 0, bv = 0, z = 0;
      for (let i = 0; i <= 700; i++) {
        const ep = qd - a, ei = qd - b;
        if (i % 10 === 0) { pd.push(a); pid.push(b); }
        const up = kp * ep - kd * av;
        const ui = Math.max(-8, Math.min(8, kp * ei + ki * z - kd * bv));
        a += av * dt; av += (up - d) / J * dt;
        b += bv * dt; bv += (ui - d) / J * dt;
        z = Math.max(-3, Math.min(3, z + ei * dt));
      }
      const {ctx,w,h} = u.canvasReady(canvas), p = {l:43,r:12,t:16,b:30};
      ctx.clearRect(0,0,w,h);ctx.fillStyle="#101b2b";ctx.fillRect(0,0,w,h); ctx.strokeStyle='#9bb1ca'; ctx.lineWidth=1;
      ctx.beginPath(); ctx.moveTo(p.l,p.t); ctx.lineTo(p.l,h-p.b); ctx.lineTo(w-p.r,h-p.b); ctx.stroke();
      const y0=h-p.b, scale=(h-p.t-p.b)/1.8;
      ctx.setLineDash([5,4]); ctx.strokeStyle='#b8c8dc'; ctx.beginPath(); ctx.moveTo(p.l,y0-qd*scale); ctx.lineTo(w-p.r,y0-qd*scale); ctx.stroke(); ctx.setLineDash([]);
      [[pd,'#ffb86b'],[pid,'#5cdbd3']].forEach(([arr,color]) => {
        ctx.strokeStyle=color; ctx.lineWidth=2; ctx.beginPath();
        arr.forEach((v,i) => { const x=p.l+i*(w-p.l-p.r)/(arr.length-1), y=y0-v*scale; i?ctx.lineTo(x,y):ctx.moveTo(x,y); });
        ctx.stroke();
      });
      meta.textContent='外扰 d='+d.toFixed(1)+' N·m；PD 理论静差 d/Kp = '+(d/kp).toFixed(3)+' rad。蓝线 PID 使用 ±8 N·m 力矩限幅与积分限幅；该演示用于观察趋势。';
    }
    Object.values(controls).forEach(x => x.addEventListener('input',draw)); draw();
  });
})();