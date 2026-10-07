import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export default function ScrollPlane() {
  useEffect(() => {
    // Get the image elements
    const startImg = document.getElementById('plane-start-img');
    const endImg = document.getElementById('plane-end-img');
    const floatingPlane = document.getElementById('floating-scroll-plane');

    if (!floatingPlane) return;

    let startX = 0;
    let endX = 0;
    let startY = 0;
    let endY = 0;
    let Y_MID = 0;

    // Path ratios and cruise offset variables (calculated dynamically on refresh)
    let ARC_RELEASE = 0.20;
    let ARC_LANDING = 0.91;
    let radiusX = 100;
    let slideDistance = 135;

    const getScrollY = () => {
      const smoother = ScrollSmoother.get();
      return smoother ? smoother.scrollTop() : window.scrollY;
    };

    const measureCoords = () => {
      const startEl = document.getElementById('plane-start-marker');
      const endEl = document.getElementById('plane-end-marker');
      if (!startEl || !endEl) return;

      const rectStart = startEl.getBoundingClientRect();
      const rectEnd = endEl.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const viewportW = window.innerWidth;

      const currentScrollY = getScrollY();
      const isMobile = viewportW <= 860;

      // Extract accurate horizontal points in viewport space and vertical offsets in document space
      // Since markers are styled absolute on the right edge, their centers are exactly the card boundaries.
      startX = rectStart.left + rectStart.width / 2;
      startY = rectStart.top + rectStart.height / 2 + currentScrollY;
      endX = rectEnd.left + rectEnd.width / 2;
      endY = rectEnd.top + rectEnd.height / 2 + currentScrollY;
      Y_MID = viewportH * 0.45;

      // Calculate path ratios dynamically from actual scroll distance
      const totalScrollDist = endY - startY;
      if (totalScrollDist > 300) {
        const exitDist = 180; // px of scroll dedicated to takeoff curve
        const landDist = 180; // px of scroll dedicated to landing curve
        
        ARC_RELEASE = exitDist / totalScrollDist;
        ARC_LANDING = 1 - (landDist / totalScrollDist);
      } else {
        ARC_RELEASE = 0.20;
        ARC_LANDING = 0.91;
      }

      // Keep the flight path visible inside the viewport on mobile.
      slideDistance = isMobile ? 56 : 135;
      radiusX = Math.min(viewportW - startX - (isMobile ? 28 : 100), isMobile ? 88 : 220);
      if (radiusX < slideDistance + (isMobile ? 8 : 25)) {
        radiusX = slideDistance + (isMobile ? 8 : 25);
      }
    };

    let st = null;
    let pollTimer = null;
    let attempts = 0;
    const MAX_ATTEMPTS = 20; // poll up to ~1000ms

    const applyPlaneProgress = (progress) => {
      const currentScrollY = getScrollY();

      // Current viewport coordinates of the takeoff and landing placeholders
      const yStartViewport = startY - currentScrollY;
      const yEndViewport = endY - currentScrollY;

      let x = startX;
      let y = Y_MID;
      let rotate = 90;

      if (progress < ARC_RELEASE) {
        // Phase A: Takeoff slides straight rightward out of the card first, then curves down
        const p = progress / ARC_RELEASE;
        const SLIDE_RATIO = 0.45;

        if (p < SLIDE_RATIO) {
          const t = p / SLIDE_RATIO;
          x = startX + t * slideDistance;
          y = yStartViewport;
          rotate = 90;
        } else {
          const t = (p - SLIDE_RATIO) / (1 - SLIDE_RATIO);
          const xReleaseStart = startX + slideDistance;
          x = xReleaseStart + Math.sin(t * Math.PI / 2) * (radiusX - slideDistance);
          y = yStartViewport + t * (Y_MID - yStartViewport);
          rotate = 90 + t * 90;
        }
      } else if (progress > ARC_LANDING) {
        // Phase C: Landing drops vertically first, then slides horizontally left into card
        const p = (progress - ARC_LANDING) / (1 - ARC_LANDING);
        const xCruise = startX + radiusX;
        const deltaX = xCruise - endX;
        x = xCruise - (1 - Math.cos(p * Math.PI / 2)) * deltaX;
        y = Y_MID + Math.sin(p * Math.PI / 2) * (yEndViewport - Y_MID);
        rotate = 180 + p * 90;
      } else {
        // Phase B: Perfectly vertical descent
        x = startX + radiusX;
        y = Y_MID;
        rotate = 180;
      }

      floatingPlane.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) rotate(${rotate}deg)`;
    };

    const init = () => {
      const startEl = document.getElementById('plane-start-marker');
      const endEl = document.getElementById('plane-end-marker');
      if ((!startEl || !endEl) && attempts < MAX_ATTEMPTS) {
        attempts++;
        pollTimer = setTimeout(init, 50);
        return;
      }

      if (!startEl || !endEl) return;

      // Markers are ready, so measure and create the trigger.
      measureCoords();
      if (startImg) startImg.style.opacity = '1';
      if (endImg) endImg.style.opacity = '0';
      floatingPlane.style.opacity = '0';
      floatingPlane.style.visibility = 'hidden';

      st = ScrollTrigger.create({
        trigger: "#plane-start-marker",
        endTrigger: "#plane-end-marker",
        start: "center 50%",
        end: "center 50%",
        scrub: true,
        invalidateOnRefresh: true,
        onRefresh: () => {
          measureCoords();
          applyPlaneProgress(st ? st.progress : 0);
        },
        onToggle: self => {
          if (self.isActive) {
            if (startImg) startImg.style.opacity = '0';
            if (endImg) endImg.style.opacity = '0';
            floatingPlane.style.opacity = '1';
            floatingPlane.style.visibility = 'visible';
          } else {
            floatingPlane.style.opacity = '0';
            floatingPlane.style.visibility = 'hidden';
            if (self.progress === 0) {
              if (startImg) startImg.style.opacity = '1';
              if (endImg) endImg.style.opacity = '0';
            } else if (self.progress === 1) {
              if (startImg) startImg.style.opacity = '0';
              if (endImg) endImg.style.opacity = '1';
            }
          }
        },
        onUpdate: self => {
          applyPlaneProgress(self.progress);
        }
      });

      // Force a refresh so ScrollTrigger re-reads all positions with smoother active
      ScrollTrigger.refresh();
    };

    // Start polling — ScrollSmoother may not be ready yet on first render
    pollTimer = setTimeout(init, 50);

    return () => {
      clearTimeout(pollTimer);
      st?.kill();
    };
  }, []);

  return (
    <div
      id="floating-scroll-plane"
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: '7.5rem',
        height: '4.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        pointerEvents: 'none',
        opacity: 0,
        visibility: 'hidden',
        willChange: 'transform'
      }}
    >
      <img
        src="/real_airplane.png"
        alt="Flying airplane scrolling animation"
        style={{
          width: '100%',
          height: 'auto',
          display: 'block'
        }}
      />
    </div>
  );
}
