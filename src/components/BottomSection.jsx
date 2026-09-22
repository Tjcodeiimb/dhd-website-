import React, { useRef } from 'react';

export default function BottomSection({ navigate }) {
  const faqRefs = useRef([]);

  const handleFaqToggle = (i) => {
    const el = faqRefs.current[i];
    if (!el) return;
    if (el.open) {
      faqRefs.current.forEach((other, idx) => {
        if (idx !== i && other) other.open = false;
      });
    }
  };

  return (
    <>
      {/* FAQ Section: Viewport Sized, White Background */}
      <section className="faq-section" id="faq">
        <div className="faq-container">
          <div className="bottom-tag-container">
            <span className="bottom-tag">FAQ</span>
          </div>
          <h2 className="bottom-faq-title">
            The <span className="faq-highlight-box yellow-highlight">honest answers</span> to the <span className="faq-highlight-box blue-highlight">obvious questions.</span>
          </h2>
          
          <div className="bottom-faq-list">
            {[
              {
                q: "Who can apply?",
                a: "Anyone from 16 to 45. Student, employee, in-between. We select on hunger, not marks. This is an application, not a checkout."
              },
              {
                q: "I don't have a business idea. Is that a problem?",
                a: "No. The tracks exist so you don't need one. You need the willingness to talk to strangers and ask for money."
              },
              {
                q: "How much money do I need to start?",
                a: "SevaDaata: ₹0. Karkhana: a few thousand rupees, and the playbook makes your customers fund most of it through pre-orders."
              },
              {
                q: "How much time does it take?",
                a: "Around 10 hours a week. 2\u20133 live sessions, the rest is fieldwork. The fieldwork is the course."
              },
              {
                q: "What if I miss a live session?",
                a: "Recordings exist so you can revise, not so you can skip. Checkpoints don't move."
              },
              {
                q: "How is the Bangalore team picked?",
                a: "We evaluate teams throughout the cohort and select the finalists. The cohort watches, we decide, and we explain the choice publicly."
              },
              {
                q: "Do I get a certificate?",
                a: "You get a P&L with your name on it. It says more."
              }
            ].map((faq, i) => (
              <details
                key={i}
                ref={el => { faqRefs.current[i] = el; }}
                onToggle={() => handleFaqToggle(i)}
              >
                <summary>{faq.q}</summary>
                <p>{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section: Maximalist Background */}
      <section className="cta-section">
        <div className="cta-main-box">
          <h2 className="bottom-cta-title">
            Stop preparing. Start <span className="cta-highlight-box yellow-highlight">building.</span>
          </h2>
          <p className="bottom-cta-sub">
            Applications are open for Cohort 2. Cohort 2 will tentatively start end of October, and you will hear back from us within 72 hours of applying.
          </p>
          <a
            className="bottom-cta-btn"
            href="/apply"
            onClick={(e) => {
              e.preventDefault();
              navigate('/apply');
            }}
          >
            Apply for Cohort 2
          </a>
        </div>
      </section>
    </>
  );
}
