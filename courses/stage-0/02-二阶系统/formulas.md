# 第 2 课 · 公式与符号手册

> 本课使用第 1 课的单关节模型、固定目标位置和 PD 控制器。所有阻尼类型讨论默认 $J>0,K_p>0$。

## 1. 闭环误差动力学


$$
\boxed{J\ddot e+K_d\dot e+K_pe=0}
$$


| 符号 | 解释 | 单位 |
|---|---|---|
| $J$ | 等效转动惯量 | kg·m² |
| $e$ | 位置误差 $q_d-q$ | rad |
| $\dot e$ | 误差变化率 | rad/s |
| $\ddot e$ | 误差二阶导数 | rad/s² |
| $K_p$ | 比例增益 | N·m/rad |
| $K_d$ | 微分/速度反馈增益 | N·m·s/rad |

## 2. 标准二阶系统


$$
\boxed{\ddot e+2\zeta\omega_n\dot e+\omega_n^2e=0}
$$


- $\omega_n$：无阻尼自然角频率，单位 rad/s；代表固有时间尺度。
- $\zeta$：阻尼比，无量纲；决定振荡和衰减特性。

## 3. 自然角频率与阻尼比


$$
\boxed{\omega_n=\sqrt{\frac{K_p}{J}}}
$$


$$
\boxed{\zeta=\frac{K_d}{2\sqrt{JK_p}}}
$$


**用途：** 根据动力学参数和控制增益判断二阶响应。$\zeta=0$ 无阻尼；$0<\zeta<1$ 欠阻尼；$\zeta=1$ 临界阻尼；$\zeta>1$ 过阻尼。

## 4. 临界阻尼增益


$$
\boxed{K_d=2\sqrt{JK_p}}
$$


- **用途：** 给定 $J,K_p$，求恰好 $\zeta=1$ 时的 $K_d$。
- **限制：** 恢复临界阻尼不意味着在惯量改变之后恢复同样的自然频率。

## 5. 超调量


$$
\boxed{M_p=\frac{y_{\max}-y_\infty}{|y_\infty|}\times100\%}
$$


| 符号 | 解释 | 单位 |
|---|---|---|
| $M_p$ | 百分比超调量 | % |
| $y_{\max}$ | 阶跃响应最大值 | 与输出相同 |
| $y_\infty$ | 最终稳态值，需非零 | 与输出相同 |

标准无零点、单位直流增益、欠阻尼二阶系统的阶跃响应：


$$
\boxed{M_p=e^{-\frac{\pi\zeta}{\sqrt{1-\zeta^2}}}\times100\%},\qquad 0<\zeta<1
$$


- $\pi$：圆周率；$e^{(\cdot)}$：指数函数；$\zeta$：阻尼比。
- **用途：** 已知阻尼比预测超调；不得无条件应用于包含零点的任意系统。

## 6. 峰值时间


$$
\boxed{T_p=\frac{\pi}{\omega_n\sqrt{1-\zeta^2}}}
$$


- $T_p$：第一超调峰值出现时间（s）；$\omega_n$：自然角频率（rad/s）。
- **条件：** $0<\zeta<1$ 的标准二阶阶跃响应。

## 7. 2% 调节时间近似


$$
\boxed{T_s\approx\frac4{\zeta\omega_n}}
$$


- $T_s$：从响应开始到进入且持续保持在稳态值的 $\pm2\%$ 误差带内的时间（s）。
- **条件：** 欠阻尼标准二阶系统常用工程近似，并非通用精确解。


## 数值应用与适用条件

无零点、零初态、单位直流增益的标准二阶阶跃；超调与峰值公式限定 $0<ζ<1$。

$$
T(s)=\frac{\omega_n^2}{s^2+2\zeta\omega_n s+\omega_n^2}.
$$

$$
\begin{aligned}
\omega_d&=\omega_n\sqrt{1-\zeta^2}=2\sqrt3\approx3.464\ \mathrm{rad/s},\\
t_p&=\frac\pi{\omega_d}\approx0.907\ \mathrm{s},\\
M_p&=e^{-\pi\zeta/\sqrt{1-\zeta^2}}\approx0.163.
\end{aligned}
$$
