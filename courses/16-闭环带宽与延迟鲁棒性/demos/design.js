/* Lesson 11: closed-loop bandwidth and pure-delay phase loss */
(function(){
  'use strict';
  window.NoteDemos.register('design',function(node,u){
    node.classList.add('bandwidth-lab');
    node.innerHTML=
      '<p class="demo-title">交互实验 · 带宽与延迟余量</p>'+
      '<p class="demo-note">模型：P(s)=1/(τs+1)，C(s)=K。调节参数，观察开环交越、相位裕度和无额外延迟时的闭环带宽。</p>'+
      '<div class="demo-controls">'+
      '<div class="control"><label>比例增益 K <output data-o="k"></output></label><input aria-label="比例增益 K" data-p="k" type="range" min="1.05" max="12" step="0.05" value="4"></div>'+
      '<div class="control"><label>对象时间常数 τ <output data-o="tau"></output></label><input aria-label="对象时间常数 tau" data-p="tau" type="range" min="0.05" max="0.5" step="0.01" value="0.20"></div>'+
      '<div class="control"><label>额外延迟 Td <output data-o="td"></output></label><input aria-label="额外纯延迟 Td" data-p="td" type="range" min="0" max="0.04" step="0.001" value="0.005"></div></div>'+
      '<canvas class="demo-canvas" data-plot="magnitude" role="img" aria-label="带有0分贝线和增益交越位置的开环幅频曲线"></canvas>'+
      '<canvas class="demo-canvas" data-plot="phase" role="img" aria-label="对比有无延迟的开环相位曲线和相位裕度"></canvas>'+
      '<div class="demo-meta" aria-live="polite"></div><p class="demo-caption" data-status></p>';
    const controls={};
    node.querySelectorAll('input').forEach(function(el){controls[el.dataset.p]=el;});
    const magCanvas=node.querySelector('[data-plot="magnitude"]');
    const phaseCanvas=node.querySelector('[data-plot="phase"]');

    function chart(canvas,title,ymin,ymax,ylabel){
      const q=u.canvasReady(canvas),ctx=q.ctx,w=q.w,h=q.h;
      ctx.clearRect(0,0,w,h);
      const ink=u.color('#344050','#dbe5ef'),grid=u.color('#e3e8ed','#3b4758');
      const r={x:54,y:34,w:w-72,h:h-72},xmin=-1,xmax=3;
      const X=function(lw){return r.x+(lw-xmin)/(xmax-xmin)*r.w;};
      const Y=function(v){return r.y+r.h-(v-ymin)/(ymax-ymin)*r.h;};
      ctx.font='11px sans-serif';ctx.fillStyle=ink;ctx.textAlign='left';ctx.fillText(title,12,19);
      ctx.strokeStyle=grid;ctx.lineWidth=1;
      const intervals=ymin < -270 ? 4 : 5;
      const ystep=(ymax-ymin)/intervals;
      for(let i=0;i<=intervals;i++){
        const v=ymin+i*ystep,py=Y(v);
        ctx.beginPath();ctx.moveTo(r.x,py);ctx.lineTo(r.x+r.w,py);ctx.stroke();
        ctx.fillStyle=ink;ctx.textAlign='right';ctx.fillText(v.toFixed(0),r.x-7,py+4);
      }
      [[-1,'0.1'],[0,'1'],[1,'10'],[2,'100'],[3,'1000']].forEach(function(t){
        const px=X(t[0]);ctx.strokeStyle=grid;ctx.beginPath();ctx.moveTo(px,r.y);ctx.lineTo(px,r.y+r.h);ctx.stroke();
        ctx.fillStyle=ink;ctx.textAlign='center';ctx.fillText(t[1],px,r.y+r.h+16);
      });
      ctx.fillStyle=ink;ctx.textAlign='center';ctx.fillText('角频率 ω (rad/s，对数刻度)',r.x+r.w/2,h-5);
      function line(fn,color,dash){
        ctx.save();ctx.beginPath();ctx.rect(r.x,r.y,r.w,r.h);ctx.clip();
        ctx.strokeStyle=color;ctx.lineWidth=2;ctx.setLineDash(dash||[]);ctx.beginPath();
        for(let i=0;i<=500;i++){
          const lx=xmin+(xmax-xmin)*i/500,val=fn(Math.pow(10,lx));
          if(i===0)ctx.moveTo(X(lx),Y(val));else ctx.lineTo(X(lx),Y(val));
        }
        ctx.stroke();ctx.restore();
      }
      function marker(omega,value,color,label){
        if(!(omega>0)||!Number.isFinite(value))return;
        const lx=Math.log10(omega),px=X(lx),py=Y(value);
        ctx.save();ctx.strokeStyle=color;ctx.lineWidth=1.4;ctx.setLineDash([5,4]);
        ctx.beginPath();ctx.moveTo(px,r.y);ctx.lineTo(px,r.y+r.h);ctx.stroke();ctx.setLineDash([]);
        if(py>=r.y&&py<=r.y+r.h){ctx.fillStyle=color;ctx.beginPath();ctx.arc(px,py,4,0,2*Math.PI);ctx.fill();}
        ctx.fillStyle=color;ctx.textAlign=px>r.x+r.w-55?'right':'left';
        ctx.fillText(label,px+(ctx.textAlign==='right'?-4:4),r.y+13);ctx.restore();
      }
      return {ctx,r,X,Y,line,marker,ink,grid};
    }
    function draw(){
      const K=+controls.k.value,tau=+controls.tau.value,Td=+controls.td.value;
      node.querySelector('[data-o="k"]').textContent=K.toFixed(2);
      node.querySelector('[data-o="tau"]').textContent=tau.toFixed(2)+' s';
      node.querySelector('[data-o="td"]').textContent=(Td*1000).toFixed(0)+' ms';
      const wgc=Math.sqrt(K*K-1)/tau;
      const pm0=180-Math.atan(wgc*tau)*180/Math.PI;
      const pm=pm0-wgc*Td*180/Math.PI;
      const delayMargin=(pm0*Math.PI/180)/wgc;
      const bw=(1+K)/tau;
      const colors={base:'#3889cf',delay:'#d88b2b',cross:'#409e76',neutral:u.color('#7b8792','#8796a5')};
      const mag=chart(magCanvas,'开环幅频图 · 幅值 (dB)',-60,30,'幅值 dB');
      const phase=chart(phaseCanvas,'开环相频图 · 无延迟与含延迟',-720,0,'相位 deg');
      mag.line(function(w){return 20*Math.log10(K)-10*Math.log10(1+(w*tau)*(w*tau));},colors.base);
      mag.ctx.save();mag.ctx.strokeStyle=colors.neutral;mag.ctx.setLineDash([3,4]);
      mag.ctx.beginPath();mag.ctx.moveTo(mag.r.x,mag.Y(0));mag.ctx.lineTo(mag.r.x+mag.r.w,mag.Y(0));mag.ctx.stroke();mag.ctx.restore();
      mag.marker(wgc,0,colors.cross,'ωgc');
      phase.line(function(w){return -Math.atan(w*tau)*180/Math.PI;},colors.base);
      phase.line(function(w){return -Math.atan(w*tau)*180/Math.PI-w*Td*180/Math.PI;},colors.delay);
      phase.ctx.save();phase.ctx.strokeStyle=colors.neutral;phase.ctx.setLineDash([3,4]);
      phase.ctx.beginPath();phase.ctx.moveTo(phase.r.x,phase.Y(-180));phase.ctx.lineTo(phase.r.x+phase.r.w,phase.Y(-180));phase.ctx.stroke();phase.ctx.restore();
      const phaseAt=-Math.atan(wgc*tau)*180/Math.PI-wgc*Td*180/Math.PI;
      phase.marker(wgc,phaseAt,colors.cross,'PM @ ωgc');
      const x=phase.X(Math.log10(wgc));
      phase.ctx.save();phase.ctx.strokeStyle=colors.cross;phase.ctx.lineWidth=2;
      phase.ctx.beginPath();phase.ctx.moveTo(x,phase.Y(phaseAt));phase.ctx.lineTo(x,phase.Y(-180));phase.ctx.stroke();phase.ctx.restore();
      const rows=[
        '增益交越 ωgc = '+wgc.toFixed(2)+' rad/s',
        '无延迟 PM₀ = '+pm0.toFixed(1)+'°',
        '当前延迟下 PM ≈ '+pm.toFixed(1)+'°',
        '估算延迟余量 ≈ '+(delayMargin*1000).toFixed(1)+' ms',
        '闭环带宽（无额外延迟）ωBW = '+bw.toFixed(2)+' rad/s'
      ];
      const meta=node.querySelector('.demo-meta');meta.replaceChildren();
      rows.forEach(function(txt){const span=document.createElement('span');span.textContent=txt;meta.appendChild(span);});
      node.querySelector('[data-status]').textContent=pm>15?
        '当前模型仍有正相位余量。提高 K 会扩大无延迟闭环带宽，但通常也会降低可容忍的额外延迟。':
        pm>0?'相位余量已经较小，继续增加延迟或模型误差可能把系统推近临界。':
        '当前延迟已耗尽该简化模型的相位裕度；这是稳定边界的线性预测，实际系统还需结合完整模型与时域测试。';
    }
    Object.keys(controls).forEach(function(k){controls[k].addEventListener('input',draw);});
    window.addEventListener('robot-theme-changed',draw);
    if(typeof ResizeObserver!=='undefined')new ResizeObserver(draw).observe(node);
    else window.addEventListener('resize',draw);
    draw();
  });
})();


