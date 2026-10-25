# 第 24 课：线性系统的Lyapunov稳定性 · 公式手册

$$
V=x^{\mathsf T}Px,\quad P=P^{\mathsf T}>0,\quad A^{\mathsf T}P+PA=-Q,\quad Q>0.
$$

V为二次型，P、Q为n×n对称正定矩阵；A为连续状态矩阵。本课为零输入线性自治系统。

$$
\dot V=-x^{\mathsf T}Qx,\qquad V(t)\le V(0)e^{-\lambda_{min}(Q)t/\lambda_{max}(P)}.
$$

指数界为充分的上界。半负定导数不能在没有其他论证时直接宣称渐近稳定。
