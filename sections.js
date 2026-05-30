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
    <header className="relative overflow-hidden px-5 pt-12 pb-9 sm:pt-16 sm:pb-12">
      {/* holofotes / brilho de estádio */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-30%] h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-[var(--green)]/22 blur-[110px]" />
        <div className="absolute right-[-10%] top-[20%] h-[280px] w-[280px] rounded-full bg-[var(--gold)]/12 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-3xl">
        <div className="gfc-enter gfc-enter-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--green-bright)]">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--green)] opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--green)] gfc-live-core" />
          </span>
          Marcador mundial en vivo · rumbo a 2026
        </div>

        <h1 className="gfc-enter gfc-enter-2 gfc-glitch mt-4 font-display text-[40px] leading-[0.95] sm:text-6xl font-extrabold tracking-tight text-white text-balance">
          ¿Cuánto vale<br />tu hinchada?
        </h1>
        <p className="gfc-enter gfc-enter-3 mt-3 max-w-md text-[15px] sm:text-base leading-relaxed text-white/55 text-pretty">
          Dale Glorias a tu selección y hacela subir en el ranking mundial de hinchada. Apoyo simbólico — sin premio, sin apuesta.
        </p>

        {/* card da seleção detectada */}
        <div className="gfc-enter gfc-enter-4 gfc-scanline mt-8 rounded-3xl bg-white/[0.04] ring-1 ring-[var(--green)]/20 p-5 sm:p-7 backdrop-blur gfc-box-neon">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-6xl sm:text-7xl leading-none drop-shadow-lg">{userCountry.flag_emoji}</span>
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-widest text-white/40">Tu selección</div>
                <div className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white">{userCountry.name}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] font-semibold uppercase tracking-widest text-white/40">Posición</div>
              <div className="font-display text-4xl sm:text-5xl font-extrabold leading-none text-[var(--gold)]">#{userRank}</div>
            </div>
          </div>

          <div className="mt-6 border-t border-white/8 pt-5">
            <div className="text-[11px] font-semibold uppercase tracking-widest text-white/40">Total de Glorias</div>
            <div className="mt-1 flex items-baseline gap-2.5">
              <LiveCounter
                value={userCountry.total_points}
                className="font-display text-[44px] sm:text-7xl font-extrabold leading-none text-white"
              />
              <span className="text-sm font-bold uppercase tracking-wide text-[var(--green-bright)]">Glorias</span>
            </div>

            {/* indicador de rivalidade vs Brasil */}
            {rivalGap !== null && (
              <div className="mt-3">
                {rivalGap > 0 ? (
                  <div className="flex items-center gap-2 rounded-xl bg-white/[0.04] ring-1 ring-white/8 px-3 py-2">
                    <span className="text-base leading-none">🇧🇷</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] text-white/40 uppercase tracking-wider font-semibold">Faltan para superar a Brasil</div>
                      <div className="font-display text-lg font-extrabold text-[var(--gold)] leading-tight">
                        {rivalGap.toLocaleString("es-AR")} Glorias
                      </div>
                    </div>
                    <button onClick={onCTA} className="shrink-0 rounded-xl bg-[var(--green)]/20 hover:bg-[var(--green)]/30 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[var(--green-bright)] transition-colors">
                      ¡Apostar!
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 rounded-xl bg-[var(--green)]/10 ring-1 ring-[var(--green)]/30 px-3 py-2 gfc-pop">
                    <span className="text-xl leading-none">🏆</span>
                    <div>
                      <div className="font-display text-base font-extrabold text-[var(--green-bright)] leading-tight">¡Argentina #1 en el mundo!</div>
                      <div className="text-[11px] text-white/40 mt-0.5">Seguí apoyando para mantener la cima</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* contador global secundário */}
        <div className="gfc-enter gfc-enter-5 mt-5 flex items-center gap-2 text-sm text-white/55">
          <span className="text-base">🌎</span>
          <LiveCounter value={globalToday} duration={600} className="font-display font-extrabold text-white" />
          <span>Glorias dadas hoy en el mundo</span>
        </div>

        {/* CTA primário */}
        <button
          onClick={onCTA}
          className="gfc-enter gfc-enter-6 gfc-cta-pulse mt-7 hidden sm:inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--green)] px-8 py-4 font-display text-lg font-extrabold uppercase tracking-wider text-[#04130c] shadow-xl shadow-[var(--green)]/30 transition-all hover:bg-[var(--green-bright)] active:scale-[0.98]"
        >
          Dar Glorias
        </button>
      </div>
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
  const [sectionRef, revealClass] = useScrollReveal();

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
    <section ref={sectionRef} id="apoiar" className={"scroll-mt-4 px-5 py-10 sm:py-14 " + revealClass}>
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

        {/* nome no mural (opt-in) */}
        <div className="mt-6 rounded-2xl bg-white/[0.03] ring-1 ring-white/8 p-4 sm:p-5">
          <label className="block text-[11px] font-semibold uppercase tracking-widest text-white/45">
            Tu nombre en el mural <span className="text-white/30">(opcional)</span>
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => onNameChange(e.target.value)}
            maxLength={24}
            placeholder="Ej.: Messi del barrio"
            className="mt-2 w-full rounded-xl bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-white/25 outline-none ring-1 ring-white/10 focus:ring-[var(--green)]/50"
          />
          <p className="mt-2 text-[11px] leading-relaxed text-white/35">
            ⚠️ Al completar, tu nombre aparece publicamente en el feed "Ultimas Glorias". Dejalo vacio para apoyar como Anonimo.
          </p>
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
  HeroScoreboard, LiveRanking, SupportSection, LiveFeed, SiteFooter, SectionHeading,
});
