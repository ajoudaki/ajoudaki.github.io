---
layout: post 
title: "On the global stability of activation variance"
description: "Can an activation have multiple variance stable points? This post proves it affirmitively. "
giscus_comments: true
tags: deep-learning, theory, neural-networks, mean-field
date: 2025-07-01

authors:
  - name: Amir Joudaki
    affiliations:
      name: ETH, Zurich

bibliography: refs.bib

include_scripts:
  - "https://cdnjs.cloudflare.com/ajax/libs/plotly.js/2.26.0/plotly.min.js"
  - "/assets/js/blog/norm-fixed-points-standard.js"
  - "/assets/js/blog/norm-fixed-points-constructed.js"

---

### The Dynamics of Signal Norms in Deep Networks

In the study of infinitely wide neural networks, mean-field theory provides a powerful framework for analyzing signal propagation. Consider a standard Multi-Layer Perceptron (MLP) where weights and biases are initialized as $w_{ij} \sim \mathcal{N}(0, \sigma_w^2/n_{in})$ and $b_i \sim \mathcal{N}(0, \sigma_b^2)$. In the infinite-width limit, the Central Limit Theorem dictates that the pre-activations at each layer become Gaussian. This allows us to track the evolution of the signal's squared norm (variance) deterministically.

The variance at layer $l+1$, denoted $q_{l+1}$, is a function of the variance at the previous layer, $q_l$, given by the map:
$$
q_{l+1} = F(q_l) \equiv \sigma_w^2 E_{z \sim \mathcal{N}(0,1)}[f(\sqrt{q_l}z)^2] + \sigma_b^2
$$
This equation describes how the expected signal variance evolves as it propagates through the network. A central question in understanding these dynamics is the existence and nature of **fixed points**—variances $q^\star$ for which the signal strength remains constant, i.e., $F(q^\star) = q^\star$.

A fixed point $q^\star$ is **locally attracting** if $\|F^\prime(q^\star)\| < 1$ and repulsive otherwise. This stability condition dictates the long-term behavior of the network's signal norms, leading to two distinct possibilities:

1.  **Category 1: Single Globally Attracting Fixed Point.** The network possesses one attracting fixed point $q^\star$ (and possibly other repulsive ones). For almost any input norm, the layer-wise variance $q_l$ will converge to $q^\star$. In this regime, the network effectively "forgets" the initial scale of its input.
2.  **Category 2: Multiple Attracting Fixed Points.** The network has several locally attracting fixed points, each with its own basin of attraction. The final converged norm depends on the initial input norm $q_0$. In this scenario, the network can "remember" information about the input's scale in its deeper layers.

A numerical verification reveals that virtually all commonly used activation functions—such as ReLU, Tanh, and GeLU—belong to **Category 1**. They exhibit a single, globally attracting fixed point. While adjusting $\sigma_w^2$ and $\sigma_b^2$ applies an affine transformation to the $F(q)$ map, a visual inspection confirms that no such transformation can induce multiple stable fixed points for these standard functions.

{% include visualizations/norm-fixed-points-standard.html %}

This observation motivates our main inquiry: is the single fixed-point behavior a fundamental property, or is it merely a feature of the specific activations we choose to use? More formally:

> **Is it possible to construct an activation function with an arbitrary number of attracting fixed points?**

As we will now show constructively, the answer is yes.

---

### A Construction for N Stable Fixed Points

Our goal is to design an activation function $f(x)$ that yields $N$ distinct, positive, and stable solutions to $F(q) = q$. For simplicity, we develop the construction for the case where $\sigma_w^2=1$ and $\sigma_b^2=0$.

#### Intuition

The core intuition is to combine several simple functions, each responsible for creating one fixed point. To prevent these functions from interfering with one another, we design them to operate on disjoint and exponentially spaced input scales. We use a set of rectangular "bumps." When the input norm $q$ is close to the region targeted by the $k$-th bump, the contributions from all other bumps ($k-1, k+1, \ldots$) are negligible, effectively isolating the dynamics for each fixed point.

#### Formal Construction

Let the activation function be a sum of $N$ disjoint rectangular pulses: $f(x) = \sum_{k=1}^N f_k(x)$, where
\begin{align}
f_k(x) =
\begin{cases}
c_k & \text{if } x \in S_k \cr
0 & \text{otherwise}
\end{cases}
\end{align}
Since the supports $S_k$ are disjoint, we have $f(x)^2 = \sum_{k=1}^N f_k(x)^2$. This orthogonality is key. The fixed-point equation $q = E[f(\sqrt{q}z)^2]$ becomes:
\begin{align}
q = \sum_{k=1}^N E[f_k(\sqrt{q}z)^2] = \sum_{k=1}^N c_k^2 \cdot P(\sqrt{q}z \in S_k)
\end{align}
We choose our desired fixed points $q^\star_j$ and support intervals $S_k$ to be exponentially spaced, governed by a separation parameter $C > 2$:
1.  **Desired Fixed Points:** $q^\star_j = C^{2j}$ for $j=1, \ldots, N$.
2.  **Support Intervals:** $S_k = [\sqrt{q^\star_k}, 2\sqrt{q^\star_k}] = [C^k, 2C^k]$.

This choice ensures $S_j \cap S_k = \emptyset$ for $j \neq k$. To enforce that these $q^\star_j$ are indeed fixed points, the pulse heights $c_k^2$ must satisfy the following system of $N$ linear equations for each $j \in \{1, \ldots, N\}$:
\begin{align}
q^\star_j = \sum_{k=1}^N c_k^2 \cdot P(\sqrt{q^\star_j}z \in S_k)
\end{align}
Let's define the vector of squared coefficients $\mathbf{c^2} = [c_1^2, \ldots, c_N^2]^T$ and the vector of fixed points $\mathbf{q^\star} = [q^\star_1, \ldots, q^\star_N]^T$. The system can be written in matrix form as $\mathbf{q^\star} = \mathbf{A} \mathbf{c^2}$, where the matrix entries $A_{jk}$ are:
\begin{align}
A_{jk} = P(\sqrt{q^\star_j}z \in S_k) = P(z \in [C^{k-j}, 2C^{k-j}]) = \Phi(2C^{k-j}) - \Phi(C^{k-j})
\end{align}
where $\Phi$ is the CDF of the standard normal distribution.

#### Proof of Existence

To guarantee a unique, positive solution for $\mathbf{c^2}$ exists, the matrix $\mathbf{A}$ must be invertible. Let's analyze its entries in the limit of large separation, $C \to \infty$:
* **Diagonal elements ($j=k$):** $A_{jj} = \Phi(2) - \Phi(1) \approx 0.1359$.
* **Off-diagonal elements ($j \neq k$):** The term $C^{k-j}$ approaches either $\infty$ or $0$.
    * If $k > j$, then $C^{k-j} \to \infty$, and $A_{jk} \to \Phi(\infty) - \Phi(\infty) = 0$.
    * If $k < j$, then $C^{k-j} \to 0$, and $A_{jk} \to \Phi(0) - \Phi(0) = 0$.

Thus, as $C \to \infty$, $\mathbf{A}$ converges to a diagonal matrix with positive entries on the diagonal, rendering it strictly diagonally dominant and therefore invertible. This guarantees the existence of a unique solution for the coefficients $\mathbf{c^2}$ for a sufficiently large $C$. Since $N$ was chosen arbitrarily, we can construct an activation function with any number of fixed points.

{% include visualizations/norm-fixed-points-constructed.html %}

#### A Remark on Stability

The fixed points we constructed are not just numerous, but also stable. The function $F(q)$ is analytic (infinitely differentiable) because it is the result of convolution with a Gaussian kernel. For a smooth function intersecting the identity line multiple times, a simple geometric argument implies that if $F^\prime(q) \neq 1$ at the intersections, then attracting ($\|F^\prime(q^\star)\| < 1$) and repelling ($\|F^\prime(q^\star)\| > 1$) fixed points must alternate. Our construction, with its step-like $F(q)$, ensures that at each engineered fixed point $q^\star_k$, the derivative $F^\prime(q^\star_k)$ is extremely close to zero, making them all strongly attracting.

---

### Conclusion and Future Directions

We have demonstrated that while common activation functions exhibit a single globally attracting fixed point for signal variance, it is possible to constructively design activation functions with an arbitrary number of stable fixed points. This finding moves the dynamics of signal norms from a "one-size-fits-all" regime to a rich landscape where the network's behavior can depend on the input's scale.

This opens several interesting avenues for future research:
* What are the sufficient conditions on an activation function $f$ that guarantee its corresponding map $F(q)$ has only one globally attracting fixed point? While conditions on $F(q)$ (e.g., convexity) are straightforward, mapping them back to simple properties of $f$ is non-trivial.
* Can we construct other families of multi-fixed-point activations, for example, with fixed points clustered in a finite interval like $[0, 1]$ instead of being exponentially spaced?

Interestingly, this rich, function-dependent behavior of **variance dynamics** stands in stark contrast to that of **covariance dynamics**. In a related work ("Emergence of Globally Attracting Fixed Points in Deep Neural Networks With Nonlinear Activations," AISTATS 2025), we show that if one considers the evolution of the *covariance* between two different inputs (assuming unit variance is maintained at each layer), the dynamical map *always* has a single, globally attracting fixed point. This universality holds for *any* non-linear activation function. This highlights a fascinating dichotomy: signal variance dynamics are customizable and activation-dependent, whereas signal covariance dynamics are universal and robust.