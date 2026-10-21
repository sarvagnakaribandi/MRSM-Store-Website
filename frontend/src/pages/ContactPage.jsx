import React, { useState } from 'react';
import { submitContactInquiry } from '../services/api';
import Button from '../components/common/Button';
import { PhoneIcon, WhatsAppIcon, MapPinIcon, CheckIcon } from '../components/common/Icons';

export const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'Store Sizing / Product Inquiry',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Please provide your full name.';
    if (!formData.phone.trim()) {
      errs.phone = 'Please provide your 10-digit phone number.';
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
      errs.phone = 'Please enter a valid 10-digit Indian mobile number.';
    }
    if (!formData.message.trim()) {
      errs.message = 'Please enter your message or question.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      const res = await submitContactInquiry(formData);
      if (res.success) {
        setSubmitSuccess(true);
        setFormData({
          name: '',
          phone: '',
          email: '',
          subject: 'Store Sizing / Product Inquiry',
          message: ''
        });
        setErrors({});
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="section" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="section-eyebrow">Connect With Us</span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3rem)', marginBottom: '1rem' }}>
            Visit Store or Get in Touch
          </h1>
          <p style={{ maxWidth: '640px', margin: '0 auto', color: 'var(--text-muted)' }}>
            Have a question about sizes, custom tailoring, or availability? Contact <strong>Mr. Shiva Yadav</strong> and our store team directly.
          </p>
        </div>

        {/* Two Columns: Store Details & Map Info vs Contact Form */}
        <div className="responsive-split-grid">
          {/* Left: Verified Store Info */}
          <div>
            <div
              style={{
                backgroundColor: 'var(--color-white)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '2rem',
                boxShadow: 'var(--shadow-sm)',
                marginBottom: '1.5rem'
              }}
            >
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '1.25rem' }}>
                Store Showroom
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Physical Address */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <MapPinIcon size={22} style={{ color: 'var(--color-caramel)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ display: 'block', color: 'var(--color-espresso)', marginBottom: '4px' }}>
                      Physical Location:
                    </strong>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      1st Floor, 24-7-302/1, Opp. Royal Enfield Showroom, Beside A to Z Medicals, Subedari, Hanamkonda, Warangal, Telangana
                    </p>
                  </div>
                </div>

                {/* Direct Calling */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <PhoneIcon size={20} style={{ color: 'var(--color-caramel)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ display: 'block', color: 'var(--color-espresso)', marginBottom: '4px' }}>
                      Direct Call:
                    </strong>
                    <a
                      href="tel:+918466007454"
                      style={{ color: 'var(--color-mocha)', fontWeight: '700', fontSize: '1.05rem' }}
                    >
                      +91 8466007454
                    </a>
                  </div>
                </div>

                {/* WhatsApp Chat */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <WhatsAppIcon size={20} style={{ color: '#25D366', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ display: 'block', color: 'var(--color-espresso)', marginBottom: '4px' }}>
                      WhatsApp Instant Chat:
                    </strong>
                    <a
                      href="https://wa.me/918332867454"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#25D366', fontWeight: '700', fontSize: '1.05rem' }}
                    >
                      +91 8332867454
                    </a>
                  </div>
                </div>

                {/* Operating Hours */}
                <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <strong style={{ display: 'block', color: 'var(--color-espresso)', marginBottom: '4px' }}>
                    Showroom Hours (Demo Placeholder):
                  </strong>
                  <p style={{ margin: 0, color: 'var(--text-muted)' }}>
                    Monday – Sunday: 10:00 AM – 9:30 PM (Open 7 Days a week)
                  </p>
                </div>
              </div>

              {/* Map Directions Button */}
              <div style={{ marginTop: '1.5rem' }}>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Subedari+Hanamkonda+Warangal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-full"
                >
                  <MapPinIcon size={16} /> Open in Google Maps
                </a>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div
            style={{
              backgroundColor: 'var(--color-white)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '2rem',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
              Send an Inquiry
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Leave your details below and Mr. Shiva Yadav or our team will get in touch regarding your product inquiry.
            </p>

            {submitSuccess && (
              <div
                style={{
                  backgroundColor: 'var(--status-success-bg)',
                  border: '1px solid #C3E6CB',
                  color: 'var(--status-success)',
                  padding: '1rem',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <CheckIcon size={20} />
                <span>
                  Thank you! Your message has been sent. We will contact you shortly.
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label className="form-label" htmlFor="contact-name">
                  Full Name <span style={{ color: 'var(--status-error)' }}>*</span>
                </label>
                <input
                  id="contact-name"
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Ramesh Kumar"
                />
                {errors.name && <div className="form-error">{errors.name}</div>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="contact-phone">
                  Mobile Number (10 digits) <span style={{ color: 'var(--status-error)' }}>*</span>
                </label>
                <input
                  id="contact-phone"
                  type="tel"
                  className="form-input"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. 9876543210"
                />
                {errors.phone && <div className="form-error">{errors.phone}</div>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="contact-email">
                  Email Address (Optional)
                </label>
                <input
                  id="contact-email"
                  type="email"
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. ramesh@example.com"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="contact-subject">
                  Subject
                </label>
                <select
                  id="contact-subject"
                  className="form-select"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                >
                  <option value="Store Sizing / Product Inquiry">Store Sizing / Product Inquiry</option>
                  <option value="Wedding / Festive Bulk Requirement">Wedding / Festive Bulk Requirement</option>
                  <option value="Store Location / Directions">Store Location / Directions</option>
                  <option value="General Question">General Question</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="contact-message">
                  Message <span style={{ color: 'var(--status-error)' }}>*</span>
                </label>
                <textarea
                  id="contact-message"
                  className="form-textarea"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your inquiry or the clothing piece you are looking for..."
                />
                {errors.message && <div className="form-error">{errors.message}</div>}
              </div>

              <Button
                type="submit"
                variant="primary"
                isFullWidth
                size="lg"
                isLoading={isSubmitting}
              >
                Send Inquiry Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
