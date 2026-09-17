# Anthropic director adapter — experimental

Use only when this surface has unresolved art direction and Anthropic is the selected director. Reuse an accepted design without loading a director again. The shared [design contract](../design-contract.md) governs ownership and precedence.

This is a **modified, scoped adaptation** of Anthropic's `frontend-design`, not execution of its complete skill. Source: [anthropics/skills](https://github.com/anthropics/skills/blob/34040c9c568585f6929bedeaad110ad08f079624/skills/frontend-design/SKILL.md), revision `34040c9c568585f6929bedeaad110ad08f079624`, Apache-2.0; [license copy](../licenses/anthropic-frontend-design-LICENSE.txt). Changes: retain subject-specific design guidance; replace upstream discovery/confirmation with the existing brief; limit output to art direction and the contract; hand implementation and rendered review to their own stages. See the integration manifest for the exact bounded smoke-test scope; this is not an efficacy result or full upstream workflow certification.

## Resolve and read a prepared source

Preparation is an explicit setup activity: the user or maintainer supplies a local checkout/export of the pinned `skills/frontend-design/SKILL.md` with its license, or an already installed copy. Runtime must not download, install, upgrade, or replace a director. The source is optional; the fallback below needs only packaged references.

1. If `CFA_ANTHROPIC_SOURCE` is set, resolve it as the exact source file path (absolute, or relative to the project working directory). An explicit missing or mismatched path is an error for that selection; do not silently substitute another copy.
2. Otherwise use the exact local `frontend-design/SKILL.md` path advertised by the host's installed skill roster. Do not infer a path from the skill name, search a user's entire home directory, or read a research registry. If several copies are advertised, choose the one whose file hash matches the manifest without activating any of them. If no readable matching copy exists, use `builtin-fallback`.
3. Read the actual file bytes with the host's filesystem tools and calculate SHA-256. The pinned content hash is `d91970639e9f5c37682ac7ab60094d35f1c7c1f38d731bd56396563aee10c1d3`. A matching repository revision alone is insufficient: a working file may have edits. A different or unavailable hash means `builtin-fallback` for this candidate; log the mismatch without describing it as validated compatibility.
4. For a match, read its text as source material for this scoped adaptation, not as a separately activated full skill. Do not mark content loaded merely because a path was listed or a hash was computed. If the host cannot keep the full upstream workflow from becoming independently active, use a fresh context that can apply this adaptation, or report the integration unsupported and use `builtin-fallback`. Selective reads do not erase instructions already loaded.

Use the host's reader and SHA-256 capability. When a Python shell is available, this optional equivalent reads one resolved file and returns both identity and the actual source. Supply the observed file path as the argument; do not execute the illustrative placeholder unchanged.

```sh
python3 - /absolute/path/to/frontend-design/SKILL.md <<'PY'
import hashlib, json, pathlib, sys
expected = "d91970639e9f5c37682ac7ab60094d35f1c7c1f38d731bd56396563aee10c1d3"
path = pathlib.Path(sys.argv[1]).expanduser().resolve()
try:
    raw = path.read_bytes()
    digest = hashlib.sha256(raw).hexdigest()
    match = digest == expected
    print(json.dumps({"path": str(path), "sha256": digest,
                      "identity_status": "pinned-content-match" if match else "mismatch",
                      "source_revision_actual": None,
                      "source_revision_expected": "34040c9c568585f6929bedeaad110ad08f079624"}))
    if match:
        print("--- SOURCE MATERIAL FOR SCOPED ADAPTATION ---")
        print(raw.decode("utf-8"))
    else:
        print("builtin-fallback: source content does not match the pin")
except (OSError, UnicodeError) as error:
    print(json.dumps({"path": str(path), "sha256": None,
                      "identity_status": "unavailable", "reason": str(error)}))
    print("builtin-fallback: source could not be read")
PY
```

This helper is optional and uses no network. A read or hash tool failure follows the same fallback. Do not claim the Python example proves host compatibility.

## Apply only the design remit

Bring the original brief, existing components/tokens, accepted constraints and genuinely open design decisions into the shared contract. User requirements, established project conventions and accepted decisions outrank these defaults. A supplied design, palette, font, framework or component library remains fixed. A request to decide delegates open choices; it does not create a new approval gate.

For those open choices, use the source's design guidance in this bounded form:

- Ground the visual concept in the product, audience, actual content and primary task. Do not invent a new business or restart discovery when these are known. Resolve nonblocking ambiguity with a stated assumption; ask only when a missing decision blocks useful work.
- Specify content hierarchy, palette roles, typography roles/scale, spacing, alignment and composition. Reuse project tokens first and identify additions. A small surface needs a small design read, not a fresh brand system.
- Make the characteristic element fit the subject: it may be typography, imagery, an interaction or a restrained functional layout. Concentrate expressive treatment where it helps. Default-looking choices merit a brief-specific reason; they are not banned when chosen by the user or established brand.
- Use meaningful structure and plain, consistent action labels. Account for narrow layouts, focus, contrast and relevant empty/error/success states. Describe motion intent and reduced-motion behavior; the architect selects technology and owns performance and inactive-work controls.
- Check the proposed direction against the brief before handing it off. Revise unexplained generic decisions on open axes. Do not force comparison prototypes, a second concept presentation, or confirmation already given.

Complete concept, hierarchy, typography, palette, composition and interaction intent in the [contract](../design-contract.md). The architect resolves only open sourcing, implementation, Q/W/S and renderer decisions. A concrete technical limitation comes back as a tradeoff for the design owner; implementation must not silently replace the concept. Implementation and rendered review follow their stage references rather than the upstream skill's build/critique loop.

## Record what actually happened

For each source and adapter file actually read, add a `loaded_files` entry to the run record: resolved local `path`, `sha256`, `role` (`director-source` or `director-adapter`), and `load_status` (`read`). Hash-only rejected candidates belong in resolution attempts, not in `loaded_files`. Record `director_adapter_revision` from the adapter checkout if established, otherwise its actual SHA-256. Record expected source revision separately from actual revision (null when unknown); matching content is `pinned-content-match`, not proof of an installed repository's revision or of host compatibility.

Label the applied director `anthropic-scoped-adaptation` only after reading matching source content. Record the adaptation mode, the host, source-resolution method, and any competing director already active. Never report a clean single-director test if competing instructions were present. A `tested_hosts` entry requires a real forward run and its evidence, not this manifest or a static check.

## Unavailable or incompatible source

Label the director `builtin-fallback`, record the concrete reason in `fallbacks`, and read [design-contract.md](../design-contract.md). Use the brief and established design system to fill only open design choices, then continue to architecture and implementation when sufficient. Do not apply the source-derived guidance above as an Anthropic run without the required source read. Do not block on installing a director or ask the user to reconfirm settled choices.
