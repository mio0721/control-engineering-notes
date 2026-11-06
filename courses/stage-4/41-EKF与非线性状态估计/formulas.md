# EKF与非线性状态估计：公式与条件

> EKF 用非线性函数推进状态，用局部 Jacobian 推进协方差。角度残差须先包裹，模型离散化与线性化的时序要一致。

## 符号与单位

- **f、h**：离散非线性状态函数与测量函数。
- **F、H**：对应 Jacobian，分别在上一后验和当前先验附近求值。
- **X、Y、ψ**：后轴位姿，单位 m、m、rad。
- **v、δ、L**：速度 m/s、转角 rad、轴距 m。
- **Q、R**：离散过程和测量噪声协方差。

## 公式组 1

$$
x_k=f(x_{k-1},u_{k-1})+w_{k-1},\qquad z_k=h(x_k)+v_k,
$$

## 公式组 2

$$
\hat x_k^-=f(\hat x_{k-1}^+,u_{k-1}),\quad
F_k=\left.\frac{\partial f}{\partial x}\right|_{\hat x_{k-1}^+,u_{k-1}},\quad
P_k^-=F_kP_{k-1}^+F_k^{\mathsf T}+Q.
$$

## 公式组 3

$$
f(x,u)=\begin{bmatrix}
X+T_sv\cos\psi\\Y+T_sv\sin\psi\\\psi+T_sv\tan\delta/L
\end{bmatrix},\qquad
F=\begin{bmatrix}1&0&-T_sv\sin\psi\\0&1&T_sv\cos\psi\\0&0&1\end{bmatrix}.
$$

## 公式组 4

$$
\Delta X\approx0.173205\ \mathrm m,\quad\Delta Y=0.1\ \mathrm m,\quad
\Delta\psi\approx0.008027\ \mathrm{rad}.
$$

## 公式组 5

$$
\nu_\psi=\operatorname{atan2}(\sin(z_\psi-\hat\psi^-),\cos(z_\psi-\hat\psi^-)).
$$

## 使用前核对

符号、维数、单位和下标沿用本课正文。推导中的噪声独立性、局部近似和输入约束是结论的一部分。
