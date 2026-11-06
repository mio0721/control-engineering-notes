# 车辆横向模型与MPC轨迹跟踪：公式与条件

> 先统一后轴参考点和误差正方向。直线小误差模型易于构造 MPC，曲线、倒车和停车必须重新检查模型条件。

## 符号与单位

- **ey、eψ**：左侧为正的横向偏差 m，与实际航向减参考航向 rad。
- **κr、δr**：参考曲率 1/m 与前馈转角 rad。
- **v、L、Ts**：速度 m/s、轴距 m、采样周期 s。
- **Ad、Bd**：直线小误差连续模型的 ZOH 离散矩阵。

## 公式组 1

$$
\dot s=\frac{v\cos e_\psi}{1-\kappa_r e_y},\quad
\dot e_y=v\sin e_\psi,\quad
\dot e_\psi=\frac vL\tan\delta-\kappa_r\dot s.
$$

## 公式组 2

$$
\dot e\approx\begin{bmatrix}0&v\\-v\kappa_r^2&0\end{bmatrix}e+
\begin{bmatrix}0\\v\sec^2\delta_r/L\end{bmatrix}\tilde\delta.
$$

## 公式组 3

$$
A_d=\begin{bmatrix}1&vT_s\\0&1\end{bmatrix},\qquad
B_d=\begin{bmatrix}v^2T_s^2/(2L)\\vT_s/L\end{bmatrix}.
$$

## 使用前核对

符号、维数、单位和下标沿用本课正文。推导中的噪声独立性、局部近似和输入约束是结论的一部分。
