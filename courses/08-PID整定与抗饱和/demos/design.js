/* 第 8 课：比较普通积分与条件积分在力矩饱和时的表现。 */
(function () {
  'use strict';
  window.NoteDemos.register('design', function (node, u) {
    node.innerHTML =
      '<p class="demo-title">同一 PID 参数，不同抗饱和策略</p>' +
      '<p class="demo-note">通过力矩限幅观察积分器是否在不可实现的输出上继续累积。</p>' +
      '<div class="demo-controls"><div class="control"><label>Ki <output data-o="ki"></output></label><input data-p="ki" type="range" min="2" max="28" step="1" value="16"></div>' +
      '<div class="control"><label>力矩上限 <output data-o="limit"></output></label><input data-p="limit" type="range" min="2" max="12" step="1" value="5"></div></div>' +
      '<canvas class="demo-canvas" role="img" aria-label="普通积分和条件积分位置响应对比"></canvas>' +
      '<div class="demo-meta" aria-live="polite"></div>' +
      '<p class="demo-caption">橙色：普通积分；蓝色：条件积分。简化教学仿真，真实系统还需考虑采样、延迟与执行器细节。</p>';
    const canvas=node.querySelector('canvas');
    const c=Object.fromEntries([...node.querySelectorAll('input[data-p]')].map(x=>[x.dataset.p,x]));
    const meta=node.querySelector('.demo-meta');
    function draw(){
      const ki=+c.ki.value, limit=+c.limit.value;
      node.querySelector('[data-o="ki"]').textContent=ki;
      node.querySelector('[data-o="limit"]').textContent=limit+' N·m';
      const dt=.005,J=1,kp=10,kd=3,qd=1.5,out=[[],[]],zs=[0,0],qs=[0,0],vs=[0,0];
      for(let i=0;i<1400;i++){
        for(let j=0;j<2;j++){
          const e=qd-qs[j],raw=kp*e+ki*zs[j]-kd*vs[j],sat=Math.max(-limit,Math.min(limit,raw));
          const deepen=(raw>limit&&e>0)||(raw< -limit&&e<0);
          if(i%10===0)out[j].push(qs[j]);
          qs[j]+=vs[j]*dt;vs[j]+=(sat/J)*dt;
          if(j===0||!deepen)zs[j]+=e*dt;
          zs[j]=Math.max(-4,Math.min(4,zs[j]));
        }
      }
      const {ctx,w,h}=u.canvasReady(canvas),p={l:44,r:12,t:16,b:28},y0=h-p.b,scale=(h-p.t-p.b)/2;
      ctx.clearRect(0,0,w,h);ctx.fillStyle="#101b2b";ctx.fillRect(0,0,w,h);ctx.strokeStyle='#9bb1ca';ctx.beginPath();ctx.moveTo(p.l,p.t);ctx.lineTo(p.l,y0);ctx.lineTo(w-p.r,y0);ctx.stroke();
      ctx.setLineDash([5,4]);ctx.beginPath();ctx.moveTo(p.l,y0-qd*scale);ctx.lineTo(w-p.r,y0-qd*scale);ctx.stroke();ctx.setLineDash([]);
      [[out[0],'#ffb86b'],[out[1],'#5cdbd3']].forEach(([a,col])=>{ctx.strokeStyle=col;ctx.lineWidth=2;ctx.beginPath();a.forEach((v,i)=>{const x=p.l+i*(w-p.l-p.r)/(a.length-1),y=y0-v*scale;i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.stroke()});
      meta.textContent='条件积分仅在误差会进一步加深饱和时暂停；误差帮助退出饱和时继续积分。Ki='+ki+'，力矩上限='+limit+' N·m。';
    }
    Object.values(c).forEach(x=>x.addEventListener('input',draw));draw();
  });
})();