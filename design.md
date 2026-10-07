# Design System & Motion Choreography

This document outlines the brand concept, visual design system, UI components, and GSAP motion choreography specifications for **Dhandha School (Revamp)**.

---

## 1. Brand Concept & Aesthetic Direction

The design of Dhandha School merges two diametrically opposed visual styles to create a high-impact, memorable user experience:

*   **Premium Academic Editorial (The Structure):** A clean, sophisticated layout referencing high-end academic journals, newspapers, and traditional editorial design. This style utilizes structured grids, generous margins, delicate dividers, and serif typography to communicate authority, credibility, and rigor.
*   **Playful Cartoon Paper-Cutout (The Energy):** A rebellious, tactile overlay consisting of paper-cutout sticker assets. These stickers feature thick off-black borders, slight tilts, offset drop shadows, and vibrant colors.

By overlaying playful stickers on a rigid, premium grid, we establish a visual tension that represents both high-quality business education (the "School") and real-world, street-smart execution (the "Dhandha").

---

## 2. Typography System

The typography creates contrast between modern UI clean lines, editorial elegance, and bold cartoon weight.

| Font | Category | Purpose / Usage | Styling Notes |
| :--- | :--- | :--- | :--- |
| **Hakobi** | Heavy Display | Major hero titles and section headers | All-caps, tight line height, massive font scale, slight letter spacing tracking |
| **New Spirit** | Premium Editorial | Body text highlights, subheadings, and blockquotes | Serif, high stroke contrast, elegant and academic character |
| **Poppins + Caveat** | Wordmark & Accents | Brand wordmark combination and handwritten notes | **Poppins** for clean geometric structure, **Caveat** for casual, handwritten sticker annotations |
| **Plus Jakarta Sans** | Interface / Secondary | Sub-headers, metadata, labels, and small cards | Modern, geometric sans-serif with excellent legibility |
| **Inter** | Primary Body | Standard body paragraphs, FAQ content, list details | Clean, highly legible, optimized for screen reading |

---

## 3. Color Palette

The color system relies on a high-contrast background and text pairing, punctuated by a vibrant set of modular colors applied to stickers, badges, and UI active states.

### Core Theme
*   **Primary Canvas:** `Sandbox Cream` (`#fbf9f4`) — A warm, tactile, premium paper-like tone that replaces cold pure whites.
*   **Primary Contrast:** `Off-black` (`#1a1a1a`) — A soft, ink-like dark tone that avoids the harshness of pure black (`#000000`) while maintaining maximum accessibility.

### Module & Sticker Accents
Vibrant accent tones with thick off-black borders:
*   🟡 **Yellow:** High energy, primary actions, and highlight states.
*   🔵 **Blue:** Module cards representing structure, systems, and credibility.
*   🌸 **Pink:** Bold Call-To-Action (CTA) elements, badges, and standout stickers.
*   🟣 **Purple:** Premium modules, guest masterclasses, and unique offerings.
*   🟢 **Green:** Reserved for financial references, value propositions, and action links.

---

## 4. GSAP Motion Choreography

The user experience is highly interactive, utilizing GSAP (GreenSock Animation Platform) and ScrollTrigger to choreograph the entrance and interaction of page elements.

### Initial 6-Sticker Scroll Lock
To guarantee user interaction with key branding assets before they navigate the site, a scroll-lock mechanism is established:
1.  **Viewport Pinning:** On initial load, vertical scrolling is disabled on the `body` (`overflow: hidden`).
2.  **Sticker Interaction:** Six custom cartoon stickers are displayed in the viewport. Each sticker is interactive and registers a `click` event.
3.  **Pop & Count:** When clicked, the sticker plays a springy pop animation (`GSAP scale: 1.2 -> 0.9 -> 1.0` and a random tilt rotation between `-15deg` and `15deg`) and registers as "popped".
4.  **Unlock:** Once all six stickers have been clicked/popped, the `body` scroll lock is removed. An animated arrow indicates that the user can now scroll down.

### Horizontal Sliding Panels
The key narrative sections of the page (`#why`, `#masterclass`, `#whatsnext`) are laid out horizontally:
*   **Pinning Track:** GSAP `ScrollTrigger` pins the section in place.
*   **X-Translation:** As the user scrolls vertically, the container translates horizontally along the X-axis:
    ```javascript
    gsap.to(".horizontal-container", {
      xPercent: -100 * (panels.length - 1),
      ease: "none",
      scrollTrigger: {
        trigger: ".horizontal-wrapper",
        pin: true,
        scrub: 1,
        end: () => "+=" + document.querySelector(".horizontal-container").offsetWidth
      }
    });
    ```
*   **Parallax Stickers:** Embedded sticker elements slide at slightly offset speeds (`data-speed` attribute) to provide a layered, 3D paper-cutout depth.

### Instructor Blur-Reveal & Background Shifting
In the instructor credentials section:
*   **Blur Reveal:** A GSAP timeline progressively removes a heavy Gaussian blur (`filter: blur(10px) -> blur(0px)`) and fades in instructor details as they enter the viewport.
*   **Credential Hover Shifting:** Hovering over specific credentials (e.g., *IISc*, *IIM*, *McKinsey*) shifts the background overlay gradient color dynamically to match the institution’s tone (e.g., deep maroon for academic IISc, gold for executive IIM, or deep navy for McKinsey), returning to Sandbox Cream on mouse leave.

### Smooth Scroll & Cartoon Offsets
*   **ScrollSmoother:** Built on top of GSAP, offering smooth momentum scrolling with customizable damping (e.g., `smooth: 1.5`, `effects: true`).
*   **Floating Offset Effect:** Cartoon stickers float slightly up or down relative to the scroll speed, creating a loose, organic paper-craft feel.

---

## 5. UI Components & Layout

### Fullscreen Overlay Menu
*   A responsive menu that triggers on menu button click, covering the screen in `Off-black` with large typography links in `Sandbox Cream`.
*   Includes close triggers, keyboard focus traps, and accessible close actions.

### 2x2 Curriculum Grid
*   A responsive grid containing the course syllabus modules.
*   Each card features a thick 2px `Off-black` border, a customized module background color, and a sticker-style badge header.

### Accessible FAQ Accordion
*   Built with standard semantic elements (`<details>` and `<summary>` or custom keyboard-navigable headers).
*   Utilizes ARIA labels (`aria-expanded`, `aria-controls`).
*   Transitions are animated using GSAP to smoothly interpolate height from `0` to `auto` upon expansion.

---

## 6. Responsive Adaptations

To maintain optimal performance and accessibility, the site adapts dynamically for screens `<= 768px`:

*   **Linear Collapse:** Horizontal sliding tracks (`#why`, `#masterclass`, `#whatsnext`) are disabled. The panels stack vertically in a linear layout.
*   **GSAP MatchMedia:** High-performance media queries disable scroll-pinning and translate animations on mobile:
    ```javascript
    let mm = gsap.matchMedia();
    mm.add("(min-width: 769px)", () => {
      // Horizontal pinning & heavy parallax animations
    });
    mm.add("(max-width: 768px)", () => {
      // Linear layout, no pins, simple fade-ins
    });
    ```
*   **Sticker Reduction:** Parallax offsets are disabled, and heavy floating physics are simplified to static sticker layouts to avoid lag on mobile GPU renderers.
