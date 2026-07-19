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
1 A = \dfrac{1 C}{1 s}
$$

$$
1 C = 6.24 \cdot\ 10^{18}
$$

$$
I(t) = \dfrac{dQ(t)}{dt}\ [A]
$$

$$
Q(t) = \int_{t_0}^{t} i(t) dt + q(t_0)
$$

:::recall[Voltage]
The difference in potential energy between two points, for one Coulomb of charge.
:::

$$
V = \dfrac{\Delta E_p}{q} = \dfrac{W}{q}\ [V]
$$

:::recall[Resistance]
The opposition to the flow of current.
:::

$$
R = \frac{\rho L}{A}\ [\Omega]
$$

$$
\rho = \text{resistivity of the material}
$$

Ohm's Law:
$$
V = RI
$$

Direction:
From + to -. $V_{ab}$ means $a$ is the positive terminal and $b$ negative. The same goes for $I_{ab}$

:::recall[KCL]
The sum of current entering the node is equivalent to the sum of current leaving the node.
:::

$$
\sum_{k = 1}^{n}\ I_{entering} = \sum_{k = 1}^{n}\ I_{leaving}
$$

:::recall[KVL]
The sum of voltages equals zero, for any closed loop.
:::

$$
\sum_{k = 1}^{n}\ V_k = 0
$$

Power:
$$
P = VI\ [W]
$$

Energy:
$$
W = \int_{t_1}^{t_2} P(t) dt
$$

Equivalent resistance in series:
$$
R_{eq} = R_1 + R_2 + \ldots\ R_N
$$

Equivalent resistance in parallel:
$$
R_{eq} = \dfrac{1}{\dfrac{1}{R_1} + \dfrac{1}{R_2} + \ldots\ + \dfrac{1}{R_N}}
$$

$$
R_{eq} = \dfrac{R_1 R_2}{R_1 + R_2}
$$

$$
R_{eq} = \dfrac{R_1 R_2 R_3}{R_1 R_2 + R_2 R_3 + R_1 R_3}
$$

Voltage Divider (Series):
$$
V_{k} = V_{total} \cdot\ \dfrac{R_k}{R_1 + R_2 + \ldots\ R_N}
$$

Current Divider (Parallel):
$$
I_{k} = I_{total} \cdot\ \dfrac{R_{other}}{R_1 + R_2 + \ldots\ R_N}
$$

For example, for two parallel:
$$
I_{1} = I_{total} \cdot\ \dfrac{R_2}{R_1 + R_2}
$$

$$
I_{2} = I_{total} \cdot\ \dfrac{R_1}{R_1 + R_2}
$$

Node-Voltage analysis

Idea:
1. Find the nodes
2. Assign a reference node (usually, we pick the node with most connections)
3. Assign node voltages (Note, in a circuit with, $N$, nodes we have, $N - 1$, voltages)
4. Then we solve these using KCL on each node ($\sum\ I_{out} = \sum\ I_{in}$)

The convention is also the following:

* Consider $i_{out}$ in resistors

* Consider $i_{out}$ as positive

* $V_{current} - V_{adjacent}$

Mesh-Current analysis:
Is the opposite of Node-voltage analysis. Therefore, we just apply KVL instead of KCL. Note that this only forks for **planar circuits**.

:::recall[Planar circuit]
It is possible to draw it in a plane without crossing wires.
:::

Superposition:
As the name suggest, it's the principle that, given a linear system, the net response caused by two or more stimuli is the sum of these respones.

In our case, the stimuli are voltage/current sources.

So our method is:

* Leave **one** source ON and turn all other sources OFF.

    * Voltage sources: $V = 0$, these become *short circuits*.

    * Current sources: $I = 0$, these become *open circuits*.

* Add the resulting responses to find the total response.

Equivalent circuits:

1. Replace the load, $R_L$, with open/short circuit.
2. Find the short/open circuit current/voltage, $V_{oc} / I_{sc}$.
3. Find the equivalent resistance, $R_{eq}$, of the network with all independent sources turned off.
4. Then:

    * $V_{TH} = V_{oc}$

    * $I_{N}  = I_{sc}$

    * $R_{TH} = R_{N} = R_{eq}$

$$
V_{TH} = I_N \cdot\ R_{eq}
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
W(t) = \int_{t_0}^{t}\ P(t)\ dt \newline
W(t) = \int_{t_0}^{t}\ CV \frac{dV}{dt}\ dt \newline
W(t) = C \cdot\ \int_{t_0}^{t}\ V\ dV \newline
W(t) = \frac{C}{2} [V(t)^2 - V(t_0)^2]
$$

**If $V = 0$ at $t_0$ then:**
$$
W(t) = \frac{C \cdot\ v(t)^2}{2} \quad \| \quad q = CV \newline
W(t) = \frac{v(t)\ q(t)}{2} \quad \| \quad C = \frac{q}{V} \newline
W(t) = \frac{q(t)^2}{2C} \quad \| \quad V = \frac{q}{C}
$$

$$
V(t) = \frac{1}{C} \int_{t_0}^{t}\ i(t)\ dt + V(t_0)
$$

Capacitors in series and parallel:

Parallel:
$$
C_{eq} = C_1 + C_2 + \ldots\ + C_N
$$

Series:
$$
C_{eq} = \dfrac{1}{C_1} + \dfrac{1}{C_2} + \ldots\ + \dfrac{1}{C_N}
$$

* Capacitors are open circuits to DC voltage (If $V$ is constant, then $I = 0$).

* The voltage on a capacitor **cannot** *jump* (Change instantaneously, since then we would have infinite current).

* Capacitors *store* energy ($I \cdot\ V > 0$), or, deliver energy ($I \cdot\ V < 0$).

Inductors:
:::recall[Inductor]
An inductor is a component in an electrical circuit that utilizes electromagnetic induction to resist changes in current flow by generating a voltage that opposes the change.
:::

$$
V(t) = L \dfrac{dI}{dt}
$$

$$
I(t) = \frac{1}{L} \int_{t_0}^{t}\ V(t) dt + I(t_0)
$$

Power \& Energy in Inductors
$$
P(t) = I(t) V(t) = I(L\ \frac{dI}{dt}) = \frac{dW}{dt}
$$

$$
W = \frac{LI^2}{2}
$$

Inductors in series and parallel:

Series:
$$
L_{eq} = L_1 + L_2 + \ldots\ L_N
$$

Parallel:
$$
L_{eq} = \dfrac{1}{L_1} + \dfrac{1}{L_2} + \ldots\ \dfrac{1}{L_N}
$$

* Inductors are **short circuits** to DC voltages (If $I$ constant, then $V = 0$).

* The current through an inductor *cannot* jump (change instantaneously, otherwise we would have infinite voltage).

* Inductors *store* energy ($I \cdot\ V > 0$), or, deliver energy ($I \cdot\ V < 0$).

Time-Varying Circuits:

$$
V_{C}(t) = V_{i}\ e^{\frac{-t}{\tau}} \quad \text{, where $\tau$ is:} \newline
\tau = RC
$$

$$
I(t) = I_{0}\ e^{\frac{-Rt}{L}} \newline
\tau = \frac{L}{R}
$$

### Electrical and Magnetic Fields

Charge:
$$
e^{-} = 1.602 \cdot\ 10^{-19} C
$$

* **Repulsive** if charges are the **same**.

* **Attractive** if charges are **different**.

Coulomb's Law:
$$
\mathbf{\vec{F_{12}}} = k_{e}\ \frac{q_1 q_20}{r^2} \hat{r_{12}}
$$

$$
\varepsilon_{0} = \frac{10^{-9}}{36\pi} \approx 8.841 \cdot\ 10^{-12}\ \left[\dfrac{F}{m}\right]\ (\text{Farads per meter})
$$

$$
k_e = \frac{1}{4\pi\varepsilon_{0}} \approx 9 \cdot\ 10^{9}\ \left[\dfrac{Nm^2}{C^2}\right]
$$

$$
\mathbf{\vec{E}} = k_{e}\ \frac{q}{r^2}\hat{r}
$$

$$
\mathbf{\vec{F_{E}}} = q\ \mathbf{\vec{E}}
$$

Dipoles:
$$
\mathbf{\vec{p}} = q\mathbf{\vec{d}}
$$

Placing a dipole in an electrical field:
$$
\mathbf{\vec{\tau}} = \mathbf{\vec{p}} \times \mathbf{\vec{E}} \newline
\tau = p \cdot\ E\ sin(\theta)
$$

Electrical Flux 1D:
$$
\Phi = \sum_{i = 1}^{N}\ \mathbf{\vec{E}} \cdot\ \hat{n}
$$

$$
\Phi = \int_{L_{1}}^{L_{2}}\ \mathbf{\vec{E_{l}}} \cdot\ \hat{n} \cdot\ dl
$$

Electrical Flux 2D:
$$
\Phi = \iint \mathbf{\vec{E}} \cdot\ \hat{n} \cdot\ d\mathbf{\vec{A}} = \iint \mathbf{\vec{E}} \cdot\ d\mathbf{\vec{A}}\ cos(\theta)
$$

Electrical Flux closed contour:
$$
\Phi = \oiint\ \mathbf{\vec{E}} \cdot\ d\mathbf{\vec{A}}
$$

Gauss's Law:
$$
\Phi_{E} = \oiint \mathbf{\vec{E}} \cdot\ d\mathbf{\vec{A}} = \frac{q}{\varepsilon_{0}}
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
W = - \int \mathbf{\vec{F}} \cdot\ dr
$$

$$
\mathbf{\vec{E}} = \dfrac{\mathbf{\vec{F}}}{Q}
$$

$$
\Delta V = \dfrac{W}{Q}
$$

$$
\Delta V = - \int \mathbf{\vec{E}} \cdot\ dr
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
W = \dfrac{1}{C}\ \dfrac{Q^2}{2}
$$

Magnetic Fields:
$$
\mathbf{\vec{F}_B} = q\mathbf{\vec{v}} \times \mathbf{\vec{B}} = |q|vB\ sin(\theta)
$$

$$
\mathbf{\vec{B}} \left[1\ T = 1 \dfrac{N}{A \cdot\ m}\right]
$$

Biot-Savarts law:
$$
d\mathbf{\vec{B}} = \dfrac{\mu_0}{4\pi} \dfrac{I\ d\mathbf{\vec{s}} \times \mathbf{\vec{r}}}{r^2}
$$

$$
\mu_0 = 4\pi \cdot\ 10^{-7}\ \approx 1.2566 \cdot\ 10^{-6}
$$

$$
\mathbf{\vec{B}} = \dfrac{\mu_0 I}{4\pi} \int \dfrac{d\mathbf{\vec{s}} \times \mathbf{\vec{r}}}{r^2}
$$

$$
B = \dfrac{\mu_0 I}{2\pi r}
$$

$$
B = \dfrac{\mu_0 NI}{l} = \mu_0 nl
$$

Ampere's Law:
$$
\oint \mathbf{\vec{B}} \cdot\ d\mathbf{\vec{s}} = \mu_0 I_{enc}
$$

Lorentz Force:
$$
\mathbf{\vec{F}_E} = q\mathbf{\vec{E}}
$$

$$
\mathbf{\vec{F}_B} = q\mathbf{\vec{v}} \times \mathbf{\vec{B}}
$$

$$
\mathbf{\vec{F} = \mathbf{\vec{F}_E} + \mathbf{\vec{F}_B} = q(\mathbf{\vec{E}} + \mathbf{\vec{v}} \times \mathbf{\vec{B}})}
$$

Magnetic Flux:
$$
\Phi_B = \int \int \mathbf{\vec{B}} \cdot\ d\mathbf{\vec{A}} = BA\ cos(\theta)
$$

Lenz Law:
:::recall[Lenz's law]
The induced current produces a magnetic field, which oppose the change in magnetic flux that induces such currents.
:::

Maxwell's Equations:

**Gauss's Law for electrostatics**:
$$
\Phi_E = \oiint \mathbf{\vec{E}} \cdot\ d\mathbf{\vec{A}} = \dfrac{q}{\mu_0}
$$

**Gauss's Law for magnetism**:
$$
\Phi_B = \oiint \mathbf{\vec{B}} \cdot\ d\mathbf{\vec{A}} = 0
$$

**Faraday's Law**:
$$
\varepsilon = \oint \mathbf{\vec{E}} \cdot d\mathbf{\vec{s}} = -\dfrac{d \Phi_B}{dt}
$$

**Ampere-Maxwell Law**:
$$
\varepsilon = \oint \mathbf{\vec{B}} \cdot d\mathbf{\vec{s}} = \mu_0(I + I_d) = \mu_0\left(I + \varepsilon_0 \dfrac{d \Phi_E}{dt}\right)
$$

If q = 0 and I = 0:

**Gauss's Law for electrostatics**:
$$
\Phi_E = \oiint \mathbf{\vec{E}} \cdot\ d\mathbf{\vec{A}} = 0
$$

**Gauss's Law for magnetism**:
$$
\Phi_B = \oiint \mathbf{\vec{B}} \cdot\ d\mathbf{\vec{A}} = 0
$$

**Faraday's Law**:
$$
\varepsilon = \oint \mathbf{\vec{E}} \cdot d\mathbf{\vec{s}} = -\dfrac{d \Phi_B}{dt}
$$

**Ampere-Maxwell Law**:
$$
\varepsilon = \oint \mathbf{\vec{B}} \cdot d\mathbf{\vec{s}} = \mu_0(I + I_d) = \mu_0 \varepsilon_0 \dfrac{d \Phi_E}{dt}
$$

Electromagnetic Waves:
$$
\dfrac{E}{B} = \dfrac{\omega}{k} = c
$$

EMFs in circuits:
:::recall
Electrical field opposes change in voltage
:::
$$
C = \varepsilon_0 \dfrac{A}{d} \newline
U = \dfrac{1}{2} C|V^2| \newline
I(t) = C \dfrac{dV}{dt}
$$

:::recall
Magnetic field opposes change in the current
:::
$$
L = \mu_0 N^2 \dfrac{A}{l} \newline
U = \dfrac{1}{2} LI^2 \newline
V(t) = L \dfrac{dI}{dt}
$$

### AC

General:

Note: Can be $\cos$, does not matter.
$$
V(t) = V_m \sin(\omega t + \theta)
$$

$$
V_m - \text{Amplitude}\ [V] \newline
\omega - \text{Angular frequency}\ \left[\dfrac{rad}{s}\right] \newline
\theta - \text{Phase Shift} \left[^\circ\ \text{or}\ rad \right] \newline
T - \text{Period}\ [s] \newline
f - \text{Frequency}\ [Hz] \newline
$$

$$
T = \dfrac{2\pi}{\omega} = \dfrac{1}{f} \newline
\omega = 2\pi f
$$

Root Mean Square (RMS):
$$
V_{RMS} = \sqrt{\dfrac{1}{T} \int_0^T V^2(t) dt} = \dfrac{V_m}{\sqrt{2}} \newline
I_{RMS} = \sqrt{\dfrac{1}{T} \int_0^T I^2(t) dt} = \dfrac{I_m}{\sqrt{2}}
$$

$$
P_{Avg} = \dfrac{(V_{RMS})^2}{R} = \dfrac{\left(\dfrac{V_m}{\sqrt{2}}\right)^2}{R} = \dfrac{V_m^2}{2R} \newline
$$

$$
P_{Avg} = (I_{RMS})^2 R = \left(\dfrac{I_m}{\sqrt{2}}\right)^2 R = \dfrac{I_m^2 R}{2}
$$

Trigonometry:
$$
rad = deg \cdot\ \dfrac{\pi}{180}
$$

$$
sin(\omega t) = cos(\omega t - 90^\circ) \newline
cos(\omega t) = sin(\omega t + 90^\circ)
$$

Rules for comparing the **phase** of two wave functions:
* Both must be written in *either* sine or cosine.

* Both must be written with **positive** amplitude.

* Each have the same constant frequency.

Phasors:

Rectangular form:
$$
z = x + jy \newline
z = |z|(cos(\varphi) + j sin(\varphi))
$$

Polar form:
$$
z = |z|\angle{\theta^\circ} \newline
z = |z|e^{j \theta^\circ}
$$

Polar *to* rectangular form:
$$
z = r\angle{\theta^\circ} \newline
x = r cos(\theta^\circ) \newline
y = r cos(\theta^\circ) \newline
z = x + j y
$$

Rectangular *to* polar form:
$$
z = x + jy \newline
r = \sqrt{x^2 + y^2} \newline
\theta  = \arctan{\left(\dfrac{y}{x}\right)} \newline
z = r\angle{\theta^\circ} \newline
$$

Operations:

Multiplication:
$$
a = (b\angle{c^\circ}) \cdot\ (d\angle{e^\circ}) \newline
a = (b \cdot\ d \angle{c^\circ + e^\circ})
$$

Division:

$$
a = \dfrac{(b\angle{c^\circ})}{(d\angle{e^\circ})} \newline
a = (\dfrac{b}{d} \angle{c^\circ - e^\circ})
$$

Phasor relations:
$$
V = RI \newline
$$
$$
V = j\omega LI \newline
$$
$$
V = \dfrac{1}{j\omega C} I
$$

Impedance:
$$
Z = \dfrac{V}{I}
$$

This means that:
$$
Z_{R} = R \newline
Z_{L} = j\omega L \newline
Z_{C} = \dfrac{1}{j\omega C} = -j \dfrac{1}{\omega C}
$$

Power in AC - general:

$$
V(t) = V_m cos(\omega t + \theta_V) \newline
I(t) = I_m cos(\omega t + \phi_I)
$$

$$
P(t) = V_m I_m cos(\omega t + \theta_V) cos(\omega t + \phi_I)
$$

$$
P(t) = \dfrac{1}{2} V_m I_m cos(\theta_V - \phi_I) + \dfrac{1}{2} V_m I_m cos(2 \omega t + \theta_V + \phi_I)
$$

$$
P_{avg} = \dfrac{V_m I_m}{2} cos(\theta_V - \phi_I)
$$

$$
P_{avg} = V_{rms} I_{rms} cos(\theta_V - \phi_I)
$$

Different Types:

* Real Power: $P = V_{rms} I_{rms}\ cos(\theta_V - \phi_I)\ [W]$

* Reactive Power: $Q = V_{rms} I_{rms} sin(\theta_V - \phi_I) [VAR]$

* Complex Power: $S = P + jQ$ or in polar form, $S = V_{rms} I_{rms} \angle \theta_V - \phi_I [VA]$

* Apparent Power: $|S| = V_{rms} I_{rms} [VA]$.
