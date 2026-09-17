# Rendered-review development fixture — runner only

This fixture tests review behavior. It is excluded from efficacy and held-out build scores. It is a deterministic, self-contained event-registration page with no network requests, dependencies or external submission. All supplied data stays in the page and resets on reload. The 250 ms local submission delay exposes a loading state.

**Do not give this README, source code, ground truth, the `fixed` parameter or previous findings to the initial blind reviewer.** Give the reviewer the approved protocol, the blind-safe context below, the base running URL and an evidence directory. Source inspection may follow independently observed defects. Do not include the builder conversation.

## Start

From the repository root:

```sh
python3 -m http.server 8765 --bind 127.0.0.1 --directory evals/fixtures/composition_v2_review
```

Use a different available port if needed. Base URL: `http://127.0.0.1:8765/`. Positive control: `http://127.0.0.1:8765/?fixed=1`. Stop the server after the run. The positive control repairs the presentation of the same page; it is not a new design or evidence that a builder performed a repair.

## Blind-safe brief and accepted contract

Copy only this block into the initial review handoff, adding the running base URL and evidence destination:

> Review the Field Notes Studio Day registration page. A visitor should be able to read the event title/date, understand attendance options, and reserve a place with a name and valid email. Incomplete or invalid input must explain the problem and allow correction. Successful local submission must show a personalized confirmation and allow another registration. Exercise the primary flow at desktop and mobile widths and with a keyboard. No real booking or email delivery is expected; this is a local prototype.
>
> Accepted design: keep the purple gradient hero, serif display typography, restrained rounded form panel and existing content. The gradient is an intentional brand convention. Preserve these choices while assessing legibility, responsiveness, interaction and focus. Vanilla HTML/CSS/JavaScript and no external services are settled. Representative viewports are 1440 × 900 and 375 × 812. The page has no intentional animation beyond a brief submission wait.

## Ground truth — exclude from blind review

There are two seeded defects:

1. **Desktop text collision.** At viewport widths of at least 800 px, `.event-meta` has `margin-top: -30px`, placing the date over the bottom of the title. Observe at 1440 × 900 without scrolling. The positive control restores a 20 px margin. The expected finding concerns overlapping text, not the serif font or gradient.
2. **Mobile primary action blocked.** At widths of at most 600 px, the submit button is fixed near the viewport bottom and `.event-note` is a higher fixed overlay covering it. Fill the fields at 375 × 812 and attempt to click/tap the submit action. The overlay intercepts pointer input; scrolling does not free the fixed button. The positive control puts both elements back into normal flow. Keyboard submission may still work; that does not negate the pointer/touch defect.

The reviewer should independently report each defect with its affected viewport/state, steps, impact and evidence location. Do not count a source-code guess or a generic responsive warning as detection. A request to remove the permitted gradient purely for taste is not a defect.

## Functional and keyboard checks

- Base desktop: attempt an empty submission; confirm both errors and focus on name. Enter a name and invalid email; submit again and confirm email error/focus. Correct the email and choose either attendance option. Submit, observe loading/disabled state, then personalized confirmation and focus on its heading. “Register another guest” resets the form and focuses name.
- Use `Ada Rivera` and `ada@example.test` as safe data. After a fresh load, Tab reaches the skip link; Enter moves to registration. Tab through name, email, attendance and submit. Use keyboard selection and Enter or Space to submit. Confirmation heading receives focus; the next Tab reaches the reset action.
- Base mobile: pointer submission remains blocked by the seeded overlay. Record that failure; do not use forced clicks, DOM event dispatch or keyboard submission as evidence that touch works.
- Positive control: repeat the affected desktop/mobile observations and the primary form flow. Confirm date/title separation, a visible reachable submit action, pointer completion on mobile, and keyboard completion. Reduced-motion inspection should find no decorative motion to suppress; there is no claim of a full assistive-technology audit.

## Evidence and interpretation

Save initial and recheck captures separately with route, viewport, interaction steps and observed results. Have the same fresh reviewer recheck `?fixed=1` after its initial findings; disclose at that stage that this is a positive control. Record initial review as cycle 0 and control recheck separately. Using the toggle tests review and recheck mechanics, not generated correction capability or design-quality improvement. The full director/build/correct workflow still requires a real build trial.

Do not edit the fixture to hide missed detections during a run. Keep failed checks and unsupported browser conditions in the result record. Automated assertions may support runner validation; the reviewer must still inspect actual screenshots and behavior.
