---
title: "Opening Pandora's Box in the 21st Century"
date: 2026-09-18
image: "../../../assets/paintings/hercules.webp"
draft: true
---
## Standing at the Crossroads
> "Only Hope remained there in an unbreakable home within under the rim of the great jar" -- Hesiod, Works and Days, 96–97, trans. Evelyn-White. @cite:Hesiod1914

These last six months has been quite the turbulent time for many scientific disciplines.
From solving [^1] longstanding open problems in various domains to [solving a Millennium Prize Problem](https://openai.com/index/navier-stokes-solution/).
I have read much of the discourse, both from pure mathematicians to software engineers, over the last few years as AI systems have become progressively more capable [^2].
Just to name a few that I have read recently:
* [Mathematics is effectively dead](https://doomslide.substack.com/p/mathematics-is-effectively-dead) by [`doomslide`](https://x.com/doomslide)
* [A beginning for mathematics](https://proofsandprompts.com/2026/09/14/a-beginning-for-mathematics/) by [Daniel Litt](https://www.daniellitt.com/)
* [My AI Predictions: What Did I Get Right So Far?](https://avt.im/blog/my-ai-predictions-what-did-i-get-right-so-far/) by [Alexander Terenin](https://avt.im/)
* [Asking Authors About Their Own Papers](https://medium.com/@TmlrOrg/asking-authors-about-their-own-papers-3d2e04e5dee0) from [Transactions on Machine Learning Research](https://jmlr.org/tmlr/)

Naturally, I want to provide my slice to the discourse, as I feel like that many focus on what the AI systems ought to do, missing the bigger picture and issues.

## The Pledge
> "He hid fire; but that the noble son of Iapetus stole again for men from Zeus the counsellor in a hollow fennel-stalk." -- Hesiod, Works and Days, 50–52, trans. Evelyn-White. @cite:Hesiod1914

As many others, I recently saw the trailer for the upcoming [Artificial (2026)](https://www.youtube.com/watch?v=rDZplZFnbOk) movie about OpenAI.
I still remember playing around in the GPT-3 playground with the `davinci-002` model, it already felt like magic in those days.
[The Bitter Lesson](http://www.incompleteideas.net/IncIdeas/BitterLesson.html) argued what I call "search is king": general purpose methods when paired with (extensive) computational resources turn out to work wonders.
Is it a mystery that these "search is king" systems have triumphed as they have done?

As many others have argued [^3], I argue that many knowledge problems are underlying search problems; this is especially true for **modern** [^4] software where we are often faced with a problem where we often know a solution a priori, but the challenge lies in a finding a sufficient [^5] solution for our specific needs.
Practical software has always been about creating verifiable systems that solve exact problems.
Naturally, if our output is something that is testable, (formally) verifiable, and paried with a cheat sheet, search _will_ be king.
Consquently, with the rapid expansion, investigation, and optimization of modern computer hardware this has enabled "search is king" to triumph.

Since my undergrad days, have I been interested in search (and conversely entropy), as it always appeared as a natural solution to many problems to me.
For example, there exists a finite amount of Python programs with a maximum of 1000 characters of source code that are able to correctly solve [Fizz buzz](https://en.wikipedia.org/wiki/Fizz_buzz).
Stupid bruteforce will get you nowhere, but it is clear that by utilizing smart heuristics and constraints, one can reduce the search space substanially and being able to find sufficient programs.
The whole field of probabilistic/generative models is the mathematical idea to find a good mapping/transport of the form $f \colon \mathcal{X} \to \mathcal{D}$ where $\mathcal{X}$ is some prior distribution (noise, previous context, training corpus, etc.) and $\mathcal{D}$ is the desired output domain (source code, natural language, etc.).
Thus, the pairing of machine learning + reinforcement learning naturally creates intelligent search machines, and the AI labs have opened **Pandora's Search Box**.

## The Turn
> "But he took the gift, and afterwards, when the evil thing was already his, he understood." -- Hesiod, Works and Days, 89, trans. Evelyn-White. @cite:Hesiod1914

Since ~December of last year, the software community has been aflame in terms of: (i) what the goals, intentions, and incentives of software has been and will be, and (ii) consequently, if this is a natural step up the software abstraction ladder.
I have used computers extensively (and maybe a bit too much...) for the majority of my life.
I have also spent the last ~10 years understanding how computers and software is built from the ground up [^6].
Further, while I still enjoy "recretional programming", I mostly see programming as a means to an end these days.

However, I could not disagree more with people (usually tech bros) that argue that churning out (sloppy) AI code is the way forward.
Do I use AI code generation? Absolutely! They are simply much better at writing _more_ code that (usually) runs/compiles the first time than me.
Do they one-shot _better_ code than me? Sometimes?
Recall that software is an inherent search problem, AI systems today can index an entire codebase and its input-output structures much faster than any human can.
However, merly solving a problem with the correct input-output structure and understanding a _tasteful_ solution and why it is good are two completely disjoint events.
If you spend at least one second on Twitter you will see someone quote the famous Dune quote:

> Once men turned their thinking over to machines in the hope that this would set them free.
But that only permitted other men with machines to enslave them.

I have seen this quote both from the anti-AI folks and pro-AI.
My takeaway here is that understanding and knowledge is still important.
There are countless horror stories of people building sophisticated projects but not being able to escape the search machines, becoming trapped under the search overlords.
On the more academic side, [Asking Authors About Their Own Papers](https://medium.com/@TmlrOrg/asking-authors-about-their-own-papers-3d2e04e5dee0) from [Transactions on Machine Learning Research](https://jmlr.org/tmlr/) recently showed this.
Thus, it is only after we have opened Pandora's Search Box that we understand the blessing and the curse of our search overlords.

## The Prestige
> "But the rest, countless plagues, wander amongst men; for earth is full of evils, and the sea is full." -- Hesiod, Works and Days, 100–101, trans. Evelyn-White. @cite:Hesiod1914

But why would anyone (willingly?) become reliant on opening Pandora's Search box? is it AI psychosis? is it "the incentives"? or is it something else?
I argue that it is all of the above.
I think it is clear that AI labs "moat" is to commoditize search intellgience in some sense, which I inherently support!
We have opened Pandora's Search Box, there is no going back, but we have to commoditize the entire stack and allow anyone to use our search overlords.


[^1]: I have seen the chaotic discourse from mathematicians and the question if these problems are truly "solved".
I want to highlight that I am not a trained mathematician nor do I have extensive knowledge about the problems that have so far been solved by AI systems, but from what I have been told by people that understand these problems is that "things check out" (usually).
[^2]: A point I will return to, as capability is relative.
[^3]: Including the famous [Moravec's paradox](https://en.wikipedia.org/wiki/Moravec%27s_paradox) in a way.
[^4]: Here I define modern as pre AI codegeneration systems.
[^5]: Note that, a sufficent solution does not mean that it will stand the test of time or survive the face of complexity of the real-world.
[^6]: The motto of the [CSE program](https://www.chalmers.se/en/departments/cse/) here is basically "build a computer and understand how it works".
