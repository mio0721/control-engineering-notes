/* 第 12 课：正弦稳态响应和可调时间常数的 Bode 图。 */
(function () {
  'use strict';
  window.NoteDemos.register('design', function (node, u) {
    const bode = node.dataset.mode === 'bode';
    node.classList.add('frequency-lab');
    node.innerHTML =
      '<p class="demo-title">' + (bode ? '实验二 · 频率与时间常数' : '实验一 · 正弦轨迹跟踪') + '</p>' +
      '<p class="demo-note">模型 G(s)=1/(τs+1)。蓝色：输入；橙色：稳态输出 / 当前频率；绿色虚线：截止频率。</p>' +
      '<div class="demo-controls"><div class="control"><label>输入角频率 <output data-o="w"></output></label><input aria-label="输入角频率的十进对数" data-p="w" type="range" min="-1" max="2" step="0.01" value="1"></div>' +
      (bode ? '<div class="control"><label>时间常数 τ <output data-o="tau"></output></label><input aria-label="时间常数（秒）" data-p="tau" type="range" min="0.02" max="0.5" step="0.01" value="0.1"></div>' :
        '<div class="control"><label>观察时刻 t/T <output data-o="time"></output></label><input aria-label="观察时刻（周期数）" data-p="time" type="range" min="0" max="2" step="0.01" value="0.25"></div>') +
      '</div><div class="lab-presets"><button type="button" data-w="0">1 rad/s</button><button type="button" data-w="1">10 rad/s</button><button type="button" data-w="2">100 rad/s</button></div>' +
      (bode ? '<canvas data-chart="mag" class="demo-canvas" role="img" aria-label="对数频率下的幅频曲线"></canvas><canvas data-chart="phase" class="demo-canvas" role="img" aria-label="对数频率下的相频曲线"></canvas>' :
        '<canvas data-chart="wave" class="demo-canvas" role="img" aria-label="两个周期内的输入与稳态输出"></canvas><canvas data-chart="arm" class="demo-canvas arm-canvas" role="img" aria-label="相同观察时刻下两个简化机械臂"></canvas>') +
      '<div class="demo-meta" aria-live="polite"></div><p class="demo-caption" data-status></p>';
    const controls = Object.fromEntries([...node.querySelectorAll('input')].map(x => [x.dataset.p,x]));
    const canvases = [...node.querySelectorAll('canvas')];
    function frame(canvas, title, ymin, ymax, xmin, xmax, ticks, xlabel) {
      const {ctx,w,h} = u.canvasReady(canvas);
      ctx.clearRect(0,0,w,h);
      const text = u.color('#344050','#dbe5ef'), grid = u.color('#e3e8ed','#3b4758');
      ctx.font='11px sans-serif'; ctx.fillStyle=text; ctx.fillText(title,12,18);
      const r={x:47,y:32,w:w-65,h:h-70};
      const X=x=>r.x+(x-xmin)/(xmax-xmin)*r.w;
      const Y=y=>r.y+r.h-(y-ymin)/(ymax-ymin)*r.h;
      ctx.strokeStyle=grid; ctx.lineWidth=1;
      for(let i=0;i<=4;i++) {
        const v=ymin+(ymax-ymin)*i/4,y=Y(v);
        ctx.beginPath();ctx.moveTo(r.x,y);ctx.lineTo(r.x+r.w,y);ctx.stroke();
        ctx.fillStyle=text;ctx.textAlign='right';ctx.fillText(v.toFixed(Math.abs(v)<2?1:0),r.x-6,y+4);
      }
      ticks.forEach(([x,label])=>{
        const px=X(x);ctx.strokeStyle=grid;ctx.beginPath();ctx.moveTo(px,r.y);ctx.lineTo(px,r.y+r.h);ctx.stroke();
        ctx.fillStyle=text;ctx.textAlign='center';ctx.fillText(label,px,r.y+r.h+16);
      });
      ctx.textAlign='center';ctx.fillText(xlabel,r.x+r.w/2,h-5);ctx.textAlign='left';
      function line(fn,color) {
        ctx.save();ctx.beginPath();ctx.rect(r.x,r.y,r.w,r.h);ctx.clip();
        ctx.strokeStyle=color;ctx.lineWidth=2;ctx.beginPath();
        for(let i=0;i<=400;i++){const x=xmin+(xmax-xmin)*i/400,y=fn(x);i?ctx.lineTo(X(x),Y(y)):ctx.moveTo(X(x),Y(y));}
        ctx.stroke();ctx.restore();
      }
      function mark(x,y,color,dashed) {
        ctx.save();ctx.strokeStyle=color;ctx.setLineDash(dashed?[5,4]:[2,3]);
        ctx.beginPath();ctx.moveTo(X(x),r.y);ctx.lineTo(X(x),r.y+r.h);ctx.stroke();
        ctx.setLineDash([]);ctx.fillStyle=color;ctx.beginPath();ctx.arc(X(x),Y(y),4,0,2*Math.PI);ctx.fill();ctx.restore();
      }
      return {ctx,w,h,r,X,Y,line,mark,text};
    }
    function draw() {
      const omega=10**(+controls.w.value),tau=bode?+controls.tau.value:0.1;
      const mag=1/Math.sqrt(1+(omega*tau)**2),phase=-Math.atan(omega*tau),db=20*Math.log10(mag);
      node.querySelector('[data-o="w"]').textContent=omega.toFixed(2)+' rad/s';
      if(bode) {
        node.querySelector('[data-o="tau"]').textContent=tau.toFixed(2)+' s';
        const ticks=[[-1,'0.1'],[0,'1'],[1,'10'],[2,'100'],[3,'1000']];
        const a=frame(canvases[0],'幅频曲线 · dB',-60,0,-1,3,ticks,'角频率 ω (rad/s)，对数刻度');
        const p=frame(canvases[1],'相频曲线 · deg',-90,0,-1,3,ticks,'角频率 ω (rad/s)，对数刻度');
        a.line(lx=>-10*Math.log10(1+(10**lx*tau)**2),'#3889cf');
        p.line(lx=>-Math.atan(10**lx*tau)*180/Math.PI,'#3889cf');
        a.mark(Math.log10(1/tau),-10*Math.log10(2),'#409e76',true);
        p.mark(Math.log10(1/tau),-45,'#409e76',true);
        a.mark(Math.log10(omega),db,'#d88b2b',false);
        p.mark(Math.log10(omega),phase*180/Math.PI,'#d88b2b',false);
      } else {
        const moment=+controls.time.value;
        node.querySelector('[data-o="time"]').textContent=moment.toFixed(2);
        const f=frame(canvases[0],'归一化输入与输出 · 幅值',-1.2,1.2,0,2,[[0,'0'],[.5,'0.5'],[1,'1'],[1.5,'1.5'],[2,'2']],'周期位置 t/T');
        f.line(x=>Math.sin(2*Math.PI*x),'#3889cf');
        f.line(x=>mag*Math.sin(2*Math.PI*x+phase),'#d88b2b');
        f.mark(moment,mag*Math.sin(2*Math.PI*moment+phase),'#d88b2b',false);
        const {ctx,w,h}=u.canvasReady(canvases[1]);ctx.clearRect(0,0,w,h);
        const ink=u.color('#344050','#dbe5ef');
        ctx.font='12px sans-serif';ctx.textAlign='center';ctx.fillStyle=ink;
        ctx.fillText('45° 正弦摆动 · 同一时刻的简化示意',w/2,20);
        [0,1].forEach(i=>{
          const x=w*(i?.74:.26),y=h-32,length=Math.min(85,h-65);
          const angle=(i?mag*Math.sin(2*Math.PI*moment+phase):Math.sin(2*Math.PI*moment))*Math.PI/4;
          ctx.strokeStyle=u.color('#b4bec9','#617084');ctx.setLineDash([3,3]);
          ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y-length);ctx.stroke();ctx.setLineDash([]);
          ctx.strokeStyle=i?'#d88b2b':'#3889cf';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(x,y);
          ctx.lineTo(x+length*Math.sin(angle),y-length*Math.cos(angle));ctx.stroke();
          ctx.fillStyle=ink;ctx.beginPath();ctx.arc(x,y,5,0,2*Math.PI);ctx.fill();
          ctx.fillText((i?'实际':'目标')+' '+(angle*180/Math.PI).toFixed(1)+'°',x,h-8);
        });ctx.textAlign='left';
      }
      const messages=[
        'f = '+(omega/(2*Math.PI)).toFixed(3)+' Hz',
        '周期 T = '+(2*Math.PI/omega).toFixed(3)+' s',
        '幅值比 M = '+mag.toFixed(3),
        '幅值 = '+db.toFixed(2)+' dB',
        '相位 = '+(phase*180/Math.PI).toFixed(1)+'°'
      ];
      if(bode) messages.push('ωc = '+(1/tau).toFixed(2)+' rad/s','fc = '+(1/(2*Math.PI*tau)).toFixed(3)+' Hz');
      else messages.push('观察时刻 t = '+(+controls.time.value*2*Math.PI/omega).toFixed(3)+' s');
      const meta=node.querySelector('.demo-meta');meta.replaceChildren();
      messages.forEach(text=>{const span=document.createElement('span');span.textContent=text;meta.appendChild(span);});
      node.querySelector('[data-status]').textContent=
        omega*tau<.3?'当前：幅值基本保持，相位滞后较小。':
        omega*tau<3?'当前：幅值衰减明显，输出峰值落后输入。':'当前：快速输入被明显衰减，相位逐渐接近 −90°。';
    }
    Object.values(controls).forEach(x=>x.addEventListener('input',draw));
    node.querySelectorAll('[data-w]').forEach(b=>b.addEventListener('click',()=>{controls.w.value=b.dataset.w;draw();}));
    window.addEventListener('robot-theme-changed',draw);
    if(typeof ResizeObserver!=='undefined')new ResizeObserver(draw).observe(node);
    else window.addEventListener('resize',draw);
    draw();
  });
})();
