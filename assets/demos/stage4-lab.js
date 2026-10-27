(function(){
'use strict';
window.NoteDemos.register('stage4-lab',function(node,utils){
 const isKF=node.dataset.mode==='kf';
 const controls=isKF?[['q','模型 Q',.001,.1,.001,.01],['r','测量 R',.005,1,.005,.09]]:[['n','预测步数 N',3,25,1,10],['r','输入权重 R',.1,3,.1,.5],['bound','输入幅值上限',.1,1,.05,.4]];
 node.innerHTML='<p class="demo-title">'+(isKF?'随机游走 Kalman 滤波':'标量积分器的箱约束 MPC')+'</p><p class="demo-note">'+(isKF?'固定同一份随机数据：真实过程方差 0.01、真实测量方差 0.09；滑块改变滤波器假设。':'x[k+1]=x[k]+u[k]，目标为零，第10拍额外加入 +0.3 状态扰动；投影梯度近似求解，无终端稳定性设计。')+'</p><div class="demo-controls"></div><canvas class="demo-canvas" role="img" aria-label="估计与控制数值实验曲线"></canvas><div class="demo-meta" aria-live="polite"></div><p class="demo-caption">'+(isKF?'蓝线是真值，灰线是测量，橙线是估计；数据保持不变，便于比较参数。':'蓝线为实际状态，橙线为逐拍执行输入。放宽约束、增大时域与改变输入惩罚会共同改变策略。')+'</p>';
 const inputs={};
 controls.forEach(([key,label,min,max,step,value])=>{
  const box=document.createElement('div');box.className='control';
  box.innerHTML='<label>'+label+'<output></output></label><input type="range" min="'+min+'" max="'+max+'" step="'+step+'" value="'+value+'">';
  node.querySelector('.demo-controls').appendChild(box);inputs[key]=box.querySelector('input');inputs[key].addEventListener('input',draw);
 });
 function noise(){let state=7;return ()=>{state=(1664525*state+1013904223)>>>0;const a=(state+1)/4294967297;state=(1664525*state+1013904223)>>>0;const b=(state+1)/4294967297;return Math.sqrt(-2*Math.log(a))*Math.cos(2*Math.PI*b);};}
 const normal=noise(),truth=[],measure=[];let tx=0;
 for(let k=0;k<100;k++){tx+=.1*normal();truth.push(tx);measure.push(tx+.3*normal());}
 function draw(){
  const p={};Object.entries(inputs).forEach(([key,input])=>{p[key]=+input.value;input.parentElement.querySelector('output').textContent=input.value;});
  let series=[],meta=[];
  if(isKF){let x=0,P=1,lastK=0;const est=[];
   for(let k=0;k<truth.length;k++){P+=p.q;lastK=P/(P+p.r);x+=lastK*(measure[k]-x);P=(1-lastK)*P;est.push(x);}
   const rmse=Math.sqrt(est.reduce((sum,x,k)=>sum+(x-truth[k])**2,0)/est.length);
   series=[{values:measure,color:'#8a939f'},{values:truth,color:utils.color('#2878b5','#8fc7f1')},{values:est,color:'#e07a35'}];meta=['估计 RMSE '+rmse.toFixed(3),'末次增益 '+lastK.toFixed(3),'后验方差 '+P.toFixed(4)];
  }else{
   const N=p.n,alpha=1/(2*(N*(N+1)/2+p.r)),clip=x=>Math.max(-p.bound,Math.min(p.bound,x));let state=1,U=Array(N).fill(0),maxResidual=0;const xs=[],us=[];
   for(let k=0;k<35;k++){
    if(k===10)state+=.3;xs.push(state);
    let residual=0;
    for(let it=0;it<900;it++){
     let acc=state;const predicted=U.map(u=>(acc+=u));let suffix=0;const grad=Array(N);
     for(let j=N-1;j>=0;j--){suffix+=predicted[j];grad[j]=2*(suffix+p.r*U[j]);}
     const next=U.map((u,j)=>clip(u-alpha*grad[j]));residual=Math.max(...next.map((u,j)=>Math.abs(u-U[j])))/alpha;U=next;if(residual<1e-5)break;
    }
    maxResidual=Math.max(maxResidual,residual);us.push(U[0]);state+=U[0];U=U.slice(1).concat(U[N-1]);
   }
   series=[{values:xs,color:utils.color('#2878b5','#8fc7f1')},{values:us,color:'#e07a35'}];meta=['最大执行输入 '+Math.max(...us.map(Math.abs)).toFixed(3),'末拍状态 '+xs[xs.length-1].toFixed(4),'最大投影残差 '+maxResidual.toExponential(1)];
  }
  const {ctx,w,h}=utils.canvasReady(node.querySelector('canvas'));ctx.clearRect(0,0,w,h);
  const all=series.flatMap(s=>s.values),min=Math.min(0,...all)-.1,max=Math.max(.1,...all)+.1,pad={l:45,r:14,t:16,b:28};
  const X=k=>pad.l+k/(series[0].values.length-1)*(w-pad.l-pad.r),Y=v=>pad.t+(max-v)/(max-min)*(h-pad.t-pad.b);
  ctx.font='11px system-ui';ctx.textAlign='right';
  for(let i=0;i<=4;i++){let value=min+(max-min)*i/4;ctx.strokeStyle=utils.color('#e1e6ec','#3d4856');ctx.beginPath();ctx.moveTo(pad.l,Y(value));ctx.lineTo(w-pad.r,Y(value));ctx.stroke();ctx.fillStyle=utils.color('#687786','#b2becb');ctx.fillText(value.toFixed(2),pad.l-5,Y(value)+3);}
  series.forEach(s=>{ctx.strokeStyle=s.color;ctx.lineWidth=s===series[0]&&isKF?1:2;ctx.beginPath();s.values.forEach((v,k)=>k?ctx.lineTo(X(k),Y(v)):ctx.moveTo(X(k),Y(v)));ctx.stroke();});
  ctx.textAlign='center';ctx.fillText('采样序号 k',w/2,h-6);node.querySelector('.demo-meta').replaceChildren(...meta.map(t=>{const s=document.createElement('span');s.textContent=t;return s;}));
 }
 window.addEventListener('robot-theme-changed',draw);if(typeof ResizeObserver!=='undefined')new ResizeObserver(draw).observe(node.querySelector('canvas'));else window.addEventListener('resize',draw);draw();
});
})();
