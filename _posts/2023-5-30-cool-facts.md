---
layout: distill
title: Cool mathematical facts
description: An example of a distill-style blog post highlighting key insights
giscus_comments: true
tags: cool-facts neural-net-theory
date: 2023-06-22

authors:
  - name: Amir Joudaki
    affiliations:
      name: ETH, Zurich

bibliography: refs.bib

# Optionally, you can add a table of contents to your post.
toc:
  - name: Equations
  - name: Citations
  - name: Footnotes
  - name: Code Blocks
  - name: Interactive Plots
  - name: Layouts
  - name: Other Typography?

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

## Matrix Insights

- Remarkable Fact 1: When $A$ and $B$ are $n\times m$ matrices, both $A^\top B$ and $B^\top A$ exhibit a striking similarity in their reduced spectra. Specifically, if $m>n$, then one of them contains $m-n$ zero eigenvalues. This assertion is grounded in determinant and characteristic polynomials, as demonstrated in this [proof](https://math.stackexchange.com/questions/124888/are-the-eigenvalues-of-ab-equal-to-the-eigenvalues-of-ba).

- Valuable Linear Algebra Identities:
  - Equation 1: $$Tr(A^k)=\sum_{i=1}^n \lambda_i(A)^k$$
  - Equation 2: $$Tr((A^*A)^k) = \sum_{i=1}^n \sigma_i(A)^{2k}$$
  - Equation 3: $$\log\det(A-z I_n)=\sum_{i=1}^n \log|\lambda_i(A)-z|=\sum_{i=1}^n\log|\sigma_i(A-z I)|$$
  - Equation 4: $$\log\det(A)=\sum_{i=1}^n|dist(X_i,span(X_1,\dots,X_{i-1}))|$$

## Mathematical Concepts

- Lindenbert's Exchange Method: This method, explained in detail in [Tao's presentation](https://terrytao.files.wordpress.com/2009/08/random_matrix.pdf), involves two key steps:
  1. The Gaussian Case: Demonstrating the validity of the law when all underlying random variables are Gaussian.
  2. Invariance: Showing that the limiting distribution remains unchanged when non-Gaussian random variables are replaced by Gaussian random variables.

- Weyl Inequality: For symmetric $n\times n$ matrices $S$ and $T$, the Weyl inequality states:
\begin{align}
\max_i |\lambda_i(S) -\lambda_i(T)| \le \|S - T\|
\end{align}
This inequality offers a powerful tool to bound the eigenvalues of perturbed matrices.

- Hoffman-Wielandt Inequality: This inequality relates to the deviation of eigenvalues based on the Frobenius norm of deviations:
\begin{align}
\sum_{i=1}^n\ (\lambda_i(A)-\lambda_i(B))^2 \le \|B\|_F^2
\end{align}
For more information, refer to [Jalil Chafai's blog](https://djalil.chafai.net/blog/2011/12/03/the-hoffman-wielandt-inequality/) and [Tao's Blog](https://terrytao.wordpress.com/2010/02/02/254a-notes-4-the-semi-circular-law/).

- Davis-Kahan Theorem: When $S$ and $T$ are symmetric matrices, and the $i$-th eigenvalue of $S$ is well-separated, the Davis-Kahan theorem states:
\begin{align}
\max_{j\neq i}|\lambda_i(S)-\lambda_j(S)|\ge \delta
\implies \sin\angle(v_i(S),v_i(T)) \le \frac{\|S-T\|}{\delta}
\end{align}
This result provides insights into the closeness of eigenvectors.

## Convexity in Symmetric Matrices

- Convexity of Trace Exponential Function: The trace exponential function, defined as $f(X):=\exp\tr(X)$, is convex in the space of symmetric matrices.

