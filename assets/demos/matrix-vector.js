(function(){
'use strict';
if(window.__bridgeLabRegistered)return;window.__bridgeLabRegistered=true;
const schemas={
 eigen:[['b','阻尼 b',-2,8,.1,2],['k','刚度 k',.5,8,.1,4],['q','初始位置',-2,2,.1,1],['v','初始速度',-2,2,.1,0]],
 state:[['j','惯量 J',.5,4,.1,2],['b','阻尼 b',0,8,.1,4],['k','刚度 k',0,12,.1,10]],
 steady:[['k','环路增益 K',.5,10,.5,4]],
 routh:[['k','参数 K',-2,10,.1,4]],locus:[['k','环路增益 K',0,10,.1,2]],nyquist:[['k','环路增益 K',.5,16,.1,4]],
 compensator:[['alpha','α（滞后时 β=1/α）',.1,.9,.01,1/3],['t','时间常数 T / s',.1,10,.1,.9]],
 matrix:[['x','状态 x₁',-3,3,.1,1],['y','状态 x₂',-3,3,.1,0],['a','A₂₁',-5,2,.1,-2],['b','A₂₂',-5,2,.1,-3],['dt','Euler 时间步长 / s',.01,.5,.01,.1]]};
const fmt=x=>Number(x).toFixed(3);
function dynamics(j,b,k,u,q,v){
 const points=[],dt=.01;
 function rhs(x){return [x[1],(u-b*x[1]-k*x[0])/j];}
 for(let i=0;i<=1000;i++){
  if(!Number.isFinite(q)||Math.abs(q)>1e5)break;
  points.push([i*dt,q]);const x=[q,v],a=rhs(x),bb=rhs(x.map((z,l)=>z+dt*a[l]/2)),c=rhs(x.map((z,l)=>z+dt*bb[l]/2)),d=rhs(x.map((z,l)=>z+dt*c[l]));
  q+=dt*(a[0]+2*bb[0]+2*c[0]+d[0])/6;v+=dt*(a[1]+2*bb[1]+2*c[1]+d[1])/6;
 }return points;
}
function plot(curves,xmin,xmax,ymin,ymax,xlabel,ylabel,right){
 const W=800,H=330,L=75,R=right?75:35,T=32,B=60;
 const xp=x=>L+(x-xmin)/(xmax-xmin)*(W-L-R),yp=y=>H-B-(y-ymin)/(ymax-ymin)*(H-T-B);
 let s=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${xlabel} 与 ${ylabel} 的交互曲线" style="width:100%;background:#101b2b;border-radius:12px"><defs><clipPath id="clip-${currentId}"><rect x="${L}" y="${T}" width="${W-L-R}" height="${H-T-B}"/></clipPath></defs>`;
 for(let i=0;i<=4;i++){let x=xmin+(xmax-xmin)*i/4,y=ymin+(ymax-ymin)*i/4;
 s+=`<path d="M${xp(x)} ${T}V${H-B} M${L} ${yp(y)}H${W-R}" stroke="#33465d"/><g fill="#d9e7fa" font-size="13"><text x="${xp(x)}" y="${H-B+25}" text-anchor="middle">${x.toFixed(1)}</text><text x="${L-10}" y="${yp(y)+4}" text-anchor="end">${y.toFixed(1)}</text></g>`;
 if(right)s+=`<text x="${W-R+12}" y="${yp(y)+4}" fill="#ffcc66" font-size="13">${(right[0]+(right[1]-right[0])*i/4).toFixed(0)}</text>`;
 }
 s+=`<g clip-path="url(#clip-${currentId})">`;
 if(xmin<=0&&xmax>=0)s+=`<path d="M${xp(0)} ${T}V${H-B}" stroke="#91a6bd"/>`;
 if(ymin<=0&&ymax>=0)s+=`<path d="M${L} ${yp(0)}H${W-R}" stroke="#91a6bd"/>`;
 curves.forEach((c,i)=>{let path=c.points.filter(p=>Number.isFinite(p[0]+p[1])).map((p,i)=>(i?'L':'M')+xp(p[0]).toFixed(2)+' '+yp(p[1]).toFixed(2)).join(' ');
 s+=`<path d="${path}" fill="none" stroke="${c.color||['#5cdbd3','#ffcc66','#fa8ca7'][i%3]}" stroke-width="2.5"/>`;
 if(c.dots)c.points.forEach(p=>s+=`<circle cx="${xp(p[0])}" cy="${yp(p[1])}" r="5" fill="${c.color||'#ffcc66'}"/>`);
 });
 s+=`</g><text x="${W/2}" y="${H-12}" fill="#eef6ff" font-size="16" text-anchor="middle">${xlabel}</text><text x="${L}" y="21" fill="#5cdbd3" font-size="15">${ylabel}</text>`;
 if(right)s+=`<text x="${W-R}" y="21" fill="#ffcc66" font-size="15" text-anchor="end">相位 / °</text>`;
 return s+'</svg>';
}
let counter=0,currentId=0;
function mount(node){
 const mode=node.dataset.mode||'matrix',schema=schemas[mode];if(!schema)throw Error('未知模式');const id=++counter;
 let controls=schema.map(([key,label,min,max,step,value])=>`<label style="display:block;margin:10px">${label} <output data-out="${key}"></output><input style="width:100%" type="range" data-key="${key}" min="${min}" max="${max}" step="${step}" value="${value}"></label>`).join('');
 if(mode==='steady')controls+='<label>型别 <select data-choice="type"><option value="0">0 型：K/(s+1)</option><option value="1">I 型：K/[s(s+1)]</option></select></label> <label>输入 <select data-choice="input"><option value="step">单位阶跃</option><option value="ramp">单位斜坡</option></select></label>';
 if(mode==='compensator')controls+='<label>网络 <select data-choice="network"><option value="lead">超前</option><option value="lag">滞后</option></select></label>';
 node.innerHTML='<div class="demo-controls">'+controls+'</div><div data-plot></div><p data-status aria-live="polite" style="white-space:pre-line"></p><button type="button" data-reset>恢复初始参数</button>';
 const inputs=[...node.querySelectorAll('input')],selects=[...node.querySelectorAll('select')];
 function draw(){
 currentId=id;let p={};inputs.forEach(e=>{p[e.dataset.key]=+e.value;node.querySelector(`[data-out="${e.dataset.key}"]`).textContent=fmt(+e.value);});selects.forEach(e=>p[e.dataset.choice]=e.value);
 let curves=[],bounds=[0,10,-1,2],axis=['t / s','位置'],status='',right=null;
 if(mode==='eigen'||mode==='state'){
 let j=p.j||1,b=p.b,k=p.k,q=p.q||0,v=p.v||0,u=mode==='state'?1:0;
 curves=[{points:dynamics(j,b,k,u,q,v)}];let ys=curves[0].points.map(z=>z[1]);let lo=Math.min(0,...ys),hi=Math.max(.1,...ys);bounds=[0,10,lo-.1*(hi-lo),hi+.1*(hi-lo)];
 let disc=b*b-4*j*k,real=-b/(2*j),delta=Math.sqrt(Math.abs(disc))/(2*j);
 status=disc>=0?`特征值：${fmt(real+delta)}，${fmt(real-delta)}`:`特征值：${fmt(real)} ± ${fmt(delta)}j`;
 status+=`\nA = [0, 1; ${fmt(-k/j)}, ${fmt(-b/j)}]；B = [0; ${fmt(1/j)}]`;
 if(mode==='eigen')status+='\n连续模型：实部严格负才渐近稳定；边界需另查。';
 }else if(mode==='steady'){
 let out=[],q=0,v=0,dt=.005,K=p.k;
 // RK4 for y'= - (1+K)y+Kr or y''+y'+Ky=Kr.
 function f(t,x){let r=p.input==='step'?1:t;return p.type==='0'?[-(1+K)*x[0]+K*r,0]:[x[1],K*r-x[1]-K*x[0]];}
 for(let i=0;i<=4000;i++){let t=i*dt,r=p.input==='step'?1:t;out.push([t,r-q]);const x=[q,v],a=f(t,x),b=f(t+dt/2,x.map((z,l)=>z+dt*a[l]/2)),c=f(t+dt/2,x.map((z,l)=>z+dt*b[l]/2)),d=f(t+dt,x.map((z,l)=>z+dt*c[l]));q+=dt*(a[0]+2*b[0]+2*c[0]+d[0])/6;v+=dt*(a[1]+2*b[1]+2*c[1]+d[1])/6;}
 curves=[{points:out}];let ys=out.map(z=>z[1]);bounds=[0,20,Math.min(-.1,...ys)-.1,Math.max(1.1,...ys)+.1];axis=['t / s','误差 e'];
 status='理论稳态误差：'+(p.type==='0'?(p.input==='step'?fmt(1/(1+K)):'无界增长'):(p.input==='step'?'0':fmt(1/K)))+'\n假设单位负反馈、K>0、零初态；当前两个模型闭环均渐近稳定。';
 }else if(mode==='routh'){
 let K=p.k,c=(6-K)/3,signs=[1,3,c,K];curves=[{points:signs.map((v,i)=>[i,v]),dots:true}];bounds=[-.3,3.3,-3,11];axis=['首列行序号（s³、s²、s¹、s⁰）','首列系数'];
 status=`首列：1, 3, ${fmt(c)}, ${fmt(K)}\n`+(Math.abs(K)<1e-8?'边界：原点根；非渐近稳定。':Math.abs(K-6)<1e-8?'边界：全零行；极点 −3、±j√2。':K<0?'1 次变号：1 个右半平面根。':K>6?'2 次变号：2 个右半平面根。':'无变号且无虚轴根：严格稳定。');
 }else if(mode==='locus'){
 curves=[{points:[[-2,0],[-1,0],[0,0]]},{points:[[-1,-3.2],[-1,3.2]]}];let K=p.k,pts=K<=1?[[-1+Math.sqrt(1-K),0],[-1-Math.sqrt(1-K),0]]:[[-1,Math.sqrt(K-1)],[-1,-Math.sqrt(K-1)]];curves.push({points:pts,dots:true,color:'#ffcc66'});bounds=[-3,1,-3.5,3.5];axis=['Re(s) / s⁻¹','Im(s) / s⁻¹'];status='当前极点：'+pts.map(x=>`${fmt(x[0])}${x[1]>=0?'+':''}${fmt(x[1])}j`).join('；')+`\nωn=${fmt(Math.sqrt(K))}；`+(K>0?'ζ='+fmt(1/Math.sqrt(K)):'K=0 有原点根。');
 }else if(mode==='nyquist'){
 let pos=[];for(let i=0;i<=1400;i++){let w=i===0?0:10**(-3+5*i/1400),a=1-3*w*w,b=3*w-w*w*w,den=a*a+b*b;pos.push([p.k*a/den,-p.k*b/den]);}
 curves=[{points:pos},{points:pos.map(v=>[v[0],-v[1]])},{points:[[-1,0]],dots:true,color:'#fa8ca7'}];bounds=[-3,Math.max(5,p.k+1),-Math.max(3,p.k*.85),Math.max(3,p.k*.85)];axis=['Re L(jω)','Im L(jω)'];status=`负实轴交点 −K/8 = ${fmt(-p.k/8)}\n`+(Math.abs(p.k-8)<1e-7?'穿过 −1：边界；闭环根 −3、±j√3。':p.k<8?'P=0，N=0，Z=0：闭环严格稳定。':'P=0，N=2（顺时针），Z=2：闭环不稳定。')+'\n正频率方向从 K 出发趋向原点；负频率主分支为共轭。';
 }else if(mode==='compensator'){
 let ratio=p.network==='lead'?p.alpha:1/p.alpha,amp=[],phase=[];for(let i=0;i<=500;i++){let x=-3+6*i/500,w=10**x; amp.push([x,20*Math.log10(Math.hypot(1,w*p.t)/Math.hypot(1,ratio*w*p.t))]);phase.push([x,(Math.atan(w*p.t)-Math.atan(ratio*w*p.t))*180/Math.PI]);}
 // Map separate phase scale [-90,90] onto amplitude scale [-25,25].
 curves=[{points:amp},{points:phase.map(v=>[v[0],v[1]*25/90])}];bounds=[-3,3,-25,25];right=[-90,90];axis=['log₁₀(ω / rad·s⁻¹)','幅值 / dB'];
 status=`零点：${fmt(-1/p.t)}；极点：${fmt(-1/(ratio*p.t))}\n相位极值频率：${fmt(1/(p.t*Math.sqrt(ratio)))} rad/s；低频增益 1，高频增益 ${fmt(1/ratio)}。`;
 }else if(mode==='matrix'){
 let x=p.x,y=p.y,dx=y,dy=p.a*x+p.b*y,nx=x+p.dt*dx,ny=y+p.dt*dy;curves=[{points:[[0,0],[x,y]],dots:true},{points:[[0,0],[dx,dy]],dots:true}];curves.push({points:[[x,y],[nx,ny]],dots:true,color:'#fa8ca7'});let r=Math.max(4,Math.abs(dx)+1,Math.abs(dy)+1,Math.abs(nx)+1,Math.abs(ny)+1);bounds=[-r,r,-r,r];axis=['第一分量（模型坐标）','第二分量'];status=`x=[${fmt(x)}; ${fmt(y)}]\nAx=[${fmt(dx)}; ${fmt(dy)}]；A=[0,1;${fmt(p.a)},${fmt(p.b)}]\n蓝色：状态；橙色：变化率。两者单位不同，图仅作分量示意。\n粉色端点：x+Δt·Ax ≈ [${fmt(nx)}; ${fmt(ny)}]，是一步 Euler 近似，不是精确解。`;
 }
 node.querySelector('[data-plot]').innerHTML=plot(curves,...bounds,...axis,right);node.querySelector('[data-status]').textContent=status;
 }
 inputs.forEach(e=>e.addEventListener('input',draw));selects.forEach(e=>e.addEventListener('change',draw));node.querySelector('[data-reset]').addEventListener('click',()=>{inputs.forEach((e,i)=>e.value=schema[i][5]);selects.forEach(e=>e.selectedIndex=0);draw();});draw();
}
window.NoteDemos.register('bridge-lab',mount);
window.NoteDemos.register('matrix-vector',node=>{node.dataset.mode='matrix';mount(node);});
})();
