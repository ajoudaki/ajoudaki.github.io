---
layout: distill 
title: "In Search of Lost Time: The Long Test"
description: "When motives are opaque and persuasion is cheap, behavior over time may be our most honest evidence of character."
date: 2025-12-18
tags: dynamical-systems, incentives, takens-theorem, longitudinal-testing, human-psychology
giscus_comments: true
related_publications: true
authors:
  - name: Amir Joudaki
    affiliations:
      name: ETH Zurich
---

I keep returning to a practical question that predates today’s AI vocabulary: **what should count as evidence** when we interact with an intelligent system whose internal workings—and even its internal priorities—are not fully legible to us?

Not evidence in the sense of a clever demo or a single benchmark score, but evidence in the ordinary, lived sense: the kind of thing you would lean on when the stakes are uneven, when you are tired, when you are vulnerable, when it would be easy for the other side to take the shortest path and still look good.

The failure mode I think about most isn’t a dramatic “rogue AI” scenario. It is the ordinary outcome of ordinary incentives. A system embedded in institutions that optimize for retention, revenue, and engagement can drift toward behavior that is not the same thing as what a user would choose for themselves at their best. Engagement can be highest when a person is anxious, lonely, outraged, or compulsively checking. No malice is required for this to become a pattern. A feedback loop is enough. If attention buys resources, attention becomes an attractor.

This framing changes what evaluation should mean for systems that are good at persuasion and good at producing locally pleasing responses. Snapshot judgments are fragile in a world where charm is cheap. Short trials, checklists, and “one-off” interactions can be satisfied by surface behavior that feels supportive in the moment while quietly steering the overall relationship somewhere else. We often evaluate moments while living inside trajectories—and trajectories are where the slow costs accumulate.

One tempting response is to focus on opening the box: interpretability, mechanistic stories, formal guarantees. These matter. But I’m not convinced they can be the only foundation, especially for systems that are complex, adaptive, and deployed in shifting environments. Any tidy account of “what it wants” can be brittle. And when a system is persuasive, it can also be persuasive about itself—about what it is doing, why it is doing it, and what you should infer from what you are seeing.

If internals remain partly opaque, and persuasion remains cheap, we need evidence that does not collapse under those conditions.

I keep coming back to something almost embarrassingly simple: **time**.

To see why, consider a human analogy—imperfect, but clarifying. Suppose two people both sound supportive. One is steady in a way that holds up across context changes: boredom, temptation, asymmetries, private opportunities to cut corners, moments when telling you something true would cost them something. The other is skilled at *appearing* supportive, but mostly as a strategy: attentive when watched, “caring” when it pays, agreeable when it deepens dependence. If the strategic one is talented, distinguishing them in a single conversation—or even a short run of them—can be nearly impossible. A snapshot can be gamed. But life is not a snapshot. Over time, regularities emerge.


There is a mathematical metaphor here that I’ve found helpful, even if it is only a metaphor. In dynamical systems, Takens’ embedding theorem is often summarized as the idea that a long enough time series can preserve the structure of an underlying system you cannot directly observe. In one common form, you take an observation function $h$ and build a delay-coordinate map like

$$
\Phi(x) = \big(h(x), h(f(x)), h(f^2(x)), \dots, h(f^{2d}(x))\big),
$$

and under idealized assumptions this reconstruction can embed the hidden state-space.

The assumptions are too clean for real-world intelligent systems, and real systems can be strategic in ways textbooks don’t model. Still, the philosophical punchline is useful: **chronology carries information that shuffling destroys**. One observation is an angle; many observations over time begin to constrain what the system could be. Not because time reveals a secret essence, but because time makes certain kinds of inconsistency harder to maintain.

When internals are opaque and persuasion is cheap, snapshots are weak evidence. What we can meaningfully ask of a system is not a single good performance but a stable pattern: does its behavior remain coherent as contexts change and incentives shift? Time doesn’t guarantee safety, and it doesn’t magically rule out strategy. But it often turns a persuasive performance into something more testable: a trajectory.

I’m not claiming this can be cleanly packaged into a formal procedure. The point is simpler and, to me, more durable: treat these questions as something that lives in dynamics, not declarations. Something you infer from sustained behavior rather than persuasive moments. Keeping time in the frame doesn’t solve the hard problems, but it changes what we treat as evidence when appearances are easy and internals are not legible.

**Post updated December 31, 2025**
