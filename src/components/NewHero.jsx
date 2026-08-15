import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, MotionPathPlugin);

function ScrollDashedPath({ d, width, height, className }) {
  const pathRef = useRef(null);
  const [dashOffset, setDashOffset] = useState(0);
  const [dashLength, setDashLength] = useState(0);
  const maskId = useRef(`mask-${Math.random().toString(36).substring(2, 9)}`).current;

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

  return (
    <svg className={className} width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      <defs>
        <mask id={maskId}>
          <path
            ref={pathRef}
            d={d}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="12"
            strokeLinecap="round"
            style={{
              strokeDasharray: `${dashLength} ${dashLength}`,
              strokeDashoffset: dashOffset,
              transition: 'stroke-dashoffset 0.1s ease-out'
            }}
          />
        </mask>
      </defs>
      <path
        d={d}
        fill="none"
        stroke="#1C1B17"
        strokeWidth="3"
        strokeDasharray="6 6"
        strokeLinecap="round"
        mask={`url(#${maskId})`}
      />
    </svg>
  );
}

export default function NewHero({ navigate, isDesktopViewport }) {
  const heroRef = useRef(null);
  const [activeStep, setActiveStep] = useState(16);
  const step16Ref = useRef(null);
  const step18Ref = useRef(null);
  const step22Ref = useRef(null);
  const boy1GroupRef = useRef(null);
  const boy1CircleRef = useRef(null);
  const boy1FaceRef = useRef(null);
  const boy2GroupRef = useRef(null);
  const boy2CircleRef = useRef(null);
  const boy2FaceRef = useRef(null);
  const boy3GroupRef = useRef(null);
  const boy3CircleRef = useRef(null);
  const boy3FaceRef = useRef(null);
  const box16Ref = useRef(null);
  const box18Ref = useRef(null);
  const box22Ref = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!step16Ref.current || !step18Ref.current || !step22Ref.current) return;

      const r16 = step16Ref.current.getBoundingClientRect();
      const r18 = step18Ref.current.getBoundingClientRect();
      const r22 = step22Ref.current.getBoundingClientRect();

      const focusLine = window.innerHeight * 0.55;

      const d16 = Math.abs(r16.top + r16.height / 2 - focusLine);
      const d18 = Math.abs(r18.top + r18.height / 2 - focusLine);
      const d22 = Math.abs(r22.top + r22.height / 2 - focusLine);

      if (window.scrollY < 50) {
        setActiveStep(16);
      } else if (d16 <= d18 && d16 <= d22) {
        setActiveStep(16);
      } else if (d18 <= d16 && d18 <= d22) {
        setActiveStep(18);
      } else {
        setActiveStep(22);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useLayoutEffect(() => {
    if (!isDesktopViewport) {
      return undefined;
    }

    let ctx;
    let initTimer;
    let attempts = 0;
    const maxAttempts = 20;

    const initDesktopHeroAnimation = () => {
      ctx = gsap.context(() => {
        gsap.set(box16Ref.current, { opacity: 1 });
        gsap.set([box18Ref.current, box22Ref.current], { opacity: 0 });
        gsap.set([boy1GroupRef.current, boy2GroupRef.current, boy3GroupRef.current], { opacity: 1 });
        gsap.set([boy1CircleRef.current, boy2CircleRef.current, boy3CircleRef.current], { opacity: 1 });
        gsap.set([boy1FaceRef.current, boy2FaceRef.current, boy3FaceRef.current], { opacity: 0 });

        gsap.set(boy1GroupRef.current, {
          motionPath: { path: '#road-path', align: '#road-path', alignOrigin: [0.5, 0.5], start: 0, end: 0 },
        });
        gsap.set(boy2GroupRef.current, {
          motionPath: { path: '#road-path', align: '#road-path', alignOrigin: [0.5, 0.5], start: 0.5, end: 0.5 },
        });
        gsap.set(boy3GroupRef.current, {
          motionPath: { path: '#road-path', align: '#road-path', alignOrigin: [0.5, 0.5], start: 1, end: 1 },
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: '+=1500',
            scrub: 1,
            pin: true,
            pinSpacing: true,
          },
        });

        tl.to(boy1CircleRef.current, { opacity: 0, duration: 0.02 }, 0);
        tl.to(boy1FaceRef.current, { opacity: 1, duration: 0.02 }, 0);
        tl.to(box16Ref.current, { opacity: 1, duration: 0.05 }, 0);
        tl.to(
          boy1GroupRef.current,
          {
            motionPath: { path: '#road-path', align: '#road-path', alignOrigin: [0.5, 0.5], start: 0, end: 0.5 },
            duration: 0.5,
            ease: 'none',
          },
          0,
        );
        tl.set(boy1GroupRef.current, { opacity: 0 }, 0.5);

        tl.to(boy2CircleRef.current, { opacity: 0, duration: 0.02 }, 0.5);
        tl.to(boy2FaceRef.current, { opacity: 1, duration: 0.02 }, 0.5);
        tl.to(box18Ref.current, { opacity: 1, duration: 0.05 }, 0.5);
        tl.to(
          boy2GroupRef.current,
          {
            motionPath: { path: '#road-path', align: '#road-path', alignOrigin: [0.5, 0.5], start: 0.5, end: 1 },
            duration: 0.5,
            ease: 'none',
          },
          0.5,
        );
        tl.set(boy2GroupRef.current, { opacity: 0 }, 1.0);

        tl.to(boy3CircleRef.current, { opacity: 0, duration: 0.02 }, 0.98);
        tl.to(boy3FaceRef.current, { opacity: 1, duration: 0.02 }, 0.98);
        tl.to(box22Ref.current, { opacity: 1, duration: 0.05 }, 0.98);

        tl.progress(0);
      }, heroRef);
    };

    const waitForSmootherAndInit = () => {
      const smoother = ScrollSmoother.get();
      if (!smoother && attempts < maxAttempts) {
        attempts += 1;
        initTimer = setTimeout(waitForSmootherAndInit, 50);
        return;
      }

      initDesktopHeroAnimation();
      ScrollTrigger.refresh();
    };

    initTimer = setTimeout(waitForSmootherAndInit, 50);

    return () => {
      clearTimeout(initTimer);
      if (ctx) {
        try {
          ctx.revert();
        } catch (e) { }
      }
    };
  }, [isDesktopViewport]);

  return (
    <section className="new-hero-section" ref={heroRef}>
      <div className="new-hero-container">

        {/* Headline and Subtitle */}
        <div className="new-hero-content">
          <h1 className="new-hero-title">
            INDIA DOESN&rsquo;T HAVE AN <br />
            EDUCATION SYSTEM. <br />
            <span className="exam-highlight-box mobile-block-highlight">IT HAS AN EXAM SYSTEM.</span>
          </h1>
          <p className="new-hero-subtitle">
            You&rsquo;ve been its customer since you were 16.
          </p>

          {/* Desktop Actions */}
          <div className="new-hero-actions desktop-only">
            <a
              className="btn btn-primary"
              href="/apply"
              onClick={(e) => {
                e.preventDefault();
                navigate('/apply');
              }}
            >
              Apply For Cohort 2
            </a>
          </div>
        </div>

        {/* Desktop Pinned Road Graphic from earlier version */}
        <div className="new-hero-receipt-col desktop-only">
          <div className="hero-road-graphic" style={{ position: 'relative', margin: '0 auto', width: '100%', maxWidth: '350px' }}>
            <div className="hero-event-boxes">
              <div className="hero-event-box box-16" ref={box16Ref}>
                <p className="hero-event-text">Lakhs to a coaching institute to crack JEE/NEET.</p>
              </div>
              <div className="hero-event-box box-18" ref={box18Ref}>
                <p className="hero-event-text">9 out of 10 don't crack it. So: lakhs more, to a college you never wanted.</p>
              </div>
              <div className="hero-event-box box-22" ref={box22Ref}>
                <p className="hero-event-text">A job that barely covers living expenses. So you buy the next exam, CAT or UPSC.</p>
              </div>
            </div>

            <svg viewBox="0 0 200 300" className="road-svg">
              <path
                id="road-path"
                d="M 10 10 L 190 10 L 190 150 L 10 150 L 10 290 L 190 290"
                fill="none"
                stroke="#1C1B17"
                strokeWidth="4"
                strokeDasharray="12 12"
                strokeLinecap="round"
                className="road-dashed-line"
              />
              <g style={{ fontFamily: 'Poppins, sans-serif' }}>
                <g ref={boy1GroupRef}>
                  <g ref={boy1CircleRef}>
                    <circle cx="0" cy="0" r="18" fill="#ffffff" stroke="#f97316" strokeWidth="3.5" />
                    <text x="0" y="0" textAnchor="middle" dy=".35em" fontSize="15" fontWeight="800" fill="#1C1B17">16</text>
                  </g>
                  <g ref={boy1FaceRef} style={{ opacity: 0 }}>
                    <image href="/boy16.png" x="-24" y="-24" width="48" height="48" preserveAspectRatio="xMidYMid meet" />
                  </g>
                </g>

                <g ref={boy2GroupRef}>
                  <g ref={boy2CircleRef}>
                    <circle cx="0" cy="0" r="18" fill="#ffffff" stroke="#f97316" strokeWidth="3.5" />
                    <text x="0" y="0" textAnchor="middle" dy=".35em" fontSize="15" fontWeight="800" fill="#1C1B17">18</text>
                  </g>
                  <g ref={boy2FaceRef} style={{ opacity: 0 }}>
                    <image href="/boy18.png" x="-24" y="-24" width="48" height="48" preserveAspectRatio="xMidYMid meet" />
                  </g>
                </g>

                <g ref={boy3GroupRef}>
                  <g ref={boy3CircleRef}>
                    <circle cx="0" cy="0" r="18" fill="#ffffff" stroke="#f97316" strokeWidth="3.5" />
                    <text x="0" y="0" textAnchor="middle" dy=".35em" fontSize="15" fontWeight="800" fill="#1C1B17">22</text>
                  </g>
                  <g ref={boy3FaceRef} style={{ opacity: 0 }}>
                    <image href="/boy22.png" x="-24" y="-24" width="48" height="48" preserveAspectRatio="xMidYMid meet" />
                  </g>
                </g>
              </g>
            </svg>
          </div>
        </div>

        {/* Mobile receipt layout stays as-is */}
        <div className="hero-receipt-column mobile-only">
          <div className="hero-receipt-card unboxed">
            <div
              ref={step16Ref}
              className={`receipt-stop ${activeStep === 16 ? 'is-active step-16-active' : ''}`}
            >
              <span className="receipt-dot">16</span>
              <div className="receipt-body-box">
                <p className="receipt-body">
                  <strong>At 16.</strong> Lakhs to a coaching institute, to crack JEE/NEET.
                </p>
              </div>
            </div>

            <ScrollDashedPath
              className="receipt-curve curve-1"
              width={160}
              height={50}
              d="M 20 2 C 20 28, 110 20, 110 46"
            />

            <div
              ref={step18Ref}
              className={`receipt-stop shift-right ${activeStep === 18 ? 'is-active step-18-active' : ''}`}
            >
              <span className="receipt-dot">18</span>
              <div className="receipt-body-box">
                <p className="receipt-body">
                  <strong>At 18.</strong> 9 out of 10 don't crack it. So: lakhs more, to a college you never wanted.
                </p>
              </div>
            </div>

            <ScrollDashedPath
              className="receipt-curve curve-2"
              width={160}
              height={50}
              d="M 110 2 C 110 28, 20 20, 20 46"
            />

            <div
              ref={step22Ref}
              className={`receipt-stop ${activeStep === 22 ? 'is-active step-22-active' : ''}`}
            >
              <span className="receipt-dot">22</span>
              <div className="receipt-body-box">
                <p className="receipt-body">
                  <strong>At 22.</strong> A job that barely covers rent. So you buy the next exam. CAT. Or UPSC.
                </p>
              </div>
            </div>

            <p className="receipt-kicker">
              The system never runs out of exams to sell you.
            </p>
          </div>
        </div>

        {/* Mobile Bottom CTA Block */}
        <div className="mobile-hero-cta mobile-only">
          <a
            className="mobile-apply-black-btn"
            href="/apply"
            onClick={(e) => {
              e.preventDefault();
              navigate('/apply');
            }}
          >
            Apply For Cohort 2
          </a>
          <div className="mobile-pagebreak-dots">&bull; &bull; &bull;</div>
        </div>
      </div>
    </section>
  );
}
