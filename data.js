/* ============================================================================
   GlóriaFC — MOCK DATA
   Estes arrays simulam o backend. Os NOMES DE CAMPO foram escolhidos para
   espelhar tabelas do Supabase — basta trocar os mocks por chamadas reais.
   ========================================================================= */

window.GFC = {

  /* Seleção detectada por IP (placeholder). iso2 do país do usuário. */
  detectedCountry: "BR",

  /* ----- countries -----------------------------------------------------
     [{ id, iso2, name, flag_emoji, total_points }]                       */
  countries: [
    { id: 1,  iso2: "BR", name: "Brasil",        flag_emoji: "🇧🇷", total_points: 1284500 },
    { id: 2,  iso2: "AR", name: "Argentina",     flag_emoji: "🇦🇷", total_points: 1102300 },
    { id: 3,  iso2: "FR", name: "França",        flag_emoji: "🇫🇷", total_points: 1047800 },
    { id: 4,  iso2: "ES", name: "Espanha",       flag_emoji: "🇪🇸", total_points:  921400 },
    { id: 5,  iso2: "EN", name: "Inglaterra",    flag_emoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", total_points:  884200 },
    { id: 6,  iso2: "MX", name: "México",        flag_emoji: "🇲🇽", total_points:  803600 },
    { id: 7,  iso2: "PT", name: "Portugal",      flag_emoji: "🇵🇹", total_points:  742900 },
    { id: 8,  iso2: "DE", name: "Alemanha",      flag_emoji: "🇩🇪", total_points:  698100 },
    { id: 9,  iso2: "CO", name: "Colômbia",      flag_emoji: "🇨🇴", total_points:  612300 },
    { id: 10, iso2: "US", name: "Estados Unidos",flag_emoji: "🇺🇸", total_points:  559800 },
    { id: 11, iso2: "NL", name: "Países Baixos", flag_emoji: "🇳🇱", total_points:  488700 },
    { id: 12, iso2: "UY", name: "Uruguai",       flag_emoji: "🇺🇾", total_points:  421500 },
    { id: 13, iso2: "CL", name: "Chile",         flag_emoji: "🇨🇱", total_points:  388200 },
    { id: 14, iso2: "PE", name: "Peru",          flag_emoji: "🇵🇪", total_points:  312900 },
    { id: 15, iso2: "HR", name: "Croácia",       flag_emoji: "🇭🇷", total_points:  274600 },
    { id: 16, iso2: "JP", name: "Japão",         flag_emoji: "🇯🇵", total_points:  201300 },
  ],

  /* ----- point_packages ------------------------------------------------
     [{ id, name, points, prices }]  prices = moeda → valor em CENTAVOS
     Preço DEFINIDO por moeda (nunca conversão por câmbio).               */
  point_packages: [
    {
      id: "pkg_100", name: "Torcedor", points: 100, popular: false,
      prices: { BRL: 1990, USD: 399, MXN: 7900, ARS: 399000, CLP: 380000, COP: 1600000, PEN: 1490, EUR: 390 },
    },
    {
      id: "pkg_500", name: "Arquibancada", points: 500, popular: true,
      prices: { BRL: 7990, USD: 1499, MXN: 29900, ARS: 1499000, CLP: 1390000, COP: 5900000, PEN: 5590, EUR: 1490 },
    },
    {
      id: "pkg_1000", name: "Estádio Lotado", points: 1000, popular: false,
      prices: { BRL: 13990, USD: 2499, MXN: 49900, ARS: 2499000, CLP: 2390000, COP: 9900000, PEN: 9290, EUR: 2490 },
    },
  ],

  /* ----- public_log ----------------------------------------------------
     [{ country, flag_emoji, points, display_name, created_at }]
     created_at em ms (Date). display_name null = anônimo.                */
  public_log: [
    { country: "Argentina", flag_emoji: "🇦🇷", points: 500,  display_name: "Diego M.",  created_at: Date.now() - 14000 },
    { country: "Brasil",    flag_emoji: "🇧🇷", points: 1000, display_name: null,         created_at: Date.now() - 52000 },
    { country: "França",    flag_emoji: "🇫🇷", points: 100,  display_name: "Camille",    created_at: Date.now() - 96000 },
    { country: "México",    flag_emoji: "🇲🇽", points: 500,  display_name: "Sofía R.",   created_at: Date.now() - 168000 },
    { country: "Portugal",  flag_emoji: "🇵🇹", points: 100,  display_name: null,         created_at: Date.now() - 240000 },
    { country: "Colômbia",  flag_emoji: "🇨🇴", points: 1000, display_name: "Andrés",     created_at: Date.now() - 420000 },
  ],

  /* ----- countryToCurrency --------------------------------------------
     iso2 → código de moeda. Fallback "USD" quando não suportada.         */
  countryToCurrency: {
    BR: "BRL", AR: "ARS", FR: "EUR", ES: "EUR", EN: "USD", MX: "MXN",
    PT: "EUR", DE: "EUR", CO: "COP", US: "USD", NL: "EUR", UY: "USD",
    CL: "CLP", PE: "PEN", HR: "EUR", JP: "USD",
  },

  /* ----- currencyMeta --------------------------------------------------
     Formatação por moeda (symbol + locale para Intl.NumberFormat).       */
  currencyMeta: {
    USD: { symbol: "$",  locale: "en-US" },
    BRL: { symbol: "R$", locale: "pt-BR" },
    MXN: { symbol: "$",  locale: "es-MX" },
    ARS: { symbol: "$",  locale: "es-AR" },
    CLP: { symbol: "$",  locale: "es-CL" },
    COP: { symbol: "$",  locale: "es-CO" },
    PEN: { symbol: "S/", locale: "es-PE" },
    EUR: { symbol: "€",  locale: "de-DE" },
  },

  /* Moedas com preço definido. Fora desta lista → fallback USD. */
  supportedCurrencies: ["BRL", "USD", "MXN", "ARS", "CLP", "COP", "PEN", "EUR"],
};

/* ----- helpers de formatação ------------------------------------------ */

/* Resolve a moeda de um país (com fallback USD). */
window.GFC.currencyForCountry = function (iso2) {
  const cur = window.GFC.countryToCurrency[iso2] || "USD";
  return window.GFC.supportedCurrencies.includes(cur) ? cur : "USD";
};

/* Formata centavos numa moeda. Usa Intl com locale da currencyMeta. */
window.GFC.formatPrice = function (cents, currency) {
  const meta = window.GFC.currencyMeta[currency] || window.GFC.currencyMeta.USD;
  const value = cents / 100;
  try {
    return new Intl.NumberFormat(meta.locale, {
      style: "currency",
      currency: currency,
      maximumFractionDigits: ["CLP", "COP", "ARS"].includes(currency) ? 0 : 2,
    }).format(value);
  } catch (e) {
    return meta.symbol + value.toLocaleString();
  }
};

/* Tempo relativo em PT-BR ("agora", "há 2 min", "há 1 h"). */
window.GFC.relativeTime = function (ts) {
  const s = Math.max(0, Math.floor((Date.now() - ts) / 1000));
  if (s < 8) return "agora";
  if (s < 60) return `há ${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `há ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `há ${h} h`;
  return `há ${Math.floor(h / 24)} d`;
};
