import { useState, useEffect, useCallback, useRef } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  AreaChart, Area, ReferenceLine
} from "recharts";

// ═══════════════════════ DATA ═══════════════════════
const PLAN = [
  {
    id: "upper_a", name: "UPPER A", sub: "Сила + плечи/руки", color: "#007AFF", icon: "💪",
    groups: [
      { name: "Грудь / Спина", exercises: [
        { id: "ua1", name: "Жим штанги лёжа", sets: 4, reps: "6–8", rest: "2–3 мин" },
        { id: "ua2", name: "Тяга верхнего блока", sets: 4, reps: "8–10" },
        { id: "ua3", name: "Жим гантелей под углом", sets: 3, reps: "8–10" },
      ]},
      { name: "Плечи", exercises: [
        { id: "ua4", name: "Разведения в стороны", sets: 4, reps: "12–15" },
        { id: "ua5", name: "Задняя дельта (кроссовер)", sets: 4, reps: "12–15" },
      ]},
      { name: "Руки", exercises: [
        { id: "ua6", name: "Бицепс штанга", sets: 3, reps: "8–10" },
        { id: "ua7", name: "Бицепс гантели", sets: 3, reps: "10–12" },
        { id: "ua8", name: "Трицепс канат", sets: 3, reps: "10–12" },
        { id: "ua9", name: "Трицепс над головой", sets: 3, reps: "10–12" },
      ]},
    ],
  },
  {
    id: "lower_a", name: "LOWER A", sub: "База", color: "#30D158", icon: "🦵",
    groups: [
      { name: "Ноги", exercises: [
        { id: "la1", name: "Присед", sets: 4, reps: "6–8", rest: "2–3 мин" },
        { id: "la2", name: "Румынская тяга", sets: 4, reps: "8–10" },
        { id: "la3", name: "Жим ногами", sets: 3, reps: "10–12" },
        { id: "la4", name: "Сгибание ног", sets: 3, reps: "12–15" },
        { id: "la5", name: "Икры", sets: 4, reps: "12–15" },
      ]},
    ],
  },
  {
    id: "upper_b", name: "UPPER B", sub: "Объём + форма", color: "#BF5AF2", icon: "🏋️",
    groups: [
      { name: "Грудь / Спина", exercises: [
        { id: "ub1", name: "Жим под углом", sets: 4, reps: "8–10" },
        { id: "ub2", name: "Горизонтальная тяга", sets: 4, reps: "8–10" },
        { id: "ub3", name: "Брусья", sets: 3, reps: "8–12" },
      ]},
      { name: "Плечи", exercises: [
        { id: "ub4", name: "Разведения", sets: 4, reps: "12–15" },
        { id: "ub5", name: "Face pull", sets: 3, reps: "12–15" },
      ]},
      { name: "Руки", exercises: [
        { id: "ub6", name: "Молотки", sets: 3, reps: "10–12" },
        { id: "ub7", name: "Бицепс в кроссовере", sets: 3, reps: "12–15" },
        { id: "ub8", name: "Трицепс канат", sets: 3, reps: "12–15" },
      ]},
    ],
  },
  {
    id: "lower_b", name: "LOWER B", sub: "Объём", color: "#FF9F0A", icon: "🔥",
    groups: [
      { name: "Ноги", exercises: [
        { id: "lb1", name: "Фронтальный присед / гакк", sets: 4, reps: "6–8" },
        { id: "lb2", name: "Выпады", sets: 3, reps: "10/нога" },
        { id: "lb3", name: "Разгибание ног", sets: 3, reps: "12–15" },
        { id: "lb4", name: "Сгибание ног", sets: 3, reps: "12–15" },
        { id: "lb5", name: "Икры", sets: 4, reps: "12–15" },
      ]},
    ],
  },
];

// ═══════════════════════ STORAGE ═══════════════════════
const S = {
  g: k => { try { const d = localStorage.getItem("n3_" + k); return d ? JSON.parse(d) : null; } catch { return null; } },
  s: (k, v) => { try { localStorage.setItem("n3_" + k, JSON.stringify(v)); } catch {} },
};
const isoDate = () => new Date().toISOString().slice(0, 10);

// ═══════════════════════ STYLES ═══════════════════════
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent}
:root{
  --bg:#000000;
  --glass:rgba(255,255,255,0.08);
  --glass2:rgba(255,255,255,0.12);
  --glass3:rgba(255,255,255,0.18);
  --glass-border:rgba(255,255,255,0.15);
  --glass-border2:rgba(255,255,255,0.25);
  --glass-highlight:rgba(255,255,255,0.06);
  --text:#F5F5F7;
  --text2:rgba(245,245,247,0.6);
  --text3:rgba(245,245,247,0.35);
  --blue:#007AFF;
  --green:#30D158;
  --red:#FF453A;
  --orange:#FF9F0A;
  --purple:#BF5AF2;
  --teal:#64D2FF;
  --r:22px;
  --r2:16px;
  --r3:28px;
}
html,body{
  background:var(--bg);
  color:var(--text);
  font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;
  overscroll-behavior:none;
  -webkit-font-smoothing:antialiased;
}

/* ── ANIMATED BG MESH ── */
.bg-mesh{
  position:fixed;inset:0;z-index:0;overflow:hidden;pointer-events:none;
}
.bg-orb{
  position:absolute;
  border-radius:50%;
  filter:blur(80px);
  opacity:0.35;
  animation:orbFloat 12s ease-in-out infinite alternate;
}
.bg-orb:nth-child(1){width:300px;height:300px;background:#007AFF;top:-80px;left:-60px;animation-delay:0s}
.bg-orb:nth-child(2){width:250px;height:250px;background:#BF5AF2;bottom:-60px;right:-40px;animation-delay:-4s}
.bg-orb:nth-child(3){width:200px;height:200px;background:#30D158;top:40%;left:50%;animation-delay:-8s}
@keyframes orbFloat{
  0%{transform:translate(0,0) scale(1)}
  33%{transform:translate(30px,-20px) scale(1.1)}
  66%{transform:translate(-20px,30px) scale(0.9)}
  100%{transform:translate(10px,-10px) scale(1.05)}
}

/* ── APP SHELL ── */
.app{
  position:relative;z-index:1;
  max-width:430px;margin:0 auto;min-height:100vh;
  display:flex;flex-direction:column;
}
.page{flex:1;padding:16px 16px 110px;animation:pageIn .4s cubic-bezier(.16,1,.3,1)}
@keyframes pageIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes scaleIn{from{opacity:0;transform:scale(.92)}to{opacity:1;transform:scale(1)}}

/* ── LIQUID GLASS MATERIAL ── */
.glass{
  background:var(--glass);
  backdrop-filter:blur(40px) saturate(180%);
  -webkit-backdrop-filter:blur(40px) saturate(180%);
  border:1px solid var(--glass-border);
  border-radius:var(--r);
  position:relative;
  overflow:hidden;
}
.glass::before{
  content:'';
  position:absolute;
  top:0;left:0;right:0;
  height:1px;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent);
  pointer-events:none;
}
.glass-strong{
  background:var(--glass2);
  backdrop-filter:blur(60px) saturate(200%);
  -webkit-backdrop-filter:blur(60px) saturate(200%);
  border:1px solid var(--glass-border2);
  border-radius:var(--r);
  position:relative;
  overflow:hidden;
}
.glass-strong::before{
  content:'';
  position:absolute;
  top:0;left:0;right:0;
  height:1px;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent);
  pointer-events:none;
}
.glass-tint{
  background:var(--glass);
  backdrop-filter:blur(40px) saturate(180%);
  -webkit-backdrop-filter:blur(40px) saturate(180%);
  border-radius:var(--r);
  position:relative;
  overflow:hidden;
}

/* SPECULAR EDGE on cards */
.glass-card{
  background:var(--glass);
  backdrop-filter:blur(40px) saturate(180%);
  -webkit-backdrop-filter:blur(40px) saturate(180%);
  border:1px solid var(--glass-border);
  border-radius:var(--r);
  padding:16px;
  margin-bottom:12px;
  position:relative;
  overflow:hidden;
  transition:transform .2s cubic-bezier(.16,1,.3,1), box-shadow .2s;
}
.glass-card::before{
  content:'';position:absolute;top:0;left:0;right:0;height:50%;
  background:linear-gradient(180deg,rgba(255,255,255,0.06),transparent);
  pointer-events:none;border-radius:var(--r) var(--r) 0 0;
}
.glass-card:active{transform:scale(0.975)}

/* ── HEADER ── */
.header{padding:24px 0 4px;text-align:center}
.header h1{
  font-size:28px;font-weight:900;letter-spacing:-1px;
  background:linear-gradient(135deg,#fff 0%,rgba(255,255,255,0.5) 100%);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
}
.header .sub{font-size:13px;color:var(--text2);margin-top:2px;font-weight:500}

/* ── FLOATING NAV (iOS 26 style) ── */
.nav{
  position:fixed;bottom:16px;
  left:50%;transform:translateX(-50%);
  width:calc(100% - 48px);max-width:382px;
  display:flex;gap:4px;
  background:rgba(30,30,30,0.65);
  backdrop-filter:blur(50px) saturate(190%);
  -webkit-backdrop-filter:blur(50px) saturate(190%);
  border:1px solid rgba(255,255,255,0.12);
  border-radius:var(--r3);
  padding:6px 8px;
  z-index:100;
  box-shadow:0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08);
}
.nav::before{
  content:'';position:absolute;top:0;left:20px;right:20px;height:1px;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent);
}
.nav-btn{
  flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;
  padding:8px 4px;background:none;border:none;
  color:var(--text3);font-size:10px;font-weight:600;
  font-family:'Inter',sans-serif;cursor:pointer;
  transition:all .25s cubic-bezier(.16,1,.3,1);
  border-radius:16px;position:relative;
}
.nav-btn.active{
  color:#fff;
  background:rgba(255,255,255,0.1);
}
.nav-btn .ni{font-size:20px;transition:transform .25s cubic-bezier(.16,1,.3,1)}
.nav-btn.active .ni{transform:scale(1.12)}
.nav-pill{
  position:absolute;bottom:-2px;
  width:4px;height:4px;border-radius:50%;
  background:var(--blue);
  opacity:0;transition:opacity .2s;
}
.nav-btn.active .nav-pill{opacity:1}

/* ── WORKOUT CARDS ── */
.wk-card{
  display:flex;align-items:center;gap:14px;cursor:pointer;
}
.wk-icon{
  width:52px;height:52px;border-radius:16px;
  display:flex;align-items:center;justify-content:center;
  font-size:24px;flex-shrink:0;
  position:relative;overflow:hidden;
}
.wk-icon::after{
  content:'';position:absolute;inset:0;
  background:linear-gradient(135deg,rgba(255,255,255,0.15),transparent);
  border-radius:16px;
}
.wk-info{flex:1}
.wk-info h3{font-size:16px;font-weight:700;letter-spacing:-0.3px}
.wk-info .sub{font-size:12px;color:var(--text2);margin-top:1px;font-weight:500}
.wk-info .meta{font-size:11px;color:var(--text3);margin-top:3px}
.wk-arrow{color:var(--text3);font-size:16px;font-weight:300}

/* ── EXERCISE LOGGING ── */
.ex-card{
  background:var(--glass);
  backdrop-filter:blur(40px) saturate(180%);
  -webkit-backdrop-filter:blur(40px) saturate(180%);
  border:1px solid var(--glass-border);
  border-radius:var(--r);
  margin-bottom:10px;overflow:hidden;
  position:relative;
}
.ex-card::before{
  content:'';position:absolute;top:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent);
  pointer-events:none;
}
.ex-head{
  padding:14px 16px;display:flex;
  justify-content:space-between;align-items:center;
}
.ex-name{font-size:14px;font-weight:700}
.ex-meta{font-size:11px;color:var(--text2);font-family:'JetBrains Mono',monospace;font-weight:500}
.ex-sets{padding:0 16px 14px}

.set-row{display:flex;align-items:center;gap:8px;margin-bottom:8px}
.set-n{
  width:28px;height:28px;border-radius:10px;
  background:rgba(255,255,255,0.06);
  display:flex;align-items:center;justify-content:center;
  font-size:12px;font-weight:700;
  font-family:'JetBrains Mono',monospace;
  color:var(--text3);flex-shrink:0;
  transition:all .2s;
}
.set-n.done{background:var(--green);color:#fff}
.set-in{
  flex:1;height:40px;
  background:rgba(255,255,255,0.05);
  border:1.5px solid rgba(255,255,255,0.08);
  border-radius:12px;
  color:var(--text);font-size:16px;
  font-family:'JetBrains Mono',monospace;font-weight:600;
  text-align:center;outline:none;
  transition:border-color .2s,background .2s;
  -webkit-appearance:none;
}
.set-in:focus{border-color:rgba(0,122,255,0.6);background:rgba(0,122,255,0.08)}
.set-in::placeholder{color:var(--text3);font-size:11px}
.set-x{color:var(--text3);font-size:14px;font-weight:600}
.set-ck{
  width:36px;height:36px;border-radius:12px;
  border:2px solid rgba(255,255,255,0.1);
  background:rgba(255,255,255,0.04);
  color:transparent;display:flex;
  align-items:center;justify-content:center;
  cursor:pointer;transition:all .25s cubic-bezier(.16,1,.3,1);
  font-size:16px;flex-shrink:0;
}
.set-ck.on{
  background:var(--green);border-color:var(--green);
  color:#fff;
  box-shadow:0 0 16px rgba(48,209,88,0.3);
}
.prev-w{
  font-size:10px;color:var(--text3);
  font-family:'JetBrains Mono',monospace;
  text-align:right;margin:-2px 50px 6px 0;
}

/* ── GROUP LABEL ── */
.grp{
  font-size:11px;font-weight:700;
  text-transform:uppercase;letter-spacing:1.8px;
  color:var(--text3);margin:20px 0 10px 4px;
}
.grp:first-of-type{margin-top:10px}

/* ── STAT GRID ── */
.stats{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px}
.stat{
  background:var(--glass);
  backdrop-filter:blur(40px) saturate(180%);
  -webkit-backdrop-filter:blur(40px) saturate(180%);
  border:1px solid var(--glass-border);
  border-radius:var(--r);
  padding:16px;text-align:center;
  position:relative;overflow:hidden;
}
.stat::before{
  content:'';position:absolute;top:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent);
}
.stat-v{font-family:'JetBrains Mono',monospace;font-size:28px;font-weight:700}
.stat-l{font-size:11px;color:var(--text2);margin-top:4px;font-weight:600}
.stat-d{font-size:11px;font-family:'JetBrains Mono',monospace;font-weight:700;margin-top:3px}
.up{color:var(--green)}.down{color:var(--red)}

/* ── INPUTS ── */
.field{
  width:100%;height:48px;
  background:rgba(255,255,255,0.05);
  border:1.5px solid rgba(255,255,255,0.08);
  border-radius:14px;
  color:var(--text);font-size:18px;
  font-family:'JetBrains Mono',monospace;font-weight:600;
  padding:0 16px;outline:none;
  transition:border-color .2s,background .2s;
  -webkit-appearance:none;
}
.field:focus{border-color:rgba(0,122,255,0.6);background:rgba(0,122,255,0.06)}
.field-date{
  flex:1;height:42px;font-size:14px;
  background:rgba(255,255,255,0.05);
  border:1.5px solid rgba(255,255,255,0.08);
  border-radius:14px;color:var(--text);
  font-family:'JetBrains Mono',monospace;
  padding:0 12px;outline:none;
  -webkit-appearance:none;
  transition:border-color .2s;
}
.field-date:focus{border-color:rgba(0,122,255,0.6)}

/* ── BUTTONS ── */
.btn{
  width:100%;height:50px;border-radius:var(--r2);
  border:none;font-family:'Inter',sans-serif;
  font-size:15px;font-weight:700;cursor:pointer;
  display:flex;align-items:center;justify-content:center;gap:8px;
  transition:all .2s cubic-bezier(.16,1,.3,1);
  position:relative;overflow:hidden;
}
.btn:active{transform:scale(0.96)}
.btn-blue{
  background:linear-gradient(135deg,#007AFF,#0055D4);
  color:#fff;
  box-shadow:0 4px 20px rgba(0,122,255,0.3);
}
.btn-green{
  background:linear-gradient(135deg,#30D158,#20A840);
  color:#fff;
  box-shadow:0 4px 20px rgba(48,209,88,0.3);
}
.btn-glass{
  background:var(--glass2);
  backdrop-filter:blur(20px);
  -webkit-backdrop-filter:blur(20px);
  border:1px solid var(--glass-border);
  color:var(--text);
}
.btn-back{
  background:none;border:none;color:var(--text2);
  font-size:15px;font-weight:600;
  font-family:'Inter',sans-serif;cursor:pointer;
  display:flex;align-items:center;gap:6px;
  padding:8px 0;margin-bottom:8px;
}

/* ── CHART ── */
.chart-wrap{
  background:var(--glass);
  backdrop-filter:blur(40px) saturate(180%);
  -webkit-backdrop-filter:blur(40px) saturate(180%);
  border:1px solid var(--glass-border);
  border-radius:var(--r);
  padding:16px;margin-bottom:12px;
  position:relative;overflow:hidden;
}
.chart-wrap::before{
  content:'';position:absolute;top:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent);
}
.chart-t{font-size:13px;font-weight:700;color:var(--text2);margin-bottom:12px}

/* ── HISTORY ── */
.hist{
  display:flex;justify-content:space-between;align-items:center;
  padding:12px 0;
  border-bottom:1px solid rgba(255,255,255,0.04);
}
.hist:last-child{border-bottom:none}
.hist-d{font-size:13px;color:var(--text2)}
.hist-v{font-family:'JetBrains Mono',monospace;font-size:15px;font-weight:700}

/* ── SECTION ── */
.sec{font-size:17px;font-weight:800;margin:20px 0 12px;letter-spacing:-0.3px}
.sec:first-child{margin-top:0}

/* ── EMPTY ── */
.empty{text-align:center;padding:40px 20px;color:var(--text3)}
.empty-i{font-size:48px;margin-bottom:12px}
.empty-t{font-size:14px;line-height:1.5}

/* ── TABS ── */
.tabs{display:flex;gap:6px;margin-bottom:16px;overflow-x:auto;padding-bottom:4px}
.tabs::-webkit-scrollbar{display:none}
.tab{
  padding:8px 16px;border-radius:20px;
  background:var(--glass);
  backdrop-filter:blur(20px);
  -webkit-backdrop-filter:blur(20px);
  border:1px solid transparent;
  color:var(--text2);font-size:13px;font-weight:700;
  font-family:'Inter',sans-serif;cursor:pointer;
  white-space:nowrap;transition:all .25s;
}
.tab.on{
  border-color:var(--glass-border2);
  color:#fff;
  background:var(--glass2);
}

/* ── TOAST ── */
.toast{
  position:fixed;bottom:110px;left:50%;transform:translateX(-50%);
  background:rgba(48,209,88,0.9);
  backdrop-filter:blur(20px);
  -webkit-backdrop-filter:blur(20px);
  color:#fff;padding:10px 24px;border-radius:24px;
  font-size:14px;font-weight:700;z-index:200;
  animation:scaleIn .3s cubic-bezier(.16,1,.3,1),fadeOut .3s ease 1.5s forwards;
  pointer-events:none;
  box-shadow:0 4px 20px rgba(48,209,88,0.3);
}
@keyframes fadeOut{to{opacity:0;transform:translate(-50%,8px) scale(.95)}}

/* ── MEASURE GRID ── */
.mgrid{display:grid;grid-template-columns:1fr 1fr;gap:10px}

/* ── TREND BADGE ── */
.trend-badge{
  display:inline-flex;align-items:center;gap:4px;
  padding:4px 10px;border-radius:12px;
  font-size:12px;font-weight:700;
  font-family:'JetBrains Mono',monospace;
}
.trend-up{background:rgba(48,209,88,0.15);color:var(--green)}
.trend-down{background:rgba(255,69,58,0.15);color:var(--red)}
.trend-flat{background:rgba(255,255,255,0.08);color:var(--text2)}

/* ── SCROLLBAR ── */
::-webkit-scrollbar{width:0;height:0}

/* ── PROGRESS RING ── */
.ring-wrap{position:relative;display:inline-flex;align-items:center;justify-content:center}
.ring-text{position:absolute;font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:700}
`;

// ═══════════════ HELPERS ═══════════════
function Toast({ msg }) { return msg ? <div className="toast">{msg}</div> : null; }

function ChartTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background:"rgba(30,30,30,0.85)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",
      border:"1px solid rgba(255,255,255,0.12)",borderRadius:14,padding:"8px 14px",
      fontSize:12,fontFamily:"'JetBrains Mono',monospace"
    }}>
      <div style={{color:"rgba(255,255,255,0.5)",marginBottom:4}}>{label}</div>
      {payload.map((p,i)=>(
        <div key={i} style={{color:p.color||"#fff",fontWeight:700}}>{p.value} кг</div>
      ))}
    </div>
  );
}

function ProgressRing({pct,size=60,stroke=5,color="#007AFF"}){
  const r=(size-stroke)/2;
  const c=2*Math.PI*r;
  const off=c-c*(pct/100);
  return(
    <div className="ring-wrap" style={{width:size,height:size}}>
      <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
                strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"
                style={{transition:"stroke-dashoffset .6s cubic-bezier(.16,1,.3,1)"}}/>
      </svg>
      <span className="ring-text">{pct}%</span>
    </div>
  );
}

function linearRegSlope(data) {
  if (data.length < 2) return 0;
  const n = data.length;
  let sx=0,sy=0,sxy=0,sx2=0;
  data.forEach((d,i)=>{sx+=i;sy+=d.weight;sxy+=i*d.weight;sx2+=i*i});
  return (n*sxy-sx*sy)/(n*sx2-sx*sx);
}

// ═══════════════ MAIN ═══════════════
export default function App() {
  const [tab, setTab] = useState("work");
  const [selW, setSelW] = useState(null);
  const [logs, setLogs] = useState(() => S.g("logs") || {});
  const [bwLogs, setBwLogs] = useState(() => S.g("bw") || []);
  const [mLogs, setMLogs] = useState(() => S.g("ms") || []);
  const [toast, setToast] = useState("");
  const [date, setDate] = useState(isoDate());
  const [bwIn, setBwIn] = useState("");
  const [mIn, setMIn] = useState({chest:"",waist:"",armL:"",armR:"",hips:"",thigh:""});

  useEffect(()=>{S.s("logs",logs)},[logs]);
  useEffect(()=>{S.s("bw",bwLogs)},[bwLogs]);
  useEffect(()=>{S.s("ms",mLogs)},[mLogs]);

  const flash=useCallback(m=>{setToast(m);setTimeout(()=>setToast(""),2000)},[]);

  // ── workout log helpers ──
  const getSD=(eid,si)=>{const k=`${eid}_${date}`;return logs[k]?.[si]||{weight:"",reps:"",done:false}};
  const getPrev=(eid)=>{
    const ks=Object.keys(logs).filter(k=>k.startsWith(eid+"_")&&!k.endsWith(date)).sort().reverse();
    for(const k of ks){const mx=Math.max(...Object.values(logs[k]).map(s=>Number(s.weight)||0));if(mx>0)return mx}
    return null;
  };
  const upSet=(eid,si,f,v)=>{
    const k=`${eid}_${date}`;
    setLogs(p=>({...p,[k]:{...(p[k]||{}),[si]:{...(p[k]?.[si]||{weight:"",reps:"",done:false}),[f]:v}}}));
  };
  const togSet=(eid,si)=>{const k=`${eid}_${date}`;upSet(eid,si,"done",!(logs[k]?.[si]?.done||false))};
  const exProgress=(eid)=>{
    const e=[];
    Object.keys(logs).filter(k=>k.startsWith(eid+"_")).sort().forEach(k=>{
      const d=k.split("_").pop();
      const mx=Math.max(...Object.values(logs[k]).map(s=>Number(s.weight)||0));
      if(mx>0)e.push({date:d.slice(5),weight:mx,fullDate:d});
    });
    return e;
  };

  // ── body weight ──
  const saveBW=()=>{
    const v=parseFloat(bwIn);if(!v)return;
    const i=bwLogs.findIndex(e=>e.date===date);
    let u;
    if(i>=0){u=[...bwLogs];u[i]={date,weight:v}}
    else u=[...bwLogs,{date,weight:v}];
    u.sort((a,b)=>a.date.localeCompare(b.date));
    setBwLogs(u);setBwIn("");flash("✓ Вес сохранён");
  };

  // ── measures ──
  const saveM=()=>{
    const m={};let any=false;
    Object.entries(mIn).forEach(([k,v])=>{const n=parseFloat(v);if(n){m[k]=n;any=true}});
    if(!any)return;
    m.date=date;
    const i=mLogs.findIndex(e=>e.date===date);
    let u;
    if(i>=0){u=[...mLogs];u[i]={...mLogs[i],...m}}
    else u=[...mLogs,m];
    u.sort((a,b)=>a.date.localeCompare(b.date));
    setMLogs(u);setMIn({chest:"",waist:"",armL:"",armR:"",hips:"",thigh:""});flash("✓ Замеры сохранены");
  };

  // ═══════════════ PAGES ═══════════════

  // ── WORKOUTS LIST ──
  const WorkList=()=>(
    <div className="page">
      <div className="header">
        <h1>n3 gym</h1>
        <div className="sub">4 тренировки в неделю · в любом порядке</div>
      </div>
      <div style={{display:"flex",gap:8,margin:"12px 0 16px"}}>
        <input type="date" className="field-date" value={date} onChange={e=>setDate(e.target.value)}/>
      </div>
      {PLAN.map((w,wi)=>(
        <div className="glass-card" key={w.id} onClick={()=>setSelW(w)} style={{animationDelay:wi*60+"ms",animation:"scaleIn .4s cubic-bezier(.16,1,.3,1) both",animationDelay:wi*60+"ms"}}>
          <div className="wk-card">
            <div className="wk-icon" style={{background:w.color+"20"}}>
              {w.icon}
            </div>
            <div className="wk-info">
              <h3 style={{color:w.color}}>{w.name}</h3>
              <div className="sub">{w.sub}</div>
              <div className="meta">{w.groups.reduce((a,g)=>a+g.exercises.length,0)} упражнений</div>
            </div>
            <div className="wk-arrow">
              <svg width="8" height="14" viewBox="0 0 8 14" fill="none"><path d="M1 1l6 6-6 6" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // ── WORKOUT DETAIL ──
  const WorkDetail=()=>{
    const w=selW;
    const all=w.groups.flatMap(g=>g.exercises);
    const tot=all.reduce((a,e)=>a+e.sets,0);
    const dn=all.reduce((a,e)=>{let c=0;for(let i=0;i<e.sets;i++)if(getSD(e.id,i).done)c++;return a+c},0);
    const pct=tot>0?Math.round(dn/tot*100):0;
    return(
      <div className="page">
        <button className="btn-back" onClick={()=>setSelW(null)}>
          <svg width="10" height="18" viewBox="0 0 10 18" fill="none"><path d="M9 1L1 9l8 8" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Назад
        </button>
        <div className="glass-strong" style={{padding:20,marginBottom:16,borderColor:w.color+"30"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontSize:32,marginBottom:8}}>{w.icon}</div>
              <h2 style={{fontSize:22,fontWeight:800,color:w.color,letterSpacing:"-0.5px"}}>{w.name}</h2>
              <div style={{color:"var(--text2)",fontSize:13,marginTop:4,fontWeight:500}}>{w.sub}</div>
            </div>
            <ProgressRing pct={pct} color={w.color} size={64} stroke={5}/>
          </div>
          <div style={{marginTop:16,height:5,background:"rgba(255,255,255,0.06)",borderRadius:3,overflow:"hidden"}}>
            <div style={{width:`${pct}%`,height:"100%",background:pct===100?"var(--green)":w.color,borderRadius:3,transition:"width .5s cubic-bezier(.16,1,.3,1)"}}/>
          </div>
          <div style={{fontSize:12,color:"var(--text2)",marginTop:6,fontFamily:"'JetBrains Mono',monospace"}}>{dn}/{tot} подходов</div>
        </div>
        <div style={{display:"flex",gap:8,marginBottom:16}}>
          <input type="date" className="field-date" value={date} onChange={e=>setDate(e.target.value)}/>
        </div>
        {w.groups.map((g,gi)=>(
          <div key={gi}>
            <div className="grp">{g.name}</div>
            {g.exercises.map(ex=>{
              const prev=getPrev(ex.id);
              const prog=exProgress(ex.id);
              return(
                <div className="ex-card" key={ex.id}>
                  <div className="ex-head">
                    <span className="ex-name">{ex.name}</span>
                    <span className="ex-meta">{ex.sets}×{ex.reps}{ex.rest?` · ${ex.rest}`:""}</span>
                  </div>
                  {prev&&<div className="prev-w">прошлый макс: {prev} кг</div>}
                  <div className="ex-sets">
                    {Array.from({length:ex.sets},(_,i)=>{
                      const d=getSD(ex.id,i);
                      return(
                        <div className="set-row" key={i}>
                          <div className={`set-n ${d.done?"done":""}`}>{i+1}</div>
                          <input className="set-in" type="number" inputMode="decimal" placeholder="кг"
                                 value={d.weight} onChange={e=>upSet(ex.id,i,"weight",e.target.value)}/>
                          <span className="set-x">×</span>
                          <input className="set-in" type="number" inputMode="numeric" placeholder="раз"
                                 value={d.reps} onChange={e=>upSet(ex.id,i,"reps",e.target.value)}/>
                          <button className={`set-ck ${d.done?"on":""}`} onClick={()=>togSet(ex.id,i)}>
                            {d.done?"✓":""}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  {prog.length>1&&(
                    <div style={{padding:"0 12px 12px"}}>
                      <ResponsiveContainer width="100%" height={70}>
                        <AreaChart data={prog}>
                          <defs><linearGradient id={`g_${ex.id}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={w.color} stopOpacity={0.25}/>
                            <stop offset="100%" stopColor={w.color} stopOpacity={0}/>
                          </linearGradient></defs>
                          <Area type="monotone" dataKey="weight" stroke={w.color} fill={`url(#g_${ex.id})`} strokeWidth={2} dot={false}/>
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  // ── BODY WEIGHT ──
  const BodyPage=()=>{
    const sorted=[...bwLogs].sort((a,b)=>b.date.localeCompare(a.date));
    const chartData=[...bwLogs].sort((a,b)=>a.date.localeCompare(b.date)).slice(-30).map(e=>({date:e.date.slice(5),weight:e.weight}));
    const latest=sorted[0]?.weight;
    const prev=sorted[1]?.weight;
    const delta=latest&&prev?(latest-prev).toFixed(1):null;
    const first=sorted[sorted.length-1]?.weight;
    const totalD=latest&&first?(latest-first).toFixed(1):null;

    // Trend calculation
    const slope = linearRegSlope(chartData);
    const trendDir = slope > 0.02 ? "up" : slope < -0.02 ? "down" : "flat";
    const trendLabel = trendDir === "up" ? "↗ Набор" : trendDir === "down" ? "↘ Сброс" : "→ Стабильно";
    const trendClass = trendDir === "up" ? "trend-up" : trendDir === "down" ? "trend-down" : "trend-flat";

    // trend line data
    const trendLine = chartData.length >= 2 ? chartData.map((d,i)=>{
      const startY = chartData[0].weight;
      return {...d, trend: Math.round((startY + slope * i)*10)/10};
    }) : [];

    return(
      <div className="page">
        <div className="header">
          <h1>Вес тела</h1>
          <div className="sub">Динамика и тренд</div>
        </div>

        <div className="stats">
          <div className="stat">
            <div className="stat-v" style={{color:"var(--blue)"}}>{latest||"—"}</div>
            <div className="stat-l">Текущий, кг</div>
            {delta&&<div className={`stat-d ${Number(delta)>0?"up":"down"}`}>{Number(delta)>0?"+":""}{delta}</div>}
          </div>
          <div className="stat">
            <div className="stat-v" style={{color:totalD&&Number(totalD)>0?"var(--green)":"var(--orange)"}}>
              {totalD?(Number(totalD)>0?"+":"")+totalD:"—"}
            </div>
            <div className="stat-l">Всего, кг</div>
            {sorted.length>0&&<div className="stat-d" style={{color:"var(--text3)"}}>с {sorted[sorted.length-1]?.date?.slice(5)}</div>}
          </div>
        </div>

        {chartData.length>1&&(
          <div style={{textAlign:"center",marginBottom:12}}>
            <span className={`trend-badge ${trendClass}`}>{trendLabel} ({slope>0?"+":""}{slope.toFixed(2)} кг/запись)</span>
          </div>
        )}

        {chartData.length>1&&(
          <div className="chart-wrap">
            <div className="chart-t">Динамика веса · тренд</div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={trendLine.length?trendLine:chartData}>
                <defs>
                  <linearGradient id="bwG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#007AFF" stopOpacity={0.25}/>
                    <stop offset="100%" stopColor="#007AFF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.1)" tick={{fontSize:10,fill:"rgba(255,255,255,0.3)"}}/>
                <YAxis domain={["dataMin - 1","dataMax + 1"]} stroke="rgba(255,255,255,0.1)" tick={{fontSize:10,fill:"rgba(255,255,255,0.3)"}} width={35}/>
                <Tooltip content={<ChartTip/>}/>
                <Area type="monotone" dataKey="weight" stroke="#007AFF" fill="url(#bwG)" strokeWidth={2.5} dot={{r:3,fill:"#007AFF",strokeWidth:0}} name="Вес"/>
                {trendLine.length>0&&(
                  <Line type="monotone" dataKey="trend" stroke={trendDir==="up"?"#30D158":trendDir==="down"?"#FF453A":"rgba(255,255,255,0.2)"}
                        strokeWidth={2} strokeDasharray="6 4" dot={false} name="Тренд"/>
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="glass-card">
          <div style={{display:"flex",gap:8,marginBottom:12}}>
            <input type="date" className="field-date" value={date} onChange={e=>setDate(e.target.value)}/>
          </div>
          <div style={{display:"flex",gap:10}}>
            <input className="field" type="number" inputMode="decimal" placeholder="Вес в кг"
                   value={bwIn} onChange={e=>setBwIn(e.target.value)} style={{flex:1}}/>
            <button className="btn btn-blue" onClick={saveBW} style={{width:110}}>Сохранить</button>
          </div>
        </div>

        {sorted.length>0&&(
          <div className="glass-card" style={{marginTop:0}}>
            <div className="chart-t">История</div>
            {sorted.slice(0,15).map((e,i)=>(
              <div className="hist" key={i}>
                <span className="hist-d">{e.date}</span>
                <span className="hist-v">{e.weight} кг</span>
              </div>
            ))}
          </div>
        )}
        {sorted.length===0&&(
          <div className="empty"><div className="empty-i">⚖️</div><div className="empty-t">Пока нет записей.<br/>Внеси свой первый вес!</div></div>
        )}
      </div>
    );
  };

  // ── MEASUREMENTS ──
  const MeasPage=()=>{
    const fields=[
      {key:"chest",label:"Грудь",icon:"📐"},{key:"waist",label:"Талия",icon:"📏"},
      {key:"armL",label:"Рука Л",icon:"💪"},{key:"armR",label:"Рука П",icon:"💪"},
      {key:"hips",label:"Бёдра",icon:"🦵"},{key:"thigh",label:"Бедро",icon:"🦿"},
    ];
    const sorted=[...mLogs].sort((a,b)=>b.date.localeCompare(a.date));
    const latest=sorted[0]||{};
    const getCD=f=>[...mLogs].sort((a,b)=>a.date.localeCompare(b.date)).filter(e=>e[f]).map(e=>({date:e.date.slice(5),value:e[f]}));

    return(
      <div className="page">
        <div className="header"><h1>Замеры</h1><div className="sub">Объёмы тела</div></div>
        <div className="stats">
          {fields.slice(0,4).map(f=>(
            <div className="stat" key={f.key}>
              <div className="stat-v" style={{fontSize:22}}>{latest[f.key]||"—"}</div>
              <div className="stat-l">{f.label}, см</div>
            </div>
          ))}
        </div>
        <div className="glass-card">
          <div className="chart-t">Новый замер</div>
          <div style={{display:"flex",gap:8,marginBottom:12}}>
            <input type="date" className="field-date" value={date} onChange={e=>setDate(e.target.value)}/>
          </div>
          <div className="mgrid">
            {fields.map(f=>(
              <div key={f.key} style={{marginBottom:10}}>
                <div style={{fontSize:11,fontWeight:700,color:"var(--text2)",marginBottom:5}}>{f.icon} {f.label} (см)</div>
                <input className="field" type="number" inputMode="decimal" placeholder="см"
                       value={mIn[f.key]} onChange={e=>setMIn(p=>({...p,[f.key]:e.target.value}))} style={{fontSize:15,height:44}}/>
              </div>
            ))}
          </div>
          <button className="btn btn-green" onClick={saveM} style={{marginTop:6}}>💾 Сохранить</button>
        </div>
        {fields.map(f=>{
          const d=getCD(f.key);if(d.length<2)return null;
          return(
            <div className="chart-wrap" key={f.key}>
              <div className="chart-t">{f.label}</div>
              <ResponsiveContainer width="100%" height={110}>
                <LineChart data={d}>
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.1)" tick={{fontSize:10,fill:"rgba(255,255,255,0.3)"}}/>
                  <YAxis domain={["dataMin - 1","dataMax + 1"]} stroke="rgba(255,255,255,0.1)" tick={{fontSize:10,fill:"rgba(255,255,255,0.3)"}} width={35}/>
                  <Tooltip content={<ChartTip/>}/>
                  <Line type="monotone" dataKey="value" stroke="#BF5AF2" strokeWidth={2} dot={{r:3,fill:"#BF5AF2"}}/>
                </LineChart>
              </ResponsiveContainer>
            </div>
          );
        })}
        {sorted.length>0&&(
          <div className="glass-card">
            <div className="chart-t">История замеров</div>
            {sorted.slice(0,10).map((e,i)=>(
              <div className="hist" key={i}>
                <span className="hist-d">{e.date}</span>
                <span className="hist-v" style={{fontSize:11}}>
                  {fields.filter(f=>e[f.key]).map(f=>`${f.label}: ${e[f.key]}`).join(" · ")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // ── PROGRESS ──
  const ProgPage=()=>{
    const [sel,setSel]=useState(null);
    const keyEx=[
      {id:"ua1",name:"Жим лёжа",color:"#007AFF"},
      {id:"la1",name:"Присед",color:"#30D158"},
      {id:"la2",name:"Румынская тяга",color:"#FF9F0A"},
      {id:"ub1",name:"Жим под углом",color:"#BF5AF2"},
      {id:"lb1",name:"Фронт. присед",color:"#FF6B35"},
    ];
    return(
      <div className="page">
        <div className="header"><h1>Прогресс</h1><div className="sub">Рост рабочих весов</div></div>
        <div className="sec">🏆 Ключевые лифты</div>
        <div className="stats">
          {keyEx.slice(0,4).map(ex=>{
            const d=exProgress(ex.id);const cur=d[d.length-1]?.weight||"—";
            return(
              <div className="stat" key={ex.id} onClick={()=>setSel(ex)} style={{cursor:"pointer"}}>
                <div className="stat-v" style={{fontSize:22,color:ex.color}}>{cur}</div>
                <div className="stat-l">{ex.name}</div>
              </div>
            );
          })}
        </div>
        <div className="sec">📊 Графики</div>
        <div className="tabs">
          {keyEx.map(ex=>(
            <button key={ex.id} className={`tab ${sel?.id===ex.id?"on":""}`}
                    onClick={()=>setSel(sel?.id===ex.id?null:ex)}
                    style={sel?.id===ex.id?{borderColor:ex.color+"60",background:ex.color+"18"}:{}}>
              {ex.name}
            </button>
          ))}
        </div>
        {sel&&(()=>{
          const d=exProgress(sel.id);
          if(d.length<2)return<div className="empty"><div className="empty-t">Мало данных. Запиши хотя бы 2 тренировки!</div></div>;
          return(
            <div className="chart-wrap" style={{borderColor:sel.color+"20"}}>
              <div className="chart-t">{sel.name} — макс. вес (кг)</div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={d}>
                  <defs><linearGradient id="pG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={sel.color} stopOpacity={0.25}/>
                    <stop offset="100%" stopColor={sel.color} stopOpacity={0}/>
                  </linearGradient></defs>
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.1)" tick={{fontSize:10,fill:"rgba(255,255,255,0.3)"}}/>
                  <YAxis domain={["dataMin - 5","dataMax + 5"]} stroke="rgba(255,255,255,0.1)" tick={{fontSize:10,fill:"rgba(255,255,255,0.3)"}} width={35}/>
                  <Tooltip content={<ChartTip/>}/>
                  <Area type="monotone" dataKey="weight" stroke={sel.color} fill="url(#pG)" strokeWidth={2.5}
                        dot={{r:4,fill:sel.color,strokeWidth:2,stroke:"rgba(0,0,0,0.3)"}} name="Вес"/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          );
        })()}
        {!sel&&<div className="empty"><div className="empty-i">📈</div><div className="empty-t">Выбери упражнение<br/>для просмотра графика</div></div>}
        <div className="sec" style={{marginTop:28}}>📋 Все упражнения</div>
        {PLAN.map(w=>(
          <div key={w.id} style={{marginBottom:16}}>
            <div className="grp" style={{color:w.color}}>{w.icon} {w.name}</div>
            {w.groups.flatMap(g=>g.exercises).map(ex=>{
              const d=exProgress(ex.id);const best=d.length>0?Math.max(...d.map(x=>x.weight)):null;
              return(
                <div key={ex.id} className="glass-card" style={{padding:"12px 16px",marginBottom:6}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{fontSize:13,fontWeight:600}}>{ex.name}</span>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:14,fontWeight:700,color:best?w.color:"var(--text3)"}}>
                      {best?`${best} кг`:"—"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  // ═══════════════ RENDER ═══════════════
  return(
    <>
      <style>{CSS}</style>
      <div className="bg-mesh">
        <div className="bg-orb"/><div className="bg-orb"/><div className="bg-orb"/>
      </div>
      <div className="app">
        {selW ? <WorkDetail/> :
         tab==="work" ? <WorkList/> :
         tab==="body" ? <BodyPage/> :
         tab==="meas" ? <MeasPage/> :
         <ProgPage/>}
        <Toast msg={toast}/>
        <nav className="nav">
          {[
            {id:"work",icon:"🏋️",label:"Трени"},
            {id:"body",icon:"⚖️",label:"Вес"},
            {id:"meas",icon:"📐",label:"Замеры"},
            {id:"prog",icon:"📈",label:"Прогресс"},
          ].map(t=>(
            <button key={t.id} className={`nav-btn ${tab===t.id&&!selW?"active":""}`}
                    onClick={()=>{setTab(t.id);setSelW(null)}}>
              <span className="ni">{t.icon}</span>
              {t.label}
              <div className="nav-pill"/>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}
