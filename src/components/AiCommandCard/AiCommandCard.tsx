import type * as React from "react";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import type {
  AiCommandCardExpansionReason,
  AiCommandCardExpansionState,
  AiCommandCardProps,
  AiCommandMenuItem,
  AiQuerySuggestion,
  AiQueryState,
} from "./AiCommandCard.types";
import { isVisuallyExpanded, transitionExpansionState } from "./AiCommandCard.machine";
import {
  COLLAPSE_DURATION_MS,
  EXPAND_DURATION_MS,
  useResolvedMotion,
} from "./AiCommandCard.motion";
import { AiCommandCardHeader } from "./parts/AiCommandCardHeader";
import { AiSearchComposer } from "./parts/AiSearchComposer";
import { AiCommandCardStatus } from "./parts/AiCommandCardStatus";
import { AiResponseArea } from "./parts/AiResponseArea";
import { AiQuerySuggestionList } from "./parts/AiQuerySuggestionList";
import { AiCommandMenuGrid } from "./parts/AiCommandMenuGrid";
import styles from "./AiCommandCard.module.css";

/**
 * AiCommandCard — a morphing expandable command surface.
 *
 * Invariant: this is the only command card surface. Collapsed and expanded
 * appearances are states of the SAME AiCommandCardShell DOM node. Do not
 * replace that node with a modal, dialog, drawer, sheet, popover, portal,
 * second panel, or a separate expanded component; the shell physically grows
 * from its own borders and progressively reveals descendants already mounted
 * inside it.
 */
export function AiCommandCard({
  id,
  className,
  expanded,
  defaultExpanded = false,
  onExpandedChange,
  logo,
  logoLabel,
  breadcrumbs,
  menuItems,
  querySuggestions,
  notificationCount = 0,
  profile,
  searchPlaceholder,
  submitLabel,
  onAiQuerySubmit,
  onMenuItemSelect,
  onNotificationActivate,
  onProfileActivate,
  onLogoActivate,
  motionPreference = "system",
}: AiCommandCardProps) {
  const reactId = useId();
  const expandedContentId = `${id ?? reactId}-expanded-content`;
  const motion = useResolvedMotion(motionPreference);
  const isControlled = expanded !== undefined;

  const [expansionState, dispatchExpansionEvent] = useReducer(
    transitionExpansionState,
    undefined,
    (): AiCommandCardExpansionState =>
      (isControlled ? expanded : defaultExpanded) ? "expanded" : "collapsed",
  );
  const isCardExpanded = isVisuallyExpanded(expansionState);

  const shellRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const triggerHomeRef = useRef<HTMLSpanElement>(null);
  const orbSlotRef = useRef<HTMLSpanElement>(null);
  const profileHostRef = useRef<HTMLSpanElement>(null);
  const expandedRegionRef = useRef<HTMLDivElement>(null);
  const composerInputRef = useRef<HTMLInputElement>(null);
  const animationTimerRef = useRef<ReturnType<typeof setTimeout>>();
  // Latest submit closure; lets the trigger handler (declared earlier in the
  // lifecycle section) call it without reordering the whole controller.
  const submitAiQueryRef = useRef<(query: string) => Promise<void>>(async () => {});
  const shouldFocusInputOnExpand = useRef(false);
  const shouldRestoreFocusOnCollapse = useRef(false);

  const [queryValue, setQueryValue] = useState("");
  const [queryState, setQueryState] = useState<AiQueryState>("idle");
  const [aiResponse, setAiResponse] = useState<React.ReactNode>(null);

  /* ------------------------------------------------ expansion lifecycle */

  const scheduleAnimationCompletion = useCallback(
    (nextState: "expanding" | "collapsing") => {
      clearTimeout(animationTimerRef.current);
      const duration =
        motion === "reduced"
          ? 0
          : nextState === "expanding"
            ? EXPAND_DURATION_MS
            : COLLAPSE_DURATION_MS;
      // A timer (not transitionend) so rapid re-toggles and jsdom both behave:
      // retargeted CSS transitions fire unreliable events, this always settles.
      animationTimerRef.current = setTimeout(() => {
        dispatchExpansionEvent({
          type: nextState === "expanding" ? "OPEN_ANIMATION_COMPLETED" : "CLOSE_ANIMATION_COMPLETED",
        });
      }, duration);
    },
    [motion],
  );

  const applyExpansionRequest = useCallback(
    (open: boolean, reason: AiCommandCardExpansionReason) => {
      const currentlyOpen = isVisuallyExpanded(expansionState);
      if (open === currentlyOpen) return;
      if (!isControlled) {
        dispatchExpansionEvent(
          open
            ? { type: "OPEN_REQUESTED", reason }
            : { type: "CLOSE_REQUESTED", reason },
        );
        scheduleAnimationCompletion(open ? "expanding" : "collapsing");
      }
      onExpandedChange?.(open, reason);
    },
    [expansionState, isControlled, onExpandedChange, scheduleAnimationCompletion],
  );

  // Controlled mode: reflect the prop into the state machine.
  useEffect(() => {
    if (!isControlled) return;
    const currentlyOpen = isVisuallyExpanded(expansionState);
    if (expanded !== currentlyOpen) {
      dispatchExpansionEvent(
        expanded
          ? { type: "OPEN_REQUESTED", reason: "controlled-prop" }
          : { type: "CLOSE_REQUESTED", reason: "controlled-prop" },
      );
      scheduleAnimationCompletion(expanded ? "expanding" : "collapsing");
    }
  }, [expanded, expansionState, isControlled, scheduleAnimationCompletion]);

  useEffect(() => () => clearTimeout(animationTimerRef.current), []);

  const requestCardExpansion = useCallback(
    (reason: AiCommandCardExpansionReason) => applyExpansionRequest(true, reason),
    [applyExpansionRequest],
  );

  const requestCardCollapse = useCallback(
    (reason: AiCommandCardExpansionReason) => {
      shouldRestoreFocusOnCollapse.current = true;
      applyExpansionRequest(false, reason);
    },
    [applyExpansionRequest],
  );

  const hasPendingQuery = queryValue.trim().length > 0;

  // Expanded, the orb sits in the composer: with text it submits ("the user
  // is here to ask AI"); empty, it collapses. If the content is scrolled and
  // the input is out of view, the orb acts as a sticky AI button: first click
  // brings the prompt input back and focuses it. Escape always collapses.
  const handleTriggerToggle = useCallback(() => {
    if (isCardExpanded) {
      const region = expandedRegionRef.current;
      const input = composerInputRef.current;
      if (region && input) {
        const regionRect = region.getBoundingClientRect();
        const inputRect = input.getBoundingClientRect();
        const isInputScrolledAway =
          region.scrollTop > 0 && inputRect.bottom < regionRect.top + 8;
        if (isInputScrolledAway) {
          input.focus({ preventScroll: true });
          region.scrollTo({ top: 0, behavior: motion === "reduced" ? "auto" : "smooth" });
          // Fallback: rAF-throttled contexts can stall smooth scrolling; make
          // sure the composer is reachable regardless.
          window.setTimeout(() => {
            if (region.isConnected && region.scrollTop > 0) region.scrollTop = 0;
          }, 700);
          return;
        }
      }
      if (hasPendingQuery) {
        void submitAiQueryRef.current(queryValue);
      } else {
        requestCardCollapse("trigger-activation");
      }
    } else {
      shouldFocusInputOnExpand.current = true;
      requestCardExpansion("trigger-activation");
    }
  }, [
    hasPendingQuery,
    isCardExpanded,
    motion,
    queryValue,
    requestCardCollapse,
    requestCardExpansion,
  ]);

  /* --------------------------------------------------- hidden-content gate */

  // React 18 cannot remove `inert` via props (false still renders as present),
  // so the attribute is managed imperatively on the two hidden hosts.
  useEffect(() => {
    for (const host of [expandedRegionRef.current, profileHostRef.current]) {
      if (!host) continue;
      if (isCardExpanded) host.removeAttribute("inert");
      else host.setAttribute("inert", "");
    }
  }, [isCardExpanded]);

  // Outside interaction: clicking anywhere off the card collapses it.
  useEffect(() => {
    if (!isCardExpanded) return;
    const onPointerDown = (event: PointerEvent) => {
      const shell = shellRef.current;
      if (shell && !shell.contains(event.target as Node)) {
        requestCardCollapse("outside-interaction");
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [isCardExpanded, requestCardCollapse]);

  // Orb migration (FLIP): measure the vector from the orb's header anchor to
  // the composer slot and let CSS translate it there. Re-measured when the
  // animation settles ("expanded") and on resize, so late layout shifts are
  // smoothly corrected by the same transition.
  useEffect(() => {
    const measureOrbTravel = () => {
      const trigger = triggerRef.current;
      const home = triggerHomeRef.current;
      const slot = orbSlotRef.current;
      if (!trigger || !home || !slot) return;
      if (!isCardExpanded) {
        trigger.style.removeProperty("--orb-travel-x");
        trigger.style.removeProperty("--orb-travel-y");
        return;
      }
      const homeRect = home.getBoundingClientRect();
      const slotRect = slot.getBoundingClientRect();
      const dx = slotRect.left + slotRect.width / 2 - (homeRect.left + homeRect.width / 2);
      const dy = slotRect.top + slotRect.height / 2 - (homeRect.top + homeRect.height / 2);
      trigger.style.setProperty("--orb-travel-x", `${dx.toFixed(1)}px`);
      trigger.style.setProperty("--orb-travel-y", `${dy.toFixed(1)}px`);
    };
    measureOrbTravel();
    window.addEventListener("resize", measureOrbTravel);
    return () => window.removeEventListener("resize", measureOrbTravel);
  }, [isCardExpanded, expansionState]);

  // Deferred focus: only after the expansion animation fully completes, and
  // only when the expansion came from the AI trigger.
  useEffect(() => {
    if (expansionState === "expanded" && shouldFocusInputOnExpand.current) {
      shouldFocusInputOnExpand.current = false;
      composerInputRef.current?.focus({ preventScroll: true });
    }
    if (expansionState === "collapsed" && shouldRestoreFocusOnCollapse.current) {
      shouldRestoreFocusOnCollapse.current = false;
      triggerRef.current?.focus({ preventScroll: true });
    }
  }, [expansionState]);

  /* -------------------------------------------------------- interactions */

  const handleCollapsedSurfaceActivation = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (isCardExpanded) return;
      // Interactive descendants own their clicks; only the empty surface expands.
      const interactiveAncestor = (event.target as HTMLElement).closest(
        "button, a, input, [role='button']",
      );
      if (interactiveAncestor) return;
      shouldFocusInputOnExpand.current = true;
      requestCardExpansion("collapsed-surface-activation");
    },
    [isCardExpanded, requestCardExpansion],
  );

  const handleShellKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      if (event.key === "Escape" && isCardExpanded) {
        event.stopPropagation();
        requestCardCollapse("escape-key");
      }
    },
    [isCardExpanded, requestCardCollapse],
  );

  const currentBreadcrumbPath = useMemo(
    () => breadcrumbs.map((item) => item.label),
    [breadcrumbs],
  );

  const submitAiQuery = useCallback(
    async (rawQuery: string) => {
      const query = rawQuery.trim();
      if (!query || queryState === "submitting") return;
      const currentPage = breadcrumbs[breadcrumbs.length - 1];
      setQueryState("submitting");
      setAiResponse(null);
      try {
        const result = await onAiQuerySubmit({
          query,
          currentPageId: currentPage?.id,
          currentPageLabel: currentPage?.label,
          currentBreadcrumbPath,
        });
        if (result !== undefined && result !== null) setAiResponse(result);
        setQueryState("success");
      } catch {
        setQueryState("error");
      }
    },
    [breadcrumbs, currentBreadcrumbPath, onAiQuerySubmit, queryState],
  );

  submitAiQueryRef.current = submitAiQuery;

  const handleAiQuerySubmission = useCallback(
    () => submitAiQuery(queryValue),
    [submitAiQuery, queryValue],
  );

  const handleQueryValueChange = useCallback((nextValue: string) => {
    setQueryValue(nextValue);
    setQueryState(nextValue.length > 0 ? "typing" : "idle");
  }, []);

  // A suggestion click runs the whole AI flow: fill the input, then submit
  // immediately — the pills act as one-tap AI shortcuts.
  const handleSuggestionSelect = useCallback(
    (suggestion: AiQuerySuggestion) => {
      setQueryValue(suggestion.label);
      void submitAiQuery(suggestion.label);
    },
    [submitAiQuery],
  );

  const handleMenuItemSelect = useCallback(
    (menuItem: AiCommandMenuItem) => onMenuItemSelect(menuItem),
    [onMenuItemSelect],
  );

  /* ------------------------------------------------------------- render */

  return (
    <div
      id={id}
      className={`${styles.host} ${className ?? ""}`}
      data-slot="ai-command-card-host"
      data-motion={motion}
      data-state={expansionState}
    >
      <section
        ref={shellRef}
        className={styles.shell}
        data-slot="ai-command-card-shell"
        data-testid="ai-command-card-shell"
        data-state={expansionState}
        data-query-state={queryState}
        aria-label="AI komuta kartı"
        onClick={handleCollapsedSurfaceActivation}
        onKeyDown={handleShellKeyDown}
      >
        <AiCommandCardHeader
          logo={logo}
          logoLabel={logoLabel}
          breadcrumbs={breadcrumbs}
          notificationCount={notificationCount}
          profile={profile}
          isCardExpanded={isCardExpanded}
          hasPendingQuery={hasPendingQuery}
          askLabel={submitLabel}
          expandedContentId={expandedContentId}
          triggerRef={triggerRef}
          triggerHomeRef={triggerHomeRef}
          profileHostRef={profileHostRef}
          onToggleRequested={handleTriggerToggle}
          onNotificationActivate={onNotificationActivate}
          onProfileActivate={onProfileActivate}
          onLogoActivate={onLogoActivate}
        />

        <div
          ref={expandedRegionRef}
          id={expandedContentId}
          className={styles.expandedRegion}
          data-slot="ai-command-card-expanded-region"
          aria-hidden={!isCardExpanded}
        >
          <AiSearchComposer
            ref={composerInputRef}
            queryValue={queryValue}
            queryState={queryState}
            searchPlaceholder={searchPlaceholder}
            onQueryValueChange={handleQueryValueChange}
            onQuerySubmitRequested={handleAiQuerySubmission}
            orbSlotRef={orbSlotRef}
          />
          <AiCommandCardStatus queryState={queryState} />
          <AiResponseArea response={aiResponse} queryState={queryState} motion={motion} />
          <AiQuerySuggestionList
            querySuggestions={querySuggestions}
            onSuggestionSelect={handleSuggestionSelect}
          />
          <AiCommandMenuGrid menuItems={menuItems} onMenuItemSelect={handleMenuItemSelect} />
        </div>
      </section>
    </div>
  );
}
