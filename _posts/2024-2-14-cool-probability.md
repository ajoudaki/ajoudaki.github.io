---
layout: distill
title: How do you build 1/3 probability with a fair coin?
description: 
giscus_comments: true
tags: cool-facts 
date: 2024-02-14

authors:
  - name: Amir Joudaki
    affiliations:
      name: ETH, Zurich

bibliography: refs.bib


# Below is an example of injecting additional post-specific styles.
_styles: >
  .fake-img {
    background: #bbb;
    border: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: 0 0px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 12px;
  }
  .fake-img p {
    font-family: monospace;
    color: white;
    text-align: left;
    margin: 12px 0;
    text-align: center;
    font-size: 16px;
  }

---

Here is the question:

> Suppose you have a fair coin. Given integers $a$ and $b$ where $a< b,$ can you devise a strategy that produces an event with a failure success of $a / b$? You may toss the coin as many times as you like. 

This question was posed to me in a job interview. I found the question fascinating for a variety of reasons, But before I go on about various hints and my own thought processes. Please feel free to take as much time as you want before reading more on this problem. 

My most immediate thought when thinking about the problem was, well, it is easy enough to build an event with $1/2, 1/4, ... $ probability by simply tossing the coin several times and returning success if they all returned head, i.e., AND-ing these events. It also seems plausible we can construct events that are the sum of these values. Namely, $1/2 + 1/4= 3/4.$ Happy with my progress, I started to think of the simplest case that doesn't fall into this pattern, and $1/3$ struck me as a good choice:

>  Given a fair coin, can you construct an event with $1/3$ probability? 


My vague idea is that the eventual solution must be a clever combination of a number of coin tosses that magically return $1/3$ probability. Despite my hopes, I started to note that most of my attempts ended with events that had a $a / 2^k$ probability of success, which is clearly a pattern that does not fit $1/3.$ My next idea (which, at the time, I thought was very clever) was that the magical combination of events must involve the Bayes rule. Suppose I can devise an event conditioned on another event where the ratios of the two probabilities are $1/3.$ All efforts in this direction were also blocked. 

At this point, the interviewer gave me a hint that there are roughly two approaches to solving this, and one of them involves approximating the event. This immediately kicked off an idea in my head: We can approximate any fractional number by an arbitrary precision in the binary base $\sum_{i=1}^\infty 2^{-k_i} $ where $k_1 < k_2 < \dots $ denote the non-zero binary indices. 

Thus, if we're happy with an "approximation" of $a/b, $ we can approximate the fraction as $a/b \approx \sum_{i=1}^m 2^{-k_i}.$  we can design the following scheme:  Let $E_i$ be an event with $2^{-k_i}$ probability of success, which we know how to construct. My next thought was that we could construct the main event as $E$ as the union of all events $E_i$'s $E = \bigcup_{i=1}^m E_i. $ My thinking was that $P(E) = \sum_{i=1}^m P(E_k) = \sum_{k=1}^m b_i 2^{-k} \approx a/b. $ 

I wrote down and implemented this idea in Python as follows.

```python
import random 

# fair coin
def coin():
    return random.randint(0,1) == 0

# success of "k" coin tosses (1/2^k) probability
def coin_power(k):
    return all([coin() for _ in range(k)])

# approx a/b prob, B: bits of precision 
def approx_prob(a, b, B = 10):
    p = a / b 
    p_int = int(p * 2**B)
    p_bits = [int((p_int & (1<<i)) > 0) for i in range(B-1,-1,-1)]
    non_zero_bits = [(i+1) for i,b in enumerate(p_bits) if b > 0]

    return any([coin_power(i) for i in non_zero_bits])

def test_prob(f, num_samples=100000):
    return sum([f() for _ in range(num_samples)])/num_samples

test_prob(lambda: approx_prob(1, 3))

# result = 0.3121 ... 
```
 To my surprise, the empirical likelihood of the event $0.3121...$ was slightly off from the expected one of $0.3333...$ no matter how many bits of precision and samples I used: A careful consideration reveals a flaw in my original reasoning for $P(E) = \sum_{i=1}^m P(E_i)$: In order to have probability of event equal to sum of individual events, they need to be disjoint: $P(E_i \wedge E_j ) = 0,\forall i\neq j,$ which is not the case if they are independent. 

Now, at this point, the interviewer mentioned "rejection sampling" might be a good way to go about this problem. To anyone who is familiar with this concept, this should immediately ring a bell: we can use the coin to define a uniform sampling over any set of power-of-two sizes: for a set of size $2^k$, we can toss $k$ coins and represent them jointly as a binary number $i = \sum_{j=0}^{k-1} i_j\cdot 2^k$ where $i \in [0,2^k-1]$ can be used as the index of the element in the set. We can assume WLOG that $2^k \ge b$. The magic of the rejection sample kicks in here: if we simply reject events $i > b,$ in the remaining events, $i$ is a uniform sample over $0, ..., b-1$, which is exactly what we want! However, we are left with some rejections. What should we do? Well, sample again! Here's a python implementation:

```python
import random 

# fair coin
def coin():
    return random.randint(0,1) == 0

# success of "k" coin tosses (1/2^k) probability
def coin_power(k):
    return all([coin() for _ in range(k)])

def rejection_sampling(a, b):
    k = 1
    while 2**k< b:
        k += 1
    i = b + 1
    while i >= b:
        i = sum([int(coin())*2**i for i in range(k)])
    return (i < a) 

def test_prob(f, num_samples=1000000):
    return sum([f() for _ in range(num_samples)])/num_samples

test_prob(lambda: rejection_sampling(1, 3))
```

This time, the result $0.333084... $ and the sample mean gets arbitrarily clsoe to $1/3$ as we increase the sample size. 


Now, at this point, I was still left with one big daunting question: Is this the most sample-efficient way of going about this problem? In other words, how many random bits does this process consume? Let us assume that $a/b$ is already the smallest fraction ($a$ and $b$'s common denominator is $1$). Clearly, if $b$ is a power of $2$, $b = 2^k$, the process ends deterministically in one step and thus consumes $k = \lceil \log_2(b)\rceil $ random bits. Now, let us assume that $b$ is not a power of two, and we pick the $k$ corresponding to the smallest power of $2.$ In othre words, $b \in (2^{k-1},2^{k}).$ Now, considering that the event is not rejected with probability $b / 2^k,$ we can see that for any value of $b,$ we accept with $ b/ 2^k > 2^{k-1} / 2^k = 1/2$ probability. Thus, on average, we use $2 \lceil \log_2(b)\rceil $ random bits for this process. We can also derive a high-probability bound by observing that the event of having more than $T$ rounds is upper bounded by $2^{-T-1} + 2^{-T-2} + \dots = 2^{-T}.$ Thus, we use at most $T \lceil \log_2(b)\rceil $ bits with $1 - 2^{-T}$ probability. 

While this all seemed nice and good, I was still feeling a bit uneasy. More specifically, even for a simple event like $1/3,$ we can't use a finite number of coin tosses to build this probability! In some sense, I was instinctually convinced that there is some clever way of constructing a finite number of coin tosses that lead to a $1/3$ probability. To my surprise (!), this seems to be impossible. So I sat about proving that it is genuinely impossible to use a *finite* number of random bits to construct an event with $1/3$ probability. As strong and daunting as that sentence might sound, the proof is extremely simple and straightforward. In fact, any arbitrary and complex strategy that you take with random bits can be effectively mapped to a binary tree, with each node representing a random bit and the left (right) leaf of each node corresponding to an outcome of that bit (or coin toss). Finally, the leaves of this tree are the places where you designate an outcome (which could be True or False). Upon this abstraction, it is very easy to see that if our strategy guarantees a finite number of random bits or coin tosses, this tree is actually finite for all possible scenarios. Thus, we can actually easily compute the probability of success of the event but recursively compute the probability of success of each node. However, since any success leaf corresponds to a disjoint event with a negative power of two probability $2^{-k}$, the overall success probability equals the sum of negative powers of two. This has an immediate and very important revelation: the success probability of this event can be represented as a floating point in binary basis with *finite* number of bits. For example, any event like $1/4, 3/8, 7/16$, and so on satisfies this. However, $1/3$ is clearly not representable on a binary basis with finite bits. This completes the proof that $1/3$ event cannot be produced if we only have a finite number of bits. 

I thought this was a super cool and interesting observation from an almost ridiculously simple-sounding problem. I hope you enjoyed the read! 
