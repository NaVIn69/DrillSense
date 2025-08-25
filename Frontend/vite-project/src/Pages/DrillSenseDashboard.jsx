import React, { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";

// DrillSense Dashboard – per-section useState (no Context) + memoized children
// Goal: if only Hole Quality updates, only that card re-renders.
// - Each section owns its own state via useState in the parent
// - Children are React.memo so unchanged props skip re-render
// - Hardcoded initial data; replace set* calls with your backend updates


const DrillSenseDashboard = () => {
  // Header
  const [username, setUsername] = useState("Navin Kumar");

  // Depth KPI
  const [depthMeters, setDepthMeters] = useState(2430);

  // Deviation (concentric rings)
  const [deviationRings, setDeviationRings] = useState([
    { label: "<3°", color: "#86efac", thickness: 18 },
    { label: "3°–5°", color: "#fbbf24", thickness: 12 },
    { label: ">5°", color: "#f87171", thickness: 8 },
  ]);

  // Hole Quality (GNSS deviation)
  const [xStepMeters, setXStepMeters] = useState(5);
  const [gnssDeviationSeries, setGnssDeviationSeries] = useState(
    Array.from({ length: 60 }, (_, i) =>
      -4 + 2 * Math.sin(i / 3) + 1.2 * Math.cos(i / 5) + (i > 25 ? (i - 25) / 30 : 0)
    )
  );

  // Vibration (bars)
  const [vibrationBins, setVibrationBins] = useState([0.5, 0.9, 1.2, 1.6, 2.2]);
  const [vibrationRanges, setVibrationRanges] = useState(["0–10", "10–20", "20–40", "40–60", "≥60"]);

  // Tables (hardcoded for now)
  const [trajectory, setTrajectory] = useState({
    inclinationDeg: 5,
    azimuthDeg: 25,
    toolfaceDeg: 5,
    holeDepthM: 8,
    xyz: "x=2,y=3,x=5",
    tvdM: 11,
    predicted: "Computing…",
  });
  const [deviationMetrics, setDeviationMetrics] = useState({
    lateral: { instant: 0.8, cumulative: 14.6 },
    angularDeg: 2.1,
    dls: { value: 1.3, unit: "deg/30 m" },
    correction: "+0.6° inc, −0.3° azi",
  });
  const [quality, setQuality] = useState({
    openness: "No events – clear",
    straightness: "Within tolerance",
    toeLikelihood: "Low likelihood",
  });

  const initials = useMemo(() => username.split(" ").map((s) => s[0]).join(""), [username]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0a0f1e] via-[#0b1224] to-[#0a0f1e] text-zinc-100">
      {/* Header */}
      {/* <header className="sticky top-0 z-10 border-b border-white/10 bg-[#0b1326]/80 backdrop-blur supports-[backdrop-filter]:bg-[#0b1326]/60">
        <div className="w-full mx-auto max-w-none 2xl:max-w-[1600px] px-4 py-4 2xl:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-xl md:text-2xl font-semibold tracking-tight">DrillSense</h1>
            <HeaderUser username={username} initials={initials} />
          </div>
        </div>
      </header> */}
      {/* <header className="sticky top-0 z-10 border-b border-white/10 bg-[#0b1326]/80 backdrop-blur supports-[backdrop-filter]:bg-[#0b1326]/60">
  <div className="w-full mx-auto max-w-none 2xl:max-w-[1600px] px-4 py-3 2xl:px-8">
    <div className="flex items-center justify-between gap-4">
      {/* Brand + Nav */}
     {/* <div className="flex items-center gap-6">
        <h1 className="text-xl md:text-2xl font-semibold tracking-tight">DrillSense</h1>
        <nav className="hidden md:flex items-center gap-1 rounded-lg bg-white/5 p-1">
          <NavItem to="/">Dashboard</NavItem>
          <NavItem to="/3d-path">3D Path</NavItem>
        </nav>
      </div>

      {/* User */}
     {/* <HeaderUser username={username} initials={initials} />
    </div>

    {/* Mobile nav */}
   {/*} <nav className="mt-2 flex gap-2 md:hidden">
      <NavItem to="/">Dashboard</NavItem>
      <NavItem to="/3d-path">3D Path</NavItem>
    </nav>
  </div>
</header> */}
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



      {/* Main */}
      <main className="w-full mx-auto max-w-none 2xl:max-w-[1600px] px-6 py-4 2xl:px-8">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {/* Deviation */}
          <Card title="Deviation from Planned Path">
            <DeviationCard rings={deviationRings} />
          </Card>

          {/* Hole Quality – big */}
          <Card title="Hole Quality" className="lg:col-span-2">
            <div className="mb-2 text-xs text-zinc-400">GNSS Deviation</div>
            <LineChart
              data={gnssDeviationSeries}
              xStep={xStepMeters}
              yDomain={[-10, 10]}
              yTicks={[-10, -5, 0, 5, 10]}
              xTickStep={50}
              unitSuffix="/m"
            />
          </Card>

          {/* Vibration */}
          <Card title="Vibration" className="lg:col-span-2">
            <div className="mb-2 text-xs text-zinc-400">RMS Vibration</div>
            <BarChart
              values={vibrationBins}
              labels={vibrationRanges}
              yDomain={[0, 2.5]}
              yTicks={[0, 0.5, 1, 1.5, 2, 2.5]}
            />
          </Card>

          {/* Depth KPI */}
          <Card title="Hole Depth">
            <DepthKPI meters={depthMeters} />
          </Card>
        </div>

        {/* Tables */}
        <div className="mt-6 grid grid-cols-1 gap-3 lg:grid-cols-3">
          <Card title="Trajectory & Position">
            <dl className="grid grid-cols-1 gap-3 text-sm">
              <Row term="Inclination" value={`${trajectory.inclinationDeg}°`} />
              <Row term="Azimuth" value={`${trajectory.azimuthDeg}°`} />
              <Row term="Toolface orientation" value={`${trajectory.toolfaceDeg}°`} />
              <Row term="Hole Depth" value={`${trajectory.holeDepthM} m`} />
              <Row term="3‑D trajectory (X, Y, Z)" value={trajectory.xyz} />
              <Row term="True vertical depth (TVD)" value={`${trajectory.tvdM} m`} />
              <Row term="Predicted final trajectory" value={trajectory.predicted} />
            </dl>
          </Card>

          <Card title="Deviation & Accuracy">
            <dl className="grid grid-cols-1 gap-3 text-sm">
              <Row term="Lateral deviation (cm/m)" value={`Instant: ${deviationMetrics.lateral.instant}, Cumulative: ${deviationMetrics.lateral.cumulative}`} />
              <Row term="Angular deviation" value={`${deviationMetrics.angularDeg}° off plan`} />
              <Row term="Dogleg severity (DLS)" value={`${deviationMetrics.dls.value} ${deviationMetrics.dls.unit}`} />
              <Row term="Predicted correction required" value={deviationMetrics.correction} />
            </dl>
          </Card>

          <Card title="Hole Quality & Stability">
            <dl className="grid grid-cols-1 gap-3 text-sm">
              <Row term="Openness / collapse events" value={quality.openness} intent="good" />
              <Row term="Hole straightness / wobble" value={quality.straightness} intent="good" />
              <Row term="Toe formation / floor shortfall" value={quality.toeLikelihood} intent="good" />
            </dl>
          </Card>
        </div>
      </main>
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

// ---------- Small, memoized pieces ----------
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

function Card({ title, className = "", children }) {
  return (
    <section className={`overflow-hidden rounded-xl border border-white/10 bg-[#0f1424]/70 p-3 shadow-lg shadow-black/30 ${className}`}>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-300">{title}</h2>
      {children}
    </section>
  );
}

const DepthKPI = React.memo(function DepthKPI({ meters }) {
  return (
    <div className="grid h-[140px] place-items-center">
      <div className="text-center">
        <div className="text-5xl font-bold tracking-tight">{meters}</div>
        <div className="mt-1 text-sm text-zinc-300">meters</div>
      </div>
    </div>
  );
});

const Row = React.memo(function Row({ term, value, intent = "neutral" }) {
  const pill =
    intent === "good"
      ? "bg-emerald-500/15 text-emerald-300"
      : intent === "warn"
      ? "bg-amber-500/15 text-amber-300"
      : intent === "bad"
      ? "bg-rose-500/15 text-rose-300"
      : "bg-zinc-700/20 text-zinc-200";
  return (
    <div className="flex cursor-default items-center justify-between gap-4 rounded-lg border border-zinc-800/60 bg-zinc-900/60 px-3 py-2 transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg hover:shadow-sky-500/10">
      <dt className="text-zinc-300">{term}</dt>
      <dd className={`rounded-full px-2 py-1 text-xs ${pill}`}>{value}</dd>
    </div>
  );
});

// ---------- Deviation card ----------
const DeviationCard = React.memo(function DeviationCard({ rings }) {
  return (
    <div className="flex items-center gap-5">
      <ConcentricRings rings={rings} size={136} gap={4} />
      <ul className="space-y-2 text-xs">
        {rings.map((r, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="inline-block size-3 rounded-sm" style={{ background: r.color }} />
            <span className="text-zinc-300">{r.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
});

const ConcentricRings = React.memo(function ConcentricRings({ rings = [], size = 136, gap = 4, showCenter = true }) {
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size / 2 - 4;
  let offset = 0;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
        {rings.map((r, i) => {
          const rOuter = outerR - offset;
          const radius = Math.max(2, rOuter - r.thickness / 2);
          offset += r.thickness + gap;
          return (
            <circle key={i} cx={cx} cy={cy} r={radius} fill="none" stroke={r.color} strokeWidth={r.thickness} strokeLinecap="round" />
          );
        })}
      </svg>
      {showCenter && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="size-3 rounded-full bg-sky-400 ring-4 ring-emerald-300" />
        </div>
      )}
    </div>
  );
});

// ---------- Charts ----------
const LineChart = React.memo(function LineChart({ data, xStep = 10, yDomain = [-10, 10], yTicks = [-10, -5, 0, 5, 10], xTickStep = 50, unitSuffix = "" }) {
  const viewW = 800;
  const viewH = 360;
  const m = { left: 52, right: 26, top: 16, bottom: 32 };
  const W = viewW - m.left - m.right;
  const H = viewH - m.top - m.bottom;
  const xMax = (data.length - 1) * xStep;

  const xScale = useMemo(() => (i) => m.left + (i / Math.max(1, data.length - 1)) * W, [data.length, W, m.left]);
  const yScale = useMemo(() => {
    const [min, max] = yDomain;
    const k = 1 / (max - min);
    return (v) => m.top + (1 - (v - min) * k) * H;
  }, [yDomain, H, m.top]);

  const points = useMemo(() => data.map((v, i) => `${xScale(i)},${yScale(v)}`).join(" "), [data, xScale, yScale]);
  const xTicks = useMemo(() => Array.from({ length: Math.floor(xMax / xTickStep) + 1 }, (_, k) => k * xTickStep), [xMax, xTickStep]);

  return (
    <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9] overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
      <svg viewBox={`0 0 ${viewW} ${viewH}`} preserveAspectRatio="xMidYMid meet" className="h-full w-full">
        {/* axes */}
        <line vectorEffect="non-scaling-stroke" x1={m.left} y1={m.top} x2={m.left} y2={viewH - m.bottom} stroke="#475569" strokeWidth="1" />
        <line vectorEffect="non-scaling-stroke" x1={m.left} y1={viewH - m.bottom} x2={viewW - m.right} y2={viewH - m.bottom} stroke="#475569" strokeWidth="1" />

        {/* y ticks + grid */}
        {yTicks.map((t) => (
          <g key={t}>
            <line vectorEffect="non-scaling-stroke" x1={m.left} x2={viewW - m.right} y1={yScale(t)} y2={yScale(t)} stroke="#27272a" />
            <text x={m.left - 8} y={yScale(t) + 3} textAnchor="end" fontSize="12" fill="#9ca3af">{t}</text>
          </g>
        ))}

        {/* x ticks + grid */}
        {xTicks.map((xVal) => {
          const i = xVal / xStep;
          const x = xScale(i);
          return (
            <g key={xVal}>
              <line vectorEffect="non-scaling-stroke" x1={x} x2={x} y1={m.top} y2={viewH - m.bottom} stroke="#27272a" />
              <text x={x} y={viewH - m.bottom + 14} textAnchor="middle" fontSize="12" fill="#9ca3af">{xVal}</text>
            </g>
          );
        })}

        {/* zero baseline (dashed green) */}
        <line vectorEffect="non-scaling-stroke" x1={m.left} y1={yScale(0)} x2={viewW - m.right} y2={yScale(0)} stroke="#22c55e" strokeDasharray="4 4" />

        {/* series */}
        <polyline vectorEffect="non-scaling-stroke" points={points} fill="none" stroke="#60a5fa" strokeWidth="2" />
      </svg>
      {unitSuffix ? (
        <div className="absolute bottom-1 right-2 text-[10px] sm:text-[11px] md:text-xs text-zinc-400">{unitSuffix}</div>
      ) : null}
    </div>
  );
});

const BarChart = React.memo(function BarChart({ values, labels, yDomain = [0, 2.5], yTicks = [0, 0.5, 1, 1.5, 2, 2.5], barColor = "#60a5fa" }) {
  const viewW = 800;
  const viewH = 360;
  const m = { left: 52, right: 20, top: 16, bottom: 40 };
  const W = viewW - m.left - m.right;
  const H = viewH - m.top - m.bottom;
  const [yMin, yMax] = yDomain;

  const yScale = useMemo(() => {
    const k = 1 / (yMax - yMin);
    return (v) => m.top + (1 - (v - yMin) * k) * H;
  }, [yMin, yMax, H, m.top]);

  const n = values.length;
  const gap = (W / Math.max(1, n)) * 0.4;
  const barW = W / Math.max(1, n) - gap * 0.2;

  return (
    <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9] overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
      <svg viewBox={`0 0 ${viewW} ${viewH}`} preserveAspectRatio="xMidYMid meet" className="h-full w-full">
        {/* axes */}
        <line vectorEffect="non-scaling-stroke" x1={m.left} y1={m.top} x2={m.left} y2={viewH - m.bottom} stroke="#475569" strokeWidth="1" />
        <line vectorEffect="non-scaling-stroke" x1={m.left} y1={viewH - m.bottom} x2={viewW - m.right} y2={viewH - m.bottom} stroke="#475569" strokeWidth="1" />

        {/* y ticks */}
        {yTicks.map((t) => (
          <g key={t}>
            <line vectorEffect="non-scaling-stroke" x1={m.left} x2={viewW - m.right} y1={yScale(t)} y2={yScale(t)} stroke="#27272a" />
            <text x={m.left - 8} y={yScale(t) + 3} textAnchor="end" fontSize="12" fill="#9ca3af">{t}</text>
          </g>
        ))}

        {/* bars + x labels */}
        {values.map((v, i) => {
          const x = m.left + i * (W / Math.max(1, n)) + gap * 0.1;
          const y = yScale(Math.max(v, 0));
          const h = viewH - m.bottom - y;
          return (
            <g key={labels[i] || i}>
              <rect vectorEffect="non-scaling-stroke" x={x} y={y} width={barW} height={h} rx={4} ry={4} fill={barColor} />
              <text x={x + barW / 2} y={viewH - m.bottom + 16} textAnchor="middle" fontSize="12" fill="#9ca3af">{labels[i] || `${i}`}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
});

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



export default DrillSenseDashboard;

