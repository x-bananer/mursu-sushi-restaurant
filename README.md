# Converting HTML Pages to React Components

### Use existing pages

Go to the project folder:

```
frontend/src/customer
```

Pre-created pages are already available there. Use them as a base.

Example structure:
```
login/
  Login.jsx
  login.css
```

### Convert your HTML to JSX

- take your html page
- delete header, footer, bottom nav, meta, head, body (everything besides actual inner content you were writing there)
- convert it to react code using an HTML → JSX converter https://transform.tools/html-to-jsx
- paste the result into your .jsx file

```
export default function Login() {
  return (
    <>
        // paste converted JSX here
    </>
  );
};
```

### Add your styles

Use the .css file located next to your .jsx file. Add your styles directly into this file, it is already imported in the page component.

---

**Nota bene**

Page components are already connected in the router. Do not rename files arbitrarily. If you rename a file, make sure to update all related imports accordingly.

**Post scriptum**

After doing this, you can start breaking your page into smaller reusable components. (If you’ve completed the React homework and understand what I mean :D)
