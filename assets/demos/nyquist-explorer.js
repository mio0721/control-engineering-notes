(function(){
'use strict';
let serial=0;
function value(model,K,w){
 if(model==='unstable')return [-K/(1+w*w),-K*w/(1+w*w)];
 const a=1-3*w*w,b=3*w-w*w*w,d=a*a+b*b;return [K*a/d,-K*b/d];
}
function roots(model,K){
 if(model==='unstable')return [[1-K,0]];
 const r=Math.cbrt(K);return [[-1-r,0],[-1+r/2,Math.sqrt(3)*r/2],[-1+r/2,-Math.sqrt(3)*r/2]];
}
function sample(model,K){
 const ws=[0,1,Math.sqrt(3)];
 for(let i=0;i<=1600;i++)ws.push(10**(-5+10*i/1600));
 ws.sort((a,b)=>a-b);
 const pos=ws.map(w=>value(model,K,w));
 return {pos,neg:pos.map(p=>[p[0],-p[1]]).reverse()};
}
function winding(pos,neg){
 const p=[...neg,...pos],full=[...p,p[0]];let a=0;
 for(let i=1;i<full.length;i++){
 const u=[full[i-1][0]+1,full[i-1][1]],v=[full[i][0]+1,full[i][1]];
 a+=Math.atan2(u[0]*v[1]-u[1]*v[0],u[0]*v[0]+u[1]*v[1]);
 }return -Math.round(a/(2*Math.PI));
}
function svg(id,title,span,curves,dots,axes){
 const x=v=>80+(v+span)/(2*span)*500,y=v=>60+(span-v)/(2*span)*500;
 let s=`<svg viewBox="0 0 660 640" role="img" aria-label="${title}" style="display:block;width:100%;background:#101b2b;border-radius:10px"><defs><clipPath id="${id}"><rect x="80" y="60" width="500" height="500"/></clipPath><marker id="${id}-a" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0L6,3L0,6Z" fill="context-stroke"/></marker></defs><text x="330" y="30" text-anchor="middle" fill="#eef6ff" font-size="20">${title}</text>`;
 for(let i=0;i<=4;i++){let v=-span+i*span/2;
 s+=`<path d="M${x(v)} 60V560 M80 ${y(v)}H580" fill="none" stroke="#33465d"/><g fill="#dbe9fa" font-size="15"><text x="${x(v)}" y="585" text-anchor="middle">${v.toFixed(1)}</text><text x="70" y="${y(v)+5}" text-anchor="end">${v.toFixed(1)}</text></g>`;}
 s+=`<path d="M${x(0)} 60V560 M80 ${y(0)}H580" stroke="#a1b4ca" fill="none"/><g clip-path="url(#${id})">`;
 for(const c of curves){const ps=c.points;let d=ps.map((p,i)=>(i?'L':'M')+x(p[0]).toFixed(2)+' '+y(p[1]).toFixed(2)).join(' ');s+=`<path d="${d}" stroke="${c.color}" stroke-width="2.6" fill="none"/>`;
 for(let i=5;i<ps.length-2;i+=75){let a=ps[i],b=ps[i+2],dist=Math.hypot(x(b[0])-x(a[0]),y(b[1])-y(a[1]));if(dist<.8||Math.abs(a[0])>span||Math.abs(a[1])>span)continue;
 s+=`<path d="M${x(a[0])} ${y(a[1])}L${x(b[0])} ${y(b[1])}" stroke="${c.color}" stroke-width="2.3" marker-end="url(#${id}-a)"/>`;}}
 for(const p of dots){let xx=x(p.x),yy=y(p.y);
 if(p.cross)s+=`<path d="M${xx-7} ${yy-7}L${xx+7} ${yy+7}M${xx-7} ${yy+7}L${xx+7} ${yy-7}" stroke="${p.color}" stroke-width="3"/>`;
 else s+=`<circle cx="${xx}" cy="${yy}" r="6" fill="${p.color}" stroke="#101b2b" stroke-width="2"/>`;
 if(p.label)s+=`<text x="${xx+10}" y="${yy-10}" fill="${p.color}" font-size="16">${p.label}</text>`;}
 s+=`</g><text x="330" y="625" text-anchor="middle" fill="#eef6ff" font-size="17">${axes[0]}</text><text x="82" y="53" fill="#dbe9fa" font-size="15">${axes[1]}</text></svg>`;return s;
}
function mount(node){
 const id=++serial,initial=node.dataset.model||'cubic';
 node.innerHTML=`<div class="nyq-controls"><label>模型 <select data-model><option value="cubic">L=K/(s+1)³，P=0</option><option value="unstable">L=K/(s−1)，P=1</option></select></label><label>增益 K <output data-kout></output><input data-k type="range" min="0.1" max="16" step="0.1" value="4"></label><label>当前正频率 ω / rad·s⁻¹ <output data-wout></output><input data-frequency type="range" min="-3" max="3" step="0.01" value="0"></label><label><input data-zoom type="checkbox" checked> 放大 −1 附近（超出视野部分被裁切）</label></div><div data-presets class="nyq-presets"></div><div class="nyq-stats" data-stats aria-live="polite"></div><div class="nyq-panels"><div data-curve></div><div data-poles></div></div><p data-readout class="nyq-readout" aria-live="polite"></p><p class="demo-note">蓝色：正频率（0 → +∞）；橙色：负频率（−∞ → 0）；箭头沿完整轮廓行进。粉色是 −1，黄色点是当前频率。两图坐标与单位不同，各图保持横纵等比例。曲线采用有限频率近似；边界按解析条件单独处理。</p>`;
 const model=node.querySelector('[data-model]'),k=node.querySelector('[data-k]'),f=node.querySelector('[data-frequency]'),zoom=node.querySelector('[data-zoom]');model.value=initial;
 function preset(){const vals=model.value==='cubic'?[4,8,12]:[.5,1,2];node.querySelector('[data-presets]').innerHTML=vals.map(v=>`<button type="button" data-preset="${v}">K=${v}${v===8||v===1?' · 边界':''}</button>`).join('');node.querySelectorAll('[data-preset]').forEach(b=>b.addEventListener('click',()=>{k.value=b.dataset.preset;draw();}));}
 function draw(){
 const m=model.value,K=+k.value,w=10**(+f.value),boundary=Math.abs(K-(m==='cubic'?8:1))<1e-8;
 const {pos,neg}=sample(m,K),P=m==='cubic'?0:1,poles=roots(m,K),Z=poles.filter(p=>p[0]>1e-8).length,N=boundary?null:winding(pos,neg),point=value(m,K,w);
 node.querySelector('[data-kout]').textContent=K.toFixed(2);node.querySelector('[data-wout]').textContent=w.toFixed(3);
 const span=zoom.checked?2.4:Math.max(2.4,K*1.1);
 node.querySelector('[data-curve]').innerHTML=svg('nyqc-'+id,'环路 Nyquist 图 · L 平面',span,[{points:pos,color:'#5cdbd3'},{points:neg,color:'#ffb86b'}],[{x:-1,y:0,color:'#ff86af',label:'−1'},{x:point[0],y:point[1],color:'#ffe07d',label:'ω'}],['Re L(jω)','Im L(jω)']);
 const range=Math.max(2,...poles.map(p=>Math.max(Math.abs(p[0]),Math.abs(p[1]))))*1.25;
 node.querySelector('[data-poles]').innerHTML=svg('nyqp-'+id,'闭环极点 · s 平面',range,[],poles.map(p=>({x:p[0],y:p[1],color:p[0]>1e-8?'#ff86af':Math.abs(p[0])<=1e-8?'#ffe07d':'#5cdbd3',cross:true})),['Re(s) / s⁻¹','Im(s) / s⁻¹']);
 const words=boundary?'边界：有虚轴根，非渐近稳定':Z===0?'严格稳定（本例完整模型）':'不稳定：有右半平面闭环根';
 node.querySelector('[data-stats]').textContent=`P=${P} ｜ N=${boundary?'穿过 −1，不定义普通环绕数':N} ｜ Z=${Z} ｜ ${words}`;
 node.querySelector('[data-readout]').textContent=`当前 L(jω) = ${point[0].toFixed(4)} ${point[1]<0?'−':'+'} ${Math.abs(point[1]).toFixed(4)}j\n闭环极点：${poles.map(p=>`${p[0].toFixed(3)}${p[1]<0?'−':'+'}${Math.abs(p[1]).toFixed(3)}j`).join('；')}\n${boundary?'此处不能用普通环绕数套判据；请看解析特征根。':`完整采样路径得到 N=${N}；独立求根得到 Z=${Z}，核对 P+N=${P+N}。`}`;
 }
 model.addEventListener('change',()=>{k.value=model.value==='cubic'?4:2;preset();draw();});k.addEventListener('input',draw);f.addEventListener('input',draw);zoom.addEventListener('change',draw);k.value=initial==='cubic'?4:2;preset();draw();
}
window.NoteDemos.register('nyquist-explorer',mount);
window.NyquistTeachingMath={value,roots,sample,winding};
})();
