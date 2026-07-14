# BlogCreator.dev — Responsive & Performance Audit

**Site:** https://blogcreator.dev  
**Date:** 2026-07-14  
**Deploy:** 64893be  
**Checks:** 88 (11 pages × 8 viewports)  

## Executive summary

| Area | Verdict |
|------|--------|
| Document overflow | Issues found |
| Homepage nav responsive | P1 — section links visible on mobile, hamburger on desktop |
| Cookie banner | P1 — blocks viewport on first visit |
| Performance (landing) | See per-viewport table below |

## Viewport performance — Landing (`/`)

| Viewport | Size | FCP | Load | TTFB | Transfer | Grade |
|----------|------|-----|------|------|----------|-------|
| iPhone SE | 320×568 | 532ms | 624ms | 298ms | 244KB | Good |
| iPhone 13 | 375×812 | 584ms | 688ms | 332ms | 331KB | Good |
| iPhone 14 Pro Max | 414×896 | 620ms | 721ms | 306ms | 331KB | Good |
| iPad Portrait | 768×1024 | 520ms | 614ms | 299ms | 331KB | Good |
| iPad Landscape | 1024×768 | 476ms | 619ms | 303ms | 331KB | Good |
| Laptop | 1280×720 | 676ms | 822ms | 475ms | 331KB | Good |
| Desktop HD | 1440×900 | 592ms | 688ms | 317ms | 331KB | Good |
| Full HD | 1920×1080 | 732ms | 782ms | 447ms | 331KB | Good |

## Page performance matrix (FCP ms)

| Page | mobile-xs | mobile | mobile-lg | tablet | tablet-landscape | desktop | desktop-lg | desktop-xl |
|------|------|------|------|------|------|------|------|------|
| Landing | 532 | 584 | 620 | 520 | 476 | 676 | 592 | 732 |
| Pricing | 480 | 516 | 416 | 560 | 600 | 640 | 416 | 408 |
| Samples | 568 | 488 | 460 | 460 | 568 | 532 | 584 | 456 |
| Help | 424 | 488 | 640 | 428 | 452 | 544 | 780 | 464 |
| Integrate | 548 | 584 | 572 | 760 | 472 | 544 | 444 | 460 |
| Contact | 456 | 440 | 500 | 440 | 508 | 428 | 504 | 440 |
| About | 484 | 464 | 500 | 496 | 476 | 508 | 568 | 612 |
| Blog | 496 | 544 | 508 | 500 | 528 | 620 | 652 | 524 |
| Login | 424 | 436 | 484 | 568 | 640 | 484 | 676 | 536 |
| Signup | 468 | 456 | 608 | 592 | 628 | 648 | 756 | 548 |
| Status | 508 | 512 | 448 | 436 | 484 | 524 | 468 | 500 |

## Page load time matrix (ms)

| Page | mobile-xs | mobile | mobile-lg | tablet | tablet-landscape | desktop | desktop-lg | desktop-xl |
|------|------|------|------|------|------|------|------|------|
| Landing | 624 | 688 | 721 | 614 | 619 | 822 | 688 | 782 |
| Pricing | 657 | 684 | 560 | 620 | 784 | 723 | 538 | 545 |
| Samples | 669 | 688 | 638 | 629 | 667 | 710 | 593 | 606 |
| Help | 595 | 725 | 662 | 600 | 613 | 766 | 787 | 659 |
| Integrate | 729 | 822 | 619 | 780 | 635 | 761 | 567 | 599 |
| Contact | 563 | 554 | 618 | 529 | 627 | 514 | 621 | 549 |
| About | 599 | 574 | 620 | 525 | 587 | 616 | 552 | 640 |
| Blog | 627 | 674 | 637 | 626 | 657 | 666 | 727 | 544 |
| Login | 624 | 685 | 694 | 676 | 838 | 715 | 761 | 645 |
| Signup | 701 | 639 | 759 | 751 | 790 | 740 | 808 | 689 |
| Status | 592 | 536 | 548 | 533 | 572 | 602 | 587 | 569 |

## Responsive layout findings

Screenshots: `docs/audit-screenshots/` (18 PNGs from browse agent)

### P0 — Homepage navigation
- Section nav links (Features, Platforms, Integrations, FAQ, Samples, Pricing) stay visible on **mobile (375px)** and **tablet (768px)** alongside hamburger — header cramped, links extend past viewport width.
- Hamburger button remains **visible on desktop (1280px)** despite `md:hidden` class.

### P1 — Cookie consent
- Full-viewport overlay on first visit; blocks `/help` and `/auth/login` content until dismissed.

### P1 — Vertical whitespace
- Large empty gaps on `/` (between case study and side-by-side section) and `/help` (between product tour and FAQ).

### Clean pages (no layout issues)
- `/pricing`, `/samples`, `/about`, `/blog`, `/status` — stack and center correctly across all breakpoints.

## Performance verdict

**All 88 checks: FCP and Load grades are GOOD** across every page and viewport.

| Metric | Landing (worst case) | Threshold (good) | Verdict |
|--------|---------------------|------------------|---------|
| FCP | 732ms (1920px) | < 1800ms | Excellent |
| Load | 822ms (1280px) | < 2500ms | Excellent |
| TTFB | 475ms (1280px) | < 800ms | Good |
| Transfer size | 331KB landing | — | Acceptable |

Heaviest pages: `/integrate` (822ms load mobile), `/help` (787ms load desktop-lg). All still within good thresholds.

## Real issues found (6)

| Priority | Issue | Pages | Viewports |
|----------|-------|-------|-----------|
| **P0** | Section nav links visible alongside hamburger on mobile/tablet | `/` | mobile, tablet |
| **P0** | Hamburger visible on desktop (`md:hidden` not working) | `/` | desktop, desktop-lg, desktop-xl |
| **P1** | Cookie banner blocks viewport on first visit | All | all (until dismissed) |
| **P1** | Login form below fold on mobile | `/auth/login` | mobile |
| **P1** | Large vertical whitespace gaps | `/`, `/help` | all |
| **P2** | Minor horizontal overflow (9px) | `/help` | mobile-xs (320px) |

## Recommendations

1. **Hide section-nav links below `md`** on landing; show only hamburger + Sign in + Get started.
2. **Fix hamburger `md:hidden`** — ensure hidden at ≥768px.
3. **Cookie banner** — bottom toast, not full-screen overlay on mobile.
4. **Landing page** — lazy-load below-fold sections (testimonials, comparison, FAQ) to improve mobile FCP.
5. **Auth pages** — prioritize login form above fold on mobile; reduce marketing panel height.
6. **Help page** — remove excess vertical spacing between product tour and FAQ.

## Raw data

See `docs/responsive-perf-audit-data.json` for full 88 measurements.
