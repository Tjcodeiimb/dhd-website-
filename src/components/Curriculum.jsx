import React, { useRef, useEffect } from 'react';

const DISCIPLINES = [
  { name: 'Marketing',      count: 2, desc: 'Learn how to be omnipresent.' },
  { name: 'Strategy',       count: 2, desc: 'Understand what games you will play and how to win them.' },
  { name: 'Finance',        count: 2, desc: 'Learn the business language so you are never suprised.' },
  { name: 'Sales',          count: 1, desc: 'Learn how to close. Most important.' },
  { name: 'Founder Tech',   count: 2, desc: 'Learn the relevant tools & move fast with AI.' },
  { name: 'Audit & Legal',  count: 1, desc: 'GST/other docs: Get on top of all legality' },
];

export default function Curriculum() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const marquee = section.querySelector('.curriculum-marquee-inner');
    if (!marquee) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        marquee.classList.toggle('marquee-paused', !entry.isIntersecting);
      },
      { threshold: 0 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="curriculum-section" id="curriculum" ref={sectionRef}>
      <div className="curriculum-main-box">
        <div className="curriculum-marquee">
          <div className="curriculum-marquee-inner">
            {[...Array(4)].map((_, i) => (
              <div className="curriculum-marquee-content" key={i} aria-hidden={i > 0 ? "true" : undefined}>
                <span className="marquee-item">LEARN BY BUILDING</span>
                <span className="marquee-item">✦</span>
                <span className="marquee-item">PRACTICALITY OVER THEORY</span>
                <span className="marquee-item">✦</span>
                <span className="marquee-item">INDIAN CASE STUDIES</span>
                <span className="marquee-item">✦</span>
                <span className="marquee-item">REAL BUSINESSES</span>
                <span className="marquee-item">✦</span>
              </div>
            ))}
          </div>
        </div>

        <div className="curriculum-container">
          {/* Left Column: Heading and copy */}
          <div className="curriculum-left">
            <h2 className="curriculum-title">
              The classroom: <span className="curriculum-highlight-box yellow-highlight">10 live sessions</span>
            </h2>
            <p className="curriculum-text-box">
              Every session is live, taught with Indian case studies and dhandha you can use the same week.
            </p>
            <p className="curriculum-footnote mono">
              Full session-by-session syllabus drops before applications close.
            </p>
          </div>

          {/* Right Column: Grid of discipline cards */}
          <div className="curriculum-right">
            <div className="curriculum-disc-grid">
              {DISCIPLINES.map(({ name, count, desc }) => (
                <div className="curriculum-disc-card" key={name}>
                  <div className="curriculum-disc-left">
                    <span className="curriculum-disc-num">{count}</span>
                  </div>
                  <div className="curriculum-disc-right">
                    <span className="curriculum-disc-name">{name}</span>
                    <span className="curriculum-disc-desc">{desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
