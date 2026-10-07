{/* ============================================================
   DUKAAN & KAARKHANA — Two Tracks Section
   Place this JSX inside your main component/layout.
   Images required: /dukaan_frame.png, /kaarkhana_frame.png,
                     /laptop.png, /medal.png (in public/)
   ============================================================ */}

<section className="placeholder-section section-tracks" style={{ padding: '80px 24px', backgroundColor: '#fffaf0', width: '100vw', height: '100vh', flexShrink: 0, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflowY: 'auto' }}>
  <div className="story-stage-tracks-container" style={{ maxWidth: '1400px', width: '100%' }}>
    <div className="tracks-header-simple">
      <p>One school. Two ways to build.<br />You choose the dhandha that fits you.</p>
    </div>

    <div className="tracks-split-layout">
      {/* ─── Dukaan Card ─── */}
      <div className="track-frame-wrapper track-frame-dukaan">
        <img src="/dukaan_frame.png" alt="" aria-hidden="true" className="track-frame-img" />
        <div className="track-detail-card track-detail-yellow">
          <div className="track-top-tab track-top-tab-yellow">DUKAAN</div>
          <div className="track-detail-content">
            <span className="story-chip track-detail-chip">TRACK A</span>
            <h3 className="track-detail-title">DUKAAN</h3>
            <span className="track-detail-subtitle">Service Business</span>
            <hr className="track-divider" />
            <p className="track-detail-desc">Go to local MSMEs. Audit their digital presence — Google listings, reviews, WhatsApp. Fix it. Get paid.</p>
            <ul className="track-weeks-list">
              <li><span className="week-badge">W1</span> Spot &amp; audit</li>
              <li><span className="week-badge">W2</span> Propose &amp; fix</li>
              <li><span className="week-badge">W3</span> Deliver &amp; collect</li>
              <li><span className="week-badge">W4</span> Review &amp; iterate</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ─── Kaarkhana Card ─── */}
      <div className="track-frame-wrapper track-frame-kaarkhana">
        <img src="/kaarkhana_frame.png" alt="" aria-hidden="true" className="track-frame-img" />
        <div className="track-detail-card track-detail-red">
          <div className="track-detail-content">
            <span className="story-chip track-detail-chip">TRACK B</span>
            <h3 className="track-detail-title">KAARKHANA</h3>
            <span className="track-detail-subtitle">Product Business</span>
            <hr className="track-divider" />
            <p className="track-detail-desc">Build a mini merch company. Source, price, sell. Real product, real customers, real margins.</p>
            <ul className="track-weeks-list">
              <li><span className="week-badge">W1</span> Design &amp; source</li>
              <li><span className="week-badge">W2</span> Price &amp; brand</li>
              <li><span className="week-badge">W3</span> Launch &amp; sell</li>
              <li><span className="week-badge">W4</span> Deliver &amp; grow</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    {/* Decorative vectors */}
    <img src="/laptop.png" alt="" aria-hidden="true" className="floating-cutout cutout-tracks-laptop" />
    <img src="/medal.png" alt="" aria-hidden="true" className="floating-cutout cutout-tracks-medal" />
  </div>
</section>
