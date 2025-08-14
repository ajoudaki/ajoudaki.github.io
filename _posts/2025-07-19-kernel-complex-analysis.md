---
layout: distill 
title: "Complex-Analytic Proofs of Global Attraction for Neural Kernel Map"
description: A global contraction of the kernel map using Schwarz–Pick, Julia–Carathéodory, and Rogosinski extremals.
date: 2025-08-12
tags: complex-analysis, dynamical-systems, neural-kernels, mean-field, fixed-points
giscus_comments: true
related_publications: true
authors:
  - name: Amir Joudaki
    affiliations:
      name: ETH Zurich

toc:
  - name: "Prelude: bridging fields with AI"
  - name: "Setup and the original master theorem"
  - name: "An alternative complex-analytic proof"
  - name: "Neural implications and concrete comparison"

include_scripts: []
---

## Prelude: bridging fields with AI

In my AISTATS paper {% cite joudaki2025aistats %}, we proved that the mean-field neural kernel (a.k.a. conjugate kernel, or NNGP kernel) sequence of a deep MLP converges globally to a fixed point determined by the activation and architecture. My proof involved using Hermite polynomials, and relying on the specific algebraic properties of the neural kernel. The proof was self-contained and was entirely elementary. 
Now, roughly a year later after that, with the help of GPT-5's thinking and deep research mode, I found that my elementary proofs are connected to some deep concepts in classical complex analysis that date back almost a century back. 

The process of me finding out about the complex analytical results wasn't quite one-shot. My first attempts to uncover possible links with various branches of mathematics only revealed that a combination of Schwarz's lemma and could explain the global attraction result, but without any explicit convergence result. I tried several more times to find more advanced result to no avail. 

In my final successful attempt, I kind of tried to reverse the process. First, I converted my explicit global convergence results to an statement about holomorphic functions. Once stated in these terms, I did a deep research to find if this statements are novel or are discovering some known complex analytic fact. This transformation of the statement apparently was sufficient to trigger GPT-5 to realize that these results were nearly identical to earlier and by now classical results, dating back to a work from almost a century ago. A little more digging revealed sharp lemmas and extremal principles scattered across function theory, allowing alternative proofs that are shorter and conceptually cleaner, and are actually sharper than my results.

I think my story with my elementary proof and these new more involved proofs is only the tip of the iceberg. I believe models like like GPT-5 can act as literature compasses, and help bridge distant areas of knowledge, reuniting ideas that are separated across history and disciplines. If used thoughtfully, they reveal where to look, which classical stones to turn, and how far existing results already reach. I think it's no overstating to say that this could bring about a renaissance for mathematics, human knowledge, and more broadly understanding of the world around us.
 
---

## Setup and the original master theorem

We work in the mean-field regime for a fully-connected, width-$d$ MLP at random initialization with activation $\phi$ that has a finite Gaussian second moment. Let

$$
\rho_{\ell+1} \;=\; \kappa(\rho_\ell),
\qquad
\kappa(\rho) \;=\; \mathbb E[\phi(X)\phi(Y)],
\qquad
\begin{pmatrix}X\\Y\end{pmatrix}
\sim \mathcal N\!\left(0,\begin{pmatrix}1&\rho\\ \rho&1\end{pmatrix}\right),
$$

as in {% cite poole2016 %}. 

Throughout this analysis we assume $\kappa(1) = 1$ which impplies  $E\phi(z)^2 = 1$ for $z\sim N(0,1)$. This implies that $\kappa$ is a mapping from $[-1,1]$ onto itself. This means we can study the kernel sequence as a fixed point iteration, and thus, ask the following key question:

> **The key inquiry** in our work was the convergence behavior and speed of sequence $\rho_0, \kappa(\rho_0),\kappa(\kappa(\rho_0)) \ldots $ as a function of its starting point $\rho_0$ and properties of the activation.  


Some more definitons and terminology: 

- **Kernel sequence**: starting from $\rho_0$, we denote the $\ell$-th point in the the sequence by $\rho_\ell$, or alternatively as $\kappa^{\circ \ell}(\rho_0),$ which indicates it is $\ell$ invocation of the kernel map on the input.   
- **Fixed points**: are defined as invariant locations for the kernel map:
$\kappa(\rho^\star) = \rho^\star. $
- **Locally attracting fixed points** are defined as $\rho^\star$ such that if starting from an infinitesmal neighborhood of $\rho^\star$, kernel sequence will converge to $\rho^\star.$ 
- **Locally repulsive fixed point**: are defined as $\rho^\star$ such that if starting from an infinitesmal neighborhood of $\rho^\star$, kernel sequence will diverge from $\rho^\star.$ 
- **Global attracting fixed point** are defined as $\rho^\star$ such that for all starting points other than some measure zero set of $[-1,1]$, the kernel sequence will converge to $\rho^\star. $ 


**High level insights from the proofs:** The most crucial first insight to the work is that we must expand $\phi$ in the normalized Hermite basis $\phi=\sum_{k\ge0} c_k\,\mathrm{He}_k$ yields the analytic self-map

$$
\kappa(z) \;=\; \sum_{k=0}^\infty c_k^2\, z^k \quad \text{on } \mathbb D.
$$

Thus, based on the asusmption that $\kappa(1)=1$ we will have $\sum_{k=0}^\infty c_k^2 = 1. $ This means that kernel map $\kappa$ is a highly smooth, aka analytic function, and it is also a mapping from $[-1,1]$ onto itself. These two restrictions were the essential ingregdients to proof the bounds above. If we plot the kernel map for various functions, it becomes readily immediately clear that its smoothness will prevent us from crossing the identity more than two times. But to make this intuition formal, it took several days of painstaking step-by-step derivations. 


For comparison reasons, here is the statement of the master theorem in the paper:


#### Original master theorem 

Assume forward stability $\kappa(1)=1$ and nonlinearity $\sum_{k\ge2} c_k^2>0$. Let 
$\rho_{\ell+1}=\kappa(\rho_\ell)$ 
with $\rho_0\in(-1,1)$. Then the iterates converge globally to a unique attracting fixed point $\rho^\star\in[0,1]$ with the following casewise rates:

1. Centered activations $\kappa(0)=0$:

   
   $$
   \Phi(\rho_\ell) \;\le\; \left(\frac{1}{\,2-\kappa'(0)\,}\right)^{\!\ell}\, \Phi(\rho_0),
   \qquad \rho^\star=0.
   $$

2. Boundary Denjoy–Wolff with strict attraction $\kappa(0)>0$ and $\kappa'(1)\in(0,1)$:

   
   $$
   |\rho_\ell-1| \;\le\; \kappa'(1)^{\!\ell}\,|\rho_0-1|,
   \qquad \rho^\star=1.
   $$

3. Parabolic boundary case $\kappa(0)>0$ and $\kappa'(1)=1$:

   
   $$
   |\rho_\ell-1| \;\le\; \frac{|\rho_0-1|}{\,1+\alpha\,\ell\,|\rho_0-1|\,},
   \qquad \alpha \;=\; 1-\kappa(0)-\kappa'(0), \quad \rho^\star=1.
   $$

4. Interior non-centered attractor $\kappa(0)>0$ and $\kappa'(1)>1$:

   
   $$
   |\rho_\ell-\rho^\star|
   \;\le\;
   \frac{|\rho_0-\rho^\star|}{\,1-|\rho_0|\,}\,
   \alpha^{\,\ell},
   \quad
   \alpha \;=\; \max\Big\{1-\kappa(0),\, \kappa'(\rho^\star),\, \frac{1-\rho^\star}{\,2-q\,}\Big\}
   \;<\;1.
   $$

   where $q=\kappa'(\rho^\star)$.

All remaining fixed points (only possibly $\pm1$) are non-attracting. 


One of the central ingredients for formalizing these intuitions were the following two Lyapunov potential function, that worked as gauges to look at kernel sequence convergence

$$
\Phi(\rho) \;:=\; \frac{|\rho|}{1-|\rho|},
$$

Roughly speaking, the first potential function was used for interior fixed points, i.e., $\rho^\star\in[0,1)$, and the second type was used for boundary fixed points, i.e., $\rho^\star=1. $  This potential was used mostly for cases 1 and 4 of the master theorem. Other cases whose contraction was simpler and didn't require defining a special potential. You can see {% cite joudaki2025aistats %} for the full and entirely elementatry proofs.

One notable thing you will quickly realize from the proofs is that they are entirely elementary proofs. Not that this is a bad thing per se, but given the elegant and very simple form of this result and its seeming generality, it is befuddling to think that this result is a fundumentally new discovery, and has never been discovered by mathematicians. That was the point that was raised by my co-author, and stayed with me for quite a long time. A second reason for my unease was the discontinuity between some of the cases. Namely, if you compare the centered and interior cases (1 & 4), if we take the limit of $\kappa(0)\to 0^+$, which still falls under case 4, will be converging to a vacuous bound. However, having exactly $\kappa(0) = 0$ we fall under the still non-vacuous bound of case 1. 

The combination of these two reasons is why we suspect something deeper and more elegant under the surface of these proofs and results. As discussed in the sequel, these suspicions were deemed to be true. 

--- 

## An alternative complex-analytic proof

First, let us go through a quick primer on holomorphic self-maps of the disk and why they're useful. 

We can embed our real kernel map $\kappa:[-1,1]\to[-1,1]$ into the complex unit disk

$$
\mathbb D \;=\;\{z\in\mathbb C:\ |z|<1\}
$$

by the same power series (it converges on $\mathbb D$): $\kappa(z)=\sum_{k\ge0}c_k^2\,z^k$. This makes $\kappa$ a **holomorphic** (complex-differentiable) self-map of $\mathbb D$. Classical function theory on $\mathbb D$ gives sharp, geometry-aware **contraction** inequalities for such maps, which we can reuse to get global attraction rates for $\rho_{\ell+1}=\kappa(\rho_\ell)$.

Two geometric gadgets appear repeatedly:

* **Automorphisms of $\mathbb D$** (disk re-centerings). For any $a\in\mathbb D$,

  $$
  \varphi_a(z) \;=\; \frac{z-a}{1-\overline a\,z}
  $$

  moves $a$ to $0$ without leaving $\mathbb D$. Think of it as a "change of coordinates" that recenters analysis at a desired fixed point.

* **Poincaré (hyperbolic) distance.** The intrinsic distance on $\mathbb D$ is

  $$
  d_{\mathbb D}(z,w)
  \;=\;
  \log\frac{1+|\varphi_w(z)|}{1-|\varphi_w(z)|}.
  $$

  It measures how hard it is to move between $z$ and $w$ while staying in the disk; unlike Euclidean distance, it "blows up" near the boundary $\vert z\vert =1$. We will also use two equivalent gauges:

  $$
  E_a(z)\;:=\;e^{d_{\mathbb D}(z,a)}-1
  \;=\;\frac{2\,|\varphi_a(z)|}{1-|\varphi_a(z)|}
  \quad\text{and}\quad
  H_1(z)\;:=\;\frac{|1-z|^2}{\,1-|z|^2\,}.
  $$

  $E_a$ is just a monotone reparameterization of hyperbolic distance to $a$. $H_1$ is the "horodisk gauge" anchored at the boundary point $1$ (it is the correct scale when the attracting fixed point sits on the boundary).

---

#### The three classical tools we need (with intuition)

Below are the exact statements we will use, quoted in the standard disk notation. Each appears (or is recalled) in {% cite mercer2018 %}, along with context and references to classical sources.

1. **Schwarz–Pick Lemma (global 1-Lipschitz in the hyperbolic metric).**
   If $f:\mathbb D\to\mathbb D$ is analytic, then

$$
\Big|\frac{f(w)-f(z)}{\,1-\overline{f(w)}\,f(z)}\Big|
\;\le\;
\Big|\frac{w-z}{\,1-\overline w\,z}\Big|
\quad\text{for all }z,w\in\mathbb D,
$$

equivalently $d_{\mathbb D}(f(z),f(w))\le d_{\mathbb D}(z,w)$. Intuition: self-maps can only **shrink** hyperbolic distances; automorphisms are the only maps that preserve them.

2. **Julia–Carathéodory boundary lemma (sharp boundary contraction).**
   Assume $f:\mathbb D\to\mathbb D$ is analytic, $f(1)=1$ in the nontangential sense, and

$$
\beta
=\liminf_{z\to 1}\frac{1-|f(z)|}{\,1-|z|\,}\in(0,\infty).
$$

Then for all $z\in\mathbb D$,

$$
\frac{|1-f(z)|^2}{1-|f(z)|^2}
\;\le\;
\beta\;\frac{|1-z|^2}{\,1-|z|^2\,},
$$

and the (radial) boundary derivative exists with $\vert f'(1)\vert =\beta$. Intuition: relative to the horodisk gauge $H_1$, one step under $f$ incurs at most a multiplicative factor $\beta$.

3. **Dieudonné's Lemma (two-point derivative control).**
   If $f:\mathbb D\to\mathbb D$ is analytic with $f(z)=w$ and $f(z_1)=w_1$, then

$$
\big|\,f'(z)-c\,\big|\;\le\;r,
$$

for explicit $c$ and $r$ built from the Möbius invariants $\varphi_{z}(z_1)$, $\varphi_{w}(w_1)$ {% cite dieudonne1934 mercer2018 %}. Intuition: among all Schur functions matching two interpolation constraints, the derivative at a third point lives in a computable disk; extremals are finite Blaschke products.

> **Remark (Rogosinski's one-point extremal, 1936).**
> A classical corollary of Schwarz–Pick/Dieudonné is the **Rogosinski bound** {% cite rogosinski1936 %}: if $f:\mathbb D\to\mathbb D$ with $f(0)=0$ and $|f'(0)|=\alpha\in[0,1)$, then for $r\in[0,1)$,
>
> $$
> |f(r)| \;\le\; \frac{r(\alpha+r)}{1+\alpha r},
> $$
>
> with equality for the degree-2 Blaschke extremal $B_{\alpha}(z)=z\,\dfrac{\alpha+z}{1+\alpha z}$. Intuition: given the local slope $\alpha$ at the origin, this is the largest one-step radial gain still compatible with Schwarz–Pick.

---

#### Complex-Analytic Master Theorem (CAMT)



Let $\kappa:\mathbb D\to\mathbb D$ be holomorphic and **not** a disk automorphism. Consider the iteration $\rho_{\ell+1}=\kappa(\rho_\ell)$ with $\rho_0\in(-1,1)$. In this section, we will use the following variables to simplify the notations: 

$$
q = \kappa'(\rho^*),\qquad \alpha = \kappa'(0), \qquad \beta= \kappa'(1).
$$

We can now state the master theorem:

**(C1) Centered interior fixed point at $0$**: if $\kappa(0)=0$ and $\alpha:=\kappa'(0)\in[0,1)$, then for all $z\in\mathbb D$

$$
E_0\big(\kappa(z)\big)\;\le\;\frac{1+\alpha}{2}\;E_0(z)
\quad\Longrightarrow\quad
E_0\big(\kappa^{\circ \ell}(z)\big)\;\le\;\Big(\tfrac{1+\alpha}{2}\Big)^{\!\ell}E_0(z).
$$

**(C4) Interior fixed point at $\rho^\star\in\mathbb D$**: if $\kappa(\rho^\star)=\rho^\star$ and $q:=\kappa'(\rho^\star)\in[0,1)$, then for all $z\in\mathbb D$

$$
E_{\rho^\star}\big(\kappa(z)\big)\;\le\;\frac{1+q}{2}\;E_{\rho^\star}(z)
\quad\Longrightarrow\quad
E_{\rho^\star}\big(\kappa^{\circ \ell}(z)\big)\;\le\;\Big(\tfrac{1+q}{2}\Big)^{\!\ell}E_{\rho^\star}(z).
$$

**(C2) Strictly attractive boundary fixed point at $1$**: if $\kappa(1)=1$ (nontangentially) and $\beta:=\kappa'(1)\in(0,1)$, then for all $z\in\mathbb D$

$$
H_1\big(\kappa(z)\big)\;\le\;\beta\;H_1(z)
\quad\Longrightarrow\quad
H_1\big(\kappa^{\circ \ell}(z)\big)\;\le\;\beta^\ell H_1(z).
$$

(This is exactly Julia–Carathéodory in the $H_1$ gauge.)

**(C3) Parabolic boundary fixed point at $1$**: if $\kappa(1)=1$ and $\kappa'(1)=1$ but $\kappa$ is not an automorphism, then there exists $\gamma>0$ (determined by higher-order boundary data of $\kappa$) such that for all $z\in\mathbb D$

$$
H_1\big(\kappa(z)\big)\;\le\;\frac{H_1(z)}{\,1+\gamma\,H_1(z)\,}
\quad\Longrightarrow\quad
H_1\big(\kappa^{\circ \ell}(z)\big)\;\le\;\frac{H_1(z)}{\,1+\gamma\,\ell\,H_1(z)\,}.
$$

(Intuition: the hyperbolic "height" increases by a fixed additive amount per iterate in a half-plane model.)

> **What these say in plain ML terms.**
> Work in the "right" metric for the position of the attracting fixed point (interior: $E_a$; boundary: $H_1$). Then **one layer** shrinks that metric by an **absolute constant**: $(1+\kappa'(\text{fix}))/2<1$ in the interior, or $\kappa'(1)<1$ on the boundary. Iterating multiplies those factors, giving geometric decay (and $O(1/\ell)$ in the parabolic boundary case).

---

#### Proof idea (one paragraph)

Schwarz–Pick makes every holomorphic self-map **non-expansive** in the hyperbolic metric; we need a **strict** global contraction with an explicit factor. For interior fixed points we first **recenter** the disk so the fixed point is at $0$, then combine Schwarz–Pick with the **Rogosinski extremal** to convert knowledge of the local slope $\kappa'(0)$ into a sharp global one-step factor $(1+\kappa'(0))/2$. For strictly attractive **boundary** fixed points, the **Julia–Carathéodory** lemma already is the sharp one-step inequality in the natural horodisk gauge $H_1$. For the **parabolic** boundary case $\kappa'(1)=1$, Koenigs linearization conjugates the map to a unit translation on a right half-plane, yielding a one-step **logistic** improvement that telescopes to $O(1/\ell)$.

---

#### Formal proof 

We treat (C1)–(C4) in turn.

##### (C1) Centered interior fixed point at $0$

*Setup.* Assume $\kappa:\mathbb D\to\mathbb D$ is holomorphic, $\kappa(0)=0$, $\alpha:=\kappa'(0)\in[0,1)$, and $\kappa$ is not an automorphism.

*Step 1 (extremal one-step envelope).*
By the **Rogosinski bound** {% cite rogosinski1936 %}, for every $r\in[0,1)$,

$$
|\kappa(r)| \;\le\; \frac{r(\alpha+r)}{1+\alpha r}
\quad\text{with equality for }B_\alpha(z)=z\,\frac{\alpha+z}{1+\alpha z}.
$$

*Step 2 (convert to the hyperbolic gauge $E_0$).*
Since $E_0(z)=\dfrac{2|z|}{1-|z|}$, we get

$$
\frac{E_0(\kappa(r))}{E_0(r)}
=\frac{\dfrac{2|\kappa(r)|}{1-|\kappa(r)|}}{\dfrac{2r}{1-r}}
=\frac{\alpha+r}{1+r}
\;\le\;\frac{1+\alpha}{2}.
$$

This holds for all $r$ and thus for all $z\in\mathbb D$ by radial majorization. Hence

$$
E_0\big(\kappa(z)\big)\;\le\;\frac{1+\alpha}{2}\;E_0(z),
\quad
E_0\big(\kappa^{\circ \ell}(z)\big)\;\le\;\Big(\tfrac{1+\alpha}{2}\Big)^{\!\ell}E_0(z).
$$

This proves (C1).

##### (C4) Interior fixed point at $\rho^\star$

*Setup.* Assume $\kappa(\rho^\star)=\rho^\star$ for some $\rho^\star\in\mathbb D$, and set $q:=\kappa'(\rho^\star)\in[0,1)$.

*Step 1 (recenter at the fixed point).*
Let $\psi=\varphi_{\rho^\star}$. Define $g=\psi\circ\kappa\circ\psi^{-1}$. Then $g(0)=0$ and $g'(0)=q$.

*Step 2 (apply (C1) to $g$).*
By (C1),

$$
E_0\big(g(u)\big)\;\le\;\frac{1+q}{2}\;E_0(u)\quad\forall u\in\mathbb D.
$$

*Step 3 (translate back).*
Since $E_0(\psi(z))=E_{\rho^\star}(z)$, we obtain

$$
E_{\rho^\star}\big(\kappa(z)\big)
=E_0\big(\psi(\kappa(z))\big)
=E_0\big(g(\psi(z))\big)
\le \frac{1+q}{2}\,E_0(\psi(z))
=\frac{1+q}{2}\,E_{\rho^\star}(z).
$$

Iterating proves (C4).

##### (C2) Strictly attractive boundary fixed point at $1$

*Setup.* Assume $\kappa(1)=1$ n.t. and $\beta:=\kappa'(1)\in(0,1)$.

*One-step contraction (Julia–Carathéodory).*
By **Julia's Lemma** {% cite julia1918 caratheodory1907 %},

$$
\frac{|1-\kappa(z)|^2}{\,1-|\kappa(z)|^2\,}\;\le\;\beta\;\frac{|1-z|^2}{\,1-|z|^2\,}
\quad\text{for all }z\in\mathbb D,
$$

i.e.

$$
H_1\big(\kappa(z)\big)\;\le\;\beta\;H_1(z).
$$

*Iterate.*
Apply the inequality $\ell$ times to get $H_1(\kappa^{\circ \ell}(z))\le \beta^\ell H_1(z)$. This proves (C2).

##### (C3) Parabolic boundary fixed point ($\kappa'(1)=1$, non-automorphism)

*Setup.* Assume $\kappa(1)=1$, $\kappa'(1)=1$, and $\kappa$ is not an automorphism.

*Koenigs linearization (proof sketch) and one-step inequality.*
Standard boundary dynamics (Denjoy–Wolff theory) ensures $\kappa$ is conjugate to a **unit translation** on a right half-plane via a holomorphic change of variables (Koenigs function) {% cite cowenmaccluer1995 %}. In that model, the reciprocal horodisk height increases by a fixed increment per iterate, which translates back to the disk as the one-step **logistic** improvement

$$
H_1\big(\kappa(z)\big)\;\le\;\frac{H_1(z)}{\,1+\gamma\,H_1(z)\,}
$$

for some $\gamma>0$ determined by higher-order boundary data (e.g., second angular derivative) {% cite mercer2018 osserman2000 unkelbach1938 %}. Iterating telescopes to

$$
H_1\big(\kappa^{\circ \ell}(z)\big)\;\le\;\frac{H_1(z)}{\,1+\gamma\,\ell\,H_1(z)\,}.
$$

> **Note.** The $O(1/\ell)$ law is **optimal in general** for the parabolic case; no geometric (exponential) rate exists without extra structure.

---

#### How these complex-analytic proofs compare to the elementary (Hermite/Lyapunov) proofs

* **Which "distance" shrinks?**
  - *Elementary proof (your paper):* a Lyapunov potential like $\Phi(\rho)=\dfrac{\vert\rho\vert}{1-\vert \rho\vert}$ (or its centered-at-$\rho^\star$ counterpart) tailored to the kernel subclass (non-negative power-series coefficients).
  - *Complex-analytic proof (this section):* the **hyperbolic** distances $E_a=e^{d_{\mathbb D}(\cdot,a)}-1$ for interior fixed points and **horodisk** gauge $H_1$ for boundary fixed points. These are intrinsic, coordinate-free, and exactly preserved by automorphisms.

* **Contraction constants.**
  - *Centered interior (C1):* complex analysis yields $\tfrac{1+\kappa'(0)}{2}$, while your Lyapunov proof gave $\tfrac{1}{2-\kappa'(0)}$. For $\kappa'(0)\in(0,1)$ one has $\tfrac{1+\kappa'(0)}{2}>\tfrac{1}{2-\kappa'(0)}$; i.e., your kernel-specific bound is **tighter** here (thanks to the extra positivity structure of coefficients).
  - *Interior, non-centered (C4):* complex analysis gives the clean, automorphism-invariant $\tfrac{1+\kappa'(\rho^\star)}{2}$ in the right gauge $E_{\rho^\star}$. The elementary Euclidean-gauge bound had an extra term depending on $\kappa(0)$, and can become vacuous as $\kappa(0)\to0^{+}$. Using the hyperbolic gauge removes that discontinuity.
  - *Boundary, strictly attractive (C2):* Julia–Carathéodory gives the **sharp** factor $\kappa'(1)$ in $H_1$. This matches the best you can hope for.
  - *Boundary, parabolic (C3):* both approaches yield the optimal $O(1/\ell)$ law; the complex-analytic route pinpoints the natural $H_1$ gauge and ties $\gamma$ to boundary data (angular derivatives).

* **Takeaway for practice.**
  If you want constants that: (i) are **absolute** (depend only on $\kappa$, not on the starting point), (ii) are **coordinate-free**, and (iii) extend verbatim to any interior fixed point, use the hyperbolic/horodisk gauges. If you want the very best constant in the **centered kernel subclass**, your Hermite-based Lyapunov bound can be tighter, because it leverages positivity of the series coefficients—structure not available to general Schur maps.

---

### Visualization 

How to use the panel

- **Degree and weights.** Set $$K$$ and the sliders $$w_k$$. They are auto-normalized so $$\sum_k w_k=1$$ and hence $$\kappa(1)=1$$.  
  • **force centered** sets $$w_0=\kappa(0)=0$$.  
  • Readouts show $$w_0$$, $$\kappa'(0)=\kappa'(0)$$, and $$\kappa'(1)=\kappa'(1)$$.

- **Mode.**  
  **centered** uses the gauge $$E_0$$.  
  **interior** centers at the detected real attractor $$\rho^\star$$ and uses $$E_{\rho^\star}$$.  
  **boundary** uses the horodisk gauge $$H_1$$.

- **Point and iterates.** Pick $$z=re^{i\theta}$$ and the number of steps $$\ell$$.


#### What the three plots show

- **Map on $$[{-}1,1]$$.** The curve $$y=\kappa(x)$$ vs. the identity; intersections are fixed points.  
   Options: **tangents** at $$0$$ and $$1$$; **Rogosinski envelope** (centered) with
   
$$
|\kappa(r)|\le R(r)=\frac{r(\kappa'(0)+r)}{1+\kappa'(0)\,r}.
$$

- **Poincaré disk view.** Shows $$z\mapsto \kappa(z)$$ and the one-step ratio:

$$
\frac{E_{\rho^\star}(\kappa(z))}{E_{\rho^\star}(z)}\ \text{ or }\ \frac{H_1(\kappa(z))}{H_1(z)}.
$$

- **Iterates.** Log plot of the gauge along $$\kappa^{\circ \ell}(z_0)$$ with the theoretical envelope:
   - centered: 
   $$\big(\tfrac{1+\kappa'(0)}{2}\big)^{\ell}E_0(z_0)$$
   - interior: 
   $$\big(\tfrac{1+\kappa'(\rho^\star)}{2}\big)^{\ell}E_{\rho^\star}(z_0)$$, where $$\kappa'(\rho^\star)=|\kappa'(\rho^\star)|$$
   - boundary: $$\kappa'(1)^{\ell}H_1(z_0)$$.
   (Parabolic $$\kappa'(1)=1$$: true $$H_1\sim 1/(1+\gamma\ell)$$; the overlay is a visual proxy.)


#### Quick recipes (C1–C4)

- **C1 (centered):** check *force centered*; set $$0\le \kappa'(0)<1$$. Expect factor $$\tfrac{1+\kappa'(0)}{2}$$ in $$E_0$$.
- **C2 (boundary, strict):** $$w_0>0$$, tune $$\kappa'(1)\in(0,1)$$; boundary mode shows factor $$\kappa'(1)$$ in $$H_1$$.
- **C3 (parabolic):** make $$\kappa'(1)\approx1$$; see slow $$O(1/\ell)$$ decay in $$H_1$$.
- **C4 (interior, non-centered):** weights yield $$\rho^\star\in(0,1)$$; interior mode shows factor 
$$\tfrac{1+\kappa'(\rho^\star)}{2}$$ in $$E_{\rho^\star}$$, where $$\kappa'(\rho^\star)=|\kappa'(\rho^\star)|$$.

*Notes:* the demo uses polynomials with non-negative coefficients (kernel subclass); points near $$| z | =1$$ are kept slightly inside for numerical stability.

<!-- =========================
Interactive Visualization: Complex-Analytic Proofs for Kernel Dynamics
Paste this block inside your post. It only depends on Plotly.
========================= -->

<script src="https://cdnjs.cloudflare.com/ajax/libs/plotly.js/2.26.0/plotly.min.js" defer></script>

<style>
  .viz-grid { display: grid; grid-template-columns: 320px 1fr; gap: 16px; align-items: start; }
  .viz-card { border: 1px solid #e5e7eb; border-radius: 10px; padding: 12px; }
  .viz-title { font-weight: 600; margin-bottom: 8px; }
  .ctrl { margin: 8px 0; }
  .ctrl label { display: block; font-size: 0.9rem; margin-bottom: 4px; }
  .ctrl input[type="range"] { width: 100%; }
  .pill { display: inline-block; background:#f3f4f6; padding:2px 8px; border-radius:999px; font-size: 12px; margin-right: 6px;}
  .row { display:flex; gap:8px; flex-wrap:wrap; align-items:center; }
  .muted { color:#6b7280; font-size: 12px; }
</style>

<div class="viz-grid" id="kernel-viz-root">
  <div class="viz-card">
    <div class="viz-title">Kernel map κ(z) = Σ w_k z^k</div>
    <div class="muted">Weights w_k are auto-normalized to sum to 1. This enforces forward stability κ(1)=1.</div>

    <div class="ctrl">
      <label>Max degree K <span class="pill" id="degLabel">3</span></label>
      <input id="deg" type="range" min="1" max="6" step="1" value="3" />
    </div>

    <div id="weights"></div>

    <div class="row ctrl">
      <label style="margin-right:8px;">
        <input type="checkbox" id="forceCentered" />
        force centered w₀ = 0
      </label>
      <label style="margin-right:8px;">
        <input type="checkbox" id="showRogosinski" checked />
        show Rogosinski envelope (centered only)
      </label>
      <label>
        <input type="checkbox" id="showSlope" checked />
        show tangents at 0 and 1
      </label>
    </div>

    <div class="viz-title" style="margin-top:10px;">Point and iteration</div>
    <div class="ctrl">
      <label>Point z in disk: radius r <span class="pill" id="rLabel">0.60</span></label>
      <input id="r" type="range" min="0.0" max="0.99" step="0.01" value="0.60" />
    </div>
    <div class="ctrl">
      <label>Angle θ (radians) <span class="pill" id="thetaLabel">0.00</span></label>
      <input id="theta" type="range" min="0" max="6.28318" step="0.01" value="0.00" />
    </div>
    <div class="ctrl">
      <label>Iterations ℓ <span class="pill" id="LLabel">12</span></label>
      <input id="L" type="range" min="1" max="50" step="1" value="12" />
    </div>

    <div class="viz-title" style="margin-top:10px;">Gauges and fixed-point mode</div>
    <div class="row ctrl">
      <label style="margin-right:8px;">
        <input type="radio" name="mode" value="centered" checked />
        centered interior (ρ⋆=0)
      </label>
      <label style="margin-right:8px;">
        <input type="radio" name="mode" value="interior" />
        interior fixed point ρ⋆
      </label>
      <label>
        <input type="radio" name="mode" value="boundary" />
        boundary Denjoy–Wolff at 1
      </label>
    </div>

    <div class="ctrl" id="rhoStarCtrl" style="display:none;">
      <label>Interior fixed point ρ⋆ (real) <span class="pill" id="rhoStarLabel">—</span></label>
      <input id="rhoStarVal" type="range" min="-0.95" max="0.95" step="0.01" value="0.30" disabled />
      <div class="muted">Automatically set to the attracting real fixed point ρ⋆ when it exists.</div>
    </div>

    <div class="muted" id="readouts" style="margin-top:8px;"></div>
  </div>

  <div>
    <div class="viz-card" style="margin-bottom:12px;">
      <div class="viz-title">Kernel map on [−1,1]</div>
      <div id="mapPlot" style="height: 320px;"></div>
    </div>
    <div class="viz-card" style="margin-bottom:12px;">
      <div class="viz-title">Poincaré disk view: z ↦ κ(z)</div>
      <div id="diskPlot" style="height: 360px;"></div>
    </div>
    <div class="viz-card">
      <div class="viz-title">One-step contraction and iterates</div>
      <div id="iterPlot" style="height: 360px;"></div>
    </div>
  </div>
</div>

<script>
(function() {
  function onReady(cb){ if (window.Plotly) cb(); else setTimeout(()=>onReady(cb), 50); }
  onReady(() => {
    const degEl = document.getElementById('deg');
    const degLabel = document.getElementById('degLabel');
    const weightsDiv = document.getElementById('weights');
    const forceCenteredEl = document.getElementById('forceCentered');
    const showRogEl = document.getElementById('showRogosinski');
    const showSlopeEl = document.getElementById('showSlope');

    const rEl = document.getElementById('r');
    const rLabel = document.getElementById('rLabel');
    const thetaEl = document.getElementById('theta');
    const thetaLabel = document.getElementById('thetaLabel');
    const LEl = document.getElementById('L');
    const LLabel = document.getElementById('LLabel');

    const modeEls = Array.from(document.querySelectorAll('input[name="mode"]'));
    const rhoStarCtrl = document.getElementById('rhoStarCtrl');
    const rhoStarEl = document.getElementById('rhoStarVal');
    const rhoStarLabel = document.getElementById('rhoStarLabel');

    const readouts = document.getElementById('readouts');

    const mapPlot = document.getElementById('mapPlot');
    const diskPlot = document.getElementById('diskPlot');
    const iterPlot = document.getElementById('iterPlot');

    function buildWeightControls(K) {
      weightsDiv.innerHTML = '';
      for (let k = 0; k <= K; k++) {
        const id = `w_${k}`;
        const wrap = document.createElement('div');
        wrap.className = 'ctrl';
        wrap.innerHTML = `
          <label>w_${k} <span class="pill" id="${id}_label">0.25</span></label>
          <input id="${id}" type="range" min="0" max="1" step="0.001" value="${defaultVal(k, K)}" />
        `;
        weightsDiv.appendChild(wrap);
        document.getElementById(id).addEventListener('input', refresh);
      }
    }
    function defaultVal(k, K) {
      if (k === 0) return 0.10;
      if (k === 1) return 0.45;
      if (k === 2) return 0.35;
      return 0.10 / Math.max(1, K-2);
    }

    // Complex helpers
    function cAdd(a,b){ return [a[0]+b[0], a[1]+b[1]]; }
    function cSub(a,b){ return [a[0]-b[0], a[1]-b[1]]; }
    function cMul(a,b){ return [a[0]*b[0]-a[1]*b[1], a[0]*b[1]+a[1]*b[0]]; }
    function cDiv(a,b){ const den = b[0]*b[0]+b[1]*b[1]; return [(a[0]*b[0]+a[1]*b[1])/den, (a[1]*b[0]-a[0]*b[1])/den]; }
    function cAbs(a){ return Math.hypot(a[0], a[1]); }
    function cConj(a){ return [a[0], -a[1]]; }

    // Möbius and hyperbolic gauges
    function phi_a(z, a){ // ϕ_a(z)=(z-a)/(1-ā z)
      const num = cSub(z, a);
      const den = cSub([1,0], cMul(cConj(a), z));
      return cDiv(num, den);
    }
    // FIX: use FULL hyperbolic distance (not half)
    function dD(z,w){
      const t = Math.min(0.999999, Math.max(0, cAbs(phi_a(z,w))));
      return Math.log((1+t)/(1-t)); // = 2 * artanh(t)
    }
    function E_a(z,a){ return Math.exp(dD(z,a)) - 1; } // consistent with E = 2ρ/(1-ρ)
    function H1_direct(z){ // |1-z|^2 / (1-|z|^2)
      const num = (1 - z[0])*(1 - z[0]) + z[1]*z[1];
      const den = 1 - (z[0]*z[0] + z[1]*z[1]);
      return den > 0 ? (num/den) : Infinity;
    }

    // κ and derivatives
    function getWeights(K){
      const ws = [];
      let sum = 0;
      for (let k=0;k<=K;k++){
        const v = parseFloat(document.getElementById(`w_${k}`).value);
        const vv = Math.max(0, v);
        ws.push(vv); sum += vv;
      }
      if (sum === 0){ ws[0]=1; sum=1; }
      for (let k=0;k<=K;k++) ws[k] /= sum;
      if (forceCenteredEl.checked){
        ws[0] = 0;
        let s=0; for (let k=1;k<=K;k++) s += ws[k];
        if (s === 0) { ws[1] = 1; s = 1; }
        for (let k=1;k<=K;k++) ws[k] /= s;
      }
      for (let k=0;k<=K;k++){
        const lab = document.getElementById(`w_${k}_label`);
        if (lab) lab.textContent = ws[k].toFixed(3);
      }
      return ws;
    }
    function kappaReal(x, ws){
      let s = 0, xpow = 1;
      for (let k=0;k<ws.length;k++){ s += ws[k] * xpow; xpow *= x; }
      return s;
    }
    function kappaComplex(z, ws){
      let acc = [0,0], zpow = [1,0];
      for (let k=0;k<ws.length;k++){
        acc = cAdd(acc, [ws[k]*zpow[0], ws[k]*zpow[1]]);
        zpow = cMul(zpow, z);
      }
      return acc;
    }
    function kappaPrimeAt0(ws){ return (ws.length>1) ? ws[1] : 0; } // κ'(0)=w1
    function kappaPrimeAt1(ws){ let s=0; for (let k=1;k<ws.length;k++) s += k*ws[k]; return s; }
    function kappaPrimeAt(ws, a){ // exact κ'(a) for real a
      let s = 0, apow = 1;
      for (let k=1;k<ws.length;k++){ s += k*ws[k]*apow; apow *= a; }
      return s;
    }

    // Rogosinski envelope for centered: |κ(r)| ≤ R(r) with R(r)= r(α₀+r)/(1+α₀ r), α₀=κ'(0)=w1
    function rogosinski(r, alpha0){ return (r*(alpha0+r)) / (1 + alpha0*r); }

    function computeFixedPoints(ws){
      const xs = [];
      const f = (x)=>kappaReal(x,ws)-x;
      const N=800;
      let prevX=-1, prevF=f(-1);
      for(let i=1;i<=N;i++){
        const x = -1 + 2*i/N;
        const y = f(x);
        if (y===0 || (prevF<0 && y>0) || (prevF>0 && y<0)){
          let a=prevX, b=x, fa=prevF, fb=y;
          for (let it=0; it<50; it++){
            const m=0.5*(a+b), fm=f(m);
            if (fa*fm<=0){ b=m; fb=fm; } else { a=m; fa=fm; }
          }
          const root = 0.5*(a+b);
          if (root > -0.999 && root < 0.999) xs.push(root);
        }
        prevX=x; prevF=y;
      }
      return xs.sort((u,v)=>u-v);
    }

    function syncLabels(){
      degLabel.textContent = degEl.value;
      rLabel.textContent = parseFloat(rEl.value).toFixed(2);
      thetaLabel.textContent = parseFloat(thetaEl.value).toFixed(2);
      LLabel.textContent = LEl.value;
      rhoStarLabel.textContent = rhoStarEl.disabled ? '—' : parseFloat(rhoStarEl.value).toFixed(2);
    }
    function currentMode(){
      const m = modeEls.find(x=>x.checked)?.value || 'centered';
      rhoStarCtrl.style.display = (m==='interior') ? '' : 'none';
      return m;
    }

function update() {
  syncLabels();

  const K = parseInt(degEl.value,10);
  let ws = getWeights(K);

  // --- Enforce the precondition for the chosen bound ---
  const mode = currentMode();
  if (mode === 'centered' && (ws[0] || 0) > 1e-12) {
    // Auto-toggle the UI switch to keep visuals consistent with theory
    forceCenteredEl.checked = true;
    ws = getWeights(K); // re-normalize with w0=0
  }

  const w0 = ws[0] || 0;
  const alpha0 = kappaPrimeAt0(ws);     // κ'(0) = w1
  const beta = kappaPrimeAt1(ws);       // κ'(1) = Σ k w_k
  const fixeds = computeFixedPoints(ws);

  let rhoStar = null;
  if (fixeds.length){
    const nonneg = fixeds.filter(x=>x>=0);
    rhoStar = (nonneg.length? nonneg[0] : fixeds.reduce((p,c)=>Math.abs(c)<Math.abs(p)?c:p, fixeds[0]));
  }

  let rhoStar_show = '—', q = null;
  if (mode==='interior' && rhoStar!==null){
    rhoStarEl.disabled = true;
    rhoStarEl.value = rhoStar.toFixed(2);
    rhoStar_show = rhoStar.toFixed(2);
    q = kappaPrimeAt(ws, rhoStar);
  } else {
    rhoStarEl.disabled = true;
  }

  // Readouts (+ a small warning if user turns off centering but keeps "centered" mode)
  const warn = (mode==='centered' && w0>1e-12)
    ? `<span class="pill" style="background:#fee2e2;color:#b91c1c;">warning: centered bound needs w₀=0</span>`
    : '';
  readouts.innerHTML = `
    <span class="pill">w₀=κ(0)=${(w0||0).toFixed(3)}</span>
    <span class="pill">α₀=κ'(0)=${alpha0.toFixed(3)}</span>
    <span class="pill">β=κ'(1)=${beta.toFixed(3)}</span>
    <span class="pill">fixed points: ${fixeds.map(x=>x.toFixed(3)).join(', ') || 'none'}</span>
    ${mode==='interior' && rhoStar!==null ? `<span class="pill">ρ⋆=${rhoStar_show}, q=κ'(ρ⋆)=${q.toFixed(3)}</span>` : ''}
    ${warn}
  `;

  drawMap(ws, alpha0, beta);
  drawDisk(ws, rhoStar);
  drawIter(ws, alpha0, beta, rhoStar, q);
}


function drawMap(ws, alpha0, beta){
  const N=600;
  const X = new Array(N);
  const Y = new Array(N);
  for (let i=0;i<N;i++){
    const x = -1 + 2*i/(N-1);
    X[i]=x; Y[i]=kappaReal(x,ws);
  }

  const traces = [
    { x:X, y:Y, name:'κ(x)', mode:'lines', line:{width:3, color:'#3b82f6'} },
    { x:[-1,1], y:[-1,1], name:'identity', mode:'lines', line:{dash:'dash', color:'#9ca3af', width:2} },
  ];

  const fixeds = computeFixedPoints(ws);
  if (fixeds.length){
    traces.push({ x: fixeds, y: fixeds, mode:'markers', name:'fixed points',
                  marker:{size:10, color:'#10b981'} });
  }

  // Only show tangents if explicitly enabled and make them more subtle
  if (showSlopeEl.checked){
    traces.push({ x:[-0.3,0.3], y:[-alpha0*0.3, alpha0*0.3], mode:'lines', name:"slope at 0",
                  line:{color:'#e5e7eb', width:1} });
    traces.push({ x:[0.7,1], y:[1 + beta*(0.7-1), 1], mode:'lines', name:"slope at 1",
                  line:{color:'#fef3c7', width:1} });
  }

  // Remove Rogosinski envelope entirely - it's too technical for most users

  Plotly.react(mapPlot, traces, {
    margin:{t:20,r:10,l:40,b:40},
    xaxis:{title:'x', range:[-1,1]},
    yaxis:{title:'κ(x)', range:[-1,1]},
    legend:{orientation:'h', y:1.15},
    showlegend: false  // Hide legend to reduce clutter
  }, {displayModeBar:false, responsive:true});
}

    function drawDisk(ws, rhoStar){
      const r = parseFloat(rEl.value), th = parseFloat(thetaEl.value);
      let z = [r*Math.cos(th), r*Math.sin(th)];
      let kz = kappaComplex(z, ws);

      const keepInside = (w) => {
        const a = cAbs(w);
        return (a < 0.999) ? w : [w[0]/(a*1.001), w[1]/(a*1.001)];
      };
      z = keepInside(z); kz = keepInside(kz);

      const circleN=256, cx=[], cy=[];
      for (let i=0;i<=circleN;i++){ const t=2*Math.PI*i/circleN; cx.push(Math.cos(t)); cy.push(Math.sin(t)); }

      const mode = currentMode();
      let a = [0,0];
      if (mode==='interior' && rhoStar!==null) a=[rhoStar,0];

      let ratioText = '';
      if (mode==='boundary'){
        const H_before = H1_direct(z);
        const H_after  = H1_direct(kz);
        ratioText = (H_before>0 && isFinite(H_before) ? (H_after/H_before).toFixed(3) : '—');
      } else {
        const E_before = E_a(z,a);
        const E_after  = E_a(kz,a);
        const denom = Math.max(E_before, 1e-12);
        ratioText = (E_after/denom).toFixed(3);
      }

      const traces = [
        { x:cx, y:cy, mode:'lines', line:{color:'#111827'}, hoverinfo:'skip', showlegend:false },
        { x:[0, z[0]], y:[0, z[1]], mode:'lines', line:{color:'#9ca3af'}, showlegend:false },
        { x:[0, kz[0]], y:[0, kz[1]], mode:'lines', line:{color:'#9ca3af', dash:'dot'}, showlegend:false },
        { x:[z[0]], y:[z[1]], mode:'markers', name:'z', marker:{size:9, color:'#3b82f6'} },
        { x:[kz[0]], y:[kz[1]], mode:'markers', name:'κ(z)', marker:{size:9, color:'#ef4444'} },
      ];
      if (mode!=='boundary'){
        traces.push({ x:[a[0]], y:[a[1]], mode:'markers', name:'ρ⋆ (gauge center)', marker:{size:7, color:'#10b981'} });
      }

      const annots = [];
      if (mode==='centered'){
        annots.push({x: -1.1, y:1.1, text:`E₀ one-step ratio: ${ratioText}`, showarrow:false, font:{size:12}});
      } else if (mode==='interior'){
        annots.push({x: -1.1, y:1.1, text:`E_ρ⋆ one-step ratio: ${ratioText}`, showarrow:false, font:{size:12}});
      } else {
        annots.push({x: -1.1, y:1.1, text:`H₁ one-step ratio: ${ratioText}`, showarrow:false, font:{size:12}});
      }

      Plotly.react(diskPlot, traces, {
        margin:{t:20,r:10,l:20,b:20},
        xaxis:{range:[-1.2,1.2], scaleanchor:'y', scaleratio:1, showgrid:false, zeroline:false, ticks:''},
        yaxis:{range:[-1.2,1.2], showgrid:false, zeroline:false, ticks:''},
        annotations: annots
      }, {displayModeBar:false, responsive:true});
    }

    function drawIter(ws, alpha0, beta, rhoStar, q){
      const mode = currentMode();
      const L = parseInt(LEl.value,10);
      const r = parseFloat(rEl.value), th = parseFloat(thetaEl.value);
      let z = [r*Math.cos(th), r*Math.sin(th)];

      const zseq = [];
      for (let i=0;i<=L;i++){
        zseq.push(z);
        z = kappaComplex(z, ws);
        const a = cAbs(z);
        if (a >= 0.999){ z = [z[0]/(a*1.001), z[1]/(a*1.001)]; }
      }

      let gaugeName='', G=[], theory=[];
      if (mode==='boundary'){
        gaugeName='H₁';
        for (let i=0;i<zseq.length;i++) G.push(H1_direct(zseq[i]));
        const b = beta; // κ'(1)
        const base = Math.max(G[0], 1e-12);
        for (let i=0;i<zseq.length;i++) theory.push( Math.pow(b, i) * base ); // no down-clamp
      } else {
        const a = (mode==='interior' && rhoStar!==null) ? [rhoStar,0] : [0,0];
        gaugeName = (mode==='interior' && rhoStar!==null) ? 'E_ρ⋆' : 'E₀';
        for (let i=0;i<zseq.length;i++) G.push( Math.exp(dD(zseq[i], a)) - 1 );
        const factor = (mode==='interior' && rhoStar!==null)
          ? (1 + Math.abs(q||0)) / 2
          : (1 + Math.abs(alpha0)) / 2;
        const base = Math.max(G[0], 1e-12);
        for (let i=0;i<zseq.length;i++) theory.push( Math.pow(factor, i) * base ); // no down-clamp
      }

      const iters = Array.from({length:zseq.length}, (_,i)=>i);
      const traces = [
        { x: iters, y: G, name:`${gaugeName}(κ^ℓ(z₀))`, mode:'lines+markers', line:{width:3} },
        { x: iters, y: theory, name:'theoretical envelope', mode:'lines', line:{dash:'dot'} }
      ];

      Plotly.react(iterPlot, traces, {
        margin:{t:20,r:10,l:50,b:40},
        xaxis:{title:'ℓ', rangemode:'nonnegative'},
        yaxis:{title:`${gaugeName} value`, type:'log', rangemode:'tozero'},
        legend:{orientation:'h', y:1.15}
      }, {displayModeBar:false, responsive:true});
    }

    [degEl, forceCenteredEl, showRogEl, showSlopeEl, rEl, thetaEl, LEl].forEach(el => el.addEventListener('input', refresh));
    modeEls.forEach(el => el.addEventListener('change', refresh));

    function refresh() {
      syncLabels();
      const currentChildren = weightsDiv.querySelectorAll('input[id^="w_"]').length;
      const want = parseInt(degEl.value,10)+1;
      if (currentChildren !== want) buildWeightControls(parseInt(degEl.value,10));
      update();
    }

    function syncLabels(){
      degLabel.textContent = degEl.value;
      rLabel.textContent = parseFloat(rEl.value).toFixed(2);
      thetaLabel.textContent = parseFloat(thetaEl.value).toFixed(2);
      LLabel.textContent = LEl.value;
      rhoStarLabel.textContent = rhoStarEl.disabled ? '—' : parseFloat(rhoStarEl.value).toFixed(2);
    }

    function currentMode(){
      const m = modeEls.find(x=>x.checked)?.value || 'centered';
      rhoStarCtrl.style.display = (m==='interior') ? '' : 'none';
      return m;
    }

    // Init
    buildWeightControls(parseInt(degEl.value,10));
    update();
  });
})();
</script>


---

### References

{% bibliography --cited %}