---
layout: distill
title: "The Dynamics of Signal Norms in Deep Networks"
description: "A theoretical exploration into the existence of activation functions with multiple norm-Stable fixed points"
giscus_comments: true
tags: deep-learning, theory, neural-networks, mean-field
date: 2025-07-01

authors:
  - name: Amir Joudaki
    affiliations:
      name: ETH, Zurich

bibliography: refs.bib

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

<div style="margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 8px; background: #fafafa;">
  <div style="margin-bottom: 15px;">
    <strong>Interactive Figure 1: Dynamics of Standard Activations</strong>
    <br><em>For standard activations, the map F(q) intersects the identity line at a single attracting fixed point, confirming they belong to Category 1. Use the controls to explore different parameter values.</em>
  </div>
  
  <div style="display: flex; gap: 15px; margin-bottom: 15px; flex-wrap: wrap; align-items: center; font-size: 0.9em;">
    <div>
      <label for="sigma-w-blog">σ_w²:</label>
      <input type="range" id="sigma-w-blog" min="0.1" max="5" step="0.1" value="1" style="width: 100px; margin: 0 5px;">
      <span id="sigma-w-value-blog">1.0</span>
    </div>
    <div>
      <label for="sigma-b-blog">σ_b²:</label>
      <input type="range" id="sigma-b-blog" min="0" max="3" step="0.1" value="0" style="width: 100px; margin: 0 5px;">
      <span id="sigma-b-value-blog">0.0</span>
    </div>
  </div>
  
  <div id="plot-blog" style="width: 100%; height: 450px;"></div>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/plotly.js/2.26.0/plotly.min.js"></script>
<script>
(function() {
  // Mathematical functions
  const gaussian = (x) => Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
  
  const erf = (x) => {
    const a1 =  0.254829592;
    const a2 = -0.284496736;
    const a3 =  1.421413741;
    const a4 = -1.453152027;
    const a5 =  1.061405429;
    const p  =  0.3275911;
    
    const sign = x >= 0 ? 1 : -1;
    x = Math.abs(x);
    
    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
    
    return sign * y;
  };
  
  const normalCDF = (x) => 0.5 * (1 + erf(x / Math.sqrt(2)));
  
  // Activation functions
  const activations = {
    'ReLU': {
      func: (x) => Math.max(0, x),
      color: '#e74c3c',
      integrationBounds: [0, 6]
    },
    'Tanh': {
      func: (x) => Math.tanh(x),
      color: '#3498db',
      integrationBounds: [-6, 6]
    },
    'Sigmoid': {
      func: (x) => 1 / (1 + Math.exp(-x)),
      color: '#2ecc71',
      integrationBounds: [-6, 6]
    },
    'GELU': {
      func: (x) => x * normalCDF(x),
      color: '#9b59b6',
      integrationBounds: [-6, 6]
    }
  };
  
  // Simpson's rule for numerical integration
  function simpsonsRule(f, a, b, n = 1000) {
    if (n % 2 === 1) n++;
    const h = (b - a) / n;
    let sum = f(a) + f(b);
    
    for (let i = 1; i < n; i++) {
      const x = a + i * h;
      sum += (i % 2 === 0 ? 2 : 4) * f(x);
    }
    
    return (h / 3) * sum;
  }
  
  // Calculate F(q) for a given activation function
  function calculateF(q, activationName, sigmaW2, sigmaB2) {
    if (q <= 0) return sigmaB2;
    
    const activation = activations[activationName];
    const sqrtQ = Math.sqrt(q);
    
    const integrand = (z) => {
      const input = sqrtQ * z;
      const output = activation.func(input);
      return output * output * gaussian(z);
    };
    
    const [a, b] = activation.integrationBounds;
    const integral = simpsonsRule(integrand, a, b, 1500);
    
    return sigmaW2 * integral + sigmaB2;
  }
  
  // Generate data for plotting
  function generatePlotData(sigmaW2, sigmaB2) {
    const qMin = 0;
    const qMax = 5.0;
    const numPoints = 100;
    const qValues = [];
    
    for (let i = 0; i <= numPoints; i++) {
      qValues.push(qMin + (i / numPoints) * (qMax - qMin));
    }
    
    const traces = [];
    
    for (const [name, activation] of Object.entries(activations)) {
      const fValues = qValues.map(q => calculateF(q, name, sigmaW2, sigmaB2));
      
      traces.push({
        x: qValues,
        y: fValues,
        mode: 'lines',
        name: `F(q) for ${name}`,
        line: {
          color: activation.color,
          width: 2.5
        }
      });
    }
    
    traces.push({
      x: qValues,
      y: qValues,
      mode: 'lines',
      name: 'y = q',
      line: {
        color: '#34495e',
        width: 2,
        dash: 'dash'
      }
    });
    
    return traces;
  }
  
  // Plot the data
  function plotData(traces) {
    const layout = {
      xaxis: {
        title: 'q',
        gridcolor: '#f0f0f0',
        range: [0, 5]
      },
      yaxis: {
        title: 'F(q)',
        gridcolor: '#f0f0f0',
        range: [0, 5]
      },
      plot_bgcolor: 'white',
      paper_bgcolor: 'white',
      showlegend: true,
      legend: {
        x: 0.02,
        y: 0.98,
        bgcolor: 'rgba(255,255,255,0.9)',
        bordercolor: '#ddd',
        borderwidth: 1
      },
      margin: { t: 20, b: 50, l: 60, r: 20 }
    };
    
    const config = {
      responsive: true,
      displayModeBar: false
    };
    
    Plotly.newPlot('plot-blog', traces, layout, config);
  }
  
  // Update plot
  function updatePlot() {
    const sigmaW2 = parseFloat(document.getElementById('sigma-w-blog').value);
    const sigmaB2 = parseFloat(document.getElementById('sigma-b-blog').value);
    
    const traces = generatePlotData(sigmaW2, sigmaB2);
    plotData(traces);
  }
  
  // Event listeners
  document.getElementById('sigma-w-blog').addEventListener('input', (e) => {
    document.getElementById('sigma-w-value-blog').textContent = e.target.value;
    updatePlot();
  });
  
  document.getElementById('sigma-b-blog').addEventListener('input', (e) => {
    document.getElementById('sigma-b-value-blog').textContent = e.target.value;
    updatePlot();
  });
  
  // Initial plot
  updatePlot();
})();
</script>

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
<p>
$$
f_k(x) =
\begin{cases}
c_k & \text{if } x \in S_k \\
0 & \text{otherwise}
\end{cases}
$$
</p>
Since the supports $S_k$ are disjoint, we have $f(x)^2 = \sum_{k=1}^N f_k(x)^2$. This orthogonality is key. The fixed-point equation $q = E[f(\sqrt{q}z)^2]$ becomes:
<p>
$$
q = \sum_{k=1}^N E[f_k(\sqrt{q}z)^2] = \sum_{k=1}^N c_k^2 \cdot P(\sqrt{q}z \in S_k)
$$
</p>
We choose our desired fixed points $q^\star_j$ and support intervals $S_k$ to be exponentially spaced, governed by a separation parameter $C > 2$:
1.  **Desired Fixed Points:** $q^\star_j = C^{2j}$ for $j=1, \ldots, N$.
2.  **Support Intervals:** $S_k = [\sqrt{q^\star_k}, 2\sqrt{q^\star_k}] = [C^k, 2C^k]$.

This choice ensures $S_j \cap S_k = \emptyset$ for $j \neq k$. To enforce that these $q^\star_j$ are indeed fixed points, the pulse heights $c_k^2$ must satisfy the following system of $N$ linear equations for each $j \in \{1, \ldots, N\}$:
<p>
$$
q^\star_j = \sum_{k=1}^N c_k^2 \cdot P(\sqrt{q^\star_j}z \in S_k)
$$
</p>
Let's define the vector of squared coefficients $\mathbf{c^2} = [c_1^2, \ldots, c_N^2]^T$ and the vector of fixed points $\mathbf{q^\star} = [q^\star_1, \ldots, q^\star_N]^T$. The system can be written in matrix form as $\mathbf{q^\star} = \mathbf{A} \mathbf{c^2}$, where the matrix entries $A_{jk}$ are:
<p>
$$
A_{jk} = P(\sqrt{q^\star_j}z \in S_k) = P(z \in [C^{k-j}, 2C^{k-j}]) = \Phi(2C^{k-j}) - \Phi(C^{k-j})
$$
</p>
where $\Phi$ is the CDF of the standard normal distribution.

#### Proof of Existence

To guarantee a unique, positive solution for $\mathbf{c^2}$ exists, the matrix $\mathbf{A}$ must be invertible. Let's analyze its entries in the limit of large separation, $C \to \infty$:
* **Diagonal elements ($j=k$):** $A_{jj} = \Phi(2) - \Phi(1) \approx 0.1359$.
* **Off-diagonal elements ($j \neq k$):** The term $C^{k-j}$ approaches either $\infty$ or $0$.
    * If $k > j$, then $C^{k-j} \to \infty$, and $A_{jk} \to \Phi(\infty) - \Phi(\infty) = 0$.
    * If $k < j$, then $C^{k-j} \to 0$, and $A_{jk} \to \Phi(0) - \Phi(0) = 0$.

Thus, as $C \to \infty$, $\mathbf{A}$ converges to a diagonal matrix with positive entries on the diagonal, rendering it strictly diagonally dominant and therefore invertible. This guarantees the existence of a unique solution for the coefficients $\mathbf{c^2}$ for a sufficiently large $C$. Since $N$ was chosen arbitrarily, we can construct an activation function with any number of fixed points.

<div style="margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 8px; background: #fafafa;">
  <div style="margin-bottom: 15px;">
    <strong>Interactive Figure 2: Constructed Activation with Multiple Stable Fixed Points</strong>
    <br><em>Explore how the number of fixed points (N) and separation constant (C) affect both the activation function shape and its fixed-point dynamics. The construction uses disjoint rectangular pulses to create multiple stable fixed points.</em>
  </div>
  
  <div style="display: flex; gap: 15px; margin-bottom: 15px; flex-wrap: wrap; align-items: center; font-size: 0.9em;">
    <div>
      <label for="n-points-blog">N (Fixed Points):</label>
      <input type="range" id="n-points-blog" min="2" max="6" step="1" value="3" style="width: 100px; margin: 0 5px;">
      <span id="n-value-blog">3</span>
    </div>
    <div>
      <label for="c-separation-blog">C (Separation):</label>
      <input type="range" id="c-separation-blog" min="2.1" max="4.0" step="0.1" value="2.5" style="width: 100px; margin: 0 5px;">
      <span id="c-value-blog">2.5</span>
    </div>
  </div>
  
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px;">
    <div id="activation-plot-blog" style="width: 100%; height: 400px; border: 1px solid #ddd; border-radius: 6px;"></div>
    <div id="fixedpoint-plot-blog" style="width: 100%; height: 400px; border: 1px solid #ddd; border-radius: 6px;"></div>
  </div>
  
  <div id="status-blog" style="margin-top: 15px; padding: 10px; border-radius: 4px; font-size: 0.9em;"></div>
</div>

<script>
(function() {
  // Mathematical utilities for constructed activation
  const erf2 = (x) => {
    const a1 =  0.254829592;
    const a2 = -0.284496736;
    const a3 =  1.421413741;
    const a4 = -1.453152027;
    const a5 =  1.061405429;
    const p  =  0.3275911;
    
    const sign = x >= 0 ? 1 : -1;
    x = Math.abs(x);
    
    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
    
    return sign * y;
  };
  
  const normalCDF2 = (x) => 0.5 * (1 + erf2(x / Math.sqrt(2)));
  const normalPDF2 = (x) => Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
  
  // Matrix operations
  function matrixInverse2(matrix) {
    const n = matrix.length;
    const augmented = matrix.map((row, i) => [...row, ...Array(n).fill(0).map((_, j) => i === j ? 1 : 0)]);
    
    // Gaussian elimination
    for (let i = 0; i < n; i++) {
      // Find pivot
      let pivotRow = i;
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(augmented[k][i]) > Math.abs(augmented[pivotRow][i])) {
          pivotRow = k;
        }
      }
      
      if (Math.abs(augmented[pivotRow][i]) < 1e-10) {
        throw new Error("Matrix is singular");
      }
      
      // Swap rows
      if (pivotRow !== i) {
        [augmented[i], augmented[pivotRow]] = [augmented[pivotRow], augmented[i]];
      }
      
      // Scale pivot row
      const pivot = augmented[i][i];
      for (let j = 0; j < 2 * n; j++) {
        augmented[i][j] /= pivot;
      }
      
      // Eliminate column
      for (let k = 0; k < n; k++) {
        if (k !== i) {
          const factor = augmented[k][i];
          for (let j = 0; j < 2 * n; j++) {
            augmented[k][j] -= factor * augmented[i][j];
          }
        }
      }
    }
    
    // Extract inverse matrix
    return augmented.map(row => row.slice(n));
  }
  
  function matrixVectorMultiply2(matrix, vector) {
    return matrix.map(row => row.reduce((sum, val, i) => sum + val * vector[i], 0));
  }
  
  // Simpson's rule for numerical integration
  function simpsonsRule2(f, a, b, n = 1000) {
    if (n % 2 === 1) n++;
    const h = (b - a) / n;
    let sum = f(a) + f(b);
    
    for (let i = 1; i < n; i++) {
      const x = a + i * h;
      sum += (i % 2 === 0 ? 2 : 4) * f(x);
    }
    
    return (h / 3) * sum;
  }
  
  class FixedPointFunction2 {
    constructor(N, C) {
      this.N = N;
      this.C = C;
      this.qStars = null;
      this.supports = null;
      this.coeffsSquared = null;
      this.coeffs = null;
      this.isValid = false;
      this.errorMessage = '';
      
      this.construct();
    }
    
    construct() {
      try {
        // Define fixed points and supports
        this.qStars = Array.from({length: this.N}, (_, k) => Math.pow(this.C, 2 * (k + 1)));
        this.supports = Array.from({length: this.N}, (_, k) => [
          Math.pow(this.C, k + 1),
          2 * Math.pow(this.C, k + 1)
        ]);
        
        // Build A matrix
        const A = Array(this.N).fill().map(() => Array(this.N).fill(0));
        for (let j = 0; j < this.N; j++) {
          const qStarJSqrt = Math.pow(this.C, j + 1);
          for (let k = 0; k < this.N; k++) {
            const lowerBound = this.supports[k][0] / qStarJSqrt;
            const upperBound = this.supports[k][1] / qStarJSqrt;
            A[j][k] = normalCDF2(upperBound) - normalCDF2(lowerBound);
          }
        }
        
        // Solve for coefficients
        const AInv = matrixInverse2(A);
        this.coeffsSquared = matrixVectorMultiply2(AInv, this.qStars);
        
        // Check if coefficients are positive
        if (this.coeffsSquared.some(c => c < 0)) {
          this.errorMessage = `Some coefficients are negative. Try increasing C > ${this.C.toFixed(1)}`;
          this.isValid = false;
          return;
        }
        
        this.coeffs = this.coeffsSquared.map(c => Math.sqrt(c));
        this.isValid = true;
        this.errorMessage = '';
        
      } catch (error) {
        this.errorMessage = `Construction failed: ${error.message}. Try increasing C.`;
        this.isValid = false;
      }
    }
    
    f(x) {
      if (!this.isValid) return 0;
      
      for (let k = 0; k < this.N; k++) {
        if (x >= this.supports[k][0] && x <= this.supports[k][1]) {
          return this.coeffs[k];
        }
      }
      return 0;
    }
    
    F(q) {
      if (!this.isValid || q <= 0) return 0;
      
      const sqrtQ = Math.sqrt(q);
      const integrand = (z) => {
        const input = sqrtQ * z;
        const output = this.f(input);
        return output * output * normalPDF2(z);
      };
      
      // Integration bounds based on support
      const yMin = this.supports[0][0] / sqrtQ;
      const yMax = this.supports[this.N - 1][1] / sqrtQ;
      
      return simpsonsRule2(integrand, yMin - 2, yMax + 2, 1000);
    }
  }
  
  function updateConstructedPlots() {
    const N = parseInt(document.getElementById('n-points-blog').value);
    const C = parseFloat(document.getElementById('c-separation-blog').value);
    
    const constructor = new FixedPointFunction2(N, C);
    const statusDiv = document.getElementById('status-blog');
    
    if (!constructor.isValid) {
      statusDiv.className = 'status error';
      statusDiv.style.background = '#f8d7da';
      statusDiv.style.color = '#721c24';
      statusDiv.style.border = '1px solid #f5c6cb';
      statusDiv.textContent = constructor.errorMessage;
      return;
    } else {
      statusDiv.className = 'status success';
      statusDiv.style.background = '#d4edda';
      statusDiv.style.color = '#155724';
      statusDiv.style.border = '1px solid #c3e6cb';
      statusDiv.textContent = `Successfully constructed activation with ${N} fixed points (C = ${C})`;
    }
    
    // Plot 1: Activation function f(x)
    const xMax = constructor.supports[N - 1][1] * 1.1;
    const xVals = [];
    const yVals = [];
    
    for (let i = 0; i <= 1000; i++) {
      const x = (i / 1000) * xMax;
      xVals.push(x);
      yVals.push(constructor.f(x));
    }
    
    const activationTrace = {
      x: xVals,
      y: yVals,
      mode: 'lines',
      name: 'f(x)',
      line: { color: '#2c3e50', width: 2.5 }
    };
    
    const activationLayout = {
      title: {
        text: `Constructed Activation f(x) (N=${N}, C=${C})`,
        font: { size: 14 }
      },
      xaxis: { title: 'x', gridcolor: '#f0f0f0' },
      yaxis: { title: 'f(x)', gridcolor: '#f0f0f0' },
      plot_bgcolor: 'white',
      paper_bgcolor: 'white',
      showlegend: false,
      margin: { t: 50, b: 50, l: 50, r: 20 }
    };
    
    Plotly.newPlot('activation-plot-blog', [activationTrace], activationLayout, {
      responsive: true,
      displayModeBar: false
    });
    
    // Plot 2: Fixed point map F(q)
    const qMax = constructor.qStars[N - 1] * 1.2;
    const qVals = [];
    const FVals = [];
    
    for (let i = 0; i <= 50; i++) {
      const logQ = Math.log10(0.1) + (i / 50) * (Math.log10(qMax) - Math.log10(0.1));
      const q = Math.pow(10, logQ);
      qVals.push(q);
      FVals.push(constructor.F(q));
    }
    
    const fMapTrace = {
      x: qVals,
      y: FVals,
      mode: 'lines',
      name: 'F(q)',
      line: { color: '#e74c3c', width: 2.5 }
    };
    
    const identityTrace = {
      x: qVals,
      y: qVals,
      mode: 'lines',
      name: 'y = q',
      line: { color: '#34495e', width: 2, dash: 'dash' }
    };
    
    const fixedPointsTrace = {
      x: constructor.qStars,
      y: constructor.qStars,
      mode: 'markers',
      name: 'Fixed Points',
      marker: { color: '#27ae60', size: 8, symbol: 'circle' }
    };
    
    const fixedPointLayout = {
      title: {
        text: `Fixed Point Dynamics (N=${N}, C=${C})`,
        font: { size: 14 }
      },
      xaxis: { 
        title: 'q (log scale)', 
        type: 'log',
        gridcolor: '#f0f0f0'
      },
      yaxis: { 
        title: 'F(q) (log scale)', 
        type: 'log',
        gridcolor: '#f0f0f0'
      },
      plot_bgcolor: 'white',
      paper_bgcolor: 'white',
      showlegend: true,
      legend: {
        x: 0.02,
        y: 0.98,
        bgcolor: 'rgba(255,255,255,0.9)',
        bordercolor: '#ddd',
        borderwidth: 1
      },
      margin: { t: 50, b: 50, l: 60, r: 20 }
    };
    
    Plotly.newPlot('fixedpoint-plot-blog', [fMapTrace, identityTrace, fixedPointsTrace], fixedPointLayout, {
      responsive: true,
      displayModeBar: false
    });
  }
  
  // Event listeners
  document.getElementById('n-points-blog').addEventListener('input', (e) => {
    document.getElementById('n-value-blog').textContent = e.target.value;
    updateConstructedPlots();
  });
  
  document.getElementById('c-separation-blog').addEventListener('input', (e) => {
    document.getElementById('c-value-blog').textContent = e.target.value;
    updateConstructedPlots();
  });
  
  // Initial plot
  updateConstructedPlots();
})();
</script>

#### A Remark on Stability

The fixed points we constructed are not just numerous, but also stable. The function $F(q)$ is analytic (infinitely differentiable) because it is the result of convolution with a Gaussian kernel. For a smooth function intersecting the identity line multiple times, a simple geometric argument implies that if $F^\prime(q) \neq 1$ at the intersections, then attracting ($\|F^\prime(q^\star)\| < 1$) and repelling ($\|F^\prime(q^\star)\| > 1$) fixed points must alternate. Our construction, with its step-like $F(q)$, ensures that at each engineered fixed point $q^\star_k$, the derivative $F^\prime(q^\star_k)$ is extremely close to zero, making them all strongly attracting.

---

### Conclusion and Future Directions

We have demonstrated that while common activation functions exhibit a single globally attracting fixed point for signal variance, it is possible to constructively design activation functions with an arbitrary number of stable fixed points. This finding moves the dynamics of signal norms from a "one-size-fits-all" regime to a rich landscape where the network's behavior can depend on the input's scale.

This opens several interesting avenues for future research:
* What are the sufficient conditions on an activation function $f$ that guarantee its corresponding map $F(q)$ has only one globally attracting fixed point? While conditions on $F(q)$ (e.g., convexity) are straightforward, mapping them back to simple properties of $f$ is non-trivial.
* Can we construct other families of multi-fixed-point activations, for example, with fixed points clustered in a finite interval like $[0, 1]$ instead of being exponentially spaced?

Interestingly, this rich, function-dependent behavior of **variance dynamics** stands in stark contrast to that of **covariance dynamics**. In a related work ("Emergence of Globally Attracting Fixed Points in Deep Neural Networks With Nonlinear Activations," AISTATS 2025), we show that if one considers the evolution of the *covariance* between two different inputs (assuming unit variance is maintained at each layer), the dynamical map *always* has a single, globally attracting fixed point. This universality holds for *any* non-linear activation function. This highlights a fascinating dichotomy: signal variance dynamics are customizable and activation-dependent, whereas signal covariance dynamics are universal and robust.