---
layout: distill
title: Beyond a Single Reality - Crafting Activation Functions with Many Stable 'Norms'
description: A look into how we can design neural network activation functions that support multiple, distinct stable modes of operation, breaking the one-size-fits-all dynamics.
giscus_comments: true
tags: deep-learning, theory, neural-networks
date: 2025-07-01

authors:
  - name: Amir Joudaki
    affiliations:
      name: ETH, Zurich

bibliography: refs.bib

# Below is an example of injecting additional post-specific styles.
_styles: >
  .fake-img {
    background: #bbb;
    border: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: 0 0px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 12px;
  }
  .fake-img p {
    font-family: monospace;
    color: white;
    text-align: left;
    margin: 12px 0;
    text-align: center;
    font-size: 16px;
  }

---

When we think about the signals traveling through a deep neural network, we often imagine a self-regulating system. The "mean-field theory" for infinitely wide networks tells us that as a signal passes from one layer to the next, its variance (a measure of its strength or "norm") tends to race towards a single, stable value. No matter how strong or weak the initial signal, the network's internal dynamics push it toward one characteristic operational regime.

This behavior is seen in most common activation functions like ReLU, Tanh, and others. It's a neat and tidy picture, but it begs the question:

> **Is this single-reality behavior a universal law, or can we design activation functions that support multiple stable operational modes?**

It turns out, the answer is a resounding **yes**. This article provides a beautiful constructive proof showing that for any integer $N \ge 1$, we can create a well-behaved activation function that has $N$ distinct, stable fixed points for the signal's variance.

***

### The Standard Story: One Stable Point

Let's quickly formalize this. In an infinitely wide network, the variance of the signal at layer $l+1$, let's call it $q_{l+1}$, is a function of the variance at the previous layer, $q_l$. This relationship is defined by the map:

$$
F(q) = \sigma_w^2 E[f(\sqrt{q}z)^2] + \sigma_b^2 \quad \text{where } z \sim \mathcal{N}(0,1)
$$

Here, $f$ is our activation function, and $\sigma_w^2$ and $\sigma_b^2$ are the variances of the weights and biases. A **stable fixed point**, $q^*$, is a variance that doesn't change from layer to layer, meaning it satisfies $F(q^*) = q^*$.

If you plot the function $F(q)$ for standard activations (like in the figure below), you'll see that it crosses the identity line ($y=q$) at only one non-zero point. This intersection is the single, attracting fixed point that governs the network's dynamics.

{% include figure.html path="{{ '/assets/img/standard_activations_plot.png' | relative_url }}" title="Figure 1: The Fixed-Point Map for Standard Activations" caption="The fixed-point map $F(q)$ for standard activations. Each function displays a single non-zero attracting fixed point where its curve intersects the identity line." %}

***

### A New Recipe: Building an Activation with N Fixed Points

So how do we break this mold? The core idea is surprisingly elegant. We'll construct an activation function $f(x)$ as a sum of $N$ simpler functions, where each one is responsible for creating a single fixed point. The trick is to make these simple functions operate on completely different scales of the input.

For simplicity, let's assume the weight variance $\sigma_w^2=1$ and bias variance $\sigma_b^2=0$. Our goal is to solve $q = E[f(\sqrt{q}z)^2]$.

We define our activation function as a sum of $N$ rectangular pulses, $f(x) = \sum_{k=1}^N f_k(x)$, where each pulse is non-zero only in a specific interval:

$$
f_k(x) =
\begin{cases}
c_k & \text{if } x \in S_k \\
0 & \text{otherwise}
\end{cases}
$$

The key is to choose the support intervals $S_k$ to be **disjoint**. We can achieve this by picking a separation parameter $C > 2$ and defining our desired fixed points and their corresponding intervals as:

1.  **Desired Fixed Points:** $q^*_k = C^{2k}$ for $k=1, \dots, N$.
2.  **Support Intervals:** $S_k = [\sqrt{q^*_k}, 2\sqrt{q^*_k}] = [C^k, 2C^k]$.

With $C>2$, these intervals $[C, 2C], [C^2, 2C^2], \dots$ will never overlap. Because the pulses are disjoint, $f(x)^2 = \sum f_k(x)^2$, which simplifies the math immensely.

The final step is to find the heights of these pulses, the coefficients $c_k$. This involves solving a system of linear equations. The article shows that as long as our separation parameter $C$ is large enough, the matrix in this system becomes diagonally dominant, which guarantees that a unique solution for the pulse heights exists.

***

### Seeing is Believing

Using this construction for $N=5$ and $C=3$, we get the activation function and its corresponding fixed-point map shown below.

{% include figure.html path="{{ '/assets/img/constructed_function_plot.png' | relative_url }}" title="Figure 2: Constructed Activation with 5 Stable Fixed Points" caption="The constructed activation function $f(x)$ for $N=5$ (top) and its corresponding fixed point map $F(q)$ (bottom). The map clearly shows 5 stable fixed points, as designed." %}

The top panel shows our custom function, composed of five rectangular pulses at different scales. The bottom panel shows its fixed-point map, $F(q)$. Just as designed, the function crosses the identity line at exactly five points: $3^2, 3^4, 3^6, 3^8,$ and $3^{10}$. The sharp, step-like nature of the curve ensures that the derivative at each fixed point is near zero, making them all highly stable.

***

### Why Does This Matter? 🤔

The ability to create activation functions with multiple stable fixed points is more than just a mathematical curiosity. It has profound implications for network design:

* **Input-Dependent Processing:** A network using such a function could operate in different stable modes depending on the norm of its input. Strong signals could be processed in one regime, while weaker signals are handled in another.
* **Richer Representations:** The network could potentially learn to map different types of inputs to different stable norms. This could create a more structured and separated representational space, potentially aiding in complex classification tasks.

In essence, this construction allows us to move away from a "one-size-fits-all" network dynamic and towards a rich landscape of multiple, stable operational pathways. It's a powerful new tool for engineers and researchers to design the intricate behavior of deep neural networks.