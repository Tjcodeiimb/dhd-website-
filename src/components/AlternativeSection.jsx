import React from 'react';

export default function AlternativeSection() {
  return (
    <section id="alt" className="alt-section">
      <div className="alt-container">
        {/* Left Column: Heading with highlighted word */}
        <h2 className="alt-title">
          So what's the <br /> <span className="alt-highlight-box">alternative</span><span className="alt-qmark">?</span>
        </h2>
        
        {/* Right Column: Description text */}
        <div className="alt-right-content">
          <div className="alt-text-box">
            <p className="alt-text">
              <strong>Honestly? Right now, nothing.</strong> There is no place in India that teaches you to build a business by making you build one. That gap is why Dhandha School exists.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
