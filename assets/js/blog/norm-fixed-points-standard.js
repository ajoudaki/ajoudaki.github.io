// Standard Activations Visualization for Norm Fixed Points Blog Post
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