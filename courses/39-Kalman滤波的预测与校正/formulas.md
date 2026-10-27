# Kalman滤波的预测与校正：公式与条件

> 一次循环包含状态预测、协方差预测、创新、增益和后验更新。位置测量可通过交叉协方差修正速度。

## 符号与单位

- **A、B、H**：离散状态转移、输入与测量矩阵。
- **P−、P+**：当前测量校正前后的状态误差协方差。
- **ν、S**：创新及其协方差；ν 的单位与测量一致。
- **K**：Kalman 增益，维数为状态数乘测量数。
- **Q、R**：过程与测量噪声协方差，须检查独立性假设。

## 公式组 1

$$
\hat x_k^-=A\hat x_{k-1}^++Bu_{k-1},\qquad
P_k^-=AP_{k-1}^+A^{\mathsf T}+Q.
$$

## 公式组 2

$$
\nu_k=z_k-H\hat x_k^-,\qquad S_k=HP_k^-H^{\mathsf T}+R,\qquad
K_k=P_k^-H^{\mathsf T}S_k^{-1},\qquad
\hat x_k^+=\hat x_k^-+K_k\nu_k.
$$

## 公式组 3

$$
A=\begin{bmatrix}1&1\\0&1\end{bmatrix},\quad H=\begin{bmatrix}1&0\end{bmatrix},\quad
\hat x_0^+=\begin{bmatrix}0\\1\end{bmatrix},\quad P_0^+=I,\quad Q=0.1I,\quad R=0.25.
$$

## 公式组 4

$$
\hat x_1^-=\begin{bmatrix}1\\1\end{bmatrix},\quad
P_1^-=\begin{bmatrix}2.1&1\\1&1.1\end{bmatrix}.
$$

## 公式组 5

$$
\nu_1=0.2,\quad S_1=2.35,\quad
K_1=\begin{bmatrix}0.893617\\0.425532\end{bmatrix},\quad
\hat x_1^+=\begin{bmatrix}1.178723\\1.085106\end{bmatrix}.
$$

## 公式组 6

$$
P_k^+=(I-K_kH)P_k^-(I-K_kH)^{\mathsf T}+K_kRK_k^{\mathsf T}.
$$

## 公式组 7

$$
P_1^+\approx\begin{bmatrix}0.223404&0.106383\\0.106383&0.674468\end{bmatrix}.
$$

## 使用前核对

符号、维数、单位和下标沿用本课正文。推导中的噪声独立性、局部近似和输入约束是结论的一部分。
