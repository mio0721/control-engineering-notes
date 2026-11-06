# 第 24 课：线性系统的Lyapunov稳定性 · 复习

> 阶段 2 · 从能量直觉走到正定矩阵与严格衰减，学习线性稳定性的另一种证明。

$$
V=x^{\mathsf T}Px,\quad P=P^{\mathsf T}>0,\quad A^{\mathsf T}P+PA=-Q,\quad Q>0.
$$

$V$ 为二次型，$P,Q\in\mathbb R^{n\times n}$ 为对称正定矩阵；$A$ 为连续状态矩阵。本课讨论零输入线性自治系统。

$$
\dot V=-x^{\mathsf T}Qx,\qquad V(t)\le V(0)e^{-\lambda_{\min}(Q)t/\lambda_{\max}(P)}.
$$

指数界为充分的上界。半负定导数不能在没有其他论证时直接宣称渐近稳定。

## 应用自查

1. 用矩阵乘法核对本课P确实满足Q=I。
2. 为什么P所有元素为正不能作为正定判据？举一个2×2反例。
3. 能量导数在v=0处为零，为什么不能立刻说状态不再变化？
4. 若A换成aA且a>0，原P对应的Q怎样变化？

<details><summary>展开提示</summary>

1.

$$
A^{\mathsf T}P+PA=-I.
$$

2. 例如

$$
P=\begin{bmatrix}1&2\\2&1\end{bmatrix},\qquad\det P=-3<0,
$$

所以它虽所有元素为正，却不是正定矩阵。3. 当 $q\ne0$、$v=0$ 时，$\dot q=0$ 但 $\dot v=-2q\ne0$，状态会离开该轴。4. 若 $A$ 换成 $aA$ 且 $a>0$，则 $Q$ 变成 $aI$。

</details>
