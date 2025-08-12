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
  - name: "Alternative complex-analytic proofs"
  - name: "Neural implications and concrete comparison"

include_scripts: []
---

### Prelude: bridging fields with AI

In my AISTATS paper {% cite joudaki2025aistats %}, I proved by elementary Hermite analysis and Lyapunov inequalities that the mean-field kernel sequence of a deep MLP converges globally to a fixed point determined by the activation and architecture. The proof was self-contained, but it required careful casework. Now, roughly a year later after that, with the help of GPT-5's thinking and deep research mode, I found that my elementary proofs are connected to some deep concepts in classical complex analysis that date back almot a centry back. 
 

### Setup and the original master theorem

We work in the mean-field regime for a fully-connected, width-$d$ MLP at random initialization with activation $\phi$ that has a finite Gaussian second moment. Let

$$
\rho_{\ell+1} \;=\; \kappa(\rho_\ell),
\qquad
\kappa(\rho) \;=\; \mathbb E[\phi(X)\phi(Y)],
\qquad
\begin{pmatrix}X\\Y\end{pmatrix}
\sim \mathcal N\!\left(0,\begin{pmatrix}1&\rho\\ \rho&1\end{pmatrix}\right),
$$

as in {% cite yang2019meanfield poole2016 %}. Expanding $\phi$ in the normalized Hermite basis $\phi=\sum_{k\ge0} c_k\,\mathrm{He}_k$ yields the analytic self-map

$$
\kappa(z) \;=\; \sum_{k=0}^\infty c_k^2\, z^k \quad \text{on } \mathbb D.
$$

The two gauges we will use throughout are

$$
\Phi(\rho) \;:=\; \frac{|\rho|}{1-|\rho|},
\qquad
H_1(z) \;:=\; \frac{|1-z|^2}{1-|z|^2}.
$$

The first is the Lyapunov potential used in {% cite joudaki2025aistats %} (up to a factor of two compared to $e^{d_{\mathbb D}}-1$); the second is the canonical horodisk gauge centered at the boundary point $1$.

#### Original master theorem 

Assume forward stability $\kappa(1)=1$ and nonlinearity $\sum_{k\ge2} c_k^2>0$. Let $\rho_{\ell+1}=\kappa(\rho_\ell)$ with $\rho_0\in(-1,1)$. Then the iterates converge globally to a unique attracting fixed point $\rho^\star\in[0,1]$ with the following casewise rates:

1. Centered activations $\kappa(0)=0$:

   
   $$
   \Phi(\rho_\ell) \;\le\; \left(\frac{1}{\,2-\kappa'(0)\,}\right)^{\!\ell}\, \Phi(\rho_0),
   \qquad \rho^\star=0.
   $$

2. Boundary Denjoy–Wolff with strict attraction $\kappa(0)>0$ and $\kappa'(1)\in(0,1)$:

   
   $$
   |\rho_\ell-1| \;\le\; \big(\kappa'(1)\big)^{\!\ell}\,|\rho_0-1|,
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
   \alpha \;=\; \max\Big\{1-\kappa(0),\, \kappa'(\rho^\star),\, \frac{1-\rho^\star}{\,2-\kappa'(\rho^\star)\,}\Big\}
   \;<\;1.
   $$

All remaining fixed points (only possibly $\pm1$) are non-attracting. See {% cite joudaki2025aistats %} for the elementary proofs.

---

### Alternative complex-analytic proofs

We now re-derive global attraction using classical holomorphic dynamics on the unit disk. Let $d_{\mathbb D}$ be the Poincaré distance and $\varphi_a(z)=(z-a)/(1-\overline a z)$ the standard automorphism. Define

$$
E_a(z) \;:=\; e^{d_{\mathbb D}(z,a)}-1 \;=\; \frac{2\,|\varphi_a(z)|}{1-|\varphi_a(z)|}.
$$

We will use Schwarz–Pick, Julia–Carathéodory, and Rogosinski’s extremal bound {% cite cowenmaccluer1995 julia1918 caratheodory1907 rogosinski1936 dieudonne1934 mercer2018 osserman2000 unkelbach1938 %}.

#### Interior fixed point at the origin (centered case)

Assume

$$
\kappa(0)=0,
\qquad
a:=\kappa'(0)\in[0,1),
\qquad
\text{$\kappa$ not an automorphism.}
$$

Theorem 1 (global hyperbolic contraction with sharp constant):

$$
E_0\big(\kappa(z)\big)
\;\le\;
\frac{1+a}{2}\,E_0(z)
\quad \text{for all } z\in\mathbb D.
$$

Proof. By Rogosinski, for $r\in(0,1)$,

$$
|\kappa(r)|
\;\le\;
\frac{r(a+r)}{1+a r},
$$

with equality for Blaschke extremals {% cite rogosinski1936 cowenmaccluer1995 %}. Then

$$
\frac{E_0(\kappa(r))}{E_0(r)}
=
\frac{\dfrac{2|\kappa(r)|}{1-|\kappa(r)|}}{\dfrac{2r}{1-r}}
=
\frac{a+r}{1+r}
\;\le\;
\frac{1+a}{2},
$$

and $r\uparrow1$ shows sharpness. ∎

Iterating,

$$
E_0\big(\kappa^{\circ \ell}(z)\big)
\;\le\;
\left(\frac{1+a}{2}\right)^{\!\ell} E_0(z).
$$

#### Interior fixed point at an arbitrary point

Assume

$$
\kappa(a)=a,
\qquad
q:=|\kappa'(a)|\in[0,1),
\qquad
\text{$\kappa$ not an automorphism.}
$$

Theorem 2 (global contraction about the fixed point):

$$
E_a\big(\kappa(z)\big)
\;\le\;
\frac{1+q}{2}\,E_a(z)
\quad \text{for all } z\in\mathbb D.
$$

Proof. Conjugate by $\psi=\varphi_a$. Then $g=\psi\circ\kappa\circ\psi^{-1}$ satisfies $g(0)=0$, $g'(0)=\kappa'(a)$; apply Theorem 1 to $g$ and use $E_0(\psi(z))=E_a(z)$. ∎

Iterating,

$$
E_a\big(\kappa^{\circ \ell}(z)\big)
\;\le\;
\left(\frac{1+q}{2}\right)^{\!\ell} E_a(z).
$$

#### Strictly attractive boundary Denjoy–Wolff point

Assume

$$
\kappa(1)=1 \text{ n.t.}, \qquad \beta:=\kappa'(1)\in(0,1).
$$

Theorem 3 (sharp horodisk contraction at the boundary):

$$
H_1\big(\kappa(z)\big)
\;\le\;
\beta\, H_1(z)
\quad \text{for all } z\in\mathbb D.
$$

Proof. Julia–Carathéodory gives

$$
\frac{1-|\kappa(z)|^2}{|1-\kappa(z)|^2}
\;\ge\;
\frac{1}{\beta}\,\frac{1-|z|^2}{|1-z|^2},
$$

equivalent to the stated $H_1$ contraction. This is sharp in the Schur class {% cite cowenmaccluer1995 mercer2018 %}. ∎

Iterating,

$$
H_1\big(\kappa^{\circ \ell}(z)\big)
\;\le\;
\beta^{\ell}\, H_1(z).
$$

#### Parabolic boundary case

Assume

$$
\kappa(1)=1 \text{ n.t.}, \qquad \kappa'(1)=1, \qquad \text{$\kappa$ not an automorphism.}
$$

Theorem 4 (global polynomial decay). There exists $\gamma>0$, determined by second-order boundary data of $\kappa$, such that

$$
H_1\big(\kappa(z)\big)
\;\le\;
\frac{H_1(z)}{\,1+\gamma\,H_1(z)\,}
\quad \text{for all } z\in\mathbb D.
$$

Consequently,

$$
H_1\big(\kappa^{\circ \ell}(z)\big)
\;\le\;
\frac{H_1(z)}{\,1+\gamma\,\ell\,H_1(z)\,}.
$$

Sketch. Koenigs linearization conjugates $\kappa$ to a unit translation on a right half-plane {% cite cowenmaccluer1995 %}. In that model, the reciprocal Busemann function increases by a fixed increment each iterate,

$$
\frac{1}{H_1\big(\kappa(z)\big)}
\;\ge\;
\frac{1}{H_1(z)}+\gamma,
$$

which yields the one-step inequality and telescopes. Quantitative refinements for $\gamma$ follow from higher-order boundary data {% cite mercer2018 osserman2000 unkelbach1938 %}. ∎

---

### Neural net implications and concrete comparison

This section ties the constants to neural design and then compares, case by case, my elementary bounds with the complex-analytic ones.

#### Neural net interpretation of the constants

Centered regime. Here $a=\kappa'(0)=c_1(\phi)^2$. The hyperbolic constant is

$$
\frac{1+a}{2}
\quad\text{in}\quad
E_0(\cdot)=\frac{2|\cdot|}{1-|\cdot|}.
$$

Smaller $c_1(\phi)$ (e.g., more symmetry) means faster decay of cross-correlation toward orthogonality.

Interior non-centered regime. Let $a$ be the interior fixed point and $q=|\kappa'(a)|$. Contraction is

$$
\frac{1+q}{2}
\quad\text{in}\quad
E_a(\cdot).
$$

Residual connections convex-combine $\kappa$ with the identity, pushing derivatives toward $1$ and slowing contraction.

Boundary regimes. With $\beta=\kappa'(1)\in(0,1)$, decay is exactly geometric at rate $\beta$ in the natural horodisk gauge $H_1$. In the parabolic case $\kappa'(1)=1$, the optimal general rate is $O(1/\ell)$ with a computable $\gamma>0$ from boundary data.

#### Sharpness and apples-to-apples comparison

Centered case ($\kappa(0)=0$).

My elementary contraction for the potential $\Phi(\rho)=|\rho|/(1-|\rho|)$:

$$
\Phi(\kappa(\rho)) \;\le\; \frac{1}{\,2-\kappa'(0)\,}\,\Phi(\rho).
$$

Complex-analytic contraction (Rogosinski extremal) for the hyperbolic gauge $E_0=2\Phi$:

$$
E_0(\kappa(z)) \;\le\; \frac{1+\kappa'(0)}{2}\,E_0(z).
$$

Because

$$
\frac{1+\kappa'(0)}{2} \;>\; \frac{1}{\,2-\kappa'(0)\,} \quad \text{for } \kappa'(0)\in(0,1),
$$

the constant from my elementary proof is strictly smaller in this centered case. The reason is structural: kernel maps have non-negative Maclaurin coefficients, a special subclass of Schur maps that admits stronger coefficient-wise inequalities. Rogosinski’s factor is nevertheless sharp in the full Schur class and has the conceptual advantage of being purely geometric and automorphism-invariant {% cite rogosinski1936 cowenmaccluer1995 %}.

Interior non-centered case.

My elementary theorem gives a Euclidean-gauge rate toward $\rho^\star$ based on

$$
\alpha \;=\; \max\Big\{1-\kappa(0),\, \kappa'(\rho^\star),\, \frac{1-\rho^\star}{\,2-\kappa'(\rho^\star)\,}\Big\}.
$$

The complex-analytic proof yields a clean, automorphism-invariant hyperbolic contraction

$$
E_a(\kappa(z)) \;\le\; \frac{1+q}{2}\,E_a(z),
\qquad q=|\kappa'(a)|.
$$

These are not directly comparable because they measure different geometries (Euclidean vs. hyperbolic about the true fixed point). The analytic bound is universal and sharp in the Schur class; my elementary rate can be tighter for the kernel subclass in some parameter ranges.

Strictly attractive boundary.

Both approaches yield the same sharp constant $\beta=\kappa'(1)$, but the complex-analytic route identifies $H_1$ as the intrinsic gauge via Julia–Carathéodory, giving a one-line proof {% cite julia1918 caratheodory1907 cowenmaccluer1995 %}.

Parabolic boundary.

My elementary proof gives a logistic one-step improvement with

$$
\alpha \;=\; 1-\kappa(0)-\kappa'(0),
$$

leading to $O(1/\ell)$ decay of $|\rho_\ell-1|$. The complex-analytic version proves the same $O(1/\ell)$ law in the natural horodisk gauge and ties the constant $\gamma$ to angular higher-order data via Koenigs linearization and modern boundary refinements {% cite cowenmaccluer1995 mercer2018 osserman2000 %}.

Takeaway. In the centered interior case, my elementary constant is strictly stronger for the kernel subclass. In the other regimes, the complex-analytic route matches known sharp constants and repackages the argument in a coordinate-free, hyperbolic geometry that immediately generalizes (e.g., to any interior fixed point via automorphisms), with exact extremals known from classical function theory.

### Final remarks: glimpses into the future 

The process of me finding out about the complex analytical results wasn't quite one-shot. My first attempts to uncover possible links with various branches of mathematics only revealed that a combination of Schwarz's lemma and could explain the global attraction result, but without any explicit convergence result. I tried several more times to find more advanced result to no avail. 


In my final successful attempt, I kind of tried to reverse the process. First, I converted my explicit global convergence results to an statement about holomorphic functions. Once stated in these terms, I did a deep research to find if this statements are novel or are discovering some known complex analytic fact. This transformation of the statement aparently was sufficient to trigger GPT-5 to realize that these results were nearly identical to earlier and by now classical results, dating back to a work from almost a century ago. A little more digging revealed sharp lemmas and extremal principles scattered across function theory, allowing alternative proofs that are shorter and conceptually cleaner, and are actually sharper than my results.


I think my story with my elementary proof and these new more involved proofs is only the tip of the iceberg. I believe models like like GPT-5 can act as literature compasses, and help bridge distant areas of knowledge, reuniting ideas that are separated across history and discilipines. If used thoughtfully, they reveal where to look, which classical stones to turn, and how far existing results already reach. I think it's no overstating to say that this could bring about a renesoinse for mathematics, human knowledge, and more broadly understanding of the world around us.

---

### References

{% bibliography --cited %} 
