---
title: "Opening Pandora's Box in the 21st Century"
date: 2026-09-18
image: "../../../assets/paintings/hercules.webp"
draft: true
---
## Standing at the Crossroads
> "Only Hope remained there in an unbreakable home within under the rim of the great jar" -- Hesiod, Works and Days, 96–97, trans. Evelyn-White. @cite:Hesiod1914

These last six months have been quite turbulent for many scientific disciplines.
From solving [^1] longstanding open problems and conjectures in various domains, to [solving one of the Millennium Prize Problem](https://openai.com/index/navier-stokes-solution/).
I have tried my best to follow the discourse of AI, science, and engineering, ranging from pure mathematics to empirical software engineering, during this period as AI systems have become progressively more capable [^2].
To name a few that I have read recently:
* [Mathematics is effectively dead](https://doomslide.substack.com/p/mathematics-is-effectively-dead) by [`doomslide`](https://x.com/doomslide)
* [A beginning for mathematics](https://proofsandprompts.com/2026/09/14/a-beginning-for-mathematics/) by [Daniel Litt](https://www.daniellitt.com/)
* [My AI Predictions: What Did I Get Right So Far?](https://avt.im/blog/my-ai-predictions-what-did-i-get-right-so-far/) by [Alexander Terenin](https://avt.im/)
* [Asking Authors About Their Own Papers](https://medium.com/@TmlrOrg/asking-authors-about-their-own-papers-3d2e04e5dee0) from [Transactions on Machine Learning Research](https://jmlr.org/tmlr/)
* [Culture Becomes a Dark Forest](https://www.theintrinsicperspective.com/p/culture-becomes-a-dark-forest) by [Erik Hoel](https://substack.com/@erikhoel)

As the discourse continues, I want to provide my slice to it as a [newly appointed PhD student in AI](/essays/science), as me and my peers, in both academia and industry, are at the imminent frontier of the future where AI lies ahead.

## The Pledge
> "He hid fire; but that the noble son of Iapetus stole again for men from Zeus the counsellor in a hollow fennel-stalk." -- Hesiod, Works and Days, 50–52, trans. Evelyn-White. @cite:Hesiod1914

Like many others, I recently saw the trailer for the upcoming [Artificial (2026)](https://www.youtube.com/watch?v=rDZplZFnbOk) movie about OpenAI.
I remember playing around in the GPT-3 playground with the `davinci-002` model early on, I remember being fascinated by the OpenAI Five project and how such a simple algorithm, when paired with extensive heuristics and compute, could solve such a complex objective.
For me, these were the first times I felt the _magic_ of AI.

I quite often hear these expressions: "feel the magic", "feel the AGI", "can you feel it anon?"
Admittedly, the last one only on Twitter; but what is it we are feeling exactly?
What feelings or experiences are these AI systems conveying to us, and in what manner do they cause us to view their actions as magic exactly?

[The Bitter Lesson](http://www.incompleteideas.net/IncIdeas/BitterLesson.html) argued what I can summarize as "search is king": when general-purpose methods are paired with (extensive) computational resources, their expected output is much better than many smart abstractions and/or domain-specific methods.
I will not be hypothesizing as to _why_ this is the case, I will simply swallow this bitter pill and accept it.
But, given this assumption it still does not answer our question of why these "search is king" systems impart a mystical feeling.

Since I am a trained computer engineer, I will mainly focus on programming, partly motivated because AI code generation is one of the cornerstones of the evolving frontier, but mainly since this is where my expertise lies.
As many others have argued [^3], I argue that many knowledge problems in which modern AI systems have excelled are underlying search problems.
This is especially true for **modern** software, where we are often faced with a problem for which we often know _a solution_ a priori, but the challenge lies in finding a sufficient [^4] solution for the specific input-output constraints in the context.
Here, I am assuming that the people responsible for solving these problems are knowledgeable and trained, and not students in the phase of learning [^5].
I have been fortunate enough to have been surrounded by both smart and competent software engineers for a large portion of my life, in both my anecdotal experience and from what I have gathered from industry veterans, you often know _a solution_; however, it is often not the perfect fit in the specific context and potentially violates the expected input-output invariants that are constraining.

Practical software has always been about creating verifiable systems that solve exact problems.
Naturally, if our output is something that is testable, (formally) verifiable, and often paired with a cheat sheet of sort, it is not surprising that search will be king.
Even before modern AI code generation, people understood this and extensively researched how one can effectively search for good computer programs, the ambition to automate programming is almost as old as AI itself. @cite:Gulwani2017
Consequently, the rapid expansion, investigation, and optimization of modern computer hardware have enabled "search is king" to materlize over the decades and this decade it was time for triumph.

> "Since the inception of AI in the 1950s, this problem has been considered the holy grail of Computer Science." @cite:Gulwani2017

I have been interested in search (and by extension, in entropy) since my undergrad days, as it always appeared as a natural solution to many problems.
For example, it is not hard to accept that there exists a finite number of computer programs written in Python with a maximum of 1000 characters of source code that are able to correctly solve [Fizz buzz](https://en.wikipedia.org/wiki/Fizz_buzz), although a ridiculous number nonetheless.
Stupid brute force will get you nowhere, but it is clear that by utilizing smart heuristics and constraints, one can reduce the search space substantially and thereby find sufficient programs.
Thus, we have known that search is and will be king; we have understood its applications and where it is applicable. Why do these systems still feel like magic?

## The Turn
> "But he took the gift, and afterwards, when the evil thing was already his, he understood." -- Hesiod, Works and Days, 89, trans. Evelyn-White. @cite:Hesiod1914

Since ~December of last year, the software engineering community has been aflame in attempts to define and answer the following questions: (i) what the goals, intentions, and incentives of software have been and will be in the future, and (ii) consequently, whether modern AI systems are the natural next step up the _software abstraction ladder_ or not?
The software abstraction ladder refers to the underlying working details that are hidden in a given (sub)system.
The distinctions between high- and low-level languages, machine- and hand-optimized code, and even compiler heuristics are all a part of this beautiful Jacob's ladder.

I have used computers extensively (and maybe a bit too much...) for the majority of my life.
I have also spent the last ~10 years understanding how computers and software are built from the ground up [^6].
While I still enjoy "recreational programming", I mostly see programming as a means to an end these days. I still consider programming to be an art in the hands of an artist, but in the hands of an engineer, or anyone who is not an artist, it is merely a tool.

However, I could not disagree more with people who, usually "tech bros" as they are known colloquially, argue that churning out (sloppy) AI generated code is the way forward and the natural step upon Jacob's software ladder.
I want to make a few points clear before I state my stance here.
Do I use AI code generation? Absolutely! AI code generation is simply much better at writing _more_ code that (usually) runs/compiles the first time than I am.
Once commoditized, non-human inventions outperform humans in terms of speed and quantity, what usually still stands is quality.
Do they one-shot _better_ code than I do? I find this to be a slippery slope.
The capability of AI code generation is largely relative, in the sense that, as of writing this, they are able to solve many tasks sufficiently, but still not sufficiently at the frontier.
Whether AI code generation will be able to do so, or what the consequences are assuming that it will, is entirely political and thus a topic on its own.
Alas, I argue that the capability of these AI systems are relative to the actor utilizing them and largely in what context, as the training corpus and what knowledge can be retrived have a physical limitation in what can be retrived from the weights.

Recall that software is an inherent search problem, AI systems today can index an entire codebase and better understand its input-output structures much faster than any human can.
The shared view in the current software industry is that: AI code generation is useful for writing code, but you are essentially orchestrating solutions and not writing as much code by hand, for many tasks, _a lot_ of orchestration can be needed, but the mere speedup and code quantity are still often preferred!
However, merely solving a problem with the correct input-output structure and understanding a _tasteful_ solution and why it is good are two completely disjoint events.
If you spend at least one second on Twitter, you will see someone quote the famous Dune quote:

> Once men turned their thinking over to machines in the hope that this would set them free.
But that only permitted other men with machines to enslave them. [^7]

I have seen countless horror stories of people building sophisticated projects and tools, and I have even sometimes fallen into this trap myself when "vibecoding" various curiosities, once the token limit has been hit, they are not able to do work on their own, becoming trapped under the "search overlords".
Why? The answer again lies in search: AI code generation is such an easy "button-presser" task that you are able to churn out immense amounts of code in a short time.
However, fully understanding and internalizing the codebase takes time for humans, even when you are handwriting all the code it takes a lot of time, although at a much closer relationship of time--to--understanding I would say.
This is why I dislike when people (miss)use the quote above, we are not turning our thinking over to the machines, we are turning over the scale of search, time, and effort to the machines.
In many settings, execution, results, and progress are appreciated myopic measures that drives direction, if this is a correct, just, and valuable system and what possible alternatives there exists is political, but I suspect that these are not the best measures.

Let me for a moment comment on the more academic side of things, as I will be spending the next five years in an academic environment.
[Asking Authors About Their Own Papers](https://medium.com/@TmlrOrg/asking-authors-about-their-own-papers-3d2e04e5dee0) from [Transactions on Machine Learning Research](https://jmlr.org/tmlr/) recently highlighted this issue.
I have followed the academic discourse at large, from the macro scale of universities and teaching the next generations to the micro scale of how workshops, conferences, and peer review will adapt in the age of AI.
Many of these topics are political, or at least influenced and steered by politics, but it is clear that the current systems were not built for this scale of search, and I have seen many proposals that, in summary, say "either make everything open and let us fight for reputation" or "it is time that we return to our ivory towers, secretive work is what lies ahead".
While it is hard to predict which of these extremes, or what mixture of them, will play out, I personally believe the former more than the latter.
But I digress from this side point, although it is something that will be on my mind, and other (to-be) tenured seniors, for a while.

We have opened Pandora's Search Box and there is no going back, the magic felt by these AI systems is simply the extensive ability to search, at scale, but what is the catch? What is the surprising last act of the magic trick?

## The Prestige
> "But the rest, countless plagues, wander amongst men; for earth is full of evils, and the sea is full." -- Hesiod, Works and Days, 100–101, trans. Evelyn-White. @cite:Hesiod1914

To understand what is happening in the 2020s and why "tokenmaxxing" is an expression that is used in some internet cultures, I want us to first consider the culture of programming in the 2000s and 2010s.
Like many others, I grew up with [The Social Network](https://en.wikipedia.org/wiki/The_Social_Network) and the idea that anyone, even with the simplest of tools, but with the highest of ambitions, can build anything [^8].
The startup culture found in Silicon Valley has often reflected this and has enabled many inventions throughout the decades.
However, with the introduction of AI code generation systems into our software workflows, I think a modification is required to the statement.

> [...] and the idea that anyone, ~~even~~ with the ~~simplest~~ available **costly** tools, but with the highest ambitions [...]

Now, we return to idea of ["tokenmaxxing"](https://tokenmaxxing.com/guides/what-is-tokenmaxxing).
By treating the number of tokens and use of AI code generation as a myopic metric for output and performance, I no longer believe in the sentiment that anyone can build anything with the simplest tools.
To clarify, I am not implying that it will be impossible, that is a silly idea, what I am getting at is that this is the culture we are creating.

So is this it, then? Is the catch and the surprising last act of the magic trick that we are being lured in and trapped into AI code generation and that this is the field's future?
Perhaps, but this is might only be the fate of practical software and software that requires output in the form of revenue or something of interest.
All of this leads me to believe that practical software is going to become costly.

Let me clarify what I mean by cost here, it is not only the cost and access to AI, traditional software also requires computational resources which has a cost, the difference is that access to sufficient tools is becoming part of the creation of software itself.
The Zuckerberg hacker vision of the 2010's illuminated the idea that, given a laptop, time, and understanding, you could build anything your heart desired: the teenagers with Vim, GCC, and energy drinks could, by using the same tools as the large corporations, build something just as great, if not better.
But what is happening is that the software you produce is becoming proportional to the amount of search you can afford.

I find "Tokenmaxxing" to be interesting because it is the cultural manifestation of this: more attempts, more agents, larger contexts, maximize tokens
The ethos is greedy: if one failed search attempt costs us nothing, we can simply search again, again, and again! if the performance frontier of a swarm agents perform better than a single agent, but at a higher cost, we still want to run the swarm! if a larger context window allows you to fit the entire codebase in-context, we are of course going to buy the model with the largest context window!?
But ultimatelty we need to ask, does generating ten times as much code make us capable of understanding code ten times faster?
A compiler can verify the syntax and compile a source program to machine code for free, a test suite can verify the expected behavior of however many specifications we want, and a formal system may even verify stated invariants.
Does this yield knowledge to the tokenmaxxing engineer? No!
None of these gives the tokenmaxxing engineer behind it a compressed understanding of why the underlying system and source code looks the way it does or what would need to should change when the world around it changes.
The tokenmaxxing engineer simply needs to adhere to the search overlords and accept this fate, or spend an immense amount of time digesting the codebase, its tests, specifications, and verify everything the old fashioned way.

What was once a bottleneck in creation of software has allegedly shifted to a bottleneck in the ability in specification, verification, and understanding, we are producing technically "correct" systems whose rate of quantity exceeds our rate of comprehension and understanding.
The resulting debt is something closer to epistemic debt rather than technical debt: a growing distance between the understanding of the underlying and intricate details we possess about the artifacts we are creating, and the access to the models searching, creating, and giving us those artifacts that we ourselves "possess".

And yet, refusing our search overlords does not seem like a serious answer either.
Pandora's Search Box is open, Prometheus is not returning the fire.
If these AI code generation systems continues to become cheaper, more abundant and commoditized, as historical context of computation suggest so far, then perhaps the differentiating factor will no longer be the ability to produce source code at all, what becomes scarce instead is the ability to specify the right problem, recognize what a good solution is, and understand why the good solution works and if it will stand the test of time.
The age of abundant search may not eliminate expertise, conversely it may increase the value of expertise that are hardest to measure and externalize: taste, abstraction, and judgment.
Perhaps this is where the hope under the rim of the jar remains.

[^1]: I have seen the chaotic discourse from mathematicians and the question if these problems are truly "solved": if no one understands it, does it matter?
I want to highlight that I am not a trained mathematician nor do I have extensive knowledge about the problems that have so far been solved by AI systems, but from what I have been told by people who understand these problems is that "things check out" usually, although at the price of being sloppy.
[^2]: A point I will return to, as capability is relative.
[^3]: Including the famous [Moravec's paradox](https://en.wikipedia.org/wiki/Moravec%27s_paradox) in a way.
[^4]: Note that a sufficient solution does not mean that it will stand the test of time or survive in the face of the complexity of the real world.
[^5]: Note that, AI systems in the task of educating the coming generations is a topic on its own, and a very complex one at that.
[^6]: The motto of the [CSE program](https://www.chalmers.se/en/departments/cse/) here is basically "build a computer and understand how it works".
[^7]: I have seen this quote from both anti-AI and pro-AI folks.
[^8]: "You can just do things", an infamous saying on tech Twitter.
