(function(){
'use strict';
window.NoteDemos.register('design',function(node,u){
node.classList.add('controller-lab');
node.innerHTML='<p class="demo-title">综合设计实验 · 离散 PID、力矩限幅与条件积分</p>'+
'<p class="demo-note">教学对象 J qddot + b qdot = τ − d。1 rad 阶跃目标，负载扰动在 2.5 s 加入。这里只用于看参数影响，不代表实机调参。</p>'+
'<div class="demo-controls">'+
'<div class="control"><label>Kp <output data-o="kp"></output></label><input data-p="kp" aria-label="比例增益 Kp" type="range" min="2" max="30" step="0.5" value="12"></div>'+
'<div class="control"><label>Ki <output data-o="ki"></output></label><input data-p="ki" aria-label="积分增益 Ki" type="range" min="0" max="8" step="0.2" value="2"></div>'+
'<div class="control"><label>Kd <output data-o="kd"></output></label><input data-p="kd" aria-label="微分增益 Kd" type="range" min="0" max="6" step="0.1" value="1.5"></div>'+
'<div class="control"><label>最大力矩 <output data-o="limit"></output></label><input data-p="limit" aria-label="最大力矩限制" type="range" min="1" max="8" step="0.1" value="2"></div></div>'+
'<canvas class="demo-canvas" data-plot="position" role="img" aria-label="目标角度和实际关节角度的阶跃响应"></canvas>'+
'<canvas class="demo-canvas" data-plot="torque" role="img" aria-label="控制力矩与电机力矩限制"></canvas>'+
'<div class="demo-meta" aria-live="polite"></div><p class="demo-caption" data-status></p>';
const c={};node.querySelectorAll('input').forEach(function(x){c[x.dataset.p]=x;});
const cv=[node.querySelector('[data-plot="position"]'),node.querySelector('[data-plot="torque"]')];
function chart(canvas,title,ymin,ymax,ticks){
const q=u.canvasReady(canvas),ctx=q.ctx,w=q.w,h=q.h;ctx.clearRect(0,0,w,h);
const ink=u.color('#344050','#dbe5ef'),grid=u.color('#e3e8ed','#3b4758'),r={x:52,y:34,w:w-70,h:h-72};
const X=function(t){return r.x+t/5*r.w;},Y=function(v){return r.y+r.h-(v-ymin)/(ymax-ymin)*r.h;};
ctx.font='11px sans-serif';ctx.fillStyle=ink;ctx.textAlign='left';ctx.fillText(title,10,19);ctx.strokeStyle=grid;ctx.lineWidth=1;
ticks.forEach(function(v){const py=Y(v);ctx.beginPath();ctx.moveTo(r.x,py);ctx.lineTo(r.x+r.w,py);ctx.stroke();ctx.fillStyle=ink;ctx.textAlign='right';ctx.fillText(v.toFixed(1),r.x-6,py+4);});
[0,1,2,3,4,5].forEach(function(t){const px=X(t);ctx.beginPath();ctx.moveTo(px,r.y);ctx.lineTo(px,r.y+r.h);ctx.stroke();ctx.fillStyle=ink;ctx.textAlign='center';ctx.fillText(String(t),px,r.y+r.h+16);});
ctx.textAlign='center';ctx.fillStyle=ink;ctx.fillText('时间 (s)',r.x+r.w/2,h-4);
function line(data,color,dash){
ctx.save();ctx.beginPath();ctx.rect(r.x,r.y,r.w,r.h);ctx.clip();ctx.strokeStyle=color;ctx.lineWidth=2;ctx.setLineDash(dash||[]);ctx.beginPath();
data.forEach(function(p,i){if(i===0)ctx.moveTo(X(p[0]),Y(p[1]));else ctx.lineTo(X(p[0]),Y(p[1]));});ctx.stroke();ctx.restore();
}
function horizontal(value,color,dash){ctx.save();ctx.strokeStyle=color;ctx.setLineDash(dash||[]);ctx.beginPath();ctx.moveTo(r.x,Y(value));ctx.lineTo(r.x+r.w,Y(value));ctx.stroke();ctx.restore();}
return {line:line,horizontal:horizontal};
}
function draw(){
const kp=+c.kp.value,ki=+c.ki.value,kd=+c.kd.value,limit=+c.limit.value;
node.querySelector('[data-o="kp"]').textContent=kp.toFixed(1);
node.querySelector('[data-o="ki"]').textContent=ki.toFixed(1);
node.querySelector('[data-o="kd"]').textContent=kd.toFixed(1);
node.querySelector('[data-o="limit"]').textContent=limit.toFixed(1)+' N·m';
const J=1,b=.4,Ts=.01,dt=.002,total=5,target=1,tauF=.02;
let q=0,v=0,I=0,vf=0,qPrev=0,uHeld=0,nextSample=0,satCount=0,sampleCount=0;
const pos=[],tor=[];
for(let t=0;t<=total+1e-9;t+=dt){
if(t+1e-9>=nextSample){
const e=target-q,rawV=(q-qPrev)/Ts,alpha=Math.exp(-Ts/tauF);
vf=alpha*vf+(1-alpha)*rawV;
let raw=kp*e+ki*I-kd*vf;
const clamped=Math.max(-limit,Math.min(limit,raw));
const saturated=raw!==clamped;
const pushes=(raw>limit&&e>0)||(raw< -limit&&e<0);
if(!saturated||!pushes)I+=e*Ts;
raw=kp*e+ki*I-kd*vf;
uHeld=Math.max(-limit,Math.min(limit,raw));
if(saturated) satCount++;
sampleCount++;
qPrev=q;nextSample+=Ts;
}
pos.push([t,q]);tor.push([t,uHeld]);
const disturbance=t>=2.5?.3:0;
const acc=(uHeld-b*v-disturbance)/J;
v+=acc*dt;q+=v*dt;
}
const maxq=Math.max(1.15,...pos.map(function(p){return p[1];}));
const pc=chart(cv[0],'位置响应 · 目标与实际角度',-0.1,maxq,[0,.25,.5,.75,1,1.25]);
pc.line(pos,'#3889cf');pc.horizontal(target,'#d88b2b',[5,4]);
const tc=chart(cv[1],'控制力矩 · 含限幅',-limit*1.3,limit*1.3,[-limit,0,limit]);
tc.line(tor,'#409e76');tc.horizontal(limit,'#d88b2b',[4,4]);tc.horizontal(-limit,'#d88b2b',[4,4]);
const overshoot=Math.max(0,...pos.map(function(p){return p[1]-target;}));
const finalError=target-pos[pos.length-1][1];
const meta=node.querySelector('.demo-meta');meta.replaceChildren();
['最终误差 '+finalError.toFixed(3)+' rad','最大超调 '+(overshoot*100).toFixed(1)+'%','力矩饱和采样 '+(100*satCount/sampleCount).toFixed(1)+'%','扰动：t=2.5 s 后增加 0.3 N·m'].forEach(function(s){const x=document.createElement('span');x.textContent=s;meta.appendChild(x);});
node.querySelector('[data-status]').textContent=satCount>sampleCount*.1?
'这组参数有较多采样点处于力矩饱和。检查限幅期间积分是否累积，以及执行器能力是否满足目标。':
'观察提高 Kp、加入 Kd 或 Ki 后的位置与力矩变化；每次只改一项，才能看清它的作用。';
}
Object.keys(c).forEach(function(k){c[k].addEventListener('input',draw);});
window.addEventListener('robot-theme-changed',draw);if(typeof ResizeObserver!=='undefined')new ResizeObserver(draw).observe(node);else window.addEventListener('resize',draw);draw();
});
})();
