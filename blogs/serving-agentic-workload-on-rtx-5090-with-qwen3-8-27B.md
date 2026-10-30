---
title: Agentic Workload on a single RTX 5090 with Qwen3.8-27B : a read
date: 2026-10-30
description: Bottlenecks, resolutions and boosting throughput while maintaining overall average latency
---

Chatbots do merely request/response.
Agentic workloads do a lot of thinking, acting, observing and looping.

There are problems in agents which chatbot-focused inference optimizations wont solve.

## 1. AGENTIC BOTTLENECK

Agent booking a flight is not "request/response", it a loop:

1. think : "I need to search for flights" (generates tokens).
2. act : "calls a search api" (gpu is idle waiting for network).
3. observe : reads the json result (huge input tokens added to context window).
4. think : "ok I pick the easiest one" (generates tokens again).

Agents adds massive context (scraped web page or api logs) which raises two issues:

- **prefill spikes** -> it has to process that huge observation after acting, which takes a lot of compute and stalls other requests.
- **kv cache explosion** -> every newly generated token has to be stored in immediate vram in kv pairs. 10 concurrent agents doing this will fill up vram fast, forcing "premptionmode.recompute" or slowing everything down.

### MEMORY BANDWIDTH

MEMORY BANDWIDTH is the first biggest wall which agentic workload faces cuz of massive kv cache.

> 50 concurrent users X 8k context = 400K tokens = ~16gb allocated even before the weights have been loaded.

## 2. NVFP4 on BLACKWELL

RTX 5090 with NVFP4 solves memory bandwidth overload on agentic workloads.
5090 uses blackwell architecture and supports NVFP4 which is different than standard FP4 or INT4.

1. NVFP4 keeps the floating point structure but shrinks it to 4-bits.
2. Storing kvc in nvfp4 compresses the vram required for concurrent user's contexts while still maintaining precision for complex reasoning even in 4 bits.
3. It boosts throughput by releasing pressure on vram.

## 3. PRODUCTION ARCHITECTURE to serve agents in 5090

1. **prefix_caching** is non-negotiable as agentic workload incorporates a lot of reusable static tokens.
2. **chunked_prefill** for overall latency -> receiving a massive observation for 1 user and processing it means other users get blocked.

   So chunked prefill breaks the prefill into chunks and interleaves it with other request's decoding steps.

   This way everyone's TTFT is slower but not paused, even one one agent is processing one user's massive load.
3. **nvfp4 quantization** for efficient vram usage without disturbing complex reasoning work.

## SERVING on an RTX 5090

```bash
vllm serve Qwen/Qwen3.8-27B \
    --quantization nvfp4 \
    --dtype bfloat16 \
    --enable-prefix-caching \
    --enable-chunked-prefix \
    --max-model-len 32768 \
    --gpu-memory-utilization 0.9 \
    --max-num-seqs 256 \
    --tensor-parallel-size 1
```

With speculative decoding:

```bash
    --speculative-model Qwen/Qwen3-0.6B \
    --num-speculative-tokens 5 \
    --speculative-dtype bfloat16
```
