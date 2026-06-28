# Fixed-Point Iteration and Contraction Maps in TRM

Token-recurrent reasoning models can be studied as iterative maps. If the state update becomes contractive in a useful region, then convergence properties become easier to reason about.

For a contraction $T$ on a complete metric space:

$$
d(Tx, Ty) \leq c d(x, y), \quad 0 \leq c < 1
$$

This suggests useful diagnostics:

| Diagnostic | Question |
| --- | --- |
| State delta | Is the recurrent state stabilizing? |
| Output delta | Does the answer change late in the trace? |
| Jacobian norm | Is the local update expanding or contracting? |
| Halt policy | Can the model stop before a fixed budget? |

```python
with torch.no_grad():
    deltas = [(states[i + 1] - states[i]).norm() for i in range(len(states) - 1)]
```

[Background PDF](https://arxiv.org/pdf/2605.19943.pdf)
