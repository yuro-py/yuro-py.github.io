# ReLU Kink Counting

This note tracks a small approximation-theory experiment: count slope changes in a one-dimensional slice through a ReLU network.

## Finite Difference Probe

```python
def kink_count(model, xs):
    ys = model(xs).squeeze()
    slopes = torch.diff(ys) / torch.diff(xs.squeeze())
    changes = torch.abs(torch.diff(slopes)) > 1e-4
    return int(changes.sum())
```

For approximation bounds, one rough expression is:

$$
N = 4d \left(\frac{L}{\epsilon}\right)^d
$$

The expression is useful mostly because it makes the curse of dimensionality explicit.

| Variable | Meaning |
| --- | --- |
| $d$ | input dimension |
| $L$ | Lipschitz scale |
| $\epsilon$ | approximation tolerance |

::github https://github.com/yuro-py
