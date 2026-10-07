import React from 'react';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function Navbar({ navigate }) {
  const scrollToFaq = (smooth = true) => {
    const el = document.getElementById('faq');
    const smoother = ScrollSmoother.get();
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
    if (smoother && el) {
      smoother.scrollTo(el, smooth);
    } else if (el) {
      el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
    }
  };

  return (
    <header className="global-navbar">
      <div className="navbar-container">
        <span 
          className="logo" 
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        >
          <img src="/logo-ink.png" alt="Dhandha School" style={{ height: '30px', width: 'auto', display: 'block' }} />
        </span>
        <nav className="navbar-links">
          <button 
            className="nav-link mono" 
            onClick={() => navigate('/read-this')}
          >
            Read This
          </button>
          <button 
            className="nav-link mono" 
            onClick={() => {
              if (window.location.pathname === '/') {
                scrollToFaq(true);
              } else {
                navigate('/', { skipScroll: true });
                const waitForFaq = setInterval(() => {
                  const el = document.getElementById('faq');
                  if (el) {
                    clearInterval(waitForFaq);
                    scrollToFaq(true);

                    setTimeout(() => {
                      scrollToFaq(true);
                    }, 300);

                    setTimeout(() => {
                      scrollToFaq(true);
                    }, 750);
                  }
                }, 50);
                setTimeout(() => clearInterval(waitForFaq), 5000);
              }
            }}
          >
            FAQ
          </button>
          <a 
            className="nav-btn btn-primary" 
            href="/apply" 
            onClick={(e) => {
              e.preventDefault();
              navigate('/apply');
            }}
          >
            Apply
          </a>
        </nav>
      </div>
    </header>
  );
}
