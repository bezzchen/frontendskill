# Using the experimental v2 skill

Install this complete directory. `SKILL.md` loads the relevant references; copying it alone
omits the handoff, director adapter and review protocol. This candidate's composition is
not yet established as a visual-quality improvement.

## Briefing it

Describe the audience, primary task and what is fixed. Name Q (quiet operate), W (expressive
persuade), or S (immersive realtime) when you know the intended expression. When you want
the agent to choose, say so; that does not require another approval round.

```text
Build a page for our furniture repair workshop. Help local visitors decide whether we
can repair their piece and request an estimate. Keep our navy/copper palette, existing
components and runtime dependencies. Choose the expression level and proceed. Verify
the form on desktop and mobile.
```

For a supplied design, state which decisions are settled. The workflow should skip those
stages. A plan-only request stays plan-only. Small changes do not need a separate design
document or a new director.

## What happens

One compact contract carries the brief, hierarchy, visual concept, project tokens, responsive
behavior, states and implementation choices. One director owns the current surface's
visual direction; shared identity carries across surfaces. The architect handles open
sourcing/renderer decisions. A reviewer operates the running result against the original
brief, identifies concrete defects, and rechecks corrections within two cycles by default.

The included Anthropic adapter is a scoped adaptation and requires a matching prepared
source or matching installed file. Its [manifest](integrations.lock.json) records the pin.
`CFA_ANTHROPIC_SOURCE` can identify an explicit local source file. It is optional: absent or
incompatible sources use the packaged `builtin-fallback`, with the limitation recorded.
No runtime installation or silent source upgrade occurs.

Without a separate reviewer, the check is labeled self-review. Without a browser, rendered
verification remains unverified. No successful build or code inspection substitutes for
observing the interface.

## What remains experimental

The new design handoff and independent-review integration require comparative build trials.
Impeccable, interface-design and specialist integrations are not bundled or validated by
this release. Existing available specialists can still inform their chosen implementation
concern; actual loading and evidence must be recorded.

The frozen v1.2 body remains in `SKILL.v1.2-frozen.md`. Earlier changelogs describe their
own revisions and do not establish v2 results.
