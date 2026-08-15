import React, { useState, useCallback } from 'react';
import ConfettiEffect from './ConfettiEffect';

const API_URL =
  import.meta.env.PROD
    ? 'https://dhandha-api.gauravkalal134.workers.dev/api/apply'
    : '/api/apply';


const HEARD_FROM_OPTIONS = [
  { value: 'twitter',   label: 'Twitter / X' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'linkedin',  label: 'LinkedIn' },
  { value: 'youtube',   label: 'YouTube' },
  { value: 'friend',    label: 'Friend / Word of mouth' },
  { value: 'whatsapp',  label: 'WhatsApp group' },
  { value: 'college',   label: 'College / University' },
  { value: 'google',    label: 'Google Search' },
  { value: 'podcast',   label: 'Podcast' },
  { value: 'other',     label: 'Other' },
];

export default function Apply({ navigate, isStandalone = false }) {
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    city: '',
    whatsapp: '',
    email: '',
    whatYouDo: '',
    trackChoice: 'maker',
    soldSomething: '',
    whatToCut: '',
    backgroundStory: '',
    whyJoin: '',
    howFound: [],
    commitLive: false,
    commitCheckpoint: false
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const [errors, setErrors] = useState({});
  const [shakingFields, setShakingFields] = useState([]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const toggleHowFound = (val) => {
    setFormData(prev => {
      const current = prev.howFound;
      const updated = current.includes(val)
        ? current.filter(v => v !== val)
        : [...current, val];
      return { ...prev, howFound: updated };
    });
    if (errors.howFound) setErrors(prev => ({ ...prev, howFound: null }));
  };

  const triggerShake = useCallback((fieldNames) => {
    setShakingFields(fieldNames);
    setTimeout(() => setShakingFields([]), 500);
  }, []);

  const goToStep = (step) => {
    setErrors({});
    setShakingFields([]);
    setActiveStep(step);
  };

  const validateStep = (step) => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = true;
      if (!formData.age.trim()) newErrors.age = true;
      if (!formData.city.trim()) newErrors.city = true;
      if (!formData.whatsapp.trim()) newErrors.whatsapp = true;
      if (!formData.email.trim()) newErrors.email = true;
      if (!formData.whatYouDo.trim()) newErrors.whatYouDo = true;
    } else if (step === 2) {
      if (!formData.trackChoice) newErrors.trackChoice = true;
      if (!formData.soldSomething.trim()) newErrors.soldSomething = true;
      if (!formData.whatToCut.trim()) newErrors.whatToCut = true;
      if (!formData.backgroundStory.trim()) newErrors.backgroundStory = true;
      if (!formData.whyJoin.trim()) newErrors.whyJoin = true;
    } else if (step === 3) {
      if (formData.howFound.length === 0) newErrors.howFound = true;
      if (!formData.commitLive) newErrors.commitLive = true;
      if (!formData.commitCheckpoint) newErrors.commitCheckpoint = true;
    }
    setErrors(newErrors);
    const invalidFields = Object.keys(newErrors);
    if (invalidFields.length > 0) triggerShake(invalidFields);
    return invalidFields.length === 0;
  };

  const fieldClass = (name) => {
    const classes = [];
    if (errors[name]) classes.push('error');
    if (shakingFields.includes(name)) classes.push('shake');
    return classes.join(' ');
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    goToStep(activeStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateStep(3)) {
      setSubmitting(true);
      setApiError('');
      try {
        const howFoundLabels = formData.howFound.map(v => {
          const found = HEARD_FROM_OPTIONS.find(o => o.value === v);
          return found ? found.label : v;
        });

        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            full_name: formData.name.trim(),
            age: Number(formData.age),
            email: formData.email.trim(),
            whatsapp: formData.whatsapp.trim(),
            city: formData.city.trim(),
            current_role: formData.whatYouDo.trim(),
            track: formData.trackChoice === 'maker' ? 'karkhana' : 'sevadaata',
            sold_story: formData.soldSomething.trim(),
            time_commitment: formData.whatToCut.trim(),
            background_story: formData.backgroundStory.trim(),
            why_apply: formData.whyJoin.trim(),
            how_found: howFoundLabels,
            attend_commit: formData.commitLive,
            checkpoint_commit: formData.commitCheckpoint,
          }),
        });

        const result = await res.json();
        if (!res.ok) {
          throw new Error(result.error || (Array.isArray(result.errors) ? result.errors.join(', ') : `Error ${res.status}: Failed to submit application.`));
        }
        if (result.error) {
          throw new Error(result.error);
        }

        setIsSubmitted(true);
      } catch (err) {
        setApiError(err.message || 'Something went wrong.');
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <section className={`apply-section ${isStandalone ? 'standalone' : ''}`} id="apply">
      <div className="apply-body">
        {/* Header Text */}
        <div className="apply-header">
          <h2 className="apply-title">
            <span className="apply-highlight-box">Apply for Cohort 2</span>
          </h2>
          <p className="apply-sub">
            This is an application, not a checkout. We read every answer personally. About 5 minutes. Honest and specific beats polished and vague.
          </p>
        </div>

        {/* Main Content Area */}
        <div className="apply-content-container">
          {/* Left Step Cards */}
          <div className="apply-sidebar-steps">
            <div
              className={`apply-card card-1 ${activeStep === 1 ? 'active' : 'inactive'}`}
              onClick={() => goToStep(1)}
            >
              <span className="apply-step-num">Step 1</span>
              <h3>Who you are</h3>
              <p>Name, age, city, WhatsApp, email, what you do right now.</p>
            </div>

            <div
              className={`apply-card card-2 ${activeStep === 2 ? 'active' : 'inactive'}`}
              onClick={() => goToStep(2)}
            >
              <span className="apply-step-num">Step 2</span>
              <h3>Your mindset</h3>
              <p>Track choice + &ldquo;tell us something you&rsquo;ve sold&rdquo; + &ldquo;what will you cut to make 10 hrs/week&rdquo;.</p>
            </div>

            <div
              className={`apply-card card-3 ${activeStep === 3 ? 'active' : 'inactive'}`}
              onClick={() => goToStep(3)}
            >
              <span className="apply-step-num">Step 3</span>
              <h3>The handshake</h3>
              <p>How you found us + live-attendance and checkpoint commitments. Fee shown, payable only if selected.</p>
            </div>
          </div>

          {/* Right Purple Rectangle Box with Form inside */}
          <div className="apply-purple-box">
            {isSubmitted ? (
              <div className="apply-success">
                <ConfettiEffect />
                <div className="apply-success-header">
                  <span className="success-highlight-box">Application Received!</span>
                </div>
                <p className="success-thanks">Thank you, <strong>{formData.name}</strong>.</p>
                <p className="success-tagline">We read every answer personally. Honest and specific beats polished and vague.</p>
                <div className="success-contact-grid">
                  <div className="success-contact-card">
                    <span className="success-contact-label">WhatsApp</span>
                    <span className="success-contact-value">{formData.whatsapp}</span>
                  </div>
                  <div className="success-contact-card">
                    <span className="success-contact-label">Email</span>
                    <span className="success-contact-value">{formData.email}</span>
                  </div>
                </div>
                <div className="success-next-box">
                  <p>We have received your answers and will review your application for <span className="success-em">Cohort 2</span></p>
                </div>
                <button type="button" className="success-home-btn" onClick={() => { if (isStandalone) { window.location.href = '/'; } else { navigate('/'); } }}>
                  ← Back to Homepage
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="purple-form-inner">

                {/* ── STEP 1 ── */}
                {activeStep === 1 && (
                  <div className="purple-form-step">
                    <h3 className="purple-step-title"><span className="step-highlight-box">Step 1: Who You Are</span></h3>
                    <div className="purple-form-grid">
                      <div className="purple-form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="e.g. Arjun Sharma"
                          className={fieldClass('name')}
                        />
                      </div>

                      <div className="purple-form-group">
                        <label htmlFor="age">Age</label>
                        <input
                          type="number"
                          id="age"
                          name="age"
                          value={formData.age}
                          onChange={handleInputChange}
                          placeholder="e.g. 21"
                          className={fieldClass('age')}
                        />
                      </div>

                      <div className="purple-form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="name@example.com"
                          className={fieldClass('email')}
                        />
                      </div>

                      <div className="purple-form-group">
                        <label htmlFor="whatsapp">WhatsApp Number</label>
                        <input
                          type="tel"
                          id="whatsapp"
                          name="whatsapp"
                          value={formData.whatsapp}
                          onChange={handleInputChange}
                          placeholder="+91 XXXXX XXXXX"
                          className={fieldClass('whatsapp')}
                        />
                      </div>

                      <div className="purple-form-group">
                        <label htmlFor="city">City / Town</label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="e.g. Bangalore"
                          className={fieldClass('city')}
                        />
                      </div>

                      <div className="purple-form-group">
                        <label htmlFor="whatYouDo">What do you do right now?</label>
                        <input
                          type="text"
                          id="whatYouDo"
                          name="whatYouDo"
                          value={formData.whatYouDo}
                          onChange={handleInputChange}
                          placeholder="e.g. Student / Working"
                          className={fieldClass('whatYouDo')}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ── STEP 2 ── */}
                {activeStep === 2 && (
                  <div className="purple-form-step step2-layout">
                    <div className="step2-body">
                      {/* Left: Track Image Selector */}
                      <div className="track-image-selector">
                        <h3 className="purple-step-title" style={{ marginTop: 0, marginBottom: '1.5rem' }}><span className="step-highlight-box">Step 2: Your Mindset</span></h3>
                        <p className="track-choose-prompt">Choose your track</p>
                        <div className="track-image-cards">
                          <div
                            className={`track-image-card ${formData.trackChoice === 'maker' ? 'selected' : 'dimmed'}`}
                            onClick={() => setFormData(prev => ({ ...prev, trackChoice: 'maker' }))}
                          >
                            <img src="/karkhana.jpg" alt="Karkhana" className="track-img" />
                            <span className="track-img-label">KARKHANA</span>
                            <span className="track-img-sublabel">Maker Track</span>
                          </div>
                          <div
                            className={`track-image-card ${formData.trackChoice === 'sevadaata' ? 'selected' : 'dimmed'}`}
                            onClick={() => setFormData(prev => ({ ...prev, trackChoice: 'sevadaata' }))}
                          >
                            <img src="/hunarkhana.jpg" alt="SevaDaata" className="track-img" />
                            <span className="track-img-label">SEVADAATA</span>
                            <span className="track-img-sublabel">Skills Track</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Textareas */}
                      <div className="step2-textareas">
                        <div className="purple-form-group">
                          <label htmlFor="soldSomething">Tell us something you&rsquo;ve sold in the past (or explain how you would sell it)</label>
                          <textarea
                            id="soldSomething"
                            name="soldSomething"
                            value={formData.soldSomething}
                            onChange={handleInputChange}
                            placeholder="Be honest and specific. What did you sell, to whom, and for how much?"
                            className={fieldClass('soldSomething')}
                            rows={3}
                          />
                        </div>

                        <div className="purple-form-group">
                          <label htmlFor="whatToCut">What will you cut from your routine to make 10 hours/week?</label>
                          <textarea
                            id="whatToCut"
                            name="whatToCut"
                            value={formData.whatToCut}
                            onChange={handleInputChange}
                            placeholder="e.g. Reduce social media / skip college clubs / adjust weekend schedules..."
                            className={fieldClass('whatToCut')}
                            rows={3}
                          />
                        </div>

                        <div className="purple-form-group">
                          <label htmlFor="backgroundStory">Tell us about your background, your life story. You can be as brief or as detailed as you want.</label>
                          <textarea
                            id="backgroundStory"
                            name="backgroundStory"
                            value={formData.backgroundStory}
                            onChange={handleInputChange}
                            placeholder="Your story..."
                            className={fieldClass('backgroundStory')}
                            rows={3}
                          />
                        </div>

                        <div className="purple-form-group">
                          <label htmlFor="whyJoin">Why should you be part of the founding cohort of Dhandha School?</label>
                          <textarea
                            id="whyJoin"
                            name="whyJoin"
                            value={formData.whyJoin}
                            onChange={handleInputChange}
                            placeholder="Why you?"
                            className={fieldClass('whyJoin')}
                            rows={3}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── STEP 3 ── */}
                {activeStep === 3 && (
                  <div className="purple-form-step step3-layout">
                    <h3 className="purple-step-title"><span className="step-highlight-box">Step 3: The Handshake</span></h3>

                    <div className="step3-body">
                      {/* Left: Multi-select pills */}
                      <div className="step3-left">
                        <div className={`purple-form-group ${shakingFields.includes('howFound') ? 'shake' : ''}`}>
                          <label>Where did you hear about Dhandha School? <span className="label-hint">(tick all that apply)</span></label>
                          <div className={`howfound-pill-grid ${errors.howFound ? 'error-border' : ''}`}>
                            {HEARD_FROM_OPTIONS.map(opt => (
                              <button
                                key={opt.value}
                                type="button"
                                className={`howfound-pill ${formData.howFound.includes(opt.value) ? 'selected' : ''}`}
                                onClick={() => toggleHowFound(opt.value)}
                              >
                                {formData.howFound.includes(opt.value) && <span className="pill-tick">✓ </span>}
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right: Commitments + Fee */}
                      <div className="step3-right">
                        {/* Commitments */}
                        <div className="step3-commitments">
                          <p className="step3-section-label">Commitments</p>
                          <label className={`checkbox-label ${shakingFields.includes('commitLive') ? 'shake' : ''}`}>
                            <input
                              type="checkbox"
                              name="commitLive"
                              checked={formData.commitLive}
                              onChange={handleInputChange}
                              className={errors.commitLive ? 'error' : ''}
                            />
                            <span className={`checkbox-text ${errors.commitLive ? 'text-error' : ''}`}>I commit to attending live sessions and collaborating with cohort members.</span>
                          </label>
                          <label className={`checkbox-label ${shakingFields.includes('commitCheckpoint') ? 'shake' : ''}`}>
                            <input
                              type="checkbox"
                              name="commitCheckpoint"
                              checked={formData.commitCheckpoint}
                              onChange={handleInputChange}
                              className={errors.commitCheckpoint ? 'error' : ''}
                            />
                            <span className={`checkbox-text ${errors.commitCheckpoint ? 'text-error' : ''}`}>I commit to completing weekly checkpoints for my selected track alone.</span>
                          </label>
                        </div>

                        {/* Fee */}
                        <div className="step3-fee-block">
                          <div className="step3-fee-left">
                            <p className="step3-section-label">Program Fee</p>
                            <div className="step3-fee-amount">
                              <span className="step3-fee-crossed">₹14,999</span>
                              <span className="step-highlight-box free-to-apply-badge">Free to Apply</span>
                            </div>
                            <p className="step3-fee-note">The founding cohort will be given 100% scholarships.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}


                {/* Controls */}
                {apiError && (
                  <p className="apply-api-error" style={{ color: '#ef4444', textAlign: 'center', margin: '12px 0 0', fontWeight: 600 }}>
                    {apiError}
                  </p>
                )}
                <div className="purple-form-actions">
                  {activeStep > 1 && (
                    <button type="button" onClick={handleBack} className="purple-btn back-btn" disabled={submitting}>
                      Back
                    </button>
                  )}
                  {activeStep < 3 ? (
                    <button type="button" onClick={handleNext} className="purple-btn next-btn">
                      Next Step &rarr;
                    </button>
                  ) : (
                    <button type="submit" className="purple-btn submit-btn" disabled={submitting}>
                      {submitting ? 'Submitting...' : 'Submit Application'}
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
