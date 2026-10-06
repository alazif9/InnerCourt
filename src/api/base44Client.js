// Local stand-in for the Base44 SDK.
// The original project depended on `@base44/sdk`, which is not installed in this
// environment and requires the Base44 hosted backend. This shim keeps the same
// API surface (auth, entities, integrations, appLogs) so every page works locally
// with a demo user and browser-stored data.

const STORAGE_PREFIX = 'innercourt_';

const DEMO_USER = {
  id: 'a1b2c3d4e5f6g7h8',
  email: 'seeker@innercourt.app',
  full_name: 'Demo Seeker',
  handle: 'seeker',
  role: 'user',
  created_date: new Date('2024-01-01').toISOString(),
};

const hasStorage = () => {
  try {
    return typeof window !== 'undefined' && !!window.localStorage;
  } catch {
    return false;
  }
};

const memoryStore = {};

const readTable = (name) => {
  const key = `${STORAGE_PREFIX}${name}`;
  if (hasStorage()) {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
  return memoryStore[key] || [];
};

const writeTable = (name, rows) => {
  const key = `${STORAGE_PREFIX}${name}`;
  if (hasStorage()) {
    try {
      window.localStorage.setItem(key, JSON.stringify(rows));
      return;
    } catch {
      /* fall through to memory */
    }
  }
  memoryStore[key] = rows;
};

const genId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;

const applySort = (rows, sort) => {
  if (!sort || typeof sort !== 'string') return rows;
  const desc = sort.startsWith('-');
  const field = desc ? sort.slice(1) : sort;
  return [...rows].sort((a, b) => {
    const av = a?.[field];
    const bv = b?.[field];
    if (av === bv) return 0;
    if (av === undefined || av === null) return 1;
    if (bv === undefined || bv === null) return -1;
    return (av > bv ? 1 : -1) * (desc ? -1 : 1);
  });
};

const matches = (row, query = {}) =>
  Object.entries(query || {}).every(([k, v]) => v === undefined || row?.[k] === v);

const createEntity = (name) => ({
  async list(sort, limit) {
    const rows = applySort(readTable(name), sort);
    return typeof limit === 'number' ? rows.slice(0, limit) : rows;
  },
  async filter(query, sort, limit) {
    const rows = applySort(readTable(name).filter((r) => matches(r, query)), sort);
    return typeof limit === 'number' ? rows.slice(0, limit) : rows;
  },
  async get(id) {
    return readTable(name).find((r) => r.id === id) || null;
  },
  async create(data = {}) {
    const now = new Date().toISOString();
    const row = {
      created_by: DEMO_USER.email,
      ...data,
      id: genId(),
      created_date: now,
      updated_date: now,
    };
    writeTable(name, [...readTable(name), row]);
    return row;
  },
  async bulkCreate(items = []) {
    const created = [];
    for (const item of items) created.push(await this.create(item));
    return created;
  },
  async update(id, data = {}) {
    let updated = null;
    const rows = readTable(name).map((r) => {
      if (r.id !== id) return r;
      updated = { ...r, ...data, id, updated_date: new Date().toISOString() };
      return updated;
    });
    writeTable(name, rows);
    return updated;
  },
  async delete(id) {
    writeTable(name, readTable(name).filter((r) => r.id !== id));
    return { success: true };
  },
});

const seedUsers = () => {
  const users = readTable('User');
  if (!users.some((u) => u.email === DEMO_USER.email)) {
    writeTable('User', [...users, DEMO_USER]);
  }
};
seedUsers();

const entityCache = {};
const entities = new Proxy(
  {},
  {
    get(_target, prop) {
      if (typeof prop !== 'string') return undefined;
      if (!entityCache[prop]) entityCache[prop] = createEntity(prop);
      return entityCache[prop];
    },
  },
);

// ---------- Offline LLM fallback ----------
const SIGNS = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces',
];
const PLANETS = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];

const hashString = (str) => {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
};

const buildChart = (prompt) => {
  const seed = hashString(prompt || 'innercourt');
  const pick = (n, offset) => (seed >> (offset % 24)) % n;
  const degree = (offset) => `${(seed + offset * 7) % 30}°${(seed + offset * 13) % 60}'`;

  const planets = {};
  PLANETS.forEach((p, i) => {
    planets[p] = {
      sign: SIGNS[(pick(12, i * 3) + i * 5) % 12],
      house: ((pick(12, i * 2) + i) % 12) + 1,
      degree: degree(i + 1),
    };
  });

  const asc = (pick(12, 5) + 3) % 12;
  const mc = (asc + 9) % 12;
  return {
    planets,
    angles: {
      ascendant: { sign: SIGNS[asc], degree: degree(11) },
      midheaven: { sign: SIGNS[mc], degree: degree(12) },
      descendant: { sign: SIGNS[(asc + 6) % 12], degree: degree(11) },
      imumCoeli: { sign: SIGNS[(mc + 6) % 12], degree: degree(12) },
    },
    analysis: {
      personality: `With the Sun in ${planets.sun.sign} and the Moon in ${planets.moon.sign}, your nature balances outward will with an inner tide of feeling. A ${SIGNS[asc]} ascendant colours how the world first meets you.`,
      strengths: [
        `Mercury in ${planets.mercury.sign} sharpens how you think and speak`,
        `Venus in ${planets.venus.sign} shapes a distinctive way of loving and valuing`,
        `Jupiter in house ${planets.jupiter.house} marks where growth comes most easily`,
      ],
      shadows: [
        `Mars in ${planets.mars.sign} can turn drive into impatience`,
        `Saturn in house ${planets.saturn.house} points to fears that ask for patient work`,
      ],
      lifePath: `Your midheaven in ${SIGNS[mc]} suggests a calling built through steady integration of your archetypes — the Great Work of becoming whole.`,
    },
  };
};

const archetypeReplies = [
  'Every question you carry is already a doorway. Sit with it a while longer, and notice what it asks of you.',
  'What you resist in others often mirrors what waits to be integrated within. Look gently, seeker.',
  'The path is not walked in a single stride. Today, choose one small act that honours who you are becoming.',
  'Your attention is a lantern. Where you place it, the hidden rooms of the psyche begin to glow.',
];

const InvokeLLM = async ({ prompt = '', response_json_schema } = {}) => {
  await new Promise((r) => setTimeout(r, 600));
  if (response_json_schema) {
    return buildChart(prompt);
  }
  return archetypeReplies[hashString(prompt) % archetypeReplies.length];
};

export const base44 = {
  auth: {
    async me() {
      return DEMO_USER;
    },
    async updateMe(data = {}) {
      Object.assign(DEMO_USER, data);
      return DEMO_USER;
    },
    logout() {
      /* no-op in local mode */
    },
    redirectToLogin() {
      /* no-op in local mode */
    },
  },
  entities,
  integrations: {
    Core: { InvokeLLM },
  },
  appLogs: {
    async logUserInApp() {
      return { success: true };
    },
  },
};

export default base44;
