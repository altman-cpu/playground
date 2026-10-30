# c cure

A dictation, kept nearly whole, set behind a gate. Two movements.

`index.html` is the scene — open it in a browser and click the gate. Nothing is
fetched; it's one file with no dependencies, and the links that came with the
dictation are quoted as text, never loaded.

    python3 -m http.server -d . 8000   # then visit /poems/junkyard-gate/

Switch movements with the `i` / `ii` controls bottom-left, or `←` / `→`
(`1` / `2`). `Esc` closes the gate.

| file | what it is |
| --- | --- |
| `poem.txt` | movement i, as set |
| `poem-ii.txt` | movement ii, as set |
| `source-ii.txt` | movement ii's raw dictation, verbatim, links included |

## editing notes

Movement i: line breaks, punctuation, and one verb (`if it had to be a junkyard /
let it have a gate` — the dictation had "had to be a junk yard with a gate").
Every image is the transcription's own.

Movement ii: line breaks and punctuation only. `everytime` → `every time`,
`toknow` → `to know`. The garbled stretch (`wherever it else it delivered`,
`the way it had been congruent with / it needed to be done`) is left exactly as
dictated — it reads as a machine describing itself in the grammar of a spec, and
smoothing it would lose the only thing it says. The last line stops mid-clause
because the dictation did.
