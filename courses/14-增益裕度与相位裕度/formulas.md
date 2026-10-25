# 第 14 课公式手册：增益裕度与相位裕度

## 标准单位负反馈

$$
L(s)=C(s)P(s),\qquad
T(s)=\frac{L(s)}{1+L(s)}
$$

临界环路点为 $L(j\omega)=-1$，对应幅值 1、相位 $-180^\circ$。

## 两个交越频率

$$
|L(j\omega_{gc})|=1 \quad (0\,\mathrm{dB})
$$

$$
\arg L(j\omega_{pc})=-180^\circ
$$

## 两种裕度

$$
\boxed{\mathrm{PM}=180^\circ+\arg L(j\omega_{gc})}
$$

$$
\boxed{\mathrm{GM}=\frac1{|L(j\omega_{pc})|}}
$$

$$
\boxed{\mathrm{GM}_{dB}=-20\log_{10}|L(j\omega_{pc})|}
$$

若 GMdB 已知：

$$
\mathrm{GM}=10^{\mathrm{GM}_{dB}/20}
$$

## 延迟的相位影响（近似估算）

$$
\phi_d=-\omega T_d,\qquad
T_{d,\max}\approx\frac{\mathrm{PM}_{rad}}{\omega_{gc}}
$$

只作交越附近的直观估算，不是一般数字控制系统的严格时延上限。

## 教学模型

$$
L(s)=\frac K{(s+1)^3},\qquad
\omega_{pc}=\sqrt3,\qquad
\mathrm{GM}=\frac8K
$$

单位负反馈闭环特征方程 $(s+1)^3+K=0$，本模型稳定范围为 $0<K<8$。


## 数值应用与适用条件

本例开环稳定且交越结构简单；多交越、开环不稳定或延迟系统要结合完整Nyquist分析。

$$
L(s)=\frac4{(s+1)^3}.
$$

$$
\begin{aligned}
\frac4{(1+\omega_{gc}^2)^{3/2}}&=1,\\
\omega_{gc}&=\sqrt{4^{2/3}-1}\approx1.233\ \mathrm{rad/s},\\
PM&=180^\circ-3\arctan(\omega_{gc})\approx27.1^\circ.
\end{aligned}
$$

$$
GM=\frac1{0.5}=2,\qquad GM_{dB}=20\log_{10}2\approx6.02\ \mathrm{dB}.
$$
