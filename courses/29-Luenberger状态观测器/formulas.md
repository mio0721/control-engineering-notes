# 第 29 课：Luenberger状态观测器 · 公式手册

$$
\dot{\hat x}=A\hat x+Bu+L(y-C\hat x),\quad e=x-\hat x,\quad\dot e=(A-LC)e.
$$

本式D=0、模型准确、已知实际输入、无噪声。存在稳定观测器要求可检测；任意配置误差极点要求可观。

$$
s^2+l_1s+l_2=0\quad\text{（位置测量双积分器）}.
$$

希望−a、−b时l₁=a+b、l₂=ab。若测量含n，则ė=(A−LC)e−Ln。
