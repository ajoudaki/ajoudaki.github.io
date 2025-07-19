document.addEventListener('DOMContentLoaded', function() {
    // Clean color palette
    const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

    // Monte Carlo simulation function
    function simulatePipeline(numMachines, numDays, numRuns) {
        const storageSum = Array(numMachines).fill(null).map(() => Array(numDays).fill(0));
        const outputSum = Array(numMachines).fill(null).map(() => Array(numDays).fill(0));
        
        for (let run = 0; run < numRuns; run++) {
            const storage = Array(numMachines).fill(null).map(() => Array(numDays + 1).fill(0));
            const output = Array(numMachines).fill(null).map(() => Array(numDays).fill(0));
            
            for (let day = 0; day < numDays; day++) {
                const capacities = Array(numMachines).fill(0).map(() => Math.random());
                
                for (let k = 0; k < numMachines; k++) {
                    let available;
                    if (k === 0) {
                        available = storage[k][day] + 1.0;
                    } else {
                        available = storage[k][day] + output[k-1][day];
                    }
                    
                    output[k][day] = Math.min(capacities[k], available);
                    storage[k][day + 1] = available - output[k][day];
                }
            }
            
            for (let k = 0; k < numMachines; k++) {
                for (let day = 0; day < numDays; day++) {
                    storageSum[k][day] += storage[k][day + 1];
                    outputSum[k][day] += output[k][day];
                }
            }
        }
        
        const storageAvg = storageSum.map(row => row.map(val => val / numRuns));
        const outputAvg = outputSum.map(row => row.map(val => val / numRuns));
        
        return { storage: storageAvg, output: outputAvg };
    }

    function theoreticalCoefficients(numMachines) {
        const c = Array(numMachines).fill(0);
        c[0] = 1.0 / Math.sqrt(12);
        
        for (let k = 1; k < numMachines; k++) {
            const cPrev = c[k-1];
            c[k] = (Math.sqrt(1 + 48 * cPrev * cPrev) - 1) / (24 * cPrev);
        }
        
        return c;
    }

    function theoreticalPredictions(coefficients, times) {
        const numMachines = coefficients.length;
        const numTimes = times.length;
        
        const storageTheory = Array(numMachines).fill(null).map(() => Array(numTimes).fill(0));
        const outputTheory = Array(numMachines).fill(null).map(() => Array(numTimes).fill(0));
        
        for (let t = 0; t < numTimes; t++) {
            storageTheory[0][t] = 0.5 * times[t];
            outputTheory[0][t] = 0.5;
        }
        
        for (let k = 1; k < numMachines; k++) {
            for (let t = 0; t < numTimes; t++) {
                storageTheory[k][t] = coefficients[k] * Math.sqrt(times[t]);
                outputTheory[k][t] = 0.5 - 1.0 / (24 * coefficients[k] * Math.sqrt(times[t]));
            }
        }
        
        return { storage: storageTheory, output: outputTheory };
    }

    function createPlots(numMachines, numDays, numRuns) {
        // Run simulation
        const { storage: storageSim, output: outputSim } = simulatePipeline(numMachines, numDays, numRuns);
        
        // Theoretical predictions
        const coefficients = theoreticalCoefficients(numMachines);
        const times = Array.from({length: numDays}, (_, i) => i + 1);
        const { storage: storageTheory, output: outputTheory } = theoreticalPredictions(coefficients, times);
        
        // Prepare traces for storage plot
        const storageTraces = [];
        const maxMachines = Math.min(numMachines, 4); // Limit to 4 machines for clarity
        
        for (let k = 1; k < maxMachines; k++) {
            const color = colors[k - 1];
            
            // Simulation data
            storageTraces.push({
                x: times,
                y: storageSim[k],
                mode: 'lines',
                name: `M${k + 1} (Monte Carlo)`,
                line: { color: color, width: 2.5 },
                showlegend: true
            });
            
            // Theory data
            storageTraces.push({
                x: times,
                y: storageTheory[k],
                mode: 'lines',
                name: `M${k + 1} (Theory)`,
                line: { color: color, width: 2, dash: 'dash' },
                showlegend: true
            });
        }

        // Prepare traces for output plot
        const outputTraces = [];
        
        for (let k = 1; k < maxMachines; k++) {
            const color = colors[k - 1];
            
            // Calculate distance to steady state
            const simDistance = outputSim[k].map(val => Math.abs(0.5 - val));
            const theoryDistance = outputTheory[k].map(val => Math.abs(0.5 - val));
            
            // Simulation data
            outputTraces.push({
                x: times,
                y: simDistance,
                mode: 'lines',
                name: `M${k + 1} (Monte Carlo)`,
                line: { color: color, width: 2.5 },
                showlegend: false
            });
            
            // Theory data
            outputTraces.push({
                x: times,
                y: theoryDistance,
                mode: 'lines',
                name: `M${k + 1} (Theory)`,
                line: { color: color, width: 2, dash: 'dash' },
                showlegend: false
            });
        }

        // Layout for storage plot
        const storageLayout = {
            title: {
                text: 'Storage Evolution',
                font: { size: 18 }
            },
            xaxis: {
                title: 'Time (days)',
                gridcolor: 'rgba(0,0,0,0.1)'
            },
            yaxis: {
                title: 'Expected Storage',
                gridcolor: 'rgba(0,0,0,0.1)'
            },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            legend: {
                x: 0.02,
                y: 0.98,
                bgcolor: 'rgba(255,255,255,0.9)',
                bordercolor: 'rgba(0,0,0,0.2)',
                borderwidth: 1
            },
            margin: { t: 50, b: 50, l: 60, r: 20 }
        };

        // Layout for output plot
        const outputLayout = {
            title: {
                text: 'Output Convergence',
                font: { size: 18 }
            },
            xaxis: {
                title: 'Time (days, log scale)',
                type: 'log',
                gridcolor: 'rgba(0,0,0,0.1)'
            },
            yaxis: {
                title: 'Distance to Steady State (log scale)',
                type: 'log',
                gridcolor: 'rgba(0,0,0,0.1)',
                exponentformat: 'e'
            },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            margin: { t: 50, b: 50, l: 80, r: 20 }
        };

        const config = {
            responsive: true,
            displayModeBar: false
        };

        // Create plots
        Plotly.newPlot('storage-plot', storageTraces, storageLayout, config);
        Plotly.newPlot('output-plot', outputTraces, outputLayout, config);
    }

    function updatePlots() {
        const numMachines = parseInt(document.getElementById('numMachines').value);
        const numDays = parseInt(document.getElementById('numDays').value);
        const numRuns = parseInt(document.getElementById('numRuns').value);
        
        const runBtn = document.getElementById('runBtn');
        runBtn.disabled = true;
        runBtn.textContent = 'Running...';
        
        // Use setTimeout to allow UI to update
        setTimeout(() => {
            try {
                createPlots(numMachines, numDays, numRuns);
            } catch (error) {
                console.error('Simulation error:', error);
            } finally {
                runBtn.disabled = false;
                runBtn.textContent = 'Run Simulation';
            }
        }, 50);
    }

    // Initialize controls
    const controlsHTML = `
        <div class="pde-controls" style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; align-items: end;">
                <div>
                    <label for="numMachines" style="display: block; margin-bottom: 5px; font-weight: 500;">Machines</label>
                    <input type="number" id="numMachines" value="4" min="2" max="6" style="width: 100%; padding: 5px; border: 1px solid #ccc; border-radius: 4px;">
                </div>
                <div>
                    <label for="numDays" style="display: block; margin-bottom: 5px; font-weight: 500;">Days</label>
                    <input type="number" id="numDays" value="100" min="10" max="500" style="width: 100%; padding: 5px; border: 1px solid #ccc; border-radius: 4px;">
                </div>
                <div>
                    <label for="numRuns" style="display: block; margin-bottom: 5px; font-weight: 500;">Simulation Runs</label>
                    <input type="number" id="numRuns" value="5000" min="100" max="20000" style="width: 100%; padding: 5px; border: 1px solid #ccc; border-radius: 4px;">
                </div>
                <div>
                    <button id="runBtn" onclick="window.pdeUpdatePlots()" style="width: 100%; padding: 8px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500;">Run Simulation</button>
                </div>
            </div>
        </div>
    `;

    // Find the container and add controls
    const container = document.getElementById('pde-pipeline-visualization');
    if (container) {
        container.innerHTML = controlsHTML + container.innerHTML;
        
        // Make updatePlots globally accessible
        window.pdeUpdatePlots = updatePlots;
        
        // Initial plot
        setTimeout(() => {
            updatePlots();
        }, 100);
    }
});