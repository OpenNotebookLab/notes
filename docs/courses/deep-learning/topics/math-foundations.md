---
title: Math Foundations for Deep Learning
status: draft
last_reviewed:
---

# Math Foundations for Deep Learning

Quick reference for the mathematics used in model construction, backpropagation, loss functions, and optimization. The tabs are organized around the concepts that recur in derivations and implementations.

=== "Matrix calculus & tensors"

    ## Shapes are part of the mathematics

    A scalar is an element of \(\mathbb{R}\), a vector is in \(\mathbb{R}^n\), and a matrix is in \(\mathbb{R}^{m\times n}\). A tensor adds named axes such as batch, channel, sequence, height, width, and feature. In every expression, check that the dimensions contract as intended.

    For \(X\in\mathbb{R}^{n\times d}\), \(W\in\mathbb{R}^{d\times k}\), and \(b\in\mathbb{R}^k\),

    \[
    Z=XW+\mathbf{1}b^{\mathsf T}\in\mathbb{R}^{n\times k}.
    \]

    The outer product \(uv^{\mathsf T}\) is a matrix; the inner product \(u^{\mathsf T}v\) is a scalar. Broadcasting is shorthand for repeating an array along an axis and must be checked explicitly.

    ### Useful matrix derivatives

    With a scalar objective and column-vector convention:

    \[
    \nabla_x(a^{\mathsf T}x)=a,\qquad
    \nabla_x(x^{\mathsf T}Ax)=(A+A^{\mathsf T})x,
    \]

    \[
    \nabla_x\frac12\|Ax-b\|_2^2=A^{\mathsf T}(Ax-b).
    \]

    For matrices, the Frobenius inner product is \(\langle A,B\rangle_F=\operatorname{tr}(A^{\mathsf T}B)\). Trace identities are often the cleanest way to derive gradients:

    \[
    \operatorname{tr}(ABC)=\operatorname{tr}(BCA)=\operatorname{tr}(CAB).
    \]

    ??? example "Worked example: least-squares gradient"

        Let \(L(w)=\frac12\|Xw-y\|_2^2\). Set \(r=Xw-y\). Since \(dr=X\,dw\), the differential is \(dL=r^{\mathsf T}X\,dw\), so \(\nabla_wL=X^{\mathsf T}(Xw-y)\). The result has the same shape as \(w\).

=== "Multivariable calculus"

    ## Derivatives of functions of many variables

    For \(f:\mathbb{R}^n\to\mathbb{R}\), the gradient is the vector of first partial derivatives:

    \[
    \nabla f(x)=\begin{bmatrix}\partial f/\partial x_1\\\vdots\\\partial f/\partial x_n\end{bmatrix}.
    \]

    The directional derivative in direction \(v\) is \(D_vf(x)=\nabla f(x)^{\mathsf T}v\). For a unit vector, it is largest in the gradient direction. A first-order Taylor approximation is:

    \[
    f(x+\Delta x)\approx f(x)+\nabla f(x)^{\mathsf T}\Delta x.
    \]

    For \(f:\mathbb{R}^n\to\mathbb{R}^m\), the Jacobian \(J\in\mathbb{R}^{m\times n}\) contains \(J_{ij}=\partial f_i/\partial x_j\). Locally, \(f(x+\Delta x)\approx f(x)+J\Delta x\).

    ### Chain rule and backpropagation

    If \(z=g(x)\) and \(y=f(z)\), then \(J_{y,x}=J_{y,z}J_{z,x}\). Backpropagation evaluates this product in reverse order without explicitly constructing every Jacobian. For a scalar loss, vector-Jacobian products are the central operation.

    For elementwise nonlinearities, the local Jacobian is diagonal. For softmax, the Jacobian is dense:

    \[
    \frac{\partial s_i}{\partial z_j}=s_i(\delta_{ij}-s_j).
    \]

    ??? example "Worked example: reverse-mode chain rule"

        Let \(u=Wx+b\), \(h=\tanh(u)\), and \(L=c^{\mathsf T}h\). If the upstream gradient is \(\nabla_hL=c\), then

        \[
        \nabla_uL=c\odot(1-h\odot h),\qquad
        \nabla_WL=(\nabla_uL)x^{\mathsf T},\qquad
        \nabla_xL=W^{\mathsf T}\nabla_uL.
        \]

=== "Hessians & curvature"

    ## Second-order structure

    The Hessian of a scalar function is

    \[
    H_f(x)=\nabla^2f(x),\qquad (H_f)_{ij}=\frac{\partial^2f}{\partial x_i\partial x_j}.
    \]

    When the function is twice continuously differentiable, the Hessian is symmetric. The second-order Taylor approximation is:

    \[
    f(x+\Delta x)\approx f(x)+\nabla f(x)^{\mathsf T}\Delta x+
    \frac12\Delta x^{\mathsf T}H_f(x)\Delta x.
    \]

    At a stationary point, a positive definite Hessian indicates a strict local minimum; a negative definite Hessian indicates a strict local maximum; an indefinite Hessian indicates saddle behavior. Positive semidefinite curvature is necessary for a differentiable local minimum, but not always sufficient.

    Eigenvalues describe curvature magnitude and direction. A large condition number means some directions are much steeper than others, which can make gradient descent zig-zag or progress slowly.

    ### Hessian-vector products

    Deep networks have too many parameters to form a full Hessian. Hessian-vector products \(Hv\) can often be computed with automatic differentiation at a cost comparable to a few gradient evaluations. They support curvature diagnostics and second-order or approximate second-order methods.

    ??? example "Worked example: classifying a stationary point"

        For \(f(x,y)=x^2-4y^2\), \(\nabla f(0,0)=0\) and

        \[
        H=\begin{bmatrix}2&0\\0&-8\end{bmatrix}.
        \]

        The Hessian has both positive and negative eigenvalues, so the origin is a saddle point rather than a minimum.

=== "Norms & regularization"

    ## Different norms produce different geometry

    For \(p\ge1\), the vector \(p\)-norm is

    \[
    \|x\|_p=\left(\sum_i|x_i|^p\right)^{1/p},
    \qquad
    \|x\|_\infty=\max_i|x_i|.
    \]

    The unit-ball geometry changes with \(p\). \(L_2\) gives round level sets and smooth gradients away from the origin; \(L_1\) gives diamond-shaped level sets and promotes exact zeros; \(L_\infty\) limits the largest coordinate.

    Norms are used as penalties, constraints, and measures of parameter or gradient size:

    \[
    \min_\theta L(\theta)+\lambda\|\theta\|_2^2,
    \qquad
    \text{or}\qquad \|\theta\|_1\le t.
    \]

    The squared \(L_2\) penalty has gradient \(2\lambda\theta\). The \(L_1\) norm is not differentiable at zero, so optimization uses a subgradient or a proximal operator. For a convex function, a subgradient \(g\) at \(x\) satisfies \(f(y)\ge f(x)+g^{\mathsf T}(y-x)\) for all \(y\).

    Also distinguish vector norms from matrix norms. The Frobenius norm is \(\|A\|_F^2=\sum_{ij}A_{ij}^2\), while the spectral norm is the largest singular value.

    ??? example "Worked example: shrinkage from regularization"

        Consider \(L(w)=\frac12(w-a)^2+\lambda|w|\). The quadratic term pulls \(w\) toward \(a\), while the \(L_1\) term pulls it toward zero. The exact minimizer is the soft-thresholding rule \(w^*=\operatorname{sign}(a)\max(|a|-\lambda,0)\), illustrating why \(L_1\) can create sparsity.

=== "Probability & statistics"

    ## Random variables and estimation

    A probability mass function sums to one; a continuous density integrates to one. A density value is not itself a probability. Conditional probability is \(p(x\mid y)=p(x,y)/p(y)\), and Bayes' rule is:

    \[
    p(\theta\mid D)=\frac{p(D\mid\theta)p(\theta)}{p(D)}.
    \]

    Expectation, variance, and covariance are:

    \[
    \mathbb{E}[g(X)]=\sum_xp(x)g(x)\ \text{or}\ \int p(x)g(x)dx,
    \]

    \[
    \operatorname{Var}(X)=\mathbb{E}[(X-\mathbb{E}X)^2],\qquad
    \operatorname{Cov}(X,Y)=\mathbb{E}[(X-\mathbb{E}X)(Y-\mathbb{E}Y)].
    \]

    For independent samples, the log-likelihood is a sum:

    \[
    \log p(D\mid\theta)=\sum_{i=1}^n\log p(x_i\mid\theta).
    \]

    Maximizing likelihood is equivalent to minimizing negative log-likelihood. This connection explains many supervised learning losses.

    ??? example "Worked example: Gaussian maximum likelihood"

        If observations are modeled as \(x_i\sim\mathcal{N}(\mu,\sigma^2)\) with known \(\sigma\), the negative log-likelihood differs from \(\frac{1}{2\sigma^2}\sum_i(x_i-\mu)^2\) only by constants. Thus maximum likelihood selects the mean that minimizes squared error.

=== "Optimization & convexity"

    ## First-order optimization

    An unconstrained problem is \(\min_x f(x)\). Gradient descent uses \(x_{t+1}=x_t-\eta\nabla f(x_t)\). A line search chooses a step using the objective; a fixed learning rate chooses it in advance. Stochastic gradient descent replaces the full gradient with an unbiased or approximately unbiased mini-batch estimate.

    Momentum accumulates a moving direction. Adaptive methods rescale coordinates using estimates of first and second moments. These methods change optimization dynamics, not the underlying objective.

    For constrained problems, projected gradient descent takes a gradient step and projects back into the feasible set. Lagrange multipliers convert constraints into a saddle-point formulation.

    ### Convexity, strong convexity, and smoothness

    A differentiable function is convex if

    \[
    f(y)\ge f(x)+\nabla f(x)^{\mathsf T}(y-x).
    \]

    It is \(\mu\)-strongly convex if the right side includes \(\frac{\mu}{2}\|y-x\|_2^2\). Strong convexity gives a unique minimizer and a curvature lower bound. A function is \(L\)-smooth when its gradient is \(L\)-Lipschitz:

    \[
    \|\nabla f(x)-\nabla f(y)\|_2\le L\|x-y\|_2.
    \]

    For twice-differentiable functions, convexity corresponds to \(H\succeq0\); strong convexity corresponds to \(H\succeq\mu I\); and smoothness corresponds to \(H\preceq LI\), when these bounds hold globally. Concavity is the reverse inequality: \(H\preceq0\). A function can be convex in one variable and non-convex jointly.

    ### Local versus global behavior

    Convexity supplies global guarantees. Deep-network objectives are generally non-convex, so a stationary point need not be globally optimal. Local curvature, saddle points, flat directions, and parameter symmetries are therefore important when interpreting training.

    ??? example "Worked example: curvature controls a step size"

        For \(f(x)=\frac12cx^2\), the gradient is \(cx\) and the Hessian is \(c\). Gradient descent gives \(x_{t+1}=(1-\eta c)x_t\). If \(0<\eta c<2\), the iterates converge; a larger step can oscillate or diverge.

=== "Information theory & numerical stability"

    ## Entropy, cross-entropy, and KL divergence

    Let \(p=(p_1,\ldots,p_k)\) and \(q=(q_1,\ldots,q_k)\) be probability distributions over the same outcomes. Each probability is non-negative and the probabilities sum to one. By convention, \(0\log 0=0\); a zero-probability outcome contributes nothing to entropy or KL divergence.

    ### Entropy: uncertainty in one distribution

    **Meaning:** Entropy measures how uncertain or unpredictable a distribution is.

    **Formula:**

    \[
    H(p)=-\sum_{i=1}^k p_i\log p_i.
    \]

    **Use:** It measures the information content of a random variable and helps describe the uncertainty in a model's predictions.

    **Important properties:** \(H(p)\ge0\); it is zero for a deterministic distribution; for \(k\) outcomes it is largest for the uniform distribution, with maximum \(\log k\); and it is concave in \(p\). The log base determines the units: base 2 gives bits, while natural log gives nats.

    ### Cross-entropy: cost of using the wrong distribution

    **Meaning:** Cross-entropy measures how well a predicted distribution \(q\) represents outcomes generated from the true distribution \(p\).

    **Formula:**

    \[
    H(p,q)=-\sum_{i=1}^k p_i\log q_i.
    \]

    **Use:** It is the standard classification loss. With a one-hot target, it becomes \(-\log q_y\), so assigning low probability to the correct class produces a large penalty.

    **Important properties:** \(H(p,q)\ge H(p)\), with equality only when \(p=q\); it is not symmetric; and it can become infinite when \(q_i=0\) for an outcome with \(p_i>0\). It is not itself a distance.

    ### KL divergence: information lost by approximation

    **Meaning:** KL divergence measures how different a reference distribution \(p\) is from an approximating distribution \(q\).

    **Formula:**

    \[
    D_{KL}(p\|q)=\sum_{i=1}^k p_i\log\frac{p_i}{q_i}.
    \]

    **Use:** It is used to compare distributions, regularize model predictions, and measure how much an approximate probability model departs from a target or prior.

    **Important properties:** \(D_{KL}(p\|q)\ge0\), and it equals zero only when \(p=q\); it is not symmetric, so \(D_{KL}(p\|q)\ne D_{KL}(q\|p)\) in general; it does not satisfy the triangle inequality; and it can be infinite when \(q_i=0\) where \(p_i>0\).

    ### Relationship

    \[
    H(p,q)=H(p)+D_{KL}(p\|q).
    \]

    Since \(H(p)\) is fixed when the target distribution is fixed, minimizing cross-entropy with respect to \(q\) is equivalent to minimizing \(D_{KL}(p\|q)\).

    ### Softmax and numerical stability

    Softmax maps logits to probabilities:

    \[
    s_i=\frac{e^{z_i}}{\sum_je^{z_j}}.
    \]

    In finite precision, compute softmax and log-sum-exp after shifting logits by their maximum:

    \[
    \operatorname{LSE}(z)=m+\log\sum_i e^{z_i-m},\qquad m=\max_i z_i.
    \]

    Stable implementations should avoid explicitly taking \(\log(\operatorname{softmax}(z))\) when a combined log-softmax or cross-entropy operation is available.

    ??? example "Worked example: stable log-sum-exp"

        Directly computing \(e^{1000}\) overflows. Instead,

        \[
        \log(e^{1000}+e^{999})=1000+\log(1+e^{-1}),
        \]

        which is finite and mathematically equivalent.
