const GUARD_KEY = "life-weather-last-auto-refresh";
export function watchDeployment({
  build,
  onNotice,
}: {
  build: string;
  onNotice: (visible: boolean) => void;
}) {
  let lastActivity = Date.now();
  let candidate = "";
  let busy = false;
  let stopped = false;
  let reloading = false;
  let announcement: ReturnType<typeof setTimeout> | undefined;
  const controller = new AbortController();
  const safe = () =>
    document.visibilityState === "visible" &&
    Date.now() - lastActivity > 8000 &&
    !document.querySelector(
      'dialog[open], [data-prevent-auto-refresh="true"]',
    ) &&
    !(
      document.activeElement instanceof HTMLElement &&
      document.activeElement.matches(
        'input:not([type=checkbox]):not([type=radio]):not([type=button]):not([type=submit]), textarea, select, [contenteditable="true"]',
      )
    );
  const stopAnnouncement = () => {
    clearTimeout(announcement);
    announcement = undefined;
    if (!stopped) onNotice(false);
  };
  const activity = () => {
    lastActivity = Date.now();
    stopAnnouncement();
  };
  const alreadyTried = (version: string) => {
    try {
      const prior = JSON.parse(sessionStorage.getItem(GUARD_KEY) || "null");
      return prior?.version === version && Date.now() - prior.time < 600000;
    } catch {
      return false;
    }
  };
  async function latest() {
    const response = await fetch(`/api/app-version?t=${Date.now()}`, {
      cache: "no-store",
      signal: controller.signal,
    });
    if (!response.ok) return "";
    const data = await response.json();
    return typeof data.version === "string" ? data.version : "";
  }
  async function check() {
    if (busy || stopped || document.visibilityState !== "visible") return;
    busy = true;
    try {
      const version = await latest();
      if (stopped) return;
      candidate =
        version &&
        version !== build &&
        version !== "local" &&
        !alreadyTried(version)
          ? version
          : "";
      if (!candidate) stopAnnouncement();
    } catch {
      candidate = "";
      stopAnnouncement();
    } finally {
      busy = false;
    }
  }
  function maybeRefresh() {
    if (!candidate || announcement || reloading || !safe()) return;
    onNotice(true);
    announcement = setTimeout(async () => {
      const expected = candidate;
      try {
        // Confirm the same deployment is still live before navigating.
        if (
          !safe() ||
          stopped ||
          (await latest()) !== expected ||
          !safe() ||
          stopped
        ) {
          stopAnnouncement();
          return;
        }
        sessionStorage.setItem(
          GUARD_KEY,
          JSON.stringify({ version: expected, time: Date.now() }),
        );
        reloading = true;
        window.location.reload();
      } catch {
        candidate = "";
        stopAnnouncement();
      }
    }, 2500);
  }
  const resume = () => {
    if (document.visibilityState !== "visible") stopAnnouncement();
    else void check();
  };
  for (const event of ["pointerdown", "keydown", "input", "scroll"])
    window.addEventListener(event, activity, {
      passive: true,
      capture: true,
    });
  window.addEventListener("focus", resume);
  window.addEventListener("pageshow", resume);
  document.addEventListener("visibilitychange", resume);
  const poll = setInterval(check, 60000);
  const idle = setInterval(maybeRefresh, 1000);
  void check();
  return () => {
    stopped = true;
    controller.abort();
    clearInterval(poll);
    clearInterval(idle);
    clearTimeout(announcement);
    for (const event of ["pointerdown", "keydown", "input", "scroll"])
      window.removeEventListener(event, activity, true);
    window.removeEventListener("focus", resume);
    window.removeEventListener("pageshow", resume);
    document.removeEventListener("visibilitychange", resume);
    onNotice(false);
  };
}
