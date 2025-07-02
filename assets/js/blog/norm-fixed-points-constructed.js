// Constructed Activation Visualization for Norm Fixed Points Blog Post
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