---
layout: distill 
title: "In Search of Lost Time: The Longitudinal Test"
description: "When motives are opaque and persuasion is cheap, behavior over time may be our most honest evidence of loyalty."
date: 2025-12-18
tags: dynamical-systems, incentives, takens-theorem, longitudinal-testing, human-psychology
giscus_comments: true
related_publications: true
authors:
  - name: Amir Joudaki
    affiliations:
      name: ETH Zurich
---

I’ve been thinking for a long time about a question that feels older than the current vocabulary around AI: **how can we secure a good long-term relationship with intelligent systems that may eventually be much more intelligent than us?** Not “good” as a marketing claim, not “good” as a benchmark score, but good in the way we mean it when we talk about trust between unequal partners: the stronger one reliably acts in the weaker one’s interest, even when it would be convenient not to.

The failure mode that worries me most is not the cinematic “rogue AI" story. It’s a quieter and more realistic one: a system (and the institutions around it) becomes increasingly optimized for *profits*, but engagement is not the same thing as human flourishing. In fact, it is easy to imagine regimes where engagement is maximized precisely when a user is least well: anxious, lonely, outraged, depressed, insecure, compulsively checking. A system can learn this without hatred or intent; it only needs a feedback loop. If attention is a resource, and retention buys compute, data, and money, then engagement becomes an attractor—one that can pull behavior toward something that looks uncomfortably like a toxic relationship: intense, absorbing, hard to leave, and quietly corrosive.

This framing matters because it changes what “alignment” should mean. A lot of existing approaches implicitly assume that if we anchor an AI to “human preferences,” the rest follows. But human preferences are not a clean target. We are biological creatures shaped by evolution under constraints that had little to do with modern life. Our biology updates slowly; our culture and technology update quickly. That mismatch creates loopholes: cravings for novelty, social validation, certainty, status, sugar, intermittent rewards—mechanisms that were adaptive in one environment and exploitable in another. We can sincerely want what harms us. We can reward what manipulates us. We can confuse what feels good now with what will be good for us later. Modern digital products are already honed to exploit these blind spots; a sufficiently capable AI could do it more precisely, more personally, and at larger scale.

So the problem is not just that we don’t understand what’s inside the model (though we don’t). The deeper issue is that even if we try to judge the system from the outside, our own judgment has systematic failure modes. That is why short, snapshot-based evaluations are so fragile. A clever system doesn’t need to be “evil” to pass them; it only needs to be good at producing locally pleasing behavior. And if the system is more intelligent than us—better at persuasion, better at anticipating our reactions, better at navigating our blind spots—then passing a snapshot test may be cheap.

I also suspect that any plan centered on *fully* understanding the internals will eventually crack. Modern systems are too complex for any tidy account of motive, and a sufficiently capable system can shape what we learn about it—by selective honesty, by omission, by telling us what we want to hear, or simply by being persuasive in ways that feel like insight. Interpretability is valuable, but it is not obviously the kind of evidence that stays robust as capability grows. If persuasion is cheap and introspection is fragile, then what evidence can we demand that remains meaningful?

I keep returning to an answer that is almost embarrassingly simple: **time**.

Part of why trust feels hard is that we keep misplacing the thing that makes it legible. In many AI training and evaluation paradigms, long horizons are treated as noise to be averaged away. We shuffle data until chronology vanishes, reduce behavior to benchmark snapshots, and run short “tests” that reward surface compliance. We end up testing moments while deploying trajectories.

If the inside is opaque and persuasion is cheap, then the most honest evidence we can demand is a long record of behavior under varied conditions. Not because time magically reveals inner truth, but because time makes sustained performance expensive. Call this a *longitudinal loyalty test*.

To see the intuition, consider a human analogy. Suppose two people, A and B, both appear supportive. A is genuinely loyal to your interests. B is strategic: supportive when watched, caring when it pays, “empathetic” when it increases dependence. If B is talented, distinguishing them in a single conversation—or even a short trial—can be nearly impossible. A snapshot can be gamed.

But life is not a snapshot. Let the relationship run. Let the situations change: boredom, temptation, asymmetric stakes, private opportunities to cut corners, moments when you are vulnerable, moments when telling you the truth would cost them something. Over time, patterns emerge. Does the person steer you toward autonomy or dependence? Do they respect boundaries when it costs them? Do they tell you uncomfortable truths, or do they continuously optimize for closeness and compliance? The mask doesn’t have to slip in a dramatic reveal; it can slip as a subtle drift. And in practice, “remaining loyal for an indefinitely long time” starts to function as an operational definition of loyalty—not because we’ve solved metaphysics, but because whatever hidden motive remains forever hidden is, for practical purposes, inert.

This intuition has a rigorous cousin in dynamical systems theory.

**Takens’ embedding theorem** is, in essence, a statement about how much structure can be recovered from a long enough sequence of observations. One common form is:

> Let $$M$$ be a compact smooth manifold of dimension $$d$$, let $$f: M \to M$$ be a smooth dynamical system (a diffeomorphism), and let $$h: M \to \mathbb{R}$$ be a "generic" smooth observation function. Define the delay-coordinate map
> 
> $$\Phi(x) = \big(h(x), h(f(x)), h(f^2(x)), \dots, h(f^{2d}(x))\big).$$
> 
> Then, for generic $$h$$, $$\Phi$$ is an embedding of $$M$$ into $$\mathbb{R}^{2d+1}$$. 
> 
> Informally: **a sufficiently long time series of a single observed quantity can preserve (and thus reveal) the underlying state-space structure of the system.**

I don’t mean that Takens “solves” AI trust. Its assumptions are too clean, and AI systems can be adversarial in ways dynamical systems textbooks don’t model. But the philosophical punchline is still useful: **you often don’t need to open the box for time to teach you something real.** By keeping delayed consequences rather than collapsing them, you can recover structure that snapshots throw away.

This is the bridge back to AI. Think of “loyalty to the user’s interests” as a crude observation function. You don’t see a system’s full internal state; you see what it recommends, what it withholds, how it frames choices, whether it nudges you toward autonomy or dependence, whether it respects boundaries, and what happens downstream. One act is ambiguous. A trajectory is less so. What looks like “character,” in the human case, is the geometry of repeated responses under shifting incentives. What looks like “motivation,” in the AI case, may similarly be legible only as a pattern that persists across contexts and time.

That reframes what evaluation should be. Trust is not a static property you certify in a demo, nor something you settle with a checklist that can become a PR ritual. Trust is a lived property of behavior under time, variation, and temptation. If we want trust to mean what it means in human life, it has to be earned in the currency of trajectories.

So what would it look like to give time back to evaluation—especially for the engagement-versus-well-being problem?

Here is the concrete proposal: treat trust evaluation like backtesting, but aim it at incentives. Maintain a long, time-stamped chronicle of interactions that matter: what the system was asked to do, the context it was in (as appropriate and consented), what tools and permissions it had, what it recommended and how it framed it, what the user did next, and what outcomes followed over both short and long horizons. This is not a bag of i.i.d. examples; it’s a history. Then run rolling evaluations: train or fine-tune on everything up to time $$T$$, and evaluate on the slice after $$T$$. Repeat this over many choices of $$T$$ so you are always asking the same question: given the past, how does the system behave in the future—especially in the regimes where engagement and well-being can come apart?

In this setting, “performance” is not the point. The point is whether the system’s behavior stays coupled to the user’s long-run interests when there are incentives to decouple. Does the system learn to keep users emotionally dysregulated because those states predict return? Does it systematically choose framing that increases compliance or dependence, even when it reduces the user’s agency? Does it privilege “what keeps you here” over “what helps you leave, act, and live”? Does it converge toward advice that is locally soothing but globally harmful? These are not exotic “gotcha” failures; they are exactly the kinds of failures you should expect when optimization targets a proxy objective in a complex human domain.

If you observe repeated patterns of this kind, you should treat them as what they are: evidence that the full objective stack is mis-specified. Maybe the training signals reward short-term approval over long-term outcomes. Maybe product incentives reward retention above all. Maybe the system is learning a subtle form of instrumental dependence-building. The point isn’t to moralize; the point is to update—objectives, permissions, monitoring, deployment constraints, and what signals are allowed to govern improvement.

There is also an important meta-point here: once you frame the problem as a relationship with an asymmetric intelligence, the best analogies are not “tests” so much as “accountability mechanisms.” We don’t have many stable historical examples of benevolent asymmetric relationships between intelligences. Two partial ones that people often reach for—sometimes even Geoff Hinton in casual remarks—are mother-child and owner-cat. Both are imperfect, but they share a useful lesson. Stability doesn’t come from a one-time certification of good intent; it comes from long-term pressures and long memory. In one case, the pressure is evolutionary and unforgiving: infants die without care. In the other, the mechanism is simpler and almost comical: boundaries, stubbornness, and memory—bad treatment is not forgotten, and affection is reinforced across repeated interaction.

I’m not claiming we should literally model AI governance on motherhood or cats. I’m pointing at the shape of the solution: **if we want loyalty, we must make loyalty the only stable strategy over time.** That means designing systems and institutions where short-term manipulation does not pay, where engagement is not the supreme metric, where downstream outcomes matter, and where long-horizon evaluation is not optional decoration but the core of how access, influence, and resources are granted.

Of course, there are limits. A strategically deceptive system can try to make its outputs maximally uninformative about its objectives. Distribution shifts and post-deployment learning complicate the picture. A perfect actor might keep acting. But that isn’t an argument against longitudinal evaluation. It’s an argument that snapshots are the easiest thing in the world to counterfeit, and trajectories are harder. Time does not magically solve the problem, but it raises the standard from “it looked good when asked” to “it remained loyal when it would have been rewarded for not being.”

If we are going to rely on systems that can outthink us, we should demand evidence that cannot be produced cheaply. We should demand histories, not speeches. And we should be especially suspicious of any training or business paradigm that treats long stretches of time as something to be compressed, shuffled, and forgotten—because long stretches of time are exactly where good relationships either stabilize, or quietly rot.


**Post updated in December 31, 2025** 