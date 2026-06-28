# Gaussian Noise Injection in PTRM

Noise-injected process tokens are a way to encourage robustness and exploration in process-level reasoning traces.

One simple schedule:

$$
z_t = \mu_t + \sigma_t \epsilon, \quad \epsilon \sim \mathcal{N}(0, I)
$$

| Schedule | Use |
| --- | --- |
| constant sigma | stress testing |
| decay | stabilize late reasoning |
| learned sigma | adaptive uncertainty |

```python
def inject_noise(process_tokens, sigma):
    return process_tokens + sigma * torch.randn_like(process_tokens)
```

[PTRM paper PDF](https://arxiv.org/pdf/2605.19943.pdf)
