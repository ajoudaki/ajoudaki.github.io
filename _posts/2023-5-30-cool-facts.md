---
layout: distill
title: my first post cool facts 
description: an example of a distill-style blog post and main elements
giscus_comments: true
tags: cool-facts neural-net-theory
date: 2023-06-22

authors:
  - name: Amir Joudaki
    affiliations:
      name: ETH, Zurich

bibliography: refs.bib

# Optionally, you can add a table of contents to your post.
# NOTES:
#   - make sure that TOC names match the actual section names
#     for hyperlinks within the post to work correctly.
#   - we may want to automate TOC generation in the future using
#     jekyll-toc plugin (https://github.com/toshimaru/jekyll-toc).
toc:
  - name: Equations
    # if a section has subsections, you can add them as follows:
    # subsections:
    #   - name: Example Child Subsection 1
    #   - name: Example Child Subsection 2
  - name: Citations
  - name: Footnotes
  - name: Code Blocks
  - name: Interactive Plots
  - name: Layouts
  - name: Other Typography?

# Below is an example of injecting additional post-specific styles.
# If you use this post as a template, delete this _styles block.
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



- Holly cow, if $A$ and $B$ are $n\times m$ matrices, $A^\top B$ and $B^\top A$ have similar reduced spectrum (if $m>n$, then one of them has $m-n$ zero eigenvalues, proof based on determinant and characteristic polynomials [proof here](https://math.stackexchange.com/questions/124888/are-the-eigenvalues-of-ab-equal-to-the-eigenvalues-of-ba))

- Very useful linear algebra identities:
  - $$Tr(A^k)=\sum_{i=1}^n \lambda_i(A)^k$$
  - $$Tr((A^*A)^k) = \sum_{i=1}^n \sigma_i(A)^{2k}$$
  - $$\log\det(A-z I_n)=\sum_{i=1}^n \log|\lambda_i(A)-z|=\sum_{i=1}^n\log|\sigma_i(A-z I)|$$
  - $$\log\det(A)=\sum_{i=1}^n|dist(X_i,span(X_1,\dots,X_{i-1}))|$$

- **Lindenbert's exchange method** [Tao's presentation](https://terrytao.files.wordpress.com/2009/08/random_matrix.pdf): 
  1. *The gaussian case* Show that the law holds when all the underlying random variables are gaussian.
  2. *Invariance* Show that the limiting distribution is unchanged when non-gaussian random variables are replaced by
gaussian random variables 

- **Weyl inequality** for symmetric $n\times n$ matrices $S, T$, we have
\begin{align}
\max_i |\lambda_i(S) -\lambda_i(T)| \le \|S - T\|
\end{align}
- ooooh Weyl is really cool: we can bound eigenvalues of a perturbed matrix 
- **Hoffman-Wielandt inequality** bounds deviations of eigenvalues based on Fro norm of deviations
\begin{align}
\sum_{i=1}^n\ (\lambda_i(A)-\lambda_i(B))^2 \le \|B\|_F^2
\end{align} [Jalil Chafai's blog](https://djalil.chafai.net/blog/2011/12/03/the-hoffman-wielandt-inequality/), [Tao's Blog](https://terrytao.wordpress.com/2010/02/02/254a-notes-4-the-semi-circular-law/)

- Davis-Kahan: if $S$ and $T$ are symmetric matrices and $i$-th eigenvalue of $S$ is well seperated, then the i-th eigenvectors are close in agle:
\begin{align}
\max_{j\neq i}|\lambda_i(S)-\lambda_j(S)|\ge \delta
\implies \sin\angle(v_i(S),v_i(T)) \le \frac{\|S-T\|}{\delta}
\end{align}

- trace exponential function is convex in the space of symmmetric matrices $f(X):=\exp\tr(X)$


