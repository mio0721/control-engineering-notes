# 第 21 课：相平面与状态轨迹 · 公式手册

$$
\dot x=Ax,\quad x=[q,v]^{\mathsf T},\quad A=\begin{bmatrix}0&1\\-k&-b\end{bmatrix}.
$$

q为位置，v为速度，惯量归一为1。平衡点满足Ax=0。相轨迹上的点随时间移动；根轨迹上的点随控制参数移动，两者不同。

$$
V=\tfrac12kq^2+\tfrac12v^2,\quad\dot V=-bv^2.
$$

k>0时V正定；仅由半负定导数还不能跳过收敛性论证。
