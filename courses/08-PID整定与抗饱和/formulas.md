# 第 8 课：公式手册——PID 稳定条件与抗饱和

## 1. 理想 PID 闭环特征方程
对象：$J\ddot q=\tau$；误差：$e=q_d-q$；固定目标时：

$$
\tau=K_pe+K_i\int e\,dt-K_d\dot q,\qquad
Js^3+K_ds^2+K_ps+K_i=0
$$

对于 $J,K_p,K_d,K_i>0$ 的该三阶模型，Routh-Hurwitz 条件为：

$$
\boxed{K_dK_p>JK_i}
$$

$J$ 单位 $\mathrm{kg\cdot m^2}$；增益单位须与角度和力矩单位一致。条件仅适用于该理想线性模型。

## 2. 力矩限幅

$$
\tau_{sat}=\operatorname{clip}(\tau_{cmd},-\tau_{max},\tau_{max})
$$

$\tau_{max}$ 是执行器最大力矩。若持续有 $\tau_{cmd}\ne\tau_{sat}$，积分器可能继续累积不可实现的输出。

## 3. 条件积分判据

$$
(\tau_{cmd}>\tau_{max}\land e>0)
\quad\text{或}\quad
(\tau_{cmd}<-\tau_{max}\land e<0)
$$

满足上述情况时暂停积分，其余情况允许积分。判据假设正误差产生正向积分力矩。

## 4. 反算抗饱和

$$
\dot z=e+\frac{K_{aw}}{K_i}(\tau_{sat}-\tau_{cmd})
$$

或直接对积分力矩 $\tau_I=K_i z$ 更新：

$$
\dot\tau_I=K_i e+K_{aw}(\tau_{sat}-\tau_{cmd})
$$

$K_{aw}$ 为回算增益，单位 $\mathrm{s^{-1}}$。回算增益需结合系统测试整定。


## 数值应用与适用条件

条件积分逻辑假定 Ki>0、积分状态 z=∫e；若积分状态定义变了，须重新检查符号。

$$
\tau_{raw}=K_pe+K_iz-K_d\dot q,\qquad
\tau_{act}=\operatorname{clip}(\tau_{raw},-5,5).
$$

$$
\begin{aligned}
\tau_{raw}>5\ \text{且}\ e>0&:\ \text{暂停积分},\\
\tau_{raw}>5\ \text{且}\ e<0&:\ \text{允许积分回落}.
\end{aligned}
$$
