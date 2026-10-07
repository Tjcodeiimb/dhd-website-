import React, { useState, useEffect } from 'react';
import PillNav from './components/PillNav';
import NewHero from './components/NewHero';
import AlternativeSection from './components/AlternativeSection';
import Beliefs from './components/Beliefs';
import Offer from './components/Offer';
import Tracks from './components/Tracks';
import Curriculum from './components/Curriculum';
import WeekMap from './components/WeekMap';
import InvestorDay from './components/InvestorDay';
import ReadThis from './components/ReadThis';
import Apply from './components/Apply';
import ScrollPlane from './components/ScrollPlane';
import BottomSection from './components/BottomSection';
import Footer from './components/Footer';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import './index.css';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export default function App() {
  const [path, setPath] = useState(window.location.pathname);
  const [isDesktopViewport, setIsDesktopViewport] = useState(window.innerWidth > 768);

  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktopViewport(window.innerWidth > 768);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize GSAP ScrollSmoother ONLY on homepage ('/')
  React.useLayoutEffect(() => {
    let smoother = null;
    
    if (path === '/' && isDesktopViewport) {
      window.scrollTo(0, 0);
      try {
        if (typeof ScrollSmoother !== 'undefined' && ScrollSmoother.create) {
          smoother = ScrollSmoother.create({
            smooth: 0.8,
            effects: false,
            smoothTouch: 0.1
          });
          window.__smoother = smoother;
        }
      } catch (err) {
        console.warn('ScrollSmoother initialization skipped:', err);
      }
      setTimeout(() => {
        try {
          ScrollTrigger.refresh();
        } catch (e) {}
      }, 100);
    } else {
      if (window.__smoother) {
        try {
          window.__smoother.kill();
        } catch (e) {}
        window.__smoother = null;
      }
      // Clear all GSAP inline styles (transform, height, position) from wrappers
      gsap.set(['#smooth-wrapper', '#smooth-content'], { clearProps: 'all' });

      // Kill all active homepage ScrollTriggers & pin spacers
      ScrollTrigger.getAll().forEach(st => {
        try {
          st.kill(true);
        } catch (e) {}
      });
      document.querySelectorAll('.pin-spacer').forEach(el => {
        try {
          el.remove();
        } catch (e) {}
      });
      window.scrollTo(0, 0);
    }

    return () => {
      if (smoother) {
        try {
          smoother.kill();
        } catch (e) {}
        window.__smoother = null;
      }
    };
  }, [path, isDesktopViewport]);

  const navigate = (to, options = {}) => {
    // Revert and kill all active ScrollTriggers (unpins hero section synchronously)
    ScrollTrigger.getAll().forEach(st => {
      try {
        st.revert();
        st.kill();
      } catch (e) {}
    });

    if (window.__smoother) {
      try {
        window.__smoother.kill();
      } catch (e) {}
      window.__smoother = null;
    }

    gsap.set(['#smooth-wrapper', '#smooth-content'], { clearProps: 'all' });
    document.querySelectorAll('.pin-spacer').forEach(el => {
      try { el.remove(); } catch (e) {}
    });

    window.history.pushState({}, '', to);
    setPath(to);
    if (!options.skipScroll) {
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className={`app-root ${path === '/' || path === '/apply' ? 'is-home' : ''}`}>
      {/* Global Navigation */}
      <PillNav
        logo="Dhandha School"
        items={[
          { label: 'Read This', href: '/read-this' },
          { label: 'FAQ', href: '#faq' },
          { label: 'Apply', href: '/apply' }
        ]}
        activeHref={path}
        navigate={navigate}
        baseColor={path === '/' || path === '/apply' ? '#1C1B17' : 'var(--ink)'}
        pillColor={path === '/' || path === '/apply' ? '#FAF8F2' : 'var(--paper)'}
        pillTextColor={path === '/' || path === '/apply' ? '#1C1B17' : 'var(--ink)'}
        hoveredPillTextColor="#FFFFFF"
        initialLoadAnimation={true}
      />

      {/* ScrollSmoother viewport wrap */}
      <div id="smooth-wrapper">
        <div id="smooth-content">

          {/* Full-bleed New Hero Section at the top of homepage */}
          {path === '/' && (
            <>
              <NewHero
                key={isDesktopViewport ? 'hero-desktop' : 'hero-mobile'}
                navigate={navigate}
                isDesktopViewport={isDesktopViewport}
              />
              <AlternativeSection />
              <Beliefs navigate={navigate} />
              <Offer navigate={navigate} />
              <Tracks />
              <Curriculum />
              <WeekMap />
              <InvestorDay />
            </>
          )}

          {/* Full-bleed ReadThis Section */}
          {path === '/read-this' && (
            <ReadThis navigate={navigate} isStandalone={true} />
          )}

          {/* Full-bleed Apply Section */}
          {path === '/apply' && (
            <Apply navigate={navigate} isStandalone={true} />
          )}

          {/* Main Content Bounded Sheet */}
          {path !== '/' && path !== '/read-this' && path !== '/apply' && (
            <div className="sheet">
            </div>
          )}

          {path === '/' && (
            <>
              <BottomSection navigate={navigate} />
              <Footer navigate={navigate} />
            </>
          )}

        </div>
      </div>

      {path === '/' && <ScrollPlane key={isDesktopViewport ? 'plane-desktop' : 'plane-mobile'} />}
    </div>
  );
}
