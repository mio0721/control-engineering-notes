# 第 16 课公式手册：闭环带宽、延迟与鲁棒性

## 闭环关系

$$
L(s)=C(s)P(s),\qquad
T(s)=\frac{L(s)}{1+L(s)}
$$

## −3 dB 闭环带宽

$$
|T(j\omega_{BW})|=\frac{|T(0)|}{\sqrt2}
$$

标准一阶低通 $T(s)=1/(\tau_{cl}s+1)$：

$$
\omega_{BW}=\frac1{\tau_{cl}},\qquad
T_r\approx\frac{2.2}{\omega_{BW}}
$$

上升时间关系为近似值，主要用于一阶响应直觉。

## 一阶对象 + 比例控制

$$
P(s)=\frac1{\tau s+1},\quad C(s)=K
$$

$$
T(s)=\frac K{\tau s+1+K}
$$

$$
T(0)=\frac K{1+K},\qquad
\omega_{BW}=\frac{1+K}{\tau}
$$

当 $K>1$ 时：

$$
\omega_{gc}=\frac{\sqrt{K^2-1}}{\tau}
$$

## 纯延迟

$$
D(s)=e^{-sT_d},\qquad
|D(j\omega)|=1,\qquad
\phi_d=-\omega T_d\ \mathrm{rad}
$$

角度形式：

$$
\phi_d=-\omega T_d\frac{180^\circ}{\pi}
$$

## 延迟余量近似

$$
\mathrm{PM}(T_d)\approx
\mathrm{PM}_0-\omega_{gc}T_d\frac{180^\circ}{\pi}
$$

$$
T_{d,\max}\approx
\frac{\mathrm{PM}_{0,\mathrm{rad}}}{\omega_{gc}}
$$

$\mathrm{PM}_0$ 用弧度，$\omega_{gc}$ 用 rad/s，结果单位为秒。此估算针对交越附近的简单线性环路。


## 数值应用与适用条件

相对直流带宽需要有限非零直流值；本例简单环路只有一个正增益交越。

$$
L(s)=\frac2{s+1},\qquad T(s)=\frac2{s+3}.
$$

$$
\omega_{gc}=\sqrt{2^2-1}=\sqrt3\approx1.732\ \mathrm{rad/s}.
$$

$$
\frac{|T(j\omega_{bw})|}{|T(0)|}=\frac1{\sqrt2}\quad\Longrightarrow\quad\omega_{bw}=3\ \mathrm{rad/s}.
$$

$$
\Delta\phi=-\omega_{gc}\tau=-0.1732\ \mathrm{rad}\approx-9.92^\circ.
$$
