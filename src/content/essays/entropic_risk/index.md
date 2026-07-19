---
title: "Recursive Entropic Risk in Discounted Markov Decision Processes"
date: 2026-06-24
image: "../../../assets/paintings/eruption-of-vesuvius.webp"
draft: true
---
## Project overview
Reinforcement learning (RL) usually evaluates a policy $\pi : \mathcal{S} \to \mathcal{A}$ by its expected discounted return $R \coloneqq \sum_{t=0}^{\infty} \gamma^t R_t$, where $R_t$ is the reward at time $t$ and $\gamma \in (0,1)$ is a discount factor.

This criterion is sufficient when variability around the mean is irrelevant or can be handled outside the learning objective.
It is less satisfactory when rare low-return outcomes matter directly, e.g., in safety-critical applications.
Two policies may have the same expected return while assigning very different probabilities to failure, and an expectation-based agent is indifferent between them.

We study risk-sensitive control in finite discounted Markov decision processes (MDPs) using a **recursive entropic risk measure**.
Based on the model-based method introduced by Mortensen and Talebi in *Recursive Entropic Risk Optimization in Discounted MDPs: Sample Complexity Bounds with a Generative Model* @cite:mortensen2026recursive.
We introduce a model-free, sample-based algorithm that learns the same recursive entropic fixed point without explicitly estimating the transition kernel:

1. a numerically stable implementation of entropic-risk $Q$-value iteration.
2. a reproduction of the model-based RiverSwim experiment in @cite:mortensen2026recursive.
3. a model-free stochastic approximation in exponentiated value space, and,
4. tests and experiments connecting the model-free fixed point to the original planning operator.

The current evidence is limited to finite tabular MDPs with deterministic rewards and generative-model access.

### Entropic certainty equivalents
:::definition[Entropic Certainty Equivalent]
For a bounded (random) return $X$ and risk parameter $\beta \neq 0$, we can define,

$$
\rho_\beta(X) \coloneqq -\frac{1}{\beta} \log \mathbb{E} \left[\exp(-\beta X)\right].
$$
:::

This quantity is the (un)certainty equivalent associated with exponential utility [^2].

Under the reward convention used here:
- $\beta > 0$ represents risk aversion.
- $\beta < 0$ represents risk-seeking behavior, and,
- the limit $\beta \rightarrow 0$ recovers the expectation, $\rho_0(X) \coloneqq \mathbb{E}[X]$.

For $\beta > 0$, low-return outcomes receive exponentially greater weight and $\rho_\beta(X) \leq \mathbb{E}[X]$.
Increasing $\beta$ therefore makes the criterion increasingly sensitive to the lower tail of the return distribution.

This interpretation depends on the sign convention: some literature defines entropic risk with the opposite sign.

### Recursive and trajectory-level risk are different objectives
There are two common ways to introduce a risk functional into an MDP.
A static, or trajectory-level, objective applies it once to the complete discounted return,

$$
\rho_\beta \left(\sum_{t=0}^{\infty} \gamma^t R_t \right).
$$

A recursive objective instead applies the risk functional at each step to the random continuation value.
For a fixed policy $\pi$, its value satisfies,

$$
V^\pi(s) \coloneqq R(s, \pi(s)) + \gamma \rho_\beta\left(V^\pi(S^{\prime})\right), \ S^{\prime} \sim P(\cdot \mid s, \pi(s)).
$$

The static objective describes risk in the distribution of complete trajectories, but it does not generally admit an ordinary Bellman recursion and may produce time-inconsistent preferences.
The recursive objective is a dynamic and nested criterion.
It preserves a Bellman structure, although it represents a different notion of risk and can yield more conservative policies than the static objective.

### The recursive entropic Bellman equation
:::definition[Recursive Entropic Bellman Optimality Equation]
Consider a finite MDP with state space $\mathcal{S}$, action space $\mathcal{A}$, transition kernel $P(\cdot \mid s, a)$, deterministic reward function $R(s, a)$, and discount factor $\gamma \in (0, 1)$.

The optimal state-action value satisfies,

$$
Q_\beta^\star(s, a) \coloneqq R(s, a) + \gamma \rho_\beta\left(V_\beta^\star(S^{\prime})\right), \ V_\beta^\star(s) \coloneqq \max_{a \in \mathcal{A}} Q_\beta^\star(s, a).
$$

For a finite next-state space, the backup can be written explicitly as,

$$
Q_\beta^\star(s, a) = R(s, a) -\frac{\gamma}{\beta} \log\left(\sum_{s^{\prime} \in \mathcal{S}} P(s^{\prime} \mid s, a) \exp\left[-\beta V_\beta^\star(s^{\prime})\right] \right).
$$

At $\beta = 0$, this reduces continuously to the standard risk-neutral Bellman optimality equation.
:::

## The Mortensen–Talebi model-based method
Mortensen and Talebi study recursive entropic risk in finite discounted MDPs when a generative model is available.
A generative model can be queried at an arbitrary state-action pair $(s, a)$ to produce an independent next-state sample from $P(\cdot \mid s, a)$.

Their Model-Based ERM Q-Value Iteration algorithm (MB-RS-QVI) has two stages:
1. draw a fixed number of next-state samples for every state-action pair and construct an empirical transition kernel $\widehat{P}$;
2. solve the resulting empirical MDP with recursive entropic $Q$-value iteration.

:::note[Worst-case sample complexity]
The paper provides PAC (Probably Approximately Correct) guarantees for learning both the optimal value function and an approximately optimal policy.
Its upper and lower bounds show that the worst-case statistical difficulty has unavoidable exponential dependence on $|\beta|/(1-\gamma)$.
Recursive entropic learning can therefore become substantially harder as either risk sensitivity or the effective planning horizon increases.
:::

This result motivates two separate questions:
- Can the model-based behavior be reproduced (always good to check)?
- Can the same recursive fixed point be learned directly from transition samples, without first constructing $\widehat{P}$ (i.e., in a model-free way)?

## Reimplementation of MB-RS-QVI
The model-based part of this repository follows the plug-in structure above.
For every $(s, a)$, multinomial next-state counts are converted into an empirical transition distribution.
Risk-sensitive $Q$-value iteration is then run on the empirical MDP until its maximum Bellman residual falls below a specified tolerance.

The implementation also contains exact policy evaluation under the true transition kernel.
Consequently, a learned policy is evaluated by,

$$
\Vert V_\beta^\star - V_\beta^{\widehat{\pi}} \Vert_\infty,
$$
rather than only by comparing the estimated and true Q-tables.
Exact policy recovery is recorded as a second, stricter diagnostic.

### RiverSwim reproduction
The principal benchmark is the eight-state RiverSwim MDP (as per their paper), with $\gamma = 0.95$ and risk parameters $\beta \in \{0, 1, 1.25\}$.

The environment offers a small, reliable reward at the left boundary and a larger reward at the right boundary that can only be reached by repeatedly acting against stochastic leftward drift.
This creates a (too?) simple exploration and risk-sensitivity trade-off.

The saved reproduction consists of 1,000 independent runs at each sample budget.
At the largest tested budget of 1,600 transition samples, the empirical model recovered the exact optimal policy in.

:::table[Exact optimal-policy recovery in 1,000 independent runs of MB-RS-QVI on RiverSwim.]{#exact-policy-recovery}
| Risk parameter | Exact policy recovery |
| ---: | ---: |
| $\beta = 0$ | $100.0\%$ |
| $\beta = 1$ | $99.9\%$ |
| $\beta = 1.25$ | $99.3\%$ |
:::

As per @tbl:exact-policy-recovery, the runs reproduce the qualitative behavior reported in the paper.
Error decreases and optimal-policy recovery increases with the sample budget, while larger positive $\beta$ requires more data.
Exact agreement is not expected because the paper does not specify random seed.

## A model-free extension in exponentiated space
Now, we consider a model-free, sample-based algorithm that learns the same recursive entropic fixed point without explicitly estimating the transition kernel $\widehat{P}$.

### Why a direct one-sample entropic backup fails
:::note[One-sample entropic backup]
A tempting modification of ordinary $Q$-learning is to replace its sampled Bellman target by an entropic certainty equivalent.
This does not work if the risk functional is applied to only one observed transition.

Consider for a scalar sample $y$,

$$
\rho_\beta(y) \coloneqq -\frac{1}{\beta}\log\exp(-\beta y) = y.
$$

Thus, a one-sample "entropic target" is algebraically identical to the risk-neutral target.
Risk sensitivity appears only after averaging the exponentiated targets from multiple transition samples.
:::

### Stochastic approximation
Let

$$
Y_t(s, a) \coloneqq R(s,a) + \gamma \max_{a^{\prime}} Q_t(S^{\prime}_t, a^{\prime}), \ S^{\prime}_t \sim P(\cdot\mid s, a).
$$

Instead of averaging $Y_t$ (as in ordinary $Q$-learning), the model-free learner estimates its exponential moment.
For a learner parameter $\eta$, we define

$$
Z(s, a) \approx \mathbb{E} \left[\exp\left(-\eta Y(s, a)\right)\right], \ Q(s, a) \coloneqq -\frac{1}{\eta}\log Z(s, a).
$$

The stochastic update is then,

$$
Z_{t+1}(s, a) = (1- \alpha_t) Z_t(s, a) + \alpha_t \exp\left[-\eta Y_t(s, a)\right].
$$

The code maintains $L=\log Z$ and performs this update with `logaddexp`, avoiding direct exponentiation of an accumulated value estimate.
The step size is $\alpha_t = t^{-\omega}$, with $\omega \in (1/2, 1]$.

This method is model-free in the usual tabular sense that it does not estimate or store $P$.
The current experiment nevertheless retains synchronous generative-model access: each iteration obtains one independent next-state sample for every state-action pair.
It is therefore not yet an online single-trajectory algorithm.

### The risk-parameter rescaling
The fixed point of the sample-based update must be related carefully to the planning equation.
With deterministic rewards,

$$
\begin{aligned}
-\frac{1}{\eta} \log \mathbb{E} \left[\exp\left(-\eta \left(R(s, a) + \gamma V(S^{\prime})\right)\right) \right] &= R(s, a) - \frac{1}{\eta} \log \mathbb{E} \left[\exp(-\eta\gamma V(S'))\right] \newline
& = R(s, a) + \gamma \rho_{\eta \gamma}(V(S^{\prime})).
\end{aligned}
$$

Therefore, to learn the planning fixed point with risk parameter $\beta$, the sample-based algorithm must use,

$$
\eta=\frac{\beta}{\gamma}.
$$

This rescaling is explicitly implemented in the experiment scripts and tested against exact risk-sensitive Q-value iteration.
Omitting it changes the objective being solved.

## Empirical behavior of the model-free learner
The model-free experiment uses the same eight-state RiverSwim problem $\gamma=0.95$, and risk parameters as the model-based reproduction.
Results are averaged over 100 independent runs.

:::table[Sample budget required for exact optimal-policy recovery in 100 independent runs of the model-free exponentiated-space learner on RiverSwim.]{#model-free-budget}
| Risk parameter | First tested budget with \(100\%\) recovery |
| ---: | ---: |
| $\beta = 0$ | $6{,}400$ transitions |
| $\beta = 1$ | $25{,}600$ transitions |
| $\beta = 1.25$ | $25{,}600$ transitions |
:::

As per @tbl:model-free-budget, the model-free learner required a larger sample budget than the model-based method to achieve exact optimal-policy recovery.

These results establish an empirical proof of concept.
Stochastic regression in exponentiated space can recover the recursive entropic optimum without constructing a transition model.
They also show a clear statistical cost.
At the tested endpoints, the risk-sensitive model-free runs required a sample budget of $25{,}600$, compared with $1{,}600$ for approximately $99\%$ recovery by MB-RS-QVI.

The accompanying tests verify that:
- The $\beta = 0$ update approaches ordinary $Q$-value iteration.
- The risk-sensitive update matches the planning fixed point under the $\eta \gamma = \beta$ correspondence.
- Increasing risk aversion can switch the optimal decision from a risky action to a safe action in a controlled tabular MDP.

## Scope and open questions
The current implementation isolates the central algorithmic issue in a small, controlled setting, but several questions remain open.

First, the model-free method has empirical and test-based validation, not a convergence theorem.
A formal analysis would need to characterize the exponential-space Bellman operator, stochastic approximation error, and the effect of the nonlinear transformation back to $Q$-values.

Second, synchronous generative-model sampling is considerably stronger than ordinary online interaction.
An asynchronous algorithm would need state-action-dependent step sizes, sufficient exploration, and an analysis of the resulting coupled updates.

Third, exponentiated targets can have severe variance and numerical sensitivity as $|\beta|/(1 - \gamma)$ grows.
The sample-complexity results in @cite:mortensen2026recursive indicate that this is not merely an implementation defect: recursive entropic learning is intrinsically difficult in the worst case.

Finally, the repository contains preliminary shared-resource, independent multi-agent, and deep value-learning experiments.
These are part of the broader research direction, but they are not treated as established contributions in this note.
Extending the exponentiated-space construction to nonlinear function approximation is especially delicate because a single sampled target does not itself contain entropic information; the learner must regress an exponential moment rather than apply a cosmetic transformation to the usual TD target.

[^2]: [Wikipedia, *Exponential utility*. https://en.wikipedia.org/wiki/Exponential_utility](https://en.wikipedia.org/wiki/Exponential_utility)
