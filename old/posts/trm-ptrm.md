# TRM + PTRM Unified Codebase

The goal is a compact implementation path for reasoning models that can run under constrained hardware while still exposing the mechanics clearly enough to inspect.

![Reasoning stack](./assets/images/reasoning-stack.svg)

## Current Focus

| Area | Target | Status |
| --- | --- | --- |
| TRM core | recurrent token transition | prototype |
| PTRM core | process-token sampling | implementation notes |
| Benchmarks | Sudoku, maze, PPBench-style tasks | planned |
| Hardware | 4 GB GPU budget | active constraint |

The recurrent transition can be viewed as a map $F_\theta$ over process state:

$$
z_{t+1} = F_\theta(z_t, x), \quad y = g_\theta(z_T)
$$

When the update becomes contractive, fixed-point analysis gives a cleaner way to reason about convergence and truncation depth.

```python
def recurrent_solve(model, x, steps):
    state = model.initial_state(x)
    trace = []
    for _ in range(steps):
        state = model.transition(state, x)
        trace.append(model.readout(state))
    return trace[-1], trace
```

::github https://github.com/yuro-py

[PTRM paper PDF](https://arxiv.org/pdf/2605.19943.pdf)
