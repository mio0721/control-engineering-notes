# 第 36 课：滑模控制与抖振

> 阶段 3 · 从模型与条件出发，推导可核对的稳定性结论。

## 1. 把误差压到一条线附近

考虑匹配不确定性模型 $\ddot q=f(q,v)+u+d$，假设 $|d|\le D$，且 $f$ 已知。输入已按单位惯量归一化。定义

$$
e=q-q_d,\qquad s=\dot e+\lambda e,\qquad\lambda>0.
$$

若 $s=0$，则 $\dot e=-\lambda e$，误差沿这条滑模面指数衰减。

## 2. 推导控制律与到达条件

选择

$$
u=-f+\ddot q_d-\lambda\dot e-k\operatorname{sign}(s).
$$

令 $V_s=s^2/2$，当 $s\ne0$ 时

$$
\dot V_s=s(d-k\operatorname{sign}s)\le-(k-D)|s|.
$$

因此选择 $k>D$，可保证理想到达过程；到达时间不超过 $|s(0)|/(k-D)$。原点处的切换须按理想滑模的微分包含理解，普通程序中的 sign(0)=0 并不完整代表等效控制。

## 3. 数值例子

取 $D=0.2,k=0.5,\lambda=2,e(0)=1,\dot e(0)=0$，则 $s(0)=2$，到达时间界为 $2/0.3\approx6.67$ s。该界保守，且建立在扰动上界、无饱和及理想连续切换假设上。

## 4. 为什么会抖振？

采样、时延、测量噪声和执行器带宽使切换不能无限快。常用边界层近似

$$
\operatorname{sat}(s/\phi)=\begin{cases}-1&s<-\phi\\s/\phi&|s|\le\phi\\1&s>\phi\end{cases},\qquad\phi>0.
$$

边界层减小切换冲击，但一般带来最终误差。若保持 $|s|\le\phi$，由一阶误差方程可得 $\limsup|e|\le\phi/\lambda$；这不等同于整个带扰动系统自动满足该边界层条件。

## 5. 实现与自测

```matlab
phi=.1;lambda=2;k=.5;
f=@(t,x)[x(2);-lambda*x(2)-k*max(-1,min(1,(x(2)+lambda*x(1))/phi))+.2*sin(t)];
[t,X]=ode45(f,[0 15],[1;0]);plot(t,X(:,1));grid on;
```

增大 $k$ 会加强到达作用，也增加输入切换幅度。若扰动上界未知或输入受限，不能沿用这里的保证。


## 图示核对

![边界层滑模误差](media/example.svg)

使用饱和函数近似切换，示例扰动为 0.2 sin(t)。
