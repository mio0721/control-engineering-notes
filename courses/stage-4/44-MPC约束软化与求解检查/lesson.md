# 第 44 课：MPC约束软化与求解检查

> 阶段 4 · 把物理限制变成不等式，正确处理不可行、输入变化率和求解失败。

## 1. 输入界和状态界表达不同要求

转向角界约束执行器位置，转角变化率界约束它变化多快。离散输入序列满足

$$
u_{\min}\le u_{i|k}\le u_{\max},\qquad
\Delta u_{\min}\le u_{i|k}-u_{i-1|k}\le\Delta u_{\max}.
$$

第一项增量使用上一拍**实际执行**的输入 $u_{-1|k}=u_{k-1}^{\rm applied}$。如果执行器曾饱和，不能使用未实现的旧优化命令。

## 2. 把约束堆叠成 GU≤h

令 D 为主对角为 1、下一对角为 -1 的差分矩阵。定义 $d=[u_{k-1}^{\rm applied},0,\ldots,0]^{\mathsf T}$，则 $\Delta U=DU-d$。上下界分别转换为正负两组不等式。

预测状态约束同样代入 $X=\mathcal A\hat x_k+\mathcal B U$：

$$
X_{\min}\le\mathcal A\hat x_k+\mathcal B U\le X_{\max}.
$$

这只约束预测轨迹；存在状态估计误差或扰动时，真实系统可能越界。需要收紧、鲁棒或概率约束方法才能进一步建立真实约束保证。

## 3. 手算一次变化率限制

上一拍实际转角为 0.1 rad，采样周期为 0.1 s，允许转角速率不超过 0.5 rad/s，因此当前转角最多变化 0.05 rad。结合幅值限制 $|\delta|\le0.3$ rad，首项可行区间为 $[0.05,0.15]$ rad。

若忘记乘 $T_s$，会把速率直接当作每拍变化量，放宽十倍。若跟踪要求当前状态立即满足一个根本不可达的硬边界，就可能没有可行解。

## 4. 软约束是有代价地允许偏离

对可软化的预测状态约束，引入松弛量 $\epsilon\ge0$：

$$
X\le X_{\max}+\epsilon,\qquad
J_{\rm soft}=J+\rho\|\epsilon\|^2.
$$

必须明确哪些约束可以软化。跟踪误差可以允许临时增大；执行器硬极限通常应保留。软约束不会把违反物理边界变成安全行为。权重过大还可能导致数值病态。

## 5. 求解结果怎样验收？

至少检查状态码、有限数值、约束残差、最优性或收敛残差，以及实际耗时。上一拍序列平移可作为热启动，但新状态或新约束改变后，它不一定仍可行。

```matlab
% QP 已按正文得到 H,g,G,h；下面调用需要 Optimization Toolbox。
opts=optimoptions('quadprog','Display','off');
[U,~,flag]=quadprog(H,g,G,h,[],[],[],[],[],opts);
% 该片段依赖已构造的矩阵，不是独立完整脚本。
if flag<=0 || isempty(U) || any(~isfinite(U))
 error('QP failed: use the separately designed fallback policy');
end
if max(G*U-h)>1e-6,error('Constraint residual too large');end
```

失败后的控制要按场景设计；简单保持上一拍不一定安全。本课不把任意一个回退动作当作通用安全策略。

:::demo stage4-lab mode=mpc
:::

## 6. 练习

给定转角幅值界、上一拍实际转角和速率界，手算首拍可行区间。再解释为什么简单分别截断每一项，不能一般性地求解同时含状态约束的 QP。


## 图示核对

![上一拍转角0.1 rad、采样0.1 s、最大转角速率0.5 rad/s时，首拍转角必须位于0.05至0.15 rad。](media/example.svg)

上一拍转角0.1 rad、采样0.1 s、最大转角速率0.5 rad/s时，首拍转角必须位于0.05至0.15 rad。
