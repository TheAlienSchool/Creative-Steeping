import React, { useEffect } from 'react';

// Incandescent palette — the welcome mode, standalone, no portal state required
const m = {
  bg: "#090500",
  surface: "#1c1000",
  cardBg: "#271508",
  accent: "#d4922a",
  text1: "#fff0d9",
  text2: "#a88b68"
};

const Section = ({ label }) => (
  <div style={{
    fontSize: '0.62rem', letterSpacing: '0.28em', textTransform: 'uppercase',
    color: m.accent, marginBottom: '14px', opacity: 0.8,
    fontFamily: "'DM Mono', monospace"
  }}>{label}</div>
);

const Body = ({ children, large, last }) => (
  <p style={{
    fontFamily: "'Atkinson Hyperlegible', 'Georgia', sans-serif",
    fontSize: large ? '0.95rem' : '0.875rem',
    lineHeight: large ? 1.9 : 1.8,
    color: large ? m.text1 : m.text2,
    marginBottom: last ? 0 : '20px'
  }}>{children}</p>
);

const Rule = () => (
  <div style={{ width: '100%', height: '1px', background: `${m.accent}22`, margin: '36px 0' }} />
);

const Quote = ({ children }) => (
  <div style={{
    borderLeft: `2px solid ${m.accent}50`,
    paddingLeft: '18px', marginBottom: '24px'
  }}>
    <p style={{
      fontFamily: "'Atkinson Hyperlegible', 'Georgia', sans-serif",
      fontSize: '0.9rem', lineHeight: 1.85,
      color: m.text1, margin: 0, fontStyle: 'italic'
    }}>{children}</p>
  </div>
);

const Testimonial = ({ text, name, role }) => (
  <div style={{ borderLeft: `1px solid ${m.accent}35`, paddingLeft: '16px', marginBottom: '22px' }}>
    <p style={{
      fontFamily: "'Atkinson Hyperlegible', 'Georgia', sans-serif",
      fontSize: '0.875rem', lineHeight: 1.75,
      color: m.text2, margin: '0 0 8px 0', fontStyle: 'italic'
    }}>"{text}"</p>
    <div style={{
      fontFamily: "'DM Mono', monospace", fontSize: '0.62rem',
      letterSpacing: '0.15em', textTransform: 'uppercase',
      color: m.accent, opacity: 0.8
    }}>
      {name} <span style={{ opacity: 0.5 }}>— {role}</span>
    </div>
  </div>
);

export function AboutPage() {
  useEffect(() => {
    document.title = 'About Creative Steeping — THE ÅLIËN SCÖÕL';
    document.documentElement.style.background = m.bg;
    document.body.style.background = m.bg;
    return () => {
      document.documentElement.style.background = '';
      document.body.style.background = '';
    };
  }, []);

  return (
    <div style={{
      background: m.bg,
      minHeight: '100dvh',
      color: m.text2,
      fontFamily: "'DM Mono', monospace"
    }}>
      {/* Top bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: `${m.bg}ee`,
        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${m.accent}18`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 clamp(20px, 5vw, 48px)', height: '56px'
      }}>
        <a href="/" style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: '0.7rem', letterSpacing: '0.2em',
          textTransform: 'uppercase', color: m.text2,
          textDecoration: 'none', opacity: 0.7,
          transition: 'opacity 0.3s'
        }}
          onMouseEnter={e => e.currentTarget.style.opacity = 1}
          onMouseLeave={e => e.currentTarget.style.opacity = 0.7}>
          ← creativesteeping.com
        </a>
        <a href="https://calendly.com/bethecandle/1-1-w-kza"
          target="_blank" rel="noopener noreferrer" style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: '0.65rem', letterSpacing: '0.18em',
            textTransform: 'uppercase', color: m.accent,
            textDecoration: 'none', opacity: 0.8,
            transition: 'opacity 0.3s'
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = 1}
          onMouseLeave={e => e.currentTarget.style.opacity = 0.8}>
          Schedule with Kamau ↗
        </a>
      </div>

      {/* Hero */}
      <div style={{
        maxWidth: '720px', margin: '0 auto',
        padding: 'clamp(48px, 10vw, 96px) clamp(24px, 6vw, 48px) 0'
      }}>
        <div style={{
          fontFamily: "'Playfair Display', 'Georgia', serif",
          fontSize: 'clamp(2rem, 8vw, 3.2rem)',
          fontStyle: 'italic', color: m.text1,
          lineHeight: 1.1, marginBottom: '10px'
        }}>
          CREÅTIVE<br />STEEPING
        </div>
        <div style={{
          fontSize: '0.65rem', letterSpacing: '0.3em',
          textTransform: 'uppercase', color: m.accent,
          marginBottom: '16px', opacity: 0.8
        }}>
          A Journey to the Essence of Your Flavor
        </div>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '56px', alignItems: 'center' }}>
          <div style={{ width: '40px', height: '1px', background: m.accent, opacity: 0.4 }} />
          <div style={{
            fontSize: '0.62rem', letterSpacing: '0.18em',
            textTransform: 'uppercase', color: m.text2, opacity: 0.5
          }}>
            THE ÅLIËN SCÖÕL for Creative Thinking
          </div>
        </div>

        {/* ─── The Practice ─── */}
        <Body large>
          Creative Steeping is an immersive, experiential in-venture — a hyper-connective journaling practice designed for the fierce creative nature within you. It is a ritual, a journey, and a veneration of your human spirit in pursuit of self-awareness, creative expression, and identity.
        </Body>
        <Body large last>
          The portal asks one question and holds you while you answer it across seven dimensions of your creative self: <em style={{ color: m.text1 }}>Where Do You Find Your Self?</em>
        </Body>

        <Rule />

        {/* ─── The Nature of Steeping ─── */}
        <Section label="The Nature of Steeping" />
        <Body large>
          Every variety of tea — white, green, oolong, black, the pu-erh aged for twenty years — comes from a single plant: <em>Camellia sinensis</em>. The differences between a delicate white and a dark, fermented pu-erh are entirely in the process: how the leaf is dried, how long it is allowed to oxidize, whether it ferments over seasons. Same origin. Six entirely different expressions.
        </Body>
        <Body>
          The word <em>steep</em> carries the transformation inside it — from the Old Norse <em>steypa</em>, "to pour, to cast down, to plunge." Steeping is not passive waiting. It is a precipitation of one state into another through immersion and time.
        </Body>
        <Body>
          When hot water meets a dried tea leaf, five elements convene: the leaf (wood), the water, the heat (fire), the vessel (earth and metal), and the aromatic compounds that rise as the steep opens. Chinese tea ceremony maps this deliberately — in Wuxing philosophy, a well-arranged steep holds all five elements in active relationship. The process is a complete ecology.
        </Body>
        <Body>
          What happens in the water is precise. L-theanine — an amino acid found almost exclusively in <em>Camellia sinensis</em> among all plants — releases first, at lower temperatures (70–80°C). L-theanine increases alpha-band oscillatory brain activity (8–14 Hz): the state associated with calm alertness, relaxed attention, and creative cognition. Push the temperature higher and the catechins follow — brightness, astringency, the fuller body of the leaf. The art of steeping is knowing what to call forward, and when.
        </Body>
        <Body>
          The dried leaf does not disappear into the water. It opens. It releases what it has been carrying in compressed form. And it can be re-steeped — each infusion a different layer of the same source, lighter and more luminous with each pass.
        </Body>
        <Body>
          The traditional Yixing clay teapot of Chinese practice carries this further. Unglazed and micro-porous, it absorbs tea oils over months and years of use. The clay seasons — it becomes a record of every steep it has held. A well-tended Yixing pot, after years of practice, will scent plain water. The vessel does not remain neutral. It participates. It returns something.
        </Body>
        <Body>
          Sen no Rikyū, the 16th-century Japanese tea master, named the practice's destination simply: <em>wa, kei, sei, jaku</em> — harmony, respect, purity, tranquility. <em>Jaku</em>, tranquility, he described as the result of practicing the first three: a dynamic, profound stillness — a state in which the ego is dissolved. The tea does not make this happen. The practice does.
        </Body>
        <Body last>
          Creative Steeping draws from this same understanding. Each of the Seven Steeps is a temperature — a particular depth of engagement that calls forward something specific from you that the previous steep could not reach. The sequence is the practice. You are both the leaf and the water.
        </Body>

        <Rule />

        {/* ─── The Seven Steeps ─── */}
        <Section label="The Seven Steeps" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '12px' }}>
          {[
            ['01', 'Essence of My Being', 'Your Core Essence'],
            ['02', 'Mosaic of Experience', 'Your Creative Journey to Now'],
            ['03', 'Summits of Aspiration', 'Your Goals and Aspirations'],
            ['04', 'Mirror of Self-Perception', 'Your Perception of Self'],
            ['05', 'Labyrinth of Challenges', 'Your Current Challenges'],
            ['06', 'Conclave of Voices', 'Your Audience and Your Echo'],
            ['07', 'Crown Jewels of Individuality', 'Your Unique Offerings to The World'],
          ].map(([num, title, sub]) => (
            <div key={num} style={{ display: 'flex', alignItems: 'baseline', gap: '14px' }}>
              <span style={{
                color: m.accent, fontSize: '0.62rem',
                flexShrink: 0, opacity: 0.55, minWidth: '22px',
                fontFamily: "'DM Mono', monospace"
              }}>{num}</span>
              <span style={{
                fontFamily: "'Atkinson Hyperlegible', 'Georgia', sans-serif",
                fontSize: '0.875rem', color: m.text1, lineHeight: 1.4
              }}>
                {title}
                <span style={{ color: m.text2, opacity: 0.55, fontSize: '0.78rem' }}> — {sub}</span>
              </span>
            </div>
          ))}
        </div>

        <Rule />

        {/* ─── How the Portal Works ─── */}
        <Section label="How the Portal Works" />
        {[
          {
            name: 'The Hexagong',
            icon: '⬡',
            body: 'The six-sided vessel at the center of the experience. Each face of the Hexagong is a Steep — a day, a dimension, a door. As you steep, it illuminates. Vessels unlock through depth of practice, not passage of time. Like the Yixing clay teapot that seasons with each use, the Hexagong is shaped by your returning.'
          },
          {
            name: 'The Sage',
            icon: '◈',
            body: 'The portal\'s behavioral intelligence. The Sage reads stillness, typing rhythm, and the depth of what you write — then reflects back a response tuned to exactly where you are in your journey. A practicing witness to your unfolding.'
          },
          {
            name: 'The Sonnet Engine',
            icon: '♪',
            body: 'As you write, each keystroke finds its frequency — a tone tuned to your current Steep. Every tone arises from your writing and returns to you as vibration. In acoustics, a vibration only matters when it transfers energy to something else. This one transfers yours back.'
          },
          {
            name: 'Me in 5D',
            icon: '◉',
            body: 'A somatic self-assessment portal embedded within the practice. Five dimensions — Resonance, Stillness, Clarity, Depth, Alignment — each measured and rendered as a living pentagonal map of your creative state. Moving a dimension slider plays a pentatonic glissando. The shape you make is the shape you are.'
          },
        ].map(({ name, icon, body }) => (
          <div key={name} style={{ display: 'flex', gap: '18px', marginBottom: '26px', alignItems: 'flex-start' }}>
            <span style={{ color: m.accent, fontSize: '1rem', flexShrink: 0, opacity: 0.7, marginTop: '2px' }}>{icon}</span>
            <div>
              <div style={{
                fontFamily: "'DM Mono', monospace", fontSize: '0.72rem',
                letterSpacing: '0.18em', textTransform: 'uppercase',
                color: m.text1, marginBottom: '7px'
              }}>{name}</div>
              <Body last>{body}</Body>
            </div>
          </div>
        ))}

        <Rule />

        {/* ─── The Sound of Becoming ─── */}
        <Section label="The Sound of Becoming" />
        <Quote>"When you write and hear your writing as music simultaneously, you are engaging more neural territory than any other single human activity."</Quote>
        <Body>
          The Sonnet Engine generates music <em>from</em> you, not for you. Research in music neuroscience confirms that when the music is yours — generated from your own behavioral and emotional signature — the brain releases its own natural opioids and the immune system responds. There is no closer relationship to individual musical preference than music that emerges from your own creative state, in real time. And if you are holding tea as you practice: L-theanine, the amino acid unique to <em>Camellia sinensis</em>, raises alpha-band brain activity (8–14Hz) — the same state the Sonnet Engine is tuned to meet. The leaf and the engine work in the same register.
        </Body>
        <Body>
          The engine operates across three harmonic systems: a C Major Pentatonic in A=444Hz tuning (where C5 lands at 528Hz, the Miracle Tone), a 174Hz Solfeggio Foundation scale (the frequency associated with pain relief and grounding), and a 176Hz Deep Desert scale (KzA's own tuning framework). Your steep determines which system holds you.
        </Body>
        <Body last>
          For practitioners who feel creatively blocked, the portal holds another entrance: when the written word stills, the sonic current moves. Sound before language. Hearing before knowing. The practice creates the conditions its own content requires.
        </Body>

        <Rule />

        {/* ─── The Steeperverse ─── */}
        <Section label="The Steeperverse" />
        <Body>
          Creative Steeping is a solo practice that becomes richer in community. The Steeperverse is the gathering place — where Steepers share reflections, hold space for each other's unfolding, and witness the mythic narratives of their peers.
        </Body>
        <Body last>
          Community Steeping unlocks something the solo practice cannot — the recognition that your inner landscape, when shared, resonates. What you thought was yours alone turns out to be the room's. This is the deepest offer of the Conclave of Voices: not that your audience finds you, but that you find each other.
        </Body>

        <Rule />

        {/* ─── Voices ─── */}
        <Section label="Voices from the Practice" />
        <Testimonial
          text="Epiphanies unfolded, and the mythic narrative of my own genius brought me to tears. I experienced myself as a reliable source for wisdom."
          name="Sallomé Hralima"
          role="Writer, Filmmaker"
        />
        <Testimonial
          text="The only thing standing between you and your next big idea is the courage to do the deep work. Creative Steeping gives you a framework for that courage."
          name="Lisa Heinsdale"
          role="Creative Synthesizer"
        />
        <Testimonial
          text="What sets you apart does not set you apart from others — it magnetizes others to the unique fragrance of your song."
          name="Sylvia Baffour"
          role="Emotional Intelligence Expert"
        />

        <Rule />

        {/* ─── The Architect ─── */}
        <Section label="The Architect" />
        <Body>
          Kamau Zuberi Akabueze (KzA) — founder of THE ÅLIËN SCÖÕL for Creative Thinking. Over 25 years fusing creativity and strategy, he has dedicated his life to uplifting the creative spirit in everyone he encounters. Creative Steeping is the living distillation of that practice.
        </Body>
        <Body last>
          KzA teaches that creativity is not a talent — it is a capacity. The Steeping Space exists to cultivate that capacity through ritual, resonance, and radical self-encounter.
        </Body>

        <Rule />

        {/* ─── CTA ─── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingBottom: 'clamp(64px, 12vw, 120px)' }}>
          <a href="/"
            style={{
              display: 'inline-block',
              fontFamily: "'DM Mono', monospace",
              fontSize: '0.78rem', letterSpacing: '0.2em',
              textTransform: 'uppercase', color: m.bg,
              background: m.accent, textDecoration: 'none',
              padding: '14px 28px', textAlign: 'center',
              transition: 'opacity 0.3s',
              maxWidth: '280px'
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = 0.85}
            onMouseLeave={e => e.currentTarget.style.opacity = 1}>
            Begin Your Steep ↗
          </a>
          <a href="https://thealienschool.com" target="_blank" rel="noopener noreferrer" style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: '0.72rem', color: m.text2, textDecoration: 'none',
            letterSpacing: '0.12em', textTransform: 'uppercase',
            borderBottom: `1px solid ${m.accent}35`, paddingBottom: '3px',
            display: 'inline-block', maxWidth: 'max-content',
            transition: 'border-color 0.3s'
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = m.accent}
            onMouseLeave={e => e.currentTarget.style.borderColor = `${m.accent}35`}>
            THE ÅLIËN SCÖÕL for Creative Thinking ↗
          </a>
          <a href="https://calendly.com/bethecandle/1-1-w-kza" target="_blank" rel="noopener noreferrer" style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: '0.7rem', color: m.text2, textDecoration: 'none',
            letterSpacing: '0.12em', textTransform: 'uppercase',
            borderBottom: `1px solid ${m.accent}25`, paddingBottom: '3px',
            display: 'inline-block', maxWidth: 'max-content', opacity: 0.7,
            transition: 'all 0.3s'
          }}
            onMouseEnter={e => { e.currentTarget.style.opacity = 1; e.currentTarget.style.borderColor = `${m.accent}60`; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = 0.7; e.currentTarget.style.borderColor = `${m.accent}25`; }}>
            Schedule a Steeping with Kamau ↗
          </a>
        </div>

        {/* Footer mark */}
        <div style={{
          borderTop: `1px solid ${m.accent}15`,
          paddingTop: '28px', paddingBottom: '48px',
          fontFamily: "'DM Mono', monospace", fontSize: '0.6rem',
          letterSpacing: '0.18em', textTransform: 'uppercase',
          color: m.text2, opacity: 0.4,
          display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px'
        }}>
          <span>© THE ÅLIËN SCÖÕL</span>
          <span>creativesteeping.com</span>
        </div>
      </div>
    </div>
  );
}
