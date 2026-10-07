import React, { useEffect, useRef, useState, useMemo } from 'react';

const ART_DIRECTED_FRAME_ITEMS = [
  // Top Edge (4 items)
  { src: '/KK_frame_5.png', alt: 'Delivery Truck', class: 'piece-top-1 size-large' },
  { src: '/KK_frame_2.png', alt: 'Barcode Scanner', class: 'piece-top-2 size-medium' },
  { src: '/KK_frame_3.png', alt: 'Metal Gear', class: 'piece-top-3 size-medium' },
  { src: '/KK_frame_4.png', alt: 'Laptop', class: 'piece-top-4 size-medium' },

  // Right Edge (3 items)
  { src: '/KK_frame_7.png', alt: 'Cardboard Box', class: 'piece-right-1 size-large' },
  { src: '/KK_frame_1.png', alt: 'Thread Spool', class: 'piece-right-2 size-small' },
  { src: '/KK_frame_2.png', alt: 'Barcode Scanner', class: 'piece-right-3 size-medium' },

  // Bottom Edge (4 items)
  { src: '/KK_frame_5.png', alt: 'Delivery Truck', class: 'piece-bottom-1 size-large' },
  { src: '/KK_frame_3.png', alt: 'Metal Gear', class: 'piece-bottom-2 size-medium' },
  { src: '/KK_frame_2.png', alt: 'Barcode Scanner', class: 'piece-bottom-3 size-medium' },
  { src: '/KK_frame_7.png', alt: 'Cardboard Box', class: 'piece-bottom-4 size-large' },

  // Left Edge (3 items)
  { src: '/KK_frame_4.png', alt: 'Laptop', class: 'piece-left-1 size-medium' },
  { src: '/KK_frame_6.png', alt: 'Tag Label', class: 'piece-left-2 size-small' },
  { src: '/KK_frame_3.png', alt: 'Metal Gear', class: 'piece-left-3 size-medium' }
];

function useScrollPath(_d) {
  const pathRef = useRef(null);
  const [dashOffset, setDashOffset] = useState(0);
  const [dashLength, setDashLength] = useState(0);

  useEffect(() => {
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      setDashLength(length);
      setDashOffset(length);
    }

    const handleScroll = () => {
      if (!pathRef.current || !dashLength) return;
      const rect = pathRef.current.getBoundingClientRect();
      const viewHeight = window.innerHeight;

      const start = viewHeight;
      const end = viewHeight / 2;

      if (rect.top > start) {
        setDashOffset(dashLength);
      } else if (rect.top < end) {
        setDashOffset(0);
      } else {
        const pct = (rect.top - end) / (start - end);
        setDashOffset(dashLength * pct);
      }
    };

    window.addEventListener('scroll', handleScroll);
    setTimeout(handleScroll, 100);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [dashLength]);

  return { pathRef, dashLength, dashOffset };
}

export default function Tracks() {
  const leftRoad = useScrollPath("M280 4 L280 26 C 280 56, 150 50, 148 86");
  const rightRoad = useScrollPath("M280 26 C 280 56, 410 50, 412 86");



  return (
    <div className="tracks-section" id="tracks">
      <div className="tracks-container">
        <h2 className="tracks-title">
          One school <span className="tracks-highlight-box yellow-highlight">Two tracks</span> Pick yours
        </h2>
        <svg className="fork-svg" width="560" height="90" viewBox="0 0 560 90" aria-hidden="true">
          <defs>
            {/* Left Road Mask */}
            <mask id="road-mask-left">
              <path
                ref={leftRoad.pathRef}
                d="M280 4 L280 26 C 280 56, 150 50, 148 86"
                fill="none"
                stroke="#fff"
                strokeWidth="34"
                strokeLinecap="round"
                style={{
                  strokeDasharray: leftRoad.dashLength,
                  strokeDashoffset: leftRoad.dashOffset,
                  transition: 'stroke-dashoffset 0.1s ease-out'
                }}
              />
            </mask>

            {/* Right Road Mask */}
            <mask id="road-mask-right">
              <path
                ref={rightRoad.pathRef}
                d="M280 26 C 280 56, 410 50, 412 86"
                fill="none"
                stroke="#fff"
                strokeWidth="34"
                strokeLinecap="round"
                style={{
                  strokeDasharray: rightRoad.dashLength,
                  strokeDashoffset: rightRoad.dashOffset,
                  transition: 'stroke-dashoffset 0.1s ease-out'
                }}
              />
            </mask>
          </defs>

          {/* LAYER 1: OUTER BLACK BORDERS */}
          <g mask="url(#road-mask-left)">
            <path d="M280 4 L280 26 C 280 56, 150 50, 148 86" fill="none" stroke="#000" strokeWidth="28" strokeLinecap="round" />
          </g>
          <g mask="url(#road-mask-right)">
            <path d="M280 26 C 280 56, 410 50, 412 86" fill="none" stroke="#000" strokeWidth="28" strokeLinecap="round" />
          </g>

          {/* LAYER 2: WHITE UNDERLAY (Creates thin white edge lines) */}
          <g mask="url(#road-mask-left)">
            <path d="M280 4 L280 26 C 280 56, 150 50, 148 86" fill="none" stroke="#FFFFFF" strokeWidth="24" strokeLinecap="round" />
          </g>
          <g mask="url(#road-mask-right)">
            <path d="M280 26 C 280 56, 410 50, 412 86" fill="none" stroke="#FFFFFF" strokeWidth="24" strokeLinecap="round" />
          </g>

          {/* LAYER 3: DARK ASPHALT PAVEMENT (Overlays borders to make fork seamless) */}
          <g mask="url(#road-mask-left)">
            <path d="M280 4 L280 26 C 280 56, 150 50, 148 86" fill="none" stroke="#3A3A3A" strokeWidth="20" strokeLinecap="round" />
          </g>
          <g mask="url(#road-mask-right)">
            <path d="M280 26 C 280 56, 410 50, 412 86" fill="none" stroke="#3A3A3A" strokeWidth="20" strokeLinecap="round" />
          </g>

          {/* LAYER 4: DASHED MARKINGS */}
          {/* Main vertical trunk lane line - meets split at Y=26 */}
          <g mask="url(#road-mask-left)">
            <path d="M280 4 L280 26" fill="none" stroke="#FFD166" strokeWidth="2" strokeDasharray="4 6" strokeLinecap="butt" />
          </g>
          {/* Left branch center line - continuous from the split */}
          <g mask="url(#road-mask-left)">
            <path d="M280 26 C 280 56, 150 50, 148 86" fill="none" stroke="#FFD166" strokeWidth="2" strokeDasharray="4 6" strokeLinecap="butt" />
          </g>
          {/* Right branch center line - continuous from the split */}
          <g mask="url(#road-mask-right)">
            <path d="M280 26 C 280 56, 410 50, 412 86" fill="none" stroke="#FFD166" strokeWidth="2" strokeDasharray="4 6" strokeLinecap="butt" />
          </g>

          {/* End Nodes (Blue for Karkhana, Pink for Sevadaata) */}
          <circle cx="148" cy="86" r="7" fill="#B4D5FE" stroke="#000" strokeWidth="2.5" />
          <circle cx="412" cy="86" r="7" fill="#FFB3D9" stroke="#000" strokeWidth="2.5" />
        </svg>

        <div className="tracks">
          <div className="track maker-track">
            <div className="kk-hover-corners" aria-hidden="true">
              <img src="/KK_frame_5.png" alt="Delivery Truck" className="kk-hover-corner corner-tl" />
              <img src="/KK_frame_7.png" alt="Cardboard Box" className="kk-hover-corner corner-tr" />
              <img src="/KK_frame_2.png" alt="Barcode Scanner" className="kk-hover-corner corner-br" />
              <img src="/KK_frame_4.png" alt="Laptop" className="kk-hover-corner corner-bl" />
            </div>

            <h3>
              <span className="tracks-highlight-box blue-highlight">KARKHANA</span>
            </h3>
            <p>You build a merchandise brand for a community you belong to: your college, your city, your fandom. Design, suppliers, pre-orders, margins. One rule is iron: you never print what nobody has paid for.</p>
            <p>This is a product-led business track meant to teach you supplier math, margin profile, design choices, landing pages, etc.</p>
            <span className="cap mono">Capital: a few thousand ₹, mostly collected from customers first</span>
          </div>

          <div className="track skills-track">
            <div className="kk-hover-corners" aria-hidden="true">
              <img src="/SD_frame_1.png" alt="Sevadaata 1" className="kk-hover-corner corner-tl" />
              <img src="/SD_frame_2.png" alt="Sevadaata 2" className="kk-hover-corner corner-tr" />
              <img src="/SD_frame_3.png" alt="Sevadaata 3" className="kk-hover-corner corner-br" />
              <img src="/SD_frame_4.png" alt="Sevadaata 4" className="kk-hover-corner corner-bl" />
            </div>

            <h3>
              <span className="tracks-highlight-box pink-highlight">SEVADAATA</span>
            </h3>
            <p>India has over 6 crore small businesses, and most run on instinct. You pick a skill they need, package it as a service, price it, and land your first paying client. Sell to the shops around you.</p>
            <p>This is a service-led business track meant to teach you how to spot paying problems and package solutions.</p>
            <span className="cap mono">Capital: ₹0</span>
          </div>
        </div>
        <p className="join-line">Sessions are combined across tracks. Checkpoints are separate.</p>
      </div>
    </div>
  );
}
