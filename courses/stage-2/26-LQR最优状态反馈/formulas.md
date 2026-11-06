# 第 26 课：LQR最优状态反馈 · 公式手册

$$
J=\int_0^\infty(x^{\mathsf T}Qx+u^{\mathsf T}Ru)dt,\quad Q=Q^{\mathsf T}\ge0,\ R=R^{\mathsf T}>0.
$$

$$
A^{\mathsf T}P+PA-PBR^{-1}B^{\mathsf T}P+Q=0,\quad K=R^{-1}B^{\mathsf T}P.
$$

P取稳定化解；标准充分条件包括(A,B)可稳定及(Q¹ᐟ²,A)可检测。Q、R维度分别n×n、m×m。J是代价，不是机械惯量。

$$
k_1=\sqrt{q_1/r},\quad k_2=\sqrt{q_2/r+2k_1}\quad\text{（双积分器、对角Q、标量R）}.
$$

