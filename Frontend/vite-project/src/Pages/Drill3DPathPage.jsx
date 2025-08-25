
import React, { useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Line, Html } from "@react-three/drei";
import { NavLink } from "react-router-dom";


/* --- compact Card --- */
const Card = ({ title, className = "", children }) => (
  <section
    className={`overflow-hidden rounded-lg border border-white/10 bg-[#0f1424]/70 p-2 sm:p-3 shadow-lg shadow-black/30 backdrop-blur ${className}`}
  >
    {title ? (
      <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-300">
        {title}
      </h2>
    ) : null}
    {children}
  </section>
);

const HeaderUser = React.memo(function HeaderUser({ username, initials }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-zinc-700 to-zinc-600 font-semibold">
        {initials}
      </div>
      <div className="text-sm leading-tight">
        <div className="font-medium">{username}</div>
        {/* <div className="text-zinc-400">Logged in</div> */}
      </div>
    </div>
  );
});

/* --- tiny Chip for verdicts --- */
const Chip = ({ tone = "zinc", children }) => {
    const tones = {
      green: "bg-emerald-500/20 text-emerald-300 border-emerald-400/30",
      amber: "bg-amber-500/20 text-amber-200 border-amber-400/30",
      red: "bg-rose-500/20 text-rose-200 border-rose-400/30",
      zinc: "bg-zinc-700/40 text-zinc-200 border-zinc-500/30",
    };
    return (
      <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] ${tones[tone] || tones.zinc}`}>
        {children}
      </span>
    );
  };
  
  /* --- verdict logic (thresholds in m & deg) --- */
  function deviationVerdict({ lateralCm, angularDeg }) {
    const lateralM = lateralCm / 100;
    if (lateralM <= 0.3 && angularDeg <= 1.0) return { label: "On Plan", tone: "green" };
    if (lateralM <= 0.6 && angularDeg <= 2.0) return { label: "Drifting", tone: "amber" };
    return { label: "Off Plan", tone: "red" };
  }
  
  /* --- compact progress bar with threshold marker --- */
  const ProgressBar = ({ valuePct, markerPct, color = "#60a5fa" }) => (
    <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
      {/* fill */}
      <div className="h-full" style={{ width: `${Math.min(100, Math.max(0, valuePct))}%`, background: color }} />
      {/* threshold marker */}
      <div
        className="absolute top-[-2px] h-2 w-[2px] bg-white/70"
        style={{ left: `calc(${Math.min(100, Math.max(0, markerPct))}% - 1px)` }}
        title="Threshold"
      />
    </div>
  );
  
  const NavItem = ({ to, children }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-3 py-1.5 text-sm rounded-md transition
         ${isActive ? "bg-sky-500/20 text-sky-300" : "text-zinc-300 hover:bg-white/10"}`
      }
    >
      {children}
    </NavLink>
  ); 


/* --- deviation side panel (improved UI) --- */
const DeviationSidePanel = React.memo(function DeviationSidePanel({
    lateralInstant,         // cm (instant)
    lateralCumulative,      // cm/m (your label text)
    angularDeg,
    dls,
    correction,
  }) {
    // bar scales (adjust to your expected ranges)
    const maxLateralCm = 30;     // 30 cm bar full
    const maxAngularDeg = 10;    // 10° bar full
  
    // thresholds for marker lines
    const lateralMarkerCm = 30;  // show marker at 30 cm (0.3 m)
    const angularMarkerDeg = 1;  // show marker at 1°
  
    const lateralPct = (lateralInstant / maxLateralCm) * 100;
    const angularPct = (angularDeg / maxAngularDeg) * 100;
    const lateralMarkerPct = (lateralMarkerCm / maxLateralCm) * 100;
    const angularMarkerPct = (angularMarkerDeg / maxAngularDeg) * 100;
  
    const verdict = deviationVerdict({ lateralCm: lateralInstant, angularDeg });
  
    return (
      <div className="grid gap-3">
        {/* header row with verdict */}
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-300">Deviation</div>
          <Chip tone={verdict.tone}>{verdict.label}</Chip>
        </div>
  
        {/* Lateral */}
        <div>
          <div className="text-[10px] text-zinc-400">Lateral Deviation</div>
          <div className="mt-0.5 flex items-baseline gap-1">
            <span className="text-3xl font-bold">{lateralInstant}</span>
            <span className="text-xs text-zinc-400">cm</span>
          </div>
          <div className="mt-1">
            <ProgressBar valuePct={lateralPct} markerPct={lateralMarkerPct} color="#60a5fa" />
          </div>
          <div className="mt-1 flex items-center justify-between text-[10px] text-zinc-500">
            <span>Cumulative: {lateralCumulative} cm/m</span>
            <span>Target ≤ 30 cm</span>
          </div>
        </div>
  
        {/* Angular */}
        <div>
          <div className="text-[10px] text-zinc-400">Angular Deviation</div>
          <div className="mt-0.5 flex items-baseline gap-1">
            <span className="text-3xl font-bold">{angularDeg}</span>
            <span className="text-xs text-zinc-400">°</span>
          </div>
          <div className="mt-1">
            <ProgressBar valuePct={angularPct} markerPct={angularMarkerPct} color="#f43f5e" />
          </div>
          <div className="mt-1 flex items-center justify-between text-[10px] text-zinc-500">
            <span>Instant</span>
            <span>Target ≤ 1°</span>
          </div>
        </div>
  
        {/* DLS & Correction */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-md border border-zinc-800/60 bg-zinc-900/40 px-2 py-1.5">
            <div className="text-[10px] text-zinc-400">DLS</div>
            <div className="text-sm text-zinc-200">{dls}</div>
          </div>
          <div className="rounded-md border border-zinc-800/60 bg-zinc-900/40 px-2 py-1.5">
            <div className="text-[10px] text-zinc-400">Predicted Correction</div>
            <div className="text-sm text-zinc-200">{correction}</div>
          </div>
        </div>
  
        {/* tiny footnote */}
        <div className="mt-0.5 text-[10px] text-zinc-500">
          Green ≤ 0.3 m or ≤ 1° · Amber 0.3–0.6 m or 1–2° · Red &gt; 0.6 m or &gt; 2°
        </div>
      </div>
    );
  });
  

/* --- helpers for PathView --- */
function toScenePts(arr) {
  // [x, depth, z] -> [x, -depth, z] so surface at top
  return arr.map((p) => [p[0], -p[1], p[2]]);
}

// lateral deviation (XZ plane)
function lateralOffset(plannedPt, actualPt) {
  const dx = actualPt[0] - plannedPt[0];
  const dz = actualPt[2] - plannedPt[2];
  return Math.sqrt(dx * dx + dz * dz);
}

// Split actual path into segments with color by threshold
function buildColoredSegments(plannedPts, actualPts, thresholdLateral = 0.5 /* m */) {
  const segs = [];
  for (let i = 1; i < Math.min(plannedPts.length, actualPts.length); i++) {
    const pPrev = plannedPts[i - 1],
      pCurr = plannedPts[i];
    const aPrev = actualPts[i - 1],
      aCurr = actualPts[i];

    const offPrev = lateralOffset(pPrev, aPrev);
    const offCurr = lateralOffset(pCurr, aCurr);
    const beyond = offPrev > thresholdLateral || offCurr > thresholdLateral;

    // ✅ include points (bug fix)
    segs.push({
      points: [aPrev, aCurr],
      color: beyond ? "#ef4444" /* red */ : "#fef08a" /* light yellow */,
    });
  }
  return segs;
}

// subtle depth color for Y ticks (shallower = lighter, deeper = darker)
function depthTickColor(depthY /* scene Y (<=0) */) {
  const d = Math.min(1, Math.max(0, -depthY / 5)); // 0..-5 -> 0..1
  const g = Math.floor(185 - d * 75); // 185 -> 110
  return `rgb(${g},${g},${g})`;
}

/* --- 3D canvas --- */
const ThreeDPathCanvasTopDown = React.memo(function ThreeDPathCanvasTopDown({
  planned = [],
  actual = [],
  preset = "default",
  thresholdLateral = 0.5, // m (0.5 m = 50 cm)
}) {
  const plannedPts = useMemo(() => toScenePts(planned), [planned]);
  const actualPts = useMemo(() => toScenePts(actual), [actual]);

  const xTicks = useMemo(() => [-15, -10, -5, 0, 5, 10, 15], []);
  const yTicks = useMemo(() => [0, 1, 2, 3, 4, 5], []);
  const zTicks = useMemo(() => [-8, -4, 0, 4, 8], []);
  const cam =
    preset === "top"
      ? { position: [0, 18, 0], fov: 45 }
      : { position: [8, 6, 10], fov: 50 };

  const actualSegments = useMemo(
    () => buildColoredSegments(plannedPts, actualPts, thresholdLateral),
    [plannedPts, actualPts, thresholdLateral]
  );

  return (
    <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] overflow-hidden rounded-lg border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950">
      {/* legend / explanation */}
      <div className="absolute left-2 top-2 z-10 rounded-md bg-black/50 px-2 py-1 text-[10px] text-zinc-200 ring-1 ring-white/10 backdrop-blur">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span>
            <span className="inline-block h-2 w-3 rounded-sm align-middle" style={{ background: "#ef4444" }}></span>{" "}
            Off-limit (Actual &gt; Threshold)
          </span>
          <span>
            <span className="inline-block h-2 w-3 rounded-sm align-middle" style={{ background: "#fef08a" }}></span>{" "}
            Actual
          </span>
          <span>
            <span className="inline-block h-2 w-3 rounded-sm align-middle" style={{ background: "#3b82f6" }}></span>{" "}
            Plan
          </span>
          <span className="opacity-80">
            Axes: <span className="text-red-400">X</span>, <span className="text-blue-400">Z</span>,{" "}
            <span className="text-emerald-400">Depth(Y)</span>
          </span>
        </div>
      </div>

      <Canvas camera={cam}>
        <ambientLight intensity={0.65} />
        <directionalLight position={[10, 10, 5]} intensity={0.7} />

        {/* surface grid */}
        <gridHelper args={[30, 15, "#374151", "#1f2937"]} position={[0, 0, 0]} />

        {/* axes */}
        <Line points={[[-15, 0, 0], [15, 0, 0]]} color="#ef4444" lineWidth={1} />
        <Line points={[[0, 0, -8], [0, 0, 8]]} color="#60a5fa" lineWidth={1} />
        <Line points={[[0, 0, 0], [0, -5, 0]]} color="#22c55e" lineWidth={1} />

        {/* tick labels */}
        {xTicks.map((x) => (
          <Html key={`x${x}`} position={[x, 0, 0]} center distanceFactor={22}>
            <span className="text-[10px] text-zinc-300">X {x}</span>
          </Html>
        ))}
        {yTicks.map((y) => (
          <Html key={`y${y}`} position={[0, -y, 0]} center distanceFactor={22}>
            <span className="text-[10px]" style={{ color: depthTickColor(-y) }}>
               {y}
            </span>
          </Html>
        ))}
        {zTicks.map((z) => (
          <Html key={`z${z}`} position={[0, 0, z]} center distanceFactor={22}>
            <span className="text-[10px] text-zinc-300">Z {z}</span>
          </Html>
        ))}

        {/* plan path */}
        {plannedPts.length >= 2 && <Line points={plannedPts} color="#3b82f6" lineWidth={2} />}

        {/* actual path, auto-colored by threshold */}
        {actualSegments.map((seg, idx) => (
          <Line key={idx} points={seg.points} color={seg.color} lineWidth={2} />
        ))}

        <OrbitControls enableDamping makeDefault />
      </Canvas>

      <div className="pointer-events-none absolute left-2 bottom-2 text-[10px] text-zinc-400">
        Surface (y=0) — depth increases downward • Deviation threshold: {Math.round(100 * thresholdLateral) / 100} m
      </div>
    </div>
  );
});


/* --- Sparkline with X & Y axes --- */
const Sparkline = React.memo(function Sparkline({ values = [] }) {
    const w = 520, h = 120, m = { l: 28, r: 20, t: 10, b: 22 };
    const W = w - m.l - m.r, H = h - m.t - m.b;
    const x = (i) => m.l + (i / Math.max(1, values.length - 1)) * W;
    const min = 0, max = 2.5, y = (v) => m.t + (1 - (v - min) / (max - min)) * H;
    const pts = values.map((v, i) => `${x(i)},${y(v)}`).join(" ");
  
    return (
      <div className="relative w-full aspect-[16/9] overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
        <svg viewBox={`0 0 ${w} ${h}`} className="h-full w-full">
          {/* Y-axis */}
          <line x1={m.l} y1={m.t} x2={m.l} y2={h - m.b} stroke="#475569" />
          {/* X-axis */}
          <line x1={m.l} y1={h - m.b} x2={w - m.r} y2={h - m.b} stroke="#475569" />
  
          {/* Y ticks */}
          {[0, 0.5, 1, 1.5, 2, 2.5].map((t) => (
            <g key={`y${t}`}>
              <line x1={m.l} x2={w - m.r} y1={y(t)} y2={y(t)} stroke="#27272a" />
              <text x={m.l - 6} y={y(t) + 3} textAnchor="end" fontSize="10" fill="#9ca3af">{t}</text>
            </g>
          ))}
  
          {/* X ticks */}
          {[0, 10, 20, 30, 40, 50].map((t) => {
            const posX = m.l + (t / 50) * W;
            return (
              <g key={`x${t}`}>
                <line x1={posX} x2={posX} y1={m.t} y2={h - m.b} stroke="#27272a" />
                <text x={posX} y={h - 6} textAnchor="middle" fontSize="10" fill="#9ca3af">{t}</text>
              </g>
            );
          })}
  
          {/* line */}
          <polyline points={pts} fill="none" stroke="#facc15" strokeWidth="2" />
        </svg>
      </div>
    );
  });

// utils
const hexToRgba = (hex, a = 1) => {
    if (!hex) return `rgba(99,102,241,${a})`;
    const h = hex.replace("#", "");
    const v = h.length === 3 ? h.split("").map(c => c + c).join("") : h;
    const n = parseInt(v, 16);
    const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  };
  
  const DepthPill = ({ children }) => (
    <span className="ml-2 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-zinc-300">
      {children}
    </span>
  );

  const EventLogTimeline = React.memo(function EventLogTimeline({ items = [] }) {
    return (
      <div className="relative max-h-64 overflow-auto pr-1">
        {/* vertical rail */}
        <div className="pointer-events-none absolute left-[18px] top-0 h-full w-px bg-zinc-800" />
        <ul className="space-y-3 pl-8 text-sm">
          {items.map((e, i) => {
            const nodeColor = e.color || "#60a5fa";
            const ring = hexToRgba(nodeColor, 0.35);
            return (
              <li key={i} className="relative">
                {/* node */}
                <span
                  className="absolute left-[11px] top-2 inline-block size-2.5 rounded-full"
                  style={{ background: nodeColor, boxShadow: `0 0 0 4px ${ring}` }}
                />
                <div className="grid grid-cols-[3.25rem_1fr] items-start gap-3">
                  <div className="pt-0.5 text-xs text-zinc-400">{e.time}</div>
                  <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/50 px-3 py-2">
                    <div className="text-zinc-200">
                      {e.text}
                      {e.depth && e.depth !== "—" ? (
                        <DepthPill>{e.depth}</DepthPill>
                      ) : null}
                    </div>
                    {e.meta ? (
                      <div className="mt-0.5 text-[11px] text-zinc-400">{e.meta}</div>
                    ) : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  });
    
  const EventLogBullets = React.memo(function EventLogBullets({ items = [] }) {
    return (
      <div className="max-h-64 overflow-auto pr-1">
        <ul className="space-y-2.5 text-sm">
          {items.map((e, i) => {
            const ring = hexToRgba(e.color || "#94a3b8", 0.35);
            return (
              <li
                key={i}
                className="group flex items-start gap-3 rounded-lg border border-zinc-800/60 bg-zinc-900/50 px-3 py-2 transition hover:-translate-y-[2px] hover:bg-white/5"
              >
                <span
                  className="mt-1 inline-block size-2.5 rounded-full"
                  style={{ background: e.color, boxShadow: `0 0 0 4px ${ring}` }}
                />
                <div className="flex-1">
                  <div className="text-zinc-200">
                    {e.text}
                    {e.depth ? <DepthPill>{e.depth}</DepthPill> : null}
                  </div>
                  {e.meta ? (
                    <div className="mt-0.5 text-[11px] text-zinc-400">{e.meta}</div>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  });

  const IconGrid = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0">
      <rect x="3" y="3" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.6"/>
      <rect x="14" y="3" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.6"/>
      <rect x="3" y="14" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.6"/>
      <rect x="14" y="14" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.6"/>
    </svg>
  );
  
  const IconPath = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0">
      <path d="M4 20c3-8 13-4 16-12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      <circle cx="4" cy="20" r="2" fill="currentColor"/>
      <circle cx="20" cy="8" r="2" fill="currentColor"/>
    </svg>
  );
  
  const NavItemRight = ({ to, icon, children }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition",
          "hover:bg-white/10 hover:text-white",
          isActive ? "bg-sky-500/20 text-sky-300 ring-1 ring-sky-500/30 shadow-[0_0_0_3px_rgba(56,189,248,0.08)]" : "text-zinc-300"
        ].join(" ")
      }
    >
      {icon} {children}
    </NavLink>
  );
  
  
  

/* --- The page --- */
const Drill3DPathPage = () => {
  const [pathPlanned] = useState([
    [0, 0, 0],
    [0, 1, 0],
    [0, 2, 0],
    [0, 3, 0],
    [0, 3.6, 0],
  ]);
  const [pathActual] = useState([
    [-2, 0, 0],
    [-2.1, 0.8, -0.1],
    [-2.8, 1.6, -0.2],
    [-3.6, 2.4, -0.6],
    [-4.8, 3.2, -1.2],
  ]);

  const [username, setUsername] = useState("Navin Kumar");
  const initials = useMemo(() => username.split(" ").map((s) => s[0]).join(""), [username]);
   // --- state (put near your other useState hooks) ---
const [eventsLeft, setEventsLeft] = useState([
    { color: "#ef4444", text: "Hole deviation", depth: "125m" },
    { color: "#eab308", text: "High axial vibration", depth: "413m" },
    { color: "#eab308", text: "Partial collapse likely", depth: "289m" },
  ]);
  
  const [eventsRight, setEventsRight] = useState([
    { time: "14:56", text: "Hole cansoin", depth: "—" },
    { time: "14:33", text: "Partial collapse likely", depth: "289m" },
  ]);
  

  const [lateralInstant] = useState(12);
  const [lateralCumulative] = useState(14.6);
  const [angularDeg] = useState(3.1);
  const [dls] = useState({ value: 1.3, unit: "deg/30 m" });
  const [correction] = useState("+0.6° inc, −0.3° azi");
  const [depthMeters] = useState(537.2);
  const [depthConfidence] = useState("OK");
  const [vibSeries] = useState(
    Array.from({ length: 60 }, (_, i) => 1 + 0.6 * Math.sin(i / 4) + 0.4 * Math.sin(i / 9))
  );

  const [view, setView] = useState("default");
  const [thresholdLateral] = useState(0.5); // 0.5 m = 50 cm

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0a0f1e] via-[#0b1224] to-[#0a0f1e] text-zinc-100">
        <header className="sticky top-0 z-10 border-b border-white/10 bg-[#0b1326]/80 backdrop-blur supports-[backdrop-filter]:bg-[#0b1326]/60">
  <div className="w-full mx-auto max-w-none 2xl:max-w-[1600px] px-4 py-3 2xl:px-8">
    <div className="flex items-center justify-between gap-4">
      {/* brand left */}
      <h1 className="text-xl md:text-2xl font-semibold tracking-tight">DrillSense</h1>

      {/* nav + user on the right */}
      <div className="flex items-center gap-3">
        <nav className="hidden sm:flex items-center gap-1 rounded-full bg-white/5 p-1 shadow-inner shadow-black/20">
          <NavItemRight to="/" icon={<IconGrid/>}>Dashboard</NavItemRight>
          <NavItemRight to="/dashboard" icon={<IconPath/>}>3D Path</NavItemRight>
        </nav>
        <HeaderUser username={username} initials={initials} />
      </div>
    </div>

    {/* mobile nav (drops under header) */}
    <nav className="mt-2 flex gap-2 sm:hidden">
      <NavItemRight to="/" icon={<IconGrid/>}>Dashboard</NavItemRight>
      <NavItemRight to="/dashboard" icon={<IconPath/>}>3D Path</NavItemRight>
    </nav>
  </div>
</header>


      <div className="mx-auto w-full max-w-none px-3 py-4 sm:px-4 sm:py-5 2xl:max-w-[1600px] 2xl:px-8">
        {/* <h1 className="mb-2 text-lg font-semibold tracking-tight text-zinc-200">3D Path</h1> */}

        {/* Top row (same structure): Path view (left, wider) + Deviation (right) */}
        <div className="grid grid-cols-1 gap-2 sm:gap-3 md:grid-cols-2 xl:grid-cols-3 auto-rows-fr">
          <section className="md:col-span-1 xl:col-span-2 overflow-hidden rounded-lg border border-white/10 bg-[#0f1424]/70 p-2 sm:p-3 shadow-lg shadow-black/30">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-300">
                Path View
              </h2>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setView("default")}
                  className="rounded-md border border-white/10 px-2 py-1 text-[10px] text-zinc-300 hover:bg-white/5"
                >
                  Default
                </button>
                <button
                  onClick={() => setView("top")}
                  className="rounded-md border border-white/10 px-2 py-1 text-[10px] text-zinc-300 hover:bg-white/5"
                >
                  Top
                </button>
              </div>
            </div>
            <ThreeDPathCanvasTopDown
              key={view}
              planned={pathPlanned}
              actual={pathActual}
              preset={view}
              thresholdLateral={thresholdLateral}
            />
          </section>

          <Card title="">
            <DeviationSidePanel
              lateralInstant={lateralInstant}
              lateralCumulative={lateralCumulative}
              angularDeg={angularDeg}
              dls={`${dls.value} ${dls.unit}`}
              correction={correction}
            />
          </Card>
        </div>

        {/* Bottom row (same structure): two compact cards */}
        <div className="mt-1 grid grid-cols-1 gap-2 sm:gap-3 md:grid-cols-2">
          <Card title="Depth & Encoder">
            <div className="text-4xl font-bold tracking-tight">
              {depthMeters}
              <span className="ml-1 text-lg align-top">m</span>
            </div>
            <div className="mt-1 text-xs text-zinc-400">Depth Confidence</div>
            <div className="mt-0.5 text-xl font-semibold text-emerald-400">{depthConfidence}</div>
          </Card>

          <Card title="Vibration">
            <div className="text-[11px] text-zinc-400">0–10 Hz</div>
            <Sparkline values={vibSeries} />
          </Card>
          <Card title="Event Log">
  <EventLogBullets items={eventsLeft} />
</Card>

{/* <Card title="Event Log">
  <EventLogTimeline items={eventsRight} />
</Card> */}
        </div>
      </div>
      <div className="flex justify-between items-center px-2 py-2 text-xs text-gray-500 border-t">
        <div className="flex items-center">
          <span className="font-medium text-yellow-500">QED</span>
          <span className="font-medium text-gray-200 ml-1">Analyticals</span>
          <span className="ml-2"> 2025</span>
        </div>
        <div>v2.1.0</div>
      </div>
    </div>
  );
};

export default Drill3DPathPage;



