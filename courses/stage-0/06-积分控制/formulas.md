# 第 6 课：公式手册——积分控制与稳态误差

## 1. 常值扰动下 PD 稳态误差

$$
J\ddot q=\tau-d,\qquad
\tau=K_p e-K_d\dot q,\qquad
e=q_d-q
$$

稳态条件：$\dot q=0$、$\ddot q=0$。因此 $\tau=d$、$K_p e_{ss}=d$。

- $J$：转动惯量，单位 $\mathrm{kg\cdot m^2}$。
- $q,q_d,e$：角度、目标角度、位置误差，单位通常为 rad。
- $d,\tau$：扰动力矩、控制力矩，单位 $\mathrm{N\cdot m}$。
- $K_p$：比例增益；本模型中单位为力矩/角度。
- $K_d$：微分增益，单位为力矩/(角速度)。

$$
\boxed{e_{ss}=\frac{d}{K_p}}
$$

仅适用于上述符号约定、常值扰动和可达到的稳态。

## 2. 连续 PID

$$
z(t)=\int_0^t e(\lambda)\,d\lambda,\qquad
\tau=K_p e+K_i z-K_d\dot q
$$

$z$ 为误差积分，单位角度·秒；$K_i z$ 的单位必须为力矩。固定目标时，微分项写在测量速度上可提供阻尼。

若闭环稳定、$K_i>0$、未饱和并能达到稳态，则常值扰动下 $e_{ss}=0$。执行器饱和、扰动过大或闭环不稳定时，不能直接套用该结论。

## 3. 积分限幅

$$
z\leftarrow\operatorname{clip}(z,-z_{\max},z_{\max})
$$

$z_{\max}$ 是积分状态上限，单位与 $z$ 相同。它限制 windup 的规模，但阈值会影响扰动补偿能力。


## 数值应用与适用条件

阻力方向明确、恒定目标；积分消静差以稳定、无积分泄漏和输入可实现为前提。

$$
J\ddot q=\tau-d,\qquad
\tau=K_pe+K_iz-K_d\dot q,\qquad \dot z=e.
$$

$$
K_pe_{ss}=d\quad\Longrightarrow\quad e_{ss}=\frac2{16}=0.125\ \mathrm{rad}.
$$

$$
K_iz_{ss}=d\quad\Longrightarrow\quad z_{ss}=\frac24=0.5\ \mathrm{rad\,s}.
$$
