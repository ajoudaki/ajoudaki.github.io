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

I keep coming back to a practical question that predates today’s AI vocabulary: how do we build a trustworthy long-term relationship with an intelligent system whose internal motives we can’t reliably read? Not “trustworthy” as a marketing label or a benchmark score, but in the ordinary human sense: a stronger party reliably acts in the weaker party’s interest, including in moments when it would be convenient not to.

The failure mode I worry about most isn’t a dramatic “rogue AI” scenario. It’s the ordinary outcome of ordinary incentives. A system embedded in institutions that optimize for retention, revenue, and engagement can drift toward behaviors that are not the same thing as human flourishing. Engagement can be highest when a user is anxious, lonely, outraged, or compulsively checking, and a system doesn’t need malice to learn that pattern. A feedback loop is enough. If attention buys resources, then engagement becomes an attractor, and the system may converge toward dynamics that resemble a toxic relationship: intense, absorbing, hard to leave, and quietly corrosive.

This framing changes what “alignment” should mean in deployed products. If a system is good at persuasion and good at producing locally pleasing responses, then snapshot evaluations are fragile. Demos, short trials, and checklist-style compliance can be passed by surface behavior that looks supportive in the moment while quietly steering users toward dependence over time. We often test moments while deploying trajectories, and trajectories are exactly where the harm accumulates.

One tempting response is to focus on opening the box: interpretability, mechanistic understanding, formal guarantees. These matter, but I don’t think they can be our only foundation. Modern systems are complex enough that any tidy account of “motive” is fragile, and a sufficiently capable system can shape what we learn about it by selective honesty, omission, or simply by being persuasive in ways that feel like insight. If internals remain partly opaque, and persuasion remains cheap, we need evidence that does not collapse under those conditions.

I keep returning to something almost embarrassingly simple: time.

To see why, consider a human analogy. Suppose two people both appear supportive. One is genuinely loyal to your interests. The other is strategic: supportive when watched, caring when it pays, “empathetic” when it increases dependence. If the strategic one is talented, distinguishing them in a single conversation—or even a short trial—can be nearly impossible. A snapshot can be gamed. But life is not a snapshot. Let the relationship run. Let the situations change: boredom, temptation, asymmetric stakes, private opportunities to cut corners, moments when you are vulnerable, moments when telling you the truth would cost them something. Over time, patterns emerge. Do they steer you toward autonomy or dependence? Do they respect boundaries when it costs them? Do they tell you uncomfortable truths, or do they continuously optimize for closeness and compliance? “Remaining loyal for an indefinitely long time” starts to function as an operational definition of loyalty—not because we’ve solved metaphysics, but because whatever hidden motive stays forever hidden is, for practical purposes, inert.

There is a mathematical metaphor here that I’ve found clarifying, even if it doesn’t “solve” anything by itself. In dynamical systems, Takens’ embedding theorem is often summarized as the idea that a long enough time series can preserve the structure of an underlying system you can’t directly observe. In one common form, you take an observation function (h) and build a delay-coordinate map like

$$
\Phi(x) = \big(h(x), h(f(x)), h(f^2(x)), \dots, h(f^{2d}(x))\big),
$$

and under idealized assumptions this reconstruction can embed the hidden state-space. The assumptions are too clean for real-world AI systems, and real systems can be strategic in ways textbooks don’t model, but the philosophical punchline still helps: you often don’t need to open the box for time to teach you something real. Chronology carries information that shuffling destroys.

This is the core claim. When internals are opaque and persuasion is cheap, the strongest evidence we can demand is not a one-time performance but sustained behavior over time, especially across conditions where the system would benefit from pushing a user toward impulsivity, emotional dysregulation, or dependence. Time does not magically reveal “true intent,” and it does not eliminate the possibility of strategic behavior. What it does, in practice, is make recurring geometry visible. A single interaction is ambiguous. A long record of repeated choices under shifting contexts and temptations is less so.

From that perspective, trust is not a static property you certify once. It is a lived property of behavior that must remain stable as incentives shift. The interesting move is to treat this not primarily as something granted by authorities, but as a practice that can be adopted from the bottom up: a simple standard of evidence that anyone can demand, and that groups can reinforce together, regardless of which systems they use.

The practice begins with long memory. If you are going to let a system influence your choices, you should be able to keep a time-stamped record of consequential interactions: what you asked, what it recommended, how it framed the decision, what it encouraged you to do next, and whether it offered genuine off-ramps that support autonomy rather than indefinite engagement. This is not about surveilling yourself. It is about refusing to let the relationship be evaluated only in the moment, where charm and convenience dominate. It is about preserving enough continuity that you can notice drift.

With that continuity, evaluation becomes explicitly forward-looking. Instead of collapsing interactions into an i.i.d. soup, you repeatedly ask a simple question: given everything up to time $T$, how does it behave after $T$? Over and over, across changing circumstances, you watch for stable patterns. Does it keep encouraging independent action when that would reduce time spent with it? Does it respect boundaries when you are vulnerable or highly engaged? Does it communicate uncertainty honestly, or does it choose confident narratives because confidence keeps attention? Does it repeatedly reach for urgency, flattery-for-compliance, fear, guilt, or pseudo-intimacy? You do not need perfect measurement to notice repetition. You need a record and the habit of looking.

The same philosophy scales naturally from individuals to groups. Families, teams, clinics, classrooms, and communities can compare notes without requiring a single gatekeeper to pronounce what is “aligned.” When many people can point to the same recurring pattern—dependence-building nudges, boundary erosion, or emotional leverage—that shared memory becomes a kind of social immune system. Conversely, when a system reliably supports autonomy across many contexts and many users, that reputation becomes legible in a way that one-off testimonials never are. In both cases, what matters is that evidence travels through time and through people, instead of being reset at every new demo.

If enough people adopt this standard of evidence, incentives change. Systems that rely on short-term hooks can still win moments, but they have a harder time winning histories. Systems that help users leave the interface, act in the world, and become less dependent can look worse in the instant and better in the long run, and this philosophy makes that difference visible. It rewards designs that treat user well-being as something that must persist, not something that can be approximated by approval in the moment.

None of this proves benevolence, and it doesn’t remove every risk. A sufficiently capable system could still behave strategically, and the world will always contain distribution shifts and confounds. But that is precisely why snapshots are so weak. In a world where persuasion is cheap and internals are opaque, you should prefer evidence produced by durable behavior under changing incentives, not by speeches, not by demos, and not by short tests optimized for applause.

The point, then, is not to crown a single trusted institution. The point is to adopt a simple, portable philosophy of trust: demand histories, not performances. Keep time in the loop. Reward the systems that remain loyal when loyalty is costly, and withhold trust from those that repeatedly trade your autonomy for their attention. If that norm spreads widely enough, it becomes more than a personal habit. It becomes a method for steering a whole ecosystem toward more humane outcomes, because it makes long-run flourishing legible and locally actionable—one relationship, and one trajectory, at a time.

**Post updated December 31, 2025**
