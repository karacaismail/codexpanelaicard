import { StrictMode, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowsClockwise,
  ArrowsOutSimple,
  CornersOut,
  DeviceMobile,
  DeviceTablet,
  Monitor,
  X,
} from "@phosphor-icons/react";
import "./demo.css";

/**
 * GitHub Pages preview shell: renders the component page (frame.html) inside
 * an iframe at true device dimensions — so media/container queries run as on
 * a real device — and scales the frame to fit the window. Works in any
 * browser/OS since it is plain static HTML + JS.
 */

type DeviceKind = "phone" | "tablet" | "desktop" | "fluid";
type Orientation = "portrait" | "landscape";

const DEVICES: Record<
  Exclude<DeviceKind, "fluid">,
  { label: string; width: number; height: number }
> = {
  phone: { label: "Telefon", width: 390, height: 844 },
  tablet: { label: "Tablet", width: 834, height: 1112 },
  desktop: { label: "PC", width: 1366, height: 768 },
};

function DevicePreviewApp() {
  const [device, setDevice] = useState<DeviceKind>("phone");
  const [orientation, setOrientation] = useState<Orientation>("portrait");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // Tam ekran incelemeden Escape ile çıkılır.
  useEffect(() => {
    if (!isFullscreen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsFullscreen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isFullscreen]);

  const preset = device === "fluid" ? null : DEVICES[device];
  const rotated = orientation === "landscape";
  // "Dikey" is each preset's natural shape; "Yatay" swaps the axes.
  const presetW = preset ? (rotated ? preset.height : preset.width) : 0;
  const presetH = preset ? (rotated ? preset.width : preset.height) : 0;

  useLayoutEffect(() => {
    if (!preset) return;
    const stage = stageRef.current;
    if (!stage) return;
    const fit = () => {
      const pad = 48;
      const availW = stage.clientWidth - pad;
      const availH = stage.clientHeight - pad;
      setScale(Math.min(1, availW / (presetW + 28), availH / (presetH + 28)));
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(stage);
    return () => observer.disconnect();
  }, [preset, presetW, presetH]);

  const frameSrc = `${import.meta.env.BASE_URL}frame.html`;

  return (
    <div className="previewShell" data-fullscreen={isFullscreen}>
      {isFullscreen ? (
        <button
          type="button"
          className="fullscreenExit"
          aria-label="Tam ekrandan çık"
          title="Tam ekrandan çık (Esc)"
          onClick={() => setIsFullscreen(false)}
        >
          <X size={16} />
        </button>
      ) : null}
      <header className="previewToolbar">
        <span className="previewTitle">AiCommandCard — Cihaz Önizleme</span>
        <div className="toolbarGroup" role="group" aria-label="Cihaz seçimi">
          <button
            type="button"
            className="toolbarButton"
            aria-pressed={device === "phone"}
            onClick={() => setDevice("phone")}
          >
            <DeviceMobile size={15} /> Telefon
          </button>
          <button
            type="button"
            className="toolbarButton"
            aria-pressed={device === "tablet"}
            onClick={() => setDevice("tablet")}
          >
            <DeviceTablet size={15} /> Tablet
          </button>
          <button
            type="button"
            className="toolbarButton"
            aria-pressed={device === "desktop"}
            onClick={() => setDevice("desktop")}
          >
            <Monitor size={15} /> PC
          </button>
          <button
            type="button"
            className="toolbarButton"
            aria-pressed={device === "fluid"}
            onClick={() => setDevice("fluid")}
          >
            <ArrowsOutSimple size={15} /> Akışkan
          </button>
        </div>
        <div className="toolbarGroup" role="group" aria-label="Yön">
          <button
            type="button"
            className="toolbarButton"
            disabled={device === "fluid"}
            aria-pressed={orientation === "landscape"}
            onClick={() =>
              setOrientation((value) => (value === "portrait" ? "landscape" : "portrait"))
            }
          >
            <ArrowsClockwise size={15} />
            {orientation === "portrait" ? "Dikey" : "Yatay"}
          </button>
        </div>
        <div className="toolbarGroup">
          <button
            type="button"
            className="toolbarButton"
            onClick={() => setIsFullscreen(true)}
          >
            <CornersOut size={15} /> Tam Ekran
          </button>
        </div>
        <span className="toolbarHint">
          {preset
            ? `${presetW} × ${presetH} px · ölçek ${(scale * 100).toFixed(0)}%`
            : "Pencere boyutuna tam akışkan"}
        </span>
      </header>

      <main ref={stageRef} className="previewStage">
        {preset ? (
          <div
            style={{
              // transform doesn't shrink layout size; reserve the scaled box
              // so the frame stays centered without overflowing the stage.
              inlineSize: (presetW + 28) * scale,
              blockSize: (presetH + 28) * scale,
            }}
          >
            <div
              className="deviceFrame"
              style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}
            >
              <iframe
                key={`${device}-${orientation}`}
                className="deviceScreen"
                src={frameSrc}
                title={`${preset.label} önizleme`}
                width={presetW}
                height={presetH}
              />
            </div>
            <p className="deviceMeta">
              {preset.label} · {orientation === "portrait" ? "dikey" : "yatay"} — gerçek
              viewport: {presetW} × {presetH}
            </p>
          </div>
        ) : (
          <div className="fluidFrame">
            <iframe
              key="fluid"
              className="deviceScreen"
              src={frameSrc}
              title="Akışkan önizleme"
            />
          </div>
        )}
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DevicePreviewApp />
  </StrictMode>,
);
