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

bibliography: ../assets/_bibliography/refs.bib
---

<script type="text/x-mathjax-config">
MathJax.Hub.Config({
  TeX: { equationNumbers: { autoNumber: "AMS" } }
});
</script>

<h1 id="prelude-bridging-fields-with-ai">Prelude: bridging fields with
AI</h1>
<p>In my AISTATS paper <span class="citation"
data-cites="joudaki2025aistats">(<a href="#ref-joudaki2025aistats"
role="doc-biblioref">Joudaki and Hofmann 2025</a>)</span>, we proved
that the mean-field neural kernel (a.k.a. conjugate kernel, or NNGP
kernel) sequence of a deep MLP converges globally to a fixed point
determined by the activation and architecture. My proof involved using
Hermite polynomials, and relying on the specific algebraic properties of
the neural kernel. The proof was self-contained and was entirely
elementary. Now, roughly a year later after that, with the help of
GPT-5’s thinking and deep research mode, I found that my elementary
proofs are connected to some deep concepts in classical complex analysis
that date back almost a century back.</p>
<p>The process of me finding out about the complex analytical results
wasn’t quite one-shot. My first attempts to uncover possible links with
various branches of mathematics only revealed that a combination of
Schwarz’s lemma and could explain the global attraction result, but
without any explicit convergence result. I tried several more times to
find more advanced result to no avail.</p>
<p>In my final successful attempt, I kind of tried to reverse the
process. First, I converted my explicit global convergence results to an
statement about holomorphic functions. Once stated in these terms, I did
a deep research to find if this statements are novel or are discovering
some known complex analytic fact. This transformation of the statement
apparently was sufficient to trigger GPT-5 to realize that these results
were nearly identical to earlier and by now classical results, dating
back to a work from almost a century ago. A little more digging revealed
sharp lemmas and extremal principles scattered across function theory,
allowing alternative proofs that are shorter and conceptually cleaner,
and are actually sharper than my results.</p>
<p>I think my story with my elementary proof and these new more involved
proofs is only the tip of the iceberg. I believe models like like GPT-5
can act as literature compasses, and help bridge distant areas of
knowledge, reuniting ideas that are separated across history and
disciplines. If used thoughtfully, they reveal where to look, which
classical stones to turn, and how far existing results already reach. I
think it’s no overstating to say that this could bring about a
renaissance for mathematics, human knowledge, and more broadly
understanding of the world around us.</p>
<h1 id="setup-and-the-original-master-theorem">Setup and the original
master theorem</h1>
<p>We work in the mean-field regime for a fully-connected, width-<span
class="math inline">\(d\)</span> MLP at random initialization with
activation <span class="math inline">\(\phi\)</span> that has a finite
Gaussian second moment. Let <span class="math display">\[\rho_{\ell+1} =
\kappa(\rho_\ell), \quad
\kappa(\rho) = \mathbb{E}[\phi(X)\phi(Y)], \quad
\begin{pmatrix}X\\Y\end{pmatrix}
\sim \mathcal{N}\left(0,\begin{pmatrix}1&amp;\rho\\
\rho&amp;1\end{pmatrix}\right),\]</span> as in <span class="citation"
data-cites="poole2016exponential">(<a href="#ref-poole2016exponential"
role="doc-biblioref">Poole et al. 2016</a>)</span>.</p>
<p>Throughout this analysis we assume <span
class="math inline">\(\kappa(1) = 1\)</span> which implies <span
class="math inline">\(E\phi(z)^2 = 1\)</span> for <span
class="math inline">\(z\sim N(0,1)\)</span>. This implies that <span
class="math inline">\(\kappa\)</span> is a mapping from <span
class="math inline">\([-1,1]\)</span> onto itself. This means we can
study the kernel sequence as a fixed point iteration, and thus, ask the
following key question:</p>
<blockquote>
<p><span>The key inquiry</span> in our work was the convergence behavior
and speed of sequence <span class="math inline">\(\rho_0,
\kappa(\rho_0),\kappa(\kappa(\rho_0)) \ldots\)</span> as a function of
its starting point <span class="math inline">\(\rho_0\)</span> and
properties of the activation.</p>
</blockquote>
<div class="definition">
<p><strong>Definition 1</strong> (Kernel sequence terminology). </p>
<ul>
<li><p><em><span>Kernel sequence</span>: starting from <span
class="math inline">\(\rho_0\)</span>, we denote the <span
class="math inline">\(\ell\)</span>-th point in the the sequence by
<span class="math inline">\(\rho_\ell\)</span>, or alternatively as
<span class="math inline">\(\kappa^{\circ \ell}(\rho_0),\)</span> which
indicates it is <span class="math inline">\(\ell\)</span> invocation of
the kernel map on the input.</em></p></li>
<li><p><em><span>Fixed points</span>: are defined as invariant locations
for the kernel map: <span class="math inline">\(\kappa(\rho^\star) =
\rho^\star.\)</span></em></p></li>
<li><p><em><span>Locally attracting fixed points</span> are defined as
<span class="math inline">\(\rho^\star\)</span> such that if starting
from an infinitesmal neighborhood of <span
class="math inline">\(\rho^\star\)</span>, kernel sequence will converge
to <span class="math inline">\(\rho^\star.\)</span></em></p></li>
<li><p><em><span>Locally repulsive fixed point</span>: are defined as
<span class="math inline">\(\rho^\star\)</span> such that if starting
from an infinitesmal neighborhood of <span
class="math inline">\(\rho^\star\)</span>, kernel sequence will diverge
from <span class="math inline">\(\rho^\star.\)</span></em></p></li>
<li><p><em><span>Global attracting fixed point</span> are defined as
<span class="math inline">\(\rho^\star\)</span> such that for all
starting points other than some measure zero set of <span
class="math inline">\([-1,1]\)</span>, the kernel sequence will converge
to <span class="math inline">\(\rho^\star.\)</span></em></p></li>
</ul>
</div>
<p><strong>High level insights from the proofs:</strong> The most
crucial first insight to the work is that we must expand <span
class="math inline">\(\phi\)</span> in the normalized Hermite basis
<span class="math inline">\(\phi=\sum_{k\geq0}
c_k\,\mathrm{He}_k\)</span> yields the analytic self-map <span
class="math display">\[\kappa(z) = \sum_{k=0}^\infty c_k^2\, z^k \quad
\text{on } \mathbb{D}.\]</span></p>
<p>Thus, based on the assumption that <span
class="math inline">\(\kappa(1)=1\)</span> we will have <span
class="math inline">\(\sum_{k=0}^\infty c_k^2 = 1.\)</span> This means
that kernel map <span class="math inline">\(\kappa\)</span> is a highly
smooth, aka analytic function, and it is also a mapping from <span
class="math inline">\([-1,1]\)</span> onto itself. These two
restrictions were the essential ingredients to proof the bounds above.
If we plot the kernel map for various functions, it becomes readily
immediately clear that its smoothness will prevent us from crossing the
identity more than two times. But to make this intuition formal, it took
several days of painstaking step-by-step derivations.</p>
<p>For comparison reasons, here is the statement of the master theorem
in the paper:</p>
<h2 id="original-master-theorem">Original master theorem</h2>
<div class="theorem">
<p><strong>Theorem 1</strong> (Original Master Theorem). <em>Assume
forward stability <span class="math inline">\(\kappa(1)=1\)</span> and
nonlinearity <span class="math inline">\(\sum_{k\geq2}
c_k^2&gt;0\)</span>. Let <span
class="math inline">\(\rho_{\ell+1}=\kappa(\rho_\ell)\)</span> with
<span class="math inline">\(\rho_0\in(-1,1)\)</span>. Then the iterates
converge globally to a unique attracting fixed point <span
class="math inline">\(\rho^\star\in[0,1]\)</span> with the following
casewise rates:</em></p>
<ol>
<li><p><em><strong>Centered activations</strong> <span
class="math inline">\(\kappa(0)=0\)</span>: <span
class="math display">\[\Phi(\rho_\ell) \leq
\left(\frac{1}{2-\kappa&#39;(0)}\right)^{\ell}\, \Phi(\rho_0), \quad
\rho^\star=0.\]</span></em></p></li>
<li><p><em><strong>Boundary Denjoy–Wolff with strict attraction</strong>
<span class="math inline">\(\kappa(0)&gt;0\)</span> and <span
class="math inline">\(\kappa&#39;(1)\in(0,1)\)</span>: <span
class="math display">\[|\rho_\ell-1| \leq
\kappa&#39;(1)^{\ell}\,|\rho_0-1|, \quad
\rho^\star=1.\]</span></em></p></li>
<li><p><em><strong>Parabolic boundary case</strong> <span
class="math inline">\(\kappa(0)&gt;0\)</span> and <span
class="math inline">\(\kappa&#39;(1)=1\)</span>: <span
class="math display">\[|\rho_\ell-1| \leq
\frac{|\rho_0-1|}{1+\alpha\,\ell\,|\rho_0-1|}, \quad \alpha =
1-\kappa(0)-\kappa&#39;(0), \quad \rho^\star=1.\]</span></em></p></li>
<li><p><em><strong>Interior non-centered attractor</strong> <span
class="math inline">\(\kappa(0)&gt;0\)</span> and <span
class="math inline">\(\kappa&#39;(1)&gt;1\)</span>: <span
class="math display">\[|\rho_\ell-\rho^\star| \leq
\frac{|\rho_0-\rho^\star|}{1-|\rho_0|}\, \alpha^{\ell}, \quad
\alpha = \max\left\{1-\kappa(0),\, \kappa&#39;(\rho^\star),\,
\frac{1-\rho^\star}{2-q}\right\} &lt; 1,\]</span> where <span
class="math inline">\(q=\kappa&#39;(\rho^\star)\)</span>.</em></p></li>
</ol>
<p><em>All remaining fixed points (only possibly <span
class="math inline">\(\pm1\)</span>) are non-attracting.</em></p>
</div>
<p>One of the central ingredients for formalizing these intuitions were
the following two Lyapunov potential function, that worked as gauges to
look at kernel sequence convergence <span
class="math display">\[\Phi(\rho) :=
\frac{|\rho|}{1-|\rho|},\]</span></p>
<p>Roughly speaking, the first potential function was used for interior
fixed points, i.e., <span
class="math inline">\(\rho^\star\in[0,1)\)</span>, and the second type
was used for boundary fixed points, i.e., <span
class="math inline">\(\rho^\star=1.\)</span> This potential was used
mostly for cases 1 and 4 of the master theorem. Other cases whose
contraction was simpler and didn’t require defining a special potential.
You can see <span class="citation" data-cites="joudaki2025aistats">(<a
href="#ref-joudaki2025aistats" role="doc-biblioref">Joudaki and Hofmann
2025</a>)</span> for the full and entirely elementary proofs.</p>
<p>One notable thing you will quickly realize from the proofs is that
they are entirely elementary proofs. Not that this is a bad thing per
se, but given the elegant and very simple form of this result and its
seeming generality, it is befuddling to think that this result is a
fundamentally new discovery, and has never been discovered by
mathematicians. That was the point that was raised by my co-author, and
stayed with me for quite a long time. A second reason for my unease was
the discontinuity between some of the cases. Namely, if you compare the
centered and interior cases (1 &amp; 4), if we take the limit of <span
class="math inline">\(\kappa(0)\to 0^+\)</span>, which still falls under
case 4, will be converging to a vacuous bound. However, having exactly
<span class="math inline">\(\kappa(0) = 0\)</span> we fall under the
still non-vacuous bound of case 1.</p>
<p>The combination of these two reasons is why we suspect something
deeper and more elegant under the surface of these proofs and results.
As discussed in the sequel, these suspicions were deemed to be true.</p>
<h1 id="an-alternative-complex-analytic-proof">An alternative
complex-analytic proof</h1>
<p>First, let us go through a quick primer on holomorphic self-maps of
the disk and why they’re useful.</p>
<p>We can embed our real kernel map <span
class="math inline">\(\kappa:[-1,1]\to[-1,1]\)</span> into the complex
unit disk <span class="math display">\[\mathbb{D} = \{z\in\mathbb{C}:\
|z|&lt;1\}\]</span> by the same power series (it converges on <span
class="math inline">\(\mathbb{D}\)</span>): <span
class="math inline">\(\kappa(z)=\sum_{k\geq0}c_k^2\,z^k\)</span>. This
makes <span class="math inline">\(\kappa\)</span> a
<strong>holomorphic</strong> (complex-differentiable) self-map of <span
class="math inline">\(\mathbb{D}\)</span>. Classical function theory on
<span class="math inline">\(\mathbb{D}\)</span> gives sharp,
geometry-aware <strong>contraction</strong> inequalities for such maps,
which we can reuse to get global attraction rates for <span
class="math inline">\(\rho_{\ell+1}=\kappa(\rho_\ell)\)</span>.</p>
<div class="definition">
<p><strong>Definition 2</strong> (Geometric gadgets). <em>Two geometric
gadgets appear repeatedly:</em></p>
<ul>
<li><p><em><strong>Automorphisms of <span
class="math inline">\(\mathbb{D}\)</span></strong> (disk re-centerings).
For any <span class="math inline">\(a\in\mathbb{D}\)</span>, <span
class="math display">\[\varphi_a(z) =
\frac{z-a}{1-\overline{a}\,z}\]</span> moves <span
class="math inline">\(a\)</span> to <span
class="math inline">\(0\)</span> without leaving <span
class="math inline">\(\mathbb{D}\)</span>. Think of it as a “change of
coordinates” that recenters analysis at a desired fixed
point.</em></p></li>
<li><p><em><strong>Poincaré (hyperbolic) distance.</strong> The
intrinsic distance on <span class="math inline">\(\mathbb{D}\)</span> is
<span class="math display">\[d_{\mathbb{D}}(z,w) =
\log\frac{1+|\varphi_w(z)|}{1-|\varphi_w(z)|}.\]</span> It measures how
hard it is to move between <span class="math inline">\(z\)</span> and
<span class="math inline">\(w\)</span> while staying in the disk; unlike
Euclidean distance, it “blows up” near the boundary <span
class="math inline">\(|z|=1\)</span>. We will also use two equivalent
gauges: <span class="math display">\[E_a(z) := e^{d_{\mathbb{D}}(z,a)}-1
= \frac{2\,|\varphi_a(z)|}{1-|\varphi_a(z)|} \quad\text{and}\quad
H_1(z) := \frac{|1-z|^2}{1-|z|^2}.\]</span> <span
class="math inline">\(E_a\)</span> is just a monotone reparameterization
of hyperbolic distance to <span class="math inline">\(a\)</span>. <span
class="math inline">\(H_1\)</span> is the “horodisk gauge” anchored at
the boundary point <span class="math inline">\(1\)</span> (it is the
correct scale when the attracting fixed point sits on the
boundary).</em></p></li>
</ul>
</div>
<h2 id="the-three-classical-tools-we-need-with-intuition">The three
classical tools we need (with intuition)</h2>
<p>Below are the exact statements we will use, quoted in the standard
disk notation. Each appears (or is recalled) in <span class="citation"
data-cites="mercer2018">(<a href="#ref-mercer2018"
role="doc-biblioref">Mercer 2018</a>)</span>, along with context and
references to classical sources.</p>
<div class="lemma">
<p><strong>Lemma 1</strong> (Schwarz–Pick Lemma (global 1-Lipschitz in
the hyperbolic metric)). <em>If <span
class="math inline">\(f:\mathbb{D}\to\mathbb{D}\)</span> is analytic,
then <span
class="math display">\[\left|\frac{f(w)-f(z)}{1-\overline{f(w)}\,f(z)}\right|
\leq \left|\frac{w-z}{1-\overline{w}\,z}\right|
\quad\text{for all }z,w\in\mathbb{D},\]</span> equivalently <span
class="math inline">\(d_{\mathbb{D}}(f(z),f(w))\leq
d_{\mathbb{D}}(z,w)\)</span>.</em></p>
<p><em><strong>Intuition</strong>: self-maps can only
<strong>shrink</strong> hyperbolic distances; automorphisms are the only
maps that preserve them.</em></p>
</div>
<div class="lemma">
<p><strong>Lemma 2</strong> (Julia–Carathéodory boundary lemma (sharp
boundary contraction)). <em>Assume <span
class="math inline">\(f:\mathbb{D}\to\mathbb{D}\)</span> is analytic,
<span class="math inline">\(f(1)=1\)</span> in the nontangential sense,
and <span class="math display">\[\beta = \liminf_{z\to
1}\frac{1-|f(z)|}{1-|z|}\in(0,\infty).\]</span> Then for all <span
class="math inline">\(z\in\mathbb{D}\)</span>, <span
class="math display">\[\frac{|1-f(z)|^2}{1-|f(z)|^2} \leq
\beta\;\frac{|1-z|^2}{1-|z|^2},\]</span> and the (radial) boundary
derivative exists with <span
class="math inline">\(|f&#39;(1)|=\beta\)</span>.</em></p>
<p><em><strong>Intuition</strong>: relative to the horodisk gauge <span
class="math inline">\(H_1\)</span>, one step under <span
class="math inline">\(f\)</span> incurs at most a multiplicative factor
<span class="math inline">\(\beta\)</span>.</em></p>
</div>
<div class="lemma">
<p><strong>Lemma 3</strong> (Dieudonné’s Lemma (two-point derivative
control)). <em>If <span
class="math inline">\(f:\mathbb{D}\to\mathbb{D}\)</span> is analytic
with <span class="math inline">\(f(z)=w\)</span> and <span
class="math inline">\(f(z_1)=w_1\)</span>, then <span
class="math display">\[|f&#39;(z)-c| \leq r,\]</span> for explicit <span
class="math inline">\(c\)</span> and <span
class="math inline">\(r\)</span> built from the Möbius invariants <span
class="math inline">\(\varphi_{z}(z_1)\)</span>, <span
class="math inline">\(\varphi_{w}(w_1)\)</span> <span class="citation"
data-cites="dieudonne1934 mercer2018">(<a href="#ref-dieudonne1934"
role="doc-biblioref">Dieudonné 1934</a>; <a href="#ref-mercer2018"
role="doc-biblioref">Mercer 2018</a>)</span>.</em></p>
<p><em><strong>Intuition</strong>: among all Schur functions matching
two interpolation constraints, the derivative at a third point lives in
a computable disk; extremals are finite Blaschke products.</em></p>
</div>
<div class="corollary">
<p><strong>Corollary 1</strong> (Rogosinski’s one-point extremal, 1936).
<em>A classical corollary of Schwarz–Pick/Dieudonné is the
<strong>Rogosinski bound</strong> <span class="citation"
data-cites="rogosinski1936">(<a href="#ref-rogosinski1936"
role="doc-biblioref">Rogosinski 1936</a>)</span>: if <span
class="math inline">\(f:\mathbb{D}\to\mathbb{D}\)</span> with <span
class="math inline">\(f(0)=0\)</span> and <span
class="math inline">\(|f&#39;(0)|=\alpha\in[0,1)\)</span>, then for
<span class="math inline">\(r\in[0,1)\)</span>, <span
class="math display">\[|f(r)| \leq \frac{r(\alpha+r)}{1+\alpha
r},\]</span> with equality for the degree-2 Blaschke extremal <span
class="math inline">\(B_{\alpha}(z)=z\,\dfrac{\alpha+z}{1+\alpha
z}\)</span>.</em></p>
<p><em><strong>Intuition</strong>: given the local slope <span
class="math inline">\(\alpha\)</span> at the origin, this is the largest
one-step radial gain still compatible with Schwarz–Pick.</em></p>
</div>
<h2 id="complex-analytic-master-theorem-camt">Complex-Analytic Master
Theorem (CAMT)</h2>
<div class="theorem">
<p><strong>Theorem 2</strong> (Complex-Analytic Master Theorem). <em>Let
<span class="math inline">\(\kappa:\mathbb{D}\to\mathbb{D}\)</span> be
holomorphic and <strong>not</strong> a disk automorphism. Consider the
iteration <span
class="math inline">\(\rho_{\ell+1}=\kappa(\rho_\ell)\)</span> with
<span class="math inline">\(\rho_0\in(-1,1)\)</span>. Let <span
class="math inline">\(q = \kappa&#39;(\rho^*), \alpha = \kappa&#39;(0),
\beta= \kappa&#39;(1)\)</span>. Then:</em></p>
<p><em><strong>(C1) Centered interior fixed point at <span
class="math inline">\(0\)</span></strong>: if <span
class="math inline">\(\kappa(0)=0\)</span> and <span
class="math inline">\(\alpha:=\kappa&#39;(0)\in[0,1)\)</span>, then for
all <span class="math inline">\(z\in\mathbb{D}\)</span> <span
class="math display">\[E_0\big(\kappa(z)\big) \leq
\frac{1+\alpha}{2}\;E_0(z)
\quad\Longrightarrow\quad
E_0\big(\kappa^{\circ \ell}(z)\big) \leq
\left(\tfrac{1+\alpha}{2}\right)^{\ell}E_0(z).\]</span></em></p>
<p><em><strong>(C4) Interior fixed point at <span
class="math inline">\(\rho^\star\in\mathbb{D}\)</span></strong>: if
<span class="math inline">\(\kappa(\rho^\star)=\rho^\star\)</span> and
<span class="math inline">\(q:=\kappa&#39;(\rho^\star)\in[0,1)\)</span>,
then for all <span class="math inline">\(z\in\mathbb{D}\)</span> <span
class="math display">\[E_{\rho^\star}\big(\kappa(z)\big) \leq
\frac{1+q}{2}\;E_{\rho^\star}(z)
\quad\Longrightarrow\quad
E_{\rho^\star}\big(\kappa^{\circ \ell}(z)\big) \leq
\left(\tfrac{1+q}{2}\right)^{\ell}E_{\rho^\star}(z).\]</span></em></p>
<p><em><strong>(C2) Strictly attractive boundary fixed point at <span
class="math inline">\(1\)</span></strong>: if <span
class="math inline">\(\kappa(1)=1\)</span> (nontangentially) and <span
class="math inline">\(\beta:=\kappa&#39;(1)\in(0,1)\)</span>, then for
all <span class="math inline">\(z\in\mathbb{D}\)</span> <span
class="math display">\[H_1\big(\kappa(z)\big) \leq \beta\;H_1(z)
\quad\Longrightarrow\quad
H_1\big(\kappa^{\circ \ell}(z)\big) \leq \beta^\ell H_1(z).\]</span>
(This is exactly Julia–Carathéodory in the <span
class="math inline">\(H_1\)</span> gauge.)</em></p>
<p><em><strong>(C3) Parabolic boundary fixed point at <span
class="math inline">\(1\)</span></strong>: if <span
class="math inline">\(\kappa(1)=1\)</span> and <span
class="math inline">\(\kappa&#39;(1)=1\)</span> but <span
class="math inline">\(\kappa\)</span> is not an automorphism, then there
exists <span class="math inline">\(\gamma&gt;0\)</span> (determined by
higher-order boundary data of <span
class="math inline">\(\kappa\)</span>) such that for all <span
class="math inline">\(z\in\mathbb{D}\)</span> <span
class="math display">\[H_1\big(\kappa(z)\big) \leq
\frac{H_1(z)}{1+\gamma\,H_1(z)}
\quad\Longrightarrow\quad
H_1\big(\kappa^{\circ \ell}(z)\big) \leq
\frac{H_1(z)}{1+\gamma\,\ell\,H_1(z)}.\]</span> (Intuition: the
hyperbolic “height” increases by a fixed additive amount per iterate in
a half-plane model.)</em></p>
</div>
<div class="remark">
<p><strong>Remark 1</strong> (Plain ML interpretation). <em>Work in the
“right” metric for the position of the attracting fixed point (interior:
<span class="math inline">\(E_a\)</span>; boundary: <span
class="math inline">\(H_1\)</span>). Then <strong>one layer</strong>
shrinks that metric by an <strong>absolute constant</strong>: <span
class="math inline">\((1+\kappa&#39;(\text{fix}))/2&lt;1\)</span> in the
interior, or <span class="math inline">\(\kappa&#39;(1)&lt;1\)</span> on
the boundary. Iterating multiplies those factors, giving geometric decay
(and <span class="math inline">\(O(1/\ell)\)</span> in the parabolic
boundary case).</em></p>
</div>
<h2 id="proof-idea">Proof idea</h2>
<p>Schwarz–Pick makes every holomorphic self-map non-expansive in the
hyperbolic metric; we need a strict global contraction with an explicit
factor. For interior fixed points we first recenter the disk so the
fixed point is at <span class="math inline">\(0\)</span>, then combine
Schwarz–Pick with the Rogosinski extremal to convert knowledge of the
local slope <span class="math inline">\(\kappa&#39;(0)\)</span> into a
sharp global one-step factor <span
class="math inline">\((1+\kappa&#39;(0))/2\)</span>. For strictly
attractive boundary fixed points, the Julia–Carathéodory lemma already
is the sharp one-step inequality in the natural horodisk gauge <span
class="math inline">\(H_1\)</span>. For the parabolic boundary case
<span class="math inline">\(\kappa&#39;(1)=1\)</span>, Koenigs
linearization conjugates the map to a unit translation on a right
half-plane, yielding a one-step logistic improvement that telescopes to
<span class="math inline">\(O(1/\ell)\)</span>.</p>
<h2 id="formal-proof">Formal proof</h2>
<p>We treat (C1)–(C4) in turn.</p>
<h3 id="c1-centered-interior-fixed-point-at-0">(C1) Centered interior
fixed point at <span class="math inline">\(0\)</span></h3>
<div class="proof">
<p><em>Proof.</em> <em>Setup.</em> Assume <span
class="math inline">\(\kappa:\mathbb{D}\to\mathbb{D}\)</span> is
holomorphic, <span class="math inline">\(\kappa(0)=0\)</span>, <span
class="math inline">\(\alpha:=\kappa&#39;(0)\in[0,1)\)</span>, and <span
class="math inline">\(\kappa\)</span> is not an automorphism.</p>
<p><em>Step 1 (extremal one-step envelope).</em> By the
<strong>Rogosinski bound</strong> <span class="citation"
data-cites="rogosinski1936">(<a href="#ref-rogosinski1936"
role="doc-biblioref">Rogosinski 1936</a>)</span>, for every <span
class="math inline">\(r\in[0,1)\)</span>, <span
class="math display">\[|\kappa(r)| \leq \frac{r(\alpha+r)}{1+\alpha r}
\quad\text{with equality for }B_\alpha(z)=z\,\frac{\alpha+z}{1+\alpha
z}.\]</span></p>
<p><em>Step 2 (convert to the hyperbolic gauge <span
class="math inline">\(E_0\)</span>).</em> Since <span
class="math inline">\(E_0(z)=\dfrac{2|z|}{1-|z|}\)</span>, we get <span
class="math display">\[\frac{E_0(\kappa(r))}{E_0(r)} =
\frac{\dfrac{2|\kappa(r)|}{1-|\kappa(r)|}}{\dfrac{2r}{1-r}} =
\frac{\alpha+r}{1+r} \leq \frac{1+\alpha}{2}.\]</span></p>
<p>This holds for all <span class="math inline">\(r\)</span> and thus
for all <span class="math inline">\(z\in\mathbb{D}\)</span> by radial
majorization. Hence <span class="math display">\[E_0\big(\kappa(z)\big)
\leq \frac{1+\alpha}{2}\;E_0(z), \quad
E_0\big(\kappa^{\circ \ell}(z)\big) \leq
\left(\tfrac{1+\alpha}{2}\right)^{\ell}E_0(z).\]</span> ◻</p>
</div>
<h3 id="c4-interior-fixed-point-at-rhostar">(C4) Interior fixed point at
<span class="math inline">\(\rho^\star\)</span></h3>
<div class="proof">
<p><em>Proof.</em> <em>Setup.</em> Assume <span
class="math inline">\(\kappa(\rho^\star)=\rho^\star\)</span> for some
<span class="math inline">\(\rho^\star\in\mathbb{D}\)</span>, and set
<span
class="math inline">\(q:=\kappa&#39;(\rho^\star)\in[0,1)\)</span>.</p>
<p><em>Step 1 (recenter at the fixed point).</em> Let <span
class="math inline">\(\psi=\varphi_{\rho^\star}\)</span>. Define <span
class="math inline">\(g=\psi\circ\kappa\circ\psi^{-1}\)</span>. Then
<span class="math inline">\(g(0)=0\)</span> and <span
class="math inline">\(g&#39;(0)=q\)</span>.</p>
<p><em>Step 2 (apply (C1) to <span
class="math inline">\(g\)</span>).</em> By (C1), <span
class="math display">\[E_0\big(g(u)\big) \leq
\frac{1+q}{2}\;E_0(u)\quad\forall u\in\mathbb{D}.\]</span></p>
<p><em>Step 3 (translate back).</em> Since <span
class="math inline">\(E_0(\psi(z))=E_{\rho^\star}(z)\)</span>, we obtain
<span class="math display">\[E_{\rho^\star}\big(\kappa(z)\big) =
E_0\big(\psi(\kappa(z))\big) = E_0\big(g(\psi(z))\big)
\leq \frac{1+q}{2}\,E_0(\psi(z)) =
\frac{1+q}{2}\,E_{\rho^\star}(z).\]</span></p>
<p>Iterating proves (C4). ◻</p>
</div>
<h3 id="c2-strictly-attractive-boundary-fixed-point-at-1">(C2) Strictly
attractive boundary fixed point at <span
class="math inline">\(1\)</span></h3>
<div class="proof">
<p><em>Proof.</em> <em>Setup.</em> Assume <span
class="math inline">\(\kappa(1)=1\)</span> n.t. and <span
class="math inline">\(\beta:=\kappa&#39;(1)\in(0,1)\)</span>.</p>
<p><em>One-step contraction (Julia–Carathéodory).</em> By
<strong>Julia’s Lemma</strong> <span class="citation"
data-cites="julia1918 caratheodory1907">(<a href="#ref-julia1918"
role="doc-biblioref">Julia 1918</a>; <a href="#ref-caratheodory1907"
role="doc-biblioref">Carathéodory 1907</a>)</span>, <span
class="math display">\[\frac{|1-\kappa(z)|^2}{1-|\kappa(z)|^2} \leq
\beta\;\frac{|1-z|^2}{1-|z|^2}
\quad\text{for all }z\in\mathbb{D},\]</span> i.e. <span
class="math display">\[H_1\big(\kappa(z)\big) \leq
\beta\;H_1(z).\]</span></p>
<p><em>Iterate.</em> Apply the inequality <span
class="math inline">\(\ell\)</span> times to get <span
class="math inline">\(H_1(\kappa^{\circ \ell}(z))\leq \beta^\ell
H_1(z)\)</span>. ◻</p>
</div>
<h3 id="c3-parabolic-boundary-fixed-point-kappa11-non-automorphism">(C3)
Parabolic boundary fixed point (<span
class="math inline">\(\kappa&#39;(1)=1\)</span>, non-automorphism)</h3>
<div class="proof">
<p><em>Proof sketch.</em> <em>Setup.</em> Assume <span
class="math inline">\(\kappa(1)=1\)</span>, <span
class="math inline">\(\kappa&#39;(1)=1\)</span>, and <span
class="math inline">\(\kappa\)</span> is not an automorphism.</p>
<p><em>Koenigs linearization and one-step inequality.</em> Standard
boundary dynamics (Denjoy–Wolff theory) ensures <span
class="math inline">\(\kappa\)</span> is conjugate to a unit translation
on a right half-plane via a holomorphic change of variables (Koenigs
function) <span class="citation" data-cites="cowenmaccluer1995">(<a
href="#ref-cowenmaccluer1995" role="doc-biblioref">Cowen and MacCluer
1995</a>)</span>. In that model, the reciprocal horodisk height
increases by a fixed increment per iterate, which translates back to the
disk as the one-step logistic improvement <span
class="math display">\[H_1\big(\kappa(z)\big) \leq
\frac{H_1(z)}{1+\gamma\,H_1(z)}\]</span> for some <span
class="math inline">\(\gamma&gt;0\)</span> determined by higher-order
boundary data (e.g., second angular derivative) <span class="citation"
data-cites="mercer2018 osserman2000 unkelbach1938">(<a
href="#ref-mercer2018" role="doc-biblioref">Mercer 2018</a>; <a
href="#ref-osserman2000" role="doc-biblioref">Osserman 2000</a>; <a
href="#ref-unkelbach1938" role="doc-biblioref">Ünkelbach
1938</a>)</span>. Iterating telescopes to <span
class="math display">\[H_1\big(\kappa^{\circ \ell}(z)\big) \leq
\frac{H_1(z)}{1+\gamma\,\ell\,H_1(z)}.\]</span> ◻</p>
</div>
<div class="remark">
<p><strong>Remark 2</strong>. <em>The <span
class="math inline">\(O(1/\ell)\)</span> law is optimal in general for
the parabolic case; no geometric (exponential) rate exists without extra
structure.</em></p>
</div>
<h2 id="comparison-between-proofs">Comparison between proofs</h2>
<ul>
<li><p>Which “distance” shrinks?</p>
<ul>
<li><p><em>Elementary proof (my paper):</em> a Lyapunov potential like
<span class="math inline">\(\Phi(\rho)=\dfrac{|\rho|}{1-|\rho|}\)</span>
(or its centered-at-<span class="math inline">\(\rho^\star\)</span>
counterpart) tailored to the kernel subclass (non-negative power-series
coefficients).</p></li>
<li><p><em>Complex-analytic proof (this section):</em> the hyperbolic
distances <span
class="math inline">\(E_a=e^{d_{\mathbb{D}}(\cdot,a)}-1\)</span> for
interior fixed points and horodisk gauge <span
class="math inline">\(H_1\)</span> for boundary fixed points. These are
intrinsic, coordinate-free, and exactly preserved by
automorphisms.</p></li>
</ul></li>
<li><p>Contraction constants.</p>
<ul>
<li><p><em>Centered interior (C1):</em> complex analysis yields <span
class="math inline">\(\tfrac{1+\kappa&#39;(0)}{2}\)</span>, while my
Lyapunov proof gave <span
class="math inline">\(\tfrac{1}{2-\kappa&#39;(0)}\)</span>. For <span
class="math inline">\(\kappa&#39;(0)\in(0,1)\)</span> one has <span
class="math inline">\(\tfrac{1+\kappa&#39;(0)}{2}&gt;\tfrac{1}{2-\kappa&#39;(0)}\)</span>;
i.e., my kernel-specific bound is tighter here (thanks to the extra
positivity structure of coefficients).</p></li>
<li><p><em>Interior, non-centered (C4):</em> complex analysis gives the
clean, automorphism-invariant <span
class="math inline">\(\tfrac{1+\kappa&#39;(\rho^\star)}{2}\)</span> in
the right gauge <span class="math inline">\(E_{\rho^\star}\)</span>. The
elementary Euclidean-gauge bound had an extra term depending on <span
class="math inline">\(\kappa(0)\)</span>, and can become vacuous as
<span class="math inline">\(\kappa(0)\to0^{+}\)</span>. Using the
hyperbolic gauge removes that discontinuity.</p></li>
<li><p><em>Boundary, strictly attractive (C2):</em> Julia–Carathéodory
gives the <span>sharp</span> factor <span
class="math inline">\(\kappa&#39;(1)\)</span> in <span
class="math inline">\(H_1\)</span>. This matches the best you can hope
for.</p></li>
<li><p><em>Boundary, parabolic (C3):</em> both approaches yield the
optimal <span class="math inline">\(O(1/\ell)\)</span> law; the
complex-analytic route pinpoints the natural <span
class="math inline">\(H_1\)</span> gauge and ties <span
class="math inline">\(\gamma\)</span> to boundary data (angular
derivatives).</p></li>
</ul></li>
<li><p><span>Takeaway for practice.</span> If you want constants that:
(i) are <span>absolute</span> (depend only on <span
class="math inline">\(\kappa\)</span>, not on the starting point), (ii)
are <span>coordinate-free</span>, and (iii) extend verbatim to any
interior fixed point, use the hyperbolic/horodisk gauges. If you want
the very best constant in the <span>centered kernel subclass</span>, my
Hermite-based Lyapunov bound can be tighter, because it leverages
positivity of the series coefficients—structure not available to general
Schur maps.</p></li>
</ul>
<h2>References</h2>
<div id="refs" class="references csl-bib-body hanging-indent"
role="list">
<div id="ref-caratheodory1907" class="csl-entry" role="listitem">
Carathéodory, Constantin. 1907. <span>“<span>Ü</span>ber Den
Variabilit<span>ä</span>tsbereich Der Koeffizienten von Potenzreihen,
Die Gegebene Werte Nicht Annehmen.”</span> <em>Mathematische
Annalen</em> 64: 95–115.
</div>
<div id="ref-cowenmaccluer1995" class="csl-entry" role="listitem">
Cowen, Carl C., and Barbara D. MacCluer. 1995. <em>Composition Operators
on Spaces of Analytic Functions</em>. CRC Press.
</div>
<div id="ref-dieudonne1934" class="csl-entry" role="listitem">
Dieudonné, Jean. 1934. <span>“Sur Les Fonctions Holomorphes
Born<span>é</span>es Dans Le Disque Unit<span>é</span>.”</span>
<em>Comptes Rendus de l’Acad<span>é</span>mie Des Sciences de Paris</em>
198: 1327–29.
</div>
<div id="ref-joudaki2025aistats" class="csl-entry" role="listitem">
Joudaki, Amir, and Thomas Hofmann. 2025. <span>“Emergence of Globally
Attracting Fixed Points in Deep Neural Networks with Nonlinear
Activations.”</span> <em>Proceedings of the 28th International
Conference on Artificial Intelligence and Statistics (AISTATS)</em>.
</div>
<div id="ref-julia1918" class="csl-entry" role="listitem">
Julia, Gaston. 1918. <span>“M<span>é</span>moire Sur
l’it<span>é</span>ration Des Fonctions Rationnelles.”</span> <em>Journal
de Math<span>é</span>matiques Pures Et Appliqu<span>é</span>es</em>, 9e
s<span>é</span>rie, vol. 1: 47–245.
</div>
<div id="ref-mercer2018" class="csl-entry" role="listitem">
Mercer, Peter R. 2018. <span>“A Sharpened Schwarz Lemma at the
Boundary.”</span> <em>Complex Variables and Elliptic Equations</em> 63
(8): 1107–43.
</div>
<div id="ref-osserman2000" class="csl-entry" role="listitem">
Osserman, Robert. 2000. <span>“A Sharp Schwarz Lemma.”</span>
<em>Proceedings of the American Mathematical Society</em> 128 (12):
3513–17.
</div>
<div id="ref-poole2016exponential" class="csl-entry" role="listitem">
Poole, Ben, Subhaneil Lahiri, Maithra Raghu, Jascha Sohl-Dickstein, and
Surya Ganguli. 2016. <span>“Exponential Expressivity in Deep Neural
Networks Through Transient Chaos.”</span> <em>Advances in Neural
Information Processing Systems</em> 29.
</div>
<div id="ref-rogosinski1936" class="csl-entry" role="listitem">
Rogosinski, W. W. 1936. <span>“On the Maximum Modulus of Sections of
Power Series Bounded in the Unit Circle.”</span> <em>Proceedings of the
London Mathematical Society</em>, 2nd series, vol. 40: 263–76.
</div>
<div id="ref-unkelbach1938" class="csl-entry" role="listitem">
Ünkelbach, Hellmuth. 1938. <span>“<span>Ü</span>ber Das Schwarzsche
Lemma Und Die Randwerte Analytischer Funktionen.”</span>
<em>Mathematische Annalen</em> 115: 336–51.
</div>
</div>
