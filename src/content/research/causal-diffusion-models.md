---
title: 'Causality-Δ: Jacobian-Based Dependency Analysis in Flow Matching Models'
description: 'A study of how Jacobian-vector products can reveal local dependency structure in flow-matching generative models.'
date: 2026-02-02
authors: ['Reza Rezvan', 'Gustav Gille', 'Moritz Schauer', 'Richard Torkar']
authorNotes: { 'Reza Rezvan': '†', 'Gustav Gille': '†' }
myName: 'Reza Rezvan'
venue: 'arXiv preprint'
venueShort: 'arXiv'
paperUrl: 'https://arxiv.org/abs/2602.02793'
codeUrl: 'https://github.com/rezaarezvan/causdiff'
---

## Overview

Flow matching learns a velocity field that transports a simple base
distribution into a data distribution. Causality-Δ studies how small latent
perturbations propagate through that learned flow, using Jacobian-vector
products as a practical lens on dependency structure in generated features.

The paper connects analytical calculations in Gaussian and mixture-of-Gaussian
settings with numerical experiments in low-dimensional data and image domains.
The central point is local. Even when the global flow is nonlinear, its
Jacobian can expose how changes in one latent direction influence generated
attributes nearby.

## Why It Matters

Generative models are often evaluated by sample quality, but scientific use
also requires understanding what structure they have learned. Jacobian-based
analysis gives a way to interrogate the learned dynamics without treating the
model as a black box. The work is careful about the distinction between
observational dependency and formal intervention. The method provides evidence
about local dependencies, not a general do-calculus oracle.

## My Role

This project was my first sustained research work on generative models as
dynamical systems. It sharpened my interest in the mathematical structure of
modern ML models. I care about what the model represents locally, how uncertainty propagates,
and when the learned geometry can be connected to causal hypotheses.
