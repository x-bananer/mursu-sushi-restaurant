# HTML Page Branch

Use Node.js 24.

## Temporary README and temporary structure for HTML assignment
The main idea is NOT perfect reusability, but splitting the page into INDEPENDENT components.

So if Unna has a card and I also have a card, that’s not a problem, later we can rename them and use separately when we move to React components.

The main goal is to avoid creating one large, messy layout that will be hard to break into components later.

### Project structure

```text
/styles
  global.css        // colors, fonts, variables
  base.css          // reset, base styles
  /pages
    home.css
    admin.css
    login.css
    profile.css
    combo.css
    menu.css
    cart.css
    tracker.css

/pages
  home.html
  admin.html
  login.html
  profile.html
  combo.html
  menu.html
  cart.html
  tracker.html

shared.html
  // contains basic components (header, footer, buttons, inputs, cards)
  // copy markup from here and reuse in your pages
```

### How to work

- Each person builds their own page
- Use shared components from `shared.html`
- Structure your page using components (not one large block)

### Styles

- `base.css` → reset and base browser styles
- `global.css` → variables (colors, fonts, spacing)
- `pages/*.css` → page-specific layout only

### Important

- Reuse components (header, card, button, etc.)
- Keep class names consistent (BEM)
- Avoid nested selectors like `.page .card`
- Each component should be independent

### CSS Breakpoints

@media (max-width: 480px) {}   /* mobile */
@media (max-width: 768px) {}   /* tablet */
@media (max-width: 1024px) {}  /* desktop (default styles) */