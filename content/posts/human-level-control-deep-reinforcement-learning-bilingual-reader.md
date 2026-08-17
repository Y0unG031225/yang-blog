---
title: "DQN：通过深度强化学习实现人类水平控制｜中英文对照精读"
description: "Human-level control through deep reinforcement learning 全文中英文对照、DQN 核心机制、Atari 实验图表与批判性阅读。"
date: "2026-08-04"
category: "论文精读"
categoryKey: "paper-reading"
tags: ["DQN", "强化学习", "深度学习", "Atari", "Nature"]
tone: "blue"
read: "35 分钟"
socialImage: "/og/posts/human-level-control-deep-reinforcement-learning-bilingual-reader.jpg"
draft: false
---
# Human-level control through deep reinforcement learning

## 通过深度强化学习实现人类水平的控制

> **Authors:** Volodymyr Mnih et al.  
> **Journal:** *Nature* 518, 529-533 (2015)  
> **DOI:** 10.1038/nature14236  
> **Paper type:** 算法 / 方法与实证研究  
> **Reader source:** 用户提供的 13 页 PDF  
> **阅读方式:** 每个正文块依次给出英文原文、中文译文与 PDF 页码；图表放在首次实质讨论附近。

## 导航

- [术语表](#术语表)
- [摘要与研究问题（PDF pp.1-2）](#摘要与研究问题pdf-pp1-2)
- [Atari 评估与主要结果（PDF pp.2-4）](#atari-评估与主要结果pdf-pp2-4)
- [讨论与结论（PDF p.4）](#讨论与结论pdf-p4)
- [方法（PDF pp.6-7）](#方法pdf-pp6-7)
- [扩展数据（PDF pp.8-13）](#扩展数据pdf-pp8-13)
- [批判性阅读提示](#批判性阅读提示)

## 术语表

| Canonical term | 中文统一译法 | 本文用法 |
|---|---|---|
| deep Q-network (DQN) | 深度 Q 网络（DQN） | 首次展开，后用 DQN |
| reinforcement learning | 强化学习 | 不译作“增强学习” |
| action-value function / Q-function | 动作价值函数 / Q 函数 | 数学符号保持为 `Q` |
| experience replay | 经验回放 | 指从回放记忆中随机采样转移 |
| replay memory | 回放记忆 | 存储最近经验转移的缓冲区 |
| target network | 目标网络 / 目标 Q 网络 | 与在线 Q 网络区分 |
| temporal-difference learning | 时序差分学习 | 缩写 TD 保留 |
| convolutional neural network | 卷积神经网络 | 缩写 CNN 保留 |
| policy | 策略 | 动作条件分布或决策规则 |
| return | 回报 | 折扣后的未来奖励总和 |
| state value / action value | 状态价值 / 动作价值 | 分别对应 `V` 与 `Q` |
| off-policy | 离策略 | 学习目标策略不同于行为策略 |
| ε-greedy | ε-贪心 | 以 ε 概率随机探索 |
| t-SNE | t-SNE 降维 | 名称不翻译 |

---

## 摘要与研究问题（PDF pp.1-2）

<a id="S001"></a>
### 摘要

**Source:** p.1 S001

**Original:** The theory of reinforcement learning provides a normative account, deeply rooted in psychological and neuroscientific perspectives on animal behaviour, of how agents may optimize their control of an environment. To use reinforcement learning successfully in situations approaching real-world complexity, however, agents are confronted with a difficult task: they must derive efficient representations of the environment from high-dimensional sensory inputs, and use these to generalize past experience to new situations. Remarkably, humans and other animals seem to solve this problem through a harmonious combination of reinforcement learning and hierarchical sensory-processing systems. While reinforcement learning agents have achieved some successes in a variety of domains, their applicability has previously been limited to domains in which useful features can be handcrafted, or to domains with fully observed, low-dimensional state spaces.

**中文:** 强化学习理论从规范性角度说明了智能体应如何优化对环境的控制，这一理论深植于心理学和神经科学对动物行为的研究。然而，要把强化学习成功用于接近真实世界复杂度的情境，智能体必须解决一个困难问题：从高维感知输入中学习高效的环境表征，并利用这些表征把过去的经验泛化到新情境。人类和其他动物似乎通过强化学习与分层感觉处理系统的协调配合解决了这一问题。此前，强化学习智能体虽然已在若干领域取得成功，但通常只能用于可人工设计有效特征的任务，或状态完全可观测且维度较低的任务。

<a id="S002"></a>
**Source:** p.1 S002

**Original:** Here we use recent advances in training deep neural networks to develop a novel artificial agent, termed a deep Q-network, that can learn successful policies directly from high-dimensional sensory inputs using end-to-end reinforcement learning. We tested this agent on the challenging domain of classic Atari 2600 games. We demonstrate that the deep Q-network agent, receiving only the pixels and the game score as inputs, was able to surpass the performance of all previous algorithms and achieve a level comparable to that of a professional human games tester across a set of 49 games, using the same algorithm, network architecture and hyperparameters. This work bridges the divide between high-dimensional sensory inputs and actions, resulting in the first artificial agent that is capable of learning to excel at a diverse array of challenging tasks.

**中文:** 本文利用深度神经网络训练方面的最新进展，提出一种称为深度 Q 网络（DQN）的新型人工智能体。它可以通过端到端强化学习，直接从高维感知输入中学得有效策略。作者在经典 Atari 2600 游戏这一高难度领域中测试了该智能体。DQN 仅接收屏幕像素与游戏得分，却能在 49 款游戏上使用同一套算法、网络架构和超参数，超过此前所有算法，并达到与专业人类游戏测试员相当的总体水平。该工作连接了高维感知输入与动作决策，构建出首个能够在多种高难度任务中学习并达到卓越表现的人工智能体。

<a id="S003"></a>
### 统一智能体的目标

**Source:** p.1 S003

**Original:** We set out to create a single algorithm that would be able to develop a wide range of competencies on a varied range of challenging tasks—a central goal of general artificial intelligence that has eluded previous efforts. To achieve this, we developed a novel agent, a deep Q-network (DQN), which is able to combine reinforcement learning with a class of artificial neural network known as deep neural networks. Recent advances have made it possible for deep networks to learn concepts such as object categories directly from raw sensory data. We use a deep convolutional network, whose hierarchical tiled filters exploit local spatial correlations and provide robustness to transformations such as changes of viewpoint or scale.

**中文:** 作者的目标是创造一种单一算法，使其能在多种高难度任务中发展出广泛能力；这是通用人工智能的核心目标，也是此前研究一直未能实现的目标。为此，作者开发了 DQN，把强化学习与深度神经网络结合起来。深度网络的进展使模型能够直接从原始感知数据中学习对象类别等概念。本文采用深度卷积网络，通过分层卷积滤波器利用图像中的局部空间相关性，并对视角或尺度变化形成一定稳健性。

<a id="S004"></a>
### 强化学习目标

**Source:** pp.1-2 S004

**Original:** We consider tasks in which the agent interacts with an environment through a sequence of observations, actions and rewards. The goal of the agent is to select actions in a fashion that maximizes cumulative future reward. More formally, we use a deep convolutional neural network to approximate the optimal action-value function

$$
Q^*(s,a)=\max_{\pi}\mathbb{E}[r_t+\gamma r_{t+1}+\gamma^2r_{t+2}+\cdots\mid s_t=s,a_t=a,\pi],
$$

which is the maximum sum of rewards discounted by $\gamma$ at each time-step, achievable by a behaviour policy $\pi=P(a\mid s)$ after making an observation $s$ and taking an action $a$.

**中文:** 本文考虑智能体通过一系列观察、动作和奖励与环境交互的任务。智能体的目标是选择动作，使未来累积奖励最大化。更正式地说，作者使用深度卷积神经网络逼近最优动作价值函数 $Q^*(s,a)$。它表示：在观察到状态 $s$ 并执行动作 $a$ 后，行为策略 $\pi=P(a\mid s)$ 所能取得的、按折扣因子 $\gamma$ 逐时间步折扣的最大期望奖励总和。

<a id="S005"></a>
### 神经网络 Q 学习的不稳定性

**Source:** p.1 S005

**Original:** Reinforcement learning is known to be unstable or even to diverge when a nonlinear function approximator such as a neural network is used to represent the action-value function. This instability has several causes: correlations in the observation sequence; the fact that small updates to Q may significantly change the policy and hence the data distribution; and correlations between action-values and target values. We address these instabilities with a novel variant of Q-learning that uses two key ideas. First, experience replay randomizes over the data, removing correlations in the observation sequence and smoothing changes in the data distribution. Second, an iterative update adjusts action-values towards target values that are updated only periodically, reducing correlations with the target.

**中文:** 当使用神经网络等非线性函数逼近器表示动作价值函数时，强化学习可能不稳定甚至发散。原因包括：连续观察之间存在相关性；对 Q 值的小幅更新可能显著改变策略，进而改变数据分布；动作价值与目标值之间也存在相关性。作者用两个关键思想缓解这些问题。第一，经验回放对数据进行随机采样，打破观察序列的相关性，并平滑数据分布的变化。第二，迭代更新把动作价值推向只周期性更新的目标值，从而降低其与学习目标之间的相关性。

<a id="S006"></a>
### DQN 更新规则

**Source:** p.1 S006

**Original:** We parameterize an approximate value function $Q(s,a;\theta_i)$ using the deep convolutional neural network shown in Fig. 1. To perform experience replay we store the agent's experiences $e_t=(s_t,a_t,r_t,s_{t+1})$ in a data set $D_t$. During learning, we apply Q-learning updates to minibatches $(s,a,r,s')\sim U(D)$ drawn uniformly at random from the stored samples. The loss at iteration $i$ is

$$
L_i(\theta_i)=\mathbb{E}_{(s,a,r,s')\sim U(D)}\left[\left(r+\gamma\max_{a'}Q(s',a';\theta_i^-)-Q(s,a;\theta_i)\right)^2\right].
$$

The target-network parameters $\theta_i^-$ are updated with the Q-network parameters only every $C$ steps and are held fixed between updates.

**中文:** 作者用图 1 所示的深度卷积神经网络参数化近似价值函数 $Q(s,a;\theta_i)$。为实现经验回放，智能体在每个时间步把经验转移 $e_t=(s_t,a_t,r_t,s_{t+1})$ 存入数据集 $D_t$。学习时，从存储样本中均匀随机抽取小批量 $(s,a,r,s')\sim U(D)$，执行 Q 学习更新。损失函数使当前 Q 值逼近“即时奖励加下一状态的折扣最大目标 Q 值”。目标网络参数 $\theta_i^-$ 仅每隔 $C$ 步从在线 Q 网络复制一次，并在两次复制之间保持不变。

<a id="F001"></a>
### 图 1｜卷积神经网络结构示意图

**Placed near:** p.1 S006  
**Source:** p.2 C001

![Figure 1: DQN network architecture](/readers/dqn-human-level-control/fig1_network.webp)

**Original caption:** Schematic illustration of the convolutional neural network. The input is an $84\times84\times4$ image, followed by three convolutional layers and two fully connected layers with one output for each valid action. Each hidden layer is followed by a rectifier nonlinearity.

**中文图注:** 卷积神经网络结构示意图。输入是一个 $84\times84\times4$ 图像，随后依次经过三个卷积层和两个全连接层；输出层对每个合法动作给出一个 Q 值。每个隐藏层后均使用整流非线性单元。

**Reading note:** 网络一次前向传播即可同时输出当前状态下所有合法动作的 Q 值；这比“状态与动作共同作为输入、每个动作单独前向计算”的结构更高效。

---

## Atari 评估与主要结果（PDF pp.2-4）

<a id="S007"></a>
### 统一设置下的 49 款游戏测试

**Source:** p.2 S007

**Original:** To evaluate our DQN agent, we took advantage of the Atari 2600 platform, which offers a diverse array of tasks ($n=49$) designed to be difficult and engaging for human players. We used the same network architecture, hyperparameter values and learning procedure throughout—taking high-dimensional data (210 × 160 colour video at 60 Hz) as input—to demonstrate that our approach robustly learns successful policies over a variety of games based solely on sensory inputs with only very minimal prior knowledge. Our method trained large neural networks with a reinforcement-learning signal and stochastic gradient descent in a stable manner, as illustrated by the temporal evolution of average score per episode and average predicted Q-values.

**中文:** 为评估 DQN，作者采用 Atari 2600 平台，其中包含 49 个为人类玩家设计、具有难度且类型多样的任务。所有游戏使用相同的网络架构、超参数和学习过程，以 60 Hz 的 $210\times160$ 彩色视频作为高维输入。结果表明，仅依赖感知输入和极少先验知识，该方法便能在多类游戏中稳健地学得成功策略；强化学习信号与随机梯度下降也能稳定训练大型神经网络。训练期间的单回合平均得分和平均预测 Q 值反映了这一学习进程。

<a id="F002"></a>
### 图 2｜训练过程中的得分与预测动作价值

**Placed near:** p.2 S007  
**Source:** p.2 C002

![Figure 2: training curves](/readers/dqn-human-level-control/fig2_training_curves.webp)

**Original caption:** Training curves tracking the agent's average score and average predicted action-value. Panels a and b show average score per episode for Space Invaders and Seaquest; panels c and d show average predicted action-value on held-out states. Q-values are scaled because rewards were clipped.

**中文图注:** 智能体平均得分与平均预测动作价值的训练曲线。a、b 分别为《太空侵略者》和《海底探险》的单回合平均得分；c、d 为在留出状态集合上计算的平均预测动作价值。由于训练时对奖励进行了裁剪，图中 Q 值的尺度也相应改变。

**Reading note:** 得分曲线波动很大，而留出状态上的平均 Q 值更平滑；两者应联合观察，不能把 Q 值上升直接等同于真实性能提升。

<a id="S008"></a>
### 与既有算法和专业人类玩家比较

**Source:** pp.2-3 S008

**Original:** We compared DQN with the best performing methods from the reinforcement-learning literature on the 49 games where results were available. We also report scores for a professional human games tester under controlled conditions and a uniformly random policy. DQN outperforms the best existing reinforcement-learning methods on 43 games without incorporating the additional prior knowledge used by other approaches. It achieved more than 75% of the human score on more than half of the games (29 games).

**中文:** 作者在 49 款具有既有结果的游戏上，将 DQN 与当时强化学习文献中的最佳方法比较，并给出受控条件下专业人类游戏测试员和均匀随机策略的得分。DQN 在不引入其他方法所用额外 Atari 先验知识的情况下，在 43 款游戏上优于既有最佳强化学习方法；在 29 款游戏上，其得分超过人类得分的 75%。

<a id="F003"></a>
### 图 3｜DQN、最佳线性学习器与人类水平的比较

**Placed near:** pp.2-3 S008  
**Source:** p.3 C003

![Figure 3: normalized performance over 49 Atari games](/readers/dqn-human-level-control/fig3_game_performance.webp)

**Original caption:** DQN performance is normalized so that random play is 0% and a professional human tester is 100%: $100\times(\text{DQN}-\text{random})/(\text{human}-\text{random})$. DQN outperforms competing methods in almost all games and reaches at least 75% of human performance in the majority of games. Error bars are s.d. over 30 evaluation episodes.

**中文图注:** DQN 性能按随机策略为 0%、专业人类测试员为 100% 进行归一化：$100\times(\text{DQN}-\text{随机})/(\text{人类}-\text{随机})$。DQN 在几乎所有游戏中优于对比方法，并在多数游戏上达到至少 75% 的人类表现。误差条为 30 个评估回合的标准差。

**Reading note:** 横轴使用断轴且不同游戏跨度极大。少数远超人类的游戏会在视觉上非常突出，但不能掩盖《蒙特祖玛的复仇》等探索和长时规划任务上的失败。

<a id="S009"></a>
### 核心组件消融

**Source:** p.3 S009

**Original:** In additional simulations, we demonstrate the importance of the individual core components of DQN—the replay memory, separate target Q-network and deep convolutional architecture—by disabling them and demonstrating the detrimental effects on performance.

**中文:** 在额外模拟中，作者分别停用 DQN 的核心组件——回放记忆、独立目标 Q 网络以及深度卷积网络结构——并观察由此造成的性能损失，从而验证各组件的重要性。相应数值见扩展数据表 3 和表 4。

<a id="S010"></a>
### 学得的表示

**Source:** pp.3-4 S010

**Original:** We examined the representations learned by DQN in Space Invaders using t-SNE. As expected, perceptually similar states tend to map to nearby points. More interestingly, some perceptually dissimilar states that are close in expected reward also receive similar embeddings. The learned representations generalize to states generated by policies other than DQN's own: embeddings of human-play and agent-play states contain overlapping clusters. Extended Data Fig. 2 further shows that DQN accurately predicts state and action values.

**中文:** 作者使用 t-SNE 检查 DQN 在《太空侵略者》中学得的表示。符合预期的是，感知上相似的状态通常被映射到邻近位置；更值得注意的是，一些视觉上不同、但期望回报接近的状态也具有相似嵌入。这说明表示不只编码表面视觉相似性，还编码与决策相关的价值结构。学得的表示还能泛化到非 DQN 自身策略产生的状态：人类游戏与智能体游戏状态的嵌入中出现重叠簇。扩展数据图 2 则进一步显示 DQN 能预测状态价值和动作价值。

<a id="F004"></a>
### 图 4｜DQN 隐藏层表示的二维 t-SNE 嵌入

**Placed near:** pp.3-4 S010  
**Source:** p.4 C004

![Figure 4: t-SNE embedding coloured by state value](/readers/dqn-human-level-control/fig4_tsne_values.webp)

**Original caption:** Two-dimensional t-SNE embedding of last-hidden-layer representations for states experienced while DQN played Space Invaders. Points are coloured by predicted state value $V$. Full and nearly complete screens can both have high value because completing a screen yields a new screen; visually dissimilar screens may map nearby when their expected values are similar.

**中文图注:** DQN 玩《太空侵略者》时所经历状态的最后隐藏层表示，经 t-SNE 降至二维。点的颜色表示 DQN 预测的状态价值 $V$。完整屏幕与接近清空的屏幕都可能具有高价值，因为完成当前屏幕后会进入充满敌人的新屏幕；视觉上不同但期望价值相近的屏幕也可能被映射到邻近位置。

**Reading note:** t-SNE 主要提供定性证据；局部邻近关系不能被当作高维几何结构的严格证明。

<a id="S011"></a>
### 能力边界

**Source:** pp.3-4 S011

**Original:** The games in which DQN excels are extremely varied, from side-scrolling shooters to boxing and three-dimensional car racing. In some games DQN discovers a relatively long-term strategy; in Breakout it learns to dig a tunnel around the side of the wall so the ball can pass behind the bricks. Nevertheless, games demanding more temporally extended planning strategies remain a major challenge for all existing agents, including DQN—for example, Montezuma's Revenge.

**中文:** DQN 擅长的游戏类型跨度很大，包括横向卷轴射击、拳击和三维赛车等。在某些游戏中，它能发现相对长期的策略；例如在《打砖块》中，智能体会先沿砖墙侧面打出通道，让球绕到砖块后方并大量清除砖块。然而，需要更长时间尺度规划的游戏仍是包括 DQN 在内的所有现有智能体面临的重大挑战，典型例子是《蒙特祖玛的复仇》。

---

## 讨论与结论（PDF p.4）

<a id="S012"></a>
**Source:** p.4 S012

**Original:** A single architecture successfully learned control policies in a range of environments with minimal prior knowledge, receiving only pixels and game score and using the same algorithm, architecture and hyperparameters on every game. Unlike previous work, the approach incorporates end-to-end reinforcement learning, using reward to shape convolutional representations continuously toward environmental features that facilitate value estimation.

**中文:** 单一架构仅凭极少先验知识，就能在多种环境中成功学习控制策略。它只接收像素和游戏得分，并在所有游戏中使用相同算法、架构与超参数。与此前工作不同，该方法采用端到端强化学习，让奖励信号持续塑造卷积网络内部的表示，使其聚焦于有助于价值估计的环境特征。

<a id="S013"></a>
**Source:** p.4 S013

**Original:** The successful integration of reinforcement learning with deep networks depended critically on a replay algorithm that stores and re-presents recently experienced transitions. Evidence suggests that hippocampal replay may support a related process in the mammalian brain. Future work should explore biasing replay toward salient events, related to prioritized sweeping in reinforcement learning. Taken together, the work illustrates the power of combining state-of-the-art machine learning with biologically inspired mechanisms to create agents capable of mastering diverse challenging tasks.

**中文:** 强化学习与深度网络的成功整合，关键依赖于一种回放算法：它存储并重新呈现近期经历的状态转移。已有证据提示，哺乳动物大脑中的海马回放可能支持类似过程。未来研究可探索让经验回放偏向显著事件，这与强化学习中的“优先扫描”思想相关。总体而言，本研究展示了把先进机器学习技术与生物启发机制结合起来的力量：这种组合能够产生可掌握多种高难度任务的智能体。

<a id="S014"></a>
### 致谢、贡献与声明

**Source:** pp.4-5 S014

**Original:** Received 10 July 2014; accepted 16 January 2015. The authors thank colleagues and the DeepMind team for discussions, visual work, comments and support. The paper lists joint contributions to problem formulation, algorithm development, the testing platform, project management and writing. The authors declare no competing financial interests.

**中文:** 论文于 2014 年 7 月 10 日收稿，2015 年 1 月 16 日接收。作者感谢多位同事及 DeepMind 团队在讨论、视觉材料、稿件意见和项目支持方面的贡献。作者贡献声明覆盖问题与技术框架构思、算法开发与测试、测试平台建设、项目管理及论文写作。作者声明不存在竞争性经济利益。

---

## 方法（PDF pp.6-7）

<a id="S015"></a>
### 预处理

**Source:** p.6 S015

**Original:** Raw Atari 2600 frames are $210\times160$ pixel images with a 128-colour palette. To reduce dimensionality and remove emulator artefacts, the maximum value for each pixel colour is taken over the current and previous frame, removing flicker caused by sprite limitations. The Y (luminance) channel is then extracted from RGB and rescaled to $84\times84$. The preprocessing function $\phi$ stacks the $m=4$ most recent frames to form the Q-function input; the algorithm is robust to nearby values such as 3 or 5.

**中文:** 原始 Atari 2600 帧是 $210\times160$ 像素、128 色的图像。为降低维度并处理模拟器伪影，作者对当前帧和前一帧逐像素取最大值，以消除 Atari 精灵数量限制导致的闪烁。随后从 RGB 帧中提取 Y（亮度）通道，并缩放至 $84\times84$。预处理函数 $\phi$ 将最近 $m=4$ 帧堆叠为 Q 函数输入；取 3 或 5 帧时算法也较稳健。

<a id="S016"></a>
### 代码可用性

**Source:** p.6 S016

**Original:** The source code can be accessed at the URL given in the paper for non-commercial uses only.

**中文:** 论文提供了源代码地址，并注明仅限非商业用途。该链接属于 2015 年论文中的原始可用性声明，当前是否仍可访问需另行核验。

<a id="S017"></a>
### 模型架构

**Source:** p.6 S017

**Original:** A design that takes both history and action as input requires a separate forward pass for every action. Instead, DQN uses only the state representation as input and has one output unit for each possible action, allowing all Q-values to be computed in one forward pass. The input is $84\times84\times4$. The first convolutional layer has 32 filters of $8\times8$ with stride 4; the second has 64 filters of $4\times4$ with stride 2; the third has 64 filters of $3\times3$ with stride 1. Each is followed by a rectifier. A fully connected layer has 512 rectifier units, and the linear output layer has one unit per valid action. Games have between 4 and 18 valid actions.

**中文:** 若把历史与动作共同作为输入，则每个动作都需要单独进行一次前向传播。DQN 改为只输入状态表示，并为每个可能动作设置一个输出单元，因此一次前向传播即可计算所有动作的 Q 值。输入大小为 $84\times84\times4$。第一卷积层含 32 个 $8\times8$、步幅 4 的滤波器；第二层含 64 个 $4\times4$、步幅 2 的滤波器；第三层含 64 个 $3\times3$、步幅 1 的滤波器。每层后接整流单元。随后是含 512 个整流单元的全连接层，线性输出层对每个合法动作设置一个单元。不同游戏的合法动作数为 4-18。

<a id="S018"></a>
### 训练细节

**Source:** p.6 S018

**Original:** A different network was trained for each of 49 games, but the architecture, algorithm and hyperparameters were identical. During training only, positive rewards were clipped to 1, negative rewards to -1 and zero rewards left unchanged. This limits error-derivative scale and permits a common learning rate, but prevents the agent from distinguishing reward magnitudes. The life counter was used to mark episode termination during training.

**中文:** 49 款游戏分别训练独立网络，但网络架构、学习算法和超参数完全相同。仅在训练期间，正奖励被裁剪为 1，负奖励裁剪为 -1，零奖励保持不变。这限制了误差导数的尺度，使不同游戏可以共用学习率，但也让智能体无法区分奖励大小。对于具有生命计数器的游戏，训练时使用剩余生命数标记回合结束。

<a id="S019"></a>
**Source:** p.6 S019

**Original:** RMSProp was used with minibatches of 32. The training behaviour policy was ε-greedy, with ε annealed linearly from 1.0 to 0.1 over the first million frames and fixed at 0.1 thereafter. Training lasted 50 million frames—about 38 days of game experience—and used a replay memory of the one million most recent frames. The agent selected an action every fourth frame and repeated it on skipped frames. Hyperparameters were informally searched on Pong, Breakout, Seaquest, Space Invaders and Beam Rider, then fixed for all games; no systematic grid search was performed because of computational cost.

**中文:** 优化使用 RMSProp，小批量大小为 32。训练行为策略采用 ε-贪心：前 100 万帧内将 ε 从 1.0 线性退火至 0.1，之后固定为 0.1。每个网络训练 5000 万帧，约相当于 38 天游戏经验；回放记忆保存最近 100 万帧。智能体每 4 帧选择一次动作，并在跳过的帧上重复该动作。超参数只在《乒乓》《打砖块》《海底探险》《太空侵略者》和《光束骑士》中进行非正式搜索，随后固定用于所有游戏；由于计算成本高，作者未做系统网格搜索。

<a id="S020"></a>
### 最小先验知识与评估程序

**Source:** p.6 S020

**Original:** The setup assumes only that inputs are visual images, that a game-specific score and life count are available, and that the number—but not meaning—of actions is known. Trained agents played each game 30 times for up to 5 minutes, with random initial no-op conditions and ε=0.05. A random baseline chose an action at 10 Hz and repeated it between choices. A 60 Hz random baseline had only a small effect on normalized results. Audio was disabled for agents and humans.

**中文:** 实验只假定输入是视觉图像，能够获得游戏特定的得分与生命数，并知道动作数量但不知道各动作的含义。训练后的智能体在随机初始空操作条件下，以 $\varepsilon=0.05$ 的策略对每款游戏运行 30 次，每次最长 5 分钟。随机基线以 10 Hz 选择动作，并在相邻选择之间重复动作；改用 60 Hz 随机基线对归一化结果影响很小。智能体和人类测试都关闭音频。

<a id="S021"></a>
**Source:** p.6 S021

**Original:** The professional human tester used the same emulator, could not pause, save or reload, and played without audio at 60 Hz. Human performance is the average reward over about 20 episodes per game, each lasting at most 5 minutes, after about 2 hours of practice on each game.

**中文:** 专业人类测试员使用与智能体相同的模拟器，不得暂停、保存或重新加载，以 60 Hz、无音频方式游戏。人类表现取每款游戏约 20 个回合的平均奖励；每回合最长 5 分钟，测试前约练习 2 小时。

<a id="S022"></a>
### 强化学习形式化

**Source:** p.6 S022

**Original:** At each time-step the agent selects a legal action, the emulator changes its internal state and score, and the agent observes an image $x_t\in\mathbb{R}^d$ plus reward $r_t$. The emulator state is hidden. Because a single screen aliases many states, the task is partially observed; histories $s_t=x_1,a_1,x_2,\ldots,a_{t-1},x_t$ are therefore treated as states. Assuming finite episodes yields a large finite Markov decision process.

**中文:** 每个时间步，智能体选择一个合法动作；模拟器据此改变内部状态和得分；智能体则观察图像 $x_t\in\mathbb{R}^d$ 并接收奖励 $r_t$。模拟器内部状态对智能体不可见。由于单帧屏幕会把多个真实状态混淆，任务属于部分可观测问题，因此作者把历史序列 $s_t=x_1,a_1,x_2,\ldots,a_{t-1},x_t$ 视为状态。在所有回合有限的假设下，这形成一个规模很大但有限的马尔可夫决策过程。

<a id="S023"></a>
**Source:** pp.6-7 S023

**Original:** Future rewards are discounted by $\gamma=0.99$, and the return is $R_t=\sum_{t'=t}^{T}\gamma^{t'-t}r_{t'}$. The optimal action-value function is the maximum expected return after history $s$ and action $a$. It obeys the Bellman equation

$$Q^*(s,a)=\mathbb{E}_{s'}[r+\gamma\max_{a'}Q^*(s',a')\mid s,a].$$

Value iteration would converge in principle, but estimating a separate value for every history is impractical, so a parameterized function approximator $Q(s,a;\theta)\approx Q^*(s,a)$ is used.

**中文:** 未来奖励按 $\gamma=0.99$ 折扣，回报为 $R_t=\sum_{t'=t}^{T}\gamma^{t'-t}r_{t'}$。最优动作价值函数表示：经历历史 $s$ 并执行动作 $a$ 后能够取得的最大期望回报。它满足贝尔曼方程。理论上价值迭代可以收敛，但为每一条历史分别估计价值并不现实，因此使用参数化函数逼近器 $Q(s,a;\theta)\approx Q^*(s,a)$。

<a id="S024"></a>
### Q 网络优化

**Source:** p.7 S024

**Original:** A neural-network function approximator with weights $\theta$ is called a Q-network. Its mean-squared Bellman error changes as the network changes because the targets depend on network weights, unlike fixed supervised-learning labels. Holding parameters from a previous iteration fixed produces a sequence of well-defined optimization problems. In practice, stochastic gradient descent replaces full expectations with samples; setting target parameters to the immediately previous parameters recovers familiar Q-learning.

**中文:** 权重为 $\theta$ 的神经网络函数逼近器被称为 Q 网络。由于学习目标本身依赖网络权重，其均方贝尔曼误差会随网络变化，这与标签固定的监督学习不同。把上一阶段的参数固定，可得到一系列定义明确的优化问题。实际训练用随机梯度下降和样本替代完整期望；若目标参数直接取上一时刻参数，就可恢复常见的 Q 学习形式。

<a id="S025"></a>
**Source:** p.7 S025

**Original:** The algorithm is model-free because it learns directly from emulator samples without explicitly estimating reward and transition dynamics. It is also off-policy: it learns the greedy policy $a=\arg\max_{a'}Q(s,a';\theta)$ while following a behaviour distribution that explores, commonly an ε-greedy policy that selects the greedy action with probability $1-\varepsilon$ and a random action with probability $\varepsilon$.

**中文:** 该算法是无模型方法，因为它直接从模拟器样本学习，不显式估计奖励函数或状态转移动力学。它也是离策略方法：学习目标是贪心策略 $a=\arg\max_{a'}Q(s,a';\theta)$，实际行为分布则保留探索；常用 ε-贪心策略以 $1-\varepsilon$ 的概率选择贪心动作，以 $\varepsilon$ 的概率随机选择动作。

<a id="S026"></a>
### 经验回放

**Source:** p.7 S026

**Original:** Experience replay stores transitions $e_t=(s_t,a_t,r_t,s_{t+1})$ from many episodes in memory $D$. Random minibatches reuse each experience in multiple updates, break strong correlations between consecutive samples and average over behaviour generated by older policies, improving data efficiency and reducing variance, feedback loops, oscillation and divergence. The implementation keeps only the latest $N$ transitions and samples uniformly. This is limited because important transitions are not distinguished and old transitions are overwritten; prioritized sampling could focus on transitions from which the agent can learn most.

**中文:** 经验回放把多个回合中的转移 $e_t=(s_t,a_t,r_t,s_{t+1})$ 存入记忆 $D$。随机小批量采样可让同一经验参与多次更新，打破连续样本间的强相关性，并对旧策略产生的行为分布求平均，从而提高数据效率，降低更新方差、反馈回路、振荡和发散风险。实现中仅保存最近 $N$ 条转移并均匀采样。其局限是无法区分重要转移，旧转移也会被覆盖；优先采样可以把计算集中于最具学习价值的转移。

<a id="S027"></a>
### 目标网络与误差裁剪

**Source:** p.7 S027

**Original:** Every $C$ updates the online network is cloned to obtain a target network, which generates Q-learning targets for the next $C$ updates. This delays the effect of online updates on their own targets and makes oscillation or divergence less likely. The error term was also clipped between -1 and 1; outside that interval this corresponds to an absolute-value loss and further improves stability.

**中文:** 每隔 $C$ 次更新，在线网络被复制为目标网络；随后 $C$ 次更新的 Q 学习目标均由该目标网络生成。这样可延迟在线更新对自身目标的影响，降低振荡或发散的可能性。误差项还被裁剪到 $[-1,1]$；在该区间外，这相当于使用绝对值损失，可进一步提高稳定性。

<a id="S028"></a>
### 算法 1：带经验回放的深度 Q 学习

**Source:** p.7 S028

**Original:** Initialize replay memory $D$ and online Q-network with random weights; initialize the target network from the online network. For each episode, preprocess the initial state. At each step, select a random action with probability ε, otherwise choose the action with maximum Q; execute it and observe reward and next image; preprocess and store the transition; sample a random minibatch; use reward alone for terminal transitions, otherwise reward plus discounted maximum target-network Q-value; take a gradient step on squared TD error; every $C$ steps reset the target network to the online network.

**中文:** 初始化回放记忆 $D$ 和随机权重的在线 Q 网络，并由在线网络初始化目标网络。每个回合先预处理初始状态。每一步以 ε 概率随机选动作，否则选择 Q 值最大的动作；执行后观察奖励和下一图像；预处理并存储转移；从记忆中随机抽取小批量。若转移到终止状态，目标仅为即时奖励；否则目标为即时奖励加折扣后的目标网络最大 Q 值。随后对平方 TD 误差执行一次梯度更新，并每隔 $C$ 步把目标网络重置为在线网络。

---

## 扩展数据（PDF pp.8-13）

<a id="F005"></a>
### 扩展数据图 1｜人类与 DQN 游戏状态表示

**Placed near:** p.3 S010  
**Source:** p.8 C005

![Extended Data Figure 1](/readers/dqn-human-level-control/extended_fig1_human_agent_tsne.webp)

**Original caption:** Two-dimensional t-SNE embedding of DQN last-hidden-layer representations for Space Invaders states experienced during a combination of human (30 min) and agent (2 h) play. Similar structure and overlapping clusters for human-play (orange) and DQN-play (blue) states suggest that the learned representation generalizes beyond DQN's own policy.

**中文图注:** 人类玩 30 分钟与 DQN 玩 2 小时《太空侵略者》时所经历状态的 DQN 最后隐藏层表示，经 t-SNE 降至二维。人类状态（橙色）与 DQN 状态（蓝色）呈现相似结构和重叠簇，提示学得的表示能够泛化到 DQN 自身策略之外的数据。

<a id="F006"></a>
### 扩展数据图 2｜《打砖块》和《乒乓》的价值函数

**Placed near:** p.3 S010  
**Source:** p.9 C006

![Extended Data Figure 2](/readers/dqn-human-level-control/extended_fig2_value_functions.webp)

**Original caption:** In Breakout, predicted state value rises in anticipation of breaking through the brick wall and clearing many bricks. In Pong, action-values diverge as the agent must move the paddle toward the ball, then rise when a point becomes likely. Dashed ball trajectories are illustrative only and were not shown to the agent.

**中文图注:** 在《打砖块》中，当智能体即将打通砖墙并可能大量清砖时，预测状态价值提前上升。在《乒乓》中，当智能体需要让球拍朝球移动时，不同动作的价值开始分化；当得分变得很可能时，各动作价值随之上升。虚线球轨迹仅用于图示，并未提供给智能体。

<a id="T001"></a>
### 扩展数据表 1｜超参数及其取值

**Placed near:** p.6 S019  
**Source:** p.10 T001

![Extended Data Table 1](/readers/dqn-human-level-control/extended_table1_hyperparameters.webp)

**中文表注:** 主要设置包括：小批量 32、回放记忆 1,000,000、输入历史 4 帧、目标网络更新频率 10,000 次参数更新、折扣因子 0.99、动作重复 4、学习率 0.00025、初始/最终探索率 1/0.1，以及学习开始前 50,000 帧回放填充。参数通过 5 款验证游戏上的非正式搜索选定，未做系统网格搜索。

<a id="T002"></a>
### 扩展数据表 2｜49 款游戏的完整得分比较

**Placed near:** pp.2-3 S008  
**Source:** p.11 T002

![Extended Data Table 2](/readers/dqn-human-level-control/extended_table2_game_scores.webp)

**中文表注:** 表中依次给出随机策略、最佳线性学习器、Contingency/SARSA 智能体、专业人类测试员、DQN 均值（±标准差）及归一化 DQN 人类百分比。最后一列采用图 3 的归一化公式，因此在“人类分数接近随机分数”或分母较小时需谨慎解释。

<a id="T003"></a>
### 扩展数据表 3｜经验回放与独立目标网络的消融

**Placed near:** p.3 S009  
**Source:** p.12 T003

![Extended Data Table 3](/readers/dqn-human-level-control/extended_table3_ablation.webp)

**中文表注:** 在 5 款验证游戏上，同时使用经验回放与独立目标 Q 网络时表现最佳；去掉其中任一组件通常明显降分，二者都去掉时最差。该实验只训练 1000 万帧，且评估回合未截断为 5 分钟，不能直接与主结果数值逐项比较。

<a id="T004"></a>
### 扩展数据表 4｜DQN 与线性函数逼近器

**Placed near:** p.3 S009  
**Source:** p.13 T004

![Extended Data Table 4](/readers/dqn-human-level-control/extended_table4_linear_comparison.webp)

**中文表注:** 在相同的经验回放与独立目标网络框架下，卷积 DQN 在 5 款验证游戏上均显著优于仅使用单一线性层的函数逼近器，说明深度卷积表示是性能的重要来源。

---

## 参考文献说明

PDF pp.4-5 与 p.7 共列出 33 条参考文献。本 reader 保留正文中的引文编号及其原始页码锚点；文献题名、作者、期刊和页码不翻译，以避免改变可检索书目信息。完整书目请直接参阅原 PDF pp.4-5、p.7。

## 批判性阅读提示

1. **真正的核心贡献是稳定化组合，而非单一新组件。** 深度卷积表示、经验回放、目标网络和误差/奖励裁剪共同使 Q 学习可在高维像素输入上稳定训练。
2. **“人类水平”是操作性定义。** 论文主要以 49 款游戏上的归一化分数及“至少达到人类 75%”为标准；它并不意味着具有人类式泛化、样本效率或规划能力。
3. **样本效率差距很大。** DQN 每款游戏训练 5000 万帧（约 38 天游戏经验），而人类基线每款游戏只练习约 2 小时。
4. **奖励裁剪带来可迁移性，也损失信息。** 它使同一学习率可跨游戏使用，却让智能体无法区分不同幅度的正负奖励。
5. **探索和长时规划仍是明显弱点。** 《蒙特祖玛的复仇》得分接近零，显示 ε-贪心探索和短期价值传播难以处理稀疏奖励与长程依赖。
6. **表示图是定性证据。** t-SNE 图支持“表示包含价值相关结构”的解释，但不能单独证明高维表示的全局几何或因果功能。

---

## 校对资料

- [来源映射（source_map.json）](/readers/dqn-human-level-control/source_map.json)
- [翻译与提取说明（translation_notes.md）](/readers/dqn-human-level-control/translation_notes.md)

*本文的稳定来源锚点与 `source_map.json` 对应；提取修正和置信度说明记录于 `translation_notes.md`。*
