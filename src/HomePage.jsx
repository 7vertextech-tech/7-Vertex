import React, { useState } from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom';
import logo from './assets/logo.jpeg';

// ⚠️ STEP 1: Sign up at https://formspree.io (free)
// STEP 2: Create a new form, copy its endpoint URL
// STEP 3: Paste it below, replacing YOUR_FORM_ID
const FORM_ENDPOINT = 'https://formspree.io/f/mgawrqjg';

const ALL_SERVICES = [
  'Website Development',
  'Mobile App Development',
  'Backend Development / API',
  'E-Commerce Development',
  'UI/UX Design',
  'Enterprise Database Solutions (Oracle APEX)',
  'SEO & Digital Marketing',
  'Video Editing',
  'AI Automation',
  'Content Writing',
  'Other',
];

async function sendToFormspree(payload) {
  const res = await fetch(FORM_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Submission failed');
  return res.json();
}

function HomePage() {
    const navigate = useNavigate();
      const [menuOpen, setMenuOpen] = useState(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  // ---- Get a Quote form state ----
  const [quote, setQuote] = useState({
    name: '',
    email: '',
    phone: '',
    services: [],
    budget: '',
    message: '',
  });
  const [quoteErrors, setQuoteErrors] = useState({});
  const [quoteStatus, setQuoteStatus] = useState('idle'); // idle | sending | sent | error

  // ---- Contact form state ----
  const [contact, setContact] = useState({ name: '', email: '', message: '' });
  const [contactErrors, setContactErrors] = useState({});
  const [contactStatus, setContactStatus] = useState('idle');

  const closeMenu = () => setMenuOpen(false);

  const scrollTo = (id) => {
    closeMenu();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const preselectService = (serviceName) => {
    setQuote((prev) => ({
      ...prev,
      services: prev.services.includes(serviceName)
        ? prev.services
        : [...prev.services, serviceName],
    }));
    setQuoteModalOpen(true);
  };

  const toggleService = (service) => {
    setQuote((prev) => {
      const has = prev.services.includes(service);
      return {
        ...prev,
        services: has
          ? prev.services.filter((s) => s !== service)
          : [...prev.services, service],
      };
    });
  };

  const validateQuote = () => {
    const errs = {};
    if (!quote.name.trim()) errs.name = 'Name is required';
    if (!quote.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(quote.email)) {
      errs.email = 'Enter a valid email';
    }
    if (quote.services.length === 0) errs.services = 'Select at least one service';
    return errs;
  };

  const submitQuote = async (e) => {
    e.preventDefault();
    const errs = validateQuote();
    setQuoteErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setQuoteStatus('sending');
    try {
      await sendToFormspree({
        formType: 'Quote Request',
        name: quote.name,
        email: quote.email,
        phone: quote.phone || '-',
        services: quote.services.join(', '),
        budget: quote.budget || 'Not specified',
        message: quote.message,
        _subject: `Quote Request from ${quote.name}`,
      });
      setQuoteStatus('sent');
      setQuote({ name: '', email: '', phone: '', services: [], budget: '', message: '' });
    } catch (err) {
      setQuoteStatus('error');
    }
  };

  const validateContact = () => {
    const errs = {};
    if (!contact.name.trim()) errs.name = 'Name is required';
    if (!contact.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(contact.email)) {
      errs.email = 'Enter a valid email';
    }
    if (!contact.message.trim()) errs.message = 'Message is required';
    return errs;
  };

  const submitContact = async (e) => {
    e.preventDefault();
    const errs = validateContact();
    setContactErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setContactStatus('sending');
    try {
      await sendToFormspree({
        formType: 'Contact Message',
        name: contact.name,
        email: contact.email,
        message: contact.message,
        _subject: `Message from ${contact.name} via 7Vertex site`,
      });
      setContactStatus('sent');
      setContact({ name: '', email: '', message: '' });
    } catch (err) {
      setContactStatus('error');
    }
  };

  return (
    <div className="app">

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo-box" onClick={() => scrollTo('home')} role="button" tabIndex={0}>
          <img src={logo} alt="7Vertex" className="logo-img" />
          <span className="logo-text">7<span>VERTEX</span></span>
        </div>

        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <button className="nav-link-btn" onClick={() => scrollTo('home')}>Home</button>
          <button className="nav-link-btn" onClick={() => scrollTo('services')}>Services</button>
          <button className="nav-link-btn" onClick={() => scrollTo('tech')}>Technologies</button>
          <button className="nav-link-btn" onClick={() => scrollTo('portfolio')}>Portfolio</button>
          <button className="nav-link-btn" onClick={() => scrollTo('about')}>About</button>
          <button className="nav-link-btn" onClick={() => { closeMenu(); setContactModalOpen(true); }}>Contact</button>
          <button
            className="nav-button mobile-only"
            onClick={() => { closeMenu(); setQuoteModalOpen(true); }}
          >
            Get a Quote
          </button>
        </div>

        <button className="nav-button desktop-only" onClick={() => setQuoteModalOpen(true)}>Get a Quote</button>

        <button
          className={`menu-toggle ${menuOpen ? 'active' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      {/* HERO */}
      <section className="hero" id="home">
        <div className="hero-content">
          <p className="hero-small">DIGITAL SOLUTIONS AGENCY</p>
          <h1>
            Build Beyond <span>Limits.</span>
          </h1>
          <p className="hero-text">
            7Vertex builds websites, apps, and digital growth systems for
            businesses ready for their next vertex — from idea to launch.
          </p>

          <div className="hero-buttons">
            <button className="primary-btn" onClick={() => setQuoteModalOpen(true)}>Start a Project</button>
            <button className="secondary-btn" onClick={() => scrollTo('portfolio')}>Explore Work</button>
          </div>
        </div>

     <div className="hero-graphic" aria-hidden="true">
  <svg viewBox="0 0 400 400" className="vertex-svg">
    <defs>
      <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
  <stop offset="0%" stopColor="#00d2ff" stopOpacity="0.65" />
  <stop offset="45%" stopColor="#00d2ff" stopOpacity="0.22" />
  <stop offset="100%" stopColor="#00d2ff" stopOpacity="0" />
</radialGradient>
<linearGradient id="shapeFill" x1="0%" y1="0%" x2="100%" y2="100%">
  <stop offset="0%" stopColor="#00d2ff" stopOpacity="0.16" />
  <stop offset="100%" stopColor="#a855f7" stopOpacity="0.1" />
</linearGradient>
<filter id="nodeGlow" x="-200%" y="-200%" width="500%" height="500%">
  <feGaussianBlur stdDeviation="3.5" result="blur" />
  <feMerge>
    <feMergeNode in="blur" />
    <feMergeNode in="SourceGraphic" />
  </feMerge>
</filter>
    </defs>

    <circle cx="200" cy="200" r="170" fill="url(#coreGlow)" />

    {/* Scattered background stars — gives it depth like the reference */}
    <g className="vertex-stars">
      {[
        [40,60],[70,340],[350,80],[365,300],[30,200],[200,30],
        [370,180],[110,370],[290,40],[50,120],[330,340],[20,280],
        [250,370],[380,240],[130,20]
      ].map(([x,y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.8 : 1} className="vertex-star" style={{ animationDelay: `${i * 0.3}s` }} />
      ))}
    </g>

    {/* Dotted concentric circles — like the reference image */}
    <circle cx="200" cy="200" r="80" className="vertex-dotted-circle" />
    <circle cx="200" cy="200" r="115" className="vertex-dotted-circle vertex-dotted-circle-alt" />

    {/* Outer rotating heptagon — points now match the lines/nodes/spokes below exactly */}
    <g className="vertex-rotate">
      {/* Double outer covering — outer ring + main shape */}
      <polygon
        points="200,42 322,102 353,232 268,342 132,342 47,232 78,102"
        className="vertex-shape-outer"
      />
      <polygon
        points="200,55 313,110 341,232 263,331 137,331 59,232 87,110"
        className="vertex-shape"
      />

      <line x1="200" y1="55" x2="313" y2="110" className="vertex-line" />
      <line x1="313" y1="110" x2="341" y2="232" className="vertex-line" />
      <line x1="341" y1="232" x2="263" y2="331" className="vertex-line" />
      <line x1="263" y1="331" x2="137" y2="331" className="vertex-line" />
      <line x1="137" y1="331" x2="59" y2="232" className="vertex-line" />
      <line x1="59" y1="232" x2="87" y2="110" className="vertex-line" />
      <line x1="87" y1="110" x2="200" y2="55" className="vertex-line" />

      {/* Full internal mesh — every vertex connects to every other vertex, like the reference */}
      {(() => {
        const pts = [[200,55],[313,110],[341,232],[263,331],[137,331],[59,232],[87,110]];
        const lines = [];
        for (let i = 0; i < pts.length; i++) {
          for (let j = i + 2; j < pts.length; j++) {
            if (i === 0 && j === pts.length - 1) continue; // skip edge dup
            lines.push([pts[i], pts[j]]);
          }
        }
        return lines.map(([[x1,y1],[x2,y2]], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} className="vertex-line-cross" />
        ));
      })()}

      {[[200,55],[313,110],[341,232],[263,331],[137,331],[59,232],[87,110]].map(([cx,cy], i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r="6"
          className="vertex-node"
          filter="url(#nodeGlow)"
          style={{ animationDelay: `${i * 0.25}s` }}
        />
      ))}
    </g>
    {/* Center-to-vertex spokes — the missing lines from reference */}
<g className="vertex-spokes">
  {[[200,55],[313,110],[341,232],[263,331],[137,331],[59,232],[87,110]].map(([x,y], i) => (
    <line key={i} x1="200" y1="200" x2={x} y2={y} className="vertex-line-spoke" />
  ))}
</g>
    {/* Traveling particles on outer edges */}
    <g className="vertex-particles">
      {[
        ["200,55", "313,110"],
        ["313,110", "341,232"],
        ["341,232", "263,331"],
        ["263,331", "137,331"],
        ["137,331", "59,232"],
        ["59,232", "87,110"],
        ["87,110", "200,55"],
      ].map(([a, b], i) => {
        const [ax, ay] = a.split(",");
        const [bx, by] = b.split(",");
        return (
          <circle key={i} r="2" className="vertex-particle">
            <animateMotion
              dur={`${5 + (i % 3)}s`}
              repeatCount="indefinite"
              path={`M${ax},${ay} L${bx},${by}`}
              begin={`${i * 0.5}s`}
            />
            <animate
              attributeName="opacity"
              values="0;1;1;0"
              dur={`${5 + (i % 3)}s`}
              repeatCount="indefinite"
              begin={`${i * 0.5}s`}
            />
          </circle>
        );
      })}
    </g>

    <circle cx="200" cy="200" r="7" className="vertex-core" filter="url(#nodeGlow)" />
  </svg>
</div>
      </section>

      {/* WHY 7VERTEX */}
      <section className="why" id="why">
        <p className="section-small">WHY 7VERTEX</p>
        <h2>A Team Built to Ship</h2>
        <div className="why-grid">
          <div className="why-card">
            <div className="why-icon">🧠</div>
            <h3>Skilled Team</h3>
            <p>Developers and designers who specialize, not generalize.</p>
          </div>
          <div className="why-card">
            <div className="why-icon">⚡</div>
            <h3>Modern Technology</h3>
            <p>React, Flutter, Firebase — tools built for scale, not shortcuts.</p>
          </div>
          <div className="why-card">
            <div className="why-icon">⏱️</div>
            <h3>On-Time Delivery</h3>
            <p>Clear timelines, tracked milestones, no surprise delays.</p>
          </div>
          <div className="why-card">
            <div className="why-icon">🎯</div>
            <h3>Client-Focused Approach</h3>
            <p>Every decision is filtered through your business goals first.</p>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="services" id="services">
        <p className="section-small">WHAT WE DO</p>
        <h2>Our Core Services</h2>

        <div className="service-container">
          <div className="service-card">
            <div className="service-icon">💻</div>
            <h3>Web Development</h3>
            <p>React.js websites, dashboards and business platforms.</p>
            <button className="card-link" onClick={() => navigate('/services/web-development')}>Learn more →</button>
            </div>

          <div className="service-card">
            <div className="service-icon">📱</div>
            <h3>Mobile App Development</h3>
            <p>Flutter & Android apps with smooth, native-feel UI.</p>
            <button className="card-link" onClick={() => navigate('/services/mobile-app-development')}>Learn more →</button>
          </div>

          <div className="service-card">
            <div className="service-icon">🔗</div>
            <h3>Backend Development</h3>
            <p>API integration, Firebase & database design done right.</p>
            <button className="card-link" onClick={() => navigate('/services/backend-development')}>Learn more →</button>
          </div>

          <div className="service-card">
            <div className="service-icon">🛒</div>
            <h3>E-Commerce Development</h3>
            <p>Full online stores with payments, catalogs & order management.</p>
            <button className="card-link" onClick={() => navigate('/services/ecommerce-development')}>Learn more →</button>
          </div>

          <div className="service-card">
            <div className="service-icon">🎨</div>
            <h3>UI/UX Design</h3>
            <p>Figma product design, app design & brand identity.</p>
            <button className="card-link" onClick={() => navigate('/services/ui-ux-design')}>Learn more →</button>
          </div>

          <div className="service-card">
            <div className="service-icon">🗄️</div>
            <h3>Enterprise Database Solutions</h3>
            <p>Oracle APEX & SQL-based systems for business operations.</p>
            <button className="card-link" onClick={() => navigate('/services/enterprise-database-solutions')}>Learn more →</button>
          </div>

          <div className="service-card">
            <div className="service-icon">🚀</div>
            <h3>SEO & Digital Marketing</h3>
            <p>On-page & off-page SEO, citations, social & forum outreach.</p>
            <button className="card-link" onClick={() => navigate('/services/seo-digital-marketing')}>Learn more →</button>
            </div>

          <div className="service-card">
            <div className="service-icon">🎬</div>
            <h3>Video Editing</h3>
            <p>Reels, ads & promo edits built for social platforms.</p>
            <button className="card-link" onClick={() => navigate('/services/video-editing')}>Learn more →</button>
          </div>

          <div className="service-card">
            <div className="service-icon">🤖</div>
            <h3>AI Automation</h3>
            <p>Workflow automation & AI tools that save your team time.</p>
            <button className="card-link" onClick={() => navigate('/services/ai-automation')}>Learn more →</button>
          </div>

          <div className="service-card">
            <div className="service-icon">✍️</div>
            <h3>Content Writing</h3>
            <p>Website copy, blogs & product content that converts.</p>
            <button className="card-link" onClick={() => navigate('/services/content-writing')}>Learn more →</button>
          </div>
        </div>
      </section>

      {/* TECHNOLOGIES */}
      <section className="tech" id="tech">
        <p className="section-small">OUR STACK</p>
        <h2>Technologies We Work With</h2>
        <div className="tech-grid">
          {[
            { name: 'Flutter', icon: 'flutter/flutter-original.svg' },
            { name: 'Dart', icon: 'dart/dart-original.svg' },
            { name: 'JavaScript', icon: 'javascript/javascript-original.svg' },
            { name: 'React', icon: 'react/react-original.svg' },
            { name: 'Python', icon: 'python/python-original.svg' },
            { name: 'Java', icon: 'java/java-original.svg' },
            { name: 'C++', icon: 'cplusplus/cplusplus-original.svg' },
            { name: 'SQL', icon: 'mysql/mysql-original.svg' },
            { name: 'Oracle APEX', icon: 'oracle/oracle-original.svg' },
            { name: 'Firebase', icon: 'firebase/firebase-plain.svg' },
            { name: 'Node.js', icon: 'nodejs/nodejs-original.svg' },
            { name: 'MongoDB', icon: 'mongodb/mongodb-original.svg' },
            { name: 'PostgreSQL', icon: 'postgresql/postgresql-original.svg' },
            { name: 'Next.js', icon: 'nextjs/nextjs-original.svg' },
            { name: 'TypeScript', icon: 'typescript/typescript-original.svg' },
            { name: 'Tailwind CSS', icon: 'tailwindcss/tailwindcss-plain.svg' },
            { name: 'Kotlin', icon: 'kotlin/kotlin-original.svg' },
            { name: 'Vercel', icon: 'vercel/vercel-original.svg' },
            { name: 'Docker', icon: 'docker/docker-original.svg' },
            { name: 'WordPress', icon: 'wordpress/wordpress-plain.svg' },
            { name: 'Shopify', icon: 'shopify/shopify-original.svg' },
            { name: 'AWS', icon: 'amazonwebservices/amazonwebservices-original.svg' },
            { name: 'Git', icon: 'git/git-original.svg' },
            { name: 'GitHub', icon: 'github/github-original.svg' },
            { name: 'Figma', icon: 'figma/figma-original.svg' },
            { name: 'CSS', icon: 'css3/css3-original.svg' },
            { name: 'HTML', icon: 'html5/html5-original.svg' },
          ].map(({ name, icon }) => (
            <div className="tech-card" key={name}>
              <div className="tech-icon-wrap">
                <img
                  src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${icon}`}
                  alt={name}
                  className="tech-icon"
                  loading="lazy"
                />
              </div>
              <span className="tech-name">{name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* PROCESS */}
      <section className="process" id="process">
        <p className="section-small">HOW WE WORK</p>
        <h2>Our Process</h2>
        <div className="process-track">
          {[
            ['01', 'Discovery', 'Understanding your goals, users & constraints.'],
            ['02', 'Planning', 'Scope, timeline and tech stack locked in.'],
            ['03', 'Design', 'Wireframes and UI design in Figma.'],
            ['04', 'Development', 'Building the product, sprint by sprint.'],
            ['05', 'Testing', 'QA across devices before anything ships.'],
            ['06', 'Delivery', 'Launch, handover and post-launch support.'],
          ].map(([num, title, desc]) => (
            <div className="process-step" key={num}>
              <span className="process-num">{num}</span>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PORTFOLIO */}
      <section className="portfolio" id="portfolio">
        <p className="section-small">OUR WORK</p>
        <h2>Featured Projects</h2>

        <div className="portfolio-container">
          <div className="project-card">
            <div className="project-image">Zavira App</div>
            <h3>Zavira Platform</h3>
            <p>Smart wearable & mobile application for safety response.</p>
          </div>

          <div className="project-card">
            <div className="project-image">Web App</div>
            <h3>SaaS Dashboard</h3>
            <p>Real-time analytics tool built with a modern tech stack.</p>
          </div>

          <div className="project-card">
            <div className="project-image">Mobile UI</div>
            <h3>E-Commerce Store</h3>
            <p>High-converting mobile shopping platform.</p>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="about" id="about">
        <p className="section-small">ABOUT US</p>
        <h2>Why We Started 7Vertex</h2>
        <p className="about-text">
          7Vertex was started to close the gap between businesses and the
          technology they need to grow — clean websites, functional apps and
          marketing that actually brings customers in. We stay a small,
          hands-on team on purpose, so every project gets real attention
          instead of getting lost in a queue.
        </p>
      </section>
{/* CONTACT — POPUP MODAL */}
{contactModalOpen && (
  <div className="modal-overlay" onClick={() => setContactModalOpen(false)}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <button className="modal-close" onClick={() => setContactModalOpen(false)} aria-label="Close">×</button>

      <p className="section-small">GET IN TOUCH</p>
      <h2>Contact Us</h2>

      <div className="contact-grid">
        <form className="contact-form" onSubmit={submitContact} noValidate>
          <div className="form-field">
            <label>Name</label>
            <input
              type="text"
              value={contact.name}
              onChange={(e) => setContact({ ...contact, name: e.target.value })}
              placeholder="Your name"
            />
            {contactErrors.name && <span className="field-error">{contactErrors.name}</span>}
          </div>
          <div className="form-field">
            <label>Email</label>
            <input
              type="email"
              value={contact.email}
              onChange={(e) => setContact({ ...contact, email: e.target.value })}
              placeholder="you@example.com"
            />
            {contactErrors.email && <span className="field-error">{contactErrors.email}</span>}
          </div>
          <div className="form-field">
            <label>Message</label>
            <textarea
              rows="4"
              value={contact.message}
              onChange={(e) => setContact({ ...contact, message: e.target.value })}
              placeholder="How can we help?"
            />
            {contactErrors.message && <span className="field-error">{contactErrors.message}</span>}
          </div>
          <button type="submit" className="primary-btn" disabled={contactStatus === 'sending'}>
            {contactStatus === 'sending' ? 'Sending...' : 'Send Message'}
          </button>
          {contactStatus === 'sent' && <p className="form-success">✓ Thanks! We've received your message and will reply soon.</p>}
          {contactStatus === 'error' && <p className="field-error">Something went wrong. Please email us directly at 7vertexgroup@gmail.com.</p>}
        </form>

        <div className="contact-info">
          <div className="info-item">
            <span className="info-label">Email</span>
            <a href="mailto:7vertexgroup@gmail.com">7vertexgroup@gmail.com</a>
          </div>
          <div className="info-item">
            <span className="info-label">Based in</span>
            <span>Pakistan · Remote-friendly</span>
          </div>
          <div className="info-item">
            <span className="info-label">Follow</span>
            <div className="social-row">
              <a href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
              <a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

      {/* FOOTER */}
      <footer>
        <div className="footer-top">
          <div className="footer-left">
            <div className="logo-box">
              <img src={logo} alt="7Vertex" className="logo-img" />
              <span className="logo-text">7<span>VERTEX</span></span>
            </div>
            <p>Technology and digital growth solutions for your next vertex.</p>
          </div>

          <div className="footer-links">
            <div className="footer-col">
              <h4>Explore</h4>
              <button onClick={() => scrollTo('services')}>Services</button>
              <button onClick={() => scrollTo('portfolio')}>Portfolio</button>
              <button onClick={() => scrollTo('about')}>About</button>
              <button onClick={() => setQuoteModalOpen(true)}>Get a Quote</button>
            </div>
            <div className="footer-col">
              <h4>Connect</h4>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
              <a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
              <a href="mailto:7vertexgroup@gmail.com">Email</a>
            </div>
          </div>
        </div>
        <p className="copyright">© 2026 7Vertex. All rights reserved.</p>
      </footer>

      {/* GET A QUOTE — POPUP MODAL */}
      {quoteModalOpen && (
        <div className="modal-overlay" onClick={() => setQuoteModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setQuoteModalOpen(false)} aria-label="Close">×</button>

            <p className="section-small">LET'S WORK TOGETHER</p>
            <h2>Get a Free Quote</h2>
            <p className="quote-subtext">Tell us about your project — we'll reply within 24 hours.</p>

            <form className="quote-form" onSubmit={submitQuote} noValidate>
              <div className="form-row">
                <div className="form-field">
                  <label>Name</label>
                  <input
                    type="text"
                    value={quote.name}
                    onChange={(e) => setQuote({ ...quote, name: e.target.value })}
                    placeholder="Your name"
                  />
                  {quoteErrors.name && <span className="field-error">{quoteErrors.name}</span>}
                </div>
                <div className="form-field">
                  <label>Email</label>
                  <input
                    type="email"
                    value={quote.email}
                    onChange={(e) => setQuote({ ...quote, email: e.target.value })}
                    placeholder="you@example.com"
                  />
                  {quoteErrors.email && <span className="field-error">{quoteErrors.email}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label>Phone / WhatsApp (optional)</label>
                  <input
                    type="tel"
                    value={quote.phone}
                    onChange={(e) => setQuote({ ...quote, phone: e.target.value })}
                    placeholder="+92 ..."
                  />
                </div>
                <div className="form-field">
                  <label>Budget (optional)</label>
                  <select
                    value={quote.budget}
                    onChange={(e) => setQuote({ ...quote, budget: e.target.value })}
                  >
                    <option value="">Select a range</option>
                    <option value="Under $500">Under $500</option>
                    <option value="$500 - $1500">$500 – $1500</option>
                    <option value="$1500 - $5000">$1500 – $5000</option>
                    <option value="$5000+">$5000+</option>
                  </select>
                </div>
              </div>

              <div className="form-field">
                <label>Services needed</label>
                <div className="service-checkboxes">
                  {ALL_SERVICES.map((s) => (
                    <label key={s} className={`checkbox-pill ${quote.services.includes(s) ? 'checked' : ''}`}>
                      <input
                        type="checkbox"
                        checked={quote.services.includes(s)}
                        onChange={() => toggleService(s)}
                      />
                      {s}
                    </label>
                  ))}
                </div>
                {quoteErrors.services && <span className="field-error">{quoteErrors.services}</span>}
              </div>

              <div className="form-field">
                <label>Project details</label>
                <textarea
                  rows="4"
                  value={quote.message}
                  onChange={(e) => setQuote({ ...quote, message: e.target.value })}
                  placeholder="Tell us what you're trying to build..."
                />
              </div>

              <button type="submit" className="primary-btn" disabled={quoteStatus === 'sending'}>
                {quoteStatus === 'sending' ? 'Sending...' : 'Send Quote Request'}
              </button>
              {quoteStatus === 'sent' && <p className="form-success">✓ Thanks! We've received your request and will reply within 24 hours.</p>}
              {quoteStatus === 'error' && <p className="field-error">Something went wrong. Please email us directly at 7vertexgroup@gmail.com.</p>}
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default HomePage;