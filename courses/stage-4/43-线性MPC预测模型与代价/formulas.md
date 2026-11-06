# 线性MPC预测模型与代价：公式与条件

> 预测矩阵来自逐步代入。QP 的 H、g 必须和所采用的 1/2 标准形式一致，终端设计关系到稳定性与可行性。

## 符号与单位

- **A、B**：离散状态与输入矩阵。
- **𝒜、ℬ**：堆叠预测矩阵，维数分别为 Nn×n、Nn×Nm。
- **X、Xr、U**：未来状态、参考与输入序列。
- **Q̄、R̄、Pf**：堆叠状态权重、输入权重与终端权重。
- **H、g**：标准 1/2 系数 QP 中的二次项与线性项。

## 公式组 1

$$
U=\begin{bmatrix}u_{0|k}\\u_{1|k}\\\vdots\\u_{N-1|k}\end{bmatrix},\quad
X=\begin{bmatrix}x_{1|k}\\x_{2|k}\\\vdots\\x_{N|k}\end{bmatrix}=\mathcal A\hat x_k+\mathcal B U.
$$

## 公式组 2

$$
x_{1|k}=A\hat x_k+Bu_{0|k},\qquad
x_{2|k}=A^2\hat x_k+ABu_{0|k}+Bu_{1|k}.
$$

## 公式组 3

$$
\mathcal A=\begin{bmatrix}A\\A^2\end{bmatrix},\qquad
\mathcal B=\begin{bmatrix}B&0\\AB&B\end{bmatrix}.
$$

## 公式组 4

$$
J=(X-X_r)^{\mathsf T}\bar Q(X-X_r)+U^{\mathsf T}\bar R U.
$$

## 公式组 5

$$
H=2(\mathcal B^{\mathsf T}\bar Q\mathcal B+\bar R),\qquad
g=2\mathcal B^{\mathsf T}\bar Q(\mathcal A\hat x_k-X_r).
$$

## 使用前核对

符号、维数、单位和下标沿用本课正文。推导中的噪声独立性、局部近似和输入约束是结论的一部分。
