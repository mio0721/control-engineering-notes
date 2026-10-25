/* 可复用演示：任何课程只需 :::demo response j=1 kp=16 kd=8 即可引用。 */
(function(){
  'use strict';
  window.NoteDemos.register('response',function(node,u){
    u.mountPD(node,{
      title:'交互演示｜单关节角度阶跃响应',
      caption:'蓝线表示关节角度，灰色虚线是 90° 目标。调节时间在 6 秒观察窗口内估计。',
      render(canvas,J,Kp,Kd){
        const {ctx,w,h}=u.canvasReady(canvas),pts=u.solve(J,Kp,Kd);
        const pad={l:43,r:13,t:18,b:31},pw=w-pad.l-pad.r,ph=h-pad.t-pad.b;
        const ymax=Math.max(110,Math.ceil((Math.max(...pts.map(p=>p[1]))+8)/20)*20);
        const X=x=>pad.l+x/6*pw,Y=y=>pad.t+(ymax-y)/ymax*ph;
        ctx.font='11px system-ui';ctx.lineWidth=1;ctx.textAlign='right';
        for(let y=0;y<=ymax;y+=ymax/4){
          ctx.strokeStyle=u.color('#e9ecee','#3c4855');ctx.beginPath();ctx.moveTo(pad.l,Y(y));ctx.lineTo(w-pad.r,Y(y));ctx.stroke();
          ctx.fillStyle=u.color('#66717e','#a2b0bf');ctx.fillText(y.toFixed(0)+'°',pad.l-8,Y(y)+4);
        }
        ctx.textAlign='center';for(let t=0;t<=6;t++){ctx.fillStyle=u.color('#66717e','#a2b0bf');ctx.fillText(t+'s',X(t),h-10);}
        ctx.setLineDash([5,4]);ctx.strokeStyle=u.color('#9aadb9','#8295a8');ctx.beginPath();ctx.moveTo(X(0),Y(90));ctx.lineTo(X(6),Y(90));ctx.stroke();ctx.setLineDash([]);
        ctx.lineWidth=2.2;ctx.strokeStyle=u.color('#285f9a','#85bafb');ctx.beginPath();
        pts.forEach(([t,y],i)=>i?ctx.lineTo(X(t),Y(y)):ctx.moveTo(X(t),Y(y)));ctx.stroke();
        const mp=Math.max(0,Math.max(...pts.map(p=>p[1]))-90)/90*100;
        let last=-1;for(let i=0;i<pts.length;i++)if(Math.abs(pts[i][1]-90)>1.8)last=i;
        const ts=last===pts.length-1?'超过 6 s':pts[Math.max(0,last+1)][0].toFixed(2)+' s';
        return [`超调 ≈ ${mp.toFixed(1)}%`,`2% 调节时间：${ts}`];
      }
    });
  });
})();
