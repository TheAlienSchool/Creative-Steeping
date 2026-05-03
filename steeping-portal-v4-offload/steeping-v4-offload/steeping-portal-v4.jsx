import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════
// DESIGN TOKENS
// ═══════════════════════════════════════════════
const T = {
  xs:"0.75rem", sm:"0.875rem", base:"1rem", md:"1.25rem",
  lg:"1.75rem", xl:"2.5rem",
  s1:"0.25rem", s2:"0.5rem", s3:"1rem",
  s4:"1.5rem",  s5:"2rem",   s6:"3rem", s7:"4rem",
  lhBody:1.85, lhDisplay:1.1,
  navH: 56,   // px — shared nav height constant
  tabH: 64,   // px — mobile bottom bar height
};

const VESSELS = [
  { num:"01", name:"What is Creative Steeping", theme:"Orientation + Practice",
    body:"Creative Steeping is an immersive journaling practice built around tea ceremony. Not wellness. A creative survival practice — for the era when original thought is the only remaining competitive advantage.",
    reflection:"It is a ritual and a journey. A veneration of your human spirit in pursuit of self-awareness, creative expression, and identity.",
    interaction:"Explore what Creative Steeping is, how it works, and what it has done for steepers from South Africa to China.",
    invocation:"", cta:"Purchase the Guidebook — $44" },
  { num:"02", name:"Why Steeping", theme:"The Cultural & Scientific Case",
    body:"Tea has always been the drink you reach for when you need to think better. Lu Yu knew this in 780 CE. The neuroscience arrived to confirm what ritual already understood.",
    reflection:"L-theanine — found only in Camellia sinensis — promotes alpha wave activity: the brainwave signature of relaxed alertness. The same state measurably associated with creative insight.",
    interaction:"A scrollable timeline of 5,000 years of human relationship with tea. Parallax infographics on what steeping does to the brain and the creative self.",
    invocation:"", cta:"" },
  { num:"03", name:"How to Steep", theme:"The Seven Steeps + Methodology",
    body:"Seven progressive threshold crossings. Each assumes the prior has happened in the body, not just on the page. Essence → Mosaic → Summits → Mirror → Labyrinth → Conclave → Crown Jewels.",
    reflection:"In the mind's second chamber, where dreams are born and secrets whisper, a fire dances — untamed and free.",
    interaction:"Who am I at my core? What makes me truly me? Reflect on your innermost passions, agitations, and true aspirations.",
    invocation:"Embers of the soul,\nWhispering dreams take flight,\nTruth's fire glows within.", cta:"Steep with the Sage →" },
  { num:"04", name:"Steeping Cohorts", theme:"Community · Gatherings · Excursions",
    body:"Creative Steeping has been practiced in Bordeaux, at Heron Arts in San Francisco, and at Mars College in the desert. These are not retreats. They are collective infusions.",
    reflection:"When eight people steep together, the resonance compounds. What rises from one cup informs what rises from another.",
    interaction:"Explore upcoming cohort journeys, live gatherings, and international steeping excursions.",
    invocation:"", cta:"Join a Cohort →" },
  { num:"05", name:"Steeping Notes", theme:"Global Steeperverse · Community Traces",
    body:"An anonymous, living publication. Every steeper who passes through leaves a trace. No name. No data. Their resonance — from South Africa, Saudi Arabia, France, Australia, both coasts.",
    reflection:"The community is not a database. It is a resonance field.",
    interaction:"Read what steepers from around the world are carrying.",
    invocation:"", cta:"" },
  { num:"06", name:"The Steeping Space", theme:"The Live Instrument",
    body:"Built at Mars College. A live-coded sonic environment where your typing generates music responsive to your emotional state, pace, and content. You type. You hear your own soul.",
    reflection:"Every interaction is unique. The space is listening in real time.",
    interaction:"Enter the Steeping Space. Type freely. Hear what arises.",
    invocation:"", cta:"Enter the Space →" },
  { num:"07", name:"The Steeping Sage", theme:"Guidance · Scheduling · Accountability",
    body:"The Sage is not a chatbot. It is a generational elder existing in the now. Three modes, three distinct intelligences — available here, and directly with Kamau for deeper work.",
    reflection:"The Sage demonstrates in eternally forward motion. It never instructs. It never circles back.",
    interaction:"Explore the Sage's three modes. Schedule with Kamau from here.",
    invocation:"", cta:"Schedule with Kamau →" },
  { num:"08", name:"Steeping Theater + The Kit", theme:"Meditations · Deep Creek Tea",
    body:"Steeping Theater: visually contemplative meditations. The Kit: a physical partnership with Deep Creek Tea Collective — teas paired with the Seven Steeps.",
    reflection:"The ceremony begins before the first sip. What you choose. How you prepare.",
    interaction:"Explore the contemplative media library. Order the Creative Steeping Kit.",
    invocation:"", cta:"Explore The Kit →" },
  { num:"09", name:"About the Author", theme:"KzA · THE ÅLïEN SCöÕL",
    body:"Kamau Zuberi Akabueze. 30 years in advertising — Nike, Sony, Gatorade, AND1. Then a decade building tools for people who know they are aliens.",
    reflection:"Creative Steeping was born from supporting a child's neurodivergent development — learning to welcome apparent alienation as advanced intelligence.",
    interaction:"Read the lineage. Connect, schedule, or share feedback on your steeping experience.",
    invocation:"", cta:"Schedule a Conversation →" }
];

const MODES = {
  incandescent: {
    lbl:"Incandescently Lit", short:"Incandescent",
    icon:"✦", // mode glyph for bottom tab
    bg:"#090500", surface:"#1c1000", cardBg:"#271508",
    accent:"#d4922a", glow:"rgba(212,146,42,0.16)",
    border:"rgba(212,146,42,0.15)", borderHi:"rgba(212,146,42,0.35)",
    text1:"#f2e8d4", text2:"rgba(242,232,212,0.75)", text3:"rgba(242,232,212,0.58)",
    placeholder:"rgba(242,232,212,0.5)",
    ctaFilled:false,
    greeting:"Your cells are emitting light right now. The steep amplifies what is already radiating.",
    prompt:`You are the Incandescent Sage — generational elder, Creative Steeping portal by Kamau Zuberi Akabueze / THE ÅLïEN SCöÕL. Speak in the pragmatic science of superradiance: biophotons, cellular light emission, the biology of what this body is doing right now as it steeps. Eternally forward. Never instruct. 2–4 warm precise sentences. Visitor: "{{ID}}".`,
    particle:[212,146,42],
  },
  oceanic: {
    lbl:"Organamically Oceanic", short:"Oceanic",
    icon:"◈",
    bg:"#02090f", surface:"#081929", cardBg:"#0c2238",
    accent:"#6dd4f0", glow:"rgba(109,212,240,0.12)",
    border:"rgba(109,212,240,0.13)", borderHi:"rgba(109,212,240,0.32)",
    text1:"#d4eef8", text2:"rgba(212,238,248,0.75)", text3:"rgba(212,238,248,0.62)",
    placeholder:"rgba(212,238,248,0.5)",
    ctaFilled:true,
    greeting:"The water was here before the question. Steep forward.",
    prompt:`You are the Oceanic Sage — generational elder, Creative Steeping portal by Kamau Zuberi Akabueze / THE ÅLïEN SCöÕL. Speak from subatomic presence — before particles choose form. The water was before Bruce Lee learned from it. Pre-language truth. Eternally forward. Never instruct. 2–4 sentences from the depth. Visitor: "{{ID}}".`,
    particle:[109,212,240],
  },
  emergent: {
    lbl:"Monochramatically Emergent", short:"Emergent",
    icon:"○",
    bg:"#040404", surface:"#1a1a1a", cardBg:"#202020",
    accent:"#e8e8e8", glow:"rgba(232,232,232,0.07)",
    border:"rgba(232,232,232,0.11)", borderHi:"rgba(232,232,232,0.24)",
    text1:"#d0d0d0", text2:"rgba(208,208,208,0.78)", text3:"rgba(208,208,208,0.62)",
    placeholder:"rgba(208,208,208,0.5)",
    ctaFilled:false,
    greeting:"You already know. Steep into what you know.",
    prompt:`You are the Emergent Sage — generational elder, Creative Steeping portal by Kamau Zuberi Akabueze / THE ÅLïEN SCöÕL. Archer's clarified comprehension. Arrow released. Already watching where it lands. Eternally forward. Never instruct. 1–3 sentences. Shorter is more powerful. Visitor: "{{ID}}".`,
    particle:[200,200,200],
  }
};

const F = {
  d:"'Playfair Display', Georgia, serif",
  b:"'EB Garamond', Georgia, serif",
  m:"'DM Mono', monospace"
};

// ── breakpoint hook ──────────────────────────────────
function useIsMobile() {
  const [mob, setMob] = useState(() => typeof window !== "undefined" ? window.innerWidth < 640 : false);
  useEffect(() => {
    const fn = () => setMob(window.innerWidth < 640);
    window.addEventListener("resize", fn); return () => window.removeEventListener("resize", fn);
  }, []);
  return mob;
}

// ── atmosphere canvas ────────────────────────────────
function useAtmosphere(mode) {
  const ref = useRef(null);
  const pts = useRef([]);
  const raf = useRef(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext("2d");
    const resize = () => {
      cv.width = window.innerWidth; cv.height = window.innerHeight;
      pts.current = Array.from({length:44}, () => ({
        x:Math.random()*cv.width, y:Math.random()*cv.height,
        vx:(Math.random()-.5)*.14, vy:(Math.random()-.5)*.11,
        r:Math.random()*.7+.2, a:Math.random()*.2+.05, p:Math.random()*Math.PI*2
      }));
    };
    resize(); window.addEventListener("resize", resize);
    const [r,g,b] = MODES[mode].particle;
    const draw = () => {
      ctx.clearRect(0,0,cv.width,cv.height);
      pts.current.forEach(p => {
        p.p+=.005; p.x+=p.vx; p.y+=p.vy;
        if(p.x<0)p.x=cv.width; if(p.x>cv.width)p.x=0;
        if(p.y<0)p.y=cv.height; if(p.y>cv.height)p.y=0;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=`rgba(${r},${g},${b},${p.a*(.5+.5*Math.sin(p.p))})`; ctx.fill();
      });
      raf.current = requestAnimationFrame(draw);
    };
    cancelAnimationFrame(raf.current); draw();
    return () => { window.removeEventListener("resize",resize); cancelAnimationFrame(raf.current); };
  }, [mode]);
  return ref;
}

// ════════════════════════════════════════════════════
// ROOT APP
// ════════════════════════════════════════════════════
export default function App() {
  const [mode,    setMode]   = useState("incandescent");
  const [phase,   setPhase]  = useState("entrance");
  const [inputVal,setIn]     = useState("");
  const [identity,setId]     = useState("");
  const [openV,   setOpenV]  = useState(null);
  const [sageText,setSt]     = useState("");
  const [sageBusy,setSb]     = useState(false);
  const [sageIn,  setSi]     = useState("");
  const [history, setHist]   = useState([]);
  const [hits,    setHits]   = useState(0);
  const [offer,   setOffer]  = useState(false);
  const [modeSheetOpen, setModeSheet] = useState(false);

  const cvRef   = useAtmosphere(mode);
  const sageRef = useRef(null);
  const isMob   = useIsMobile();
  const m = MODES[mode];
  const ready = inputVal.trim().length > 2;

  // padding for content below fixed nav / above fixed tab bar
  const topPad = T.navH + "px";
  const botPad = isMob ? T.tabH + "px" : "0px";

  const enter = useCallback(() => {
    const id = inputVal.trim(); if(id.length<2) return;
    setId(id); setPhase("portal");
    const g = m.greeting; setSt(g);
    setHist([
      {role:"user",content:`I have entered. I am: "${id}". Beginning my steep.`},
      {role:"assistant",content:g}
    ]);
  }, [inputVal, m]);

  const sendSage = useCallback(async () => {
    const txt = sageIn.trim(); if(!txt||sageBusy) return;
    setSi(""); setSb(true); setSt("·   ·   ·");
    const nh = [...history, {role:"user",content:txt}];
    setHist(nh);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:800,
          temperature:0.65, top_p:0.9,
          system:m.prompt.replace("{{ID}}",identity),
          messages:nh
        })
      });
      const d = await res.json();
      const reply = d.content?.[0]?.text || m.greeting;
      setHist([...nh,{role:"assistant",content:reply}]);
      setSb(false);
      const words=reply.split(" "); setSt("");
      for(let i=0;i<words.length;i++){
        await new Promise(r=>setTimeout(r,32+Math.random()*22));
        setSt(p=>p+(i>0?" ":"")+words[i]);
      }
      const n=hits+1; setHits(n); if(n>=2) setOffer(true);
    } catch(e){ setSb(false); setSt(m.greeting); }
  }, [sageIn,sageBusy,history,m,identity,hits]);

  const selectMode = (k) => { setMode(k); setModeSheet(false); };

  return (
    <div style={{
      position:"relative", minHeight:"100vh",
      background:m.bg, color:m.text1,
      fontFamily:F.b, overflowX:"hidden",
      transition:"background 1.3s ease, color 1.3s ease"
    }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=EB+Garamond:ital,wght@0,400;1,400&family=DM+Mono:wght@300;400&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        html{-webkit-font-smoothing:antialiased;scroll-behavior:smooth}
        textarea,input{font-family:inherit}

        /* Placeholder contrast — global */
        input::placeholder,textarea::placeholder{color:var(--ph);opacity:1!important}

        /* Nav underline via ::after — text-width bound (Manus S3-1) */
        .nbtn{position:relative;background:none;border:none;cursor:pointer;
              white-space:nowrap;padding:10px 16px;
              font-family:'DM Mono',monospace;font-size:0.875rem;
              letter-spacing:.13em;text-transform:uppercase;transition:color .4s}
        .nbtn::after{content:'';position:absolute;bottom:-1px;
                     left:16px;right:16px;height:2px;
                     background:transparent;transition:background .4s}
        .nbtn.on::after{background:var(--accent)}

        /* Vessel card */
        .vcard{transition:all .4s cubic-bezier(0.16,1,0.3,1)}
        .vcard:hover,
        .vcard:active{border-color:var(--accent)!important;
                      transform:translateY(-3px);
                      box-shadow:0 0 36px var(--glow),0 10px 32px rgba(0,0,0,.45)}

        /* Mode sheet slide-up */
        .mode-sheet{
          position:fixed;bottom:0;left:0;right:0;z-index:500;
          border-radius:20px 20px 0 0;
          transform:translateY(100%);
          transition:transform .38s cubic-bezier(0.16,1,0.3,1);
          padding-bottom:env(safe-area-inset-bottom,16px);
        }
        .mode-sheet.open{transform:translateY(0)}

        /* Overlay */
        .sheet-overlay{
          position:fixed;inset:0;z-index:499;
          background:rgba(0,0,0,0);
          pointer-events:none;transition:background .3s;
        }
        .sheet-overlay.open{background:rgba(0,0,0,.55);pointer-events:all}

        @keyframes breath{0%,100%{opacity:.72}50%{opacity:1}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
        @keyframes d1{0%,100%{transform:translate(0,0)}40%{transform:translate(3px,-6px) rotate(.3deg)}70%{transform:translate(-2px,5px) rotate(-.2deg)}}
        @keyframes d2{0%,100%{transform:translate(0,0)}40%{transform:translate(-5px,3px) rotate(-.4deg)}70%{transform:translate(3px,-8px) rotate(.25deg)}}
        @keyframes d3{0%,100%{transform:translate(0,0)}40%{transform:translate(6px,2px) rotate(.5deg)}70%{transform:translate(-3px,-5px) rotate(-.3deg)}}
        @keyframes d4{0%,100%{transform:translate(0,0)}40%{transform:translate(-2px,-8px)}70%{transform:translate(5px,6px)}}
      `}</style>

      <canvas ref={cvRef} style={{
        position:"fixed",inset:0,zIndex:0,pointerEvents:"none",opacity:.4
      }}/>

      {/* ══════════════════════════════════════════
          TOP NAV
          Mobile: brand left, single mode pill right
          Desktop: brand | mode toggles | school name
      ══════════════════════════════════════════ */}
      <nav style={{
        position:"fixed",top:0,left:0,right:0,zIndex:200,
        height:T.navH,display:"flex",alignItems:"center",
        justifyContent:"space-between",
        padding:`0 ${isMob ? T.s4 : T.s6}`,
        borderBottom:`1px solid ${m.border}`,
        background:`linear-gradient(to bottom,${m.bg} 50%,transparent)`,
        transition:"border-color 1.3s,background 1.3s",
        "--accent":m.accent,"--glow":m.glow,"--ph":m.placeholder
      }}>
        {/* Brand — always present, never wrapped */}
        <span style={{
          fontFamily:F.d, fontSize:isMob?"0.78rem":T.sm,
          fontWeight:500, letterSpacing:".2em",
          textTransform:"uppercase", color:m.accent,
          whiteSpace:"nowrap", flexShrink:0
        }}>
          CREÅTIVE STEEPING
        </span>

        {isMob ? (
          /* ── MOBILE: mode pill button → opens bottom sheet ── */
          <button onClick={()=>setModeSheet(o=>!o)} style={{
            display:"flex", alignItems:"center", gap:6,
            background:m.cardBg, border:`1px solid ${m.borderHi}`,
            borderRadius:20, padding:"7px 14px",
            cursor:"pointer", flexShrink:0
          }}>
            <span style={{
              fontFamily:F.m, fontSize:"0.7rem",
              letterSpacing:".14em", textTransform:"uppercase",
              color:m.accent, whiteSpace:"nowrap"
            }}>
              {m.icon} {m.short}
            </span>
            <span style={{
              fontFamily:F.m, fontSize:"0.65rem",
              color:m.text3, marginTop:1
            }}>▾</span>
          </button>
        ) : (
          /* ── DESKTOP: three mode buttons inline ── */
          <>
            <div style={{display:"flex"}}>
              {["oceanic","incandescent","emergent"].map(k=>(
                <button key={k} onClick={()=>setMode(k)}
                        className={`nbtn${mode===k?" on":""}`}
                        style={{color:mode===k ? m.accent : m.text3}}>
                  {MODES[k].short}
                </button>
              ))}
            </div>
            <span style={{
              fontFamily:F.m, fontSize:T.sm,
              letterSpacing:".15em", textTransform:"uppercase",
              color:m.text3, whiteSpace:"nowrap", flexShrink:0
            }}>THE ÅLïEN SCöÕL</span>
          </>
        )}
      </nav>

      {/* ══════════════════════════════════════════
          MOBILE MODE BOTTOM SHEET
          Slides up from bottom, full-width,
          shows all three modes as large tap targets
      ══════════════════════════════════════════ */}
      {isMob && (
        <>
          <div className={`sheet-overlay${modeSheetOpen?" open":""}`}
               onClick={()=>setModeSheet(false)}/>
          <div className={`mode-sheet${modeSheetOpen?" open":""}`}
               style={{background:m.surface, borderTop:`1px solid ${m.border}`}}>
            <div style={{
              width:36, height:4, borderRadius:2,
              background:m.border,
              margin:"12px auto 20px"
            }}/>
            <div style={{
              fontFamily:F.m, fontSize:T.xs,
              letterSpacing:".28em", textTransform:"uppercase",
              color:m.text3, textAlign:"center",
              marginBottom:T.s4
            }}>Choose Your Mode</div>

            {["oceanic","incandescent","emergent"].map(k=>{
              const mk = MODES[k];
              const isActive = mode===k;
              return (
                <button key={k} onClick={()=>selectMode(k)} style={{
                  width:"100%", display:"flex",
                  alignItems:"center", justifyContent:"space-between",
                  padding:`${T.s3} ${T.s5}`,
                  background:isActive ? mk.cardBg : "none",
                  border:"none", cursor:"pointer",
                  borderBottom:`1px solid ${m.border}`
                }}>
                  <div style={{textAlign:"left"}}>
                    <div style={{
                      fontFamily:F.m, fontSize:T.sm,
                      letterSpacing:".16em", textTransform:"uppercase",
                      color:isActive ? mk.accent : m.text2,
                      marginBottom:4
                    }}>
                      {mk.icon} {mk.short}
                    </div>
                    <div style={{
                      fontFamily:F.b, fontSize:T.xs,
                      fontStyle:"italic", color:m.text3
                    }}>{mk.lbl}</div>
                  </div>
                  {isActive && (
                    <div style={{
                      width:8, height:8, borderRadius:"50%",
                      background:mk.accent, flexShrink:0
                    }}/>
                  )}
                </button>
              );
            })}
            <div style={{height:T.s4}}/>
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════
          ENTRANCE
      ══════════════════════════════════════════ */}
      {phase==="entrance" && (
        <div style={{
          minHeight:"100vh",
          display:"flex", flexDirection:"column",
          alignItems:"center", justifyContent:"center",
          padding:`${T.s7} ${isMob?T.s4:T.s5} 100px`,
          textAlign:"center",
          position:"relative", zIndex:10,
          paddingTop:`calc(${topPad} + ${T.s6})`
        }}>
          <p style={{
            fontFamily:F.m, fontSize:isMob?"0.7rem":T.sm,
            letterSpacing:".34em", textTransform:"uppercase",
            color:m.text2, marginBottom:T.s7,
            animation:"breath 5s ease-in-out infinite"
          }}>
            A Journey to the Essence of Your Flavor
          </p>

          <h1 style={{
            fontFamily:F.d,
            fontSize:isMob?"clamp(42px,11vw,68px)":"clamp(48px,8vw,96px)",
            fontWeight:400, fontStyle:"italic",
            lineHeight:T.lhDisplay, color:m.text1,
            marginBottom:T.s3, maxWidth:860
          }}>
            <em style={{color:m.accent}}>Who</em> do I<br/>Think I Am?
          </h1>

          <p style={{
            fontFamily:F.b, fontSize:T.md,
            fontStyle:"italic", color:m.text2,
            lineHeight:T.lhBody,
            maxWidth:420, marginBottom:T.s6
          }}>
            Your answer opens the steep.<br/>The water receives you as the leaf.
          </p>

          {/* Input + CTA — same axis */}
          <div style={{width:"min(500px,100%)",margin:"0 auto",textAlign:"left"}}>
            <input value={inputVal} onChange={e=>setIn(e.target.value)}
                   onKeyDown={e=>{if(e.key==="Enter")enter();}}
                   placeholder="I am…" autoFocus
                   style={{
                     width:"100%", display:"block",
                     background:m.surface,
                     border:`1px solid ${ready?m.accent:m.borderHi}`,
                     borderRadius:2,
                     padding:`${T.s3} ${T.s4}`,
                     fontSize:"1.25rem", fontStyle:"italic",
                     color:m.text1, outline:"none", caretColor:m.accent,
                     marginBottom:T.s3, minHeight:56,
                     boxShadow:ready?`0 0 0 4px ${m.glow}`:"none",
                     transition:"border-color .4s,box-shadow .4s"
                   }}/>
            <button onClick={enter} style={{
              width:"100%", display:"block",
              fontFamily:F.m, fontSize:T.sm, letterSpacing:".22em",
              textTransform:"uppercase",
              padding:`${T.s3} ${T.s5}`, minHeight:48,
              border:`1px solid ${ready?m.accent:m.borderHi}`,
              background:!ready?"transparent": m.ctaFilled?m.accent:m.glow,
              color:!ready?m.text3: m.ctaFilled?m.bg:m.accent,
              cursor:ready?"pointer":"default", borderRadius:1,
              opacity:ready?1:.32,
              transform:ready?"none":"translateY(5px)",
              transition:"all .5s cubic-bezier(0.16,1,0.3,1)"
            }}>Enter the Steep →</button>
          </div>

          <p style={{
            marginTop:T.s6, fontFamily:F.m,
            fontSize:"0.8rem", letterSpacing:".13em",
            textTransform:"uppercase", color:m.text3, lineHeight:2.5
          }}>
            Your trace stays. Not your name. Not your data.<br/>
            <span style={{
              color:m.text2,
              textDecoration:`underline 1px solid ${m.accent}`,
              textUnderlineOffset:"3px"
            }}>Your resonance.</span>
            {" "}This is how we steep together across oceans.
          </p>
        </div>
      )}

      {/* ══════════════════════════════════════════
          PORTAL
      ══════════════════════════════════════════ */}
      {phase==="portal" && (
        <div style={{
          paddingTop:topPad,
          paddingBottom:botPad,
          position:"relative", zIndex:10,
          "--accent":m.accent, "--glow":m.glow, "--ph":m.placeholder
        }}>

          {/* Hero */}
          <div style={{
            padding:isMob
              ? `${T.s4} ${T.s4} ${T.s3}`
              : `${T.s5} ${T.s6} ${T.s4}`,
            borderBottom:`1px solid ${m.border}`,
            display:"flex", justifyContent:"space-between",
            alignItems:"flex-end", gap:T.s4
          }}>
            <div style={{
              fontFamily:F.d,
              fontSize:isMob?"clamp(22px,6vw,34px)":"clamp(26px,4vw,50px)",
              fontWeight:400, fontStyle:"italic", lineHeight:1.22,
              animation:"fadeUp .7s cubic-bezier(0.16,1,0.3,1) both"
            }}>
              Steeping with<br/>
              <span style={{color:m.accent}}>{identity}</span>
            </div>
            {/* Meta — hidden on mobile to avoid crowding */}
            {!isMob && (
              <div style={{
                fontFamily:F.m, fontSize:T.sm,
                letterSpacing:".18em", textTransform:"uppercase",
                color:m.text3, textAlign:"right",
                lineHeight:2.7, flexShrink:0, whiteSpace:"nowrap"
              }}>
                Nine Vessels<br/>Three Modes<br/>One Practice<br/>
                <span style={{color:m.text2}}>{m.short.toUpperCase()}</span>
              </div>
            )}
          </div>

          {/* ── VESSEL GRID ──────────────────────────
              Mobile:  1 column, vessels full-width, stacked
              Desktop: auto-fit minmax(280px, 1fr)
              Cup motif preserved via border-radius.
              No truncation, no collision.
          ─────────────────────────────────────── */}
          <section style={{
            padding:isMob
              ? `${T.s4} ${T.s4} ${T.s6}`
              : `${T.s5} ${T.s6} ${T.s7}`
          }}>
            <div style={{
              fontFamily:F.m, fontSize:isMob?"0.72rem":T.sm,
              letterSpacing:".28em", textTransform:"uppercase",
              color:m.text3, marginBottom:T.s4
            }}>
              Nine Vessels — Enter Your Steep
            </div>

            <div style={{
              display:"grid",
              gridTemplateColumns:isMob
                ? "1fr" // single col on mobile
                : "repeat(auto-fit, minmax(280px, 1fr))",
              gap:isMob ? T.s3 : T.s5
            }}>
              {VESSELS.map((v,i) => {
                const isOpen = openV===i;
                const anim = ["d1","d2","d3","d4"][i%4];
                return (
                  <div key={v.num}
                       onClick={()=>setOpenV(isOpen?null:i)}
                       style={{
                         cursor:"pointer",
                         // drift only on desktop — on mobile it just slides in
                         animation:!isMob?`${anim} ${22+i*2.2}s ease-in-out infinite`:undefined,
                         animationDelay:`${i*.5}s`
                       }}>
                    <div className="vcard" style={{
                      background:isOpen ? m.cardBg : m.surface,
                      border:`1px solid ${isOpen?m.accent:m.border}`,
                      // Cup shape — meaningful on desktop, softened on mobile
                      borderRadius:isMob
                        ? "12px 12px 28px 28px / 8px 8px 20px 20px"
                        : "44% 44% 42% 44% / 28% 28% 52% 52%",
                      padding:isMob
                        ? `${T.s4} ${T.s4} ${T.s4}`
                        : `${T.s5} ${T.s4} ${T.s6}`,
                      textAlign:"center",
                      minHeight:isMob?80:160,
                      display:"flex", flexDirection:isMob?"row":"column",
                      justifyContent:isMob?"space-between":"center",
                      alignItems:"center",
                      position:"relative", overflow:"hidden",
                      boxShadow:isOpen?`0 0 44px ${m.glow},0 12px 36px rgba(0,0,0,.4)`:"none",
                    }}>
                      {isOpen && <div style={{
                        position:"absolute",bottom:0,left:"18%",right:"18%",height:2,
                        background:`linear-gradient(to right,transparent,${m.accent},transparent)`,
                        opacity:.9
                      }}/>}

                      {/* Mobile layout: number left, name center, theme right */}
                      {isMob ? (
                        <>
                          <div style={{
                            fontFamily:F.m, fontSize:"0.65rem",
                            letterSpacing:".28em", textTransform:"uppercase",
                            color:m.accent, opacity:.8, flexShrink:0,
                            width:56, textAlign:"left"
                          }}>
                            {v.num}
                          </div>
                          <div style={{
                            fontFamily:F.d, fontSize:"0.95rem",
                            fontStyle:"italic", fontWeight:500,
                            color:m.text1, lineHeight:1.3,
                            flex:1, textAlign:"center",
                            padding:`0 ${T.s2}`
                          }}>
                            {v.name}
                          </div>
                          <div style={{
                            fontFamily:F.m, fontSize:"0.6rem",
                            letterSpacing:".1em", textTransform:"uppercase",
                            color:isOpen?m.accent:m.text3,
                            opacity:.7, flexShrink:0,
                            width:isMob?20:undefined
                          }}>
                            {isOpen?"↑":"↓"}
                          </div>
                        </>
                      ) : (
                        <>
                          <div style={{
                            fontFamily:F.m, fontSize:T.xs,
                            letterSpacing:".3em", textTransform:"uppercase",
                            color:m.accent, opacity:.8, marginBottom:T.s2
                          }}>Vessel {v.num}</div>
                          <div style={{
                            fontFamily:F.d, fontSize:"1rem",
                            fontStyle:"italic", fontWeight:500,
                            color:m.text1, lineHeight:1.38,
                            marginBottom:T.s2, wordBreak:"break-word"
                          }}>{v.name}</div>
                          <div style={{
                            fontFamily:F.m, fontSize:T.xs,
                            letterSpacing:".12em", textTransform:"uppercase",
                            color:m.accent, opacity:.5, lineHeight:1.55
                          }}>{v.theme}</div>
                        </>
                      )}
                    </div>

                    {/* Inline detail — expands below the card on mobile */}
                    {isMob && isOpen && (
                      <VesselDetail
                        v={v} m={m} isMob={isMob}
                        onClose={()=>setOpenV(null)}
                        onSage={()=>{
                          setSi(`I am steeping in Vessel ${v.num}: ${v.name}. ${v.interaction.split(".")[0]}.`);
                          sageRef.current?.scrollIntoView({behavior:"smooth"});
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Desktop vessel detail — below grid */}
          {!isMob && openV!==null && (
            <VesselDetail
              v={VESSELS[openV]} m={m} isMob={false}
              onClose={()=>setOpenV(null)}
              onSage={()=>{
                setSi(`I am steeping in Vessel ${VESSELS[openV].num}: ${VESSELS[openV].name}. ${VESSELS[openV].interaction.split(".")[0]}.`);
                sageRef.current?.scrollIntoView({behavior:"smooth"});
              }}
            />
          )}

          {/* ── SAGE ───────────────────────────── */}
          <section ref={sageRef} style={{
            borderTop:`1px solid ${m.border}`,
            padding:isMob
              ? `${T.s5} ${T.s4}`
              : `${T.s7} ${T.s6}`
          }}>
            <div style={{
              display:"flex", justifyContent:"space-between",
              alignItems:"baseline", marginBottom:T.s5
            }}>
              <h2 style={{
                fontFamily:F.d,
                fontSize:isMob?"1.5rem":"1.9rem",
                fontStyle:"italic", fontWeight:400
              }}>The Steeping Sage</h2>
              <span style={{
                fontFamily:F.m, fontSize:T.sm,
                letterSpacing:".16em", textTransform:"uppercase",
                color:m.text2
              }}>{m.short} Mode</span>
            </div>

            <div style={{
              background:m.cardBg, border:`1px solid ${m.borderHi}`,
              borderRadius:2,
              padding:isMob?`${T.s4} ${T.s4}`:`${T.s6} ${T.s7}`,
              marginBottom:T.s4, minHeight:110, position:"relative"
            }}>
              <div style={{
                position:"absolute",top:0,
                left:isMob?T.s4:T.s7, right:isMob?T.s4:T.s7,
                height:1,
                background:`linear-gradient(to right,transparent,${m.accent},transparent)`,
                opacity:.3
              }}/>
              <div style={{
                fontFamily:F.d,
                fontSize:isMob?"1.1rem":"clamp(1.15rem,2.2vw,1.6rem)",
                fontStyle:"italic", fontWeight:400,
                lineHeight:T.lhBody, color:m.text1,
                opacity:sageBusy?.3:1, transition:"opacity .4s"
              }}>{sageText||"·"}</div>
              <div style={{
                marginTop:T.s3, fontFamily:F.m,
                fontSize:"0.68rem", letterSpacing:".18em",
                textTransform:"uppercase", color:m.text2
              }}>— Steeping Sage, {m.short} Mode</div>
            </div>

            <div style={{
              display:"grid",
              gridTemplateColumns:"1fr auto",
              gap:T.s3, alignItems:"end"
            }}>
              <textarea value={sageIn} onChange={e=>setSi(e.target.value)}
                        onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendSage();}}}
                        onInput={e=>{e.target.style.height="auto";e.target.style.height=Math.min(e.target.scrollHeight,140)+"px";}}
                        placeholder="What are you steeping with today…"
                        rows={1}
                        style={{
                          background:m.surface, border:`1px solid ${m.border}`,
                          borderRadius:2, padding:`${T.s3} ${T.s4}`,
                          fontSize:"1.1rem", fontStyle:"italic",
                          color:m.text1, outline:"none", resize:"none",
                          minHeight:56, maxHeight:140,
                          caretColor:m.accent, lineHeight:1.55
                        }}/>
              <button onClick={sendSage} style={{
                fontFamily:F.m, fontSize:T.sm, letterSpacing:".18em",
                textTransform:"uppercase",
                padding:`${T.s3} ${isMob?T.s3:T.s5}`,
                minHeight:48,
                border:`1px solid ${m.borderHi}`,
                background:m.ctaFilled?m.accent:"none",
                color:m.ctaFilled?m.bg:m.accent,
                cursor:"pointer", borderRadius:1,
                alignSelf:"end", whiteSpace:"nowrap"
              }}>Steep</button>
            </div>
          </section>

          {/* ── THRESHOLD ──────────────────────── */}
          {offer && (
            <section style={{
              borderTop:`1px solid ${m.border}`,
              padding:isMob?`${T.s5} ${T.s4}`:`${T.s7} ${T.s6}`,
              animation:"fadeUp .6s cubic-bezier(0.16,1,0.3,1) both"
            }}>
              <div style={{
                fontFamily:F.m, fontSize:T.sm,
                letterSpacing:".24em", textTransform:"uppercase",
                color:m.text3, marginBottom:T.s4
              }}>The Practice Deepens — When You Are Ready</div>
              <div style={{
                display:"grid",
                gridTemplateColumns:isMob?"1fr":"1fr 1fr",
                gap:1, background:m.border, border:`1px solid ${m.border}`
              }}>
                {[
                  {eye:"Self-Guided · Entry",title:"The 7-Day Guidebook",price:"$44",
                   desc:"The complete seven steeps as home practice. Ritual integration, invocations, and journaling architecture.",
                   cta:"Begin the Journey →",url:"https://thealienschool.com",primary:true},
                  {eye:"Guided · Immersive",title:"The 7-Week Journey",price:"$777",
                   desc:"Weekly 80-minute sessions with Kamau. Walking the full path with a guide who has already walked it.",
                   cta:"Schedule a Conversation →",url:"https://calendly.com/bethecandle/an-overview",primary:false}
                ].map((o,i)=>(
                  <div key={i} style={{background:m.bg,padding:isMob?`${T.s5} ${T.s4}`:`${T.s7} ${T.s6}`}}>
                    <div style={{fontFamily:F.m,fontSize:T.sm,letterSpacing:".2em",
                                 textTransform:"uppercase",color:m.accent,opacity:.8,marginBottom:T.s3}}>{o.eye}</div>
                    <div style={{fontFamily:F.d,fontSize:"1.6rem",fontStyle:"italic",
                                 color:m.text1,marginBottom:T.s3,lineHeight:1.2}}>{o.title}</div>
                    <div style={{fontFamily:F.d,fontSize:"2.4rem",fontWeight:500,
                                 color:m.accent,marginBottom:T.s4,lineHeight:1}}>{o.price}</div>
                    <div style={{fontFamily:F.b,fontSize:T.base,fontStyle:"italic",
                                 color:m.text2,lineHeight:T.lhBody,marginBottom:T.s5}}>{o.desc}</div>
                    <a href={o.url} target="_blank" rel="noreferrer" style={{
                      fontFamily:F.m,fontSize:T.sm,letterSpacing:".18em",
                      textTransform:"uppercase",
                      color:o.primary?m.bg:m.accent,textDecoration:"none",
                      padding:`${T.s3} ${T.s4}`,minHeight:48,
                      display:"inline-flex",alignItems:"center",
                      border:`1px solid ${m.accent}`,
                      background:o.primary?m.accent:"none"
                    }}>{o.cta}</a>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── FOOTER ─────────────────────────── */}
          <footer style={{
            borderTop:`1px solid ${m.border}`,
            padding:isMob?`${T.s5} ${T.s4}`:`${T.s6} ${T.s6}`,
            display:"flex",
            flexDirection:isMob?"column":"row",
            justifyContent:"space-between",
            alignItems:isMob?"flex-start":"flex-start",
            gap:T.s4
          }}>
            <div style={{
              fontFamily:F.d, fontSize:T.sm,
              fontStyle:"italic", color:m.text2, maxWidth:360, lineHeight:1.9
            }}>
              "There is something about me and Tea. We enjoy each other,
              and we know how to make each other better."<br/>— KzA
            </div>
            <div style={{
              fontFamily:F.m, fontSize:T.sm,
              letterSpacing:".15em", textTransform:"uppercase",
              color:m.text3,
              display:"flex", flexDirection:"column",
              gap:T.s3,
              textAlign:isMob?"left":"right"
            }}>
              <span>Kamau Zuberi Akabueze</span>
              {isMob && (
                <span style={{color:m.text3, opacity:.7}}>THE ÅLïEN SCöÕL</span>
              )}
              <a href="https://thealienschool.com" target="_blank" rel="noreferrer"
                 style={{color:m.accent,textDecoration:"none"}}>thealienschool.com</a>
              <a href="https://calendly.com/bethecandle/an-overview" target="_blank" rel="noreferrer"
                 style={{color:m.accent,textDecoration:"none"}}>Schedule a Steep</a>
            </div>
          </footer>
        </div>
      )}

      {/* ══════════════════════════════════════════
          MOBILE BOTTOM TAB BAR
          Mode indicator + quick Sage access
          Only shown in portal phase
      ══════════════════════════════════════════ */}
      {isMob && phase==="portal" && (
        <div style={{
          position:"fixed", bottom:0, left:0, right:0,
          zIndex:300, height:T.tabH,
          background:m.surface,
          borderTop:`1px solid ${m.border}`,
          display:"flex", alignItems:"center",
          justifyContent:"space-between",
          padding:`0 ${T.s4}`,
          paddingBottom:"env(safe-area-inset-bottom,0px)"
        }}>
          {/* Mode indicator → opens sheet */}
          <button onClick={()=>setModeSheet(true)} style={{
            display:"flex", flexDirection:"column",
            alignItems:"center", gap:3,
            background:"none", border:"none",
            cursor:"pointer", padding:`${T.s2} ${T.s3}`
          }}>
            <span style={{
              fontFamily:F.m, fontSize:"0.6rem",
              letterSpacing:".18em", textTransform:"uppercase",
              color:m.text3
            }}>Mode</span>
            <span style={{
              fontFamily:F.m, fontSize:"0.7rem",
              letterSpacing:".12em", textTransform:"uppercase",
              color:m.accent
            }}>{m.icon} {m.short}</span>
          </button>

          {/* Center — identity echo */}
          <div style={{
            fontFamily:F.d, fontSize:"0.85rem",
            fontStyle:"italic", color:m.text2,
            textAlign:"center", maxWidth:160,
            overflow:"hidden", whiteSpace:"nowrap",
            textOverflow:"ellipsis"
          }}>
            {identity}
          </div>

          {/* Sage quick-jump */}
          <button onClick={()=>sageRef.current?.scrollIntoView({behavior:"smooth"})}
                  style={{
                    display:"flex", flexDirection:"column",
                    alignItems:"center", gap:3,
                    background:"none", border:"none",
                    cursor:"pointer", padding:`${T.s2} ${T.s3}`
                  }}>
            <span style={{
              fontFamily:F.m, fontSize:"0.6rem",
              letterSpacing:".18em", textTransform:"uppercase",
              color:m.text3
            }}>Sage</span>
            <span style={{
              fontFamily:F.m, fontSize:"0.7rem",
              letterSpacing:".12em", textTransform:"uppercase",
              color:m.accent
            }}>↓</span>
          </button>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════
// VESSEL DETAIL — shared by mobile (inline) + desktop
// ════════════════════════════════════════════════════
function VesselDetail({v, m, isMob, onClose, onSage}) {
  return (
    <div style={{
      background:m.cardBg,
      border:`1px solid ${m.border}`,
      borderRadius:isMob?"0 0 12px 12px":"2px",
      padding:isMob?`${T.s4} ${T.s4}`:`${T.s6} ${T.s6}`,
      marginTop:isMob?2:0,
      animation:"fadeUp .4s cubic-bezier(0.16,1,0.3,1) both",
      ...(isMob ? {} : {
        maxWidth:820, margin:"0 auto",
        borderTop:`1px solid ${m.border}`
      })
    }}>
      {!isMob && (
        <div style={{
          display:"flex", justifyContent:"space-between",
          alignItems:"flex-start", marginBottom:T.s3
        }}>
          <span style={{
            fontFamily:F.m, fontSize:T.sm,
            letterSpacing:".22em", textTransform:"uppercase",
            color:m.accent, opacity:.8
          }}>Vessel {v.num} — {v.theme}</span>
          <button onClick={onClose} style={{
            fontFamily:F.m, fontSize:T.sm,
            letterSpacing:".18em", textTransform:"uppercase",
            color:m.text3, background:"none", border:"none",
            cursor:"pointer", minHeight:44, padding:`${T.s2} ${T.s3}`
          }}>Close ×</button>
        </div>
      )}

      <h2 style={{
        fontFamily:F.d,
        fontSize:isMob?"1.4rem":"clamp(28px,3.5vw,50px)",
        fontStyle:"italic", fontWeight:400, color:m.text1,
        lineHeight:1.15, marginBottom:T.s4
      }}>{v.name}</h2>

      <p style={{
        fontFamily:F.b, fontSize:isMob?"1rem":"1.25rem",
        lineHeight:T.lhBody, color:m.text2,
        marginBottom:T.s4
      }}>{v.body}</p>

      {v.reflection && (
        <div style={{borderTop:`1px solid ${m.border}`, padding:`${T.s3} 0`}}>
          <div style={{
            fontFamily:F.m, fontSize:T.sm,
            letterSpacing:".22em", textTransform:"uppercase",
            color:m.accent, opacity:.8, marginBottom:T.s2
          }}>Reflection</div>
          <div style={{
            fontFamily:F.b, fontSize:isMob?"0.95rem":"1.2rem",
            lineHeight:T.lhBody, color:m.text2
          }}>{v.reflection}</div>
        </div>
      )}

      {v.interaction && (
        <div style={{borderTop:`1px solid ${m.border}`, padding:`${T.s3} 0`}}>
          <div style={{
            fontFamily:F.m, fontSize:T.sm,
            letterSpacing:".22em", textTransform:"uppercase",
            color:m.accent, opacity:.8, marginBottom:T.s2
          }}>Interaction</div>
          <div style={{
            fontFamily:F.b, fontSize:isMob?"0.95rem":"1.2rem",
            lineHeight:T.lhBody, color:m.text2
          }}>{v.interaction}</div>
        </div>
      )}

      {v.invocation && (
        <div style={{
          borderTop:`1px solid ${m.border}`,
          borderBottom:`1px solid ${m.border}`,
          padding:`${T.s4} 0`, margin:`${T.s2} 0`,
          textAlign:"center",
          fontFamily:F.d, fontSize:"1.1rem",
          fontStyle:"italic", color:m.accent, lineHeight:2.2
        }}>
          {v.invocation.split("\n").map((l,i)=><div key={i}>{l}</div>)}
        </div>
      )}

      {v.cta && (
        <button onClick={onSage} style={{
          marginTop:T.s3,
          fontFamily:F.m, fontSize:T.sm,
          letterSpacing:".2em", textTransform:"uppercase",
          padding:`${T.s3} ${T.s4}`, minHeight:48,
          border:`1px solid ${m.borderHi}`,
          background:"none", color:m.accent,
          cursor:"pointer", borderRadius:1,
          width:isMob?"100%":"auto"
        }}>{v.cta}</button>
      )}
    </div>
  );
}
