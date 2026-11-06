# 第 32 课公式手册：机器人控制器综合设计

## 误差与 PID

$$
e=q_d-q
$$

$$
\tau_{raw}=K_pe+K_i z-K_d\dot q_f
$$

D 作用于测量速度时，目标阶跃不直接产生微分尖峰。

## 限幅

$$
\tau=\operatorname{sat}(\tau_{raw},-\tau_{max},+\tau_{max})
$$

## 离散积分与滤波

$$
z_k=z_{k-1}+e_kT_s
$$

$$
v_k^f=\alpha v_{k-1}^f+(1-\alpha)v_k^{raw},\qquad
\alpha=e^{-T_s/\tau_f}
$$

## 简化机械对象

$$
J\ddot q+b\dot q=\tau-d
$$

$J$ 为转动惯量，$b$ 为等效阻尼，$d$ 为负载或其他扰动。
