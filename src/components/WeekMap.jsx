import React from 'react';

export default function WeekMap() {
  return (
    <section className="weekmap-section" id="weekmap">
      <div className="weekmap-inner">

        {/* Header */}
        <div className="weekmap-header">
          <h2 className="weekmap-title">
            <span className="wm-highlight-box yellow-highlight">FOUR WEEKS</span> THIS IS THE <span className="wm-highlight-box blue-highlight">MAP</span>
          </h2>
          <div className="weekmap-subtitle-box">
            Sessions run down the centre. Your track's checkpoint flanks left or right.
          </div>
        </div>

        {/* Timeline Grid Wrapped in a Box (Desktop Only) */}
        <div className="wm-main-box desktop-only">
          <div className="wm-timeline">
          
          {/* Column 1 */}
          <div className="wm-col">
            <div className="wm-bar wm-black">
              <span className="wm-bar-text">Week</span>
            </div>
            <div className="wm-cell">
              <div className="wm-week-box wm-week-1">
                <span className="wm-wno">Week 1</span>
                <strong className="wm-theme">Understand The Basics</strong>
              </div>
            </div>
            <div className="wm-cell">
              <div className="wm-week-box wm-week-2">
                <span className="wm-wno">Week 2</span>
                <strong className="wm-theme">Learn To Play The Game</strong>
              </div>
            </div>
            <div className="wm-cell">
              <div className="wm-week-box wm-week-3">
                <span className="wm-wno">Week 3</span>
                <strong className="wm-theme">Build Your Unfair Advantage</strong>
              </div>
            </div>
            <div className="wm-cell">
              <div className="wm-week-box wm-week-4">
                <span className="wm-wno">Week 4</span>
                <strong className="wm-theme">Get Legally Ready</strong>
              </div>
            </div>
          </div>

          {/* Divider 1 */}
          <div className="wm-v-divider-wrap">
            <div className="wm-v-divider"></div>
          </div>

          {/* Column 2 */}
          <div className="wm-col">
            <div className="wm-bar wm-blue">
              <span className="wm-bar-text">Sessions</span>
            </div>
            <div className="wm-cell">
              <span className="wm-sessions">Strategy 1 &middot; Marketing 1 &middot; Finance 1</span>
            </div>
            <div className="wm-cell">
              <span className="wm-sessions">Sales 1 &middot; Founder Tech 1 &middot; Strategy 2</span>
            </div>
            <div className="wm-cell">
              <span className="wm-sessions">Founder Tech 2 &middot; Marketing 2</span>
            </div>
            <div className="wm-cell">
              <span className="wm-sessions">Finance 2 &middot; Audit &amp; Legal 1</span>
            </div>
          </div>

          {/* Divider 2 */}
          <div className="wm-v-divider-wrap">
            <div className="wm-v-divider"></div>
          </div>

          {/* Column 3 */}
          <div className="wm-col">
            <div className="wm-bar wm-green">
              <span className="wm-bar-text">Karkhana Checkpoint</span>
            </div>
            <div className="wm-cell">
              <p className="wm-checkpoint">Niche picked, product idea locked, supplier shortlist. <br /> 10 customer conversations.</p>
            </div>
            <div className="wm-cell">
              <p className="wm-checkpoint">Final design, supplier quote, pre-order page live.</p>
            </div>
            <div className="wm-cell">
              <p className="wm-checkpoint">Pre-order window open, first paid orders in.</p>
            </div>
            <div className="wm-cell">
              <p className="wm-checkpoint">Deliver orders. One-page P&amp;L. Demo pitch.</p>
            </div>
          </div>

          {/* Divider 3 */}
          <div className="wm-v-divider-wrap">
            <div className="wm-v-divider"></div>
          </div>

          {/* Column 4 */}
          <div className="wm-col">
            <div className="wm-bar wm-orange">
              <span className="wm-bar-text">SevaDaata checkpoint</span>
            </div>
            <div className="wm-cell">
              <p className="wm-checkpoint">Service picked, 25 target businesses listed. 10 customer conversations.</p>
            </div>
            <div className="wm-cell">
              <p className="wm-checkpoint">Offer packaged and priced, first 10 pitches made.</p>
            </div>
            <div className="wm-cell">
              <p className="wm-checkpoint">First paying client closed.</p>
            </div>
            <div className="wm-cell">
              <p className="wm-checkpoint">Deliver the work. One-page P&amp;L. Demo pitch.</p>
            </div>
          </div>

          </div>
        </div>

        {/* Mobile Vertical Timeline (0 horizontal scroll, 0 inner boxing, mobile-only) */}
        <div className="wm-mobile-timeline mobile-only">
          {/* Week 1 */}
          <div className="wm-mobile-week-card">
            <div className="wm-mobile-week-header wm-week-1">
              <span className="wm-wno">Week 1</span>
              <strong className="wm-theme">Understand The Basics</strong>
            </div>
            <div className="wm-mobile-week-body">
              <div className="wm-mobile-sub-block">
                <span className="wm-mobile-pill wm-blue-pill">SESSIONS</span>
                <span className="wm-mobile-sessions-text">Strategy 1 &middot; Marketing 1 &middot; Finance 1</span>
              </div>
              <div className="wm-mobile-sub-block">
                <span className="wm-mobile-pill wm-green-pill">KARKHANA CHECKPOINT</span>
                <p className="wm-mobile-checkpoint-text">Niche picked, product idea locked, supplier shortlist. 10 customer conversations.</p>
              </div>
              <div className="wm-mobile-sub-block">
                <span className="wm-mobile-pill wm-orange-pill">SEVADAATA CHECKPOINT</span>
                <p className="wm-mobile-checkpoint-text">Service picked, 25 target businesses listed. 10 customer conversations.</p>
              </div>
            </div>
          </div>

          {/* Week 2 */}
          <div className="wm-mobile-week-card">
            <div className="wm-mobile-week-header wm-week-2">
              <span className="wm-wno">Week 2</span>
              <strong className="wm-theme">Learn To Play The Game</strong>
            </div>
            <div className="wm-mobile-week-body">
              <div className="wm-mobile-sub-block">
                <span className="wm-mobile-pill wm-blue-pill">SESSIONS</span>
                <span className="wm-mobile-sessions-text">Sales 1 &middot; Founder Tech 1 &middot; Strategy 2</span>
              </div>
              <div className="wm-mobile-sub-block">
                <span className="wm-mobile-pill wm-green-pill">KARKHANA CHECKPOINT</span>
                <p className="wm-mobile-checkpoint-text">Final design, supplier quote, pre-order page live.</p>
              </div>
              <div className="wm-mobile-sub-block">
                <span className="wm-mobile-pill wm-orange-pill">SEVADAATA CHECKPOINT</span>
                <p className="wm-mobile-checkpoint-text">Offer packaged and priced, first 10 pitches made.</p>
              </div>
            </div>
          </div>

          {/* Week 3 */}
          <div className="wm-mobile-week-card">
            <div className="wm-mobile-week-header wm-week-3">
              <span className="wm-wno">Week 3</span>
              <strong className="wm-theme">Build Your Unfair Advantage</strong>
            </div>
            <div className="wm-mobile-week-body">
              <div className="wm-mobile-sub-block">
                <span className="wm-mobile-pill wm-blue-pill">SESSIONS</span>
                <span className="wm-mobile-sessions-text">Founder Tech 2 &middot; Marketing 2</span>
              </div>
              <div className="wm-mobile-sub-block">
                <span className="wm-mobile-pill wm-green-pill">KARKHANA CHECKPOINT</span>
                <p className="wm-mobile-checkpoint-text">Pre-order window open, first paid orders in.</p>
              </div>
              <div className="wm-mobile-sub-block">
                <span className="wm-mobile-pill wm-orange-pill">SEVADAATA CHECKPOINT</span>
                <p className="wm-mobile-checkpoint-text">First paying client closed.</p>
              </div>
            </div>
          </div>

          {/* Week 4 */}
          <div className="wm-mobile-week-card">
            <div className="wm-mobile-week-header wm-week-4">
              <span className="wm-wno">Week 4</span>
              <strong className="wm-theme">Get Legally Ready</strong>
            </div>
            <div className="wm-mobile-week-body">
              <div className="wm-mobile-sub-block">
                <span className="wm-mobile-pill wm-blue-pill">SESSIONS</span>
                <span className="wm-mobile-sessions-text">Finance 2 &middot; Audit &amp; Legal 1</span>
              </div>
              <div className="wm-mobile-sub-block">
                <span className="wm-mobile-pill wm-green-pill">KARKHANA CHECKPOINT</span>
                <p className="wm-mobile-checkpoint-text">Deliver orders. One-page P&amp;L. Demo pitch.</p>
              </div>
              <div className="wm-mobile-sub-block">
                <span className="wm-mobile-pill wm-orange-pill">SEVADAATA CHECKPOINT</span>
                <p className="wm-mobile-checkpoint-text">Deliver the work. One-page P&amp;L. Demo pitch.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
