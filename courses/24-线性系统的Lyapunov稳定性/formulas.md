# 第 24 课：线性系统的Lyapunov稳定性 · 公式手册

$$
V=x^{\mathsf T}Px,\quad P=P^{\mathsf T}>0,\quad A^{\mathsf T}P+PA=-Q,\quad Q>0.
$$

$V$ 为二次型，$P,Q\in\mathbb R^{n\times n}$ 为对称正定矩阵；$A$ 为连续状态矩阵。本课讨论零输入线性自治系统。

$$
\dot V=-x^{\mathsf T}Qx,\qquad V(t)\le V(0)e^{-\lambda_{\min}(Q)t/\lambda_{\max}(P)}.
$$

$$
\|x(t)\|\le\sqrt{\frac{\lambda_{\max}(P)}{\lambda_{\min}(P)}}e^{-\lambda_{\min}(Q)t/[2\lambda_{\max}(P)]}\|x(0)\|.
$$

指数界为充分的上界。半负定导数不能在没有其他论证时直接宣称渐近稳定。
