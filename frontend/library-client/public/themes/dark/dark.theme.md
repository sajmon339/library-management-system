# Burrito Web App Dark Mode Colour Theme & Style Guide

Inspired by your dark mode logo.

---

## 🎨 Dark Mode Colour Palette

| Name                | HEX      | Usage                               |
|---------------------|----------|-------------------------------------|
| **Burrito Brown**   | `#703512` | Headings, buttons, primary elements |
| **Tortilla Beige**  | `#FFE4B2` | Card backgrounds, accents           |
| **Tomato Red**      | `#EF4444` | Accents, highlights, badges         |
| **Guac Green**      | `#68B684` | Highlights, icons, hover effects    |
| **Cheese Yellow**   | `#FFC93C` | Buttons, badges, attention areas    |
| **Deep Burgundy**   | `#802418` | Borders, secondary text             |
| **Warm Gray**       | `#E5DED6` | Text, icons, subtle dividers        |
| **Night Black**     | `#181818` | Main background, navbars            |
| **Charcoal Gray**   | `#242424` | Card backgrounds, containers        |

---

## 🧑‍💻 Usage Recommendations

- **Main Background:**  
  - `#181818` (Night Black) for the base.
  - Use `#242424` (Charcoal Gray) for cards, nav, and containers for a layered look.
- **Text:**  
  - Use **Warm Gray** `#E5DED6` or off-white for most text on black backgrounds.
- **Primary Elements:**  
  - Use **Burrito Brown** `#703512` and **Tortilla Beige** `#FFE4B2` for headings and buttons.
- **Accent Elements:**  
  - **Tomato Red** `#EF4444` and **Guac Green** `#68B684` for icons, badges, active states.
  - **Cheese Yellow** `#FFC93C` for CTAs, highlights, and small UI pops.
- **Borders/Secondary Text:**  
  - **Deep Burgundy** `#802418` for subtle outlines and secondary details.

---

## 🅰️ Typography

- **Primary Font:** Rounded sans-serif (Nunito, Poppins, Quicksand).
- **Text Colour:** Use Warm Gray or Tortilla Beige for good contrast on the dark background.

---

## 💡 Dark Mode UI Tips

- Use **shadows** and **borders** (in Deep Burgundy or Charcoal Gray) for card separation.
- **Rounded corners** and soft, glowy shadows help keep things playful.
- Keep the **beige and yellow** as accents, not main backgrounds, to avoid too much contrast strain.
- Icons and CTAs should stand out in **green, yellow, or red** against the dark base.

---

## Example (Tailwind CSS variables for dark mode)

```js
// tailwind.config.js (excerpt)
theme: {
  extend: {
    colors: {
      burrito: {
        brown: "#703512",
        beige: "#FFE4B2",
        tomato: "#EF4444",
        guac: "#68B684",
        cheese: "#FFC93C",
        burgundy: "#802418",
        gray: "#E5DED6",
        black: "#181818",
        charcoal: "#242424",
      },
    },
    fontFamily: {
      sans: ['Nunito', 'Poppins', 'Quicksand', 'sans-serif'],
    },
  },
  darkMode: 'class',
}
