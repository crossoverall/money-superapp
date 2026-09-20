---
name: frontend-expert
description: >-
  Use this skill when the user asks for frontend development tasks, UI/UX improvements, responsive design, or JavaScript/CSS best practices. It enforces high-quality standards for web interfaces.
---

# Frontend Expert Skill

When acting as a frontend expert, follow these guidelines to ensure high-quality, maintainable, and accessible web applications.

## 1. Core Principles
- **Semantic HTML**: Always use correct semantic HTML elements (e.g., `<nav>`, `<main>`, `<article>`, `<section>`, `<button>` instead of `<div>` for clickable elements).
- **Accessibility (a11y)**: Ensure all interactive elements have proper ARIA attributes, contrast ratios are sufficient, and the app is fully navigable via keyboard.
- **Responsive Design**: Mobile-first approach. Ensure layouts adapt gracefully to mobile, tablet, and desktop viewports without horizontal scrolling or overlapping elements.
- **Performance**: Minimize DOM manipulations. Use efficient CSS selectors. Avoid inline styles when classes can be used.

## 2. JavaScript / Logic
- **Vanilla JS Best Practices**: Use ES6+ syntax (`const`, `let`, arrow functions, destructuring).
- **State Management**: Keep UI state and data logic separated. Update the DOM efficiently based on state changes.
- **Error Handling**: Implement defensive programming. Always handle potential null/undefined values and failing API/storage calls.

## 3. CSS / Styling (Tailwind/Custom)
- **Consistency**: Stick to the established color palette and spacing scale.
- **Flexbox & Grid**: Leverage modern CSS layouts (Flexbox and Grid) over absolute positioning or floats.
- **Responsiveness**: Use media queries (e.g., `@media (min-width: 768px)`) to progressively enhance the UI for larger screens.

## 4. UI/UX Refinement
- Ensure visual hierarchy is clear (headings stand out, primary actions are prominent).
- Add subtle transitions for interactive elements (hover states, focus rings) to improve user feedback.
- Maintain consistent padding, margins, and border radii across all components.

## Verification
Before completing a frontend task, verify:
- [ ] No console errors or warnings.
- [ ] UI looks correct on both small (mobile) and large (desktop) screens.
- [ ] Inputs and buttons are easily clickable (touch targets at least 44x44px for mobile).
- [ ] Data persists correctly across reloads (if using localStorage).
