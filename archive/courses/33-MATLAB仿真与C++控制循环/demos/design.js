(function(){
'use strict';
window.NoteDemos.register('design',function(node,u){
node.classList.add('sampling-lab');
node.innerHTML='<p class="demo-title">交互实验 · 采样、零阶保持与对象滞后</p>'+
'<p class="demo-note">连续目标在采样时刻被读取，命令在采样间隔内保持；一阶对象再对保持命令作出响应。</p>'+
'<div class="demo-controls">'+
'<div class="control"><label>采样周期 Ts <output data-o="ts"></output></label><input data-p="ts" aria-label="控制采样周期" type="range" min="5" max="80" step="1" value="20"></div>'+
'<div class="control"><label>目标频率 f <output data-o="f"></output></label><input data-p="f" aria-label="目标正弦频率" type="range" min="0.5" max="4" step="0.1" value="2"></div>'+
'<div class="control"><label>对象时间常数 τ <output data-o="tau"></output></label><input data-p="tau" aria-label="一阶对象时间常数" type="range" min="0.03" max="0.30" step="0.01" value="0.08"></div></div>'+
'<canvas class="demo-canvas" role="img" aria-label="连续目标、采样保持命令和一阶对象输出的时间曲线"></canvas>'+
'<div class="demo-meta" aria-live="polite"></div><p class="demo-caption" data-status></p>';
const c={};node.querySelectorAll('input').forEach(function(x){c[x.dataset.p]=x;});
const canvas=node.querySelector('canvas');
function draw(){
const Ts=+c.ts.value/1000,f=+c.f.value,tau=+c.tau.value,w=2*Math.PI*f,dt=.001,Tend=Math.max(1.5,3/f);
node.querySelector('[data-o="ts"]').textContent=(Ts*1000).toFixed(0)+' ms';
node.querySelector('[data-o="f"]').textContent=f.toFixed(1)+' Hz';
node.querySelector('[data-o="tau"]').textContent=tau.toFixed(2)+' s';
let y=0,held=0,nextSample=0;const target=[],command=[],output=[];
for(let t=0;t<=Tend+1e-9;t+=dt){
if(t+1e-9>=nextSample){held=Math.sin(w*nextSample);nextSample+=Ts;}
target.push([t,Math.sin(w*t)]);command.push([t,held]);output.push([t,y]);
y+=dt*(held-y)/tau;
}
const q=u.canvasReady(canvas),ctx=q.ctx,W=q.w,H=q.h;ctx.clearRect(0,0,W,H);
const ink=u.color('#344050','#dbe5ef'),grid=u.color('#e3e8ed','#3b4758'),r={x:52,y:34,w:W-72,h:H-72};
const X=function(t){return r.x+t/Tend*r.w;},Y=function(v){return r.y+r.h-(v+1.2)/2.4*r.h;};
ctx.font='11px sans-serif';ctx.fillStyle=ink;ctx.textAlign='left';ctx.fillText('目标、数字命令与对象输出',10,19);ctx.strokeStyle=grid;ctx.lineWidth=1;
[-1,0,1].forEach(function(v){const py=Y(v);ctx.beginPath();ctx.moveTo(r.x,py);ctx.lineTo(r.x+r.w,py);ctx.stroke();ctx.fillStyle=ink;ctx.textAlign='right';ctx.fillText(v.toFixed(1),r.x-6,py+4);});
for(let i=0;i<=4;i++){const t=Tend*i/4,px=X(t);ctx.beginPath();ctx.moveTo(px,r.y);ctx.lineTo(px,r.y+r.h);ctx.stroke();ctx.fillStyle=ink;ctx.textAlign='center';ctx.fillText(t.toFixed(2),px,r.y+r.h+16);}
function line(data,color,width,dash){ctx.save();ctx.beginPath();ctx.rect(r.x,r.y,r.w,r.h);ctx.clip();ctx.strokeStyle=color;ctx.lineWidth=width;ctx.setLineDash(dash||[]);ctx.beginPath();data.forEach(function(p,i){if(i===0)ctx.moveTo(X(p[0]),Y(p[1]));else ctx.lineTo(X(p[0]),Y(p[1]));});ctx.stroke();ctx.restore();}
line(target,'#7f8b97',1.6,[5,4]);line(command,'#d88b2b',2.2);line(output,'#3889cf',2.2);
ctx.fillStyle=ink;ctx.textAlign='center';ctx.fillText('时间 (s)',r.x+r.w/2,H-4);
const fs=1/Ts,samplesPerPeriod=fs/f;
const meta=node.querySelector('.demo-meta');meta.replaceChildren();
['采样频率 fs = '+fs.toFixed(1)+' Hz','每周期约 '+samplesPerPeriod.toFixed(1)+' 个采样点','零阶保持命令与连续目标之间出现台阶'].forEach(function(t){const s=document.createElement('span');s.textContent=t;meta.appendChild(s);});
node.querySelector('[data-status]').textContent=samplesPerPeriod<10?
'每周期采样点偏少，目标变化会被较粗地表示；实际控制还要考虑对象带宽、噪声、延迟和执行器能力。':
'比较三条曲线：灰色目标连续变化，橙色命令按采样点保持，蓝色对象输出进一步出现动态滞后。';
}
Object.keys(c).forEach(function(k){c[k].addEventListener('input',draw);});
window.addEventListener('robot-theme-changed',draw);if(typeof ResizeObserver!=='undefined')new ResizeObserver(draw).observe(node);else window.addEventListener('resize',draw);draw();
});
})();
