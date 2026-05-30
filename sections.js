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
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--green)] opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--green)]" />
          </span>
          Marcador mundial en vivo · rumbo a 2026
        </div>

        <h1 className="gfc-enter gfc-enter-2 mt-4 font-display text-[40px] leading-[0.95] sm:text-6xl font-extrabold tracking-tight text-white text-balance">
          ¿Cuánto vale<br />tu hinchada?
        </h1>
        <p className="gfc-enter gfc-enter-3 mt-3 max-w-md text-[15px] sm:text-base leading-relaxed text-white/55 text-pretty">
          Dale Glorias a tu selección y hacela subir en el ranking mundial de hinchada. Apoyo simbólico — sin premio, sin apuesta.
        </p>

        {/* card da seleção detectada */}
        <div className="gfc-enter gfc-enter-4 mt-8 rounded-3xl bg-white/[0.04] ring-1 ring-white/8 p-5 sm:p-7 backdrop-blur">
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
function LiveRanking({ countries, userIso2, changedId, motion }) {
  const sorted = [...countries].sort((a, b) => b.total_points - a.total_points);
  const rankOf = {};
  sorted.forEach((c, i) => (rankOf[c.id] = i + 1));

  const userCountry = sorted.find((c) => c.iso2 === userIso2);
  // só fixa o usuário no topo quando ele NÃO está já visível entre os primeiros
  const showSticky = userCountry && rankOf[userCountry.id] > 4;

  // ---- FLIP -------------------------------------------------------------
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

  return (
    <section className="px-5 py-10 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <SectionHeading kicker="Ranking en vivo" title="¿Quién está alentando más?" />

        {/* user sticky */}
        {showSticky && (
          <div className="sticky top-3 z-20 mb-3">
            <div className="rounded-2xl bg-[#0a120e]/85 p-1 backdrop-blur-md ring-1 ring-[var(--green)]/30 shadow-2xl">
              <LeaderboardRow
                rank={rankOf[userCountry.id]}
                country={userCountry}
                isUser={true}
                justChanged={changedId === userCountry.id}
                motion={motion}
              />
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2">
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
    </section>
  );
}

/* ---------------------------------------------------------------------------
   SupportSection — pacotes com preço em moeda local + nome no mural.
   ------------------------------------------------------------------------ */
function SupportSection({ packages, countries, currencyCountry, onCurrencyChange, displayName, onNameChange, onSupport, busyId, userCountry }) {
  const currency = window.GFC.currencyForCountry(currencyCountry);
  const [sectionRef, revealClass] = useScrollReveal();

  return (
    <section ref={sectionRef} id="apoiar" className={"scroll-mt-4 px-5 py-10 sm:py-14 " + revealClass}>
      <div className="mx-auto max-w-3xl">
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
            ⚠️ Al completar, tu nombre aparece públicamente en el feed "Últimas Glorias". Dejalo vacío para apoyar como Anónimo.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
   LiveFeed — feed das compras recentes.
   ------------------------------------------------------------------------ */
function LiveFeed({ log, freshId, motion }) {
  const [sectionRef, revealClass] = useScrollReveal();
  return (
    <section ref={sectionRef} className={"px-5 py-10 sm:py-14 " + revealClass}>
      <div className="mx-auto max-w-3xl">
        <SectionHeading kicker="Últimas Glorias" title="Pasando ahora" />
        <div className="mt-6 flex flex-col gap-2">
          {log.map((item) => (
            <LogItem key={item._id} item={item} fresh={item._id === freshId} motion={motion} />
          ))}
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
      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--green-bright)]">
        <span className="h-px w-6 bg-[var(--green)]/60" />
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
