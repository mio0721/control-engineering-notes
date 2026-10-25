/* 第 4 课专属演示：极点平面；自动按课程文件夹加载。 */
(function(){
  'use strict';
  window.NoteDemos.register('poles',function(node,u){
    u.mountPD(node,{
      title:'交互演示｜PD 闭环极点',
      caption:'叉号表示闭环方程的两个极点。实部越靠近零，衰减通常越慢。',
      render(canvas,J,Kp,Kd){
        const {ctx,w,h}=u.canvasReady(canvas),ps=u.poleRoots(J,Kp,Kd);
        const pad={l:41,r:16,t:17,b:29},pw=w-pad.l-pad.r,ph=h-pad.t-pad.b;
        const mreal=Math.max(8,Kd/J+1,2*Math.sqrt(Kp/J)+1),xmin=-Math.ceil(mreal/2)*2,xmax=2;
        const yim=Math.max(5,Math.ceil(Math.sqrt(Kp/J)+1));
        const X=x=>pad.l+(x-xmin)/(xmax-xmin)*pw,Y=y=>pad.t+(yim-y)/(2*yim)*ph;
        ctx.font='11px system-ui';ctx.textAlign='center';ctx.strokeStyle=u.color('#e7eaec','#3c4855');ctx.lineWidth=1;
        for(let x=Math.ceil(xmin/2)*2;x<=2;x+=2){ctx.beginPath();ctx.moveTo(X(x),pad.t);ctx.lineTo(X(x),h-pad.b);ctx.stroke();ctx.fillStyle=u.color('#67737c','#a2b0bf');ctx.fillText(x,X(x),h-9);}
        for(let y=-yim;y<=yim;y+=2){ctx.beginPath();ctx.moveTo(pad.l,Y(y));ctx.lineTo(w-pad.r,Y(y));ctx.stroke();}
        ctx.strokeStyle=u.color('#98a4af','#8496a8');ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(X(0),pad.t);ctx.lineTo(X(0),h-pad.b);ctx.moveTo(pad.l,Y(0));ctx.lineTo(w-pad.r,Y(0));ctx.stroke();
        ctx.fillStyle=u.color('#5e7487','#a2b0bf');ctx.fillText('实部',w-24,h-8);ctx.fillText('虚部',X(0)-22,17);
        ps.forEach(p=>{const x=X(p.re),y=Y(p.im);ctx.strokeStyle=u.color('#b64f52','#ed8b8e');ctx.lineWidth=2.7;ctx.beginPath();ctx.moveTo(x-5,y-5);ctx.lineTo(x+5,y+5);ctx.moveTo(x+5,y-5);ctx.lineTo(x-5,y+5);ctx.stroke();});
        return ['极点：'+ps.map(p=>p.re.toFixed(3)+(p.im>=0?' + ':' − ')+Math.abs(p.im).toFixed(3)+'j').join('；')];
      }
    });
  });
})();
