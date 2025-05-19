# Navbar Background Detection

The navbar in this application is designed to adapt its appearance based on the background of the current page. It will show white text on pages with dark backgrounds/hero images and dark text on pages with light backgrounds.

## How It Works

The navbar uses a detection mechanism to determine if the current page has a dark background or hero section. Here's how it works:

1. **Automatic Detection**: The navbar looks for elements with specific classes:
   - `.hero-section`
   - `.dark-background-marker`
   - Any section with an inline background-image style

2. **Home Page**: The home page is automatically recognized as having a dark background.

3. **Manual Marking**: For other pages with dark backgrounds, you need to add a marker.

## How to Mark a Page with a Dark Background

If you create a new page with a dark header/hero section and want the navbar to display white text, you have two options:

### Option 1: Add the DarkBackgroundHelper component

```tsx
import DarkBackgroundHelper from '../components/DarkBackgroundHelper';

const YourDarkPage = () => {
  return (
    <>
      <DarkBackgroundHelper />
      {/* Your page content here */}
    </>
  );
};
```

### Option 2: Add the 'hero-section' class

Add the `hero-section` class to your hero or header element:

```tsx
<section className="your-classes hero-section">
  {/* Your hero content */}
</section>
```

## Default Behavior

- Pages with no markers will use a brown navbar background with white text
- When scrolling down any page, the navbar background changes to white with dark text

This system ensures that navbar text is always visible against its background, regardless of the page design.
