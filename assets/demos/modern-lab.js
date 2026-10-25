(function(){
'use strict';let serial=0;
const specs={
response:[['q','初始位置 / rad',-2,2,.1,1],['u','常值输入',0,2,.1,1]],
phase:[['b','阻尼 b',-1,6,.1,2],['k','刚度 k',1,6,.1,4]],
discrete:[['ts','采样周期 / s',.05,1.5,.05,.1],['x0','初态 x₀',.2,2,.1,1]],
controllable:[['g','第二状态输入系数 γ',0,1.5,.05,1],['horizon','终点时间 T / s',.5,4,.1,2]],
lyapunov:[['rate','矩阵速率倍率 a',.2,3,.1,1],['q','初始位置',.2,2,.1,1]],
feedback:[['k1','位置反馈 k₁',.5,30,.5,6],['k2','速度反馈 k₂',.2,15,.1,5]],
lqr:[['q1','位置权重 q₁',.2,16,.2,4],['q2','速度权重 q₂',0,8,.2,1],['r','输入权重 r',.2,8,.2,1]],
tracking:[['w','参考角频率 / rad·s⁻¹',.2,3,.1,1],['kp','位置反馈',1,12,.5,4],['kd','速度反馈',.5,8,.5,3]],
observable:[['g','测量系数 γ',0,1.5,.05,1],['a','第二状态初值 a',-2,2,.1,1]],
observer:[['l1','观测器 l₁',1,24,.5,9],['l2','观测器 l₂',1,100,1,20]],
separation:[['c','控制极点速率倍率',.5,2,.1,1],['o','观测极点速率倍率',.3,3,.1,1]],
digital:[['ts','采样周期 / s',.05,.4,.05,.1],['p1','反馈极点 p₁',.1,1.1,.05,.6],['p2','反馈极点 p₂',.1,1.1,.05,.7]]};
const fmt=(x,n=4)=>Number(x).toFixed(n);
function rk(f,t,x,h){const a=f(t,x),b=f(t+h/2,x.map((z,i)=>z+h*a[i]/2)),c=f(t+h/2,x.map((z,i)=>z+h*b[i]/2)),d=f(t+h,x.map((z,i)=>z+h*c[i]));return x.map((z,i)=>z+h*(a[i]+2*b[i]+2*c[i]+d[i])/6);}
function simulate(f,x0,end=8,h=.005){const rows=[];let x=x0.slice();for(let i=0;i<=Math.round(end/h);i++){if(!x.every(Number.isFinite)||Math.max(...x.map(Math.abs))>1e6)break;if(i%4===0)rows.push([i*h,...x]);x=rk(f,i*h,x,h);}return rows;}
function curve(name,points,dots=false){return {name,points,dots};}
function col(name,rows,i){return curve(name,rows.map(r=>[r[0],r[i]]));}
function panel(title,xlabel,ylabel,curves,bounds){return {title,xlabel,ylabel,curves,bounds};}
function quadratic(a,b){const d=a*a-4*b;return d>=0?`${fmt((-a+Math.sqrt(d))/2)}, ${fmt((-a-Math.sqrt(d))/2)}`:`${fmt(-a/2)} ± ${fmt(Math.sqrt(-d)/2)}j`;}
function gramian(g,T){const a=(1-Math.exp(-2*T))/2,b=g*(1-Math.exp(-3*T))/3,c=g*g*(1-Math.exp(-4*T))/4,det=a*c-b*b;return {a,b,c,det,energy:g===0?Infinity:a/det};}
function digitalGains(ts,p1,p2){const k1=(1-p1)*(1-p2)/(ts*ts),k2=(1-p1*p2)/ts+ts*k1/2;return {k1,k2,l1:1.5,l2:.56/ts};}
function evaluate(mode,p){let panels=[],status='',meta={};
if(mode==='response'){
 const rows=[];for(let i=0;i<=800;i++){let t=i/100,free=p.q*(2*Math.exp(-t)-Math.exp(-2*t)),forced=p.u/2*(1-2*Math.exp(-t)+Math.exp(-2*t));rows.push([t,free,forced,free+forced]);}
 panels=[panel('初态响应与输入响应的叠加','t / s','位置 / rad',[col('自由响应',rows,1),col('强迫响应',rows,2),col('总响应',rows,3)])];status=`A=[0,1;−2,−3]，B=[0;1]；v(0)=0\n初始总位置 ${fmt(p.q)}，理论平衡位置 u/2=${fmt(p.u/2)}。`;meta={equilibrium:p.u/2};
}else if(mode==='phase'){
 const rows=simulate((t,x)=>[x[1],-p.k*x[0]-p.b*x[1]],[1,0],8);
 panels=[panel('同一运动的时间表示','t / s','状态（不同单位）',[col('q / rad',rows,1),col('v / rad·s⁻¹',rows,2)]),panel('相轨迹：初态为(1,0)','q / rad','v / rad·s⁻¹',[curve('状态轨迹',rows.map(r=>[r[1],r[2]]))])];status=`特征值：${quadratic(p.b,p.k)}\n${p.b>0?'阻尼为正，状态收敛。':p.b===0?'零阻尼，理想能量保持，不渐近收敛。':'负阻尼，状态能量增长。'}`;
}else if(mode==='discrete'){
 let exact=[],euler=[],x=p.x0;for(let k=0;k<=12;k++){exact.push([k*p.ts,p.x0*Math.exp(-2*k*p.ts)]);euler.push([k*p.ts,x]);x*=1-2*p.ts;}
 panels=[panel('无输入 ẋ=−2x 的两种采样序列','t / s','x',[curve('精确离散',exact,true),curve('Euler近似',euler,true)])];status=`Ad=${fmt(Math.exp(-2*p.ts))}，Bd=${fmt((1-Math.exp(-2*p.ts))/2)}\nEuler因子=${fmt(1-2*p.ts)}；${Math.abs(1-2*p.ts)<1?'Euler在当前步长衰减。':Math.abs(1-2*p.ts)===1?'Euler处在边界，非渐近稳定。':'Euler已失稳，但连续对象仍稳定。'}`;meta={ad:Math.exp(-2*p.ts),bd:(1-Math.exp(-2*p.ts))/2};
}else if(mode==='controllable'){
 const w=gramian(p.g,p.horizon),energy=[];for(let i=1;i<=150;i++){let g=i/100;energy.push([g,Math.log10(gramian(g,p.horizon).energy)]);}
 panels=[panel('可控矩阵的两列方向','第一状态分量','第二状态分量',[curve('B',[ [0,0],[1,p.g] ]),curve('AB',[ [0,0],[-1,-2*p.g] ])]),panel('目标[0,1]ᵀ的无约束最小输入平方能量','γ','log₁₀(Emin)',[curve('Emin随输入作用变弱而增大',energy)])];
 status=`Cctrl=[1,−1;${fmt(p.g)},${fmt(-2*p.g)}]；det=${fmt(-p.g)}；rank=${p.g===0?1:2}\nWc=[${fmt(w.a)},${fmt(w.b)};${fmt(w.b)},${fmt(w.c)}]\n${p.g===0?'第二状态不可达，Gramian奇异。':'最小能量='+fmt(w.energy,2)+'；此值不考虑输入限幅。'}`;meta={rank:p.g===0?1:2,gramian:w};
}else if(mode==='lyapunov'){
 const rows=simulate((t,x)=>[p.rate*x[1],p.rate*(-2*x[0]-3*x[1])],[p.q,0],8);
 const v=rows.map(z=>[z[0],1.25*z[1]*z[1]+.5*z[1]*z[2]+.25*z[2]*z[2]]);
 panels=[panel('状态分量未必各自单调','t / s','状态（不同单位）',[col('x₁（模型坐标）',rows,1),col('x₂（模型坐标）',rows,2)]),panel('构造的Lyapunov函数严格衰减','t / s','V=xᵀPx',[curve('V',v)])];status=`A=a[0,1;−2,−3]（整体时间缩放，x₂不直接等于同一物理时间下的速度）；P=[1.25,.25;.25,.25]\nAᵀP+PA=−aI，V̇=−${fmt(p.rate)}(q²+v²)。V(0)=${fmt(1.25*p.q*p.q)}。`;meta={values:v};
}else if(mode==='feedback'||mode==='lqr'){
 const k1=mode==='feedback'?p.k1:Math.sqrt(p.q1/p.r),k2=mode==='feedback'?p.k2:Math.sqrt(p.q2/p.r+2*k1);
 const rows=simulate((t,x)=>[x[1],-k1*x[0]-k2*x[1]],[1,0],8);
 panels=[panel('初态位置1、速度0，目标为零','t / s','q / rad',[col('位置',rows,1)]),panel('更快响应需要同时看输入','t / s','u（归一惯量）',[curve('u=−Kx',rows.map(z=>[z[0],-k1*z[1]-k2*z[2]]))])];status=`K=[${fmt(k1)},${fmt(k2)}]；闭环特征值 ${quadratic(k2,k1)}\n初始输入 u(0)=−${fmt(k1)}；本图无输入限幅。`;meta={k1,k2};
}else if(mode==='tracking'){
 function rhs(ff){return (t,x)=>[x[1],(ff?-p.w*p.w*Math.sin(p.w*t):0)-p.kp*(x[0]-Math.sin(p.w*t))-p.kd*(x[1]-p.w*Math.cos(p.w*t))];}
 const yes=simulate(rhs(true),[0,0],16),no=simulate(rhs(false),[0,0],16);
 panels=[panel('运动参考：初始参考速度与实际不同','t / s','q / rad',[curve('参考',yes.map(z=>[z[0],Math.sin(p.w*z[0])])),col('有加速度前馈',yes,1),col('无加速度前馈',no,1)]),panel('位置跟踪误差 q−qr','t / s','e / rad',[curve('有前馈',yes.map(z=>[z[0],z[1]-Math.sin(p.w*z[0])])),curve('无前馈',no.map(z=>[z[0],z[1]-Math.sin(p.w*z[0])]))])];status=`qr=sin(ωt)，vr=ωcos(ωt)，ar=−ω²sin(ωt)。\n精确模型与前馈下误差特征式 s²+${fmt(p.kd)}s+${fmt(p.kp)}=0；图中含起始速度误差。`;
}else if(mode==='observable'){
 const rows=[];for(let i=0;i<=600;i++){let t=i/100;rows.push([t,Math.exp(-t),Math.exp(-t)+p.g*p.a*Math.exp(-2*t)]);}
 panels=[panel('内部第二初态不同，输出能否分开？','t / s','y',[col('x₂(0)=0',rows,1),col('x₂(0)=a',rows,2)])];status=`O=[1,γ;−1,−2γ]，det=−γ=${fmt(-p.g)}；rank=${p.g===0?1:2}\n${p.g===0?'第二状态不进入输出，两条测量完全重合。':'理论可观；γ很小时，有限噪声仍可能掩盖差异。'}`;meta={rank:p.g===0?1:2};
}else if(mode==='observer'){
 const rows=simulate((t,e)=>[-p.l1*e[0]+e[1],-p.l2*e[0]],[1,0],5);
 panels=[panel('初始误差[1,0]ᵀ的收敛与峰值','t / s','误差（位置、速度单位不同）',[col('位置误差',rows,1),col('速度误差',rows,2)])];status=`L=[${fmt(p.l1)};${fmt(p.l2)}]，误差极点 ${quadratic(p.l1,p.l2)}\n无噪声、无模型误差；较快参数可能产生更大的中间速度估计峰值。`;
}else if(mode==='separation'){
 const k1=6*p.c*p.c,k2=5*p.c,l1=9*p.o,l2=20*p.o*p.o;
 const rows=simulate((t,z)=>{const u=-k1*z[2]-k2*z[3],res=z[0]-z[2];return [z[1],u,z[3]+l1*res,u+l2*res];},[1,0,0,0],8);
 panels=[panel('真实与估计状态连接后的响应','t / s','q / rad',[col('真实位置',rows,1),col('估计位置',rows,3)]),panel('估计状态反馈产生的实际命令','t / s','u',[curve('u=−Kx̂',rows.map(z=>[z[0],-k1*z[3]-k2*z[4]]))])];
 status=`控制极点 −${fmt(2*p.c)}, −${fmt(3*p.c)}；误差极点 −${fmt(4*p.o)}, −${fmt(5*p.o)}\nK=[${fmt(k1)},${fmt(k2)}]，L=[${fmt(l1)};${fmt(l2)}]。估计初态为零，因此初始输入为零。`;meta={k1,k2,l1,l2};
}else if(mode==='digital'){
 const {k1,k2,l1,l2}=digitalGains(p.ts,p.p1,p.p2);let q=1,v=0,hq=0,hv=0,rows=[],inputs=[];
 for(let k=0;k<=Math.ceil(8/p.ts);k++){
 const u=-k1*hq-k2*hv;rows.push([k*p.ts,q,hq]);inputs.push([k*p.ts,u]);
 const qn=q+p.ts*v+p.ts*p.ts*u/2,vn=v+p.ts*u,res=q-hq,hqn=hq+p.ts*hv+p.ts*p.ts*u/2+l1*res,hvn=hv+p.ts*u+l2*res;
 q=qn;v=vn;hq=hqn;hv=hvn;if(Math.max(Math.abs(q),Math.abs(v))>1e6)break;
 }
 panels=[panel('逐拍估计反馈：数字点为采样状态','t / s','q / rad',[curve('真实',rows.map(z=>[z[0],z[1]]),true),curve('估计',rows.map(z=>[z[0],z[2]]),true)]),panel('每拍控制输入（图中连线仅辅助读数）','t / s','u',[curve('控制输入',inputs,true)])];status=`Kd=[${fmt(k1)},${fmt(k2)}]，Ld=[${fmt(l1)};${fmt(l2)}]\n反馈极点 ${fmt(p.p1)},${fmt(p.p2)}；观测误差极点固定0.2、0.3。\n${Math.max(Math.abs(p.p1),Math.abs(p.p2))<1?'理想联合离散闭环渐近稳定。':'反馈极点到达或越出单位圆，不保证渐近稳定。'}`;meta={k1,k2,l1,l2};
}
return {panels,status,meta};
}
const colors=['#5cdbd3','#ffb86b','#c3a5ff'];
function chart(p,id){
 const all=p.curves.flatMap(c=>c.points).filter(z=>Number.isFinite(z[0]+z[1]));let xmin=Math.min(0,...all.map(z=>z[0])),xmax=Math.max(.1,...all.map(z=>z[0])),ymin=Math.min(0,...all.map(z=>z[1])),ymax=Math.max(.1,...all.map(z=>z[1]));
 let pad=(ymax-ymin)*.1;ymin-=pad;ymax+=pad;if(p.bounds)[xmin,xmax,ymin,ymax]=p.bounds;
 const X=x=>85+(x-xmin)/(xmax-xmin)*680,Y=y=>45+(ymax-y)/(ymax-ymin)*300;
 let svg=`<svg viewBox="0 0 850 430" role="img" aria-label="${p.title}" style="width:100%;display:block;background:#101b2b;border-radius:10px"><defs><clipPath id="${id}"><rect x="85" y="45" width="680" height="300"/></clipPath></defs>`;
 for(let i=0;i<=5;i++){let x=xmin+(xmax-xmin)*i/5,y=ymin+(ymax-ymin)*i/5;svg+=`<path d="M${X(x)} 45V345M85 ${Y(y)}H765" stroke="#33465d"/><g fill="#dbe9fa" font-size="16"><text x="${X(x)}" y="375" text-anchor="middle">${x.toFixed(2)}</text><text x="75" y="${Y(y)+5}" text-anchor="end">${Math.abs(y)<1000?y.toFixed(2):y.toExponential(1)}</text></g>`;}
 if(ymin<=0&&ymax>=0)svg+=`<path d="M85 ${Y(0)}H765" stroke="#90a6c0"/>`;
 if(xmin<=0&&xmax>=0)svg+=`<path d="M${X(0)} 45V345" stroke="#90a6c0"/>`;
 svg+=`<g clip-path="url(#${id})">`;
 p.curves.forEach((c,i)=>{let col=colors[i%3],points=c.points.filter(z=>Number.isFinite(z[0]+z[1]));svg+=`<path d="${points.map((z,i)=>(i?'L':'M')+X(z[0]).toFixed(2)+' '+Y(z[1]).toFixed(2)).join(' ')}" fill="none" stroke="${col}" stroke-width="2.5"/>`;if(c.dots)points.forEach(z=>svg+=`<circle cx="${X(z[0])}" cy="${Y(z[1])}" r="3.5" fill="${col}"/>`);});
 svg+=`</g><text x="425" y="417" text-anchor="middle" fill="#edf6ff" font-size="19">${p.xlabel}</text><text x="85" y="30" fill="#edf6ff" font-size="17">${p.ylabel}</text></svg>`;
 return `<h3 style="font-size:16px;margin:20px 0 8px">${p.title}</h3>`+svg+'<div class="modern-legend">'+p.curves.map((c,i)=>`<span style="color:${colors[i%3]};background:#101b2b;padding:4px 8px;border-radius:4px">${c.name}</span>`).join('')+'</div>';
}
window.NoteDemos.register('modern-lab',node=>{
 const id=++serial,mode=node.dataset.mode,schema=specs[mode];if(!schema)throw Error('未知现代控制模式');
 node.innerHTML='<p class="demo-note">本地浏览器计算的理想模型；参数作用与限制请结合正文阅读。不同状态量的单位会分别注明。</p><div class="demo-controls">'+schema.map(([key,title,min,max,step,val])=>`<label>${title} <output data-out="${key}"></output><input type="range" data-p="${key}" min="${min}" max="${max}" step="${step}" value="${val}" style="width:100%"></label>`).join('')+'</div><p data-status class="modern-status" aria-live="polite"></p><div data-charts></div><button type="button" data-reset>恢复本课参数</button>';
 const inputs=[...node.querySelectorAll('input')];function draw(){let p={};inputs.forEach(e=>{p[e.dataset.p]=+e.value;node.querySelector(`[data-out="${e.dataset.p}"]`).textContent=fmt(+e.value,2);});let result=evaluate(mode,p);node.querySelector('[data-status]').textContent=result.status;node.querySelector('[data-charts]').innerHTML=result.panels.map((p,j)=>chart(p,`modern-${id}-${j}`)).join('');}
 inputs.forEach(e=>e.addEventListener('input',draw));node.querySelector('[data-reset]').addEventListener('click',()=>{inputs.forEach((e,i)=>e.value=schema[i][5]);draw();});draw();
});
window.ModernTeachingMath={evaluate,gramian,digitalGains,specs,rk,simulate};
})();
