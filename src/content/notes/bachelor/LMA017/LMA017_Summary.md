---
title: "Part 21 - Summary"
date: 2023-10-19
math: true
school: [mathematical analysis in several variables]
---
### Limits
Let's compare limits in one variable to several.
$$
\lim_{x \to a} f(x) = L
$$

$$
\lim_{(x, y) \to (a, b)} f(x) = L
$$

They work quite similiar, let's see the limit laws:

1)
$$
\lim_{(x, y) \to (a, b)} f(x, y) \pm h(x, y) = L + M
$$

2)
$$
\lim_{(x, y) \to (a, b)} f(x, y) \cdot h(x, y) = L \cdot M
$$

3)
$$
\lim_{(x, y) \to (a, b)} \dfrac{f(x, y)}{h(x, y} = \dfrac{L}{M} , M \neq 0
$$

### Partial derivate

:::recall[Partial derivative]
The *partial* derivate of a function of two variables **with respect to** x, denoted by $f_x$, is the function of two variables given by:
$$
f_x(x, y) = \lim_{h \to 0} \dfrac{f(x + h, y) - f(x, y)}{h}
$$

Similarly for $y$:
$$
f_y(x, y) = \lim_{h \to 0} \dfrac{f(x, y + h) - f(x, y)}{h}
$$
:::

### Chain rule

:::recall[Chain rule]
Suppose $z = f(x, y)$ is differentiable function of $x, y$. Where $x = g(t)$ and $y = h(t)$. Which both are differentiable functions of $t$. Then:

$$
\boxed{\dfrac{dz}{dt} = \dfrac{\partial z}{\partial x} \dfrac{dx}{dt} + \dfrac{\partial z}{\partial y} \dfrac{dy}{dt}}
$$
:::

### General chain rule

:::recall[General chain rule]
Let $z$ be a differentiable function of $n$ variables, $x_1, \ldots, x_n$, where each $x_i$ is differentiable function of $m$ variables, $t_1, \ldots, t_m$.

Then:
$$
\dfrac{\partial z}{\partial t_i} = \dfrac{\partial z}{\partial x_1} \dfrac{\partial x_1}{\partial t_i} + \dfrac{\partial z}{\partial x_2} \dfrac{\partial x_2}{\partial t_i} + \ldots + \dfrac{\partial z}{\partial x_n} \dfrac{\partial x_n}{\partial t_i}
$$
:::

### Implicit differentiation

:::recall[Implicit differentiation]
Suppose a function $y = y(x)$ is given implicitly by equation of the form $F(x, y) = 0$ where $F$ is a differentiable function of two variables and $F_y \neq 0$. Then:

$$
\boxed{\dfrac{dy}{dx} = -\dfrac{F_x}{F_y}}
$$
:::

### Implicit differentiation of several variables

:::recall[Implicit differentiation of several variables]
Let $z(x, y)$ be given implicitly, by equation of form $F(x, y, z) = 0$ where $F$ is differentiable and $F_z \neq 0$, then:

$$
\dfrac{\partial z}{\partial x} = -\dfrac{F_x}{F_z} \newline
\dfrac{\partial z}{\partial y} = -\dfrac{F_y}{F_z} \newline
$$
:::

### Definition of directional derivatives
The directional derivative of a function, $f$, of two variables, at point $(x_0, y_0)$ in the direction of a **unit** vector, $\vec{u}$.
$$
\vec{u} \langle a, b \rangle
$$

We denoted the directional derivative with a $D_{\vec{u}} f$.
$$
D_{\vec{u}} f(x_0, y_0) = \lim_{h \to 0} \dfrac{f(x_0 + ha, y_0 + hb) - f(x_0, y_0)}{h}
$$

### Definition of gradient
The gradient of, $f$, is the vector-function:
$$
\nabla f = \langle f_x, f_y \rangle
$$

Therefore, we usually write:
$$
\boxed{D_{\vec{u}} f = \nabla f \cdot \vec{u}}
$$

### Maximum rate of change
If we ask ourselves the question, in what direction is $D_{\vec{u}} f(x_0, y_0)$ the largest?

If we look at the definition:
$$
D_{\vec{u}} f(x_0, y_0) = \nabla f(x_0, y_0) \cdot \vec{u}
$$

If we use the geometrical definition:
$$
D_{\vec{u}} f(x_0, y_0) = |\nabla f(x_0, y_0)| |\vec{u}| cos(\alpha)
$$

### Gradient and level curves
Recall that level curves are curves with the equation:
$$
f(x, y) = k
$$

Where $k$ is just any constant. For each point $(x_0, y_0)$, $\nabla f(x_0, y_0)$ is orthogonal to the level curve that contains $(x_0, y_0)$

### Critical points
$(a, b)$ is a **critical point** if $\nabla f(a, b) = 0 \textbf{ or } \nabla f(a, b) \ \nexists$

In other words, if $(a, b)$ is a critical point of local minimum/maximum then it is a critical point.

However, the other way around this implication is not true. A critical point might not be a local minimum/maxium.

### 2nd derivate test for functions of two variables
Suppose $(a, b)$ is a critical point of a function, $f$, of two variables. Suppose 2nd order partial derivatives exists and are continous.

Let $D = D(a, b) = f_{xx}(a, b) f_{yy}(a,b) - \left(f_{xy} (a,b)\right)^2$

Then:
$$
D > 0 \text{ and } f_{xx}(a, b) > 0 \ | \ \text{local minimum} \newline
D > 0 \text{ and } f_{xx}(a, b) < 0 \ | \ \text{local maximum} \newline
D < 0 \ | \ \text{neither, this is a saddle point} \newline
$$

### Lagrange multiplier method

:::recall[Lagrange multiplier method]
To find minimum/maximum values of function, $f$, subject to constraint, $g(x, y) = k$, assuming minimum/maximum points exists and $\nabla g \neq 0$

1. Find all numbers $x, y$ and $\lambda$, such that:
$$
\nabla f(x, y) = \lambda \nabla g(x, y) = k
$$

2. Compute values from step 1, choose the minimum/maximum value(s).
:::

### Type I region definition
If $D$ is of type I, then:
$$
\iint_D f(x, y)\ dA = \int_a^b \int_{g_1(x)}^{g_2(x)} f(x, y)\ dy\ dx
$$

### Type II region definition
If $D$ is of type II, then:
$$
\iint_D f(x, y)\ dA = \int_c^d \int_{h_1(y)}^{h_2(y)} f(x, y)\ dx\ dy
$$

### General case of variable change
$$
\iint_D f(x, y)\ dA
$$

We want to rewrite this in terms of $u$ and $v$. Let's say that:
$$
x = g(u, v) \newline
y = h(u, v)
$$

We can say that we have a *transformation*, $T$, from the $uv$-plane to the $xy$-plane, given by our functions $g$ and $h$.

We need to make some assumptions of $T$ to make our lives easier.

1) $T$ is a $C^1$-transformation, meaning that $g$ and $h$ have continuous partial derivatives.

2) $T$ is an injective transformation (meaning it is 1-to-1). This means that we can express $u$ and $v$ in terms of $x$ and $y$.

The jacobian matrix of a transformation, $T$, is:

$$
\dfrac{\partial(x, y)}{\partial(u, v)} =
det
\begin{bmatrix}
\dfrac{\partial x}{\partial u} & \dfrac{\partial x}{\partial v}  \newline
\dfrac{\partial y}{\partial u} & \dfrac{\partial y}{\partial v}
\end{bmatrix}
$$

Suppose $T$ is a transformation, from the $uv$-plane to the $xy$-plane. Assuming that the jacobian for $T$, is non-zero, then:
$$
\iint_D f(x, y)\ dA = \iint_S f(x(u, v), y(u, v)) \vert \tfrac{\partial(x, y)}{\partial(u, v)} \vert \ dA
$$

### In three variables
Let $x = x(u, v, w), y = y(u, v, w), z = z(u, v, w)$

The jacobian is:
$$
\dfrac{\partial(x, y, z)}{\partial(u, v, w)} =
det
\begin{bmatrix}
\dfrac{\partial x}{\partial u} & \dfrac{\partial x}{\partial v}  & \dfrac{\partial x}{\partial w} \newline
\dfrac{\partial y}{\partial u} & \dfrac{\partial y}{\partial v}  & \dfrac{\partial y}{\partial w} \newline
\dfrac{\partial z}{\partial u} & \dfrac{\partial z}{\partial v}  & \dfrac{\partial z}{\partial w}
\end{bmatrix}
$$

Just as we did before:
$$
\iiint_E f(x, y, z)\ dV = \iiint_S f(x(u, v, w), y(u, v, w), z(u, v, w)) \vert \tfrac{\partial(x, y, z)}{\partial(u, v, w)} \vert \ dV
$$

### Polar coordinates
$$
\iint_S g(r, \theta)\ dA = \iint_S f(r cos(\theta), r sin(\theta)) \cdot r\ dA
$$

It makes sense to change to polar coordinates if we have a circle/circle like shape.

### Cylindrical coordinates
$$
\iiint_E f(x, y, z)\ dV = \iiint_S f(r cos(\theta), r sin(\theta), z) \cdot r \ dV
$$

It makes sense to change to cylindrical coordinates when we have symmetry around one axis.

### Spherical coordinates
$$
\iiint_E f(x, y, z)\ dV = \iiint_S f(\rho sin(\varphi) cos(\theta), \rho sin(\varphi) sin(\theta), \rho cos(\varphi)) \cdot \rho^2 sin(\varphi) \ dV
$$

It makes sense to change to spherical coordinates when our solid is bounded by spheres and/or cones.

### Computing mass of solid
Let $E$ be an arbitrary solid, with a density function, $\rho(x, y, z)$

We say that the mass of the solid is:
$$
\iiint_E \rho(x, y, z)\ dV
$$

### Center of Mass
One very important application is finding the center of mass of a solid.

Given a **physical** system with $m_i$ points, the center of mass has the coordinates, $(x_0, y_0, z_0)$.

Therefore:
$$
x_0 = \dfrac{\sum m_i x_i}{\sum m_i}
$$

$$
y_0 = \dfrac{\sum m_i y_i}{\sum m_i}
$$

$$
z_0 = \dfrac{\sum m_i z_i}{\sum m_i}
$$

For an arbitrary solid, it's almost sum same:
$$
x_0 = \dfrac{\iiint_E \rho(x, y, z) \cdot x\ dV}{\iiint_E \rho(x, y, z)\ dV}
$$

$$
y_0 = \dfrac{\iiint_E \rho(x, y, z) \cdot y\ dV}{\iiint_E \rho(x, y, z)\ dV}
$$

$$
z_0 = \dfrac{\iiint_E \rho(x, y, z) \cdot z\ dV}{\iiint_E \rho(x, y, z)\ dV}
$$

### Parameterization over line
Given a line that passes through the point $(x_0, y_0, z_0)$, with a direction of the vector, $\vec{v} = \langle a, b, c \rangle$.

If we want to parameterize this line, we can choose another point that this vector passes through as:
$$
\vec{r}(t) = \vec{r}(t_0) + t\vec{v}
$$

$$
(x(t), y(t), z(t)) = (x_0, y_0, z_0) + t(a, b, c)
$$

This means that:
$$
x(t) = x_0 + ta
$$

$$
y(t) = y_0 + tb
$$

$$
z(t) = z_0 + tc
$$

### Line integral
A curve, $C$, parameterized as $\vec{r}(t) = \langle x(t), y(t) \rangle$, for an interval $t \in [a, b]$ and a continuous function, $f: C \rarr \mathbb{R}$.

Assuming $x(t)$ and $y(t)$ are differentiable.

$$
\int_C f(x, y) ds = \int_a^b f(x(t), y(t)) \sqrt{x^\prime(t)^2 + y^\prime(t)^2}\ dt
$$

### Non-differentiable lines
There may be some cases where the parameterization isn't differentiable.

Imagine we have a simple rectangular form. The four corners of the rectnagle will not be differentiable.

What we can do is divide $C$ into $n$ subcurves.

$$
C = C_1 \cup C_2 \cup \ldots \cup C_n
$$

$$
\int_C f(x, y) ds = \sum_{j = 1}^{n} \int_{C_j} f(x, y) ds
$$

### Line integrals with respect to x or y
So far we have integrated with respect to the arc length. But we can integrate with respect to x or y.

$$
\int_C f(x, y)\ dx \text{ or } \int_C f(x, y)\ dy
$$

$$
\int_C f(x, y)\ dx = \int_a^b f(x(t), y(t)) x^\prime(t)\ dt
$$

$$
\int_C f(x, y)\ dy = \int_a^b f(x(t), y(t)) y^\prime(t)\ dt
$$

### Line integrals with three variables
There is no difference in two or three variables:
$$
C \in \mathbb{R}^3 \newline
f: C \rarr \mathbb{R}^3 \newline
\vec{r}(t) = \langle x(t), y(t), z(t) \rangle \ | \ a \leq t \leq b
$$

$$
\int_C f(x, y, z)\ ds = \int_a^b f(x(t), y(t), z(t)) \sqrt{x^\prime(t)^2 + y^\prime(t)^2 + z^\prime(t)^2}\ dt
$$

### Vector field
A **vector field** is a function, $F$:
$$
F: D \subset \mathbb{R}^2 \rarr \mathbb{R}^2 \ | \ \text{2D} \newline
F: D \subset \mathbb{R}^3 \rarr \mathbb{R}^3 \ | \ \text{3D}
$$

### Gradient field
By this definiton, we can say that.

Let $f: D \subset \mathbb{R}^2 \rarr \mathbb{R}$ be a differentiable function. The gradient is $\nabla f(x, y) = \langle f_x(x, y), f_y(x, y) \rangle$.

The gradient is therefore a vector field!

$$
\nabla f: D \rarr \mathbb{R}^2
$$

### Conservative vector field
A vector field, $F$, is called *conservative*, if there is a function, $f$, for which $\nabla f = F$.

In this case, $f$, is called a *potential* for $F$.

#### Line integrals with vector fields
If $C$ is parameterized as $\vec{r}(t) = \langle x(t), y(t), z(t) \rangle$ in the interval, $a \leq t \leq b$. Then:

$$
\int_C F \cdot dr = \int_a^b F(x(t), y(t), z(t)) \cdot \vec{r^\prime}(t)\ dt
$$

### Conservative vector field
Let $D \subset \mathbb{R}^2$ be open (every point in $D$ has a small disc around it, which contains $D$), connected (consists of one single "piece").

Let $F: D \rarr \mathbb{R}^2$ be a vector field. Then $F$ is conservative (there exists a $f$ such that $\nabla f = F$), if and only if:

$$
\int_C F \cdot dr = 0 \ | \ \text{for every closed curve } C \subset D
$$

NB: This only applies for $\mathbb{R}^2$.

Suppose $F(x, y) = P(x, y) \vec{i} + Q(x, y) \vec{j}$ is a conservative field. Then:

$$
\dfrac{\partial P}{\partial y} = \dfrac{\partial Q}{\partial x}
$$

### Green's Theorem
Let $C$ be a simple, closed curve oriented positively. Let $D$ be the region it surrounds and let $P, Q: D \rarr \mathbb{R}$.

$$
\int_C P\ dx + Q\ dy = \iint_D \dfrac{\partial Q}{\partial x} - \dfrac{\partial P}{\partial y}\ dx\ dy
$$

Equivalently:
$$
\int_{\partial D} P\ dx + Q\ dy = \iint_D \dfrac{\partial Q}{\partial x} - \dfrac{\partial P}{\partial y}\ dx\ dy
$$

### Parameteric surface
A **parametric surface** is a region, $S \subset \mathbb{R}^3$, which is the image of a function, $r: D \rarr \mathbb{R}^3$, defined on a region $D \subset \mathbb{R}^2$ of the plane.

Which means we can parameterize:
$$
\vec{r}(u, v) = \langle x(u, v), y(u, v), z(u, v) \rangle
$$

### Tangent planes to surfaces.
Suppose $S$ is a parametric surface with parameterization $r: D \subset \mathbb{R}^2 \rarr \mathbb{R}^3$.

$$
\vec{r}(u, v) = x(u, v) \vec{i} + y(u, v) \vec{j} + z(u, v) \vec{k}
$$

We define $\vec{r_u}(u, v)$ as:
$$
\vec{r_u} = x_u(u, v) \vec{i} + y_u(u, v) \vec{j} + z_u(u, v) \vec{k}
$$

And for the partial derivate of $v$:
$$
\vec{r_v} = x_v(u, v) \vec{i} + y_v(u, v) \vec{j} + z_v(u, v) \vec{k}
$$

The tangent plane, $\pi$, to $S$, at the point $r(u_0, v_0)$ is the plane that contains $r_u(u_0, v_0)$ and $r_v(u_0, v_0)$.

Equivalently, it is the plane perpendicular to the cross product of $r_u(u_0, v_0)$ and $r_v(u_0, v_0$, which goes through $r(u_0, v_0)$.

### Surface area
Let $r: D \rarr \mathbb{R}^3$ be a parameterization for a surface, $S$.

$$
\text{Area}(s) = \iint_D | \vec{r_u} \times \vec{r_v} |\ dx\ dy
$$

### Surface integrals
Let $r: D \rarr \mathbb{R}^3$ be a parameterization of a surface, $S$.

Let $f: S \rarr \mathbb{R}$ be a function, then:

$$
\iint_S f(x, y, z)\ dS = \iint_D f(\vec{r}(u, v))\ | \vec{r_u} \times \vec{r_v} |\ du\ dv
$$

### Surface integrals over vector fields
Let $S$ be a parametric surface, parameterized by, $\vec{r}: D \rarr \mathbb{R}^2$ and $F: \mathbb{R}^3 \rarr \mathbb{R}^3$, be a vector field. Then:
$$
\iint_S \vec{F} \cdot dS = \iint_D \vec{F}(\vec{r}(u, v)) \cdot \vec{r_u} \times \vec{r_v}\ du\ dv
$$

We call this the flux of $\vec{F}$ through $S$.

### The Divergence Theorem
For a vector field, $\vec{F}: \mathbb{R}^3 \rarr \mathbb{R}^3$, the **divergence** is:
$$
div\ \vec{F} = \dfrac{\partial P}{\partial x} + \dfrac{\partial Q}{\partial y} + \dfrac{\partial R}{\partial z}
$$

Let $S$ be a hollow surface and let $E$ be the 3-dimensional region it surrounds ($\partial E = S$).

Then:
$$
\iint_S \vec{F} \cdot dS = \iiint_E div\ \vec{F}\ dV
$$

Equivalently:
$$
\iint_{\partial E} \vec{F} \cdot dS = \iiint_E div\ \vec{F}\ dV
$$

### Stokes Theorem
So far we have seen Green's Theorem as well as The Divergence theorem. But what is the reason that Green's Theorem only works in $\mathbb{R}^3$?

Well, Stokes Theorem is essentially Green's Theorem but in $\mathbb{R}^3$.

For $\vec{F}: \mathbb{R}^3 \rarr \mathbb{R}^3$, we define its **curl** as:

NB: it is also called **rot** and sometimes denoted as $\nabla \times \vec{F}$.
$$
curl\ \vec{F} = \langle \dfrac{\partial R}{\partial y} - \dfrac{\partial Q}{\partial z}, \dfrac{\partial P}{\partial z} - \dfrac{\partial R}{\partial x}, \dfrac{\partial Q}{\partial x} - \dfrac{\partial P}{\partial y} \rangle
$$

If $S \subset \mathbb{R}^3$ is a surface, surrounded by a simple, closed curve in $\mathbb{R}^3$. Then:
$$
\int_C \vec{F} \cdot dr = \iint_S curl\ F\ dS
$$
