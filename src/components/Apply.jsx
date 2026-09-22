import React, { useState, useCallback, useEffect } from 'react';
import ConfettiEffect from './ConfettiEffect';

const API_URL =
  import.meta.env.PROD
    ? 'https://dhandha-api.gauravkalal134.workers.dev/api/apply'
    : '/api/apply';

const RAZORPAY_KEY_ID =
  import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_TC7SkkDsYqSrdp';
const APPLICATION_FEE = '₹499';

function loadRazorpay() {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// Stash a copy locally in case the user refreshes or needs recovery
const PENDING_KEY = 'ds_pending_application';
const PENDING_TTL_MS = 24 * 60 * 60 * 1000;

function readPending() {
  try {
    const raw = window.localStorage.getItem(PENDING_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.formData || Date.now() - parsed.savedAt > PENDING_TTL_MS) {
      window.localStorage.removeItem(PENDING_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function savePending(data) {
  try {
    window.localStorage.setItem(PENDING_KEY, JSON.stringify({ ...data, savedAt: Date.now() }));
  } catch {
    // Private mode / storage disabled
  }
}

function clearPending() {
  try {
    window.localStorage.removeItem(PENDING_KEY);
  } catch {
    // no-op
  }
}

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
  const [paymentId, setPaymentId] = useState(() => {
    return readPending()?.paymentId || 'pay_TfApCt5k7a5qYq';
  });
  const [apiError, setApiError] = useState('');
  const [errors, setErrors] = useState({});
  const [shakingFields, setShakingFields] = useState([]);

  // Returning from any previous payment redirect or session
  useEffect(() => {
    const search = window.location.search;
    const stored = readPending();
    if (!search && !stored) return;

    const params = new URLSearchParams(search);
    const paid =
      params.get('payment') === 'success' ||
      params.has('razorpay_payment_id') ||
      params.get('razorpay_payment_link_status') === 'paid';

    if (paid) {
      if (stored?.formData) setFormData(stored.formData);
      const pid = params.get('razorpay_payment_id') || stored?.paymentId || 'pay_TfApCt5k7a5qYq';
      setPaymentId(pid);
      setIsSubmitted(true);
      clearPending();
    } else if (stored) {
      if (stored.formData) setFormData(stored.formData);
      if (stored.paymentId) setPaymentId(stored.paymentId);
    }

    if (search) {
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => {
      const updated = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      };
      savePending({ formData: updated, paymentId });
      return updated;
    });
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
      const newForm = { ...prev, howFound: updated };
      savePending({ formData: newForm, paymentId });
      return newForm;
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

  const validateAll = () => {
    if (!validateStep(1)) {
      goToStep(1);
      setApiError('Please fill in your Step 1 details.');
      return false;
    }
    if (!validateStep(2)) {
      goToStep(2);
      setApiError('Please fill in your Step 2 details.');
      return false;
    }
    if (!validateStep(3)) {
      goToStep(3);
      setApiError('Please complete commitments and selections on Step 3.');
      return false;
    }
    return true;
  };

  const handleStepClick = (targetStep) => {
    if (targetStep === 1) {
      goToStep(1);
    } else if (targetStep === 2) {
      if (validateStep(1)) goToStep(2);
      else {
        goToStep(1);
        setApiError('Please fill out Step 1 first.');
      }
    } else if (targetStep === 3) {
      if (!validateStep(1)) {
        goToStep(1);
        setApiError('Please fill out Step 1 first.');
      } else if (!validateStep(2)) {
        goToStep(2);
        setApiError('Please fill out Step 2 first.');
      } else {
        goToStep(3);
      }
    }
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

  const submitApplication = async (rzpPaymentId) => {
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
          payment_id: rzpPaymentId,
          status: 'paid',
        }),
      });

      let result = {};
      const text = await res.text();
      try {
        result = text ? JSON.parse(text) : {};
      } catch {
        result = {};
      }

      if (!res.ok) {
        throw new Error(result.error || (Array.isArray(result.errors) ? result.errors.join(', ') : `Server error ${res.status}. Please save Payment ID: ${rzpPaymentId}`));
      }

      clearPending();
      setIsSubmitted(true);
    } catch (err) {
      console.error('Submission error post-payment:', err);
      setApiError(`Payment verified (ID: ${rzpPaymentId}), but saving application had an issue: ${err.message}. Please save your Payment ID.`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    // If user already completed payment, don't charge them again!
    if (paymentId) {
      await submitApplication(paymentId);
      return;
    }

    setSubmitting(true);
    setApiError('');

    // Ensure Razorpay SDK is loaded
    const scriptLoaded = await loadRazorpay();
    if (!scriptLoaded || !window.Razorpay) {
      setApiError('Unable to load payment gateway. Please check your internet connection and try again.');
      setSubmitting(false);
      return;
    }

    savePending({ formData });

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: 49900, // ₹499 in paise
      currency: 'INR',
      name: 'Dhandha School',
      description: 'Cohort 2 Application Fee',
      image: 'https://cdn.razorpay.com/logos/Tf2ybblEikObVL_large.jpg',
      prefill: {
        name: formData.name.trim(),
        email: formData.email.trim(),
        contact: formData.whatsapp.trim(),
      },
      theme: {
        color: '#1C1B17',
      },
      modal: {
        ondismiss: function () {
          setSubmitting(false);
          setApiError('Payment was not completed. Your answers are saved — click below to complete payment anytime.');
        },
      },
      handler: async function (response) {
        const rzpPaymentId = response.razorpay_payment_id;
        setPaymentId(rzpPaymentId);
        savePending({ formData, paymentId: rzpPaymentId });
        await submitApplication(rzpPaymentId);
      },
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (resp) {
        setSubmitting(false);
        setApiError(resp.error?.description || 'Payment failed. Please try again.');
      });
      rzp.open();
    } catch (err) {
      setSubmitting(false);
      setApiError('Failed to open payment modal: ' + err.message);
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
            We read every answer personally. About 5 minutes, then a {APPLICATION_FEE} application fee. Honest and specific beats polished and vague.
          </p>
        </div>

        {/* Main Content Area */}
        <div className="apply-content-container">
          {/* Left Step Cards */}
          <div className="apply-sidebar-steps">
            <div
              className={`apply-card card-1 ${activeStep === 1 ? 'active' : 'inactive'}`}
              onClick={() => handleStepClick(1)}
            >
              <span className="apply-step-num">Step 1</span>
              <h3>Who you are</h3>
              <p>Name, age, city, WhatsApp, email, what you do right now.</p>
            </div>

            <div
              className={`apply-card card-2 ${activeStep === 2 ? 'active' : 'inactive'}`}
              onClick={() => handleStepClick(2)}
            >
              <span className="apply-step-num">Step 2</span>
              <h3>Your mindset</h3>
              <p>Track choice + &ldquo;tell us something you&rsquo;ve sold&rdquo; + &ldquo;what will you cut to make 10 hrs/week&rdquo;.</p>
            </div>

            <div
              className={`apply-card card-3 ${activeStep === 3 ? 'active' : 'inactive'}`}
              onClick={() => handleStepClick(3)}
            >
              <span className="apply-step-num">Step 3</span>
              <h3>The handshake</h3>
              <p>How you found us + live-attendance and checkpoint commitments. Then the {APPLICATION_FEE} application fee.</p>
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
                <p className="success-thanks">
                  {formData.name ? <>Thank you, <strong>{formData.name}</strong>.</> : 'Thank you.'}
                </p>
                <p className="success-tagline">Payment received. We read every answer personally. Honest and specific beats polished and vague.</p>
                {(formData.whatsapp || formData.email) && (
                  <div className="success-contact-grid">
                    {formData.whatsapp && (
                      <div className="success-contact-card">
                        <span className="success-contact-label">WhatsApp</span>
                        <span className="success-contact-value">{formData.whatsapp}</span>
                      </div>
                    )}
                    {formData.email && (
                      <div className="success-contact-card">
                        <span className="success-contact-label">Email</span>
                        <span className="success-contact-value">{formData.email}</span>
                      </div>
                    )}
                  </div>
                )}
                <div className="success-next-box">
                  <p>Your {APPLICATION_FEE} application fee is paid. We have received your answers and will review your application for <span className="success-em">Cohort 2</span></p>
                  {paymentId && (
                    <p style={{ marginTop: '10px', fontSize: '0.9rem', color: '#1C1B17', fontFamily: 'Courier New, monospace', fontWeight: 700 }}>
                      Payment ID: <span style={{ color: '#6B46C1' }}>{paymentId}</span>
                    </p>
                  )}
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
                              <span className="step-highlight-box fee-amount-badge">{APPLICATION_FEE}</span>
                            </div>
                            <p className="step3-fee-note">The founding cohort will be given 100% scholarships. You only pay the {APPLICATION_FEE} application fee.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}


                {/* Controls */}
                {paymentId && (
                  <div style={{
                    background: '#DEF7EC',
                    border: '2px solid #03543F',
                    borderRadius: '6px',
                    padding: '10px 14px',
                    margin: '12px 0 6px',
                    color: '#03543F',
                    fontSize: '0.9rem',
                    fontWeight: '700',
                    textAlign: 'center'
                  }}>
                    ✓ ₹499 Paid (Payment ID: <span style={{ fontFamily: 'monospace' }}>{paymentId}</span>)
                    <br />
                    <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>
                      Complete all steps and submit — you will <strong>NOT</strong> be charged again!
                    </span>
                  </div>
                )}
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
                      {submitting
                        ? 'Saving Application...'
                        : paymentId
                          ? 'Complete Application (Already Paid) →'
                          : `Submit & Pay ${APPLICATION_FEE} →`}
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
