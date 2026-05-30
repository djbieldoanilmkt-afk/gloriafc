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

  const userIso2 = window.GFC.detectedCountry;
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

  /* ----- handler de apoio (placeholder — checkout Stripe entra depois) - */
  const onSupport = (packageId, countryId, currency, name) => {
    const pkg = window.GFC.point_packages.find((p) => p.id === packageId);
    console.log("[GlóriaFC] onSupport →", { packageId, countryId, currency, displayName: name });
    setBusyId(packageId);
    setTimeout(() => {
      applyGlory(countryId, pkg.points, name);
      setBusyId(null);
      setConfettiKey((k) => k + 1);
      setToast(`+${pkg.points.toLocaleString("es-AR")} Glorias para ${userCountry.flag_emoji} ${userCountry.name}!`);
      setTimeout(() => setToast(null), 2600);
    }, 650);
  };

  /* ----- tempo real simulado ------------------------------------------ */
  useEffect(() => {
    if (!t.liveUpdates) return;
    const ids = window.GFC.countries.map((c) => c.id);
    const interval = setInterval(() => {
      const countryId = ids[Math.floor(Math.random() * ids.length)];
      const points = SUPPORT_POINTS[Math.floor(Math.random() * SUPPORT_POINTS.length)];
      const name = SAMPLE_NAMES[Math.floor(Math.random() * SAMPLE_NAMES.length)];
      applyGlory(countryId, points, name);
    }, t.motion === "off" ? 4200 : 2600);
    return () => clearInterval(interval);
  }, [t.liveUpdates, t.motion]);

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
      <HeroScoreboard
        userCountry={userCountry}
        userRank={userRank}
        globalToday={globalToday}
        rivalGap={rivalGap}
        onCTA={scrollToApoiar}
      />

      <LiveRanking countries={countries} userIso2={userIso2} changedId={changedId} motion={t.motion} />

      <SupportSection
        packages={window.GFC.point_packages}
        countries={countries}
        currencyCountry={currencyCountry}
        onCurrencyChange={setCurrencyCountry}
        displayName={displayName}
        onNameChange={setDisplayName}
        onSupport={onSupport}
        busyId={busyId}
        userCountry={userCountry}
      />

      <LiveFeed log={log} freshId={freshId} motion={t.motion} />

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
