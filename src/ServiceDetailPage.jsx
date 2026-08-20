import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SERVICE_DETAILS } from './serviceData';
import './App.css';

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

function ServiceDetailPage() {
  const { serviceId } = useParams();
  const service = SERVICE_DETAILS[serviceId];

  const [selectedImage, setSelectedImage] = useState(null);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  const [quote, setQuote] = useState({
    name: '',
    email: '',
    phone: '',
    services: [],
    budget: '',
    message: '',
  });
  const [quoteErrors, setQuoteErrors] = useState({});
  const [quoteStatus, setQuoteStatus] = useState('idle');

  const openQuoteModal = () => {
    if (service) {
      setQuote((prev) => ({
        ...prev,
        services: prev.services.includes(service.title)
          ? prev.services
          : [...prev.services, service.title],
      }));
    }
    setQuoteModalOpen(true);
  };

  const toggleService = (s) => {
    setQuote((prev) => {
      const has = prev.services.includes(s);
      return {
        ...prev,
        services: has ? prev.services.filter((x) => x !== s) : [...prev.services, s],
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

  if (!service) {
    return (
      <div className="service-page">
        <p>Service not found.</p>
        <Link to="/" className="back-link">← Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="service-page">
      <Link to="/" className="back-link">← Back to Home</Link>
      <p className="section-small">OUR SERVICE</p>
      <h1>{service.title}</h1>
      <p className="service-page-text">{service.description}</p>

      {service.images.length > 0 && (
        <div className="service-media-section">
          <h2 className="media-section-title">Images of the Project</h2>
          <div className="service-media-grid">
            {service.images.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`${service.title} ${i + 1}`}
                className="service-media-item"
                onClick={() => setSelectedImage(src)}
                style={{ cursor: 'pointer' }}
              />
            ))}
          </div>
        </div>
      )}

      {service.videos.length > 0 && (
        <div className="service-media-section">
          <h2 className="media-section-title">To Show Projects in detail see Video</h2>
          <div className="service-media-grid">
            {service.videos.map((src, i) => (
              <video key={i} src={src} controls className="service-media-item" />
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        className="primary-btn"
        style={{ display: 'inline-block', marginTop: '30px' }}
        onClick={openQuoteModal}
      >
        Get a Quote for this →
      </button>

      {selectedImage && (
        <div className="image-lightbox" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Full view" className="image-lightbox-content" />
          <span className="image-lightbox-close">×</span>
        </div>
      )}

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

export default ServiceDetailPage;