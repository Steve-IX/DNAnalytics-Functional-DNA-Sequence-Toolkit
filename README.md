# DNAnalytics – Functional DNA-Sequence Toolkit

**DNAnalytics** is a Node.js program that shows how far you can go in pure JavaScript *without a single loop*.
It ingests a nucleotide stream, recognises short motifs (even with ambiguous IUPAC codes), counts their occurrences, and pin-points every match — all in real time and with fully declarative, array-centric code.&#x20;

---

## Key capabilities

| Module                | What it does                                                                                                              | API surface                |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| **Frequency counter** | Builds a live histogram of every target pattern, including overlapping hits (for example, `AAA` contains two `AA`).       | `reportCounts(Object)`     |
| **Exact matcher**     | Emits a callback each time an unambiguous pattern appears and tells you the byte offset from the current sequence origin. | `onMatch(pattern, offset)` |
| **Ambiguous matcher** | Understands the full IUPAC code-set (`R, Y, K, …, N`) so a query like **`MTAC`** matches both `ATAC` and `CTAC`.          | Same as above              |

All three modules are written **entirely with `Array.*`, `String.*` and `Object.*` functional helpers**—`for`, `while`, and `do-while` are strictly off-limits.&#x20;

---

## Directory layout

```
.
├── minimal_demo.js      # starter script – customise me
├── testlib.js           # tiny harness, don’t modify
├── data/
│   ├── task1.data  |  task1.seq
│   ├── task2.data  |  task2.seq
│   └── task3.data  |  task3.seq
└── README.md            # you’re reading it
```

Six data files drive three progressively harder scenarios; swap them by calling `testlib.setup(1|2|3)` in `minimal_demo.js`.

---

## Quick start

```bash
git clone https://github.com/your-handle/dnanalytics.git
cd dnanalytics

# install runtime (no external deps)
node minimal_demo.js      # runs scenario 1 by default
```

Change the last line of `minimal_demo.js` to `testlib.setup(2)` or `setup(3)` to exercise the matcher or the ambiguous-code engine.

---

## Implementation highlights

* **Stream-friendly** – the data handler receives one character at a time, enabling zero-copy pipelines and unlimited input size.&#x20;
* **Combinatorial matcher** – ambiguous symbols expand lazily into the cartesian product of concrete nucleotides, then collapse back into efficient `RegExp` objects.
* **Pure functions & immutability** – every transform returns a fresh object; no shared state, no mutation headaches.
* **Automatic back-pressure** – `testlib` throttles calls when consumers lag, so the app never runs out of memory under heavy input.

---

## Testing

The built-in `testlib.runTests()` routine prints pass/fail indicators for every expectation and shows offsets for each reported match.
Add your own fixtures by dropping `*.data` and `*.seq` pairs in the **data/** folder and pointing `setup()` to the new index.

---

## Extending

* **Different alphabets** – inject a new symbol-to-set map and the ambiguous matcher adapts instantly.
* **Streaming sources** – pipe data from `fs.createReadStream`, a network socket, or stdin; the interface remains unchanged.
* **Alternate outputs** – swap `reportCounts` for a promise-based logger, WebSocket emitter, or UI binding without touching the core logic.

---
