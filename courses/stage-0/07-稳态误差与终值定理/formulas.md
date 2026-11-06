# 第 7 课：稳态误差与终值定理 · 公式手册


$$
E=\frac{R}{1+L},\qquad e_{ss}=\lim_{s\to0}sE(s).
$$


E 为误差的拉普拉斯变换，R 为参考输入变换，$L=CG$ 为单位负反馈环路。终值定理需满足相应极点条件；还应排查隐藏不稳定模态。


$$
K_p=\lim_{s\to0}L(s),\quad K_v=\lim_{s\to0}sL(s),\quad K_a=\lim_{s\to0}s^2L(s).
$$


分别用于单位阶跃、斜坡、抛物线的误差分析。对于其他幅值，误差按参考输入幅值缩放。型别由环路在原点的净极点数确定，不能直接代表闭环稳定性。


## 数值应用与适用条件

单位负反馈、零初态、稳定 I 型环路；误差单位与参考单位相同。

$$
\begin{aligned}
E(s)&=\frac{s+1}{s(s^2+s+4)},\\
\omega_d&=\frac{\sqrt{15}}2,\\
e(t)&=\frac14+e^{-t/2}\left[-\frac14\cos(\omega_dt)+\frac{7}{8\omega_d}\sin(\omega_dt)\right].
\end{aligned}
$$
