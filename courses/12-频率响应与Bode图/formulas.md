# 第 12 课：公式手册——频率响应与 Bode 图

## 1. 正弦稳态响应
$$
r(t)=A\sin(\omega t),\qquad
y_{ss}(t)=A|G(j\omega)|\sin(\omega t+\phi)
$$
$A$：输入振幅；$\omega$：角频率（rad/s）；$|G|$：幅值比；$\phi=\arg G$：相位差。$\phi<0$ 表示输出滞后。

## 2. 一阶低通
$$
G(s)=\frac{1}{\tau s+1},\qquad
|G(j\omega)|=\frac{1}{\sqrt{1+(\omega\tau)^2}},\qquad
\phi=-\tan^{-1}(\omega\tau)
$$
$\tau$：时间常数，单位秒。截止角频率 $\omega_c=1/\tau$。本课示例 $\tau=0.1\;\mathrm{s}$，所以 $\omega_c=10\;\mathrm{rad/s}$。

## 3. dB 与频率单位
$$
G_{dB}=20\log_{10}|G(j\omega)|,\qquad
\omega=2\pi f
$$
幅值比为 $1/\sqrt2$ 时约为 $-3.01\;\mathrm{dB}$。$f$ 的单位是 Hz；$\omega$ 的单位是 rad/s。

## 4. 截止点
$$
|G(j\omega_c)|=\frac{1}{\sqrt2}\approx0.707,\qquad
\phi(\omega_c)=-45^\circ
$$
截止点表示幅值相对低频值下降到 $1/\sqrt2$，并非系统完全停止响应。

## 5. Bode 渐近斜率
单一一阶极点在远高于截止频率处，幅值渐近斜率约 $-20\;\mathrm{dB/decade}$；相位逐渐趋向 $-90^\circ$。渐近线是读图近似，不是每个频率上的精确值。


## 数值应用与适用条件

稳定一阶线性对象；正弦稳态解释建立在瞬态已衰减的基础上。

$$
G(s)=\frac1{s+1},\qquad u(t)=\sin(\omega t).
$$

$$
|G(j\omega)|=\frac1{\sqrt{1+\omega^2}},\qquad
\phi(\omega)=-\arctan\omega.
$$

$$
y_{ss}(t)=0.707\sin(t-\pi/4),\qquad
20\log_{10}(0.707)\approx-3.01\ \mathrm{dB}.
$$
