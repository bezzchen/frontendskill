# Concurrency may be suppressing delegation in BOTH arms — noted 2026-09-08, mid-arm

Raised while the v1.1 inline-sweep validation was still running (7 of 10 runs scored, both arms at
0 stalls / 0 delegations). Recorded before the result was written so it cannot be a post-hoc excuse.

## The problem

The arm's pre-registered rule 2 fires if v1 stalls <=1/5: "the historical 10/15 was
environment-dependent, not caused by the skill text." That conclusion is currently on track.

But "environment-dependent" hides two very different causes, and this arm cannot distinguish them:

**(a) The environment genuinely changed** since 2026-09-02 — notification routing, or model
behaviour, such that agents no longer delegate-and-park. This would mean v1.1's headline fix
addresses a defect that no longer exists.

**(b) My own concurrency suppressed delegation.** All 10 runs were launched simultaneously. If
child-agent spawning is throttled, queued, or unavailable while 10 agents are already in flight,
every run would be *forced* to sweep inline regardless of which skill text it carried. The observed
0/0 would then be an artifact of how I ran the arm, not a fact about either skill body.

(b) is not idle speculation: the delegate-then-park pattern requires a child to actually spawn. Ten
concurrent parents is more than any historical wave ran at once (rep2/rep3 launched 6, and the
record explicitly declined to run 12 - see WAVE_RECORD_ROUTING_BASELINE.json `rep3_hold_reason`).

## Why the arm's internal comparison survives either way

The v1-vs-v1.1 pairing is unaffected: both arms ran under identical concurrency, so whatever
suppression applies, applies equally. The claim "v1.1 does not stall *less* than v1" is safe.

What is NOT safe under (b) is the stronger claim "the stall is gone" or "the fix was unnecessary."

## Discriminating test (cheap, one run)

Run **one v1 run, alone, with no other agents in flight**, on a prompt from E1-E5. Then:

- delegates and parks  -> (b): concurrency was suppressing it; the stall is still real and v1.1's
  fix may still be needed. The 10-run arm's absolute rates are void; only its pairing stands.
- runs the sweep inline -> (a) survives as the better-supported reading: under matched solo
  conditions v1 no longer delegates, so the historical stall was environmental.

One run cannot settle (a) on its own - n=1 against a historical 10/15 proves little in the
"inline" direction (P(no delegation | p=0.33) = 0.33, unremarkable). It is a strong signal only in
the "delegates" direction, where it would immediately void the absolute rates. Pre-registering the
asymmetry so the weak direction is not later reported as confirmation.

## Status

Deferred until the 10 concurrent runs finish, because launching it now would add to the very
concurrency it is meant to control for.
