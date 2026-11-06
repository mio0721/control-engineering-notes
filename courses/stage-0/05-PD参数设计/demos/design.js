/* 第五课专属：依据 J、zeta、wn 反算 Kp、Kd，并绘制理想模型位置阶跃响应。 */
(function () {
  'use strict';
  window.NoteDemos.register('design', function (node, u) {
    const readNumber = (key, fallback) => {
      const n = Number(node.dataset[key]);
      return Number.isFinite(n) && n > 0 ? n : fallback;
    };
    const initial = {
      j: readNumber('j', 1),
      zeta: readNumber('zeta', 0.7),
      wn: readNumber('wn', 3)
    };
    node.innerHTML = `
      <p class="demo-title">交互演示｜从性能参数计算 PD 增益</p>
      <p class="demo-note">目标 90°；理想单关节、固定位置阶跃；初始角度和速度均为零。</p>
      <div class="demo-controls">
        <div class="control"><label>惯量 J <output data-out="j"></output></label><input data-param="j" type="range" min="0.5" max="4" step="0.5"></div>
        <div class="control"><label>阻尼比 ζ <output data-out="zeta"></output></label><input data-param="zeta" type="range" min="0.2" max="1.5" step="0.05"></div>
        <div class="control"><label>自然角频率 ωn <output data-out="wn"></output></label><input data-param="wn" type="range" min="1" max="6" step="0.25"></div>
      </div>
      <canvas class="demo-canvas" role="img" aria-label="按选择的惯量、阻尼比和自然角频率重新计算的机械臂位置曲线"></canvas>
      <div class="demo-meta" aria-live="polite"></div>
      <p class="demo-caption">蓝线：实际角度；虚线：目标 90°；浅色横带：2% 误差范围（88.2°–91.8°）。调节时间根据 6 s 窗口内的数值解估算。</p>
    `;
    const inputs = {};
    node.querySelectorAll('input[data-param]').forEach(el => inputs[el.dataset.param] = el);
    inputs.j.value = initial.j;
    inputs.zeta.value = initial.zeta;
    inputs.wn.value = initial.wn;
    const canvas = node.querySelector('canvas');
    const meta = node.querySelector('.demo-meta');

    function redraw() {
      const J = Number(inputs.j.value);
      const zeta = Number(inputs.zeta.value);
      const wn = Number(inputs.wn.value);
      const Kp = J * wn * wn;
      const Kd = 2 * zeta * J * wn;
      node.querySelector('[data-out="j"]').textContent = J.toFixed(1);
      node.querySelector('[data-out="zeta"]').textContent = zeta.toFixed(2);
      node.querySelector('[data-out="wn"]').textContent = wn.toFixed(2);

      const points = u.solve(J, Kp, Kd);
      const {ctx, w, h} = u.canvasReady(canvas);
      const pad = {l:43, r:12, t:16, b:29};
      const pw = w-pad.l-pad.r, ph = h-pad.t-pad.b;
      const maxPos = Math.max(100, ...points.map(p => p[1]));
      const ymax = Math.ceil((maxPos+8)/20)*20;
      const X = t => pad.l + (t/6)*pw;
      const Y = q => pad.t + ((ymax-q)/ymax)*ph;
      ctx.clearRect(0,0,w,h);

      ctx.fillStyle = u.color('rgba(54,130,120,.07)', 'rgba(117,191,170,.08)');
      ctx.fillRect(pad.l, Y(91.8), pw, Y(88.2)-Y(91.8));
      ctx.font = '11px system-ui';
      ctx.textAlign = 'right';
      for (let i=0; i<=4; i++) {
        const q = ymax*i/4;
        ctx.strokeStyle = u.color('#e7eaed','#3d4857');
        ctx.beginPath();ctx.moveTo(pad.l,Y(q));ctx.lineTo(w-pad.r,Y(q));ctx.stroke();
        ctx.fillStyle = u.color('#6b7480','#b1bcc7');
        ctx.fillText(Math.round(q)+'°',pad.l-6,Y(q)+3);
      }
      ctx.textAlign = 'center';
      for(let t=0;t<=6;t++){
        ctx.fillStyle = u.color('#6b7480','#b1bcc7');
        ctx.fillText(t+'s',X(t),h-8);
      }
      ctx.setLineDash([5,4]);ctx.strokeStyle=u.color('#89929c','#a7b6c6');
      ctx.beginPath();ctx.moveTo(X(0),Y(90));ctx.lineTo(X(6),Y(90));ctx.stroke();ctx.setLineDash([]);
      ctx.lineWidth=2.2;ctx.strokeStyle=u.color('#285f9a','#85bafb');
      ctx.beginPath();
      points.forEach(([t,q],i)=>i?ctx.lineTo(X(t),Y(q)):ctx.moveTo(X(t),Y(q)));
      ctx.stroke();

      const peak = Math.max(...points.map(p => p[1]));
      const Mp = Math.max(0, (peak-90)/90*100);
      // 计算调节时间时使用更细的解析步长，避免绘图的 8ms 网格
      // 将接近 1.99s 的设计误显示为正好 2.00s。
      function stepFraction(t){
        if(zeta < 1){
          const b=Math.sqrt(1-zeta*zeta),wd=wn*b;
          return 1-Math.exp(-zeta*wn*t)*(Math.cos(wd*t)+zeta/b*Math.sin(wd*t));
        }
        if(Math.abs(zeta-1)<1e-9)return 1-Math.exp(-wn*t)*(1+wn*t);
        const root=Math.sqrt(zeta*zeta-1);
        const r1=-wn*(zeta-root),r2=-wn*(zeta+root);
        return 1+(r2*Math.exp(r1*t)-r1*Math.exp(r2*t))/(r1-r2);
      }
      let lastOutside = -1;
      for(let i=0;i<=6000;i++){
        if(Math.abs(stepFraction(i/1000)-1)>0.02)lastOutside=i;
      }
      const Ts=lastOutside>=6000?'超过 6 s':((lastOutside+1)/1000).toFixed(2)+' s';
      const approximate = (zeta<1) ? (4/(zeta*wn)).toFixed(2)+' s' : '不适用该欠阻尼近似';
      const labels = [
        `Kp = ${Kp.toFixed(2)} N·m/rad`,
        `Kd = ${Kd.toFixed(2)} N·m·s/rad`,
        `超调 ≈ ${Mp.toFixed(1)}%`,
        `实际 2% Ts ≈ ${Ts}`,
        `公式估算 Ts ≈ ${approximate}`
      ];
      meta.replaceChildren();
      labels.forEach(label=>{
        const span=document.createElement('span');
        span.textContent=label;
        meta.appendChild(span);
      });
    }
    Object.values(inputs).forEach(input => input.addEventListener('input', redraw));
    window.addEventListener('robot-theme-changed', redraw);
    if(typeof ResizeObserver !== 'undefined')new ResizeObserver(redraw).observe(canvas);
    else window.addEventListener('resize',redraw);
    redraw();
  });
})();
