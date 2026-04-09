# HTML Page Branch

[Mursu Sushi]([url](https://veiston.github.io/mursu-sushi.github.io/)) on GitHub Pages! 🍣

Please review this before you start:
[https://docs.google.com/presentation/d/1c-o8IS2arje1uz3si3oiPXBjGbXN3iA02ymb2bt0fVI/edit?slide=id.p#slide=id.p](https://docs.google.com/presentation/d/1c-o8IS2arje1uz3si3oiPXBjGbXN3iA02ymb2bt0fVI/edit?slide=id.p#slide=id.p) 

The main idea is not perfect reuse, but splitting the page into independent components.

The goal is to avoid one large, messy layout that will be hard to break into components later.

### Project structure

```text
/styles
  index.css                // all styles entry file
  /base
    base.css              // reset and base styles
    fonts.css             // font imports
    global.css            // layout helpers
    variables.css         // colors, fonts, theme variables
  /pages
    shared.css            // shared reusable components styles

/pages
  shared.html             // reference page with reusable global components
```
### How to work

- Each person builds their own page
- Use shared components from `shared.html`
- Structure your page with components, not as one large block
- Connect shared styles through `styles/index.css`

### Important

- **Use variables from the variables file** instead of hardcoding colors and fonts, this will make it easier to add a light theme later
- Reuse shared components such as header, button and footer
- Keep class names consistent and follow BEM
- Each component should be independent
- Use `layout` and `page` classes where needed
- Follow the spacing, sizes and styles from the design as closely as possible
- But some Figma screens may look slightly inconsistent or use different colors. Keep things simple and avoid creating unnecessary variations

### CSS Breakpoints
```
@media (max-width: 480px) {}   /* mobile */
@media (max-width: 768px) {}   /* tablet */
@media (max-width: 1024px) {}  /* desktop (default styles) */
```
