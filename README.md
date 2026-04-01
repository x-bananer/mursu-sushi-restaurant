# HTML Page Branch

This is the temporary project structure where we create and develop markup and styles of the project.

Check this explanation of our workflow before starting:
[https://docs.google.com/presentation/d/1c-o8IS2arje1uz3si3oiPXBjGbXN3iA02ymb2bt0fVI/edit?slide=id.p#slide=id.p](https://docs.google.com/presentation/d/1c-o8IS2arje1uz3si3oiPXBjGbXN3iA02ymb2bt0fVI/edit?slide=id.p#slide=id.p) 

The main idea is NOT perfect reusability, but splitting the page into INDEPENDENT components.

The main goal is to avoid creating one large, messy layout that will be hard to break into components later.

### Project structure

```text
/styles
  global.css        // layout
  variables         // colors, fonts
  base.css          // reset, base styles
  /pages // styles of the pages
    home.css
    admin.css
    login.css
    profile.css
    combo.css
    menu.css
    cart.css
    tracker.css

/pages // markup of the pages
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
- Structure the page using components (not one large block)

### Important

- Reuse components (header, card, button, etc.)
- Keep class names consistent (BEM)
- Each component should be independent

### CSS Breakpoints
```
@media (max-width: 480px) {}   /* mobile */
@media (max-width: 768px) {}   /* tablet */
@media (max-width: 1024px) {}  /* desktop (default styles) */
```