/* ============================================================================
   GlóriaFC — COMPONENTES REUTILIZÁVEIS
   LiveCounter · CountryBadge · LeaderboardRow · PackageCard · LogItem ·
   CurrencySelector
   ========================================================================= */

const { useState, useEffect, useRef, useLayoutEffect } = React;

/* ---------------------------------------------------------------------------
   LiveCounter — número que faz count-up animado quando o valor muda.
   ------------------------------------------------------------------------ */
function LiveCounter({ value, duration = 900, className = "", style = {} }) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const rafRef = useRef(null);

  useEffect(() => {
    const from = fromRef.current;
    const to = value;
    if (from === to) return;
    const start = performance.now();
    cancelAnimationFrame(rafRef.current);
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
      else fromRef.current = to;
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value, duration]);

  return (
    <span className={"tabular-nums " + className} style={style}>
      {display.toLocaleString("pt-BR")}
    </span>
  );
}

/* ---------------------------------------------------------------------------
   CountryBadge — bandeira + nome, em tamanhos variados.
   ------------------------------------------------------------------------ */
function CountryBadge({ flag, name, size = "md", className = "" }) {
  const flagSize = { sm: "text-2xl", md: "text-3xl", lg: "text-5xl", xl: "text-7xl" }[size];
  const nameSize = { sm: "text-sm", md: "text-base", lg: "text-2xl", xl: "text-3xl" }[size];
  return (
    <div className={"flex items-center gap-3 " + className}>
      <span className={flagSize + " leading-none drop-shadow"}>{flag}</span>
      {name && <span className={nameSize + " font-semibold tracking-tight"}>{name}</span>}
    </div>
  );
}

/* ---------------------------------------------------------------------------
   LeaderboardRow — uma linha do ranking. Pulsa quando os pontos mudam.
   forwardRef para o FLIP de reordenação no pai.
   ------------------------------------------------------------------------ */
const LeaderboardRow = React.forwardRef(function LeaderboardRow(
  { rank, country, isUser, justChanged, motion }, ref
) {
  const top3 = rank <= 3;

  const [riseKey, setRiseKey] = useState(0);
  const [showRise, setShowRise] = useState(false);
  const prevRankRef = useRef(rank);
  const riseTimerRef = useRef(null);

  useEffect(() => {
    const prev = prevRankRef.current;
    prevRankRef.current = rank;
    if (motion === "off" || prev === rank) return;
    if (prev > rank) {
      clearTimeout(riseTimerRef.current);
      setRiseKey((k) => k + 1);
      setShowRise(true);
      riseTimerRef.current = setTimeout(() => setShowRise(false), 1400);
    }
  }, [rank, motion]);

  const shimmerClass =
    rank === 1 ? "gfc-rank-shimmer gfc-neon-gold" :
    rank === 2 ? "gfc-rank-shimmer-2 gfc-neon-silver" :
                 "gfc-rank-shimmer-3 gfc-neon-bronze";

  const rowGlowClass =
    rank === 1 ? "gfc-row-gold" :
    rank === 2 ? "gfc-row-silver" :
    rank === 3 ? "gfc-row-bronze" : "";

  return (
    <div
      ref={ref}
      className={
        "relative flex items-center gap-3 sm:gap-4 rounded-2xl px-3 sm:px-4 py-3 " +
        "transition-all duration-300 will-change-transform " +
        (isUser
          ? "bg-[var(--green)]/15 ring-1 ring-[var(--green)]/60 gfc-box-neon-strong"
          : "bg-white/[0.025] hover:bg-white/[0.05] ring-1 ring-white/5 " + rowGlowClass)
      }
    >
      {/* posição */}
      <div className={"relative w-9 sm:w-11 shrink-0 text-center font-display font-extrabold tabular-nums " +
        (!top3 ? "text-white/35" : "") + " " +
        (top3 ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl")}>
        {top3 ? <span className={shimmerClass}>{rank}</span> : rank}
        {showRise && (
          <span
            key={riseKey}
            className="gfc-rise-badge absolute left-1/2 top-0 text-[var(--green-bright)] text-xs leading-none pointer-events-none select-none"
          >
            ↑
          </span>
        )}
      </div>

      {/* bandeira */}
      <span className="text-2xl sm:text-3xl leading-none shrink-0 drop-shadow">{country.flag_emoji}</span>

      {/* nome */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="whitespace-nowrap font-semibold tracking-tight text-[15px] sm:text-base text-white/95">
            {country.name}
          </span>
          {isUser && (
            <span className="shrink-0 rounded-full bg-[var(--green)]/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--green-bright)]">
              Vos
            </span>
          )}
        </div>
      </div>

      {/* pontos */}
      <div className="shrink-0 text-right">
        <LiveCounter
          value={country.total_points}
          className={
            "font-display font-extrabold tabular-nums leading-none transition-transform " +
            (top3 ? "text-xl sm:text-2xl" : "text-lg sm:text-xl") + " " +
            (justChanged && motion !== "off" ? "gfc-pop text-[var(--green-bright)]" : "text-white")
          }
        />
        <div className="text-[10px] font-medium uppercase tracking-widest text-white/30 -mt-0.5">Glorias</div>
      </div>
    </div>
  );
});

/* ---------------------------------------------------------------------------
   PackageCard — card de pacote com preço na moeda local.
   ------------------------------------------------------------------------ */
function PackageCard({ pkg, currency, onSupport, busy }) {
  const popular = pkg.popular;
  const price = window.GFC.formatPrice(pkg.prices[currency] ?? pkg.prices.USD, pkg.prices[currency] ? currency : "USD");

  return (
    <div
      className={
        "relative flex flex-col rounded-3xl p-5 sm:p-6 transition-all duration-200 gfc-card-hover " +
        (popular
          ? "bg-gradient-to-b from-[var(--green)]/18 to-[var(--bg-2)] ring-2 ring-[var(--green)]/60 shadow-[0_20px_60px_-20px_var(--green)]"
          : "bg-white/[0.03] ring-1 ring-white/8 hover:ring-white/15")
      }
    >
      {popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--green)] px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#04130c] shadow-lg">
          Más popular
        </span>
      )}

      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">{pkg.name}</div>

      <div className="mt-2">
        <span className="font-display text-5xl sm:text-6xl font-extrabold leading-none text-white">
          {pkg.points.toLocaleString("pt-BR")}
        </span>
        <div className="mt-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[var(--green-bright)]">Glorias</div>
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="font-display text-2xl font-bold text-white">{price}</span>
        {!pkg.prices[currency] && (
          <span className="text-[10px] uppercase tracking-wide text-white/35">en USD</span>
        )}
      </div>

      <button
        onClick={onSupport}
        disabled={busy}
        className={
          "mt-5 w-full rounded-2xl py-3.5 text-sm font-extrabold uppercase tracking-wider transition-all active:scale-[0.97] disabled:opacity-50 " +
          (popular
            ? "bg-[var(--green)] text-[#04130c] hover:bg-[var(--green-bright)] shadow-lg shadow-[var(--green)]/30"
            : "bg-white/10 text-white hover:bg-white/16 ring-1 ring-white/10")
        }
      >
        {busy ? "Enviando…" : "Apoyar"}
      </button>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   LogItem — item do feed "Últimas Glórias".
   ------------------------------------------------------------------------ */
function LogItem({ item, fresh, motion }) {
  const [, force] = useState(0);
  // re-render periódico p/ atualizar o tempo relativo
  useEffect(() => {
    const i = setInterval(() => force((n) => n + 1), 15000);
    return () => clearInterval(i);
  }, []);

  return (
    <div
      className={
        "flex items-center gap-3 rounded-2xl bg-white/[0.03] ring-1 ring-white/6 px-3.5 py-2.5 " +
        (fresh && motion !== "off" ? "gfc-log-neon-flash" : "")
      }
    >
      <span className="text-2xl leading-none shrink-0">{item.flag_emoji}</span>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[13px] text-white/90">
          <span className="font-semibold">{item.display_name || "Anónimo"}</span>
          <span className="text-white/45"> · {item.country}</span>
        </div>
        <div className="text-[11px] text-white/35">{window.GFC.relativeTime(item.created_at)}</div>
      </div>
      <div className="shrink-0 font-display font-extrabold text-[var(--green-bright)] text-sm">
        +{item.points.toLocaleString("pt-BR")}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   CurrencySelector — escolhe país (→ define moeda). Re-renderiza preços.
   ------------------------------------------------------------------------ */
function CurrencySelector({ countries, value, onChange }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-white/[0.04] ring-1 ring-white/10 pl-3.5 pr-1.5 py-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-white/45">Moneda</span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none cursor-pointer rounded-full bg-[#16201b] hover:bg-[#1f2d26] pl-3 pr-8 py-1.5 text-sm font-semibold text-white outline-none ring-1 ring-white/10 focus:ring-[var(--green)]/50"
        >
          {countries.map((c) => {
            const cur = window.GFC.currencyForCountry(c.iso2);
            return (
              <option key={c.iso2} value={c.iso2} className="bg-[#0d1411] text-white">
                {c.flag_emoji} {c.name} — {cur}
              </option>
            );
          })}
        </select>
        <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.085l3.71-3.855a.75.75 0 111.08 1.04l-4.25 4.41a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   ConfettiBurst — partículas explodem ao completar um apoio.
   triggerKey: número que incrementa a cada disparo.
   ------------------------------------------------------------------------ */
function ConfettiBurst({ triggerKey }) {
  const [particles, setParticles] = useState([]);
  const didMount = useRef(false);

  useEffect(() => {
    if (!didMount.current) { didMount.current = true; return; }
    if (!triggerKey) return;
    const colors = ["#10b981", "#34d399", "#fbbf24", "#ffffff", "#fb923c", "#60a5fa", "#f472b6"];
    const count = 54;
    const p = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: 8 + (i / count) * 84,
      color: colors[i % colors.length],
      size: 5 + (i % 5),
      delay: (i % 12) * 0.032,
      duration: 0.80 + (i % 6) * 0.13,
      dx: ((i % 22) - 11) * 15,
      round: i % 3 !== 0,
    }));
    setParticles(p);
    const t = setTimeout(() => setParticles([]), 2500);
    return () => clearTimeout(t);
  }, [triggerKey]);

  if (!particles.length) return null;

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 60, overflow: "hidden" }}>
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.left}%`,
            top: "38%",
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: p.round ? "50%" : "2px",
            "--cdx": `${p.dx}px`,
            animation: `gfc-confetti-fall ${p.duration}s ${p.delay}s ease-out forwards`,
          }}
        />
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------------------
   OnboardingModal — popup de entrada: nome, email e país.
   Salva em localStorage. Fecha e repassa dados ao app.
   ------------------------------------------------------------------------ */
function OnboardingModal({ countries, onComplete }) {
  const sorted = [
    ...countries.filter((c) => c.iso2 === "AR"),
    ...countries.filter((c) => ["BR","MX","CO","UY","CL","PE","ES","PT"].includes(c.iso2)),
    ...countries.filter((c) => !["AR","BR","MX","CO","UY","CL","PE","ES","PT"].includes(c.iso2)),
  ];

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [iso2, setIso2] = useState("AR");
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) { setError("Ingresá tu nombre."); return; }
    if (!email.includes("@")) { setError("Email inválido."); return; }
    try { localStorage.setItem("gfc_user", JSON.stringify({ name: name.trim(), email, iso2 })); } catch(_) {}
    onComplete({ name: name.trim(), email, iso2 });
  };

  const country = sorted.find((c) => c.iso2 === iso2) || sorted[0];

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4"
         style={{background:"rgba(0,0,0,0.85)", backdropFilter:"blur(12px)"}}>
      <div className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 gfc-enter gfc-enter-1"
           style={{background:"linear-gradient(160deg,#0a1a12,#071009)", boxShadow:"0 0 60px rgba(16,185,129,0.25), 0 0 0 1px rgba(16,185,129,0.35)"}}>

        {/* Logo + headline */}
        <div className="text-center mb-6">
          <div className="font-display text-2xl font-extrabold text-white">
            Gloria<span style={{color:"var(--green)"}}>FC</span>
          </div>
          <h2 className="mt-2 font-display text-[28px] font-extrabold leading-tight text-white">
            ¿Por quién vas<br/>a alentar?
          </h2>
          <p className="mt-2 text-sm" style={{color:"rgba(255,255,255,0.45)"}}>
            Unite al ranking mundial de hinchada 2026.
          </p>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-4">
          {/* País */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5 gfc-kicker" style={{color:"var(--green-bright)"}}>
              Tu selección
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-xl leading-none">{country.flag_emoji}</div>
              <select value={iso2} onChange={(e) => setIso2(e.target.value)}
                className="w-full appearance-none rounded-2xl pl-10 pr-8 py-3.5 text-sm font-semibold text-white outline-none cursor-pointer"
                style={{background:"rgba(255,255,255,0.06)", border:"1px solid rgba(16,185,129,0.35)"}}>
                {sorted.map((c) => (
                  <option key={c.iso2} value={c.iso2} className="bg-[#0d1411]">
                    {c.flag_emoji} {c.name}
                  </option>
                ))}
              </select>
              <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{color:"rgba(255,255,255,0.4)"}} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.085l3.71-3.855a.75.75 0 111.08 1.04l-4.25 4.41a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Nome */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5 gfc-kicker" style={{color:"var(--green-bright)"}}>
              Tu nombre
            </label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Ej.: Diego Armando" maxLength={32} autoComplete="name"
              className="w-full rounded-2xl px-4 py-3.5 text-sm text-white outline-none"
              style={{background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)"}} />
          </div>

          {/* Email */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5 gfc-kicker" style={{color:"var(--green-bright)"}}>
              Tu email
            </label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="diego@ejemplo.com" autoComplete="email"
              className="w-full rounded-2xl px-4 py-3.5 text-sm text-white outline-none"
              style={{background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)"}} />
          </div>

          {error && <p className="text-xs text-red-400 -mt-1">{error}</p>}

          <button type="submit"
            className="gfc-cta-pulse mt-1 w-full rounded-2xl py-4 font-display text-lg font-extrabold uppercase tracking-wider text-[#04130c] transition-all hover:brightness-110 active:scale-[0.98]"
            style={{background:"var(--green)"}}>
            {country.flag_emoji} ¡Entrar al ranking!
          </button>

          <p className="text-center text-[11px]" style={{color:"rgba(255,255,255,0.28)"}}>
            Tu email es privado. Solo tu nombre aparece en el feed.
          </p>
        </form>
      </div>
    </div>
  );
}

Object.assign(window, {
  LiveCounter, CountryBadge, LeaderboardRow, PackageCard, LogItem, CurrencySelector, ConfettiBurst, OnboardingModal,
});
