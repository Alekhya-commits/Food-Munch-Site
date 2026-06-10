# Food Munch – Premium Organic Food Web Site

A sleek, responsive, single‑page restaurant showcase built with vanilla HTML, CSS, and JavaScript. The site features a modern glass‑morphism UI, dark/light theme toggle, live shopping cart, newsletter subscription, customer reviews, FAQ accordion, and a direct YouTube video link. All user state (cart, theme) persists across page reloads via a safe‑storage wrapper.

## Project Overview
Food Munch is a responsive web application that lets visitors explore an organic menu, add items to a cart, switch themes, and subscribe to updates—all without a backend. The design follows current UI trends (glass‑morphism, micro‑animations) and works flawlessly on desktop, tablet, and mobile browsers.

## Features
- Responsive layout – Bootstrap 5 grid with mobile‑first breakpoints.
- Dark / Light theme switch – Persists user choice via localStorage.
- Live shopping cart – Add/remove items, quantity stepper, real‑time total, toast notifications.
- Newsletter subscription – Email validation with instant success toast.
- Customer reviews – Star‑rated testimonial cards.
- FAQ accordion – Collapsible sections for common questions.
- Watch Video – Direct link opens a YouTube recipe in a new tab.
- Back‑to‑top button – Appears after scrolling, smooth scroll to top.
- Safe storage wrapper – Gracefully handles browsers where localStorage is disabled.

## Technologies Used
| Category | Technology |
|----------|------------|
| Markup   | HTML 5 |
| Styling  | CSS 3, **Bootstrap 5.3**, Google Fonts (Outfit, Plus Jakarta Sans), Font Awesome 6 |
| Scripting| Vanilla JavaScript (ES6) |
| Assets   | Images hosted on a CDN (cloudfront) |
| Tooling  | Static site – can be served by any HTTP server (GitHub Pages, Netlify, Vercel, etc.) |

## Installation
1. Clone the repository
   ```bash
   git clone https://github.com/<your‑username>/food-munch.git
   cd food-munch
   ```
2. Open the site – double‑click `food much web site.html` or serve locally:
   ```bash
   npx -y http-server@latest . -p 8080
   ```
3. Deploy to GitHub Pages (optional) – push to `main` and enable GitHub Pages in repo settings.

## Usage
- Toggle theme – click the moon/sun icon in the navbar.
- Add to cart – press the **+** button on any menu card; the cart badge updates instantly.
- Edit cart – in the cart modal use `‑`/`+` or the trash icon to change quantity or remove items.
- Checkout – fill the checkout form and click **Confirm & Place Order**; a success toast appears and the cart resets.
- Subscribe – enter a valid email and click **Subscribe**; a toast confirms subscription.
- Watch video – click **Watch Video** in the *Healthy Food* section – a new tab opens the YouTube recipe.
- Back to top – scroll down and click the floating arrow to return to the top smoothly.

## Project Structure
```
food-munch/
│
├─ assets/                     # Image assets (logo, food photos, screenshots)
│   ├─ banner-desktop.png
│   └─ …
│
├─ food much web site.html      # Main HTML page
├─ food much web site.css       # Custom stylesheet + Bootstrap overrides
├─ food much web site.js        # JavaScript logic (cart, theme, forms, UI)
└─ README.md                  # This file
```

## Screenshots
*(Add actual images in `assets/` and reference them here)*
| Home / Hero | Menu Section |
|---|---|
| ![Home](assets/screenshot-home.png) | ![Menu](assets/screenshot-menu.png) |
| **Cart Modal** | **FAQ Accordion** |
| ![Cart](assets/screenshot-cart.png) | ![FAQ](assets/screenshot-faq.png) |

## Author
**Alekh** – Front‑end enthusiast & UI designer
GitHub: https://github.com/alekh

## License
Distributed under the MIT License. See `LICENSE` for details.
