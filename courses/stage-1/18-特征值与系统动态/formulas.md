# 第 18 课：特征值与系统动态 · 公式手册


$$
Av=\lambda v,\quad v\ne0;\qquad \det(\lambda I-A)=0.
$$


$A$ 为状态矩阵，$I$ 为单位矩阵，$\lambda$ 为特征值，$v$ 为特征向量。连续特征值的量纲为时间的倒数。


$$
x(t)=ce^{\lambda t}v\quad\text{当 }x(0)=cv.
$$


若矩阵有足够独立特征向量，可叠加各模态；矩阵指数表达对一般方阵也成立。连续渐近稳定要求全部实部严格负，离散渐近稳定要求全部模长严格小于 1。边界根要另行分析。


## 数值应用与适用条件

连续自治线性系统；所选A可对角化，初态方向直接决定模态系数。

$$
x(0)=c_1v_1+c_2v_2.
$$

$$
\begin{aligned}
x_a(0)&=\begin{bmatrix}1\\0\end{bmatrix},&q_a(t)&=2e^{-t}-e^{-2t},\\
x_b(0)&=\begin{bmatrix}1\\-2\end{bmatrix},&q_b(t)&=e^{-2t}.
\end{aligned}
$$
