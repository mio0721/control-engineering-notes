# 第 15 课：超前与滞后校正 · 公式手册


$$
C_{lead}=\frac{1+Ts}{1+\alpha Ts},\quad 0<\alpha<1,\quad \omega_m=\frac1{T\sqrt\alpha},\quad \phi_{max}=\sin^{-1}\frac{1-\alpha}{1+\alpha}.
$$


T 为时间常数，α 为无量纲比值，ω 单位 rad/s。反正弦结果按 rad 或 °统一换算。峰值处幅值为 $1/\sqrt\alpha$。


$$
C_{lag}=\frac{1+Ts}{1+\beta Ts},\qquad \beta>1.
$$


β 是无量纲参数；该形式低频为 1、高频为 1/β。若希望提高低频而近似保持高频，使用 β 倍该网络并重新核对整个环路。


## 数值应用与适用条件

一阶超前/滞后网络的连续频率响应，不代表整个闭环的稳定性与性能。

$$
C_{lead}(s)=\frac{1+Ts}{1+\alpha Ts}.
$$

$$
\omega_m=\sqrt{\frac1T\frac1{\alpha T}}=2\ \mathrm{rad/s},\qquad
\phi_{max}=30^\circ.
$$
