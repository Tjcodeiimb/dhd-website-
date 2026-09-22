import React from 'react';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Footer.css';

export default function Footer({ navigate }) {
  const scrollToTarget = (targetId, smooth = true) => {
    const el = targetId === 'top' ? null : document.querySelector(targetId);
    const smoother = ScrollSmoother.get();
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
    if (smoother) {
      if (targetId === 'top') {
        smoother.scrollTo(0, smooth);
      } else if (el) {
        smoother.scrollTo(el, smooth);
      }
    } else {
      if (targetId === 'top') {
        window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' });
      } else if (el) {
        el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
      }
    }
  };

  const handleNavClick = (e, to) => {
    e.preventDefault();
    if (navigate) {
      navigate(to);
    }
  };

  const handleScrollTo = (e, targetId) => {
    e.preventDefault();
    if (targetId === 'top') {
      scrollToTarget('top', true);
      return;
    }
    if (window.location.pathname === '/') {
      scrollToTarget(targetId, true);
    } else {
      if (navigate) {
        navigate('/', { skipScroll: true });
      }
      const id = targetId.replace('#', '');
      const waitForEl = setInterval(() => {
        const el = document.getElementById(id);
        if (el) {
          clearInterval(waitForEl);
          scrollToTarget(targetId, true);

          setTimeout(() => {
            scrollToTarget(targetId, true);
          }, 300);

          setTimeout(() => {
            scrollToTarget(targetId, true);
          }, 750);
        }
      }, 50);
      setTimeout(() => clearInterval(waitForEl), 5000);
    }
  };

  return (
    <footer className="sec8-footer-bottom">
      <div className="sec8-footer-inner">
        {/* Main Grid */}
        <div className="sec8-footer-grid">
          {/* Column 1 (Brand) */}
          <div className="sec8-col sec8-col-brand">
            <div className="brand-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
              <img src="/logo-ink.png" alt="Dhandha School" className="footer-brand-img" />
            </div>
            <p className="brand-desc">
              A new kind of business school: practical, affordable, built for the people actually building things.
            </p>
          </div>

          {/* Column 2 (PROGRAM) */}
          <div className="sec8-col">
            <span className="sec8-col-title">PROGRAM</span>
            <ul className="footer-links">
              <li><a href="#tracks" onClick={(e) => handleScrollTo(e, '#tracks')}>Tracks</a></li>
              <li><a href="#curriculum" onClick={(e) => handleScrollTo(e, '#curriculum')}>Curriculum</a></li>
              <li><a href="#weekmap" onClick={(e) => handleScrollTo(e, '#weekmap')}>4-Week Map</a></li>
              <li><a href="#investor" onClick={(e) => handleScrollTo(e, '#investor')}>Finale / VCs</a></li>
            </ul>
          </div>

          {/* Column 3 (ABOUT) */}
          <div className="sec8-col">
            <span className="sec8-col-title">ABOUT</span>
            <ul className="footer-links">
              <li><a href="#alt" onClick={(e) => handleScrollTo(e, '#alt')}>Why We Exist</a></li>
              <li><a href="#beliefs" onClick={(e) => handleScrollTo(e, '#beliefs')}>Our Beliefs</a></li>
              <li><a href="/read-this" onClick={(e) => handleNavClick(e, '/read-this')}>Check Our Facts</a></li>
              <li><a href="#faq" onClick={(e) => handleScrollTo(e, '#faq')}>FAQ</a></li>
              <li><a href="/apply" onClick={(e) => handleNavClick(e, '/apply')}>Apply</a></li>
            </ul>
          </div>

          {/* Column 4 (Follow) */}
          <div className="sec8-col">
            <span className="sec8-col-title">FOLLOW</span>
            <ul className="footer-links">
              <li><a href="https://www.instagram.com/whybhanshu?igsh=NDBqajI0ZTFpOGxz" target="_blank" rel="noreferrer">Instagram</a></li>
              <li><a href="https://youtube.com/@whybhanshu?si=Pe16UZHShdl5GCx-" target="_blank" rel="noreferrer">YouTube</a></li>
              <li><a href="https://www.linkedin.com/in/vibhanshu-golia-298a3019a" target="_blank" rel="noreferrer">LinkedIn</a></li>
              <li><a href="https://discord.com/invite/FxDpfHG3Cc" target="_blank" rel="noreferrer">Discord</a></li>
            </ul>
          </div>

          {/* Column 5 (Back to top) */}
          <div className="sec8-col sec8-col-backtop">
            <button className="scroll-to-top-btn" onClick={(e) => handleScrollTo(e, 'top')} aria-label="Scroll to top">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="18 15 12 9 6 15"></polyline>
              </svg>
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="sec8-footer-bottom-bar">
          <div className="footer-copyright">
            © {new Date().getFullYear()} Dhandha School. All rights reserved.
          </div>
          <div className="footer-cohort-details">
            Cohort 2 • Seats Capped
          </div>
        </div>
      </div>
    </footer>
  );
}
