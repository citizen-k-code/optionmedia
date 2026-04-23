const { useState, useMemo, useEffect, useRef, useCallback } = React;

/* ===========================================================
   Icons (inline, stroke-based, neutral)
=========================================================== */
const Icon = ({ name, size = 18, stroke = 1.75 }) => {
  const s = { width: size, height: size, fill: 'none', stroke: 'currentColor', strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const paths = {
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></>,
    dashboard: <><rect x="3" y="3" width="7" height="9" rx="2"/><rect x="14" y="3" width="7" height="5" rx="2"/><rect x="14" y="12" width="7" height="9" rx="2"/><rect x="3" y="16" width="7" height="5" rx="2"/></>,
    inbox: <><path d="M3 12h5l2 3h4l2-3h5"/><path d="M5 5h14l2 7v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7z"/></>,
    users: <><circle cx="9" cy="8" r="4"/><path d="M2 21c0-3.9 3.1-7 7-7s7 3.1 7 7"/><path d="M16 11a3 3 0 1 0 0-6"/><path d="M22 21c0-3-2-5.5-5-6.5"/></>,
    chart: <><path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 6-7"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
    file: <><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/></>,
    folder: <><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></>,
    tag: <><path d="M20.6 13.4 12 22l-9-9V3h10l9 9a1.4 1.4 0 0 1 0 2z"/><circle cx="7" cy="7" r="1.5"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    filter: <><path d="M3 4h18l-7 9v6l-4 2v-8z"/></>,
    x: <><path d="M6 6l12 12M18 6 6 18"/></>,
    caret: <><path d="m6 9 6 6 6-6"/></>,
    up: <><path d="m6 15 6-6 6 6"/></>,
    down: <><path d="m6 9 6 6 6-6"/></>,
    more: <><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></>,
    bell: <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/></>,
    download: <><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></>,
    sliders: <><path d="M4 6h9"/><path d="M17 6h3"/><circle cx="15" cy="6" r="2"/><path d="M4 12h3"/><path d="M11 12h9"/><circle cx="9" cy="12" r="2"/><path d="M4 18h13"/><path d="M21 18h-1"/><circle cx="19" cy="18" r="2"/></>,
    check: <><path d="m5 12 5 5L20 7"/></>,
    lightning: <><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></>,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
    'chevron-left': <><path d="m15 6-6 6 6 6"/></>,
    'chevron-right': <><path d="m9 6 6 6-6 6"/></>,
    refresh: <><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/></>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
    palette: <><path d="M12 3a9 9 0 1 0 0 18c1.1 0 2-.9 2-2v-1a2 2 0 0 1 2-2h2a3 3 0 0 0 3-3 9 9 0 0 0-9-9z"/><circle cx="7.5" cy="10.5" r="1"/><circle cx="12" cy="7.5" r="1"/><circle cx="16.5" cy="10.5" r="1"/></>,
    keyboard: <><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10"/></>,
    logout: <><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><path d="M10 17l5-5-5-5"/><path d="M15 12H3"/></>,
  };
  return <svg viewBox="0 0 24 24" style={s}>{paths[name] || null}</svg>;
};

/* ===========================================================
   Data
=========================================================== */
const OWNERS = [
  { n: 'Mara Velez', c: '#2e5aac' }, { n: 'Omar Khatri', c: '#0e7a4d' },
  { n: 'Priya Shah', c: '#8a5a00' }, { n: 'Ines Dubois', c: '#a6343e' },
  { n: 'Theo Lund', c: '#5e35b1' }, { n: 'Sana Koh', c: '#00796b' },
  { n: 'Jules Rhee', c: '#c0392b' }, { n: 'Bea Okafor', c: '#455a64' },
];
const STATUSES = ['Active','Paused','Draft','Archived','Review'];
const PRIORITIES = ['Low','Medium','High','Urgent'];
const REGIONS = ['EMEA','AMER','APAC','LATAM'];

const rand = (s => () => (s = (s * 9301 + 49297) % 233280) / 233280)(42);
const pick = a => a[Math.floor(rand() * a.length)];
const NAMES = ['Horizon','Meridian','Atlas','Ember','Drift','Pivot','Cascade','Orbit','Vector','Bloom','Pulse','Nova','Arcadia','Helix','Summit','Tessera','Juniper','Echo','Monolith','Vanta','Argent','Crux','Plume','Ridge'];
const SUFFIX = ['Migration','Rollout','Refactor','Launch','Audit','Review','Sync','Campaign','Pipeline','Rebuild','Expansion'];
const ROWS = Array.from({ length: 42 }, (_, i) => {
  const owner = pick(OWNERS);
  return {
    id: `TKN-${1024 + i}`,
    name: `${pick(NAMES)} ${pick(SUFFIX)}`,
    owner,
    status: pick(STATUSES),
    priority: pick(PRIORITIES),
    region: pick(REGIONS),
    budget: Math.round(rand() * 900 + 40) * 1000,
    progress: Math.round(rand() * 100),
    updated: new Date(2026, 2, Math.floor(rand() * 60) + 1),
  };
});

const statusBadge = (s) => {
  const map = { Active:'success', Paused:'warning', Draft:'neutral', Archived:'neutral', Review:'info' };
  return map[s] || 'neutral';
};
const priorityBadge = (p) => {
  const map = { Low:'neutral', Medium:'info', High:'warning', Urgent:'danger' };
  return map[p];
};
const fmtMoney = n => '$' + n.toLocaleString();
const fmtDate = d => d.toLocaleDateString('en', { month: 'short', day: 'numeric' });
const initials = n => n.split(' ').map(w=>w[0]).slice(0,2).join('');

/* ===========================================================
   Tweaks
=========================================================== */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "primary": "#1a3a8f",
  "primaryContainer": "#dfe6ff",
  "accent": "#b84a7a",
  "accentContainer": "#ffd9e6",
  "surface": "#fbfaf8",
  "surfaceDim": "#f3f1ed",
  "outlineVariant": "#e4e2dd",
  "onSurface": "#1b1b1f",
  "radiusSm": 10,
  "radiusMd": 14,
  "radiusLg": 20,
  "radiusPill": 999,
  "stroke1": 1,
  "rowHeight": 52,
  "fontSize": 14,
  "fontFamily": "'Roboto Flex', 'Inter', system-ui, sans-serif",
  "navWidth": 272
}/*EDITMODE-END*/;

const TWEAK_SPEC = [
  { section: 'Color', items: [
    { key: 'primary', label: 'Primary', type: 'color', cssVar: '--primary', derive: (v) => ({ '--primary-hover': shade(v, -12) }) },
    { key: 'primaryContainer', label: 'Primary container', type: 'color', cssVar: '--primary-container' },
    { key: 'accent', label: 'Accent', type: 'color', cssVar: '--accent', derive: (v) => ({ '--on-accent-container': shade(v, -45) }) },
    { key: 'accentContainer', label: 'Accent container', type: 'color', cssVar: '--accent-container' },
    { key: 'surface', label: 'Surface', type: 'color', cssVar: '--surface' },
    { key: 'surfaceDim', label: 'Surface dim', type: 'color', cssVar: '--surface-dim' },
    { key: 'outlineVariant', label: 'Outline', type: 'color', cssVar: '--outline-variant' },
    { key: 'onSurface', label: 'Text', type: 'color', cssVar: '--on-surface' },
  ]},
  { section: 'Shape', items: [
    { key: 'radiusSm', label: 'Radius sm', type: 'range', min: 0, max: 24, cssVar: '--radius-sm', unit: 'px' },
    { key: 'radiusMd', label: 'Radius md', type: 'range', min: 0, max: 32, cssVar: '--radius-md', unit: 'px' },
    { key: 'radiusLg', label: 'Radius lg', type: 'range', min: 0, max: 40, cssVar: '--radius-lg', unit: 'px' },
    { key: 'radiusPill', label: 'Pill radius', type: 'range', min: 0, max: 999, cssVar: '--radius-pill', unit: 'px' },
    { key: 'stroke1', label: 'Stroke', type: 'range', min: 0, max: 3, step: 0.5, cssVar: '--stroke-1', unit: 'px' },
  ]},
  { section: 'Density', items: [
    { key: 'rowHeight', label: 'Row height', type: 'range', min: 36, max: 80, cssVar: '--row-height', unit: 'px' },
    { key: 'navWidth', label: 'Nav width', type: 'range', min: 200, max: 360, cssVar: '--nav-width', unit: 'px' },
  ]},
  { section: 'Type', items: [
    { key: 'fontSize', label: 'Base size', type: 'range', min: 12, max: 18, cssVar: '--font-size-base', unit: 'px' },
    { key: 'fontFamily', label: 'Family', type: 'select', options: [
      "'Roboto Flex', 'Inter', system-ui, sans-serif",
      "'Inter', system-ui, sans-serif",
      "'Open Sans', system-ui, sans-serif",
      "'Helvetica Neue', Helvetica, Arial, sans-serif",
      "ui-sans-serif, system-ui, sans-serif",
      "Georgia, 'Times New Roman', serif",
    ], labels: ['Roboto Flex','Inter','Open Sans','Helvetica','System','Georgia'], cssVar: '--font-sans' },
  ]},
];

// simple hex shade
function shade(hex, pct) {
  const h = hex.replace('#','');
  const num = parseInt(h.length === 3 ? h.split('').map(c=>c+c).join('') : h, 16);
  let r = (num >> 16) & 0xff, g = (num >> 8) & 0xff, b = num & 0xff;
  const t = pct < 0 ? 0 : 255, p = Math.abs(pct) / 100;
  r = Math.round((t - r) * p + r);
  g = Math.round((t - g) * p + g);
  b = Math.round((t - b) * p + b);
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function applyTweaks(vals) {
  const root = document.documentElement;
  TWEAK_SPEC.forEach(sec => sec.items.forEach(it => {
    let v = vals[it.key];
    if (v == null) return;
    if (it.unit) v = v + it.unit;
    root.style.setProperty(it.cssVar, v);
    if (it.derive) {
      const d = it.derive(vals[it.key]);
      Object.entries(d).forEach(([k,val]) => root.style.setProperty(k, val));
    }
  }));
}

/* ===========================================================
   Sidebar
=========================================================== */
const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', count: null, children: null },
  { id: 'tokens', label: 'Tokens', icon: 'tag', children: [
    { id: 'tokens.all', label: 'All tokens' },
    { id: 'tokens.color', label: 'Color' },
    { id: 'tokens.type', label: 'Type' },
    { id: 'tokens.shape', label: 'Shape' },
  ], defaultOpen: true, activeChild: 'tokens.all' },
  { id: 'projects', label: 'Projects', icon: 'folder', count: 42, children: [
    { id: 'projects.active', label: 'Active' },
    { id: 'projects.review', label: 'In review' },
    { id: 'projects.archived', label: 'Archived' },
  ]},
  { id: 'team', label: 'Team', icon: 'users', children: [
    { id: 'team.members', label: 'Members' },
    { id: 'team.groups', label: 'Groups' },
    { id: 'team.invites', label: 'Invites', count: 3 },
  ]},
  { id: 'analytics', label: 'Analytics', icon: 'chart', children: null },
  { id: 'inbox', label: 'Inbox', icon: 'inbox', count: 12, children: null },
  { id: 'settings', label: 'Settings', icon: 'settings', children: [
    { id: 'settings.general', label: 'General' },
    { id: 'settings.appearance', label: 'Appearance' },
    { id: 'settings.integrations', label: 'Integrations' },
  ]},
];

function Sidebar({ active, setActive, collapsed, setCollapsed }) {
  const [open, setOpen] = useState(() => {
    const s = {};
    NAV.forEach(n => { if (n.children) s[n.id] = !!n.defaultOpen; });
    return s;
  });

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="brand">
        <div className="brand-mark">TP</div>
        {!collapsed && (
          <div className="brand-text">
            <div className="brand-name">Token Playground</div>
            <div className="brand-sub">Design research</div>
          </div>
        )}
        <button
          className="btn-icon sidebar-toggle"
          onClick={() => setCollapsed(c => !c)}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          <Icon name={collapsed ? 'chevron-right' : 'chevron-left'} size={16} stroke={2}/>
        </button>
      </div>

      {!collapsed && <div className="nav-group-title">Workspace</div>}
      {NAV.map(item => {
        const hasKids = !!item.children;
        const isOpen = !!open[item.id] && !collapsed;
        const isActive = active === item.id || (hasKids && item.children.some(c => c.id === active));
        return (
          <div key={item.id}>
            <div
              className={`nav-item ${isActive && !hasKids ? 'active' : ''} ${hasKids && isActive && collapsed ? 'active' : ''} ${isOpen ? 'open' : ''}`}
              onClick={() => {
                if (collapsed) {
                  setCollapsed(false);
                  if (hasKids) setOpen(o => ({...o, [item.id]: true}));
                  else setActive(item.id);
                  return;
                }
                if (hasKids) setOpen(o => ({...o, [item.id]: !o[item.id]}));
                else setActive(item.id);
              }}
              title={collapsed ? item.label : ''}
            >
              <span className="nav-icon"><Icon name={item.icon} size={18}/></span>
              {!collapsed && <span className="nav-label">{item.label}</span>}
              {!collapsed && item.count != null && !hasKids && <span className="count">{item.count}</span>}
              {!collapsed && hasKids && <span className="caret"><Icon name="caret" size={16} stroke={2}/></span>}
            </div>
            {hasKids && !collapsed && (
              <div className={`nav-children ${isOpen ? 'open' : ''}`}>
                <div>
                  {item.children.map(c => (
                    <div
                      key={c.id}
                      className={`nav-sub ${active === c.id ? 'active' : ''}`}
                      onClick={() => setActive(c.id)}
                    >
                      <span className="dot"/>
                      <span>{c.label}</span>
                      {c.count != null && <span className="count" style={{marginLeft:'auto'}}>{c.count}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </aside>
  );
}

/* ===========================================================
   Advanced search
   Supports freeform text + structured tokens: field:value
   Fields: status, priority, owner, region, budget>, budget<, progress>, progress<
=========================================================== */
const FIELDS = {
  status:    { label: 'Status',    values: STATUSES },
  priority:  { label: 'Priority',  values: PRIORITIES },
  region:    { label: 'Region',    values: REGIONS },
  owner:     { label: 'Owner',     values: OWNERS.map(o => o.n) },
  budget:    { label: 'Budget',    numeric: true, hint: 'e.g. budget>200000' },
  progress:  { label: 'Progress',  numeric: true, hint: 'e.g. progress<50' },
};

function parseTokens(str) {
  // Returns: { tokens: [{field, op, value}], text: 'remaining freeform' }
  const tokens = [];
  let text = '';
  const parts = str.match(/("[^"]+"|\S+)/g) || [];
  for (const raw of parts) {
    const m = raw.match(/^(\w+)(:|>=|<=|>|<|=)(.+)$/);
    if (m) {
      const field = m[1].toLowerCase();
      const op = m[2];
      let val = m[3].replace(/^"|"$/g,'');
      if (FIELDS[field]) { tokens.push({ field, op, value: val }); continue; }
    }
    text += (text?' ':'') + raw.replace(/^"|"$/g,'');
  }
  return { tokens, text };
}

function rowMatches(row, q) {
  const { tokens, text } = q;
  for (const t of tokens) {
    const v = row[t.field];
    const rv = (t.field === 'owner') ? row.owner.n : v;
    if (FIELDS[t.field]?.numeric) {
      const n = Number(t.value);
      if (isNaN(n)) continue;
      if (t.op === '>' && !(rv > n)) return false;
      if (t.op === '>=' && !(rv >= n)) return false;
      if (t.op === '<' && !(rv < n)) return false;
      if (t.op === '<=' && !(rv <= n)) return false;
      if ((t.op === '=' || t.op === ':') && rv !== n) return false;
    } else {
      if (String(rv).toLowerCase() !== String(t.value).toLowerCase()) return false;
    }
  }
  if (text) {
    const hay = `${row.id} ${row.name} ${row.owner.n} ${row.status} ${row.priority} ${row.region}`.toLowerCase();
    if (!hay.includes(text.toLowerCase())) return false;
  }
  return true;
}

function SearchBar({ value, setValue, onCommitToken }) {
  const [focused, setFocused] = useState(false);
  const [selIdx, setSelIdx] = useState(0);
  const wrapRef = useRef(null);
  const inputRef = useRef(null);

  const parsed = useMemo(() => parseTokens(value), [value]);

  // Suggestions based on current partial input
  const suggestions = useMemo(() => {
    const last = value.split(/\s+/).pop() || '';
    const out = [];
    if (!last || !last.includes(':')) {
      // suggest fields
      const q = last.toLowerCase();
      Object.entries(FIELDS).forEach(([k, f]) => {
        if (!q || k.startsWith(q) || f.label.toLowerCase().includes(q)) {
          out.push({
            kind: 'field', key: k, label: f.label,
            insert: `${k}${f.numeric ? '>' : ':'}`,
            hint: f.numeric ? f.hint : 'pick a value',
          });
        }
      });
    } else {
      // field:value autocomplete
      const [k, v = ''] = last.split(':');
      const f = FIELDS[k];
      if (f && f.values) {
        f.values.forEach(val => {
          if (!v || val.toLowerCase().includes(v.toLowerCase())) {
            out.push({ kind: 'value', key: k, label: val, insert: `${k}:${/\s/.test(val) ? `"${val}"` : val} `, hint: f.label });
          }
        });
      }
    }
    return out.slice(0, 7);
  }, [value]);

  useEffect(() => { setSelIdx(0); }, [value]);

  useEffect(() => {
    const h = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setFocused(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const applySuggestion = (s) => {
    const parts = value.split(/(\s+)/);
    // replace last non-space segment
    for (let i = parts.length - 1; i >= 0; i--) {
      if (parts[i].trim()) { parts[i] = s.insert; break; }
    }
    const next = parts.join('') + (s.kind === 'field' ? '' : '');
    setValue(next.endsWith(' ') ? next : next + (s.kind === 'value' ? '' : ''));
    inputRef.current?.focus();
  };

  const onKey = (e) => {
    if (!focused || !suggestions.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelIdx(i => Math.min(i+1, suggestions.length-1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSelIdx(i => Math.max(i-1, 0)); }
    else if (e.key === 'Enter' || e.key === 'Tab') {
      if (suggestions[selIdx]) { e.preventDefault(); applySuggestion(suggestions[selIdx]); }
    } else if (e.key === 'Escape') { setFocused(false); }
  };

  return (
    <div className="search-bar" ref={wrapRef}>
      <Icon name="search" size={18} stroke={1.75}/>
      {parsed.tokens.map((t, i) => (
        <span key={i} className="search-token">
          <span>{FIELDS[t.field]?.label || t.field}</span>
          <span className="op">{t.op}</span>
          <span>{t.value}</span>
          <span className="x" onClick={() => {
            // remove this token from the string
            const regex = new RegExp(`\\b${t.field}${t.op === ':' ? ':' : t.op}"?${t.value.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}"?\\s?`);
            setValue(value.replace(regex, '').trim());
          }}><Icon name="x" size={12} stroke={2.5}/></span>
        </span>
      ))}
      <div className="search-wrap">
        <input
          ref={inputRef}
          type="text"
          placeholder={parsed.tokens.length ? '' : 'Search or filter — try status:Active or budget>200000'}
          value={value}
          onChange={e => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onKeyDown={onKey}
        />
        {focused && suggestions.length > 0 && (
          <div className="suggestions">
            <div className="sugg-group">{suggestions[0].kind === 'field' ? 'Fields' : `${FIELDS[suggestions[0].key].label} values`}</div>
            {suggestions.map((s, i) => (
              <div
                key={i}
                className={`sugg-item ${i === selIdx ? 'sel' : ''}`}
                onMouseEnter={() => setSelIdx(i)}
                onMouseDown={(e) => { e.preventDefault(); applySuggestion(s); }}
              >
                {s.kind === 'field'
                  ? <><span className="op-chip">{s.key}:</span><span>{s.label}</span></>
                  : <><span>{s.label}</span></>}
                <span className="hint">{s.hint}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      {value && <button className="btn-icon" onClick={() => setValue('')} title="Clear"><Icon name="x" size={16} stroke={2}/></button>}
      <span className="kbd">⌘K</span>
    </div>
  );
}

/* ===========================================================
   Table
=========================================================== */
const COLUMNS = [
  { key: 'id',       label: 'ID',       sort: r => r.id },
  { key: 'name',     label: 'Project',  sort: r => r.name },
  { key: 'owner',    label: 'Owner',    sort: r => r.owner.n },
  { key: 'status',   label: 'Status',   sort: r => r.status },
  { key: 'priority', label: 'Priority', sort: r => r.priority },
  { key: 'region',   label: 'Region',   sort: r => r.region },
  { key: 'budget',   label: 'Budget',   sort: r => r.budget, align: 'right' },
  { key: 'progress', label: 'Progress', sort: r => r.progress },
  { key: 'updated',  label: 'Updated',  sort: r => r.updated.getTime() },
];

function ProgressBar({ value }) {
  return (
    <div style={{display:'flex', alignItems:'center', gap:10, minWidth:140}}>
      <div style={{flex:1, height:6, background:'var(--surface-container-high)', borderRadius:'var(--radius-pill)', overflow:'hidden'}}>
        <div style={{width:`${value}%`, height:'100%', background:'var(--primary)', borderRadius:'inherit', transition:'width 200ms ease'}}/>
      </div>
      <span className="cell-mono" style={{width:32, textAlign:'right'}}>{value}%</span>
    </div>
  );
}

function Table({ rows, selected, setSelected }) {
  const [sort, setSort] = useState({ key: 'updated', dir: 'desc' });
  const sorted = useMemo(() => {
    const col = COLUMNS.find(c => c.key === sort.key);
    const out = [...rows].sort((a,b) => {
      const va = col.sort(a), vb = col.sort(b);
      if (va < vb) return sort.dir === 'asc' ? -1 : 1;
      if (va > vb) return sort.dir === 'asc' ? 1 : -1;
      return 0;
    });
    return out;
  }, [rows, sort]);

  const toggleSort = (k) => setSort(s => s.key === k ? { key: k, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key: k, dir: 'asc' });

  return (
    <table className="dt">
      <thead>
        <tr>
          {COLUMNS.map(c => (
            <th
              key={c.key}
              onClick={() => toggleSort(c.key)}
              className={sort.key === c.key ? 'sorted' : ''}
              style={{textAlign: c.align || 'left'}}
            >
              {c.label}
              <span className="sort-ind">
                {sort.key === c.key ? (sort.dir === 'asc' ? '▲' : '▼') : '↕'}
              </span>
            </th>
          ))}
          <th style={{width:40}}></th>
        </tr>
      </thead>
      <tbody>
        {sorted.map(r => (
          <tr
            key={r.id}
            className={selected === r.id ? 'sel' : ''}
            onClick={() => setSelected(selected === r.id ? null : r.id)}
          >
            <td><span className="cell-mono cell-muted">{r.id}</span></td>
            <td className="cell-primary">{r.name}</td>
            <td>
              <span className="avatar" style={{background:r.owner.c}}>{initials(r.owner.n)}</span>
              {r.owner.n}
            </td>
            <td><span className={`badge ${statusBadge(r.status)}`}><span className="bdot"/>{r.status}</span></td>
            <td><span className={`badge ${priorityBadge(r.priority)}`}>{r.priority}</span></td>
            <td className="cell-muted">{r.region}</td>
            <td style={{textAlign:'right'}} className="cell-mono">{fmtMoney(r.budget)}</td>
            <td><ProgressBar value={r.progress}/></td>
            <td className="cell-muted">{fmtDate(r.updated)}</td>
            <td>
              <button className="btn-icon" onClick={(e) => e.stopPropagation()}><Icon name="more" size={16} stroke={2}/></button>
            </td>
          </tr>
        ))}
        {sorted.length === 0 && (
          <tr><td colSpan={COLUMNS.length + 1} style={{height:120, textAlign:'center', color:'var(--on-surface-variant)'}}>No results match your filters.</td></tr>
        )}
      </tbody>
    </table>
  );
}

/* ===========================================================
   Tweaks panel
=========================================================== */
function TweaksPanel({ open, vals, setVals, onReset, onClose }) {
  if (!open) return null;
  return (
    <div className="tweaks on">
      <div className="tweaks-head">
        <div className="tweaks-title">Tweaks</div>
        <div style={{display:'flex', gap:8, alignItems:'center'}}>
          <button className="tweaks-reset" onClick={onReset}>Reset</button>
          <button className="btn-icon" onClick={onClose} title="Close" style={{width:28, height:28}}>
            <Icon name="x" size={16} stroke={2}/>
          </button>
        </div>
      </div>
      <div className="tweaks-body">
        {TWEAK_SPEC.map(sec => (
          <div className="tweak-section" key={sec.section}>
            <div className="tweak-section-title">{sec.section}</div>
            {sec.items.map(it => (
              <div className="tweak-row" key={it.key}>
                <label>{it.label}</label>
                {it.type === 'color' && (
                  <input type="color" value={vals[it.key]} onChange={e => setVals(v => ({...v, [it.key]: e.target.value}))}/>
                )}
                {it.type === 'range' && (
                  <>
                    <input type="range" min={it.min} max={it.max} step={it.step || 1}
                      value={vals[it.key]}
                      onChange={e => setVals(v => ({...v, [it.key]: Number(e.target.value)}))}/>
                    <span className="val">{vals[it.key]}{it.unit || ''}</span>
                  </>
                )}
                {it.type === 'select' && (
                  <select value={vals[it.key]} onChange={e => setVals(v => ({...v, [it.key]: e.target.value}))}>
                    {it.options.map((o, i) => <option key={i} value={o}>{it.labels?.[i] || o}</option>)}
                  </select>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===========================================================
   User menu
=========================================================== */
function UserMenu({ tweaksOpen, setTweaksOpen }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  return (
    <div className="user-menu-wrap" ref={ref}>
      <button className="user-btn" onClick={() => setOpen(o => !o)}>
        <span className="avatar" style={{background:'var(--primary)'}}>MV</span>
        <span className="uname">Mara Velez</span>
        <span className="caret"><Icon name="caret" size={14} stroke={2}/></span>
      </button>
      {open && (
        <div className="user-menu">
          <div className="mhead">
            <div className="mname">Mara Velez</div>
            <div className="memail">mara@tokenplayground.co</div>
          </div>
          <div className="mitem" onClick={() => setTweaksOpen(!tweaksOpen)}>
            <Icon name="sliders" size={16} stroke={1.75}/>
            <span>Tweaks panel</span>
            <span className={`switch ${tweaksOpen ? 'on' : ''} ml-auto`}><span className="thumb"/></span>
          </div>
          <div className="mitem">
            <Icon name="palette" size={16} stroke={1.75}/>
            <span>Appearance</span>
          </div>
          <div className="mitem">
            <Icon name="keyboard" size={16} stroke={1.75}/>
            <span>Shortcuts</span>
            <span className="ml-auto"><span className="kbd" style={{fontFamily:'var(--font-mono)',fontSize:11,color:'var(--on-surface-variant)',padding:'2px 6px',border:'var(--stroke-1) solid var(--outline-variant)',borderRadius:'var(--radius-xs)',background:'var(--surface-dim)'}}>?</span></span>
          </div>
          <div className="mdiv"/>
          <div className="mitem">
            <Icon name="user" size={16} stroke={1.75}/>
            <span>Profile</span>
          </div>
          <div className="mitem">
            <Icon name="settings" size={16} stroke={1.75}/>
            <span>Account settings</span>
          </div>
          <div className="mdiv"/>
          <div className="mitem" style={{color:'var(--danger)'}}>
            <Icon name="logout" size={16} stroke={1.75}/>
            <span>Sign out</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===========================================================
   App
=========================================================== */
function App() {
  const [active, setActive] = useState('tokens.all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [priorityFilter, setPriorityFilter] = useState(null);
  const [showTweaks, setShowTweaks] = useState(true);
  const [tweaks, setTweaks] = useState(TWEAK_DEFAULTS);
  const [navCollapsed, setNavCollapsed] = useState(false);

  // apply tweaks live
  useEffect(() => { applyTweaks(tweaks); }, [tweaks]);

  // persist tweaks via edit-mode protocol (only real edits, not defaults)
  const firstTweak = useRef(true);
  useEffect(() => {
    if (firstTweak.current) { firstTweak.current = false; return; }
    window.parent?.postMessage({ type: '__edit_mode_set_keys', edits: tweaks }, '*');
  }, [tweaks]);

  // edit mode protocol
  useEffect(() => {
    const h = (e) => {
      if (e.data?.type === '__activate_edit_mode') setShowTweaks(true);
      if (e.data?.type === '__deactivate_edit_mode') setShowTweaks(false);
    };
    window.addEventListener('message', h);
    window.parent?.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', h);
  }, []);

  // cmd-k to focus search
  useEffect(() => {
    const h = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        document.querySelector('.search-bar input')?.focus();
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  // derived filtered rows
  const filtered = useMemo(() => {
    const q = parseTokens(search);
    return ROWS.filter(r => {
      if (!rowMatches(r, q)) return false;
      if (statusFilter && r.status !== statusFilter) return false;
      if (priorityFilter && r.priority !== priorityFilter) return false;
      return true;
    });
  }, [search, statusFilter, priorityFilter]);

  const statusCounts = useMemo(() => {
    const c = {}; ROWS.forEach(r => c[r.status] = (c[r.status]||0)+1); return c;
  }, []);

  return (
    <div className={`app ${navCollapsed ? 'nav-collapsed' : ''}`}>
      <Sidebar active={active} setActive={setActive} collapsed={navCollapsed} setCollapsed={setNavCollapsed}/>

      <main className="main">
        <div className="page-header">
          <div>
            <h1 className="page-title">All tokens</h1>
            <div className="page-subtitle">Play with color, shape, stroke and density. Everything below reads from tokens.</div>
          </div>
          <div className="flex gap-2" style={{alignItems:'center'}}>
            <button className="btn btn-outlined"><Icon name="download" size={16}/> Export</button>
            <button className="btn btn-primary"><Icon name="plus" size={16} stroke={2.25}/> New project</button>
            <UserMenu tweaksOpen={showTweaks} setTweaksOpen={setShowTweaks}/>
          </div>
        </div>

        <div className="toolbar">
          <div style={{flex:1, minWidth:300}}>
            <SearchBar value={search} setValue={setSearch}/>
          </div>
          <button className="chip" onClick={() => setStatusFilter(null)}><Icon name="filter" size={14} stroke={2}/> All</button>
          {STATUSES.map(s => (
            <button
              key={s}
              className={`chip ${statusFilter === s ? 'on' : ''}`}
              onClick={() => setStatusFilter(statusFilter === s ? null : s)}
            >
              {s}
              <span className="chip-count">{statusCounts[s] || 0}</span>
            </button>
          ))}
          <div className="ml-auto flex gap-2">
            <button className="btn btn-text" onClick={() => { setSearch(''); setStatusFilter(null); setPriorityFilter(null); }}>
              <Icon name="refresh" size={14} stroke={2}/> Clear
            </button>
          </div>
        </div>

        <div className="table-card">
          <div className="table-top">
            <span className="table-count">
              Showing <b>{filtered.length}</b> of <b>{ROWS.length}</b> projects
            </span>
            <div className="ml-auto flex gap-2">
              <button className="btn btn-outlined"><Icon name="sliders" size={14} stroke={2}/> Columns</button>
              <button className="btn btn-tonal"><Icon name="grid" size={14} stroke={2}/> Group by</button>
            </div>
          </div>
          <div style={{overflow:'auto'}}>
            <Table rows={filtered} selected={selected} setSelected={setSelected}/>
          </div>
          <div className="pagination">
            <span>Rows per page: <b style={{color:'var(--on-surface)'}}>25</b></span>
            <div className="pages">
              <button className="page-btn" disabled>‹</button>
              <button className="page-btn current">1</button>
              <button className="page-btn">2</button>
              <button className="page-btn">3</button>
              <button className="page-btn">›</button>
            </div>
          </div>
        </div>
      </main>

      <TweaksPanel
        open={showTweaks}
        vals={tweaks}
        setVals={setTweaks}
        onReset={() => setTweaks(TWEAK_DEFAULTS)}
      />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
