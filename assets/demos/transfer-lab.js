(function(){
'use strict';let serial=0;
function response(a,b,y0,U,w,t,kind){
 const free=y0*Math.exp(-a*t);
 const forced=kind==='sine'?b*U/(a*a+w*w)*(a*Math.sin(w*t)-w*Math.cos(w*t)+w*Math.exp(-a*t)):b*U/a*(1-Math.exp(-a*t));
 return {free,forced,total:free+forced};
}
window.NoteDemos.register('transfer-lab',function(node){
 const id=++serial,spec=[['a','衰减系数 a / s⁻¹',.2,4,.1,2],['b','输入系数 b',.2,3,.1,1],['initial','初始输出 y(0)',-2,2,.1,1],['amplitude','输入幅值 U',0,2,.1,1],['omega','正弦角频率 / rad·s⁻¹',.2,6,.1,1],['time','读数时刻 / s',0,6,.05,1]];
 node.innerHTML='<p class="demo-title">同一模型：自由响应 + 强迫响应 = 总响应</p><p class="demo-note">ẏ + ay = bu；传递函数 G(s)=b/(s+a)。线性、稳定、无饱和模型的解析响应。</p><div class="demo-controls">'+spec.map(([key,label,min,max,step,value])=>`<label>${label} <output data-out="${key}"></output><input data-p="${key}" type="range" min="${min}" max="${max}" step="${step}" value="${value}" style="width:100%"></label>`).join('')+'</div><label>输入类型 <select data-kind><option value="step">常值阶跃 U</option><option value="sine">从t=0启动的正弦 U sin(ωt)</option></select></label><div data-chart></div><p data-result aria-live="polite" style="white-space:pre-line"></p><button type="button" data-reset>恢复本课例子</button>';
 const inputs=[...node.querySelectorAll('input')],kind=node.querySelector('[data-kind]');
 function draw(){
 const p={};inputs.forEach(e=>{p[e.dataset.p]=+e.value;node.querySelector(`[data-out="${e.dataset.p}"]`).textContent=(+e.value).toFixed(2);});const type=kind.value;
 const curves=['free','forced','total'].map(name=>({name,points:[]}));
 for(let i=0;i<=600;i++){let t=i/100,x=response(p.a,p.b,p.initial,p.amplitude,p.omega,t,type);curves.forEach(c=>c.points.push([t,x[c.name]]));}
 const ys=curves.flatMap(c=>c.points.map(v=>v[1])),lo=Math.min(-.1,...ys),hi=Math.max(.1,...ys),pad=(hi-lo)*.12,ymin=lo-pad,ymax=hi+pad;
 const X=t=>80+t/6*640,Y=y=>45+(ymax-y)/(ymax-ymin)*300;
 let svg=`<svg viewBox="0 0 800 445" role="img" aria-label="自由、强迫与总响应的叠加" style="width:100%;background:#101b2b;border-radius:10px"><defs><clipPath id="tf-${id}"><rect x="80" y="45" width="640" height="300"/></clipPath></defs>`;
 for(let i=0;i<=5;i++){let t=i*6/5,y=ymin+(ymax-ymin)*i/5;svg+=`<path d="M${X(t)} 45V345 M80 ${Y(y)}H720" stroke="#33465d"/><g fill="#dbe9fa" font-size="17"><text x="${X(t)}" y="375" text-anchor="middle">${t.toFixed(1)}</text><text x="70" y="${Y(y)+5}" text-anchor="end">${y.toFixed(2)}</text></g>`;}
 svg+=`<g clip-path="url(#tf-${id})">`;if(ymin<=0&&ymax>=0)svg+=`<path d="M80 ${Y(0)}H720" stroke="#8ba1bc"/>`;
 const colors=['#5cdbd3','#ffb86b','#c3a5ff'],now=response(p.a,p.b,p.initial,p.amplitude,p.omega,p.time,type);
 curves.forEach((c,i)=>{svg+=`<path d="${c.points.map((v,j)=>(j?'L':'M')+X(v[0]).toFixed(2)+' '+Y(v[1]).toFixed(2)).join(' ')}" stroke="${colors[i]}" stroke-width="3" fill="none"/><circle cx="${X(p.time)}" cy="${Y(now[c.name])}" r="5" fill="${colors[i]}"/>`;});
 svg+=`<path d="M${X(p.time)} 45V345" stroke="#fff" stroke-dasharray="4 5" opacity=".5"/></g><g font-family="sans-serif" font-size="19"><text x="400" y="410" text-anchor="middle" fill="#eef6ff">t / s</text><text x="80" y="30" fill="#eef6ff">输出（模型单位）</text><text x="130" y="438" fill="#5cdbd3">自由响应</text><text x="345" y="438" fill="#ffb86b">强迫响应</text><text x="570" y="438" fill="#c3a5ff">总响应</text></g></svg>`;
 node.querySelector('[data-chart]').innerHTML=svg;
 node.querySelector('[data-result]').textContent=`t=${p.time.toFixed(2)} s：自由 ${now.free.toFixed(4)} + 强迫 ${now.forced.toFixed(4)} = 总响应 ${now.total.toFixed(4)}\n初态改变不改变 G(s)；自由响应会衰减。${type==='step'?'阶跃最终值 bU/a = '+(p.b*p.amplitude/p.a).toFixed(4):'强迫正弦响应包含启动瞬态，此图并非仅画正弦稳态。'}`;
 }
 inputs.forEach(e=>e.addEventListener('input',draw));kind.addEventListener('change',draw);node.querySelector('[data-reset]').addEventListener('click',()=>{inputs.forEach((e,i)=>e.value=spec[i][5]);kind.value='step';draw();});draw();
});
window.TransferTeachingMath={response};
})();
