# 第 26 课：LQR最优状态反馈 · 复习

> 阶段 2 · 用代价函数明确状态偏差与控制输入的权衡，学习Q、R与Riccati方程。

$$
J=\int_0^\infty(x^{\mathsf T}Qx+u^{\mathsf T}Ru)dt,\quad Q=Q^{\mathsf T}\ge0,\ R=R^{\mathsf T}>0.
$$

$$
A^{\mathsf T}P+PA-PBR^{-1}B^{\mathsf T}P+Q=0,\quad K=R^{-1}B^{\mathsf T}P.
$$

$P$ 取稳定化解；标准充分条件包括 $(A,B)$ 可稳定及 $(Q^{1/2},A)$ 可检测。$Q,R$ 维度分别为 $n\times n$、$m\times m$。$J$ 表示代价，不是机械惯量。

$$
k_1=\sqrt{q_1/r},\quad k_2=\sqrt{q_2/r+2k_1}\quad\text{（双积分器、对角Q、标量R）}.
$$


## 应用自查

1. $q₁=1$、$q₂=2$、$r=1$时求双积分器LQR增益。
2. 为什么Q、R同时乘相同正常数时控制器不变？
3. 两个权重不同的J数值能否直接用来比较优劣？
4. 有力矩限制时，直接截断输入是否仍是无约束LQR原解？

<details><summary>展开提示</summary>

1. $K=[1,2]$。2. 最小化目标整体缩放，不改变最优输入。3. 不能，评价标准变了。4. 不是。

</details>
