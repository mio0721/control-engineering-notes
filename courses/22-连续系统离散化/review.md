# 第 22 课：连续系统离散化 · 复习

> 阶段 2 · 理解零阶保持、精确离散模型与Euler近似，并把采样周期带入计算。

$$
A_d=e^{AT_s},\quad B_d=\int_0^{T_s}e^{A\sigma}B\,d\sigma.
$$

Tₛ为以s计的采样周期，Ad为n×n，Bd为n×m；零阶保持并假设无额外延迟。A可逆时Bd=A⁻¹(Ad−I)B；不可逆时使用积分或增广指数。

$$
\exp\left(\begin{bmatrix}A&B\\0&0\end{bmatrix}T_s\right)=\begin{bmatrix}A_d&B_d\\0&I\end{bmatrix}.
$$

连续渐近稳定对应精确离散特征值在单位圆内；Euler只在合适步长内保持相应性质。

## 应用自查

1. 将ẋ=−x+2u以Ts=0.2精确离散。
2. 双积分器Ts=0.1时写Ad、Bd。
3. 为什么原点特征值使含A⁻¹公式失效，却不妨碍精确离散？
4. Euler模拟发散是否证明连续对象不稳定？

<details><summary>展开提示</summary>

1. 对 $\dot x=-x+2u$、$T_s=0.2\,\mathrm{s}$，精确离散结果为

$$
A_d=e^{-T_s}=e^{-0.2}\approx0.81873,\qquad B_d=2(1-e^{-T_s})=2(1-e^{-0.2})\approx0.36254.
$$

2. 双积分器取 $T_s=0.1\,\mathrm{s}$：

$$
A_d=\begin{bmatrix}1&0.1\\0&1\end{bmatrix},\qquad B_d=\begin{bmatrix}0.005\\0.1\end{bmatrix}.
$$

4. 不能，要区分对象与数值算法。

</details>
