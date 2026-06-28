# MIT 6.7960 - Graph Neural Networks

These notes track the implementation details that matter when graph neural networks are treated as permutation-aware programs.

## Message Passing

A basic layer can be written as:

$$
h_v^{(k+1)} = \phi \left(h_v^{(k)}, \sum_{u \in N(v)} \psi(h_u^{(k)}, e_{uv}) \right)
$$

The aggregation must be permutation invariant, while the full node-wise map should be permutation equivariant.

| Concept | Requirement |
| --- | --- |
| Graph-level pooling | invariant |
| Node update | equivariant |
| Edge update | local and shared |
| Positional encoding | breaks symmetry carefully |

```python
def aggregate(messages, index, n_nodes):
    out = torch.zeros(n_nodes, messages.size(-1), device=messages.device)
    out.index_add_(0, index, messages)
    return out
```

::github https://github.com/yuro-py
