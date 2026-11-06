# 第 19 课：传递函数到状态空间 · 公式手册


$$
\dot x=Ax+Bu,\quad y=Cx+Du,\quad G(s)=C(sI-A)^{-1}B+D.
$$


n 个状态、m 个输入、p 个输出对应 A 为 n×n、B 为 n×m、C 为 p×n、D 为 p×m；s 为拉普拉斯变量。传递函数按零初始条件定义，模型需为线性时不变系统。


$$
z=Tx,\quad A_z=TAT^{-1},\quad B_z=TB,\quad C_z=CT^{-1}.
$$


T 必须可逆，D 不变。坐标变换不改变物理输入输出关系。


## 数值应用与适用条件

线性关节模型、零初态传递关系、常值输入；位置平衡公式要求k>0。

$$
\dot x=\begin{bmatrix}0&1\\-5&-2\end{bmatrix}x+\begin{bmatrix}0\\0.5\end{bmatrix}u.
$$

$$
\begin{aligned}
G_q(s)&=\frac1{2s^2+4s+10},\\
G_v(s)&=\frac{s}{2s^2+4s+10}.
\end{aligned}
$$

$$
\begin{aligned}
(sI-A)^{-1}B&=\frac1{s^2+2s+5}\begin{bmatrix}s+2&1\\-5&s\end{bmatrix}\begin{bmatrix}0\\0.5\end{bmatrix}\\
&=\frac1{s^2+2s+5}\begin{bmatrix}0.5\\0.5s\end{bmatrix}.
\end{aligned}
$$
