(function(){
'use strict';
window.NoteDemos.register('design',function(node,u){
node.classList.add('state-lab');
node.innerHTML='<p class="demo-title">状态空间实验 · 单关节弹簧阻尼系统</p>'+
'<p class="demo-note">模型 J qddot + b qdot + k q = τ，固定输入力矩 τ=1 N·m。左图看位置随时间变化，右图看状态 (q, qdot) 如何走向平衡点。</p>'+
'<div class="demo-controls">'+
'<div class="control"><label>惯量 J <output data-o="J"></output></label><input data-p="J" type="range" min="0.5" max="5" step="0.1" value="1"></div>'+
'<div class="control"><label>阻尼 b <output data-o="b"></output></label><input data-p="b" type="range" min="0.1" max="5" step="0.1" value="2"></div>'+
'<div class="control"><label>刚度 k <output data-o="k"></output></label><input data-p="k" type="range" min="0.5" max="10" step="0.1" value="5"></div></div>'+
'<div class="state-plots"><canvas class="demo-canvas" data-plot="time" role="img" aria-label="关节角度随时间变化"></canvas>'+
'<canvas class="demo-canvas" data-plot="phase" role="img" aria-label="位置和速度状态相平面轨迹"></canvas></div>'+
'<div class="demo-meta" aria-live="polite"></div><p class="demo-caption" data-status></p>';
const c={};node.querySelectorAll('input').forEach(function(x){c[x.dataset.p]=x;});
const canvases=[node.querySelector('[data-plot="time"]'),node.querySelector('[data-plot="phase"]')];
function plot(canvas,title,xlabel,ylabel,xmin,xmax,ymin,ymax,ticksX,ticksY){
const q=u.canvasReady(canvas),ctx=q.ctx,w=q.w,h=q.h;
ctx.clearRect(0,0,w,h);const ink=u.color('#344050','#dbe5ef'),grid=u.color('#e3e8ed','#3b4758');
const r={x:53,y:34,w:w-72,h:h-72},X=function(v){return r.x+(v-xmin)/(xmax-xmin)*r.w;},Y=function(v){return r.y+r.h-(v-ymin)/(ymax-ymin)*r.h;};
ctx.font='11px sans-serif';ctx.fillStyle=ink;ctx.textAlign='left';ctx.fillText(title,10,19);ctx.strokeStyle=grid;ctx.lineWidth=1;
ticksY.forEach(function(v){const py=Y(v);ctx.beginPath();ctx.moveTo(r.x,py);ctx.lineTo(r.x+r.w,py);ctx.stroke();ctx.textAlign='right';ctx.fillStyle=ink;ctx.fillText(v.toFixed(1),r.x-6,py+4);});
ticksX.forEach(function(v){const px=X(v);ctx.beginPath();ctx.moveTo(px,r.y);ctx.lineTo(px,r.y+r.h);ctx.stroke();ctx.textAlign='center';ctx.fillStyle=ink;ctx.fillText(v.toFixed(1),px,r.y+r.h+16);});
ctx.textAlign='center';ctx.fillStyle=ink;ctx.fillText(xlabel,r.x+r.w/2,h-4);ctx.save();ctx.translate(12,r.y+r.h/2);ctx.rotate(-Math.PI/2);ctx.fillText(ylabel,0,0);ctx.restore();
function line(points,color,xIndex,yIndex){ctx.save();ctx.beginPath();ctx.rect(r.x,r.y,r.w,r.h);ctx.clip();ctx.strokeStyle=color;ctx.lineWidth=2;ctx.beginPath();points.forEach(function(p,i){if(i===0)ctx.moveTo(X(p[xIndex]),Y(p[yIndex]));else ctx.lineTo(X(p[xIndex]),Y(p[yIndex]));});ctx.stroke();ctx.restore();}
return {line:line,X:X,Y:Y,r:r,ctx:ctx};
}
function derivatives(x,v,J,b,k,tau){return [v,(tau-b*v-k*x)/J];}
function draw(){
const J=+c.J.value,b=+c.b.value,k=+c.k.value,tau=1,dt=.01,N=1000;
['J','b','k'].forEach(function(key){node.querySelector('[data-o="'+key+'"]').textContent=(+c[key].value).toFixed(1);});
let x=0,v=0,t=0;const response=[],phase=[];
for(let i=0;i<=N;i++){
response.push([t,x]);phase.push([x,v]);
const a=derivatives(x,v,J,b,k,tau),b1=derivatives(x+dt*a[0]/2,v+dt*a[1]/2,J,b,k,tau),c1=derivatives(x+dt*b1[0]/2,v+dt*b1[1]/2,J,b,k,tau),d=derivatives(x+dt*c1[0],v+dt*c1[1],J,b,k,tau);
x+=dt*(a[0]+2*b1[0]+2*c1[0]+d[0])/6;v+=dt*(a[1]+2*b1[1]+2*c1[1]+d[1])/6;t+=dt;
}
const qeq=tau/k,qmax=Math.max.apply(null,response.map(function(p){return Math.abs(p[1]);}),Math.abs(qeq))||1;
const vMax=Math.max.apply(null,phase.map(function(p){return Math.abs(p[1]);}))||1;
const a=plot(canvases[0],'位置状态 q(t)','时间 (s)','q (rad)',0,10,Math.min(-.05,qeq-.12*qmax),Math.max(.1,qeq+1.15*qmax),[0,2,4,6,8,10],[-qmax,0,qmax]);
a.line(response,'#3889cf',0,1);a.ctx.fillStyle=u.color('#344050','#dbe5ef');a.ctx.fillText('平衡位置 qeq='+qeq.toFixed(2)+' rad',a.r.x+a.r.w-150,a.r.y+16);
const p=plot(canvases[1],'状态相平面','q (rad)','qdot (rad/s)',Math.min(-.05,qeq-.12*qmax),Math.max(.1,qeq+1.15*qmax),-1.15*vMax,1.15*vMax,[-qmax,0,qmax],[ -vMax,0,vMax]);
p.line(phase,'#d88b2b',0,1);
const meta=node.querySelector('.demo-meta');meta.replaceChildren();
['状态 x=[q, qdot]','平衡位置 qeq=τ/k='+qeq.toFixed(3)+' rad','末端 q='+response[response.length-1][1].toFixed(3)+' rad','当前参数 J='+J.toFixed(1)+', b='+b.toFixed(1)+', k='+k.toFixed(1)].forEach(function(s){const e=document.createElement('span');e.textContent=s;meta.appendChild(e);});
node.querySelector('[data-status]').textContent=b*b<4*J*k?'该参数组合为欠阻尼：相平面轨迹会绕着平衡点收敛。':'阻尼较强：运动更少振荡，状态逐渐靠近平衡点。';
}
Object.keys(c).forEach(function(k){c[k].addEventListener('input',draw);});
window.addEventListener('robot-theme-changed',draw);if(typeof ResizeObserver!=='undefined')new ResizeObserver(draw).observe(node);else window.addEventListener('resize',draw);draw();
});
})();
