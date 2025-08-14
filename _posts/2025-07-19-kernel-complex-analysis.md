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

#### Proof idea 

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
  - *Elementary proof (my paper):* a Lyapunov potential like $\Phi(\rho)=\dfrac{\vert\rho\vert}{1-\vert \rho\vert}$ (or its centered-at-$\rho^\star$ counterpart) tailored to the kernel subclass (non-negative power-series coefficients).
  - *Complex-analytic proof (this section):* the **hyperbolic** distances $E_a=e^{d_{\mathbb D}(\cdot,a)}-1$ for interior fixed points and **horodisk** gauge $H_1$ for boundary fixed points. These are intrinsic, coordinate-free, and exactly preserved by automorphisms.

* **Contraction constants.**
  - *Centered interior (C1):* complex analysis yields $\tfrac{1+\kappa'(0)}{2}$, while my Lyapunov proof gave $\tfrac{1}{2-\kappa'(0)}$. For $\kappa'(0)\in(0,1)$ one has $\tfrac{1+\kappa'(0)}{2}>\tfrac{1}{2-\kappa'(0)}$; i.e., my kernel-specific bound is **tighter** here (thanks to the extra positivity structure of coefficients).
  - *Interior, non-centered (C4):* complex analysis gives the clean, automorphism-invariant $\tfrac{1+\kappa'(\rho^\star)}{2}$ in the right gauge $E_{\rho^\star}$. The elementary Euclidean-gauge bound had an extra term depending on $\kappa(0)$, and can become vacuous as $\kappa(0)\to0^{+}$. Using the hyperbolic gauge removes that discontinuity.
  - *Boundary, strictly attractive (C2):* Julia–Carathéodory gives the **sharp** factor $\kappa'(1)$ in $H_1$. This matches the best you can hope for.
  - *Boundary, parabolic (C3):* both approaches yield the optimal $O(1/\ell)$ law; the complex-analytic route pinpoints the natural $H_1$ gauge and ties $\gamma$ to boundary data (angular derivatives).

* **Takeaway for practice.**
  If you want constants that: (i) are **absolute** (depend only on $\kappa$, not on the starting point), (ii) are **coordinate-free**, and (iii) extend verbatim to any interior fixed point, use the hyperbolic/horodisk gauges. If you want the very best constant in the **centered kernel subclass**, my Hermite-based Lyapunov bound can be tighter, because it leverages positivity of the series coefficients—structure not available to general Schur maps.

---

### References

{% bibliography --cited %}