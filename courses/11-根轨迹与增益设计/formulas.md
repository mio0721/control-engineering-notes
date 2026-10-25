# 第 11 课：根轨迹与增益设计 · 公式手册


$$
1+KG_0(s)=0,\quad \angle G_0(s)=(2\ell+1)180^\circ,\quad K=1/|G_0(s)|.
$$


K 为非负标量增益，$G_0$ 为固定环路部分。相角条件用来确定轨迹，幅值条件求某点对应的增益。


$$
\sigma_a=\frac{\sum p_i-\sum z_i}{n-m},\qquad \theta_\ell=\frac{(2\ell+1)180^\circ}{n-m}.
$$


只在 n>m 时使用无穷远渐近线公式，$\ell=0,\ldots,n-m-1$。p、z 为开环极点与零点，按重数计。


## 数值应用与适用条件

单参数正增益根轨迹；闭环输入输出模型为 K/(s²+2s+K)，零初态、单位阶跃。

$$
s_{1,2}=-1\pm\sqrt{1-K}.
$$

$$
y(t)=1-e^{-t}\left[\cos(\sqrt{K-1}\,t)+\frac{\sin(\sqrt{K-1}\,t)}{\sqrt{K-1}}\right].
$$
