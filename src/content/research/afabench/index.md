---
title: 'AFABench: A Generic Framework for Benchmarking Active Feature Acquisition'
description: 'A benchmark for studying policies that acquire costly features sequentially, trading prediction quality against budget, latency, and information cost.'
date: 2026-05-17
authors:
  [
    'Valter Schütz',
    'Han Wu',
    'Reza Rezvan',
    'Linus Aronsson',
    'Morteza Haghir Chehreghani',
  ]
myName: 'Reza Rezvan'
venue: 'KDD 2026 Datasets & Benchmarks Track'
venueShort: 'KDD 2026'
paperUrl: 'https://arxiv.org/abs/2508.14734'
doiUrl: 'https://doi.org/10.1145/3770855.3817493'
codeUrl: 'https://github.com/Linusaronsson/AFA-Benchmark'
---

## Overview

Active feature acquisition asks a deliberately practical question: when every
feature has a cost, which information should a model buy before it predicts?
AFABench provides a common experimental framework for evaluating that question
across static, myopic, and reinforcement-learning-based policies.

The benchmark treats feature acquisition as a sequential decision problem. At
each step, a policy observes the features already acquired, chooses whether to
purchase more information, and is evaluated by the resulting trade-off between
predictive performance and acquisition cost. This framing makes it possible to
study non-myopic behavior, where a feature can be valuable because it changes
what should be acquired next rather than because it is immediately predictive.

## My Role

I worked on the benchmark and the surrounding research questions as part of my
completed MSc thesis in the Machine Learning and Decision Making Lab at Chalmers.
The project shaped my current interest in sequential decision-making under
partial observability, especially in settings where information itself is an
action with a cost.
