import React from 'react';

export default function ReadThis({ navigate, isStandalone = false }) {
  return (
    <section className={`readthis-section ${isStandalone ? 'standalone' : ''}`} id="homework">
      <div className="readthis-body">
        <div className="readthis-header">
          <h2 className="readthis-title">
            Here are some <br />
            Interesting <span className="readthis-highlight-box">Facts.</span>
          </h2>
        </div>

        <div className="readthis-grid">
          <div className="readthis-card card-1">
            <span className="readthis-stat">29.1%</span>
            <h3>The more degrees, the more unemployment.</h3>
            <p>29.1% of Indian graduates are unemployed. Among those who never went to school: only 3.4%.</p>
            <span className="src">India Employment Report 2024 &middot; ILO + IHD</span>
            <p className="means">The exam ladder gets more crowded at every rung, and the top rung doesn't pay.</p>
          </div>

          <div className="readthis-card card-2">
            <span className="readthis-stat">&minus;13%</span>
            <h3>AI will effect entry level jobs the hardest.</h3>
            <p>
              Stanford economists tracked millions of payroll records: employment for 22-25 year olds in AI-exposed jobs fell 13% after generative AI arrived. Older workers held steady.
            </p>
            <span className="src">"Canaries in the Coal Mine" &middot; Stanford, 2025</span>
            <p className="means">The entry-level job you're preparing for may not exist by the time you're done preparing.</p>
          </div>

          <div className="readthis-card card-3">
            <span className="readthis-stat">6.3 Cr+</span>
            <h3>India already runs on dhandha. Untrained dhandha.</h3>
            <p>
              India has over 6.3 crore MSMEs; Udyam registrations crossed 7.8 crore in Feb 2026. A lot of them are first-generation owners with zero formal business training.
            </p>
            <span className="src">Ministry of MSME &middot; PIB &middot; Feb 2026</span>
            <p className="means">That's not a statistic, that's a customer list.</p>
          </div>

          <div className="readthis-card card-4">
            <span className="readthis-stat">58.4%</span>
            <h3>The salaried job is the exception, not the rule.</h3>
            <p>58.4% of working Indians are self-employed. Only 21.7% earn a regular salary.</p>
            <span className="src">Periodic Labour Force Survey 2023-24 &middot; MoSPI</span>
            <p className="means">Most of India already works for itself. Nobody teaches how to do it well.</p>
          </div>
        </div>

        <div className="readthis-cta-container">
          <a
            className="readthis-cta-box"
            href="/apply"
            onClick={(e) => {
              e.preventDefault();
              navigate('/apply');
            }}
          >
            Convinced? <br />
            Apply for Cohort 1
          </a>
        </div>
      </div>

      {/* Marquee at bottom */}
      <div className="investor-marquee-container" style={{ position: 'relative', borderTop: '2px solid #000', borderBottom: '2px solid #000', background: '#FAD06B', height: '50px' }}>
        <div className="investor-marquee" style={{ height: '100%' }}>
          <div className="investor-marquee-inner">
            {[...Array(4)].map((_, i) => (
              <div className="investor-marquee-content" key={i}>
                <span className="marquee-item">The exam math</span>
                <span className="marquee-item">&middot;</span>
                <span className="marquee-item">JEE: ~15,00,000 candidates &rarr; 18,951 IIT seats</span>
                <span className="marquee-item">&middot;</span>
                <span className="marquee-item">CAT: ~3,50,000 &rarr; ~8,400 seats</span>
                <span className="marquee-item">&middot;</span>
                <span className="marquee-item">UPSC: ~10,00,000 &rarr; ~1,000 posts</span>
                <span className="marquee-item">&middot;</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
