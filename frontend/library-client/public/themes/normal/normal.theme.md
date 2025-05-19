# Burrito Web App Colour Theme & Style Guide

A fun, friendly, and appetizing colour palette inspired by the Universidad de WSBurrito logo.

---

## 🎨 Colour Palette

| Name            | HEX      | Usage                               |
|-----------------|----------|-------------------------------------|
| **Burrito Brown**   | `#703512` | Headings, buttons, navbar           |
| **Tortilla Beige**  | `#FFE4B2` | Backgrounds, cards                  |
| **Tomato Red**      | `#EF4444` | Accents, highlights, badges         |
| **Guac Green**      | `#68B684` | Highlights, icons, hover effects    |
| **Cheese Yellow**   | `#FFC93C` | Buttons, notification badges        |
| **Warm Gray**       | `#E5DED6` | Backgrounds, section dividers       |
| **Burgundy**        | `#802418` | Borders, secondary text             |

---

## 🧑‍💻 Usage Recommendations

### **Primary Colours**
- **Rich Brown** (`#703512`): Use for headers, navigation bars, primary buttons, and prominent elements.
- **Creamy Beige** (`#FFE4B2`): Use for main backgrounds and cards.

### **Secondary Colours**
- **Tomato Red** (`#EF4444`): Use for accents, small call-to-actions, badges, and important highlights.
- **Guac Green** (`#68B684`): Use for icons, hover effects, and subtle highlights.
- **Cheese Yellow** (`#FFC93C`): Use for buttons and elements that need to stand out.

### **Supporting Colours**
- **Warm Gray** (`#E5DED6`): Use for section backgrounds, secondary backgrounds, or dividers.
- **Burgundy** (`#802418`): Use for links, subtle borders, or secondary text.

---

## 🅰️ Typography

- **Primary Font Recommendation:** Rounded sans-serif fonts, e.g.:
  - [Nunito](https://fonts.google.com/specimen/Nunito)
  - [Poppins](https://fonts.google.com/specimen/Poppins)
  - [Quicksand](https://fonts.google.com/specimen/Quicksand)
- **Headings:** Bold, playful, and rounded to match the logo vibe.

---

## 💡 UI Accent Tips

- Use **brown** for your main navbar and key action buttons.
- Use **beige** as your main background for a soft, welcoming look.
- **Tomato red, guac green, and cheese yellow** are perfect for highlights, icons, call-to-action buttons, and playful accents.
- Prefer **rounded corners** and **gentle shadowing** on cards and buttons to enhance approachability and fun.
- Mix **warm gray** into secondary backgrounds or section dividers for gentle contrast.

---

## Example (Tailwind CSS variables)

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
        gray: "#E5DED6",
        burgundy: "#802418",
      },
    },
    fontFamily: {
      sans: ['Nunito', 'Poppins', 'Quicksand', 'sans-serif'],
    },
  },
}
