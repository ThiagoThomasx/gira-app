/**
 * DecorativeBackground
 *
 * Pure visual ambience rendered behind the centered app card.
 * Completely inert: aria-hidden, pointer-events-none, z-index -1.
 *
 * Layering strategy
 * ─────────────────
 * 1. Radial gradient base — center matches card color (#FFF8F0), edges deepen
 *    to warm tan → removes the "abrupt wall" at the card boundary.
 * 2. Large organic blobs — anchored behind the card edges; as the viewport
 *    widens, more of each blob becomes visible in the gutter.
 * 3. Geometric accents — only shown on desktop (lg+) where the gutter is wide
 *    enough to give them context without competing with the card content.
 *
 * Responsiveness
 * ──────────────
 *   mobile  (<768px) : hidden entirely — zero visual impact
 *   tablet  (768px+) : gradient + blobs only, very faint
 *   desktop (1024px+): gradient + blobs + geometric accents
 */

import { motion } from "framer-motion";

// ─── primitive shapes ─────────────────────────────────────────────────────────

interface DotProps {
  color: string;
  size: number;
  opacity: number;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
}
function Dot({ color, size, opacity, top, left, right, bottom }: DotProps) {
  return (
    <div
      className="absolute rounded-full"
      style={{ width: size, height: size, background: color, opacity, top, left, right, bottom }}
    />
  );
}

/** 4-point star */
function Sparkle({ color, size, opacity }: { color: string; size: number; opacity: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ opacity }}>
      <path
        d="M12 2 L13.15 10.85 L22 12 L13.15 13.15 L12 22 L10.85 13.15 L2 12 L10.85 10.85 Z"
        fill={color}
      />
    </svg>
  );
}

/** Roulette ring — two concentric dashed circles with spokes */
function RouletteRing({ opacity }: { opacity: number }) {
  return (
    <svg width={92} height={92} viewBox="0 0 92 92" fill="none" style={{ opacity }}>
      <circle cx="46" cy="46" r="42" stroke="#E07B54" strokeWidth="1.5" strokeDasharray="8 5" />
      <circle cx="46" cy="46" r="27" stroke="#84A98C" strokeWidth="1"   strokeDasharray="5 7" />
      {/* Cardinal spokes */}
      <line x1="46" y1="4"  x2="46" y2="19" stroke="#E07B54" strokeWidth="1.2" strokeOpacity="0.55" />
      <line x1="46" y1="73" x2="46" y2="88" stroke="#E07B54" strokeWidth="1.2" strokeOpacity="0.55" />
      <line x1="4"  y1="46" x2="19" y2="46" stroke="#E07B54" strokeWidth="1.2" strokeOpacity="0.55" />
      <line x1="73" y1="46" x2="88" y2="46" stroke="#E07B54" strokeWidth="1.2" strokeOpacity="0.55" />
      {/* Center pip */}
      <circle cx="46" cy="46" r="4.5" fill="#E07B54" fillOpacity="0.45" />
    </svg>
  );
}

/** Double-arc — evokes a roulette wedge / target ring */
function WedgeArc({ color, opacity }: { color: string; opacity: number }) {
  return (
    <svg width={120} height={70} viewBox="0 0 120 70" fill="none" style={{ opacity }}>
      <path
        d="M 6 62 A 58 58 0 0 1 114 62"
        stroke={color} strokeWidth="2" strokeLinecap="round" fill="none"
      />
      <path
        d="M 22 62 A 42 42 0 0 1 98 62"
        stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.45" fill="none"
      />
    </svg>
  );
}

// ─── component ────────────────────────────────────────────────────────────────

export function DecorativeBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden hidden md:block"
      style={{ zIndex: -1 }}
    >

      {/* ══════════════════════════════════════════════════════════════
          LAYER 1 — Radial gradient base
          Center matches the app card so there's no abrupt color seam.
          Outer edges warm to tan, making the gutter feel intentional.
          ══════════════════════════════════════════════════════════════ */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(
            ellipse 56vw 90vh at 50% 46%,
            #FFF8F0 0%,
            #FAF1E4 24%,
            #F0E3CF 52%,
            #E8D5BB 100%
          )`,
        }}
      />

      {/* ══════════════════════════════════════════════════════════════
          LAYER 2 — Large ambient blobs  (tablet + desktop)
          Anchored behind the card edges. On tablet: only the outer
          (near-transparent) gradient edge peeks into the 48px gutter —
          almost invisible. On wide desktop: the richer inner part of
          each blob becomes visible in the gutter.
          ══════════════════════════════════════════════════════════════ */}

      {/* Blob coral — top-left anchor */}
      <motion.div
        className="absolute"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }}
        style={{
          top: "4%",
          left: "-90px",
          width: 390,
          height: 390,
          borderRadius: "58% 42% 64% 36% / 46% 58% 42% 54%",
          background: "radial-gradient(circle at 44% 40%, #E07B54 0%, transparent 64%)",
          opacity: 0.09,
        }}
      />

      {/* Blob sage — bottom-right anchor */}
      <motion.div
        className="absolute"
        animate={{ y: [0, 18, 0] }}
        transition={{ duration: 19, repeat: Infinity, ease: "easeInOut" }}
        style={{
          bottom: "3%",
          right: "-100px",
          width: 430,
          height: 430,
          borderRadius: "42% 58% 36% 64% / 58% 42% 60% 40%",
          background: "radial-gradient(circle at 60% 63%, #84A98C 0%, transparent 64%)",
          opacity: 0.10,
        }}
      />

      {/* Blob purple — mid-right counterpoint, smaller */}
      <motion.div
        className="absolute"
        animate={{ y: [0, -12, 6, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        style={{
          top: "22%",
          right: "-48px",
          width: 230,
          height: 230,
          borderRadius: "50% 50% 40% 60% / 44% 62% 38% 56%",
          background: "radial-gradient(circle at 50% 50%, #9B59B6 0%, transparent 64%)",
          opacity: 0.068,
        }}
      />

      {/* ══════════════════════════════════════════════════════════════
          LAYER 3 — Geometric accents  (desktop lg+ only)
          Positioned using vw units so they stay anchored in the gutter
          regardless of exact viewport width.
          ══════════════════════════════════════════════════════════════ */}
      {/* wrapper is display:none on tablet, block on desktop.
          absolute children still position against the outer fixed ancestor. */}
      <div className="hidden lg:block">

        {/* Roulette ring — right gutter, upper third, very slow spin */}
        <motion.div
          className="absolute"
          animate={{ rotate: 360 }}
          transition={{ duration: 72, repeat: Infinity, ease: "linear" }}
          style={{ top: "10%", right: "2.8vw" }}
        >
          <RouletteRing opacity={0.16} />
        </motion.div>

        {/* Wedge arc — bottom-left, static, grounded */}
        <div className="absolute" style={{ bottom: "9%", left: "-6px" }}>
          <WedgeArc color="#84A98C" opacity={0.20} />
        </div>

        {/* Sparkle gold — left gutter, upper-mid, gentle pulse */}
        <motion.div
          className="absolute"
          animate={{ opacity: [0.38, 0.65, 0.38], scale: [1, 1.09, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{ top: "33%", left: "2.6vw" }}
        >
          <Sparkle color="#F4C430" size={21} opacity={1} />
        </motion.div>

        {/* Dot cluster — left gutter, mid */}
        <Dot color="#E07B54" size={7}  opacity={0.21} top="51%"              left="2vw"                     />
        <Dot color="#84A98C" size={4}  opacity={0.17} top="calc(51% + 22px)" left="calc(2vw + 20px)"        />
        <Dot color="#F4C430" size={5}  opacity={0.25} top="calc(51% + 8px)"  left="calc(2vw - 2px)"         />
        <Dot color="#9B59B6" size={3}  opacity={0.16} top="calc(51% + 36px)" left="calc(2vw + 11px)"        />

        {/* Sparkle coral — right gutter, lower-mid, offset timing */}
        <motion.div
          className="absolute"
          animate={{ opacity: [0.28, 0.52, 0.28] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2.8 }}
          style={{ top: "63%", right: "3vw" }}
        >
          <Sparkle color="#E07B54" size={17} opacity={1} />
        </motion.div>

        {/* Dot pair — right gutter, mid */}
        <Dot color="#9B59B6" size={5} opacity={0.18} top="44%"              right="2.4vw"             />
        <Dot color="#F4C430" size={7} opacity={0.21} top="calc(44% + 20px)" right="calc(2.4vw + 14px)" />

      </div>
    </div>
  );
}
