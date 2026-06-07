import { motion } from "framer-motion";
import type { RouletteOption } from "../../types";

// Fallback palette when an option has no color assigned
const PALETTE = [
  "#E07B54", "#84A98C", "#9B59B6", "#F4C430",
  "#6BA8C4", "#E8866E", "#5BAD8A", "#C0776A",
];

// ─── svg helpers ──────────────────────────────────────────────────────────────

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
): string {
  const s = polar(cx, cy, r, startAngle);
  const e = polar(cx, cy, r, endAngle);
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y} Z`;
}

// ─── component ───────────────────────────────────────────────────────────────

interface RouletteWheelProps {
  options: RouletteOption[];
  rotation: number;
  isSpinning: boolean;
  size?: number;
}

const SPIN_DURATION = 3.6; // seconds — must match SpinPage timeout

export function RouletteWheel({
  options,
  rotation,
  isSpinning,
  size = 288,
}: RouletteWheelProps) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.455;
  const innerR = r * 0.18;
  const textR = r * 0.64;
  const rimR = r + 6;

  const totalWeight = options.reduce((sum, o) => sum + o.weight, 0);
  let cursor = -90; // start at top (12 o'clock)

  const segments = options.map((opt, i) => {
    const sweep = (opt.weight / totalWeight) * 360;
    const startAngle = cursor;
    const endAngle = cursor + sweep;
    const midAngle = cursor + sweep / 2;
    cursor = endAngle;

    const color = opt.color || PALETTE[i % PALETTE.length];
    const showLabel = sweep >= 22;

    // Truncate label so it fits inside the segment
    const maxChars = Math.max(3, Math.floor(sweep / 9));
    const rawLabel = opt.label;
    const label =
      rawLabel.length > maxChars
        ? rawLabel.slice(0, maxChars - 1) + "…"
        : rawLabel;

    const labelPos = polar(cx, cy, textR, midAngle);
    const fontSize = sweep > 55 ? 11 : sweep > 35 ? 10 : 9;

    return {
      opt, startAngle, endAngle, midAngle, sweep,
      color, showLabel, label, labelPos, fontSize,
    };
  });

  return (
    <div
      className="relative flex items-center justify-center select-none"
      style={{ width: size, height: size }}
      aria-label="Roleta"
    >
      {/* ── Fixed pointer (outside rotating group) ─────────────────────── */}
      <div
        className="absolute z-20 flex flex-col items-center"
        style={{ top: -4, left: "50%", transform: "translateX(-50%)" }}
      >
        {/* Triangle pointing down */}
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: "11px solid transparent",
            borderRight: "11px solid transparent",
            borderTop: "22px solid #1C1917",
            filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.25))",
          }}
        />
      </div>

      {/* ── Spinning wheel ──────────────────────────────────────────────── */}
      <motion.div
        animate={{ rotate: rotation }}
        transition={{
          duration: isSpinning ? SPIN_DURATION : 0,
          ease: isSpinning ? [0.22, 1, 0.36, 1] : "linear",
        }}
        style={{ width: size, height: size }}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          overflow="visible"
        >
          {/* Outer rim shadow */}
          <circle
            cx={cx} cy={cy} r={rimR + 3}
            fill="none"
            stroke="rgba(28,25,23,0.10)"
            strokeWidth={9}
          />
          {/* Outer rim */}
          <circle
            cx={cx} cy={cy} r={rimR}
            fill="none"
            stroke="#1C1917"
            strokeWidth={3}
          />

          {/* Segments */}
          {segments.map(({ opt, startAngle, endAngle, midAngle, color, showLabel, label, labelPos, fontSize }) => (
            <g key={opt.id}>
              <path
                d={arcPath(cx, cy, r, startAngle, endAngle)}
                fill={color}
                stroke="rgba(255,255,255,0.55)"
                strokeWidth={1.5}
              />
              {showLabel && (
                <text
                  x={labelPos.x}
                  y={labelPos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={fontSize}
                  fontWeight="700"
                  fontFamily="Inter, system-ui, sans-serif"
                  fill="rgba(255,255,255,0.95)"
                  transform={`rotate(${midAngle + 90}, ${labelPos.x}, ${labelPos.y})`}
                  style={{ paintOrder: "stroke", stroke: "rgba(0,0,0,0.25)", strokeWidth: 3 }}
                >
                  {label}
                </text>
              )}
            </g>
          ))}

          {/* Center cap shadow */}
          <circle cx={cx} cy={cy} r={innerR + 5} fill="rgba(28,25,23,0.15)" />
          {/* Center cap */}
          <circle cx={cx} cy={cy} r={innerR} fill="white" />
          {/* Center emoji */}
          <text
            x={cx}
            y={cy + 1}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={innerR * 0.9}
          >
            🎯
          </text>
        </svg>
      </motion.div>

      {/* ── Spinning glow ring ──────────────────────────────────────────── */}
      {isSpinning && (
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          style={{
            boxShadow: "0 0 32px 8px rgba(224,123,84,0.35)",
          }}
        />
      )}
    </div>
  );
}
