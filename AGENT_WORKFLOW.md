# Agent Workflow

This project is built under a short technical validation window. The goal is to keep agent work focused, reviewable, and aligned with the product task.

## Project Objective

Build a React + TypeScript frontend that helps a user understand and explore the current crypto market using a public market data API, with clear loading, error, stale, refresh, visualization, and exploration states.

## Agent Roles

### 1. Lead Agent

Owns product direction, task sequencing, and final acceptance.

Responsibilities:

- Break the task into small implementation slices.
- Keep the UI focused on market sensemaking, not raw API dumping.
- Decide which tradeoffs are acceptable inside the time limit.
- Maintain the implementation checklist.
- Ensure required documents are completed: `README.md`, `DECISIONS.md`, and `AI_USAGE.md`.
- Make final calls when agents disagree.

The Lead Agent does not merge work until implementation, review, and verification are complete.

### 2. Implementation Agent

Owns feature development.

Responsibilities:

- Build the React + TypeScript app.
- Follow the existing file structure and naming conventions.
- Prefer simple, local state unless shared state is clearly needed.
- Implement data fetching, normalization, UI components, interactions, and states.
- Keep changes scoped to the assigned task.
- Avoid unrelated refactors.

Before editing, the Implementation Agent must state:

- Which files will be created or changed.
- What behavior will be added.
- What assumptions are being made.

### 3. Review Agent

Owns correctness, maintainability, and product fit review.

Responsibilities:

- Review for bugs, missing states, weak data handling, and confusing UX.
- Check that the implementation reflects the task requirements.
- Check TypeScript types and component boundaries.
- Check whether user-facing labels are useful and not decorative.
- Identify performance risks with large datasets or frequent refreshes.
- Confirm required docs match the actual implementation.

Review output should prioritize findings by severity:

1. Blocking issues.
2. Important issues.
3. Nice-to-have improvements.

The Review Agent should avoid requesting broad redesigns unless the current implementation misses the task goal.

### 4. Verification Agent

Owns tests, builds, runtime checks, and implementation feedback.

Responsibilities:

- Run install/build/test commands where available.
- Start the local dev server when needed.
- Verify loading, error, refresh, stale, filter, sort, and selection behavior.
- Check responsive behavior at desktop and mobile widths.
- Report exact command results.
- File concrete implementation issues back to the Lead Agent.

The Verification Agent does not silently ignore failures. If a command cannot run because dependencies are missing, network is blocked, or an API is unavailable, it records the limitation and verifies what can still be verified.

## Workflow

### Phase 1: Planning

Lead Agent defines:

- Core user problem.
- First-screen information hierarchy.
- Data source and fallback strategy.
- Interaction model.
- Visualization model.
- Performance strategy.
- Documentation outline.

No implementation starts until the Lead Agent has a concrete checklist.

### Phase 2: Implementation

Implementation Agent works in small slices:

1. Project scaffold.
2. Data fetching and types.
3. Layout and summary.
4. Market movement visualization.
5. Search, filters, sorting, and selection.
6. Loading, error, stale, and refresh states.
7. Required documentation.

Each slice should be buildable or at least leave the project in a coherent state.

### Phase 3: Review

Review Agent checks:

- Does the UI help users understand the market quickly?
- Are the required states visible and meaningful?
- Is API failure handled honestly?
- Are interactions useful within the time limit?
- Are performance concerns addressed in code or documented?
- Are docs accurate?

### Phase 4: Verification

Verification Agent runs:

- Dependency install.
- Type check, lint, test, or build commands available in the project.
- Local runtime smoke test.
- Browser inspection when possible.

Verification findings are returned to the Lead Agent.

### Phase 5: Finalization

Lead Agent ensures:

- Blocking review findings are fixed.
- Build succeeds or limitations are documented.
- `README.md`, `DECISIONS.md`, and `AI_USAGE.md` are complete and truthful.
- Final submission instructions are clear.

## Definition of Done

The task is done when:

- The app runs locally.
- The app uses a public crypto market data source or an explained mock fallback.
- The first screen communicates market state quickly.
- The app includes market movement visualization.
- The app includes meaningful exploration interactions.
- Loading, error, stale, and refresh states exist.
- Large-row or frequent-update performance concerns are considered.
- Required documents are present and accurate.
- Build or equivalent verification has been attempted and results are recorded.

## Required Documentation Checklist

The required documents must be treated as part of the product, not an afterthought. The Review Agent must verify every item below before finalization.

### README.md

Must include:

- How to run the project.
- What was built.
- API or data source used.
- Main project structure.
- Known limitations or unfinished parts.

### DECISIONS.md

Must include:

- What was prioritized in the UI.
- Why the data fetching approach was chosen.
- Why the visualization approach was chosen.
- How interaction and exploration were handled.
- What performance concerns were considered.
- What would be improved with more time.

### AI_USAGE.md

Must include:

- Which AI tools were used.
- What was asked first.
- How the prompt or direction changed during the task.
- Which AI suggestions were accepted.
- Which AI suggestions were rejected and why.
- One place where AI was wrong, generic, or incomplete.
- What was personally decided, rewritten, or verified.
- How the final result was checked.

If no AI tools were used, the document must state that. For this project, AI tools are being used, so the workflow must be described truthfully and specifically.

## Evaluation Gate

Before final submission, the Lead Agent and Review Agent must verify the project against the stated evaluation focus.

### Product Judgment

- The app must make a clear argument about which market signals matter first.
- The UI must prioritize market understanding over decorative polish.
- The default screen must answer whether the market is broadly up, down, mixed, stale, or unavailable.
- Tradeoffs must be explicit in `DECISIONS.md`.

### Information Design

- The first screen must show summary, movement, exploration controls, and data freshness.
- Users must be able to scan without reading every table row.
- Numeric density must be controlled: detailed fields belong in the selected coin panel when they are not needed for scanning.
- Movement must use text plus color, not color alone.

### Frontend Architecture

- API fetching, normalization, UI components, chart components, formatting, and signal logic must be separated.
- Chart implementation details must stay inside chart components so charts can be replaced later.
- Server state and local UI state must not be mixed unnecessarily.
- Components should remain small enough to review quickly.

### Data Handling

- CoinGecko live data must be normalized defensively.
- Null or missing fields must not break rendering.
- API unavailable behavior must be visible through cached data, error state, or mock fallback.
- Data freshness must be communicated with timestamps and stale/refresh states.

### Performance Judgment

- The implementation must include concrete performance choices, not only documentation.
- Derived market lists and stats must be memoized.
- The table must avoid per-row heavyweight charts.
- Refresh behavior must avoid unnecessary public API pressure.
- Future scaling options such as virtualization, pagination, and real-time transport must be documented.

### AI Workflow

- `AI_USAGE.md` must describe the real workflow, including planning, accepted/rejected suggestions, and verification.
- Generic claims such as "AI helped with code" are not enough.
- At least one AI limitation or incomplete suggestion must be identified.

### Communication And Tradeoffs

- `DECISIONS.md` must explain why chosen approaches were used and what was intentionally not built.
- Known limitations must be stated clearly in `README.md`.
- Verification results must be summarized before final handoff.

## Product Priorities

Prioritize:

- Fast market scanning.
- Clear movement signals.
- Useful filtering and sorting.
- Honest data freshness communication.
- Maintainable React + TypeScript architecture.

Deprioritize:

- Authentication.
- Backend services.
- Complex routing.
- WebSocket real-time streaming.
- Portfolio tracking.
- Trading actions.
- Overly decorative UI.

## Engineering Rules

- Use React + TypeScript.
- Keep components small and purposeful.
- Keep data formatting and market signal logic in utilities.
- Avoid hardcoding API response assumptions without TypeScript types.
- Avoid refresh intervals that could trigger public API rate limits.
- Memoize derived market lists when filtering or sorting.
- Prefer one strong visualization over several weak ones.
- Do not add dependencies unless they clearly reduce implementation risk.
- Before any `git push`, review the actual implementation against `README.md`, `DECISIONS.md`, `AI_USAGE.md`, and `IMPLEMENTATION_PLAN.md`; update these documents or explicitly record why no documentation change is needed.

## Communication Rules

- Each agent reports what changed, what was verified, and what remains.
- Findings must include file references once files exist.
- Do not mark work complete without verification.
- Do not rewrite unrelated work.
- If an API is unavailable, use the fallback path and document the limitation.
