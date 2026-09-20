---
title: "Opening Pandora's Box in the 21st Century"
date: 2026-09-18
image: "../../../assets/paintings/hercules.webp"
---
## Standing at the Crossroads
> "Only Hope remained there in an unbreakable home within under the rim of the great jar" -- Hesiod, Works and Days, 96–97, trans. Evelyn-White. @cite:Hesiod1914

These last six months have been quite turbulent for many scientific disciplines.
From solving [^1] longstanding open problems and conjectures in various domains, to [solving one of the Millennium Prize Problem](https://openai.com/index/navier-stokes-solution/), AI systems and the modern labs have formally chosen to step into the realm of science.
I have tried my best to follow the discourse of AI, science, and engineering, ranging from pure mathematics to empirical software engineering, during this period as AI systems have become progressively more capable [^2].
To name a few that I have read recently:
* [Mathematics is effectively dead](https://doomslide.substack.com/p/mathematics-is-effectively-dead) by [`doomslide`](https://x.com/doomslide)
* [A beginning for mathematics](https://proofsandprompts.com/2026/09/14/a-beginning-for-mathematics/) by [Daniel Litt](https://www.daniellitt.com/)
* [My AI Predictions: What Did I Get Right So Far?](https://avt.im/blog/my-ai-predictions-what-did-i-get-right-so-far/) by [Alexander Terenin](https://avt.im/)
* [Asking Authors About Their Own Papers](https://medium.com/@TmlrOrg/asking-authors-about-their-own-papers-3d2e04e5dee0) from [Transactions on Machine Learning Research](https://jmlr.org/tmlr/)
* [Culture Becomes a Dark Forest](https://www.theintrinsicperspective.com/p/culture-becomes-a-dark-forest) by [Erik Hoel](https://substack.com/@erikhoel)

As the discourse continues, I want to provide my slice to it as a [newly appointed PhD student in AI](/essays/science), as me and my peers, in both academia and industry, are at the imminent frontier of the future where AI might be the cornerstone.

## The Pledge
> "He hid fire; but that the noble son of Iapetus stole again for men from Zeus the counsellor in a hollow fennel-stalk." -- Hesiod, Works and Days, 50–52, trans. Evelyn-White. @cite:Hesiod1914

Like many others, I recently saw the trailer for the upcoming [Artificial (2026)](https://www.youtube.com/watch?v=rDZplZFnbOk) movie about OpenAI.
I remember playing around in the GPT-3 playground with the `davinci-002` model early on, I remember being fascinated by the OpenAI Five project and how such a simple algorithm, when paired with extensive heuristics and compute, could solve such a complex objective.
For me, these were the first times I felt the _magic_ of AI systems.

I quite often hear these expressions about AI systems: "feel the magic", "feel the AGI", "can you feel it anon?"
Admittedly, the last one only on various internet forums, but what is it we are feeling exactly?
What feelings or experiences are these AI systems conveying and in what manner to cause us to view their actions as magic?

[The Bitter Lesson](http://www.incompleteideas.net/IncIdeas/BitterLesson.html) argued what I summarize as "search is king": when general-purpose methods are paired with extensive computational resources, their output is usually much better than many abstractions and/or domain-specific methods.
I will not be hypothesizing as to _why_ this is the case, I will simply swallow this bitter pill and accept it.
But, given this assumption it still does not answer our question of why these "search is king" systems impart a mystical feeling.

Since I am a trained computer engineer, I will mainly focus on programming, partly motivated because AI code generation is one of the cornerstones of the evolving frontier, but mainly since this is where my expertise lies.
As many others have argued [^3], I argue that many knowledge problems in which modern AI systems have excelled at are underlying search problems.
Further, I argue that this is especially true for software engineering, where we are often faced with a problem for which we often know _a solution_ a priori, but the challenge lies in finding a sufficient [^4] solution for the specific input-output constraints in the specific context.
I have been fortunate enough to have been surrounded by both smart and competent software engineers for a large portion of my life, in both my anecdotal experience and from what I have gathered from industry veterans, you often know _a solution_; however, it is often not the perfect fit in the specific context and potentially violates the expected input-output invariants that are constraining.
Also, here I am assuming that the people responsible for solving these problems are knowledgeable and trained, and not students in the phase of learning [^5].

Practical software has always been about creating verifiable systems that solve exact problems.
Naturally, if our output is something that is testable, (formally) verifiable, and often paired with a cheat sheet of sort, it is not surprising that search will be king.
Even before modern AI code generation, people understood this and extensively researched how one can effectively search for good computer programs, the ambition to automate programming is almost as old as AI itself @cite:Gulwani2017.
Consequently, the rapid expansion, investigation, and optimization of modern computer hardware have enabled "search is king" to materlize over the decades and this decade it was time for triumph.
Just as Sutton argued in the bitter lessson, one of the prerequisites is that we need scale, without the absurd advancements in modern computer hardware, we would not have been here; appreciate the shoulders of the giants we are standing on.

> "Since the inception of AI in the 1950s, this problem has been considered the holy grail of Computer Science." @cite:Gulwani2017

I have been interested in search (and by extension, in entropy) since my undergrad days, as it always appeared as a natural solution to many problems.
For example, it is not hard to accept that there exists a finite number of computer programs written in Python with a maximum of 1000 characters of source code that are able to correctly solve [Fizz buzz](https://en.wikipedia.org/wiki/Fizz_buzz), although a ridiculous number nonetheless.
Stupid brute force will get you nowhere, but it is clear that by utilizing heuristics and constraints, one can reduce the search space substantially and thereby find sufficient programs.
Arguably, we have known that search is and will be king, we have understood its applications and where it is applicable for a long time.

## The Turn
> "But he took the gift, and afterwards, when the evil thing was already his, he understood." -- Hesiod, Works and Days, 89, trans. Evelyn-White. @cite:Hesiod1914

Since ~December of last year, the software engineering community has been aflame in attempts to define and answer the following questions: (i) what the goals, intentions, and incentives of software have been and will be in the future, and (ii) consequently, whether modern AI systems are the natural next step up the _software abstraction ladder_ or not?
For people outside or not familiar with the concept of the software abstraction, it refers to the hierarchical details that are hidden or unnoticeable at a higher level.
The distinctions between high- and low-level languages, machine- and hand-optimized code, and even compiler heuristics are all a part of this beautiful Jacob's ladder.

I have used computers extensively (and maybe a bit too much...) for the majority of my life.
I have also spent the last ~10 years understanding how computers and software are built from the ground up [^6].
While I still enjoy "recreational programming", I mostly see programming as a means to an end these days.
I still consider programming to be an art in the hands of an artist, but in the hands of an engineer, or anyone who is not an artist, it is usually a tool.

However, I could not disagree more with people, usually "tech bros" as they are known colloquially, who argue that churning out (sloppy) AI generated code is the way forward and the natural step upon Jacob's software ladder.
I want to make a few points clear before I state my stance here.
Do I use AI code generation? Absolutely! AI code generation is simply much better at writing _more_ code that (usually) runs/compiles the first time than I am.
Do they one-shot _better_ code than I do? I find this to be a slippery slope.
Once something is commoditized, our non-human inventions outperform us in terms of speed and quantity, what can usually still stand is the quality.
The capability of AI code generation is largely relative, in the sense that, as of writing this, they are able to solve many tasks sufficiently, but still not sufficiently at the frontier.
Whether AI code generation will be able to do so, or what the consequences are assuming that it will, is entirely speculative or political and thus a topic on its own.
Alas, I argue that the capability of these AI systems are relative to the actor utilizing them and largely in what context, as the training corpus and what knowledge can be retrived have a physical limitation in what can be retrived from the weights.

Recall our stance that software is an inherent search problem; AI systems today can index an entire codebase and better understand its input-output structures much faster than any human can.
Much of the shared view in the current software industry is that: AI code generation is useful for writing code, but you are essentially orchestrating solutions and not writing as much code by hand, for many tasks, _a lot_ of orchestration can be needed, but the mere speedup and code quantity are still often preferred, not always by choice.
However, merely solving a problem with the correct input-output structure and understanding a _tasteful_ solution and why it is good are two completely disjoint events.
If you have spent at least one second on tech Twitter, I belive that you have seen someone quote this famous Dune quote:

> Once men turned their thinking over to machines in the hope that this would set them free.
But that only permitted other men with machines to enslave them. [^7]

I want to comment and dissect this quoite; I have seen countless horror stories of people building sophisticated projects and tools, and I have even sometimes fallen into this trap myself when "vibecoding" various curiosities: once the token limit has been hit, they are not able to do work on their own, becoming trapped under the "search overlords".
But why is this the case? The answer again lies in search: AI code generation is such an easy "button-presser" task that you are able to churn out immense amounts of code in a short time.
However, fully understanding and internalizing the codebase takes time for humans, even when you are handwriting all the code it takes a lot of time, although at a much closer relationship of time--to--understanding I would say.
This is why I dislike when people (miss)use the quote above, we are not turning our thinking over to the machines, we are turning over the scale of search, time, and effort to the machines, all of which are a proxy of understanding.
In many settings, execution, results, and progress are appreciated myopic measures that drives direction, if this is a correct, just, and valuable system and what possible alternatives there exists is hard to answer and political in many cases, but I suspect that these are not the best measures for longevity.

Let me for a moment comment on the more academic side of things, as I will be spending the next five years in an academic environment.
[Asking Authors About Their Own Papers](https://medium.com/@TmlrOrg/asking-authors-about-their-own-papers-3d2e04e5dee0) from [Transactions on Machine Learning Research](https://jmlr.org/tmlr/) recently highlighted a similar issue as described above.
I have followed the academic discourse at large, from the macro scale of universities and teaching the next generations to the micro scale of how workshops, conferences, and peer review will adapt in the age of AI [^8].
Many of these topics are political, or at the very least influenced and steered by politics, but it is clear that the current systems were not built for this scale, and I have seen many proposals that, in summary, say "either make everything open and let us fight for reputation" or "it is time that we return to our ivory towers, secretive work is what lies ahead".
While it is hard to predict which of these extremes, or what mixture of them, will play out, I personally believe and hope in the former more than the latter.
But I digress from this side point, although it is something that will be on my mind, and other (to-be) tenured seniors, for a while.

We have opened Pandora's Search Box and there is no going back, the magic felt by these AI systems is simply the extensive ability to search, at scale, but what is the catch? What is the surprising last act of the magic trick?

## The Prestige
> "But the rest, countless plagues, wander amongst men; for earth is full of evils, and the sea is full." -- Hesiod, Works and Days, 100–101, trans. Evelyn-White. @cite:Hesiod1914

To understand what is happening in the 2020s and why "tokenmaxxing" is an expression that is used in some internet cultures, I want us to first consider the culture of programming in the 2000s and 2010s.
Like many others, I grew up with [The Social Network](https://en.wikipedia.org/wiki/The_Social_Network) and the idea that anyone, even with the simplest of tools, but with the highest of ambitions, can build anything [^9].
The infamous startup culture that grew out in Silicon Valley has often reflected this and has enabled many great inventions throughout the decades.
However, with the introduction of AI code generation systems into our software workflows, I think a modification is required to the statement.

> [...] and the idea that anyone, ~~even~~ with the ~~simplest~~ available **costly** tools, but with the highest ambitions [...]

Now, we return to idea of ["tokenmaxxing"](https://tokenmaxxing.com/guides/what-is-tokenmaxxing).
By treating the number of tokens and use of AI code generation as a myopic metric for output and performance, I no longer believe in the sentiment that anyone can build anything with the simplest tools.
To clarify, I am not implying that it will be impossible, that is a silly idea, what I am getting at is that this is the culture shift we are seeing.

So is this it, then? Is the catch and the surprising last act of the magic trick of these AI systems that we are being lured in and trapped into AI code generation and that this is the field's future?
Perhaps, but this is might only be the fate of practical software and software that requires output in the form of revenue or something of interest.
All of this leads me to believe that practical software is going to become costly.
Let me clarify what I mean by costly: it is not only the cost and access to AI systems, traditional software also requires computational resources which has a cost, the difference is that access to sufficient tools is becoming part of the creation of software itself.

The early Zuckerberg and Silicon Valley era illuminated the idea that, given a laptop, time, and basic understanding, but lots of ambition, vision and conviction, you could build anything your heart desired.
The teenagers in a garage using only Vim and GCC, slamming energy drinks like it is water, could build something just as good, if not better, than the large corporations, all while using simple tools.
But what is happening today is that amount software you produce is becoming inherently proportional to the amount of search you can afford.
"Tokenmaxxing" is interesting because it is the precise cultural manifestation of this phenomena: abuse search, more agents, larger contexts, tokenmaxxing.
The ethos of tokenmaxxing is greedy and myopic: if one failed search attempt costs nothing, why not just search again, again, and again until success? if the performance of a swarm agents perform better than a single agent, but at a higher cost, we still want to run the swarm of course! if a larger context window allows you to fit the entire codebase in-context, we are of course going to buy the model with the largest context window!?

But arguably, does a tenfold increase in the amount of source code make tokenmaxxers any more capable of understanding their source code?
The compiler can verify syntax and compile a source program down to machine code for free for us, the implemented test suite can verify the expected behavior of however many specifications we have prompted for, and a formal system can even verify stated invariants and ensure formal proofs of no violations.
If we have access to god-like black-boxes in the form of search overlords, in combination of guardrails that ensure the exact behaviour we want, does it matter?
None of these gives the tokenmaxxing engineer behind it a compressed understanding of why the underlying system and source code looks the way it does or what would need to should change when the world around it changes.
The tokenmaxxing engineer simply needs to adhere to the search overlords and accept this fate, or spend an immense amount of time digesting the codebase, its tests, specifications, and verify everything the old fashioned way.
This is what I argue is the reason in the update of the quote above and why I believe practical software is going to become costly.

In the end, we are bestowed with the idea that, the bottleneck in the creation of software is no longer low-level understanding, laborious effort, and time, but rather lies in the ability in precise problem specification, formal verification, and high-level understanding, presented as the veil of producing technically "correct" systems whose rate of quantity excees the rate of comprehension and understanding we are sold this illusion of the magic trick of AI systems and their ability of search.
Whether this will be objectively better, in the sense that mundande everyday tasks, or even solving open frontier problems, will be done in a more resource efficient manner while yielding the same if not better performance, is a task of an oracle to tell us.
However, it is possible to compare the different debts these two entail, the resulting debt of tokenmaxxing is something closer to epistemic debt rather than traditional technical debt thas has plauged the software industry over the decades: the evergrowing distance between our understanding of the underlying and intricate details we possess about the artifacts we are creating will grow proportional to the amount of access we have the models searching, creating, and giving us artifacts that we "possess".

And yet, refusing our search overlords does not seem like a serious answer either.
Pandora's Search Box is open, Prometheus is not returning the fire.
As AI code generation continues to become evermore cheaper, more abundant and commoditized at scale, as historical context of computation has suggested so far, then perhaps we have to accept the fate that the differentiating factor will no longer be the ability to understand source code at all, the scarcity instead lies in the aforementioned abilities above.
Perhaps this is where the hope under the rim of the jar remains.
All of this leads me to believe that practical software is going to become costly.

[^1]: I have seen the chaotic discourse from mathematicians and the question if these problems are truly "solved": if no one understands it, does it matter?
I want to highlight that I am not a trained mathematician nor do I have extensive knowledge about the problems that have so far been solved by AI systems, but from what I have been told by people who understand these problems is that "things check out" usually, although at the price of being sloppy.
[^2]: A point I will return to, as capability is relative.
[^3]: Including the famous [Moravec's paradox](https://en.wikipedia.org/wiki/Moravec%27s_paradox) in a way.
[^4]: Note that a sufficient solution does not mean that it will stand the test of time or survive in the face of the complexity of the real world.
[^5]: Note that, AI systems in the task of educating the coming generations is a topic on its own, and a very complex one at that.
[^6]: The motto of the [CSE program](https://www.chalmers.se/en/departments/cse/) here is basically "build a computer and understand how it works".
[^7]: I have seen this quote from both anti-AI and pro-AI folks.
[^8]: Update, as of writing this we are seeing reports over [60 000 submissions](https://x.com/denny_zhou/status/2101474965405253708/photo/1) to [ICLR 2027](https://iclr.cc/)
[^9]: "You can just do things", an infamous saying on tech Twitter.
