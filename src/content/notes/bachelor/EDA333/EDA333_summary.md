---
title: "Part 9 - Summary"
date: 2023-05-25T11:22:18+02:00
math: true
school: [computer system engineering]
---

### Performance and MIPS

CPU Time for a program:
$$
\begin{align*}
\text{CPU Time} & = \frac{\text{Instructions}}{\text{Program}} \cdot \frac{\text{Clock cycles}}{\text{Instruction}} \cdot \frac{\text{Seconds}}{\text{Clock cycle}} \newline
& = \mathrm{IC} \cdot \mathrm{CPI} \cdot T_c.
\end{align*}
$$

Geometric mean:
$$
\sqrt[n]{\prod_{i = 1}^{n} \text{Execution time ratio}_i}.
$$

MIPS Cheat Sheet:

Register convention:

`$zero` - Always 0

`$v0-1` - Result registers

`$a0-3` - Argument registers

`$t0-9` - Temporary registers

`$s0-7` - Content registers, save for later use

`$sp` - Stack pointer

`$ra` - Return address

Arithmetic:
```
add     $t0, $t0, $t1   #t0 = t0 + t1
addi    $t0, $t0, 5     #t0 = t0 + 5
addu    $t0, $t0, $t1   #t0 = t0 + t1 (unsigned)
addiu   $t0, $t0, 5     #t0 = t0 + 5  (unsigned)


sub     $t0, $t0, $t1   #t0 = t0 - t1
subi    $t0, $t0, 5     #t0 = t0 - 5
subu    $t0, $t0, $t1   #t0 = t0 - t1 (unsigned)
subiu   $t0, $t0, 5     #t0 = t0 - 5  (unsigned)
```

Memory:
```
lw $s0, 0($a0)  # s0 = MEM[a0] (word)
sw $s0, 0($a0)  # MEM[a0] = $s0 (word)


l.d $s0, 0($a0)  # s0, s1 = MEM[a0] (Double word)
s.d $s0, 0($a0)  # MEM[a0] = $s0, $s1 (Double word)
```

Logical:
```
sll $t0, $t1, 2     # t0 := t1 * 4
srl $t0, $t1, 2     # t0 := t1 / 4

and $t0, $t1, $t2   # t0 := t1 & t2
andi $t0, $t1, 2   # t0 := t1 & 2

or $t0, $t1, $t2   # t0 := t1 | t2
ori $t0, $t1, 2   # t0 := t1 | 2

nor $t0, $t1, $zero # := ~(t1)
```

Conditionals:
```
beq rs, rt, L1 # if(rs == rt); Jump to L1
bne rs, rt, L1 # if(rs != rt); Jump to L1
j L1           # Jump to L1
```

Remember:

* Incrementing with 1 and not 4!
* MIPS uses byte addressing

### Pipeline

1. **Fetch** Instruction. PC &rarr; Instruction memory.
2. **Decode** the instruction and read from registers.
3. **Execute** the instruction.
    * Arithmetic/logical computation.
    * Computation of effective memory address.
    * Computation of jump address/conditional address.
4. **Read / Write from / to memory** for load/store instructions.
5. **Write back** the result into the result register (RF).

$$
\textbf{Speedup} = \frac{T_c(\text{Non-pipelined version})}{T_c(\text{Pipelined version})} \approx \text{Number of pipeline stages}.
$$

* Structural hazards
    * A stage is currently busy doing an operation
* Data hazards
    * An instruction that depends on an earlier instruction.
* Control hazards
    * The condition and potential address of a jump has not yet by the instruction fetch.

### Caches

$$
\begin{align*}
h_x & = \textbf{Hit rate} = \text{Percentage of hits in memory } x, \newline
(1 - h_x) = m_x & = \textbf{Miss rate} = \text{Percentage of misses in memory } x, \newline
T_x & = \textbf{Hit time} = \text{Access time for memory } x, \newline
(T_2 - T_1) & = \textbf{Miss penalty} = \text{Miss penalty for a miss in memory } 1.
\end{align*}
$$

*Average Memory Access Time* (AMAT):
$$
\text{AMAT} = h_1 T_1 + m_1 T_2 = h_1 T_1 + (1 - h_1) T_2.
$$

$$
\frac{\text{Memory size}}{\text{Cache size}} = N, \quad \text{Tag bits} = \log_2(N).
$$


### Prep for exam

* MIPS
    * Calculate the amount of access calls to data cache (read and writes) and instruction cache.
* Pipeline
    * TODO: Understand each stage in depth
    * Learn how to do a pipeline diagram
    * Iterate and go over optimizations and how to avoid stalls.
* Performance calculations
    * $\mathrm{CPI} = \mathrm{CPI}_{\text{base}} + \mathrm{CPI}_{\text{miss}}$
    * $\mathrm{CPI}_{\text{miss}} = \mathrm{CPI}_{\text{D miss}} + \mathrm{CPI}_{\text{I miss}}$
* Memory and cache
    * Iterate and go over all the different types, and how to calculate size/amount of bits.
    * Go over how to calculate how long time/amount of time it takes for certain misses, with certain sizes etc.

### Notes

Page table size = Number of virtual pages $\times$ Size of each page table entry

Number of virtual pages = Total virtual address space / Page size

Number of virtual pages = (Number of processes $\times$ Size of each virtual address space) / Page size

Cache Offset: If block size is $B$ bytes, offset $= \log_2(B)$.

Cache Index: Given by how many blocks/sets there are.

If direct mapped, meaning 1 block per set:

Number of blocks = Total Cache Size / Size per block

Number of sets = (Total Cache Size / Size per block) / Associativity level

Cache Index $= \log_2(\text{Number of blocks/sets})$

Cache Tag: If $A$ is the total amount of address bits, tag $= A - \text{offset} - \text{index}$.

$A = \text{tag} + \text{offset} + \text{index}$

TLB Index: If there are $E$ pages, index $= \log_2(E)$.

TLB Tag: Tag is the rest of bits. So, if we have $V$ virtual address bits, tag $= V - \text{index}$.

Calculate the size of each **block entry**. = Number of status bits (valid, dirty etc). + Tag bits + Data bits (Usually block size (in bytes) $\times 8$).

Calculate the size of the cache. = Number of status bits (valid, dirty etc). + Tag bits + Data bits (Usually block size (in bytes) $\times 8$).
