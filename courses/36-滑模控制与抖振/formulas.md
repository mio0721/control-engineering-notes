# 滑模控制与抖振：公式手册

> 公式沿用本课正文的符号、量纲与假设；应用前须核对适用区域和执行器条件。

$$
e=q-q_d,\qquad s=\dot e+\lambda e,\qquad\lambda>0.
$$

$$
u=-f+\ddot q_d-\lambda\dot e-k\operatorname{sign}(s).
$$

$$
\dot V_s=s(d-k\operatorname{sign}s)\le-(k-D)|s|.
$$

$$
\operatorname{sat}(s/\phi)=\begin{cases}-1&s<-\phi\\s/\phi&|s|\le\phi\\1&s>\phi\end{cases},\qquad\phi>0.
$$