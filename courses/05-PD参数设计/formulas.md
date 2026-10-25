# 第 5 课 · 公式与参数手册

> 本课重点：公式怎么用、各参数是什么意思、有什么单位、哪些情况下不适用。

## 1. 符号与物理单位

| 符号 | 解释 | 常用单位 |
|---|---|---|
| $q,q_d$ | 实际关节角度、固定目标角度 | rad |
| $\dot q,\ddot q$ | 关节角速度、角加速度 | rad/s、rad/s² |
| $\tau$ | 执行器施加的关节力矩 | N·m |
| $J$ | 关节等效转动惯量 | kg·m² |
| $K_p$ | 位置误差的比例控制增益 | N·m/rad |
| $K_d$ | 速度反馈增益 | N·m·s/rad |
| $\zeta$ | 阻尼比 | 无量纲 |
| $\omega_n$ | 无阻尼自然角频率 | rad/s（量纲等价 1/s） |
| $\omega_d$ | 欠阻尼振荡角频率 | rad/s |
| $T_r,T_p,T_s$ | 上升、峰值、调节时间 | s |
| $M_p$ | 百分比超调量 | % |
| $m_p$ | 超调量的小数形式：$M_p/100$ | 无量纲 |
| $y_{\max},y_\infty$ | 阶跃最大值、最终稳态值 | 同输出单位 |
| $s$ | 拉普拉斯复变量 | 1/s |

## 2. 模型与闭环传递函数


$$
\boxed{J\ddot q=\tau}
$$


$$
\boxed{\tau=K_p(q_d-q)-K_d\dot q}
$$


$$
\boxed{T(s)=\frac{Q(s)}{Q_d(s)}=\frac{K_p}{Js^2+K_ds+K_p}}
$$


适用范围：理想刚性单关节、固定目标、线性时不变、无重力与摩擦等未建模作用；传递函数采用零初始条件。

## 3. 标准二阶系统与参数转换


$$
\boxed{T(s)=\frac{\omega_n^2}{s^2+2\zeta\omega_ns+\omega_n^2}}
$$


分析方向（增益 → 二阶参数）：


$$
\boxed{\omega_n=\sqrt{\frac{K_p}{J}}}
$$


$$
\boxed{\zeta=\frac{K_d}{2\sqrt{JK_p}}}
$$


设计方向（二阶参数 → 增益）：


$$
\boxed{K_p=J\omega_n^2}
$$


$$
\boxed{K_d=2\zeta J\omega_n}
$$


这些设计公式意味着：如果保持目标 $\zeta,\omega_n$ 不变，当 $J$ 加倍时，$K_p$、$K_d$ 都需加倍；但力矩上限可能无法允许这样的控制律。

## 4. 百分比超调量 $M_p$

对于从零开始、正向到非零稳态值的阶跃：


$$
\boxed{M_p=\frac{y_{\max}-y_\infty}{|y_\infty|}\times100\%}
$$


若非零初始输出，则应以阶跃幅值 $|y_\infty-y_0|$ 作分母，并考虑阶跃方向。

仅对**标准、无有限零点、单位直流增益、欠阻尼**二阶系统：


$$
\boxed{M_p=e^{-\frac{\pi\zeta}{\sqrt{1-\zeta^2}}}\times100\%},\qquad0<\zeta<1
$$


反解阻尼比：


$$
\boxed{\zeta=\frac{-\ln(m_p)}{\sqrt{\pi^2+[\ln(m_p)]^2}}},\qquad m_p=\frac{M_p}{100},\quad0<m_p<1
$$


本课数值：$M_p\leq10\%$ → $\zeta\geq0.591$；$M_p\leq5\%$ → $\zeta\geq0.690$。

## 5. 调节时间 $T_s$ 与峰值时间 $T_p$

标准欠阻尼二阶系统的 **2% 调节时间常用近似**：


$$
\boxed{T_s\approx\frac{4}{\zeta\omega_n}}
$$


- $T_s$：从该时刻起输出一直留在 2% 误差带内的时间；不是第一次进入误差带的时间。
- 此式是近似；当响应接近性能要求的边界，必须计算或仿真确认。
- 本课 $\zeta=0.7,\omega_n=3$：估算约 1.90 s，实际标准阶跃约 1.99 s。

欠阻尼振荡角频率与峰值时间：


$$
\boxed{\omega_d=\omega_n\sqrt{1-\zeta^2}}
$$


$$
\boxed{T_p=\frac{\pi}{\omega_d}=\frac{\pi}{\omega_n\sqrt{1-\zeta^2}}},\quad0<\zeta<1
$$


## 6. 本课完整设计例题

要求：$J=1\;\mathrm{kg\cdot m^2}$、超调不超过 10%、2% 调节时间不超过 2 s。

1. 由超调限值，阻尼比至少约 0.591；取 $\zeta=0.7$。
2. 由时间近似要求，$\omega_n\gtrsim2.857\;\mathrm{rad/s}$；取 $\omega_n=3$。
3. 增益：$K_p=1\times3^2=9$，$K_d=2\times0.7\times1\times3=4.2$。
4. 控制律：$\tau=9(q_d-q)-4.2\dot q$。
5. 理想阶跃超调约 4.6%，真实 2% 调节时间约 1.99 s；需继续检查力矩饱和等约束。

## 7. MATLAB 快速计算

```matlab
J = 1;
zeta = 0.7;
wn = 3;
Kp = J*wn^2;
Kd = 2*zeta*J*wn;
Mp = exp(-pi*zeta/sqrt(1-zeta^2))*100;
Ts_approx = 4/(zeta*wn);
```

注意：`Ts_approx` 不是严格 2% 调节时间，应根据模拟响应判断是否满足指标。


## 数值应用与适用条件

固定目标的 PD、无延迟、无零点、无饱和；ts≈4/(ζωn) 是2%经验式。

$$
\zeta=\frac{-\ln(0.1)}{\sqrt{\pi^2+[\ln(0.1)]^2}}\approx0.591.
$$

$$
\begin{aligned}
\omega_n&\approx\frac4{\zeta t_s}\approx3.383\ \mathrm{rad/s},\\
K_p&=J\omega_n^2\approx11.45,\\
K_d&=2\zeta J\omega_n\approx4.00.
\end{aligned}
$$
