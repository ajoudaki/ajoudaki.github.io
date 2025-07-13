---
layout: distill
title: "Theory of Signal Propagation in Deep Networks"
description: A review of the most important papers in theory of signal propagation 
date: 2025-07-13
tags: deep-learning theory signal-propagation neural-tangent-kernel
giscus_comments: true
authors:
  - name: Amir Joudaki
    affiliations:
      name: ETH Zurich

bibliography: refs.bib

---

The research journey to understand signal propagation has revealed profound connections between network architecture, random matrix theory, and classical kernel methods. We build this theory from the ground up, starting with the initial problem, moving to a mean-field description of signal propagation, and culminating in the modern understanding of infinite-width networks as kernel machines governed by the Neural Tangent Kernel (NTK).

### Unified Notation

Let's establish a consistent set of symbols for our discussion.

**Definition (Network Architecture).** A fully-connected network has $$L$$ hidden layers, indexed $$l=0$$ (input) to $$L+1$$ (output).
- $$n_l$$: The number of neurons (width) at layer $$l$$.
- $$x \in \mathbb{R}^{n_0}$$: An input vector.
- $$z^l(x) \in \mathbb{R}^{n_l}$$: The pre-activations at layer $$l$$.
- $$h^l(x) \in \mathbb{R}^{n_l}$$: The activations (output of neurons) at layer $$l$$.
- $$\phi(\cdot)$$: The pointwise nonlinear activation function.
- $$f_\theta(x) \in \mathbb{R}^{n_{L+1}}$$: The final output of the network for a parameter set $$\theta$$.
- $$\mathcal{L}$$: The loss function.
- $$\delta^l = \frac{\partial \mathcal{L}}{\partial z^l}$$: The error vector backpropagated to the pre-activations at layer $$l$$.

**Definition (Parameters and Initialization).** The network parameters consist of weight matrices $$W^l \in \mathbb{R}^{n_{l+1} \times n_l}$$ and bias vectors $$b^l \in \mathbb{R}^{n_{l+1}}$$. We assume a standard random initialization where parameters are drawn i.i.d from a Gaussian distribution:
$$
\begin{align}
W_{ij}^l &\sim \mathcal{N}\left(0, \frac{\sigma_w^2}{n_l}\right) \quad \text{and} \quad b_i^l \sim \mathcal{N}(0, \sigma_b^2)
\end{align}
$$
where $$\sigma_w^2$$ and $$\sigma_b^2$$ are hyperparameters controlling the variance of weights and biases respectively.

The signal flow is defined by the recurrence:
$$
\begin{align}
h^0(x) &= x \cr
z^{l+1}(x) &= W^l h^l(x) + b^l \cr
h^{l+1}(x) &= \phi(z^{l+1}(x))
\end{align}
$$

### The Law of Large Numbers and the Infinite-Width Limit

A core principle underlying these theories is the behavior of sums of random variables in the limit of many terms.

**Theorem (Law of Large Numbers).** For i.i.d. random variables $$X_j$$ with mean $$\mathbb{E}[X]$$, their sample average converges in probability to the true mean:
$$
\lim_{N \to \infty} \frac{1}{N}\sum_{j=1}^N X_j \xrightarrow{P} \mathbb{E}[X]
$$

In our context, the pre-activation of a single neuron is $$z_i^{l+1} = \sum_{j=1}^{n_l} W_{ij}^l h_j^l + b_i^l$$. This is a sum over the $$n_l$$ neurons in the previous layer. Since the weights $$W_{ij}^l$$ are drawn i.i.d., and for a fixed input $$x$$ the activations $$h_j^l(x)$$ are also random variables, many quantities involving sums over the layer width converge to expectations in the limit $$n_l \to \infty$$.

For example, consider the squared norm of the pre-activations, averaged over the layer:
$$
\begin{align}
\frac{1}{n_{l+1}}\sum_{i=1}^{n_{l+1}} (z_i^{l+1})^2 &= \frac{1}{n_{l+1}}\sum_{i=1}^{n_{l+1}} \left(\sum_{j=1}^{n_l} W_{ij}^l h_j^l + b_i^l\right)^2 \cr
\end{align}
$$
In the limit $$n_{l+1} \to \infty$$, this converges to its expectation over the random choice of parameters at layer $$l$$:
$$
\begin{align}
\lim_{n_{l+1} \to \infty} \frac{1}{n_{l+1}}\sum_{i=1}^{n_{l+1}} (z_i^{l+1})^2 &= \mathbb{E}_{W^l, b^l}[(z_i^{l+1})^2] \cr
&= \mathbb{E}\left[\left(\sum_j W_{ij}^l h_j^l + b_i^l\right)^2\right] \cr
&= \sum_j \mathbb{E}[(W_{ij}^l)^2]\mathbb{E}[(h_j^l)^2] + \mathbb{E}[(b_i^l)^2] \quad \text{(due to independence and zero means)} \cr
&= \sum_{j=1}^{n_l} \frac{\sigma_w^2}{n_l} \mathbb{E}[(h_j^l)^2] + \sigma_b^2 \cr
&= \sigma_w^2 \left( \frac{1}{n_l}\sum_{j=1}^{n_l}\mathbb{E}[(h_j^l)^2] \right) + \sigma_b^2
\end{align}
$$
As we also take $$n_l \to \infty$$, the term in the parenthesis becomes an expectation over the distribution of neurons in layer $$l$$. This formal replacement of sums with expectations is a key step in all mean-field derivations that follow.

## The Foundational Problem: Vanishing and Exploding Gradients

The earliest challenge in training deep networks was the instability of the backpropagation algorithm.

### LSTM: A Solution for Recurrent Networks

In recurrent neural networks (RNNs), which can be seen as very deep networks unfolded in time, the problem is particularly acute. The backpropagated error signal at a given time step is a product of many Jacobian matrices from future time steps. As analyzed by Hochreiter (1991), this product causes the error to either vanish or blow up exponentially.

**Remark (Constant Error Carousel).** The **Long Short-Term Memory (LSTM)** network was introduced by Hochreiter & Schmidhuber (1997) to solve this exact problem. Its core innovation is the **Constant Error Carousel (CEC)** -- a linear unit with a fixed self-connection of weight 1.0. The internal state updates additively: $$s_c(t) = s_c(t-1) + \text{input}$$, ensuring that the derivative of the state with respect to its previous state is one:
$$
\frac{\partial s_c(t)}{\partial s_c(t-1)} = 1
$$
This guarantees that error can flow backward through many time steps without its magnitude being scaled up or down, thus preventing the vanishing and exploding gradient problem. Gating mechanisms are then introduced to control the flow of information into and out of this stable memory cell.

### Glorot & Bengio Initialization for Feedforward Networks

For feedforward networks, a similar but distinct problem exists. Glorot & Bengio (2010) analyzed how the variance of activations and gradients changes as they propagate through the layers. The key idea is to maintain stable training by ensuring that the variance of outputs of each layer equals the variance of its inputs.

Consider a network in the linear regime of its activation functions ($$\phi'(z) \approx 1$$).

**Forward propagation of variance:** The variance of the activations at layer $$l$$ is given by:
$$
\text{Var}[h^l] = n_{l-1} \text{Var}[W^{l-1}] \text{Var}[h^{l-1}]
$$
To maintain constant variance ($$\text{Var}[h^l] = \text{Var}[h^{l-1}]$$), we need:
$$
n_{l-1} \text{Var}[W^{l-1}] = 1
$$

**Backward propagation of variance:** The variance of the backpropagated gradients $$\delta^l$$ is:
$$
\text{Var}[\delta^l] = n_l \text{Var}[W^l] \text{Var}[\delta^{l+1}]
$$
To maintain constant gradient variance, we need:
$$
n_l \text{Var}[W^l] = 1
$$

These conditions conflict unless all layers have equal width. As a compromise:

**Definition (Glorot (Xavier) Initialization).** The variance of weights at layer $$l$$ is set to:
$$
\text{Var}[W^l] = \frac{2}{n_{l-1} + n_l}
$$
For a uniform distribution $$U[-a, a]$$, this corresponds to $$a = \sqrt{\frac{6}{n_{l-1} + n_l}}$$.

## Deep Signal Propagation and the Edge of Chaos

The theory developed by Schoenholz et al. (2017) moved beyond variance-based heuristics to develop a precise mean-field theory for wide, randomly initialized networks.

### Mean-Field Theory for Signal Covariance

The key insight is that in a wide network, the pre-activations $$z^l$$ for any given input are a sum of many i.i.d. random variables. By the Central Limit Theorem, these pre-activations converge to a Gaussian distribution. We can track the parameters of this Gaussian (mean and covariance) from layer to layer.

Consider two inputs, $$x_a$$ and $$x_b$$. The central object is the covariance matrix of their pre-activations at layer $$l$$:
$$
K^l = \begin{pmatrix} 
q_{aa}^l & q_{ab}^l \\ 
q_{ba}^l & q_{bb}^l 
\end{pmatrix}
$$
where $$q_{ab}^l = \mathbb{E}[z_i^l(x_a) z_i^l(x_b)]$$. The expectation is over the random initialization of the network parameters.

**Theorem (Forward Covariance Recurrence).** The evolution of the covariance from layer $$l-1$$ to $$l$$ is governed by a deterministic map:
$$
\begin{align}
q_{ab}^{l} &= \sigma_w^2 \mathbb{E}_{z^{l-1} \sim \mathcal{N}(0, K^{l-1})}[\phi(z^{l-1}(x_a))\phi(z^{l-1}(x_b))] + \sigma_b^2
\end{align}
$$

**Proof.** We start with the definition of pre-activations: $$z_i^l(x_a) = \sum_{j=1}^{n_{l-1}} W_{ij}^{l-1} h_j^{l-1}(x_a) + b_i^{l-1}$$.
$$
\begin{align}
q_{ab}^l &= \mathbb{E}\left[ z_i^l(x_a) z_i^l(x_b) \right] \cr
&= \mathbb{E}\left[ \left(\sum_j W_{ij}^{l-1} h_j^{l-1}(x_a) + b_i^{l-1}\right) \left(\sum_k W_{ik}^{l-1} h_k^{l-1}(x_b) + b_i^{l-1}\right) \right] \cr
\end{align}
$$
We expand the product. The expectation is over the i.i.d. parameters $$W^{l-1}$$ and $$b^{l-1}$$. Since they are zero-mean and independent of each other and of the activations $$h^{l-1}$$ from the previous layer, all cross-terms vanish.
$$
\begin{align}
&= \mathbb{E}\left[ \sum_{j,k} W_{ij}^{l-1}W_{ik}^{l-1} h_j^{l-1}(x_a)h_k^{l-1}(x_b) \right] + \mathbb{E}[(b_i^{l-1})^2] \cr
\end{align}
$$
Since weights $$W_{ij}$$ and $$W_{ik}$$ are independent for $$j \neq k$$, $$\mathbb{E}[W_{ij}W_{ik}]=0$$. The sum over $$j,k$$ collapses to terms where $$j=k$$.
$$
\begin{align}
&= \sum_{j=1}^{n_{l-1}} \mathbb{E}[(W_{ij}^{l-1})^2] \mathbb{E}[h_j^{l-1}(x_a)h_j^{l-1}(x_b)] + \sigma_b^2 \cr
\end{align}
$$
Substitute the weight variance $$\mathbb{E}[(W_{ij}^{l-1})^2] = \sigma_w^2/n_{l-1}$$ and $$h_j^{l-1} = \phi(z_j^{l-1})$$.
$$
\begin{align}
&= \sum_{j=1}^{n_{l-1}} \frac{\sigma_w^2}{n_{l-1}} \mathbb{E}[\phi(z_j^{l-1}(x_a))\phi(z_j^{l-1}(x_b))] + \sigma_b^2 \cr
&= \sigma_w^2 \left(\frac{1}{n_{l-1}}\sum_{j=1}^{n_{l-1}} \mathbb{E}[\phi(z_j^{l-1}(x_a))\phi(z_j^{l-1}(x_b))]\right) + \sigma_b^2
\end{align}
$$
In the infinite-width limit ($$n_{l-1} \to \infty$$), the average over neurons becomes an expectation over the distribution of pre-activations $$z^{l-1}$$. By the inductive hypothesis that $$z^{l-1}$$ is a Gaussian process with covariance $$K^{l-1}$$, we arrive at the stated recurrence relation. Note that the hyperparameters $$\sigma_w^2$$ and $$\sigma_b^2$$ simply apply an affine transformation (scaling and shifting) to the core integral, which captures the effect of the nonlinearity.

### The Order-to-Chaos Phase Transition

The recurrence relation for the correlation $$c^l = q_{ab}^l / \sqrt{q_{aa}^l q_{bb}^l}$$ defines a 1D map $$c^{l-1} \mapsto c^l = F(c^{l-1})$$. The behavior of this map dictates information propagation:

- **Ordered Phase:** If $$c \to 1$$, different inputs become indistinguishable. The network cannot separate different data points because their representations collapse onto each other.
- **Chaotic Phase:** If $$c \to c^\star < 1$$, even very similar inputs become decorrelated. The network acts like a random hash function, destroying the input space's topology. It cannot generalize because it doesn't recognize that nearby inputs should have similar outputs.

The stability of the $$c^\star=1$$ fixed point is controlled by the derivative of the map at $$c=1$$. This derivative is denoted $$\chi_1$$.

**Lemma (The Criticality Parameter $$\chi_1$$).** The stability of the ordered phase is determined by:
$$
\chi_1 = \frac{\partial c^l}{\partial c^{l-1}}\bigg|_{c^{l-1}=1} = \sigma_w^2 \mathbb{E}_{z \sim \mathcal{N}(0, q^\star)}[(\phi'(z))^2]
$$
where $$q^\star$$ is the fixed-point variance, i.e., $$q^\star = \lim_{l \to \infty} q_{aa}^l$$.

**Proof.** We linearize the map $$c^l = F(c^{l-1})$$ around $$c^{l-1}=1$$. Let $$c^{l-1} = 1 - \epsilon$$.
The covariance is $$q_{ab}^{l-1} = (1-\epsilon)\sqrt{q_{aa}^{l-1}q_{bb}^{l-1}} \approx (1-\epsilon)q^\star$$.
The joint distribution of $$(z(x_a), z(x_b))$$ is a 2D Gaussian with covariance 
$$\begin{pmatrix} q^\star & (1-\epsilon)q^\star \cr (1-\epsilon)q^\star & q^\star \end{pmatrix}$$.
We can write $$z(x_b) = (1-\epsilon)z(x_a) + \sqrt{1-(1-\epsilon)^2} \eta \approx (1-\epsilon)z(x_a) + \sqrt{2\epsilon} \eta$$, where $$\eta \sim \mathcal{N}(0, q^\star)$$ is independent of $$z(x_a)$$.
We need to compute $$q_{ab}^l = \sigma_w^2 \mathbb{E}[\phi(z(x_a))\phi(z(x_b))] + \sigma_b^2$$. We expand $$\phi(z(x_b))$$ around $$z(x_a)$$:
$$
\begin{align}
\phi(z(x_b)) &\approx \phi(z(x_a) - \epsilon z(x_a) + \sqrt{2\epsilon}\eta) \cr
&\approx \phi(z(x_a)) + (-\epsilon z(x_a) + \sqrt{2\epsilon}\eta)\phi'(z(x_a)) + \frac{1}{2}(2\epsilon \eta^2)\phi''(z(x_a)) + \ldots
\end{align}
$$
Plugging this into the expectation for $$q_{ab}^l$$ and keeping terms up to first order in $$\epsilon$$:
$$
\begin{align}
\mathbb{E}[\phi(z_a)\phi(z_b)] &\approx \mathbb{E}[\phi(z_a)^2] - \epsilon\mathbb{E}[z_a \phi(z_a)\phi'(z_a)] + \epsilon\mathbb{E}[\eta^2 \phi(z_a)\phi''(z_a)] \cr
\end{align}
$$
Using Stein's Lemma, $$\mathbb{E}[z_a g(z_a)] = q^\star \mathbb{E}[g'(z_a)]$$, on the second term, and $$\mathbb{E}[\eta^2]=q^\star$$:
$$
\begin{align}
\mathbb{E}[z_a \phi(z_a)\phi'(z_a)] &= q^\star \mathbb{E}[\phi(z_a)\phi'(z_a) + z_a(\phi'(z_a)^2 + \phi(z_a)\phi''(z_a))] \cr
\end{align}
$$
This is complicated. A simpler way is to differentiate the integral expression for $$q_{ab}^l$$ w.r.t $$q_{ab}^{l-1}$$ and evaluate at $$q_{ab}^{l-1}=q^\star$$.
$$
\begin{align}
\frac{\partial q_{ab}^l}{\partial q_{ab}^{l-1}} &= \sigma_w^2 \frac{\partial}{\partial q_{ab}^{l-1}} \mathbb{E}[\phi(z_a)\phi(z_b)] = \sigma_w^2 \mathbb{E}[\phi'(z_a)\phi'(z_b)] \cr
\end{align}
$$
At the fixed point $$q_{ab}^{l-1}=q^\star$$, we have $$z_a=z_b$$, so:
$$
\begin{align}
\frac{\partial q_{ab}^l}{\partial q_{ab}^{l-1}}\bigg|_{q_{ab}^{l-1}=q^\star} &= \sigma_w^2 \mathbb{E}[\phi'(z_a)^2] = \chi_1
\end{align}
$$
Since $$c^l \approx q_{ab}^l/q^\star$$, we have $$\frac{\partial c^l}{\partial c^{l-1}} \approx \frac{\partial q_{ab}^l}{\partial q_{ab}^{l-1}}$$, giving the result.

**Definition (Phase Classification).**
$$
\begin{align}
\chi_1 < 1 &\Rightarrow \text{\textbf{Ordered Phase}} \text{ (Stable at } c=1\text{)} \cr
\chi_1 > 1 &\Rightarrow \text{\textbf{Chaotic Phase}} \text{ (Unstable at } c=1\text{)} \cr
\chi_1 = 1 &\Rightarrow \text{\textbf{Edge of Chaos}} \text{ (Criticality)}
\end{align}
$$

At the critical point, the characteristic depth scale $$\xi_c$$ over which correlations decay diverges: $$\xi_c \propto 1/|1-\chi_1|$$.

**Remark (Trainability Condition).** Networks are trainable if and only if their depth $$L$$ satisfies $$L \lesssim 6\xi_c$$. This provides the first principled, quantitative method for selecting hyperparameters to enable training of arbitrarily deep networks.

### Mean-Field Theory for Backward Propagation

A similar analysis applies to the backward pass. The backpropagation update for the error vector is $$\delta_j^{l-1} = \phi'(z_j^{l-1}) \sum_i W_{ij}^l \delta_i^l$$. We want to find the recurrence for the gradient variance $$\tilde{q}_{aa}^l = \mathbb{E}[(\delta_i^l)^2]$$.

**Theorem (Backward Recurrence).** The gradient variance evolves according to:
$$
\tilde{q}_{aa}^{l-1} = \chi_1 \cdot \tilde{q}_{aa}^l
$$

**Proof.** We compute the variance of $$\delta^{l-1}$$ assuming the weights $$W^l$$ are independent of the forward-pass weights (a standard approximation).
$$
\begin{align}
\tilde{q}_{aa}^{l-1} = \mathbb{E}[(\delta_j^{l-1})^2] &= \mathbb{E}\left[\left(\phi'(z_j^{l-1}) \sum_i W_{ij}^l \delta_i^l\right)^2\right] \cr
&= \mathbb{E}[(\phi'(z_j^{l-1}))^2] \cdot \mathbb{E}\left[\left(\sum_i W_{ij}^l \delta_i^l\right)^2\right] \quad \text{(independence)} \cr
&= \mathbb{E}[(\phi')^2] \sum_i \mathbb{E}[(W_{ij}^l)^2] \mathbb{E}[(\delta_i^l)^2] \quad \text{(independence of } W_{ij} \text{)} \cr
&= \mathbb{E}[(\phi')^2] \sum_{i=1}^{n_l} \frac{\sigma_w^2}{n_l} \tilde{q}_{aa}^l \cr
&= \left(\sigma_w^2 \mathbb{E}[(\phi')^2]\right) \left(\frac{1}{n_l} \sum_{i=1}^{n_l} \tilde{q}_{aa}^l\right) \cr
&= \chi_1 \cdot \tilde{q}_{aa}^l
\end{align}
$$
This reveals a beautiful duality:
- Ordered phase ($$\chi_1 < 1$$): Vanishing gradients
- Chaotic phase ($$\chi_1 > 1$$): Exploding gradients 
- Edge of chaos ($$\chi_1 = 1$$): Stable training

## The Neural Network Gaussian Process (NNGP)

As first noted by Neal (1994) and rigorously extended by Lee et al. (2018), the mean-field theory has a profound consequence: in the infinite-width limit, the entire network function becomes a draw from a Gaussian Process.

**Definition (Gaussian Process (GP)).** A Gaussian Process is a collection of random variables, any finite number of which have a joint Gaussian distribution. A GP is completely specified by its mean function $$\mu(x) = \mathbb{E}[f(x)]$$ and its covariance (or kernel) function $$K(x, x') = \mathbb{E}[(f(x)-\mu(x))(f(x')-\mu(x'))]$$.

**Theorem (NNGP Correspondence).** In the infinite-width limit, the network function $$f_\theta$$ is a draw from a zero-mean Gaussian Process:
$$
f_\theta \sim \mathcal{GP}(0, K^{L+1})
$$
where the kernel $$K^{L+1}$$ is the same covariance function derived from the mean-field recurrence.

**Proof.** **Proof Sketch:** The proof is by induction on the layer depth $$l$$.
1. **Base Case ($$l=1$$):** The pre-activations $$z^1(x) = W^0 x + b^0$$ are a sum of Gaussian random variables (the parameters), weighted by the input $$x$$. For any finite set of inputs $$\{x_1, \ldots, x_k\}$$, the collection of random vectors $$\{z^1(x_1), \ldots, z^1(x_k)\}$$ is a linear transformation of a single large Gaussian vector of all parameters, and is therefore jointly Gaussian. This satisfies the definition of a GP.
2. **Inductive Step:** Assume $$z^l(x)$$ is a GP. Then $$h^l(x) = \phi(z^l(x))$$ is a non-linearly transformed GP. The next pre-activations are $$z^{l+1}(x) = \sum_j W_{ij}^l h_j^l(x) + b_i^l$$. This is a sum over $$n_l$$ terms. As $$n_l \to \infty$$, the Central Limit Theorem implies that for any finite set of inputs, the pre-activations $$\{z^{l+1}(x_1), \ldots, z^{l+1}(x_k)\}$$ will be jointly Gaussian. Thus, $$z^{l+1}(x)$$ is also a GP.

The covariance function of this process is precisely the object $$q_{ab}^l$$ we tracked in the mean-field theory, which is why it is called a GP kernel. A function $$K(x,x')$$ is a valid covariance kernel if the Gram matrix $$[K(x_i, x_j)]_{i,j}$$ is positive semi-definite for any set of points $$\{x_i\}$$. This holds for the NNGP kernel because it is constructed from expectations of outer products, $$\mathbb{E}[f(x)f(x')^T]$$, which are inherently positive semi-definite.

### Bayesian Prediction with the NNGP

This equivalence allows for fully Bayesian inference without ever training a network. Given a training set 
$$\mathcal{D} = \{(x_i, t_i)\}^n_{i=1}$$ and assuming Gaussian observation noise $$\epsilon \sim \mathcal{N}(0, \sigma_\epsilon^2)$$, we can predict the output $$z^\star$$ for a new test point $$x^\star$$. The joint distribution of training targets and the test prediction is Gaussian. The predictive distribution $$P(z^\star | \mathcal{D}, x^\star)$$ is also Gaussian, with a posterior mean and variance given by:
$$
\begin{align}
\overline{\mu} &= K_{x^\star,\mathcal{D}}(K_{\mathcal{D},\mathcal{D}}+\sigma_{\epsilon}^{2}\mathbb{I}_{n})^{-1}t \cr
\overline{K} &= K_{x^{*},x^{*}} - K_{x^{*},\mathcal{D}}(K_{\mathcal{D},\mathcal{D}}+\sigma_{\epsilon}^{2}\mathbb{I}_{n})^{-1}K_{x^{*},\mathcal{D}}^{T}
\end{align}
$$
**Intuition:** The predicted mean $$\overline{\mu}$$ is a weighted average of the training targets $$t$$. The weights are computed by solving a linear system that asks: "How much does the output at each training point $$x_j$$ influence the output at the test point $$x^\star$$?" This influence is measured by the kernel $$K(x^\star, x_j)$$, while correcting for redundancies between the training points themselves (the $$(K_{\mathcal{D},\mathcal{D}} + \sigma_\epsilon^2 I)^{-1}$$ term). The posterior variance $$\overline{K}$$ measures our uncertainty; it starts at the prior variance $$K_{x^\star,x^\star}$$ and is reduced by an amount corresponding to the information gained from the training data.

## The Neural Tangent Kernel: Dynamics of Training

The GP correspondence describes networks at initialization. Jacot et al. (2018) answered the crucial question: what happens during training?

### From Gradient Descent to Kernel Gradient Descent

Consider training a model $$f_\theta(x)$$ with gradient descent on a loss $$\mathcal{L}$$. The parameters evolve as $$\frac{d\theta}{dt} = -\nabla_\theta \mathcal{L}$$ (for continuous-time gradient flow). The function itself then evolves according to the chain rule:
$$
\frac{df_\theta(x)}{dt} = (\nabla_\theta f_\theta(x))^T \frac{d\theta}{dt} = -(\nabla_\theta f_\theta(x))^T \nabla_\theta \mathcal{L}
$$
For a standard mean-squared error loss $$\mathcal{L} = \frac{1}{2N}\sum_i (f_\theta(x_i) - y_i)^2$$, the loss gradient is $$\nabla_\theta \mathcal{L} = \frac{1}{N}\sum_i \nabla_\theta f_\theta(x_i) (f_\theta(x_i) - y_i)$$. Plugging this in:
$$
\frac{df_\theta(x)}{dt} = - \frac{1}{N} \sum_i \left( (\nabla_\theta f_\theta(x))^T \nabla_\theta f_\theta(x_i) \right) (f_\theta(x_i) - y_i)
$$
If we define the **Neural Tangent Kernel (NTK)** as the inner product of the parameter gradients, this equation becomes the equation for kernel gradient flow:

**Definition (Neural Tangent Kernel (NTK)).**
$$
\Theta(\theta)(x, x') = (\nabla_\theta f_\theta(x))^T \nabla_\theta f_\theta(x')
$$

$$
\frac{df_\theta(x)}{dt} = - \frac{1}{N} \sum_i \Theta(\theta)(x, x_i) (f_\theta(x_i) - y_i)
$$
This shows that training any neural network with gradient descent is equivalent to performing kernel gradient descent in function space. The crucial difference from standard kernel methods is that for a finite-width network, the kernel $$\Theta(\theta)$$ changes as the parameters $$\theta$$ are updated.

### The Infinite-Width Limit of the NTK

**Theorem (NTK Constancy).** In the infinite-width limit ($$n_l \to \infty$$ for all hidden layers):
1. The NTK converges in probability to a deterministic limit: $$\Theta(\theta) \stackrel{P}{\to} \Theta_\infty$$
2. This limiting kernel remains constant during training: $$\frac{d\Theta_\infty}{dt} = 0$$

**Intuition:** In the infinite-width limit, each parameter's update is infinitesimal ($$O(1/n_l)$$). The parameters move very little from their random initialization. While the collective effect of these tiny changes is enough to change the function output $$f_\theta$$ by a finite amount, the change in the gradient of the function with respect to the parameters, $$\nabla_\theta f_\theta$$, is negligible. Since the NTK is an inner product of these gradients, it remains fixed at its initial value. This is often called the "lazy training" regime.

This means infinitely wide networks behave like linear models in the (infinitely high-dimensional) feature space defined by the gradients at initialization.

### NTK Recurrence Relation

The limiting NTK, $$\Theta_\infty^{(L)}$$, can be computed via a recurrence relation.

**Theorem (NTK Recurrence).**
$$
\Theta_\infty^{(L+1)}(x, x') = \Theta_\infty^{(L)}(x, x') \dot{K}^{(L+1)}(x, x') + K^{(L+1)}(x, x')
$$
where $$K^{(L+1)}$$ is the NNGP kernel and $$\dot{K}^{(L+1)}(x,x') = \mathbb{E}_{z \sim \mathcal{GP}(0, K^{(L)})}[\phi'(z(x))\phi'(z(x'))]$$.

**Proof.** The proof is by induction on the depth $$L$$.
1. **Decomposition:** The NTK is a sum over all parameters. We can split the parameters $$\theta$$ into those of the first $$L$$ layers ($$\tilde{\theta}$$) and those of the last layer ($$\theta_L = \{W^L, b^L\}$$).
   $$
   \Theta^{(L+1)}(\theta) = \sum_{p \in \tilde{\theta}} (\nabla_p f)^T (\nabla_p f) + \sum_{p \in \theta_L} (\nabla_p f)^T (\nabla_p f)
   $$
   
2. **Last Layer Contribution:** Let's analyze the term for the last layer's parameters. The gradient of the network output $$f_k(x) = \frac{1}{\sqrt{n_L}}\sum_i W^L_{ki}h^L_i(x) + b^L_k$$ with respect to its own parameters is:
   $$
   \begin{align}
   \nabla_{W^L_{ki}} f_k(x) &= \frac{1}{\sqrt{n_L}} h^L_i(x) \cr
   \nabla_{b^L_k} f_k(x) &= 1
   \end{align}
   $$
   The contribution to the NTK from the last layer is the sum of dot products over all these parameters. For the $$(k, k')$$ entry of the kernel matrix:
   $$
   \begin{align}
   [\nabla_{\theta_L} f(x) \cdot \nabla_{\theta_L} f(x')]_{kk'} &= \sum_{i=1}^{n_L} (\nabla_{W^L_{ki}} f_k(x))(\nabla_{W^L_{k'i}} f_{k'}(x')) + (\nabla_{b^L_k} f_k(x))(\nabla_{b^L_{k'}} f_{k'}(x')) \cr
   &= \delta_{kk'} \left( \sum_{i=1}^{n_L} \frac{1}{n_L} h^L_i(x)h^L_i(x') + 1 \right)
   \end{align}
   $$
   In the limit $$n_L \to \infty$$, the sum becomes an expectation by the Law of Large Numbers. Assuming $$\sigma^2_b=1$$ for this part of the kernel (or generally, $$\beta^2$$ as in the original paper), this term converges to $$\delta_{kk'} K^{(L+1)}(x,x')$$. This is the NNGP kernel.
   
3. **Lower Layers Contribution:** Now consider the gradient with respect to a parameter $$\tilde\theta_p$$ in the lower layers. By the chain rule:
   $$
   \nabla_{\tilde{\theta}_p} f_k(x) = \frac{\partial f_k}{\partial h^L} \frac{\partial h^L}{\partial z^L} \frac{\partial z^L}{\partial \tilde{\theta}_p} = \sum_{i=1}^{n_L} \frac{1}{\sqrt{n_L}} W_{ki}^L \phi'(z_i^L(x)) \nabla_{\tilde{\theta}_p} z_i^L(x)
   $$
   The dot product for the $$(k,k')$$ entry of the NTK is:
   $$
   \begin{align}
   [\nabla_{\tilde{\theta}} f(x) \cdot \nabla_{\tilde{\theta}} f(x')]_{kk'} &= \sum_p \left(\sum_i \frac{W_{ki}^L}{\sqrt{n_L}}\phi'(z_i^L(x))\nabla_p z_i^L(x)\right) \left(\sum_j \frac{W_{k'j}^L}{\sqrt{n_L}}\phi'(z_j^L(x'))\nabla_p z_j^L(x')\right) \cr
   &= \frac{1}{n_L} \sum_{i,j} W_{ki}^L W_{k'j}^L \phi'(z_i^L(x))\phi'(z_j^L(x')) \left( \sum_p \nabla_p z_i^L(x) \cdot \nabla_p z_j^L(x') \right)
   \end{align}
   $$
   In the infinite-width limit, the weights $$W^L$$ are independent of the lower-layer gradients. Also, $$\nabla_p z^L_i$$ and $$\nabla_p z^L_i$$ are independent for $$i \neq j$$. So the sum collapses to $$i=j$$ and $$\mathbb{E}[W^L_{ki} W^L_{k'j}] = \delta_{kk'} \delta_{ij} \sigma^2_w/n_L$$. The term $$\sum_p (\nabla_p z^L_i(x) \cdot \nabla_p z^L_i(x'))$$ is the NTK of the $$L$$-layer subnetwork, $$\Theta^{(L)}$$. Taking the expectation over the random variables at layer $$L$$, we get:
   $$
    \delta_{kk'} \left(\frac{1}{n_L} \sum_i \frac{\sigma_w^2}{n_L} \Theta^{(L)}(x,x') \phi'(z_i^L(x))\phi'(z_i^L(x'))\right) \xrightarrow{n_L \to \infty} \delta_{kk'} \sigma_w^2 \Theta_\infty^{(L)}(x,x') \dot{K}^{(L+1)}(x,x')
   $$
   (Assuming $$\sigma_w^2=1$$ for the recursive part gives the formula in the theorem).
   
4. **Combining Terms:** Adding the contributions from the last layer and the lower layers gives the final recurrence relation.

**Remark (Training Dynamics).** Training dynamics for infinitely wide networks on MSE loss are described by a linear ODE. The network converges fastest along directions of largest NTK eigenvalues (kernel principal components), providing a theoretical motivation for early stopping. The final function is equivalent to performing kernel ridge regression with the NTK.

## Recap

This theoretical journey provides a coherent narrative for understanding deep learning:

1. **Early studies** on LSTMs and initialization schemes identified that stable signal and gradient propagation is the core challenge of training deep models.
2. **Edge of Chaos theory** provides a precise mean-field description of signal dynamics in wide networks, revealing a critical boundary in hyperparameter space that separates trainable from untrainable regimes.
3. **Kernel equivalence results** show that this physical theory has profound mathematical consequences. In the infinite-width limit, neural networks become equivalent to well-understood statistical models: they are Gaussian Processes at initialization and perform kernel regression with the Neural Tangent Kernel during training.

The hyperparameters ($$\sigma_w^2, \sigma_b^2$$) that place a network at the "edge of chaos" are precisely those that define a well-behaved, non-degenerate kernel, allowing effective learning and generalization through structured exploration of function space. This progression from heuristic fixes to a complete kernel description represents one of the most significant theoretical advances in modern deep learning, bridging the gap between the practical art of training neural networks and their rigorous mathematical theory.