# 第 22 课：连续系统离散化 · 公式手册

$$
A_d=e^{AT_s},\quad B_d=\int_0^{T_s}e^{A\sigma}B\,d\sigma.
$$

Tₛ为以s计的采样周期，Ad为n×n，Bd为n×m；零阶保持并假设无额外延迟。A可逆时Bd=A⁻¹(Ad−I)B；不可逆时使用积分或增广指数。

$$
\exp\left(\begin{bmatrix}A&B\\0&0\end{bmatrix}T_s\right)=\begin{bmatrix}A_d&B_d\\0&I\end{bmatrix}.
$$

连续渐近稳定对应精确离散特征值在单位圆内；Euler只在合适步长内保持相应性质。
