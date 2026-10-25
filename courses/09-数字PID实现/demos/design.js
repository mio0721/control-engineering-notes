/* 第 9 课：时间间隔缩放、差分噪声与低通滤波。 */
(function () {
  'use strict';
  window.NoteDemos.register('design', function(node,u) {
    const filter=node.dataset.mode==='filter';
    node.classList.add('digital-lab');
    node.innerHTML='<p class="demo-title">'+(filter?'实验二 · 差分噪声与滤波':'实验一 · 真实周期与代码 dt')+'</p>'+
      '<p class="demo-note">'+(filter?'真实位置 q=sin(2πt)，蓝线为真实速度，灰线为含测量扰动的差分速度，橙线为滤波速度。':'恒定误差 e=0.5 rad，真实匀速运动 v=2 rad/s。蓝线为正确积分，橙线为代码 dt 下的积分；这不是完整闭环仿真。')+'</p>'+
      '<div class="demo-controls">'+
      '<div class="control"><label>真实采样周期 <output data-o="ts"></output></label><input data-p="ts" aria-label="真实采样周期（毫秒）" type="range" min="1" max="50" step="1" value="'+(filter?'5':'10')+'"></div>'+
      (filter?
        '<div class="control"><label>测量扰动幅度 <output data-o="noise"></output></label><input data-p="noise" aria-label="测量扰动幅度（毫弧度）" type="range" min="0" max="10" step="0.5" value="2"></div>'+
        '<div class="control"><label>滤波时间常数 <output data-o="tau"></output></label><input data-p="tau" aria-label="滤波时间常数（毫秒）" type="range" min="0" max="200" step="5" value="20"></div>':
        '<div class="control"><label>代码采用 dt <output data-o="dt"></output></label><input data-p="dt" aria-label="代码采用的时间间隔（毫秒）" type="range" min="1" max="50" step="1" value="10"></div>')+
      '</div>'+
      (filter?'':'<div class="lab-presets"><button type="button" data-case="wrong">重现：真实 1 ms，代码 10 ms</button><button type="button" data-case="correct">将代码 dt 设为真实周期</button></div>')+
      '<canvas class="demo-canvas" role="img" aria-label="'+(filter?'真实、差分与滤波速度随时间变化':'正确与错误时间间隔的积分随时间变化')+'"></canvas>'+
      '<div class="demo-meta" aria-live="polite"></div><p class="demo-caption" data-status></p>';
    const inputs=Object.fromEntries([...node.querySelectorAll('input')].map(x=>[x.dataset.p,x]));
    const canvas=node.querySelector('canvas');
    function draw() {
      const ts=+inputs.ts.value/1000;
      node.querySelector('[data-o="ts"]').textContent=inputs.ts.value+' ms';
      const {ctx,w,h}=u.canvasReady(canvas);ctx.clearRect(0,0,w,h);
      const ink=u.color('#344050','#dbe5ef'),grid=u.color('#e1e7ed','#3b4758');
      let series=[],ymin=0,ymax=1,xmax=1,messages=[],caption='';
      if(filter) {
        const noise=+inputs.noise.value/1000,tau=+inputs.tau.value/1000,alpha=tau/(tau+ts);
        node.querySelector('[data-o="noise"]').textContent=noise.toFixed(4)+' rad';
        node.querySelector('[data-o="tau"]').textContent=inputs.tau.value+' ms';
        const raw=[],truth=[],smooth=[];let prev=0,vf=0;
        for(let k=0;k<=Math.floor(2/ts);k++){
          const t=k*ts;
          const q=Math.sin(2*Math.PI*t)+noise*(.65*Math.sin(2*Math.PI*137*t)+.35*Math.sin(2*Math.PI*43*t));
          const vr=k?(q-prev)/ts:0;vf=alpha*vf+(1-alpha)*vr;
          raw.push([t,vr]);truth.push([t,2*Math.PI*Math.cos(2*Math.PI*t)]);smooth.push([t,vf]);prev=q;
        }
        const peak=Math.max(7,...raw.map(p=>Math.abs(p[1])))*1.08;
        ymin=-peak;ymax=peak;xmax=2;
        series=[[raw,u.color('#b2b8bf','#667385'),1],[truth,'#3889cf',2],[smooth,'#d88b2b',2]];
        messages=['采样频率 '+(1/ts).toFixed(0)+' Hz','α = '+alpha.toFixed(4),'真实速度峰值 6.283 rad/s'];
        caption=noise===0?'噪声为零：重点看离散差分与滤波造成的幅值、相位变化。':
          '固定高频测量扰动，便于重复比较。先减小噪声，再增大滤波时间常数，看平滑与滞后；第一点受初始化影响。';
      } else {
        const dt=+inputs.dt.value/1000,ratio=dt/ts;
        node.querySelector('[data-o="dt"]').textContent=inputs.dt.value+' ms';
        const count=Math.floor(1/ts),correct=[],code=[];
        for(let k=0;k<=count;k++){correct.push([k*ts,.5*k*ts]);code.push([k*ts,.5*k*dt]);}
        series=[[correct,'#3889cf',2],[code,'#d88b2b',2]];ymax=Math.max(.6,.5*count*dt*1.12);
        messages=['真实运动速度 2 rad/s','代码估计速度 '+(2/ratio).toFixed(3)+' rad/s',
          '积分累计倍率 '+ratio.toFixed(2),'正确新增积分 '+(.5*count*ts).toFixed(3)+' rad·s',
          '代码新增积分 '+(.5*count*dt).toFixed(3)+' rad·s'];
        caption=Math.abs(ratio-1)<1e-8?'时间一致：两条积分线重合，速度估计与真实匀速一致。':
          '时间不一致：积分倍率为 dt/Ts，速度估计倍率为 Ts/dt。机械真实速度没有因此自动改变。';
      }
      const r={x:52,y:25,w:w-69,h:h-66};
      const X=x=>r.x+x/xmax*r.w,Y=y=>r.y+r.h-(y-ymin)/(ymax-ymin)*r.h;
      ctx.font='11px sans-serif';ctx.strokeStyle=grid;ctx.lineWidth=1;
      for(let i=0;i<=4;i++){
        const y=ymin+(ymax-ymin)*i/4;
        ctx.beginPath();ctx.moveTo(r.x,Y(y));ctx.lineTo(r.x+r.w,Y(y));ctx.stroke();
        ctx.fillStyle=ink;ctx.textAlign='right';ctx.fillText(y.toFixed(1),r.x-7,Y(y)+4);
        const x=xmax*i/4;ctx.beginPath();ctx.moveTo(X(x),r.y);ctx.lineTo(X(x),r.y+r.h);ctx.stroke();
        ctx.textAlign='center';ctx.fillText(x.toFixed(2),X(x),r.y+r.h+16);
      }
      ctx.textAlign='left';ctx.fillText(filter?'速度 (rad/s)':'累计误差 (rad·s)',10,15);
      ctx.textAlign='center';ctx.fillText('真实时间 (s)',w/2,h-5);ctx.textAlign='left';
      ctx.save();ctx.beginPath();ctx.rect(r.x,r.y,r.w,r.h);ctx.clip();
      series.forEach(([points,color,width])=>{
        ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();
        points.forEach(([x,y],i)=>i?ctx.lineTo(X(x),Y(y)):ctx.moveTo(X(x),Y(y)));ctx.stroke();
      });ctx.restore();
      const meta=node.querySelector('.demo-meta');meta.replaceChildren();
      messages.forEach(t=>{const el=document.createElement('span');el.textContent=t;meta.appendChild(el);});
      node.querySelector('[data-status]').textContent=caption;
    }
    Object.values(inputs).forEach(x=>x.addEventListener('input',draw));
    node.querySelectorAll('[data-case]').forEach(b=>b.addEventListener('click',()=>{
      if(b.dataset.case==='wrong'){inputs.ts.value='1';inputs.dt.value='10';}
      else inputs.dt.value=inputs.ts.value;draw();
    }));
    window.addEventListener('robot-theme-changed',draw);
    if(typeof ResizeObserver!=='undefined')new ResizeObserver(draw).observe(node);
    else window.addEventListener('resize',draw);
    draw();
  });
})();
