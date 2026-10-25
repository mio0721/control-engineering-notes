# 第 23 课：可控性与可达状态 · 公式手册

$$
\mathcal C=[B,AB,\ldots,A^{n-1}B],\quad\operatorname{rank}\mathcal C=n.
$$

A为n×n，B为n×m，可控矩阵为n×nm。判据用于有限维线性时不变系统，无输入幅值限制。

$$
W_c(T)=\int_0^T e^{A\sigma}BB^{\mathsf T}e^{A^{\mathsf T}\sigma}\,d\sigma,\quad E_{min}=x_f^{\mathsf T}W_c^{-1}x_f.
$$

最小能量式限定零初态、固定终点、固定时间、无约束且Wc可逆。
