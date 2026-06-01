/* ============================================================================
   GlóriaFC — APP PRINCIPAL
   Estado, tempo real simulado, handler de apoio, tweaks.
   ========================================================================= */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": ["#10b981", "#34d399", "#fbbf24"],
  "numberFont": "condensed",
  "motion": "energetic",
  "liveUpdates": true
}/*EDITMODE-END*/;

const FONT_MAP = {
  condensed: "'Saira Condensed', sans-serif",
  block:     "'Anton', sans-serif",
  heavy:     "'Archivo', sans-serif",
};

let _logId = 1000;
const SUPPORT_POINTS = [100, 500, 1000];
const SAMPLE_NAMES = ["Lucas", "María", "João P.", "Andrés", "Sofia", "Diego", "Hiro", "Anna", "Marco", null, null, "Thiago", "Valentina"];

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  const [countries, setCountries] = useState(() =>
    window.GFC.countries.map((c) => ({ ...c }))
  );
  const [log, setLog] = useState(() =>
    window.GFC.public_log.map((l) => ({ ...l, _id: ++_logId }))
  );
  const [globalToday, setGlobalToday] = useState(284750);
  const [currencyCountry, setCurrencyCountry] = useState(window.GFC.detectedCountry);
  const [displayName, setDisplayName] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [changedId, setChangedId] = useState(null);
  const [freshId, setFreshId] = useState(null);
  const [toast, setToast] = useState(null);
  const [confettiKey, setConfettiKey] = useState(0);

  /* ----- onboarding modal -------------------------------------------- */
  const [showModal, setShowModal] = useState(() => {
    try { return !localStorage.getItem("gfc_user"); } catch(_) { return true; }
  });

  const handleModalComplete = ({ name, iso2 }) => {
    setDisplayName(name);
    setCurrencyCountry(iso2);
    setUserIso2Override(iso2);
    setShowModal(false);
  };

  const [userIso2Override, setUserIso2Override] = useState(() => {
    try {
      const saved = localStorage.getItem("gfc_user");
      return saved ? JSON.parse(saved).iso2 : null;
    } catch(_) { return null; }
  });

  const userIso2 = userIso2Override || window.GFC.detectedCountry;
  const userCountry = countries.find((c) => c.iso2 === userIso2);
  const sortedForRank = [...countries].sort((a, b) => b.total_points - a.total_points);
  const userRank = sortedForRank.findIndex((c) => c.iso2 === userIso2) + 1;

  const brazilCountry = countries.find((c) => c.iso2 === "BR");
  const rivalGap = brazilCountry && userCountry && userIso2 !== "BR"
    ? brazilCountry.total_points - userCountry.total_points
    : null;

  /* ----- aplica tweaks (cores + fonte) -------------------------------- */
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--green", t.accent[0]);
    root.style.setProperty("--green-bright", t.accent[1]);
    root.style.setProperty("--gold", t.accent[2]);
    root.style.setProperty("--font-display", FONT_MAP[t.numberFont] || FONT_MAP.condensed);
  }, [t.accent, t.numberFont]);

  /* ----- helper: aplica pontos a um país e registra no feed ----------- */
  const applyGlory = (countryId, points, name) => {
    setCountries((prev) =>
      prev.map((c) => (c.id === countryId ? { ...c, total_points: c.total_points + points } : c))
    );
    setChangedId(countryId);
    setTimeout(() => setChangedId(null), 1100);
    setGlobalToday((g) => g + points);

    const country = window.GFC.countries.find((c) => c.id === countryId);
    const id = ++_logId;
    setLog((prev) =>
      [{ _id: id, country: country.name, flag_emoji: country.flag_emoji, points, display_name: name || null, created_at: Date.now() }, ...prev].slice(0, 10)
    );
    setFreshId(id);
    setTimeout(() => setFreshId(null), 1000);
  };

  /* ----- detecta retorno do Stripe (?paid= ou ?canceled=) -------------- */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    /* pagamento cancelado */
    if (params.get("canceled")) {
      window.history.replaceState({}, "", "/");
      try { localStorage.removeItem("gfc_pending"); } catch(_) {}
      setToast("Pago cancelado. Puedes intentarlo de nuevo cuando quieras.");
      setTimeout(() => setToast(null), 4000);
      return;
    }

    const paid = params.get("paid");
    if (!paid) return;
    window.history.replaceState({}, "", "/");

    /* dedup: evita aplicar pontos duas vezes se o usuário recarregar a URL */
    const dedupKey = `gfc_applied_${paid}`;
    try {
      if (sessionStorage.getItem(dedupKey)) return;
      sessionStorage.setItem(dedupKey, "1");
    } catch(_) {}

    const pkg = window.GFC.point_packages.find((p) => p.id === paid);
    if (!pkg) return;

    let pendingName = null, pendingCountryId = null;
    try {
      const p = JSON.parse(localStorage.getItem("gfc_pending") || "null");
      /* descarta pending expirado (> 30 min) */
      if (p && p.ts && Date.now() - p.ts < 30 * 60 * 1000) {
        pendingName = p.name;
        pendingCountryId = p.countryId;
      }
      localStorage.removeItem("gfc_pending");
    } catch(_) {}

    const cid = pendingCountryId || window.GFC.countries.find((c) => c.iso2 === (window.GFC.detectedCountry))?.id;
    if (!cid) return;

    const bonus = pkg.bonus || 0;
    const bonusPoints = Math.round(pkg.points * bonus);
    const totalPoints = pkg.points + bonusPoints;
    const country = window.GFC.countries.find((c) => c.id === cid);

    setCountries((prev) => prev.map((c) => c.id === cid ? { ...c, total_points: c.total_points + totalPoints } : c));
    setGlobalToday((g) => g + totalPoints);
    setChangedId(cid);
    setTimeout(() => setChangedId(null), 1100);

    const id = ++_logId;
    setLog((prev) => [{
      _id: id, country: country.name, flag_emoji: country.flag_emoji,
      points: totalPoints, bonusPoints, display_name: pendingName || null,
      created_at: Date.now(), _isUser: true,
    }, ...prev].slice(0, 10));
    setFreshId(id);
    setTimeout(() => setFreshId(null), 1000);

    setConfettiKey((k) => k + 1);
    const bonusMsg = bonusPoints > 0 ? ` (+${bonusPoints.toLocaleString("es-AR")} bonus!)` : "";
    setToast(`+${totalPoints.toLocaleString("es-AR")} Glorias${bonusMsg} para ${country?.flag_emoji} ${country?.name}! ✅`);
    setTimeout(() => setToast(null), 4000);
  }, []);

  /* ----- handler de apoio — redireciona para Stripe -------------------- */
  const [redirectingId, setRedirectingId] = useState(null);

  const onSupport = (packageId, countryId, currency, name) => {
    const pkg = window.GFC.point_packages.find((p) => p.id === packageId);

    if (pkg.stripeUrl) {
      try {
        localStorage.setItem("gfc_pending", JSON.stringify({
          packageId, countryId,
          name: name || displayName,
          ts: Date.now(),
        }));
      } catch(_) {}
      setRedirectingId(packageId);
      setTimeout(() => { window.location.href = pkg.stripeUrl; }, 300);
      return;
    }

    /* fallback simulacao (sem stripeUrl) */
    const bonus = pkg.bonus || 0;
    const bonusPoints = Math.round(pkg.points * bonus);
    const totalPoints = pkg.points + bonusPoints;
    setBusyId(packageId);
    setTimeout(() => {
      /* aplica os pontos totais (base + bonus) */
      const country = window.GFC.countries.find((c) => c.id === countryId);
      setCountries((prev) =>
        prev.map((c) => (c.id === countryId ? { ...c, total_points: c.total_points + totalPoints } : c))
      );
      setChangedId(countryId);
      setTimeout(() => setChangedId(null), 1100);
      setGlobalToday((g) => g + totalPoints);

      /* entrada especial no feed com flag _isUser */
      const id = ++_logId;
      setLog((prev) =>
        [{
          _id: id,
          country: country.name,
          flag_emoji: country.flag_emoji,
          points: totalPoints,
          bonusPoints: bonusPoints,
          display_name: name || displayName || null,
          created_at: Date.now(),
          _isUser: true,
        }, ...prev].slice(0, 10)
      );
      setFreshId(id);
      setTimeout(() => setFreshId(null), 1000);

      setBusyId(null);
      setConfettiKey((k) => k + 1);
      const bonusMsg = bonusPoints > 0 ? ` (+${bonusPoints.toLocaleString("es-AR")} bonus!)` : "";
      setToast(`+${totalPoints.toLocaleString("es-AR")} Glorias${bonusMsg} para ${userCountry.flag_emoji} ${userCountry.name}!`);
      setTimeout(() => setToast(null), 3200);
    }, 650);
  };

  /* ----- tempo real simulado ------------------------------------------ */
  useEffect(() => {
    if (!t.liveUpdates) return;
    const allIds = window.GFC.countries.map((c) => c.id);
    const brId   = window.GFC.countries.find((c) => c.iso2 === "BR")?.id;
    const arId   = window.GFC.countries.find((c) => c.iso2 === "AR")?.id;
    const otherIds = allIds.filter((id) => id !== brId && id !== arId);

    const interval = setInterval(() => {
      /* pool ponderado: BR 38%, AR 32%, resto 30% distribuído */
      const roll = Math.random();
      let countryId;
      if (roll < 0.38)       countryId = brId;
      else if (roll < 0.70)  countryId = arId;
      else                   countryId = otherIds[Math.floor(Math.random() * otherIds.length)];

      const points = SUPPORT_POINTS[Math.floor(Math.random() * SUPPORT_POINTS.length)];
      const name   = SAMPLE_NAMES[Math.floor(Math.random() * SAMPLE_NAMES.length)];
      applyGlory(countryId, points, name);
    }, t.motion === "off" ? 4200 : 2600);
    return () => clearInterval(interval);
  }, [t.liveUpdates, t.motion]);

  /* ----- rivalidade BR × AR: gap máximo 15 k, Brasil tende a liderar --- */
  useEffect(() => {
    if (!t.liveUpdates) return;
    const brId = window.GFC.countries.find((c) => c.iso2 === "BR")?.id;
    const arId = window.GFC.countries.find((c) => c.iso2 === "AR")?.id;
    if (!brId || !arId) return;

    const rivalry = setInterval(() => {
      setCountries((prev) => {
        const br  = prev.find((c) => c.id === brId);
        const ar  = prev.find((c) => c.id === arId);
        if (!br || !ar) return prev;
        const gap = br.total_points - ar.total_points;

        /* Argentina muito na frente (> 15k): Brasil dá surto de recuperação */
        if (gap < -15000) {
          const boost = 500 + Math.floor(Math.random() * 1000);
          return prev.map((c) => c.id === brId ? { ...c, total_points: c.total_points + boost } : c);
        }
        /* Brasil muito na frente (> 20k): Argentina encosta */
        if (gap > 20000) {
          const boost = 500 + Math.floor(Math.random() * 1000);
          return prev.map((c) => c.id === arId ? { ...c, total_points: c.total_points + boost } : c);
        }
        return prev;
      });
    }, 8000); // verifica a cada 8s
    return () => clearInterval(rivalry);
  }, [t.liveUpdates]);

  /* ----- decaimento de pontos — hinchada esfría sin apoyo ------------- */
  useEffect(() => {
    if (!t.liveUpdates) return;
    const decay = setInterval(() => {
      setCountries((prev) =>
        prev.map((c) => ({
          ...c,
          total_points: Math.max(10000, Math.floor(c.total_points * 0.9992)),
        }))
      );
    }, 60000); // 0,08% a menos por minuto para todos os países
    return () => clearInterval(decay);
  }, [t.liveUpdates]);

  const scrollToApoiar = () => {
    const el = document.getElementById("apoiar");
    if (el) window.scrollTo({ top: el.offsetTop - 12, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">

      {/* ===== HEADER / LOGO ===== */}
      <nav className="sticky top-0 z-50 px-5 py-3 flex items-center backdrop-blur-md border-b"
           style={{background: "rgba(7,11,10,0.88)", borderColor: "rgba(16,185,129,0.15)"}}>
        <div className="mx-auto max-w-5xl w-full flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center gfc-box-neon"
                 style={{background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.4)"}}>
              <span className="font-display text-sm font-extrabold" style={{color: "var(--green)"}}>G</span>
            </div>
            <span className="font-display text-xl font-extrabold tracking-tight text-white">
              Gloria<span style={{color: "var(--green)", textShadow: "0 0 12px rgba(16,185,129,0.8)"}}>FC</span>
            </span>
          </div>

          {/* Live badge + CTA desktop */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest"
                 style={{color: "var(--green-bright)"}}>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--green)] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full gfc-live-core" style={{background: "var(--green)"}} />
              </span>
              En vivo
            </div>
            <button onClick={scrollToApoiar}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl px-4 py-2 font-display text-sm font-extrabold uppercase tracking-wider text-[#04130c] transition-all hover:brightness-110 active:scale-[0.97]"
              style={{background: "var(--green)", boxShadow: "0 0 16px rgba(16,185,129,0.45)"}}>
              Dar Glorias
            </button>
          </div>
        </div>
      </nav>

      <HeroScoreboard
        userCountry={userCountry}
        userRank={userRank}
        globalToday={globalToday}
        rivalGap={rivalGap}
        onCTA={scrollToApoiar}
      />

      {/* Pacotes PRIMEIRO — máxima visibilidade */}
      <SupportSection
        packages={window.GFC.point_packages}
        countries={countries}
        currencyCountry={currencyCountry}
        onCurrencyChange={setCurrencyCountry}
        displayName={displayName}
        onNameChange={setDisplayName}
        onSupport={onSupport}
        busyId={busyId}
        redirectingId={redirectingId}
        userCountry={userCountry}
        rivalGap={rivalGap}
        brazilPoints={brazilCountry ? brazilCountry.total_points : 0}
      />

      {/* ===== BATTLE BARS ===== */}
      <BattleSection
        countries={countries}
        userIso2={userIso2}
        changedId={changedId}
        motion={t.motion}
        log={log}
        freshId={freshId}
      />

      <SiteFooter />

      {/* CTA fixo no mobile */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-[#070b0a]/90 px-4 py-3 backdrop-blur-md sm:hidden">
        <button
          onClick={scrollToApoiar}
          className="gfc-cta-pulse w-full rounded-2xl bg-[var(--green)] py-4 font-display text-lg font-extrabold uppercase tracking-wider text-[#04130c] shadow-lg active:scale-[0.98] transition-transform"
        >
          Dar Glorias
        </button>
      </div>

      {/* confetti ao apoiar */}
      <ConfettiBurst triggerKey={confettiKey} />

      {/* modal de onboarding */}
      {showModal && (
        <OnboardingModal
          countries={window.GFC.countries}
          onComplete={handleModalComplete}
        />
      )}

      {/* toast de confirmação */}
      {toast && (
        <div className="fixed bottom-24 sm:bottom-6 left-1/2 z-40 -translate-x-1/2 gfc-toast">
          <div className="rounded-2xl bg-[var(--green)] px-5 py-3 font-display text-sm font-extrabold uppercase tracking-wide text-[#04130c] shadow-2xl">
            {toast}
          </div>
        </div>
      )}

      {/* ----- Tweaks ----- */}
      <TweaksPanel>
        <TweakSection label="Visual" />
        <TweakColor
          label="Color"
          value={t.accent}
          options={[
            ["#10b981", "#34d399", "#fbbf24"],
            ["#22c55e", "#4ade80", "#f59e0b"],
            ["#14b8a6", "#2dd4bf", "#fb923c"],
          ]}
          onChange={(v) => setTweak("accent", v)}
        />
        <TweakRadio
          label="Fuente de números"
          value={t.numberFont}
          options={["condensed", "block", "heavy"]}
          onChange={(v) => setTweak("numberFont", v)}
        />
        <TweakSection label="Movimiento" />
        <TweakRadio
          label="Intensidad"
          value={t.motion}
          options={["subtle", "energetic", "off"]}
          onChange={(v) => setTweak("motion", v)}
        />
        <TweakToggle
          label="Actualizaciones en vivo"
          value={t.liveUpdates}
          onChange={(v) => setTweak("liveUpdates", v)}
        />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
