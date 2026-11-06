# Kalman滤波调参与一致性检查：公式与条件

> Q 必须与采样周期和噪声假设一致。调参同时检查误差与不确定性是否匹配，不能仅凭曲线平滑程度判断。

## 符号与单位

- **Ts**：采样周期，单位 s。
- **σa**：区间随机常值加速度标准差，单位 m/s²。
- **qa**：连续白加速度噪声谱密度；单位 m²/s³。
- **P0、Q、R**：初始误差、过程噪声和测量噪声协方差。
- **NIS**：归一化创新平方，无量纲；卡方结论依赖统计模型匹配。

## 公式组 1

$$
G=\begin{bmatrix}T_s^2/2\\T_s\end{bmatrix},\qquad
Q=G\sigma_a^2G^{\mathsf T}
=\sigma_a^2\begin{bmatrix}T_s^4/4&T_s^3/2\\T_s^3/2&T_s^2\end{bmatrix}.
$$

## 公式组 2

$$
Q=\begin{bmatrix}0.00000625&0.000125\\0.000125&0.0025\end{bmatrix}.
$$

## 公式组 3

$$
Q=q_a\begin{bmatrix}T_s^3/3&T_s^2/2\\T_s^2/2&T_s\end{bmatrix}.
$$

## 公式组 4

$$
\operatorname{NIS}_k=\nu_k^{\mathsf T}S_k^{-1}\nu_k.
$$

## 使用前核对

符号、维数、单位和下标沿用本课正文。推导中的噪声独立性、局部近似和输入约束是结论的一部分。
