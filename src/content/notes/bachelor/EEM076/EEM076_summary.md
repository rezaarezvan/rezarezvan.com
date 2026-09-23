---
title: "Part 14 - Summary"
date: 2023-05-19T16:57:46+02:00
math: true
school: [electrical circuits and fields]
---
## Electrical Circuits and Fields

### DC

:::recall[Current]
The rate of flow of electrical charge.
:::

$$
1 \ \mathrm{A} = \dfrac{1 \ \mathrm{C}}{1 \ \mathrm{s}}
$$

$$
1 \ \mathrm{C} = 6.24 \cdot 10^{18}
$$

$$
I(t) = \dfrac{dQ(t)}{dt} \ [\mathrm{A}]
$$

$$
Q(t) = \int_{t_0}^{t} i(t) \, dt + q(t_0)
$$

:::recall[Voltage]
The difference in potential energy between two points, for one Coulomb of charge.
:::

$$
V = \dfrac{\Delta E_p}{q} = \dfrac{W}{q} \ [\mathrm{V}]
$$

:::recall[Resistance]
The opposition to the flow of current.
:::

$$
R = \frac{\rho L}{A} \ [\Omega]
$$

$$
\rho = \text{resistivity of the material}
$$

Ohm's Law:
$$
V = RI
$$

Direction:
From + to -. $V_{ab}$ means $a$ is the positive terminal and $b$ negative. The same goes for $I_{ab}$.

:::recall[KCL]
The sum of current entering the node is equivalent to the sum of current leaving the node.
:::

$$
\sum_{k = 1}^{n} I_{\text{entering}} = \sum_{k = 1}^{n} I_{\text{leaving}}
$$

:::recall[KVL]
The sum of voltages equals zero, for any closed loop.
:::

$$
\sum_{k = 1}^{n} V_k = 0
$$

Power:
$$
P = VI \ [\mathrm{W}]
$$

Energy:
$$
W = \int_{t_1}^{t_2} P(t) \, dt
$$

Equivalent resistance in series:
$$
R_{eq} = R_1 + R_2 + \ldots + R_N
$$

Equivalent resistance in parallel:
$$
R_{eq} = \dfrac{1}{\dfrac{1}{R_1} + \dfrac{1}{R_2} + \ldots + \dfrac{1}{R_N}}
$$

$$
R_{eq} = \dfrac{R_1 R_2}{R_1 + R_2}
$$

$$
R_{eq} = \dfrac{R_1 R_2 R_3}{R_1 R_2 + R_2 R_3 + R_1 R_3}
$$

Voltage Divider (Series):
$$
V_{k} = V_{\text{total}} \cdot \dfrac{R_k}{R_1 + R_2 + \ldots + R_N}
$$

Current Divider (Parallel):
$$
I_{k} = I_{\text{total}} \cdot \dfrac{R_{\text{other}}}{R_1 + R_2 + \ldots + R_N}
$$

For example, for two parallel:
$$
I_{1} = I_{\text{total}} \cdot \dfrac{R_2}{R_1 + R_2}
$$

$$
I_{2} = I_{\text{total}} \cdot \dfrac{R_1}{R_1 + R_2}
$$

Node-Voltage analysis

Idea:

:::algorithm[Node-voltage analysis]{#alg:node-voltage}
1. Find the nodes
2. Assign a reference node (usually, we pick the node with most connections)
3. Assign node voltages (Note, in a circuit with, $N$, nodes we have, $N - 1$, voltages)
4. Then we solve these using KCL on each node ($\sum I_{out} = \sum I_{in}$)
:::

The convention is also the following:

* Consider $i_{out}$ in resistors
* Consider $i_{out}$ as positive
* $V_{\text{current}} - V_{\text{adjacent}}$

Mesh-Current analysis:
Is the opposite of Node-voltage analysis. Therefore, we just apply KVL instead of KCL. Note that this only works for **planar circuits**.

:::recall[Planar circuit]
It is possible to draw it in a plane without crossing wires.
:::

Superposition:
As the name suggests, it's the principle that, given a linear system, the net response caused by two or more stimuli is the sum of these responses.

In our case, the stimuli are voltage/current sources.

So our method is:

:::algorithm[Superposition]{#alg:superposition}
1. Leave **one** source ON and turn all other sources OFF.
   * Voltage sources: $V = 0$, these become *short circuits*.
   * Current sources: $I = 0$, these become *open circuits*.
2. Add the resulting responses to find the total response.
:::

Equivalent circuits:

:::algorithm[Thévenin and Norton equivalents]{#alg:equivalent-circuits}
1. Replace the load, $R_L$, with open/short circuit.
2. Find the short/open circuit current/voltage, $V_{oc} / I_{sc}$.
3. Find the equivalent resistance, $R_{eq}$, of the network with all independent sources turned off.
4. Then:
   * $V_{TH} = V_{oc}$
   * $I_{N} = I_{sc}$
   * $R_{TH} = R_{N} = R_{eq}$
:::

$$
V_{TH} = I_N \cdot R_{eq}
$$

Capacitors:
:::recall[Capacitor]
A capacitor is a device that stores electric charge by creating an electric field between two conductive plates separated by an insulating material.
:::

$$
C = \dfrac{q}{V}
$$

$$
I = C \dfrac{dV}{dt}
$$

$$
P = IV = CV \dfrac{dV}{dt}
$$

$$
\begin{align*}
W(t) & = \int_{t_0}^{t} P(t) \, dt \newline
& = \int_{t_0}^{t} CV \frac{dV}{dt} \, dt \newline
& = C \int_{t_0}^{t} V \, dV \newline
& = \frac{C}{2} [V(t)^2 - V(t_0)^2]
\end{align*}
$$

**If $V = 0$ at $t_0$ then:**
$$
\begin{align*}
W(t) & = \frac{C v(t)^2}{2} & & \| \quad q = CV \newline
W(t) & = \frac{v(t) q(t)}{2} & & \| \quad C = \frac{q}{V} \newline
W(t) & = \frac{q(t)^2}{2C} & & \| \quad V = \frac{q}{C}
\end{align*}
$$

$$
V(t) = \frac{1}{C} \int_{t_0}^{t} i(t) \, dt + V(t_0)
$$

Capacitors in series and parallel:

Parallel:
$$
C_{eq} = C_1 + C_2 + \ldots + C_N
$$

Series:
$$
\dfrac{1}{C_{eq}} = \dfrac{1}{C_1} + \dfrac{1}{C_2} + \ldots + \dfrac{1}{C_N}
$$

* Capacitors are open circuits to DC voltage (If $V$ is constant, then $I = 0$).
* The voltage on a capacitor **cannot** *jump* (Change instantaneously, since then we would have infinite current).
* Capacitors *store* energy ($I \cdot V > 0$), or, deliver energy ($I \cdot V < 0$).

Inductors:
:::recall[Inductor]
An inductor is a component in an electrical circuit that utilizes electromagnetic induction to resist changes in current flow by generating a voltage that opposes the change.
:::

$$
V(t) = L \dfrac{dI}{dt}
$$

$$
I(t) = \frac{1}{L} \int_{t_0}^{t} V(t) \, dt + I(t_0)
$$

Power \& Energy in Inductors
$$
P(t) = I(t) V(t) = I \left(L \frac{dI}{dt}\right) = \frac{dW}{dt}
$$

$$
W = \frac{LI^2}{2}
$$

Inductors in series and parallel:

Series:
$$
L_{eq} = L_1 + L_2 + \ldots + L_N
$$

Parallel:
$$
\dfrac{1}{L_{eq}} = \dfrac{1}{L_1} + \dfrac{1}{L_2} + \ldots + \dfrac{1}{L_N}
$$

* Inductors are **short circuits** to DC voltages (If $I$ constant, then $V = 0$).
* The current through an inductor *cannot* jump (change instantaneously, otherwise we would have infinite voltage).
* Inductors *store* energy ($I \cdot V > 0$), or, deliver energy ($I \cdot V < 0$).

Time-Varying Circuits:

$$
V_{C}(t) = V_{i} e^{-t / \tau}, \quad \text{where } \tau = RC
$$

$$
I(t) = I_{0} e^{-Rt / L}, \quad \text{where } \tau = \frac{L}{R}
$$

### Electrical and Magnetic Fields

Charge:
$$
e^{-} = 1.602 \cdot 10^{-19} \ \mathrm{C}
$$

* **Repulsive** if charges are the **same**.
* **Attractive** if charges are **different**.

Coulomb's Law:
$$
\mathbf{\vec{F}}_{12} = k_{e} \frac{q_1 q_2}{r^2} \hat{r}_{12}
$$

$$
\varepsilon_{0} = \frac{10^{-9}}{36\pi} \approx 8.841 \cdot 10^{-12} \ [\mathrm{F/m}] \ (\text{Farads per meter})
$$

$$
k_e = \frac{1}{4\pi\varepsilon_{0}} \approx 9 \cdot 10^{9} \ [\mathrm{N\,m^2/C^2}]
$$

$$
\mathbf{\vec{E}} = k_{e} \frac{q}{r^2}\hat{r}
$$

$$
\mathbf{\vec{F}}_{E} = q \mathbf{\vec{E}}
$$

Dipoles:
$$
\mathbf{\vec{p}} = q\mathbf{\vec{d}}
$$

Placing a dipole in an electrical field:
$$
\begin{align*}
\mathbf{\vec{\tau}} & = \mathbf{\vec{p}} \times \mathbf{\vec{E}}, \newline
\tau & = p E \sin(\theta).
\end{align*}
$$

Electrical Flux 1D:
$$
\Phi = \sum_{i = 1}^{N} \mathbf{\vec{E}} \cdot \hat{n}
$$

$$
\Phi = \int_{L_{1}}^{L_{2}} \mathbf{\vec{E}}_{l} \cdot \hat{n} \, dl
$$

Electrical Flux 2D:
$$
\Phi = \iint \mathbf{\vec{E}} \cdot \hat{n} \, dA = \iint E \, dA \cos(\theta)
$$

Electrical Flux closed contour:
$$
\Phi = \oiint \mathbf{\vec{E}} \cdot d\mathbf{\vec{A}}
$$

Gauss's Law:
$$
\Phi_{E} = \oiint \mathbf{\vec{E}} \cdot d\mathbf{\vec{A}} = \frac{q}{\varepsilon_{0}}
$$

Work to move charges:
$$
W = \dfrac{k_e q_1 q_2}{R}
$$

Work in an electrical field:
$$
W = -qE_0d
$$

Cheat sheet:
$$
W = -\int \mathbf{\vec{F}} \cdot d\mathbf{\vec{r}}
$$

$$
\mathbf{\vec{E}} = \dfrac{\mathbf{\vec{F}}}{Q}
$$

$$
\Delta V = \dfrac{W}{Q}
$$

$$
\Delta V = -\int \mathbf{\vec{E}} \cdot d\mathbf{\vec{r}}
$$

Capacitors:
$$
q = \sigma A
$$

$$
E = \dfrac{q}{\varepsilon_0 A}
$$

Energy stored in a capacitor:
$$
W = \dfrac{1}{C} \dfrac{Q^2}{2}
$$

Magnetic Fields:
$$
\mathbf{\vec{F}}_B = q\mathbf{\vec{v}} \times \mathbf{\vec{B}}, \quad |\mathbf{\vec{F}}_B| = |q|vB \sin(\theta)
$$

$$
\mathbf{\vec{B}} \ \left[1 \ \mathrm{T} = 1 \ \mathrm{N/(A \cdot m)}\right]
$$

Biot-Savart's law:
$$
d\mathbf{\vec{B}} = \dfrac{\mu_0}{4\pi} \dfrac{I \, d\mathbf{\vec{s}} \times \hat{r}}{r^2}
$$

$$
\mu_0 = 4\pi \cdot 10^{-7} \approx 1.2566 \cdot 10^{-6}
$$

$$
\mathbf{\vec{B}} = \dfrac{\mu_0 I}{4\pi} \int \dfrac{d\mathbf{\vec{s}} \times \hat{r}}{r^2}
$$

$$
B = \dfrac{\mu_0 I}{2\pi r}
$$

$$
B = \dfrac{\mu_0 NI}{l} = \mu_0 nI
$$

Ampere's Law:
$$
\oint \mathbf{\vec{B}} \cdot d\mathbf{\vec{s}} = \mu_0 I_{\text{enc}}
$$

Lorentz Force:
$$
\mathbf{\vec{F}}_E = q\mathbf{\vec{E}}
$$

$$
\mathbf{\vec{F}}_B = q\mathbf{\vec{v}} \times \mathbf{\vec{B}}
$$

$$
\mathbf{\vec{F}} = \mathbf{\vec{F}}_E + \mathbf{\vec{F}}_B = q(\mathbf{\vec{E}} + \mathbf{\vec{v}} \times \mathbf{\vec{B}})
$$

Magnetic Flux:
$$
\Phi_B = \iint \mathbf{\vec{B}} \cdot d\mathbf{\vec{A}} = BA \cos(\theta)
$$

Lenz's Law:
:::recall[Lenz's law]
The induced current produces a magnetic field, which opposes the change in magnetic flux that induces such currents.
:::

Maxwell's Equations:

**Gauss's Law for electrostatics**:
$$
\Phi_E = \oiint \mathbf{\vec{E}} \cdot d\mathbf{\vec{A}} = \dfrac{q}{\varepsilon_0}
$$

**Gauss's Law for magnetism**:
$$
\Phi_B = \oiint \mathbf{\vec{B}} \cdot d\mathbf{\vec{A}} = 0
$$

**Faraday's Law**:
$$
\varepsilon = \oint \mathbf{\vec{E}} \cdot d\mathbf{\vec{s}} = -\dfrac{d \Phi_B}{dt}
$$

**Ampere-Maxwell Law**:
$$
\oint \mathbf{\vec{B}} \cdot d\mathbf{\vec{s}} = \mu_0(I + I_d) = \mu_0\left(I + \varepsilon_0 \dfrac{d \Phi_E}{dt}\right)
$$

If $q = 0$ and $I = 0$:

**Gauss's Law for electrostatics**:
$$
\Phi_E = \oiint \mathbf{\vec{E}} \cdot d\mathbf{\vec{A}} = 0
$$

**Gauss's Law for magnetism**:
$$
\Phi_B = \oiint \mathbf{\vec{B}} \cdot d\mathbf{\vec{A}} = 0
$$

**Faraday's Law**:
$$
\varepsilon = \oint \mathbf{\vec{E}} \cdot d\mathbf{\vec{s}} = -\dfrac{d \Phi_B}{dt}
$$

**Ampere-Maxwell Law**:
$$
\oint \mathbf{\vec{B}} \cdot d\mathbf{\vec{s}} = \mu_0(I + I_d) = \mu_0 \varepsilon_0 \dfrac{d \Phi_E}{dt}
$$

Electromagnetic Waves:
$$
\dfrac{E}{B} = \dfrac{\omega}{k} = c
$$

EMFs in circuits:
:::recall
Electrical field opposes change in voltage.
:::
$$
\begin{align*}
C & = \varepsilon_0 \dfrac{A}{d}, \newline
U & = \dfrac{1}{2} C|V|^2, \newline
I(t) & = C \dfrac{dV}{dt}.
\end{align*}
$$

:::recall
Magnetic field opposes change in the current.
:::
$$
\begin{align*}
L & = \mu_0 N^2 \dfrac{A}{l}, \newline
U & = \dfrac{1}{2} LI^2, \newline
V(t) & = L \dfrac{dI}{dt}.
\end{align*}
$$

### AC

General:

Note: Can be $\cos$, does not matter.
$$
V(t) = V_m \sin(\omega t + \theta)
$$

$$
\begin{align*}
V_m & \quad \text{Amplitude} \ [\mathrm{V}] \newline
\omega & \quad \text{Angular frequency} \ [\mathrm{rad/s}] \newline
\theta & \quad \text{Phase Shift} \ [^\circ \text{ or } \mathrm{rad}] \newline
T & \quad \text{Period} \ [\mathrm{s}] \newline
f & \quad \text{Frequency} \ [\mathrm{Hz}]
\end{align*}
$$

$$
\begin{align*}
T & = \dfrac{2\pi}{\omega} = \dfrac{1}{f}, \newline
\omega & = 2\pi f.
\end{align*}
$$

Root Mean Square (RMS):
$$
\begin{align*}
V_{\text{RMS}} & = \sqrt{\dfrac{1}{T} \int_0^T V^2(t) \, dt} = \dfrac{V_m}{\sqrt{2}}, \newline
I_{\text{RMS}} & = \sqrt{\dfrac{1}{T} \int_0^T I^2(t) \, dt} = \dfrac{I_m}{\sqrt{2}}.
\end{align*}
$$

$$
P_{\text{avg}} = \dfrac{(V_{\text{RMS}})^2}{R} = \dfrac{\left(\dfrac{V_m}{\sqrt{2}}\right)^2}{R} = \dfrac{V_m^2}{2R}
$$

$$
P_{\text{avg}} = (I_{\text{RMS}})^2 R = \left(\dfrac{I_m}{\sqrt{2}}\right)^2 R = \dfrac{I_m^2 R}{2}
$$

Trigonometry:
$$
\text{rad} = \text{deg} \cdot \dfrac{\pi}{180}
$$

$$
\begin{align*}
\sin(\omega t) & = \cos(\omega t - 90^\circ), \newline
\cos(\omega t) & = \sin(\omega t + 90^\circ).
\end{align*}
$$

Rules for comparing the **phase** of two wave functions:
* Both must be written in *either* sine or cosine.
* Both must be written with **positive** amplitude.
* Each has the same constant frequency.

Phasors:

Rectangular form:
$$
\begin{align*}
z & = x + jy \newline
& = |z|(\cos(\varphi) + j \sin(\varphi))
\end{align*}
$$

Polar form:
$$
\begin{align*}
z & = |z|\angle{\theta^\circ} \newline
& = |z|e^{j \theta}
\end{align*}
$$

Polar *to* rectangular form:
$$
\begin{align*}
z & = r\angle{\theta^\circ}, \newline
x & = r \cos(\theta^\circ), \newline
y & = r \sin(\theta^\circ), \newline
z & = x + j y.
\end{align*}
$$

Rectangular *to* polar form:
$$
\begin{align*}
z & = x + jy, \newline
r & = \sqrt{x^2 + y^2}, \newline
\theta & = \arctan{\left(\dfrac{y}{x}\right)}, \newline
z & = r\angle{\theta^\circ}.
\end{align*}
$$

Operations:

Multiplication:
$$
\begin{align*}
a & = (b\angle{c^\circ}) \cdot (d\angle{e^\circ}) \newline
& = b d \angle{(c^\circ + e^\circ)}
\end{align*}
$$

Division:

$$
\begin{align*}
a & = \dfrac{b\angle{c^\circ}}{d\angle{e^\circ}} \newline
& = \dfrac{b}{d} \angle{(c^\circ - e^\circ)}
\end{align*}
$$

Phasor relations:
$$
\begin{align*}
V & = RI, \newline
V & = j\omega LI, \newline
V & = \dfrac{1}{j\omega C} I.
\end{align*}
$$

Impedance:
$$
Z = \dfrac{V}{I}
$$

This means that:
$$
\begin{align*}
Z_{R} & = R, \newline
Z_{L} & = j\omega L, \newline
Z_{C} & = \dfrac{1}{j\omega C} = -j \dfrac{1}{\omega C}.
\end{align*}
$$

Power in AC - general:

$$
\begin{align*}
V(t) & = V_m \cos(\omega t + \theta_V), \newline
I(t) & = I_m \cos(\omega t + \phi_I).
\end{align*}
$$

$$
P(t) = V_m I_m \cos(\omega t + \theta_V) \cos(\omega t + \phi_I)
$$

$$
P(t) = \dfrac{1}{2} V_m I_m \cos(\theta_V - \phi_I) + \dfrac{1}{2} V_m I_m \cos(2 \omega t + \theta_V + \phi_I)
$$

$$
P_{\text{avg}} = \dfrac{V_m I_m}{2} \cos(\theta_V - \phi_I)
$$

$$
P_{\text{avg}} = V_{\text{rms}} I_{\text{rms}} \cos(\theta_V - \phi_I)
$$

Different Types:

* Real Power: $P = V_{\text{rms}} I_{\text{rms}} \cos(\theta_V - \phi_I) \ [\mathrm{W}]$
* Reactive Power: $Q = V_{\text{rms}} I_{\text{rms}} \sin(\theta_V - \phi_I) \ [\mathrm{VAR}]$
* Complex Power: $S = P + jQ$ or in polar form, $S = V_{\text{rms}} I_{\text{rms}} \angle (\theta_V - \phi_I) \ [\mathrm{VA}]$
* Apparent Power: $|S| = V_{\text{rms}} I_{\text{rms}} \ [\mathrm{VA}]$.
