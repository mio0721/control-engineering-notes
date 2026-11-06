# 第 33 课公式手册：数字控制循环

## 采样

$$
t_k=kT_s,\qquad f_s=\frac1{T_s}
$$

## 离散 PID

$$
e_k=q_{d,k}-q_k,\qquad z_k=z_{k-1}+e_kT_s
$$

$$
v_k^{raw}=\frac{q_k-q_{k-1}}{T_s}
$$

$$
v_k^f=\alpha v_{k-1}^f+(1-\alpha)v_k^{raw},\qquad
\alpha=e^{-T_s/\tau_f}
$$

$$
u_k^*=K_pe_k+K_i z_k-K_dv_k^f
$$

$$
u_k=\operatorname{sat}(u_k^*,-u_{max},u_{max})
$$

## 零阶保持

$$
u(t)=u_k,\qquad t_k\le t<t_{k+1}
$$

$T_s$ 是控制器更新周期；$dt$ 可以是数值积分步长；$f_s$ 是采样频率；$k$ 是循环序号。
