# Learning Bitcoin from the Ground Up

This repository documents my journey into understanding Bitcoin **beyond price charts and headlines** — down at the protocol level, where consensus rules, transactions, and network behavior actually live.

Instead of treating Bitcoin as a black box, the goal here is to **interact with it directly**: talk to a node, construct transactions by hand, understand why blocks look the way they do, and explore how decentralization is enforced in practice.

This repo is structured as a **progressive, multi-week deep dive** into Bitcoin’s internals, with each week building on the previous one.

---

## Why this repository exists

Bitcoin is often explained at a very high level — wallets, exchanges, numbers going up.  
That hides the most interesting part:

- How transactions are validated  
- Why fees behave the way they do  
- How miners and nodes coordinate without trust  
- What *actually* enforces consensus  

This repository is an attempt to learn Bitcoin **the way protocol developers do** — by reading specs, running nodes, breaking things, and fixing them.

---

## Structure

Each folder corresponds to a focused learning milestone.


Each week contains:
- a concrete technical task
- code that interacts directly with Bitcoin Core
- notes explaining *why* things work the way they do

---

## Weekly Breakdown

### Week 1 — Interacting with a Bitcoin Node  
Learned how to:
- run a Bitcoin node in `regtest`
- interact with it using RPC
- create wallets and addresses
- mine blocks locally
- construct and broadcast a transaction
- embed data using `OP_RETURN`
- reason about transaction fees at the byte level  

This week focuses on **transactions as first-class objects**, not abstractions.

---

### Week 2 — Bitcoin Network & P2P Layer  
Explores:
- how nodes discover each other
- transaction relay
- block propagation
- bloom filters and compact block filters
- why Bitcoin’s network design resists censorship and spam  

This week is about **how information moves** in a decentralized system.

---

### Week 3 — Blocks, Mining & Merkle Trees  
Dives into:
- block structure
- block headers
- Merkle trees and transaction inclusion proofs
- mining difficulty and block creation
- how proof-of-work ties everything together  

This week answers the question: *what does a block really prove?*

---

### Week 4 — Consensus, Validation & Forks  
Focuses on:
- consensus rules vs policy rules
- block validation
- chain selection
- soft forks vs hard forks
- how Bitcoin upgrades without central coordination  

This week is about **why Bitcoin doesn’t fall apart** when participants disagree.

---

## Tooling & Environment

- Bitcoin Core (regtest mode)
- RPC interfaces
- Docker for reproducible environments
- Minimal abstractions — prefer direct interaction over libraries

The emphasis is on **understanding**, not convenience.

---

## Philosophy

This is not about shipping products.  
It’s about building **mental models** that don’t collapse under scrutiny.

Bitcoin is simple in design, but subtle in behavior.  
This repository exists to explore that subtlety.

---

## Status

🚧 Actively evolving  
Each week refines the codebase and the understanding behind it.

---

## Disclaimer

This repository is for **learning and experimentation only**.  
It does not provide financial advice, wallet software, or production-ready tooling.

---

*Bitcoin makes more sense once you stop asking what it does  
and start asking why it works.*
