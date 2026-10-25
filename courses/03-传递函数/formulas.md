# 第 3 课 · 公式与符号手册

> 本课讨论拉普拉斯变换、零初始条件下传递函数的定义以及理想单关节 PD 闭环。

## 1. 拉普拉斯变换


$$
\boxed{Q(s)=\mathcal L\{q(t)\}}
$$


| 符号 | 解释 | 单位/备注 |
|---|---|---|
| $t$ | 时间 | s |
| $q(t)$ | 时域关节角度信号 | rad |
| $\mathcal L$ | 拉普拉斯变换算子 | — |
| $Q(s)$ | $q(t)$ 的拉普拉斯变换 | 频域信号 |
| $s$ | 复变量，$s=\sigma+j\omega$ | 1/s |
| $j$ | 虚数单位，$j^2=-1$ | — |

## 2. 导数的变换


$$
\boxed{\mathcal L\{\dot q\}=sQ(s)-q(0)}
$$


$$
\boxed{\mathcal L\{\ddot q\}=s^2Q(s)-sq(0)-\dot q(0)}
$$


- $q(0)$：初始位置（rad）；$\dot q(0)$：初始角速度（rad/s）。
- **零初始条件：** 两者都为 0，才可直接写 $\dot q\leftrightarrow sQ(s)$、$\ddot q\leftrightarrow s^2Q(s)$。

## 3. 对象的传递函数


$$
\boxed{G(s)=\frac{Q(s)}{\mathcal T(s)}=\frac1{Js^2}}
$$


| 符号 | 解释 |
|---|---|
| $G(s)$ | 从驱动力矩到角度的对象传递函数 |
| $Q(s)$ | 输出角度变换 |
| $\mathcal T(s)$ | 力矩 $\tau(t)$ 的变换（不是闭环函数 $T(s)$） |
| $J$ | 关节等效转动惯量（kg·m²） |

**条件：** $J\ddot q=\tau$，零初始条件，线性时不变模型。

## 4. PD 闭环传递函数


$$
\boxed{T(s)=\frac{Q(s)}{Q_d(s)}=\frac{K_p}{Js^2+K_ds+K_p}}
$$


- $T(s)$：位置指令到实际角度的闭环传递函数。
- $Q_d(s)$：目标角度 $q_d(t)$ 的拉普拉斯变换。
- $K_p$：比例增益（N·m/rad）；$K_d$：速度反馈增益（N·m·s/rad）。
- **条件：** 采用 $\tau=K_p(q_d-q)-K_d\dot q$；若改为误差微分的 D 项并允许目标变化，分子有所不同。

## 5. 闭环直流增益


$$
\boxed{T(0)=1}
$$


**用途：** 在闭环稳定、理想模型成立时，该系统对恒定角度指令的最终稳态跟踪增益为 1，稳态位置误差为 0；不能推出任意扰动下也无误差。

## 6. MATLAB 快查

| 命令 | 用途 | 依赖 |
|---|---|---|
| `ode45(f,tspan,x0)` | 数值积分计算角度轨迹 | MATLAB 基础 |
| `roots([J,Kd,Kp])` | 求二次多项式根 | MATLAB 基础 |
| `tf('s')` | 创建传递函数变量 | Control System Toolbox |
| `step(T)` | 计算并绘制阶跃响应 | Control System Toolbox |


## 数值应用与适用条件

连续线性时不变一阶对象，a>0；叠加原理要求系统线性。

$$
\dot y+2y=u,\qquad y(0)=1.
$$

$$
\begin{aligned}
sY(s)-1+2Y(s)&=\frac1s,\\
Y(s)&=\frac1{s(s+2)}+\frac1{s+2},\\
y(t)&=\frac12(1-e^{-2t})+e^{-2t}.
\end{aligned}
$$
