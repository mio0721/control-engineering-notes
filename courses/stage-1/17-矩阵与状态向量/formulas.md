# 第 17 课公式手册：矩阵与状态向量

## 状态与状态变化率

$$
x=\begin{bmatrix}x_1&x_2&\cdots&x_n\end{bmatrix}^{\mathsf T},\qquad
\dot x=\begin{bmatrix}\dot x_1&\dot x_2&\cdots&\dot x_n\end{bmatrix}^{\mathsf T}
$$

- $x_i$：第 $i$ 个状态；单位取决于物理量。
- $\dot x_i$：状态对时间的变化率；单位是“状态单位/秒”。

## 线性状态空间模型

$$
\dot x=Ax+Bu,\qquad y=Cx+Du
$$

- $x\in\mathbb R^n$：$n$ 维状态向量。
- $u\in\mathbb R^m$：$m$ 维输入。
- $y\in\mathbb R^p$：$p$ 维输出。
- $A\in\mathbb R^{n\times n}$：状态如何自行演化。
- $B\in\mathbb R^{n\times m}$：输入如何影响状态变化率。
- $C\in\mathbb R^{p\times n}$：如何从状态形成输出。
- $D\in\mathbb R^{p\times m}$：输入到输出的直接通道。

## 转动弹簧阻尼模型

$$
J\ddot q+b\dot q+kq=\tau,\qquad
x_1=q,\quad x_2=\dot q
$$

$$
A=\begin{bmatrix}0&1\\-k/J&-b/J\end{bmatrix},\qquad
B=\begin{bmatrix}0\\1/J\end{bmatrix}
$$

- $J$：转动惯量，单位 $\mathrm{kg\,m^2}$。
- $b$：阻尼系数，单位 $\mathrm{N\,m\,s/rad}$。
- $k$：等效扭转刚度，单位 $\mathrm{N\,m/rad}$。
- $\tau$：输入力矩，单位 $\mathrm{N\,m}$。
- 该模型假设参数固定、运动范围内可用线性弹簧和黏性阻尼近似。

## 矩阵乘法维度

若 $A$ 是 $n\times n$，$x$ 是 $n\times1$，则 $Ax$ 是 $n\times1$，可与 $\dot x$ 的维度匹配。


## 数值应用与适用条件

两状态顺序为位置、速度；例题输入不为零时要显式加Bu，矩阵交互本身采用零输入。

$$
A=\begin{bmatrix}0&1\\-2&-3\end{bmatrix},\quad
x=\begin{bmatrix}0.5\\-0.2\end{bmatrix},\quad
B=\begin{bmatrix}0\\1\end{bmatrix},\quad u=0.4.
$$

$$
\begin{aligned}
\dot x_1&=0(0.5)+1(-0.2)=-0.2,\\
\dot x_2&=-2(0.5)-3(-0.2)+0.4=0.
\end{aligned}
$$
