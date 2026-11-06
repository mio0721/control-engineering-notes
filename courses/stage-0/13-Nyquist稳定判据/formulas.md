# 第 13 课：Nyquist 稳定判据 · 公式手册

## 方向与计数

$$
N=Z-P,\qquad Z=P+N.
$$

右半平面轮廓取顺时针方向；N 为映射对 −1 的顺时针净环绕数；P 是开环右半平面极点数；Z 是闭环右半平面特征根数。计重数。严格稳定需要 $Z=0$、没有虚轴闭环根，也要排除隐藏不稳定内部模态。虚轴开环极点需修改轮廓；映射穿过 −1 时单独分析边界。

## 模型一：三个开环稳定极点

$$
\begin{aligned}
L(s)&=\frac K{(s+1)^3},\quad K>0,\quad P=0,\\
\omega_{pc}&=\sqrt3\ \mathrm{rad/s},\\
L(j\sqrt3)&=-\frac K8,\\
p_{cl}(s)&=s^3+3s^2+3s+(1+K).
\end{aligned}
$$

正增益严格稳定区间 $0<K<8$；$K=8$ 有虚轴根；$K>8$ 时 $N=2$、$Z=2$。开环 K 改变只缩放曲线，P 不变。

## 模型二：一个开环不稳定极点

$$
\begin{aligned}
L(s)&=\frac K{s-1},\quad K>0,\quad P=1,\\
\operatorname{Re}L(j\omega)&=-\frac K{1+\omega^2},\\
\operatorname{Im}L(j\omega)&=-\frac{K\omega}{1+\omega^2},\\
\left(a+\frac K2\right)^2+b^2&=\left(\frac K2\right)^2,\\
s_{cl}&=1-K.
\end{aligned}
$$

a、b 为曲线实部与虚部。$K>1$ 时圆包含 −1，$N=−1$、$Z=0$，闭环稳定；$0<K<1$ 时 $N=0$、$Z=1$；$K=1$ 为原点闭环根。


## 数值应用与适用条件

沿本课约定的右半平面顺时针轮廓，N以顺时针为正；边界不套普通环绕数。

$$
\begin{aligned}
P=0:&\quad Z=P+N=0,\\
P=1:&\quad Z=P+N=1.
\end{aligned}
$$
