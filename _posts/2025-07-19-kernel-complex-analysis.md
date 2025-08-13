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

In my AISTATS paper {% cite joudaki2025aistats %}, I proved that the mean-field neural kernel (a.k.a. conjugate kernel, or NNGP kernel) sequence of a deep MLP converges globally to a fixed point determined by the activation and architecture. My proof involved using Hermite polynomials, and relying on the specific algebraic properties of the neural kernel. The proof was self-contained and was entirely elementary. 
Now, roughly a year later after that, with the help of GPT-5's thinking and deep research mode, I found that my elementary proofs are connected to some deep concepts in classical complex analysis that date back almot a centry back. 

The process of me finding out about the complex analytical results wasn't quite one-shot. My first attempts to uncover possible links with various branches of mathematics only revealed that a combination of Schwarz's lemma and could explain the global attraction result, but without any explicit convergence result. I tried several more times to find more advanced result to no avail. 


In my final successful attempt, I kind of tried to reverse the process. First, I converted my explicit global convergence results to an statement about holomorphic functions. Once stated in these terms, I did a deep research to find if this statements are novel or are discovering some known complex analytic fact. This transformation of the statement aparently was sufficient to trigger GPT-5 to realize that these results were nearly identical to earlier and by now classical results, dating back to a work from almost a century ago. A little more digging revealed sharp lemmas and extremal principles scattered across function theory, allowing alternative proofs that are shorter and conceptually cleaner, and are actually sharper than my results.


I think my story with my elementary proof and these new more involved proofs is only the tip of the iceberg. I believe models like like GPT-5 can act as literature compasses, and help bridge distant areas of knowledge, reuniting ideas that are separated across history and discilipines. If used thoughtfully, they reveal where to look, which classical stones to turn, and how far existing results already reach. I think it's no overstating to say that this could bring about a renesoinse for mathematics, human knowledge, and more broadly understanding of the world around us.
 
---

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

We now re-derive global attraction using classical holomorphic dynamics on the unit disk. Let $d_{\mathbb D}$ be the Poincaré distance and the standard automorphism

$$\varphi_a(z)=(z-a)/(1-\overline a z)$$ 

Define

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

Interior non-centered regime. Let $a$ be the interior fixed point and $$q=\kappa'(a)$$. Contraction is

$$
\frac{1+q}{2}
\quad\text{in}\quad
E_a(\cdot).
$$

Residual connections convex-combine $\kappa$ with the identity, pushing derivatives toward $1$ and slowing contraction.

Boundary regimes. With $\beta=\kappa'(1)\in(0,1)$, decay is exactly geometric at rate $\beta$ in the natural horodisk gauge $H_1$. In the parabolic case $\kappa'(1)=1$, the optimal general rate is $O(1/\ell)$ with a computable $\gamma>0$ from boundary data.

#### Sharpness and apples-to-apples comparison

Centered case ($\kappa(0)=0$).

My elementary contraction for the potential
$\Phi(\rho)=|\rho|/(1-|\rho|)$:

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

leading to 
$$O(1/\ell)$$ 
decay of 
$$|\rho_\ell-1|$$. The complex-analytic version proves the same $$O(1/\ell)$$ law in the natural horodisk gauge and ties the constant $\gamma$ to angular higher-order data via Koenigs linearization and modern boundary refinements {% cite cowenmaccluer1995 mercer2018 osserman2000 %}.

Takeaway. In the centered interior case, my elementary constant is strictly stronger for the kernel subclass. In the other regimes, the complex-analytic route matches known sharp constants and repackages the argument in a coordinate-free, hyperbolic geometry that immediately generalizes (e.g., to any interior fixed point via automorphisms), with exact extremals known from classical function theory.

### Visualization 

How to use the panel

- **Degree and weights.** Set $$K$$ and the sliders $$w_k$$. They are auto-normalized so $$\sum_k w_k=1$$ and hence $$\kappa(1)=1$$.  
  • **force centered** sets $$w_0=\kappa(0)=0$$.  
  • Readouts show $$w_0$$, $$\kappa'(0)=w_1$$, and $$\kappa'(1)=\sum_{k\ge1} k\,w_k$$.

- **Mode.**  
  **centered** uses the gauge $$E_0$$.  
  **interior** centers at the detected real attractor $$\rho^\star$$ and uses $$E_a$$ with $$a=\rho^\star$$.  
  **boundary** uses the horodisk gauge $$H_1$$.

- **Point and iterates.** Pick $$z=re^{i\theta}$$ and the number of steps $$\ell$$.

---

#### What the three plots show

- **Map on $$[{-}1,1]$$.** The curve $$y=\kappa(x)$$ vs. the identity; intersections are fixed points.  
   Options: **tangents** at $$0$$ and $$1$$; **Rogosinski envelope** (centered) with
   
$$
|\kappa(r)|\le R(r)=\frac{r(\kappa'(0)+r)}{1+\kappa'(0)\,r}.
$$

- **Poincaré disk view.** Shows $$z\mapsto \kappa(z)$$ and the one-step ratio:

$$
\frac{E_a(\kappa(z))}{E_a(z)}\ \text{ or }\ \frac{H_1(\kappa(z))}{H_1(z)}.
$$

- **Iterates.** Log plot of the gauge along $$\kappa^{\circ \ell}(z_0)$$ with the theoretical envelope:
   - centered: 
   $$\big(\tfrac{1+\kappa'(0)}{2}\big)^{\ell}E_0(z_0)$$
   - interior: 
   $$\big(\tfrac{1+|\kappa'(a)|}{2}\big)^{\ell}E_a(z_0)$$
   - boundary: $$\kappa'(1)^{\ell}H_1(z_0)$$.
   (Parabolic $$\kappa'(1)=1$$: true $$H_1\sim 1/(1+\gamma\ell)$$; the overlay is a visual proxy.)

---

#### Quick recipes (C1–C4)

- **C1 (centered):** check *force centered*; set $$0\le \kappa'(0)<1$$. Expect factor $$\tfrac{1+\kappa'(0)}{2}$$ in $$E_0$$.
- **C2 (boundary, strict):** $$w_0>0$$, tune $$\kappa'(1)\in(0,1)$$; boundary mode shows factor $$\kappa'(1)$$ in $$H_1$$.
- **C3 (parabolic):** make $$\kappa'(1)\approx1$$; see slow $$O(1/\ell)$$ decay in $$H_1$$.
- **C4 (interior, non-centered):** weights yield $$\rho^\star\in(0,1)$$; interior mode shows factor 
$$\tfrac{1+|\kappa'(\rho^\star)|}{2}$$ in $$E_a$$.

*Notes:* the demo uses polynomials with non-negative coefficients (kernel subclass); points near $$\vert z\vert =1$$ are kept slightly inside for numerical stability.

<!-- =========================
Interactive Visualization: Complex-Analytic Proofs for Kernel Dynamics
Paste this block inside your post. It only depends on Plotly.
========================= -->

<!-- Add Plotly if not already loaded in your page -->
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
  <!-- Controls -->
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
        centered interior (a=0)
      </label>
      <label style="margin-right:8px;">
        <input type="radio" name="mode" value="interior" />
        interior fixed point a
      </label>
      <label>
        <input type="radio" name="mode" value="boundary" />
        boundary Denjoy–Wolff at 1
      </label>
    </div>

    <div class="ctrl" id="aCtrl" style="display:none;">
      <label>Interior fixed point a (real) <span class="pill" id="aLabel">—</span></label>
      <input id="aVal" type="range" min="-0.95" max="0.95" step="0.01" value="0.30" disabled />
      <div class="muted">Automatically set to the attracting real fixed point ρ⋆ when it exists.</div>
    </div>

    <div class="muted" id="readouts" style="margin-top:8px;"></div>
  </div>

  <!-- Plots -->
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
  // Ensure Plotly is ready
  function onReady(cb){ if (window.Plotly) cb(); else setTimeout(()=>onReady(cb), 50); }

  onReady(() => {
    // DOM refs
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
    const aCtrl = document.getElementById('aCtrl');
    const aEl = document.getElementById('aVal');
    const aLabel = document.getElementById('aLabel');

    const readouts = document.getElementById('readouts');

    const mapPlot = document.getElementById('mapPlot');
    const diskPlot = document.getElementById('diskPlot');
    const iterPlot = document.getElementById('iterPlot');

    // Build weight sliders
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

    // Complex helpers & gauges
    function cAdd(a,b){ return [a[0]+b[0], a[1]+b[1]]; }
    function cSub(a,b){ return [a[0]-b[0], a[1]-b[1]]; }
    function cMul(a,b){ return [a[0]*b[0]-a[1]*b[1], a[0]*b[1]+a[1]*b[0]]; }
    function cDiv(a,b){ const den = b[0]*b[0]+b[1]*b[1]; return [(a[0]*b[0]+a[1]*b[1])/den, (a[1]*b[0]-a[0]*b[1])/den]; }
    function cAbs(a){ return Math.hypot(a[0], a[1]); }
    function cConj(a){ return [a[0], -a[1]]; }

    function phi_a(z, a){ // ϕ_a(z)=(z-a)/(1-ā z)
      const num = cSub(z, a);
      const den = cSub([1,0], cMul(cConj(a), z));
      return cDiv(num, den);
    }
    function dD(z,w){ // hyperbolic distance in the disk
      const t = Math.min(0.999999, Math.max(0, cAbs(phi_a(z,w))));
      return 0.5 * Math.log((1+t)/(1-t));
    }
    function E_a(z,a){ return Math.exp(dD(z,a)) - 1; }
    function H1_direct(z){ // |1-z|^2 / (1-|z|^2)
      const num = (1 - z[0])*(1 - z[0]) + z[1]*z[1];
      const den = 1 - (z[0]*z[0] + z[1]*z[1]);
      return den > 0 ? (num/den) : Infinity;
    }

    // κ map and derivatives (real coefficients)
    function getWeights(K){
      const ws = [];
      let sum = 0;
      for (let k=0;k<=K;k++){
        const v = parseFloat(document.getElementById(`w_${k}`).value);
        const vv = Math.max(0, v);
        ws.push(vv); sum += vv;
      }
      if (sum === 0){ ws[0]=1; sum=1; }
      // normalize to sum 1
      for (let k=0;k<=K;k++) ws[k] /= sum;
      if (forceCenteredEl.checked){
        ws[0] = 0;
        let s=0; for (let k=1;k<=K;k++) s += ws[k];
        if (s === 0) { ws[1] = 1; s = 1; }
        for (let k=1;k<=K;k++) ws[k] /= s;
      }
      // labels
      for (let k=0;k<=K;k++){
        const lab = document.getElementById(`w_${k}_label`);
        if (lab) lab.textContent = ws[k].toFixed(3);
      }
      return ws;
    }
    function kappaReal(x, ws){
      let s = 0;
      let xpow = 1;
      for (let k=0;k<ws.length;k++){ s += ws[k] * xpow; xpow *= x; }
      return s;
    }
    function kappaComplex(z, ws){
      let acc = [0,0];
      let zpow = [1,0];
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

    // Rogosinski envelope for centered: |κ(r)| ≤ R(r) with R(r)= r(a+r)/(1+a r), a=κ'(0)=w1
    function rogosinski(r, a){ return (r*(a+r)) / (1 + a*r); }

    // Fixed points (real) finder
    function computeFixedPoints(ws){
      const xs = [];
      const f = (x)=>kappaReal(x,ws)-x;
      const N=800;
      let prevX=-1, prevF=f(-1);
      for(let i=1;i<=N;i++){
        const x = -1 + 2*i/N;
        const y = f(x);
        if (y===0 || (prevF<0 && y>0) || (prevF>0 && y<0)){
          // bisection refine
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
      aLabel.textContent = aEl.disabled ? '—' : parseFloat(aEl.value).toFixed(2);
    }
    function currentMode(){
      const m = modeEls.find(x=>x.checked)?.value || 'centered';
      aCtrl.style.display = (m==='interior') ? '' : 'none';
      return m;
    }

    function update() {
      syncLabels();

      const K = parseInt(degEl.value,10);
      const ws = getWeights(K);

      const w0 = ws[0] || 0;
      const a0 = kappaPrimeAt0(ws);     // κ'(0)
      const beta = kappaPrimeAt1(ws);   // κ'(1)
      const fixeds = computeFixedPoints(ws);

      // choose attracting real fixed point (if any) in (−1,1)
      let rhoStar = null;
      if (fixeds.length){
        // prefer one in [0,1); otherwise nearest to 0
        const nonneg = fixeds.filter(x=>x>=0);
        rhoStar = (nonneg.length? nonneg[0] : fixeds.reduce((p,c)=>Math.abs(c)<Math.abs(p)?c:p, fixeds[0]));
      }

      // Interior mode: snap a to ρ⋆ and expose derivative at that point
      let a_show = '—', kprime_a = null;
      const mode = currentMode();
      if (mode==='interior' && rhoStar!==null){
        aEl.disabled = true;
        aEl.value = rhoStar.toFixed(2);
        a_show = rhoStar.toFixed(2);
        kprime_a = kappaPrimeAt(ws, rhoStar);
      } else {
        aEl.disabled = true; // keep disabled to avoid confusion with theory
      }

      readouts.innerHTML = `
        <span class="pill">w₀=κ(0)=${w0.toFixed(3)}</span>
        <span class="pill">κ'(0)=${a0.toFixed(3)}</span>
        <span class="pill">κ'(1)=${beta.toFixed(3)}</span>
        <span class="pill">fixed points: ${fixeds.map(x=>x.toFixed(3)).join(', ') || 'none'}</span>
        ${mode==='interior' && rhoStar!==null ? `<span class="pill">ρ⋆=${a_show}, κ'(ρ⋆)=${kprime_a.toFixed(3)}</span>` : ''}
      `;

      drawMap(ws, a0, beta);
      drawDisk(ws, rhoStar);
      drawIter(ws, a0, beta, rhoStar, kprime_a);
    }

    function drawMap(ws, a0, beta){
      const N=600;
      const X = new Array(N);
      const Y = new Array(N);
      for (let i=0;i<N;i++){
        const x = -1 + 2*i/(N-1);
        X[i]=x; Y[i]=kappaReal(x,ws);
      }

      const traces = [
        { x:X, y:Y, name:'κ(x)', mode:'lines', line:{width:3} },
        { x:[-1,1], y:[-1,1], name:'identity', mode:'lines', line:{dash:'dash'} },
      ];

      // fixed points
      const fixeds = computeFixedPoints(ws);
      if (fixeds.length){
        traces.push({
          x: fixeds, y: fixeds, mode:'markers', name:'fixed points',
          marker:{size:8, color:'#10b981'}
        });
      }

      // tangents
      if (showSlopeEl.checked){
        // tangent at 0: y = κ'(0) x
        traces.push({
          x:[-1,1], y:[-a0, a0], mode:'lines', name:"tangent at 0",
          line:{color:'#6366f1', width:1}
        });
        // tangent at 1: y = 1 + κ'(1)(x-1)
        traces.push({
          x:[-1,1], y:[1 + beta*(-2), 1 + beta*(0)], mode:'lines', name:"tangent at 1",
          line:{color:'#f59e0b', width:1}
        });
      }

      // Rogosinski envelope for centered
      if (showRogEl.checked && Math.abs(ws[0])<1e-12){
        const a=a0; // κ'(0)
        const Rplus = X.map(x => rogosinski(Math.abs(x), a));
        const Rminus = Rplus.map(v => -v);
        traces.push({ x:X, y:Rplus, name:'Rogosinski +R(|x|)', mode:'lines', line:{dash:'dot', color:'#ef4444'}});
        traces.push({ x:X, y:Rminus, name:'Rogosinski -R(|x|)', mode:'lines', line:{dash:'dot', color:'#ef4444'}});
      }

      Plotly.react(mapPlot, traces, {
        margin:{t:20,r:10,l:40,b:40},
        xaxis:{title:'x', range:[-1,1]},
        yaxis:{title:'κ(x)', range:[-1,1]},
        legend:{orientation:'h', y:1.15}
      }, {displayModeBar:false, responsive:true});
    }

    function drawDisk(ws, rhoStar){
      // Poincaré disk with unit circle, show z and κ(z), and gauges
      const r = parseFloat(rEl.value), th = parseFloat(thetaEl.value);
      let z = [r*Math.cos(th), r*Math.sin(th)];
      let kz = kappaComplex(z, ws);

      // keep inside disk numerically
      const keepInside = (w) => {
        const a = cAbs(w);
        return (a < 0.999) ? w : [w[0]/(a*1.001), w[1]/(a*1.001)];
      };
      z = keepInside(z); kz = keepInside(kz);

      // unit circle
      const circleN=256, cx=[], cy=[];
      for (let i=0;i<=circleN;i++){ const t=2*Math.PI*i/circleN; cx.push(Math.cos(t)); cy.push(Math.sin(t)); }

      // Gauges
      const mode = currentMode();
      let a = [0,0];
      let ratioText = '';
      if (mode==='interior'){
        if (rhoStar!==null) a = [rhoStar, 0];
      }

      let E_before=null, E_after=null, H_before=null, H_after=null;
      if (mode==='boundary'){
        H_before = H1_direct(z);
        H_after  = H1_direct(kz);
        ratioText = (H_before>0 && isFinite(H_before) ? (H_after/H_before).toFixed(3) : '—');
      } else {
        E_before = E_a(z,a);
        E_after  = E_a(kz,a);
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
        traces.push({ x:[a[0]], y:[a[1]], mode:'markers', name:'a (gauge center)', marker:{size:7, color:'#10b981'} });
      }

      const annots = [];
      if (mode==='centered'){
        annots.push({x: -1.1, y:1.1, text:`E₀ one-step ratio: ${ratioText}`, showarrow:false, font:{size:12}});
      } else if (mode==='interior'){
        annots.push({x: -1.1, y:1.1, text:`Eₐ one-step ratio: ${ratioText}`, showarrow:false, font:{size:12}});
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

    function drawIter(ws, a0, beta, rhoStar, kprime_a){
      const mode = currentMode();
      const L = parseInt(LEl.value,10);
      const r = parseFloat(rEl.value), th = parseFloat(thetaEl.value);
      let z = [r*Math.cos(th), r*Math.sin(th)];

      // iterate κ
      const zseq = [];
      for (let i=0;i<=L;i++){
        zseq.push(z);
        z = kappaComplex(z, ws);
        const a = cAbs(z);
        if (a >= 0.999){ z = [z[0]/(a*1.001), z[1]/(a*1.001)]; }
      }

      // Compute gauge sequence and theoretical envelope
      let gaugeName='', G=[], theory=[];
      if (mode==='boundary'){
        gaugeName='H₁';
        for (let i=0;i<zseq.length;i++) G.push(H1_direct(zseq[i]));
        const b = beta; // κ'(1)
        const base = Math.max(G[0], 1e-12);
        for (let i=0;i<zseq.length;i++) theory.push( Math.pow(Math.max(Math.min(b,0.999),0), i) * base );
      } else {
        const a = (mode==='interior' && rhoStar!==null) ? [rhoStar,0] : [0,0];
        gaugeName = (mode==='interior' && rhoStar!==null) ? 'Eₐ' : 'E₀';
        for (let i=0;i<zseq.length;i++) G.push( Math.exp(dD(zseq[i], a)) - 1 );
        const q = (mode==='interior' && rhoStar!==null)
          ? (1 + Math.abs(kprime_a||0)) / 2
          : (1 + Math.abs(a0)) / 2;
        const base = Math.max(G[0], 1e-12);
        for (let i=0;i<zseq.length;i++) theory.push( Math.pow(Math.max(Math.min(q,0.999),0), i) * base );
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

    // Events
    [degEl, forceCenteredEl, showRogEl, showSlopeEl, rEl, thetaEl, LEl].forEach(el => el.addEventListener('input', refresh));
    modeEls.forEach(el => el.addEventListener('change', refresh));

    function refresh() {
      syncLabels();
      const currentChildren = weightsDiv.querySelectorAll('input[id^="w_"]').length;
      const want = parseInt(degEl.value,10)+1;
      if (currentChildren !== want) buildWeightControls(parseInt(degEl.value,10));
      update();
    }

    // Initial render
    buildWeightControls(parseInt(degEl.value,10));
    update();
  });
})();
</script>


---

### References

{% bibliography --cited %} 
