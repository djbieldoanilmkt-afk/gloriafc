/* ============================================================================
   GlóriaFC — SEÇÕES
   HeroScoreboard · LiveRanking · SupportSection · LiveFeed · SiteFooter
   ========================================================================= */

/* ---------------------------------------------------------------------------
   useScrollReveal — dispara animação quando a seção entra na viewport.
   ------------------------------------------------------------------------ */
function useScrollReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible ? "gfc-section-visible" : "gfc-section-hidden"];
}

/* ---------------------------------------------------------------------------
   HeroScoreboard — placar ao vivo da seleção do usuário.
   ------------------------------------------------------------------------ */
function HeroScoreboard({ userCountry, userRank, globalToday, rivalGap, onCTA }) {
  return (
    <header className="relative overflow-hidden px-5 pt-5 pb-5 sm:pt-8 sm:pb-6">
      {/* holofotes / brilho de estádio */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-30%] h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-[var(--green)]/22 blur-[110px]" />
        <div className="absolute right-[-10%] top-[20%] h-[280px] w-[280px] rounded-full bg-[var(--gold)]/12 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-start">

          {/* Esquerda: título + card */}
          <div className="flex-1 min-w-0">
            <h1 className="gfc-glitch font-display text-[36px] leading-[0.95] sm:text-5xl font-extrabold tracking-tight text-white text-balance">
              ¿Cuánto vale<br />tu hinchada?
            </h1>
            <p className="mt-2 max-w-md text-[14px] sm:text-base leading-relaxed text-white/50">
              Dale Glorias a tu selección y hacela subir en el ranking 2026.
            </p>

            {/* card da seleção */}
            <div className="gfc-scanline mt-5 rounded-3xl bg-white/[0.04] ring-1 ring-[var(--green)]/20 p-4 sm:p-5 backdrop-blur gfc-box-neon">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-5xl leading-none drop-shadow-lg">{userCountry.flag_emoji}</span>
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-widest text-white/40">Tu selección</div>
                    <div className="font-display text-xl sm:text-2xl font-extrabold tracking-tight text-white">{userCountry.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-white/40">Posición</div>
                  <div className="font-display text-3xl sm:text-4xl font-extrabold leading-none text-[var(--gold)]">#{userRank}</div>
                </div>
              </div>
              <div className="mt-4 border-t border-white/8 pt-4">
                <div className="text-[10px] font-semibold uppercase tracking-widest text-white/40">Total de Glorias</div>
                <div className="mt-1 flex items-baseline gap-2">
                  <LiveCounter value={userCountry.total_points} className="font-display text-[36px] sm:text-5xl font-extrabold leading-none text-white" />
                  <span className="text-xs font-bold uppercase tracking-wide text-[var(--green-bright)]">Glorias</span>
                </div>
                {rivalGap !== null && (
                  <div className="mt-3">
                    {rivalGap > 0 ? (
                      <div className="flex items-center gap-2 rounded-xl bg-white/[0.04] ring-1 ring-white/8 px-3 py-2">
                        <span className="text-sm">🇧🇷</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Faltan para superar a Brasil</div>
                          <div className="font-display text-base font-extrabold text-[var(--gold)] leading-tight">{rivalGap.toLocaleString("es-AR")} Glorias</div>
                        </div>
                        <button onClick={onCTA} className="shrink-0 rounded-xl bg-[var(--green)]/20 hover:bg-[var(--green)]/30 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[var(--green-bright)] transition-colors">Apostar!</button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 rounded-xl bg-[var(--green)]/10 ring-1 ring-[var(--green)]/30 px-3 py-2 gfc-pop">
                        <span className="text-lg">🏆</span>
                        <div>
                          <div className="font-display text-sm font-extrabold text-[var(--green-bright)]">Argentina #1 en el mundo!</div>
                          <div className="text-[10px] text-white/40 mt-0.5">Segui apoyando para mantener la cima</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* contador global + CTA */}
            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-sm text-white/50">
                <span>🌎</span>
                <LiveCounter value={globalToday} duration={600} className="font-display font-extrabold text-white" />
                <span>Glorias hoy</span>
              </div>
              <button onClick={onCTA}
                className="gfc-cta-pulse inline-flex items-center gap-1.5 rounded-2xl px-5 py-3 font-display text-sm font-extrabold uppercase tracking-wider text-[#04130c] transition-all hover:brightness-110 active:scale-[0.97]"
                style={{background:"var(--green)", boxShadow:"0 0 20px rgba(16,185,129,0.4)"}}>
                Dar Glorias
              </button>
            </div>
          </div>

        </div>{/* end flex row */}
      </div>{/* end max-w */}
    </header>
  );
}

/* ---------------------------------------------------------------------------
   LiveRanking — ranking global ordenado. User fixo (sticky) no topo.
   FLIP para reordenar suavemente quando totais mudam.
   ------------------------------------------------------------------------ */
function LiveRanking({ countries, userIso2, changedId, motion, bare }) {
  const sorted = [...countries].sort((a, b) => b.total_points - a.total_points);
  const rankOf = {};
  sorted.forEach((c, i) => (rankOf[c.id] = i + 1));

  const userCountry = sorted.find((c) => c.iso2 === userIso2);
  const showSticky = userCountry && rankOf[userCountry.id] > 4;

  const rowRefs = useRef({});
  const prevRects = useRef({});
  useLayoutEffect(() => {
    if (motion === "off") return;
    const newRects = {};
    Object.entries(rowRefs.current).forEach(([id, el]) => {
      if (el) newRects[id] = el.getBoundingClientRect().top;
    });
    Object.entries(newRects).forEach(([id, top]) => {
      const prev = prevRects.current[id];
      const el = rowRefs.current[id];
      if (prev != null && el) {
        const dy = prev - top;
        if (Math.abs(dy) > 1) {
          el.style.transition = "none";
          el.style.transform = `translateY(${dy}px)`;
          requestAnimationFrame(() => {
            el.style.transition = "transform 650ms cubic-bezier(.22,.8,.28,1)";
            el.style.transform = "";
          });
        }
      }
    });
    prevRects.current = newRects;
  });

  const inner = (
    <div className={bare ? "" : "mx-auto max-w-3xl"}>
      <SectionHeading kicker="Ranking en vivo" title="¿Quién está alentando más?" />

      {showSticky && (
        <div className="sticky top-3 z-20 mb-3 mt-4">
          <div className="rounded-2xl bg-[#0a120e]/90 p-1 backdrop-blur-md ring-1 ring-[var(--green)]/40 gfc-box-neon">
            <LeaderboardRow rank={rankOf[userCountry.id]} country={userCountry} isUser={true} justChanged={changedId === userCountry.id} motion={motion} />
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-col gap-2">
        {sorted.map((c) => (
          <LeaderboardRow
            key={c.id}
            ref={(el) => (rowRefs.current[c.id] = el)}
            rank={rankOf[c.id]}
            country={c}
            isUser={c.iso2 === userIso2}
            justChanged={changedId === c.id}
            motion={motion}
          />
        ))}
      </div>
    </div>
  );

  if (bare) return inner;
  return <section className="px-5 py-10 sm:py-14">{inner}</section>;
}

/* ---------------------------------------------------------------------------
   SupportSection — pacotes com preço em moeda local + nome no mural.
   ------------------------------------------------------------------------ */
function SupportSection({ packages, countries, currencyCountry, onCurrencyChange, displayName, onNameChange, onSupport, busyId, userCountry, rivalGap, brazilPoints }) {
  const currency = window.GFC.currencyForCountry(currencyCountry);
  const revealClass = ""; /* sem scroll reveal — seção fica no topo */

  /* contador de apoiadores hoje — sobe lentamente para criar prova social */
  const [todayCount, setTodayCount] = useState(1247 + Math.floor((Date.now() / 1000) % 300));
  useEffect(() => {
    const t = setInterval(() => setTodayCount((n) => n + Math.floor(Math.random() * 2 + 1)), 6000);
    return () => clearInterval(t);
  }, []);

  const gapPositive = rivalGap !== null && rivalGap > 0;
  const pct = brazilPoints > 0 && userCountry
    ? Math.min(99, Math.floor((userCountry.total_points / brazilPoints) * 100))
    : null;

  /* best bonus package info */
  const bestPkg = packages.find((p) => p.id === "pkg_1000");
  const bestBonus = bestPkg ? Math.round(bestPkg.points * (bestPkg.bonus || 0)) : 0;

  return (
    <section id="apoiar" className="scroll-mt-4 px-5 pt-2 pb-10 sm:pb-14">
      <div className="mx-auto max-w-3xl">

        {/* === Barra de urgência === */}
        {gapPositive && (
          <div className="mb-7 rounded-2xl p-4 sm:p-5 gfc-box-neon"
               style={{background:"linear-gradient(135deg,rgba(16,185,129,0.10),rgba(16,185,129,0.04))", border:"1px solid rgba(16,185,129,0.30)"}}>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚡</span>
                <div>
                  <div className="font-display text-lg sm:text-xl font-extrabold text-white leading-tight">
                    {userCountry.flag_emoji} a <span style={{color:"var(--gold)"}}>{rivalGap.toLocaleString("es-AR")}</span> Glorias de 🇧🇷 Brasil
                  </div>
                  <div className="text-[12px] mt-0.5" style={{color:"rgba(255,255,255,0.45)"}}>
                    Cada Gloria te acerca a la cima · Copa 2026
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-display text-2xl font-extrabold" style={{color:"var(--green-bright)"}}>{todayCount.toLocaleString("es-AR")}</div>
                <div className="text-[10px] uppercase tracking-widest" style={{color:"rgba(255,255,255,0.40)"}}>apoyan hoy</div>
              </div>
            </div>
            {pct !== null && (
              <div className="mt-4">
                <div className="flex justify-between text-[11px] mb-1.5" style={{color:"rgba(255,255,255,0.45)"}}>
                  <span>{userCountry.flag_emoji} {userCountry.name}</span>
                  <span style={{color:"var(--green-bright)"}}>{pct}% de Brasil</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{background:"rgba(255,255,255,0.08)"}}>
                  <div className="h-full rounded-full transition-all duration-1000"
                       style={{width: pct + "%", background:"linear-gradient(90deg,var(--green),var(--green-bright))", boxShadow:"0 0 10px var(--green)"}}>
                  </div>
                </div>
                <div className="mt-1.5 text-right text-[11px]" style={{color:"rgba(255,255,255,0.35)"}}>
                  🇧🇷 Brasil 100%
                </div>
              </div>
            )}
          </div>
        )}

        {/* Banner promocional */}
        {bestBonus > 0 && (
          <div className="mb-6 rounded-2xl overflow-hidden"
               style={{background: "linear-gradient(135deg,rgba(251,191,36,0.12),rgba(16,185,129,0.08))", border: "1px solid rgba(251,191,36,0.35)"}}>
            <div className="px-5 py-4 flex items-center gap-4">
              <div className="text-3xl">🎁</div>
              <div className="flex-1 min-w-0">
                <div className="font-display text-base sm:text-lg font-extrabold leading-tight"
                     style={{color: "var(--gold)"}}>
                  Oferta Copa 2026: Estadio Lleno
                </div>
                <div className="text-[13px] mt-0.5" style={{color: "rgba(255,255,255,0.55)"}}>
                  Lleva 1.000 Glorias y gana <strong style={{color:"var(--gold)"}}>+{bestBonus.toLocaleString("es-AR")} GRATIS</strong> = 1.500 totales
                </div>
              </div>
              <div className="shrink-0 font-display font-extrabold text-xl" style={{color: "var(--gold)"}}>
                +50%
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            kicker="Apoyar"
            title="Elegí tu paquete"
            sub={`Apoyando a ${userCountry.flag_emoji} ${userCountry.name}`}
          />
          <CurrencySelector countries={countries} value={currencyCountry} onChange={onCurrencyChange} />
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-3">
          {packages.map((p) => (
            <PackageCard
              key={p.id}
              pkg={p}
              currency={currency}
              busy={busyId === p.id}
              onSupport={() => onSupport(p.id, userCountry.id, currency, displayName)}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
   LiveFeed — feed das compras recentes.
   ------------------------------------------------------------------------ */
function LiveFeed({ log, freshId, motion, bare }) {
  const [sectionRef, revealClass] = useScrollReveal();

  const inner = (
    <div className={bare ? "" : "mx-auto max-w-3xl"}>
      <SectionHeading kicker="Últimas Glorias" title="Pasando ahora" />
      <div className="mt-6 flex flex-col gap-2">
        {log.map((item) => (
          <LogItem key={item._id} item={item} fresh={item._id === freshId} motion={motion} />
        ))}
      </div>
    </div>
  );

  if (bare) return <div ref={sectionRef} className={revealClass}>{inner}</div>;
  return (
    <section ref={sectionRef} className={"px-5 py-10 sm:py-14 " + revealClass}>
      {inner}
    </section>
  );
}

/* ---------------------------------------------------------------------------
   BattleSection — Arena de batalha Argentina vs Brasil + feed lateral.
   ------------------------------------------------------------------------ */
function BattleSection({ countries, userIso2, changedId, motion, log, freshId }) {
  const sorted = [...countries].sort((a, b) => b.total_points - a.total_points);
  const rankOf = {};
  sorted.forEach((c, i) => (rankOf[c.id] = i + 1));

  const arg = countries.find((c) => c.iso2 === "AR");
  const bra = countries.find((c) => c.iso2 === "BR");
  const others = sorted.filter((c) => c.iso2 !== "AR" && c.iso2 !== "BR");

  const argLeading = arg && bra && arg.total_points >= bra.total_points;
  const gap = arg && bra ? Math.abs(bra.total_points - arg.total_points) : 0;
  /* Escala de batalha: converte gap real em diferenca visual sempre legivel.
     60k glorias = barra do seguidor chega ao minimo (12%).
     Gap de 9k -> seguidor em 85% (diferenca visivel de 15%). */
  const BATTLE_SCALE = 60000;
  const rawGapPct = Math.min(65, (gap / BATTLE_SCALE) * 100);
  const followerPct = Math.max(12, 100 - rawGapPct);
  const argPct = argLeading ? 100 : followerPct;
  const braPct = argLeading ? followerPct : 100;

  const argChanged = changedId === arg?.id;
  const braChanged = changedId === bra?.id;

  const [argBoostKey, setArgBoostKey] = useState(0);
  const [showKO, setShowKO] = useState(false);
  const [koKey, setKoKey] = useState(0);
  const prevLeading = useRef(argLeading);

  useEffect(() => {
    if (argChanged && motion !== "off") setArgBoostKey((k) => k + 1);
  }, [changedId]);

  useEffect(() => {
    if (motion === "off") return;
    if (!prevLeading.current && argLeading) {
      setShowKO(true);
      setKoKey((k) => k + 1);
      setTimeout(() => setShowKO(false), 2600);
    }
    prevLeading.current = argLeading;
  }, [argLeading]);

  const scrollToApoiar = () => {
    const el = document.getElementById("apoiar");
    if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: "smooth" });
  };

  return (
    <section className="px-5 py-8 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8 items-start">

          {/* ===== ARENA ===== */}
          <div>
            <SectionHeading kicker="Ranking en vivo" title="La batalla de hinchadas" />

            <div className="mt-5 relative rounded-3xl overflow-hidden gfc-arena"
                 style={{background:"linear-gradient(175deg,#0d2018 0%,#07110a 100%)",
                         border:"1px solid rgba(16,185,129,0.25)"}}>

              {/* scanlines decorativas */}
              <div style={{position:"absolute",inset:0,pointerEvents:"none",zIndex:1,
                           backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(16,185,129,0.018) 3px,rgba(16,185,129,0.018) 4px)"}} />

              {/* ---- Header: bandeiras + VS ---- */}
              <div className="relative z-10 flex items-center justify-between px-5 pt-6 pb-4 gap-4">
                {/* Argentina */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="relative shrink-0">
                    <span className="block text-5xl sm:text-6xl leading-none"
                          style={argLeading ? {filter:"drop-shadow(0 0 14px rgba(16,185,129,0.9))"} : {}}>
                      {arg?.flag_emoji}
                    </span>
                    {argLeading && (
                      <span className="absolute -top-2 -right-1 rounded-full text-[#04130c] text-[9px] font-extrabold px-1.5 py-0.5 uppercase"
                            style={{background:"var(--green)",boxShadow:"0 0 8px rgba(16,185,129,0.8)"}}>
                        #1
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="font-display text-lg sm:text-xl font-extrabold text-white truncate">Argentina</div>
                    <div className="font-display text-xs tabular-nums" style={{color:"var(--green-bright)"}}>
                      {arg?.total_points.toLocaleString("es-AR")}
                    </div>
                  </div>
                </div>

                {/* VS */}
                <div className="gfc-vs-text shrink-0 font-display text-2xl sm:text-3xl font-extrabold tracking-widest select-none"
                     style={{color:"rgba(255,255,255,0.22)"}}>
                  VS
                </div>

                {/* Brasil */}
                <div className="flex items-center gap-3 flex-1 min-w-0 justify-end text-right">
                  <div className="min-w-0">
                    <div className="font-display text-lg sm:text-xl font-extrabold text-white truncate">Brasil</div>
                    <div className="font-display text-xs tabular-nums" style={{color:"var(--gold)"}}>
                      {bra?.total_points.toLocaleString("es-AR")}
                    </div>
                  </div>
                  <div className="relative shrink-0">
                    <span className="block text-5xl sm:text-6xl leading-none"
                          style={!argLeading ? {filter:"drop-shadow(0 0 14px rgba(251,191,36,0.9))"} : {}}>
                      {bra?.flag_emoji}
                    </span>
                    {!argLeading && (
                      <span className="absolute -top-2 -right-1 rounded-full text-[#04130c] text-[9px] font-extrabold px-1.5 py-0.5 uppercase"
                            style={{background:"var(--gold)",boxShadow:"0 0 8px rgba(251,191,36,0.8)"}}>
                        #1
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* ---- Barras de energia ---- */}
              <div className="relative z-10 px-5 pb-5 space-y-4">

                {/* Barra Argentina */}
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-2">
                    <span className="font-bold uppercase tracking-widest gfc-kicker" style={{color:"var(--green-bright)"}}>
                      Argentina · {arg ? arg.total_points.toLocaleString("es-AR") : 0}
                    </span>
                    {argLeading && (
                      <span className="rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase text-[#04130c]"
                            style={{background:"var(--green)"}}>LIDERANDO</span>
                    )}
                  </div>
                  <div className="relative h-12 sm:h-14 rounded-2xl overflow-visible"
                       style={{background:"rgba(255,255,255,0.05)"}}>
                    {/* barra verde */}
                    <div
                      className={argChanged && motion !== "off" ? "gfc-bar-flash" : ""}
                      style={{
                        position:"absolute", left:0, top:0, bottom:0,
                        width: argPct + "%",
                        minWidth: argPct > 0 ? "48px" : "0px",
                        borderRadius:"0 16px 16px 0",
                        background: argLeading
                          ? "linear-gradient(90deg,#047857,#10b981,#34d399)"
                          : "linear-gradient(90deg,#065f46,#10b981)",
                        boxShadow: argLeading
                          ? "0 0 30px rgba(16,185,129,0.8), inset 0 1px 0 rgba(255,255,255,0.15)"
                          : "0 0 12px rgba(16,185,129,0.4)",
                        transition:"width 0.9s cubic-bezier(0.34,1.56,0.64,1)",
                      }}>
                      {/* shimmer interno */}
                      <div style={{position:"absolute",inset:0,borderRadius:"0 16px 16px 0",
                                   background:"linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.18) 50%,transparent 100%)",
                                   backgroundSize:"200% 100%",animation:"gfc-shimmer 2s linear infinite"}} />
                    </div>
                    {/* boost float */}
                    {argBoostKey > 0 && (
                      <span key={argBoostKey}
                            className="gfc-boost-float absolute right-4 top-1/2 -translate-y-1/2 font-display font-extrabold text-base select-none"
                            style={{color:"var(--green-bright)",textShadow:"0 0 14px rgba(16,185,129,1)"}}>
                        ⚡ BOOST!
                      </span>
                    )}
                  </div>
                </div>

                {/* Barra Brasil */}
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-2">
                    <span className="font-bold uppercase tracking-widest" style={{color:"rgba(251,191,36,0.65)"}}>
                      Brasil · {bra ? bra.total_points.toLocaleString("es-AR") : 0}
                    </span>
                    {!argLeading && (
                      <span className="rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase text-[#04130c]"
                            style={{background:"var(--gold)"}}>LIDERANDO</span>
                    )}
                  </div>
                  <div className="relative h-12 sm:h-14 rounded-2xl overflow-visible"
                       style={{background:"rgba(255,255,255,0.05)"}}>
                    <div
                      className={braChanged && motion !== "off" ? "gfc-bar-flash-gold" : ""}
                      style={{
                        position:"absolute", left:0, top:0, bottom:0,
                        width: braPct + "%",
                        borderRadius:"0 16px 16px 0",
                        background: !argLeading
                          ? "linear-gradient(90deg,#92400e,#fbbf24,#fde68a)"
                          : "linear-gradient(90deg,#78350f,#fbbf24)",
                        boxShadow: !argLeading
                          ? "0 0 30px rgba(251,191,36,0.8), inset 0 1px 0 rgba(255,255,255,0.15)"
                          : "0 0 12px rgba(251,191,36,0.35)",
                        transition:"width 0.9s cubic-bezier(0.34,1.56,0.64,1)",
                      }}>
                      <div style={{position:"absolute",inset:0,borderRadius:"0 16px 16px 0",
                                   background:"linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.18) 50%,transparent 100%)",
                                   backgroundSize:"200% 100%",animation:"gfc-shimmer 2.5s linear infinite"}} />
                    </div>
                  </div>
                </div>
              </div>

              {/* ---- Status + CTA ---- */}
              <div className="relative z-10 border-t px-5 py-4 flex items-center justify-between gap-4"
                   style={{borderColor:"rgba(16,185,129,0.15)",background:"rgba(0,0,0,0.25)"}}>
                {argLeading ? (
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xl shrink-0">🏆</span>
                    <span className="font-display text-sm font-extrabold truncate" style={{color:"var(--green-bright)"}}>
                      Argentina lidera por {gap.toLocaleString("es-AR")} Glorias
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-base shrink-0">⚡</span>
                    <span className="font-display text-sm font-extrabold text-white">
                      Faltan <span style={{color:"var(--gold)"}}>{gap.toLocaleString("es-AR")}</span>{" "}Glorias para liderar
                    </span>
                  </div>
                )}
                <button onClick={scrollToApoiar}
                  className="shrink-0 rounded-xl px-4 py-2.5 font-display text-xs font-extrabold uppercase tracking-wider text-[#04130c] transition-all hover:brightness-110 active:scale-[0.97]"
                  style={{background:"var(--green)",boxShadow:"0 0 16px rgba(16,185,129,0.55)"}}>
                  Dar Glorias
                </button>
              </div>

              {/* KO overlay */}
              {showKO && (
                <div key={koKey} className="gfc-ko-pop absolute inset-0 z-20 flex items-center justify-center">
                  <div className="font-display font-extrabold select-none"
                       style={{fontSize:"96px",lineHeight:1,color:"var(--green)",
                               textShadow:"0 0 50px rgba(16,185,129,1),0 0 100px rgba(16,185,129,0.6)"}}>
                    KO!
                  </div>
                </div>
              )}
            </div>

            {/* ---- Resto do ranking compacto ---- */}
            <div className="mt-6">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] mb-3 gfc-kicker"
                   style={{color:"var(--green-bright)"}}>
                <span className="h-px w-6 gfc-neon-green" style={{background:"var(--green)",display:"inline-block"}} />
                Resto del ranking
              </div>
              <div className="flex flex-col gap-1.5">
                {others.map((c) => (
                  <div key={c.id} ref={c.id === changedId ? undefined : undefined}
                       className={"flex items-center gap-3 rounded-xl px-3.5 py-2.5 transition-all " +
                         (c.iso2 === userIso2
                           ? "ring-1 gfc-box-neon"
                           : "bg-white/[0.025] hover:bg-white/[0.04]")}
                       style={c.iso2 === userIso2
                         ? {background:"rgba(16,185,129,0.10)",borderColor:"rgba(16,185,129,0.4)"}
                         : {}}>
                    <span className="font-display font-extrabold text-sm w-6 text-center shrink-0 text-white/30">
                      {rankOf[c.id]}
                    </span>
                    <span className="text-xl leading-none shrink-0">{c.flag_emoji}</span>
                    <span className="flex-1 text-sm font-semibold text-white/80 truncate">{c.name}</span>
                    <span className="font-display text-sm font-extrabold tabular-nums shrink-0"
                          style={{color: changedId === c.id ? "var(--green-bright)" : "rgba(255,255,255,0.40)"}}>
                      {c.total_points.toLocaleString("es-AR")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ===== FEED lateral ===== */}
          <div className="lg:sticky lg:top-20">
            <LiveFeed log={log} freshId={freshId} motion={motion} bare />
          </div>

        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
   SiteFooter
   ------------------------------------------------------------------------ */
function SiteFooter() {
  return (
    <footer className="mt-6 border-t border-white/8 px-5 py-10 pb-28 sm:pb-12">
      <div className="mx-auto max-w-3xl">
        <div className="font-display text-2xl font-extrabold tracking-tight text-white">
          Glória<span className="text-[var(--green)]">FC</span>
        </div>
        <nav className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/55">
          <a href="#" className="hover:text-white transition-colors">Términos</a>
          <a href="#" className="hover:text-white transition-colors">Privacidad</a>
          <a href="#" className="hover:text-white transition-colors">Contacto</a>
        </nav>
        <p className="mt-5 max-w-xl text-[12px] leading-relaxed text-white/35">
          GlóriaFC es una plataforma de apoyo a la hinchada. No es juego de azar, no distribuye
          premios y no tiene vínculo con ninguna organización deportiva oficial.
        </p>
      </div>
    </footer>
  );
}

/* ---------------------------------------------------------------------------
   SectionHeading — cabeçalho de seção padronizado.
   ------------------------------------------------------------------------ */
function SectionHeading({ kicker, title, sub }) {
  return (
    <div>
      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--green-bright)] gfc-kicker">
        <span className="h-px w-8 bg-[var(--green)] gfc-neon-green" />
        {kicker}
      </div>
      <h2 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white">{title}</h2>
      {sub && <p className="mt-1 text-sm text-white/45">{sub}</p>}
    </div>
  );
}

Object.assign(window, {
  HeroScoreboard, LiveRanking, SupportSection, LiveFeed, SiteFooter, SectionHeading, BattleSection,
});
