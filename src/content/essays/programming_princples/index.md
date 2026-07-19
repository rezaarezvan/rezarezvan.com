---
title: "Programming Principles"
date: 2023-01-09T17:03:59+01:00
image: "../../../assets/paintings/artist-sketching-mount-desert.webp"
draft: true
---
One of the core things that makes programming fun in my eyes are the standards and conventions that we've built.
I want to write down my principles that I follow when writing code. I think it's an essential part of every engineer that they have their own guidelines and principles they follow.

#### Consistency
Before we even dive into an actual *programming* principle I want to talk about consistency.
Guidelines and principles won't even matter if we aren't consistent with them.
I understand that each team or company will have their own principles to follow.
But I believe that, having and trying to stick to your own principles, will ultimately lead to better code.

#### Naming system
A famous quote that many programmers have probably heard before:

> *There are only two hard things in Computer Science, cache invalidation and naming things* - Phil Karlton.

While I believe there are more than two hard things in computer science, it is true that naming is one of them.
Having a naming convention or system is essential to having a readable and clean codebase.
I could write a whole blog post just about naming things - but I'll suffice to naming a few principles that I follow.

* Be explicit but concise:

There are so many (horrific) examples one could talk, but in reality it's quite simple.

Name your things accordingly, no one (and certainly not your future self)
will understand what the variable `a` represents. But as in all cases, there are edge cases, sometimes names can be too explicit.
`IndexVariableForArrayIndex` can just be `idx`. This is a hard thing to master -
I'm certain that any seniors that have read my code probably saw flaws in my own naming conventions, but let's try to learn, all of us.

* Plan before naming

When creating a larger project I believe it's plan what to name things before *actually* naming them.
It's easy to just begin naming structs, classes, objects etc. without *really* planning for their use or even worse, future improvements.
That's why I strive for to follow a naming system that be expanded upon.

#### Backup your things
This isn't necessarily a programming principle, rather a principle all programmers should follow.
Backup your shit, shit can (and probably will) happen one day. There are plenty of tools that allow one to back up their files easily.
Sometimes a simple symlink script will suffice as well. I myself just keep all my dot files in a [repository](https://github.com/rezaarezvan/.dotfiles).

#### KISS \& DRY
There a lot of principles and acronyms that are meant to remind a programmer to write good, clean solutions that can be reused for later use.

**KISS - Keep it simple, silly**\
**DRY - Don't repeat yourself**

Are two that I like, it reminds one to keep it simple and never repeating yourself.
Which are great guidelines when it comes to writing good and readable code.

* Keeping it simple

Often, implementing the easy and brute force solution **first** is the best.
You have a working solution and now have the time and energy to find a better working one.

In many scenarios it's often the more complex solutions that result in greater results -
but these complex solutions are probably built from the simpler solutions.
That's why I think it's important to keep it simple, *for a start* then trying to expand on your solution.

* Don't repeat yourself

This one should be obvious for many - programming itself allows us to solve problems with many iterative steps.

So writing code that is reusable is an important guideline. Write functions that have their own distinct functionality.

#### Testing
Testing your code, solution, algorithm, you name it. Testing will always lead to finding small bugs or improvements that can be made.
Also for any beginners that might read this, I've heard so many beginners to programming asking "will this work?", "is this correct?" etc.

My answer is always the same - just try it! - you and me are no compilers so, we can't be sure.
A funny quote that I like is: "Fuck around to find out". One can really apply this to any area of life - but I think this certainly holds true for programming.

#### Ergonomics
When I mean ergonomics I don't necessarily mean your posture. I mean developer ergonomics, how comfortable are you with the tools you use every day?

Is there maybe a tool or service that can make you even more comfortable and productive? In recent years we have seen the rise of an AI companion.
Copilot and ChatGPT are certainly something that a lot of developers seem to love. I myself are neutral in those at the moment writing this.

But really knowing, understanding and being comfortable with your OS, editor, WM, programming language, framework, etc.
Will ultimately yield better code, and certainly at a faster rate. So try something new, it just might be the thing that boosts your productivity.

#### Summary
The common theme in this post is that, trying out new stuff and finding what fits you, and really sticking to those things -
is what makes a great engineer in my eyes.
I hope my words had some impact and the person reading this, will try to find their own programming principles, and sticking to them.
