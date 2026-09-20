import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { watchDeployment } from "../lib/deploymentRefresh";
const hooks = { announce: vi.fn(), path: "/fitness/hyunjun" };
let cleanup: (() => void) | undefined;
let win: EventTarget & { location: { reload: ReturnType<typeof vi.fn> } };
let doc: EventTarget & {
  visibilityState: string;
  querySelector: ReturnType<typeof vi.fn>;
  activeElement: unknown;
};
let fetcher: ReturnType<typeof vi.fn>;
const response = (version: string) => ({
  ok: true,
  json: async () => ({ version }),
});
beforeEach(() => {
  vi.useFakeTimers();
  vi.stubEnv("NODE_ENV", "production");
  hooks.path = "/fitness/hyunjun";
  hooks.announce.mockClear();
  win = Object.assign(new EventTarget(), { location: { reload: vi.fn() } });
  doc = Object.assign(new EventTarget(), {
    visibilityState: "visible",
    querySelector: vi.fn().mockReturnValue(null),
    activeElement: null,
  });
  fetcher = vi.fn().mockResolvedValue(response("new-deployment"));
  vi.stubGlobal("window", win);
  vi.stubGlobal("document", doc);
  vi.stubGlobal("HTMLElement", class {});
  vi.stubGlobal("fetch", fetcher);
  vi.stubGlobal("sessionStorage", {
    getItem: vi.fn().mockReturnValue(null),
    setItem: vi.fn(),
  });
});
afterEach(() => {
  cleanup?.();
  cleanup = undefined;
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});
function start() {
  cleanup = watchDeployment({ build: "installed", onNotice: hooks.announce });
}
describe("deployment refresh", () => {
  it("checks current build against deployment, announces, confirms and reloads once", async () => {
    start();
    await vi.advanceTimersByTimeAsync(12000);
    expect(hooks.announce).toHaveBeenCalledWith(true);
    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(win.location.reload).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(12000);
    expect(win.location.reload).toHaveBeenCalledTimes(1);
  });
  it("postpones refresh while interacting and when a dialog or unsaved-record guard exists", async () => {
    start();
    await vi.advanceTimersByTimeAsync(9500);
    win.dispatchEvent(new Event("keydown"));
    await vi.advanceTimersByTimeAsync(6000);
    expect(win.location.reload).not.toHaveBeenCalled();
    doc.querySelector.mockReturnValue({});
    await vi.advanceTimersByTimeAsync(15000);
    expect(win.location.reload).not.toHaveBeenCalled();
    doc.querySelector.mockReturnValue(null);
    await vi.advanceTimersByTimeAsync(4000);
    expect(win.location.reload).toHaveBeenCalledTimes(1);
  });
  it("does not reload on failed checks or a deployment that changed during confirmation", async () => {
    fetcher
      .mockResolvedValueOnce(response("new-deployment"))
      .mockRejectedValue(new Error("offline"));
    start();
    await vi.advanceTimersByTimeAsync(20000);
    expect(win.location.reload).not.toHaveBeenCalled();
  });
  it("prevents a repeated reload if an old cached page is returned", async () => {
    vi.mocked(sessionStorage.getItem).mockReturnValue(
      JSON.stringify({ version: "new-deployment", time: Date.now() }),
    );
    start();
    await vi.advanceTimersByTimeAsync(20000);
    expect(win.location.reload).not.toHaveBeenCalled();
  });
  it("waits in background and checks again on returning to the app", async () => {
    doc.visibilityState = "hidden";
    start();
    await vi.advanceTimersByTimeAsync(20000);
    expect(fetcher).not.toHaveBeenCalled();
    doc.visibilityState = "visible";
    doc.dispatchEvent(new Event("visibilitychange"));
    await vi.advanceTimersByTimeAsync(4000);
    expect(win.location.reload).toHaveBeenCalledTimes(1);
  });
  it("does not reload when versions match", async () => {
    fetcher.mockResolvedValue(response("installed"));
    start();
    await vi.advanceTimersByTimeAsync(20000);
    expect(win.location.reload).not.toHaveBeenCalled();
  });
});
