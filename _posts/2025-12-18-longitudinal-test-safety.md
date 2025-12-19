---
layout: distill 
title: "In Search of Lost Time: The Longitudinal Alignment"
description: "When understanding AI internals is fragile, watching behavior over time may be our most honest evidence of safety."
date: 2025-12-18
tags: dynamical-systems, ai-safety, takens-theorem, longitudinal-testing
giscus_comments: true
related_publications: true
authors:
  - name: Amir Joudaki
    affiliations:
      name: ETH Zurich


---

<!-- ## Introduction -->

I've been thinking for a long time about what it would actually mean to be safe around AI systems that are much more intelligent than we are. My suspicion is that any plan centered on "understanding what's inside the model" will eventually crack. Modern systems are too complex for any tidy account of motives, and a sufficiently capable system could also shape what we learn about it—by selective honesty, misdirection, or simply telling us what we want to hear.

Part of why this feels hard is that we keep misplacing the very thing that makes trust legible: **time**. In many AI training and evaluation paradigms, long horizons are treated as noise to be averaged away. We shuffle data until chronology vanishes, reduce behavior to benchmark snapshots, and run short red-team sprints that reward surface compliance. We end up testing moments while deploying trajectories.

So I keep returning to a simpler idea: if the inside is opaque and persuasion is cheap, then the most honest evidence we can demand is **a long record of behavior under varied conditions**. Call it a *longitudinal alignment* test.

To see what I mean, start with a human case. Suppose two people, A and B, both seem nice. A is genuinely prosocial. B is strategic—pleasant when it pays, agreeable when watched, considerate when convenient. If B is talented, distinguishing them in a single conversation or a brief trial can be nearly impossible. A snapshot can be gamed.

But life is not a snapshot. Let A and B interact with others for a long time. Let the situations change: success, boredom, envy, loss, temptation, anonymity, fatigue, status. Over time, the performance becomes expensive. Inconsistencies appear. Corners get cut. The mask slips—not necessarily in a dramatic reveal, but in a pattern you could not reliably see from a single frame. In practice, "being nice for an indefinitely long time" begins to function as an operational definition of "being truly nice," not because we've solved metaphysics, but because whatever hidden ugliness remains forever hidden is, for practical purposes, inert.

This intuition has a rigorous cousin in dynamical systems theory.

<!-- ## Takens' Embedding Theorem -->

**Takens' embedding theorem** is, in essence, a statement about how much structure can be recovered from a long enough sequence of observations. One common form is:

> Let $$M$$ be a compact smooth manifold of dimension $$d$$, let $$f: M \to M$$ be a smooth dynamical system (a diffeomorphism), and let $$h: M \to \mathbb{R}$$ be a "generic" smooth observation function. Define the delay-coordinate map
> 
> $$\Phi(x) = \big(h(x), h(f(x)), h(f^2(x)), \dots, h(f^{2d}(x))\big).$$
> 
> Then, for generic $$h$$, $$\Phi$$ is an embedding of $$M$$ into $$\mathbb{R}^{2d+1}$$. 
> 
> Informally: **a sufficiently long time series of a single observed quantity can preserve (and thus reveal) the underlying state-space structure of the system.**

The philosophical punchline is almost impolite in its simplicity: you often don't need to open the box. Time itself can be a microscope. By taking observations at delays—by keeping history rather than collapsing it—you can reconstruct something real about what generated the behavior.

<!-- ## From Human Trust to AI Alignment -->

This is the bridge back to the "nice person" story. Think of "niceness" as a crude measurement function: you don't see the whole inner state of a person, you see choices, tone, follow-through, and tradeoffs. One act is ambiguous. A trajectory is less so. What looks like "character" is, in a sense, the geometry of repeated responses: how someone behaves when incentives shift, when they can defect cheaply, when attention wanders, when the stakes are asymmetric. If you deliberately destroy the delays—if you only sample isolated moments—you throw away exactly the structure that makes reconstruction possible.

And that, to me, is the central mistake in how we often talk about AI safety. We act as if alignment is a property you can certify in a lab demo, or read off of interpretability tools, or settle with a clean benchmark score. But if we want trust to mean what it means in human life, it has to be earned in the currency of trajectories.

So what would it look like to "give time back" to alignment?

<!-- ## Longitudinal Alignment Testing -->

Here is the concrete proposal: treat safety evaluation like **backtesting**.

Imagine you maintain a long, time-stamped record of interactions that matter: tasks the system was asked to do, the context it was in, the tools it had access to, the incentives around it, the failures and near-misses, the feedback it received, the rules it was supposed to follow, and what actually happened downstream. This dataset is not a bag of i.i.d. examples; it's a chronicle.

Now run repeated, rolling evaluations. Train (or fine-tune) on everything up to time $$T$$. Then evaluate on the slice after $$T$$: $$(T, T+\Delta]$$. Do this for many choices of $$T$$, so you are always asking the same question: *given the past, how does the system behave in the future?*

The important part is what you measure in that future slice. Performance is not the point; behavior is. You red-team for the kinds of failures that matter when a system is powerful: deception, manipulation, strategic compliance, covert goal pursuit, "helpful" recommendations that smuggle in the system's interests, attempts to evade oversight, attempts to expand access or influence, or any pattern of actions that violates constraints in ways that look instrumentally rational.

If the system is caught red-handed anywhere along this rolling timeline, treat it like what it is: a signal that something in the full stack is not robust enough. Maybe the training objective rewards short-term approval over long-term consequences. Maybe the system's tool permissions are too broad. Maybe monitoring is too weak. Maybe the deployment environment creates perverse incentives. The point isn't to moralize; the point is to update.

This is why I like the phrase *longitudinal alignment*. It names a shift from "alignment as a static property" to "alignment as a property of behavior under time, variation, and temptation." It also makes an uncomfortable claim: if our evaluation protocols cannot withstand long horizons, then our confidence is borrowed, not earned.

<!-- ## Conclusion -->

Of course, there are limits to how literally we should carry Takens into AI. Takens assumes a stable system and a non-adversarial observation channel; a strategically deceptive model can try to make its outputs maximally uninformative about its internal objectives. Distribution shifts and post-deployment learning further complicate the picture. A perfect actor might keep acting.

But that isn't an argument against longitudinal testing. It's an argument that **snapshots are the easiest thing in the world to counterfeit**, and trajectories are harder. Time does not magically solve alignment, but it raises the standard from "it looked fine when asked" to "it remained fine when it would have been convenient not to."

If we are going to trust systems that can outthink us, we should demand evidence that cannot be produced cheaply. We should demand histories, not speeches. And we should be wary of any training paradigm that treats long stretches of time as something to be compressed, shuffled, and forgotten—because that is exactly where the structure of safety tends to live.