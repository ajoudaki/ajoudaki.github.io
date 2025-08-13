---
layout: distill 
title: "From a Stochastic Traffic Jam to a Solvable PDE"
description: An exploration of how complex, random traffic flow can be described by a simple, solvable continuous model.
date: 2025-07-20
tags: stochastic-processes, pde, mean-field, asymptotic-analysis, traffic-flow
giscus_comments: true
related_publications: true
authors:
  - name: Amir Joudaki
    affiliations:
      name: ETH Zurich

toc:
  - name: "The Setup"
  - name: "The Continuous View"
  - name: "Deriving the Traffic Physics"
  - name: "The PDE Solution"
  - name: "Conclusion"
  - name: "An Interactive Visualization"

include_scripts:
  - "https://cdnjs.cloudflare.com/ajax/libs/plotly.js/2.26.0/plotly.min.js"

---

Complex systems composed of many interacting, random parts are ubiquitous in science and engineering. From statistical physics and neural networks analysis, to traffic flow on a highway and pedestrian crowds in a city, tracking each individual agent is often a hopeless task. The goal of theoretical modeling is to find a simpler, macroscopic law that governs the system's average behavior. This "mean-field" approach shifts our focus from the chaotic micro-scale to the predictable macro-scale.

This post tells the story of one such journey. We begin with a stochastic, discrete model of cars at intersections. This setup is quite difficult to analyze, mostly due to its infinite state space (the number of cars at various intersection points). We will then show how this system can be mapped to a continuous approximation, which, with one powerful physical assumption, can be described by a solvable Partial Differential Equation (PDE).

Our derivation will take us from a discrete, random process to a continuous, deterministic one, culminating in a closed-form solution that predicts how traffic queues form and grow over time. This journey is a microcosm of how theoretical physics and applied mathematics can be used to find order in chaos.

---

### The Setup

Let's begin by defining the system, first in its true discrete form and then in the continuous form that we will analyze.

**The Microscopic Model**

In reality, traffic is made of individual cars. Let's imagine a world where:
- We have a series of intersections, indexed $k=0, 1, 2, \ldots$.
- Time advances in discrete cycles, $t=1, 2, \ldots$.
- During each cycle, a fixed number of **$N$ cars** arrive at the first intersection.
- The capacity of each intersection $k$ is a random integer, $X_k^{\text{Disc}}(t)$, drawn uniformly from the set $\{0, 1, \ldots, N\}$. This represents the exact number of cars that can pass through.
- The number of cars in a queue or flowing past an intersection are, naturally, integers.

While this model is a perfect description of a simplified world, its discrete and combinatorial nature makes finding an analytical solution for the average queue length nearly impossible.

**The continuous relaxation**

To make the problem tractable, we shift our perspective from counting individual cars to measuring a continuous "traffic density". This is achieved through a series of approximations:

1.  **Normalizing by Maximum Capacity:** The key step is to scale all car counts by the maximum inflow/capacity, $N$. An inflow of $N$ cars is mapped to a normalized, continuous inflow of **1 unit**. The queues and flows in our model, $Q_k$ and $F_k$, are these normalized, continuous quantities.

2.  **Continuum Limit of Capacity:** A discrete capacity $X_k^{\text{Disc}} \in \{0, 1, \ldots, N\}$ becomes a normalized capacity $X_k = X_k^{\text{Disc}} / N$. As $N$ becomes large, the probability mass function of $X_k$ closely resembles a continuous uniform distribution. We therefore approximate it as $X_k(t) \sim \text{Unif}[0,1]$.

3.  **Continuous Space and Time:** Later, when we derive the PDE, we will also treat the discrete intersection index $k$ and the time step $t$ as continuous variables representing distance along the road and elapsed time.

This leads us to the continuous stochastic model that we will solve:
- **Inflow:** The first intersection ($k=0$) receives a deterministic inflow of **1 unit** of traffic density.
- **Capacity:** Each intersection $k$ has a random capacity for the cycle, $X_k(t) \sim \text{Unif}[0,1]$.
- **Outflow ($F_k$):** The outflow is the minimum of the capacity and the available traffic density.
- **Queue ($Q_k$):** Any available density that does not flow remains in the queue.

The dynamics of these continuous random variables are:
\begin{align}
F_k(t) &= \min(X_k(t), Q_k(t-1) + F_{k-1}(t)) \cr
Q_k(t) &= Q_k(t-1) + F_{k-1}(t) - F_k(t)
\end{align}
where $F_{-1}(t) \equiv 1$. 

**The Mean Field View**
Rather than focusing on the stochastic variables above, our goal is to find the expected queue length and expected outflow at time $t$ intersection $k$:

\begin{align}
&q_k(t) = E[Q_k(t)] && \text{expected queue length} \cr
&f_k(t) = E[F_k(t)] && \text{expected flow}
\end{align}

Note that this creates determinsitic variables for queue and flow that are deterministic, capturing the first order of the variables of interest. 

**The discrete conservation law:** We can make an important observation here that cars are neither created or destroyed at intersections, rather, they only can move from one intersection to the other. Thus, the discrete-time conservation law states that the change in the queue of an intersection, is equal to the difference between its outflow and inflow:

\begin{align}
q_k(t) - q_k(t-1) = f_{k-1}(t) - f_k(t)
\end{align}

---

### The Continuous View

The first step in taming this complexity is to move from a discrete-time model to a fully continuous one, treating the intersection index $k$ (as distance) and time $t$ as continuous variables.

**The conservation PDE.** The discrete-time conservation law can be approximated by a continuous Partial Differential Equation (PDE), were both time and intersection are approximated as continuous variables. The change in time becomes a time derivative, $\frac{\partial q}{\partial t}$, while the change across intersections becomes a spatial derivative (the net flow), $-\frac{\partial f}{\partial k}$. This gives the fundamental conservation law:

\begin{align}
\frac{\partial q(k,t)}{\partial t} = -\frac{\partial f(k,t)}{\partial k}
\end{align}

Despite its beautiful simplicity, this equation contains two unknown functions, $q(k,t)$ and $f(k,t)$. To solve it, we need to find a relationship between them—a "closure relation" that describes the physics of the traffic flow.

---

### Deriving the Traffic Physics

To solve the conservation law, we need a "closure relation"—a fundamental diagram—that connects the expected outflow $f(k,t)$ to the expected queue length $q(k,t)$. This relationship is the "physics" of our model. We derive it from the microscopic rules by making one powerful, physically-motivated assumption.

**The Key Assumption: Exponential Queues in Heavy Traffic**

Our system involves queues where inflow can be very close to the service capacity. In queueing theory, this is known as the **heavy-traffic regime**. A cornerstone result, the **heavy-traffic limit theorem** for G/G/1 queues, states that for a general queue approaching saturation, the distribution of the waiting time converges to an exponential distribution {% cite kingman1961 %}. By Little's Law, this implies that the **queue length $Q(k,t)$ itself is approximately exponentially distributed.** Since we are interested in the formation and growth of large queues, we are precisely in this regime.

We therefore model the continuous, normalized queue length $Q$ at any intersection as an exponential random variable with mean $q$, its expected value: $Q \sim \text{Exp}(1/q)$.

With this assumption, we can now derive the exact relationship between the expected queue length $q$ and the expected outflow $f$.

**The Fundamental Diagram: From Micro-rules to a Macro-law**

The expected outflow $f(q)$ is the expectation of the minimum of the available traffic (queue $Q$ + inflow $Y$) and the random capacity $X$:
$$f(q) = E[\min(X, Q + Y)]$$
where $X \sim \text{Unif}[0,1]$, $Y \sim \text{Unif}[0,1]$, and $Q \sim \text{Exp}(1/q)$ are mutually independent. We will now solve this expectation explicitly.

**Step 1: Conditioning on the Queue Length**

First, we compute the expectation over $X$ and $Y$ by conditioning on a fixed queue length $Q=z$. Let's call this conditional expectation $g(z)$:
$$g(z) = E_{X,Y}[\min(X, z+Y)] = \int_0^1 \int_0^1 \min(x, z+y) \,dx \,dy$$
The evaluation of this integral is split into two cases:
1.  **If $z \ge 1$:** Then $z+y \ge 1$ for all $y \in [0,1]$. Since $x \in [0,1]$, we always have $x \le z+y$, so $\min(x, z+y) = x$. The integral becomes $g(z) = \int_0^1 \int_0^1 x \,dx \,dy = \int_0^1 \frac{1}{2} \,dy = \frac{1}{2}$.
2.  **If $0 \le z < 1$:** The integral is more complex and evaluates to $g(z) = \frac{1}{3} + \frac{z}{2} - \frac{z^2}{2} + \frac{z^3}{6}$.

So, the conditional expectation is a piecewise function:
$$g(z) = \begin{cases} \frac{1}{3} + \frac{z}{2} - \frac{z^2}{2} + \frac{z^3}{6} & \text{if } 0 \le z < 1 \cr \frac{1}{2} & \text{if } z \ge 1 \end{cases}$$

**Step 2: Deriving the Exact Expression for $f(q)$**

Now, we find the total expectation $f(q)$ by averaging $g(z)$ over the exponential distribution of $Q$, whose PDF is $p_Q(z) = (1/q)e^{-z/q}$:
$$f(q) = \int_0^\infty g(z) p_Q(z) \,dz = \int_0^1 g(z) \frac{1}{q}e^{-z/q} \,dz + \int_1^\infty g(z) \frac{1}{q}e^{-z/q} \,dz$$
Substituting the expressions for $g(z)$:
$$f(q) = \underbrace{\int_0^1 \left(\frac{1}{3} + \frac{z}{2} - \frac{z^2}{2} + \frac{z^3}{6}\right) \frac{1}{q}e^{-z/q} \,dz}_{I_1} + \underbrace{\int_1^\infty \frac{1}{2} \frac{1}{q}e^{-z/q} \,dz}_{I_2}$$
The second integral $I_2$ is simple:
$$I_2 = \frac{1}{2} \left[-e^{-z/q}\right]_1^\infty = \frac{1}{2} \left(0 - (-e^{-1/q})\right) = \frac{1}{2}e^{-1/q}$$
The first integral $I_1$ requires repeated integration by parts, but yields a clean result:
$$I_1 = \left(\frac{1}{3} + \frac{q}{2} - q^2 + q^3\right) - \left(\frac{1}{2} + q^3\right)e^{-1/q}$$
Combining the two parts gives the exact, explicit formula for the expected outflow:
\begin{align}
f(q) &= I_1 + I_2 = \left(\frac{1}{3} + \frac{q}{2} - q^2 + q^3 - \left(\frac{1}{2} + q^3\right)e^{-1/q}\right) + \frac{1}{2}e^{-1/q} \cr
\implies \quad &\boxed{f(q) = \frac{1}{3} + \frac{q}{2} - q^2 + q^3 - q^3 e^{-1/q}}
\end{align}

**Step 3: The Heavy-Traffic Approximation**

While exact, this formula is too complex to yield a solvable PDE. However, we are interested in the heavy-traffic regime where queues are large ($q \to \infty$). We can find a simple and elegant approximation in this limit by performing a Taylor series expansion of our exact result. Let $x = 1/q$. As $q \to \infty$, $x \to 0$. The exponential term becomes:
$$e^{-1/q} = e^{-x} \approx 1 - x + \frac{x^2}{2} - \frac{x^3}{6} + \frac{x^4}{24} - O(x^5)$$
Substituting this into the term $q^3 e^{-1/q}$:
\begin{align}
q^3 e^{-1/q} &= \frac{1}{x^3} e^{-x} \approx \frac{1}{x^3} \left(1 - x + \frac{x^2}{2} - \frac{x^3}{6} + \frac{x^4}{24}\right) \cr
&= \frac{1}{x^3} - \frac{1}{x^2} + \frac{1}{2x} - \frac{1}{6} + \frac{x}{24}
\end{align}
Now, substitute this back into our exact formula for $f(q)$, replacing the other terms with their equivalents in $x$:
\begin{align}
f(q) &= \left(\frac{1}{3} + \frac{1}{2x} - \frac{1}{x^2} + \frac{1}{x^3}\right) - q^3 e^{-1/q} \cr
&\approx \left(\frac{1}{3} + \frac{1}{2x} - \frac{1}{x^2} + \frac{1}{x^3}\right) - \left(\frac{1}{x^3} - \frac{1}{x^2} + \frac{1}{2x} - \frac{1}{6} + \frac{x}{24}\right) \cr
&= \frac{1}{3} + \frac{1}{6} - \frac{x}{24} = \frac{1}{2} - \frac{x}{24}
\end{align}
Replacing $x=1/q$, we arrive at the crucial asymptotic relationship for our fundamental diagram:

$$f(q) \approx \frac{1}{2} - \frac{1}{24q}$$

This simple law governs the physics of our traffic system in the heavy-traffic limit. The flow is slightly less than the average capacity ($1/2$) due to coordination failures, and the deficit is inversely proportional to the queue length.

**The Heavy-Traffic PDE**

We can now complete our model by substituting this physical law back into the conservation equation derived earlier:
$$\frac{\partial q}{\partial t} = -\frac{\partial f}{\partial k}$$
Using the chain rule, $\frac{\partial f}{\partial k} = \frac{df}{dq} \frac{\partial q}{\partial k}$:
$$\frac{df}{dq} = \frac{d}{dq} \left(\frac{1}{2} - \frac{1}{24q}\right) = \frac{1}{24q^2}$$
Substituting this gives the final PDE that governs the evolution of the expected queue length:
\begin{align}\tag{heavy traffic PDE}
\boxed{\frac{\partial q}{\partial t} = -\frac{1}{24q^2}\frac{\partial q}{\partial k}}
\end{align}

This is a nonlinear advection equation where the "velocity" of queue information propagation, $c(q) = 1/(24q^2)$, depends on the queue length itself.

**Historical note:**
It was only after deriving this equation from first principles that I discovered its deep connections to a classic line of research in traffic theory. The fundamental conservation law, $\frac{\partial q}{\partial t} + \frac{\partial f}{\partial k} = 0$, is the cornerstone of the celebrated **Lighthill-Whitham-Richards (LWR) model**, independently proposed in the mid-1950s {% cite lighthill1955 richards1956 %}. The LWR model is the foundation of macroscopic traffic flow theory. Different traffic models are often distinguished by their "fundamental diagram"—the specific choice of the closure relation $f(q)$. Our result, $f(q) \approx \frac{1}{2} - \frac{1}{24q}$, can be seen as a new fundamental diagram, derived not from empirical data, but from the microscopic stochastic rules of our system. It’s a humbling and fascinating experience to see how a simple, bottom-up model can independently rediscover and fit into a decades-old theoretical framework.

---

### The PDE Solution

We now present the complete, first-principles solution to the PDE $\frac{\partial q}{\partial t} = -\frac{1}{24q^2}\frac{\partial q}{\partial k}$ with the initial condition that all queues are empty, $q_k(0)=0$.

**Step 1: The Ansatz.** We assume a solution of the form $q(k,t) = c(k)\sqrt{t}$, which separates the variables. Substituting this into the PDE yields:

\begin{align}
\frac{c(k)}{2\sqrt{t}} &= -\frac{1}{24(c(k)\sqrt{t})^2} \left(\frac{d c(k)}{dk}\sqrt{t}\right) \cr
&= -\frac{c'(k)}{24c(k)^2\sqrt{t}}
\end{align}

**Step 2: Solving for the Coefficient Function $c(k)$.** The time dependence cancels, leaving a separable ODE for $c(k)$:

\begin{align}
12c(k)^3 &= -c'(k) \cr
-12\,dk &= \frac{dc}{c^3}
\end{align}

Integrating both sides:

\begin{align}
\int -12\,dk &= \int c^{-3}\,dc \cr
-12k + A &= \frac{c^{-2}}{-2} \cr
c(k)^2 &= \frac{1}{24k - 2A} \cr
c(k) &= \frac{1}{\sqrt{24k + B}}
\end{align}

where $B=-2A$ is the constant of integration.

**Step 3: Applying the Boundary Condition.** To find the constant $B$, we must match our continuous solution to the known behavior of the first intersection ($k=1$). Its dynamics are described by the discrete-time ODE using our derived physics:

$$\frac{dq_1}{dt} = f_0 - f_1 \approx \frac{1}{2} - \left(\frac{1}{2} - \frac{1}{24q_1}\right) = \frac{1}{24q_1}$$

Solving this ODE for $q_1(t)$ with the initial condition $q_1(0)=0$:

\begin{align}
24q_1\,dq_1 &= dt \cr
\int_0^{q_1(t)} 24q_1'\,dq_1' &= \int_0^t d\tau \cr
12q_1(t)^2 &= t
\end{align}

This proves that $q_1(t) = \sqrt{t/12}$. Therefore, our coefficient function must satisfy $c(1) = 1/\sqrt{12}$:

\begin{align}
c(1) &= \frac{1}{\sqrt{12}} \cr
\left(\frac{1}{\sqrt{12}}\right)^2 &= \frac{1}{24(1)+B} \cr
\frac{1}{12} &= \frac{1}{24+B} \cr
B &= -12
\end{align}

**Step 4: Final Solution for Queue Length.** With the constant $B$ determined, we have the complete solution for the expected queue length in the *normalized* system:

<p>$$\boxed{q(k,t) = \sqrt{\frac{t}{24k-12}}}$$</p>

The expected outflow in the normalized system is:

\begin{align}
\boxed{f(k,t) = \frac{1}{2} - \frac{\sqrt{24k-12}}{24\sqrt{t}}}
\end{align}

---

### An Interactive Visualization

The following interactive visualization allows you to test our theory. You can set the discrete inflow/capacity parameter $N$. The simulation will run the full discrete model with integer car counts. The theoretical prediction, derived from the continuous model, is then scaled by $N$ for a direct comparison. Notice how the theory becomes more accurate for larger $N$. 🚦🚗

<div id="pde-traffic-visualization" class="l-body">
    <div id="queue-plot" style="height: 400px; display: inline-block; width: 49%;"></div>
    <div id="flow-plot" style="height: 400px; display: inline-block; width: 49%;"></div>
</div>

<div style="margin: 20px 0;">
    <label>Intersections: <input type="number" id="numIntersections" value="4" min="2" max="6" style="width: 60px;"/></label>
    <label>Time: <input type="number" id="numTimesteps" value="100" min="10" max="500" style="width: 80px;"/></label>
    <label>Inflow (N): <input type="number" id="maxInflowN" value="10" min="10" max="1000" style="width: 80px;"/></label>
    <label>Simulations: <input type="number" id="numRuns" value="20000" min="100" max="100000" style="width: 80px;"/></label>
    <button onclick="updatePlots()" style="margin-left: 10px;">Run Simulation</button>
</div>

<script>
// Wait for Plotly to load
function waitForPlotly(callback) {
    if (typeof Plotly !== 'undefined') {
        callback();
    } else {
        setTimeout(() => waitForPlotly(callback), 100);
    }
}

waitForPlotly(() => {
    const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

    window.simulateTraffic = function(numIntersections, numTimesteps, numRuns, N) {
        const qSum = Array(numIntersections).fill(null).map(() => Array(numTimesteps).fill(0));
        const fSum = Array(numIntersections).fill(null).map(() => Array(numTimesteps).fill(0));
        
        for (let run = 0; run < numRuns; run++) {
            // These arrays will hold integer car counts
            const q = Array(numIntersections).fill(null).map(() => Array(numTimesteps + 1).fill(0));
            const f = Array(numIntersections).fill(null).map(() => Array(numTimesteps).fill(0));
            
            for (let t = 0; t < numTimesteps; t++) {
                // Discrete capacity from {0, 1, ..., N}
                const cap = Array(numIntersections).fill(0).map(() => Math.floor(Math.random() * (N + 1)));
                for (let k = 0; k < numIntersections; k++) {
                    // Inflow is N for the first intersection
                    const avail = q[k][t] + (k === 0 ? N : f[k-1][t]);
                    f[k][t] = Math.min(cap[k], avail);
                    q[k][t + 1] = avail - f[k][t];
                }
            }
            
            for (let k = 0; k < numIntersections; k++) {
                for (let t = 0; t < numTimesteps; t++) {
                    qSum[k][t] += q[k][t + 1];
                    fSum[k][t] += f[k][t];
                }
            }
        }
        
        return {
            queue: qSum.map(row => row.map(val => val / numRuns)),
            flow: fSum.map(row => row.map(val => val / numRuns))
        };
    }

    function theoreticalPred(m, times, N) {
        // Calculate the normalized theoretical prediction and scale it by N
        const qT = Array(m).fill(null).map(() => Array(times.length).fill(0));
        const fT = Array(m).fill(null).map(() => Array(times.length).fill(0));
        
        for (let t_idx = 0; t_idx < times.length; t_idx++) {
            const time = times[t_idx];
            for (let k = 1; k <= m; k++) {
                if (24 * k - 12 > 0) {
                    const norm_q = Math.sqrt(time / (24 * k - 12));
                    const norm_f = 0.5 - Math.sqrt(24 * k - 12) / (24 * Math.sqrt(time));
                    qT[k - 1][t_idx] = N * norm_q;
                    fT[k - 1][t_idx] = N * norm_f;
                }
            }
        }
        return { queue: qT, flow: fT };
    }

    window.updatePlots = function() {
        const m = parseInt(document.getElementById('numIntersections').value);
        const d = parseInt(document.getElementById('numTimesteps').value);
        const r = parseInt(document.getElementById('numRuns').value);
        const N = parseInt(document.getElementById('maxInflowN').value);
        
        const sim = simulateTraffic(m, d, r, N);
        const times = Array.from({length: d}, (_, i) => i + 1);
        const theory = theoreticalPred(m, times, N);
        
        const qTraces = [];
        const fTraces = [];
        
        for (let k = 1; k < m; k++) {
            const col = colors[k-1];
            qTraces.push(
                {x: times, y: sim.queue[k], name: `I.${k+1} (M.C.)`, line: {color: col, width: 2.5}},
                {x: times, y: theory.queue[k], name: `I.${k+1} (Th.)`, line: {color: col, dash: 'dash'}}
            );
            
            // Compare flow to the theoretical steady state of N/2
            const steadyStateFlow = N / 2;
            const fDistSim = sim.flow[k].map(v => Math.abs(steadyStateFlow - v));
            const fDistTheory = theory.flow[k].map(v => Math.abs(steadyStateFlow - v));
            fTraces.push(
                {x: times, y: fDistSim, name: `I.${k+1}`, line: {color: col, width: 2.5}, showlegend: false},
                {x: times, y: fDistTheory, line: {color: col, dash: 'dash'}, showlegend: false}
            );
        }
        
        const layoutQueue = {
            xaxis: {title: 'Time (cycles)'},
            yaxis: {title: 'Expected Queue (cars)'},
            title: 'Queue Length Evolution',
            margin: {t: 40, b: 40, l: 60, r: 20},
            legend: { y: 0.95, x: 0.05 }
        };
        
        const layoutFlow = {
            xaxis: {title: 'Time (cycles)', type: 'log'},
            yaxis: {title: 'Distance to Steady State (cars)', type: 'log'},
            title: 'Flow Rate Convergence',
            margin: {t: 40, b: 40, l: 60, r: 20}
        };
        
        Plotly.newPlot('queue-plot', qTraces, layoutQueue, {responsive: true, displayModeBar: false});
        Plotly.newPlot('flow-plot', fTraces, layoutFlow, {responsive: true, displayModeBar: false});
    }

    updatePlots();
});
</script>

---

### Conclusion

This journey, from a complex stochastic model of individual cars and intersections to a simple, elegant closed-form solution, showcases the power of mean field modeling. By starting with a discrete world, abstracting it into a continuous one, and making a physically motivated mean-field assumption, we are able to derive a continuous model that accurately captures the long-term behavior of the entire traffic system. 

The final equations reveal a clear picture: queue lengths at each intersection grow with the square root of time, while the outflow slowly approaches the steady-state value of $N/2$, with both dynamics governed by the intersection's position along the road. This elegant mathematical structure emerges from what initially appeared to be intractable stochastic chaos, demonstrating the profound insights that can be gained into traffic dynamics through careful theoretical analysis.

**Limitations and unanswered questions:**
Despite the progress we made, there are quite a few open questions that I could not answer. For example, we only analyzed the mean of the stochastic process (the mean flow) and not the fluctuations, or deviations from this mean in our model. Another point of discussion is the central assumption that the queue length distribution is exponential. While our model's components (e.g., uniform service time) do not form a classical M/M/1 queue, this assumption is strongly justified by the **heavy-traffic limit theorem** in queueing theory {% cite kingman1961 %}. This theorem states that for general queues near saturation, the queue length distribution does converge to an exponential one. Our analysis for large queues operates precisely in this regime, lending strong theoretical support to our model. A formal proof of convergence for our specific iterative system, however, remains a topic for future work.


## References

{% bibliography --cited %}