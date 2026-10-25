/* 共享交互基础设施：课程页面按需加载各 demo 的普通脚本，兼容 file:// 离线打开。 */
(function(){
  'use strict';
  const registry = new Map();
  const DEG = 180/Math.PI;
  function color(light,dark){return document.documentElement.dataset.theme==='dark'?dark:light;}
  function poleRoots(J,Kp,Kd){
    const d=Kd*Kd-4*J*Kp;
    return d>=0 ? [{re:(-Kd+Math.sqrt(d))/(2*J),im:0},{re:(-Kd-Math.sqrt(d))/(2*J),im:0}]
      : [{re:-Kd/(2*J),im:Math.sqrt(-d)/(2*J)},{re:-Kd/(2*J),im:-Math.sqrt(-d)/(2*J)}];
  }
  function solve(J,Kp,Kd){
    let q=0,v=0,t=0;const dt=.008,out=[],qr=Math.PI/2;
    const rhs=(a,b)=>[b,(Kp*(qr-a)-Kd*b)/J];
    for(let i=0;i<=750;i++){
      out.push([t,q*DEG]);
      const a=rhs(q,v),b=rhs(q+dt*a[0]/2,v+dt*a[1]/2),c=rhs(q+dt*b[0]/2,v+dt*b[1]/2),d=rhs(q+dt*c[0],v+dt*c[1]);
      q+=dt*(a[0]+2*b[0]+2*c[0]+d[0])/6;
      v+=dt*(a[1]+2*b[1]+2*c[1]+d[1])/6;t+=dt;
    }
    return out;
  }
  function canvasReady(canvas){
    const w=Math.max(canvas.clientWidth,260),h=canvas.clientHeight||245,dpr=window.devicePixelRatio||1;
    canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);
    const ctx=canvas.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);return {ctx,w,h};
  }
  function mountPD(node, options){
    const J0=Number(node.dataset.j||1),Kp0=Number(node.dataset.kp||16),Kd0=Number(node.dataset.kd??8);
    node.innerHTML=`<p class="demo-title">${options.title}</p><p class="demo-note">理想单关节模型，目标 90°、初始角度及速度为零；本地浏览器计算。</p>
      <div class="demo-controls">
      <div class="control"><label>J（kg·m²）<output data-out="j"></output></label><input data-param="j" type="range" min="0.5" max="5" step="0.5"></div>
      <div class="control"><label>Kp（N·m/rad）<output data-out="kp"></output></label><input data-param="kp" type="range" min="2" max="36" step="2"></div>
      <div class="control"><label>Kd（N·m·s/rad）<output data-out="kd"></output></label><input data-param="kd" type="range" min="0" max="24" step="1"></div>
      </div><canvas class="demo-canvas" role="img" aria-label="互动数学模型的曲线"></canvas>
      <div class="demo-meta" aria-live="polite"></div><div class="demo-caption">${options.caption}</div>`;
    const inputs={};node.querySelectorAll('input').forEach(el=>inputs[el.dataset.param]=el);
    inputs.j.value=String(J0);inputs.kp.value=String(Kp0);inputs.kd.value=String(Kd0);
    const canvas=node.querySelector('canvas'),meta=node.querySelector('.demo-meta');
    function draw(){
      const J=+inputs.j.value,Kp=+inputs.kp.value,Kd=+inputs.kd.value;
      for(const name of ['j','kp','kd'])node.querySelector('[data-out="'+name+'"]').textContent=inputs[name].value;
      const z=Kd/(2*Math.sqrt(J*Kp)),wn=Math.sqrt(Kp/J);
      const details=options.render(canvas,J,Kp,Kd);
      meta.replaceChildren();
      for(const str of [`阻尼比 ζ = ${z.toFixed(3)}`,`ωn = ${wn.toFixed(3)} rad/s`,...details]){
        const s=document.createElement('span');s.textContent=str;meta.appendChild(s);
      }
    }
    Object.values(inputs).forEach(el=>el.addEventListener('input',draw));
    window.addEventListener('robot-theme-changed',draw);
    if(typeof ResizeObserver!=='undefined')new ResizeObserver(draw).observe(canvas);
    else window.addEventListener('resize',draw);
    draw();
  }
  window.NoteDemos={register(name,mount){
    if(registry.has(name))throw new Error('重复的演示名称：'+name);
    registry.set(name,mount);
  }, utils:{color,poleRoots,solve,canvasReady,mountPD}};
  function boot(){
    document.querySelectorAll('.demo[data-demo]').forEach(node=>{
      const name=node.dataset.demo;
      try{
        if(!registry.has(name))throw new Error(`模块「${name}」没有注册`);
        registry.get(name)(node,window.NoteDemos.utils);
      }catch(err){
        node.textContent=`演示加载失败（${name}）：${err.message}。正文和公式仍可阅读。`;
        node.classList.add('demo-error');console.error(err);
      }
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
