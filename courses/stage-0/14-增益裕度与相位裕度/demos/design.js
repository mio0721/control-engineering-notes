/* Lesson 10: gain and phase margins for L(s)=K/(s+1)^3 */
(function () {
  'use strict';
  window.NoteDemos.register('design', function (node, u) {
    node.classList.add('margin-lab');
    node.innerHTML =
      '<p class="demo-title">交互实验 · 环路增益 K 与稳定裕度</p>' +
      '<p class="demo-note">模型：L(s)=K/(s+1)³，单位负反馈。蓝线是开环 Bode 曲线；橙色标记读 PM，绿色标记读 GM。此为教学模型。</p>' +
      '<div class="demo-controls"><div class="control"><label>环路增益 K <output data-o="k"></output></label><input aria-label="环路增益 K" data-p="k" type="range" min="0.5" max="12" step="0.01" value="4"></div></div>' +
      '<div class="lab-presets"><button type="button" data-k="1">K = 1</button><button type="button" data-k="4">K = 4</button><button type="button" data-k="7.8">接近临界 K = 7.8</button><button type="button" data-k="8.5">越过边界 K = 8.5</button></div>' +
      '<canvas data-chart="mag" class="demo-canvas" role="img" aria-label="开环幅频图，显示零分贝交越和相位交越处的增益"></canvas>' +
      '<canvas data-chart="phase" class="demo-canvas" role="img" aria-label="开环相频图，显示增益交越处相位裕度"></canvas>' +
      '<div class="demo-meta" aria-live="polite"></div><p class="demo-caption" data-status></p>';
    const input = node.querySelector('[data-p="k"]');
    const charts = [...node.querySelectorAll('canvas')];
    const colors = { curve: '#3889cf', pm: '#d88b2b', gm: '#409e76', zero: '#8793a1' };

    function setup(canvas, title, ymin, ymax, xlabel) {
      const {ctx,w,h} = u.canvasReady(canvas);
      ctx.clearRect(0,0,w,h);
      const ink=u.color('#344050','#dbe5ef'), grid=u.color('#e3e8ed','#3b4758');
      ctx.font='11px sans-serif'; ctx.fillStyle=ink; ctx.textAlign='left'; ctx.fillText(title,12,18);
      const r={x:50,y:32,w:w-70,h:h-70};
      const xmin=-2,xmax=3;
      const X=lx=>r.x+(lx-xmin)/(xmax-xmin)*r.w;
      const Y=y=>r.y+r.h-(y-ymin)/(ymax-ymin)*r.h;
      ctx.strokeStyle=grid;ctx.lineWidth=1;ctx.textAlign='right';
      const n=5;
      for(let i=0;i<=n;i++){
        const v=ymin+(ymax-ymin)*i/n,py=Y(v);
        ctx.beginPath();ctx.moveTo(r.x,py);ctx.lineTo(r.x+r.w,py);ctx.stroke();
        ctx.fillStyle=ink;ctx.fillText(v.toFixed(0),r.x-7,py+4);
      }
      ctx.textAlign='center';
      [[-2,'0.01'],[-1,'0.1'],[0,'1'],[1,'10'],[2,'100'],[3,'1000']].forEach(([x,label])=>{
        const px=X(x);ctx.strokeStyle=grid;ctx.beginPath();ctx.moveTo(px,r.y);ctx.lineTo(px,r.y+r.h);ctx.stroke();
        ctx.fillStyle=ink;ctx.fillText(label,px,r.y+r.h+16);
      });
      ctx.fillStyle=ink;ctx.fillText(xlabel,r.x+r.w/2,h-5);ctx.textAlign='left';
      function curve(fn){
        ctx.save();ctx.beginPath();ctx.rect(r.x,r.y,r.w,r.h);ctx.clip();
        ctx.strokeStyle=colors.curve;ctx.lineWidth=2;ctx.beginPath();
        for(let i=0;i<=500;i++){
          const x=xmin+(xmax-xmin)*i/500, y=fn(10**x);
          if(!Number.isFinite(y))continue;
          i?ctx.lineTo(X(x),Y(y)):ctx.moveTo(X(x),Y(y));
        }
        ctx.stroke();ctx.restore();
      }
      function marker(omega,value,color,dashed,label){
        if(!(omega>0)||!Number.isFinite(value))return;
        const x=Math.log10(omega),px=X(x),py=Y(value);
        ctx.save();ctx.strokeStyle=color;ctx.lineWidth=1.6;ctx.setLineDash(dashed?[5,4]:[]);
        ctx.beginPath();ctx.moveTo(px,r.y);ctx.lineTo(px,r.y+r.h);ctx.stroke();ctx.setLineDash([]);
        if(py>=r.y&&py<=r.y+r.h){ctx.fillStyle=color;ctx.beginPath();ctx.arc(px,py,4,0,2*Math.PI);ctx.fill();}
        ctx.fillStyle=color;ctx.textAlign=px>r.x+r.w-60?'right':'left';
        ctx.fillText(label,px+(ctx.textAlign==='right'?-5:5),r.y+13);
        ctx.restore();
      }
      return {curve,marker,Y,r,ctx,ink,grid};
    }
    function draw(){
      const K=+input.value;
      node.querySelector('[data-o="k"]').textContent=K.toFixed(2);
      const wpc=Math.sqrt(3), gm=8/K, gmdb=20*Math.log10(gm), magpc=20*Math.log10(K/8);
      const hasWgc=K>1;
      const wgc=hasWgc?Math.sqrt(Math.pow(K,2/3)-1):NaN;
      const pm=hasWgc?180-3*Math.atan(wgc)*180/Math.PI:NaN;
      const mag=c=>setup(c,'幅频图 · 幅值 (dB)',-65,30,'角频率 ω (rad/s，对数刻度)');
      const phase=c=>setup(c,'相频图 · 相位 (deg)',-280,10,'角频率 ω (rad/s，对数刻度)');
      const m=mag(charts[0]),p=phase(charts[1]);
      m.curve(w=>20*Math.log10(K)-30*Math.log10(1+w*w));
      p.curve(w=>-3*Math.atan(w)*180/Math.PI);
      // 0 dB line on magnitude
      m.ctx.save();m.ctx.strokeStyle=colors.zero;m.ctx.setLineDash([3,4]);m.ctx.beginPath();m.ctx.moveTo(m.r.x,m.Y(0));m.ctx.lineTo(m.r.x+m.r.w,m.Y(0));m.ctx.stroke();m.ctx.restore();
      m.marker(wpc,magpc,colors.gm,true,'GM @ ωpc');
      p.marker(wpc,-180,colors.gm,true,'ωpc = √3');
      if(hasWgc){
        const phaseAtWgc=-3*Math.atan(wgc)*180/Math.PI;
        m.marker(wgc,0,colors.pm,false,'ωgc');
        p.marker(wgc,phaseAtWgc,colors.pm,false,'PM @ ωgc');
        p.ctx.save();p.ctx.strokeStyle=colors.pm;p.ctx.setLineDash([3,4]);
        const x=Math.log10(wgc),px=p.r.x+(x+2)/5*p.r.w;
        const y0=p.Y(phaseAtWgc),y1=p.Y(-180);
        p.ctx.beginPath();p.ctx.moveTo(px,y0);p.ctx.lineTo(px,y1);p.ctx.stroke();p.ctx.restore();
      }
      const items=[
        '相位交越 ωpc = √3 = '+wpc.toFixed(3)+' rad/s',
        'GM = 8/K = '+gm.toFixed(3)+' 倍（'+gmdb.toFixed(2)+' dB）',
        '相位交越处幅值 = '+magpc.toFixed(2)+' dB'
      ];
      if(hasWgc){
        items.push('增益交越 ωgc = '+wgc.toFixed(3)+' rad/s','PM = '+pm.toFixed(1)+'°');
      } else {
        items.push('K ≤ 1：正频率范围内没有 0 dB 交越，因此此处不定义常规 PM');
      }
      items.push('本模型闭环：'+(K<8?'稳定（0 < K < 8）':K===8?'临界（K = 8）':'不稳定（K > 8）'));
      const meta=node.querySelector('.demo-meta');meta.replaceChildren();
      items.forEach(t=>{const span=document.createElement('span');span.textContent=t;meta.appendChild(span);});
      node.querySelector('[data-status]').textContent=
        K<7.6?'提高 K 会抬高幅频曲线，通常推高交越频率；继续提高会消耗裕度。':
        K<8?'当前已接近本教学模型的临界增益 K=8，GM 接近 0 dB。':
        '本模型已越过 K=8 的稳定边界；负 GM 表示线性增益余量为负。实际设备还需检查极点、延迟、饱和和未建模动态。';
    }
    input.addEventListener('input',draw);
    node.querySelectorAll('[data-k]').forEach(b=>b.addEventListener('click',()=>{input.value=b.dataset.k;draw();}));
    window.addEventListener('robot-theme-changed',draw);
    if(typeof ResizeObserver!=='undefined')new ResizeObserver(draw).observe(node);
    else window.addEventListener('resize',draw);
    draw();
  });
})();
