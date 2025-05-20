# Localization System Documentation

This document outlines how to use the localization (i18n) system in the Library Management System.

## Overview

The application uses the i18next library for internationalization. Currently, we support the following languages:

- English (en)
- Polish (pl)

## Directory Structure

Translation files are located in:

```
/src/locales/
  ├── en/
  │   └── translation.json
  └── pl/
      └── translation.json
```

## How to Use Translations in Components

### Basic Usage

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('app.title')}</h1>
      <p>{t('homePage.welcome')}</p>
    </div>
  );
}
```

### With Variables

```tsx
const { t } = useTranslation();
// In translation file: "welcome": "Hello, {{name}}!"
return <p>{t('welcome', { name: 'John' })}</p>;
```

### Pluralization

```tsx
const { t } = useTranslation();
// In translation file: "items": "{{count}} item", "items_plural": "{{count}} items"
return <p>{t('items', { count: 5 })}</p>; // Outputs: "5 items"
```

## Changing Language

The language can be changed programmatically:

```tsx
const { i18n } = useTranslation();
i18n.changeLanguage('pl');
```

Or by using the LanguageSwitcher component:

```tsx
import LanguageSwitcher from './components/ui/LanguageSwitcher';

function Header() {
  return (
    <header>
      <LanguageSwitcher />
    </header>
  );
}
```

## Adding a New Translation Key

1. Add the key to **both** language files (`en/translation.json` and `pl/translation.json`)
2. Use a nested structure for organization (e.g., `navbar.home`, `books.title`)
3. Keep the same structure in both language files

## Adding a New Language

1. Create a new directory in `/src/locales/` with the language code (e.g., `/src/locales/de/`)
2. Add a `translation.json` file with the same structure as existing language files
3. Update the `i18n.ts` file to include the new language:

```typescript
// Import the new translation
import translationDE from './locales/de/translation.json';

// Add to resources
const resources = {
  en: { translation: translationEN },
  pl: { translation: translationPL },
  de: { translation: translationDE }
};
```

4. Add the language to the LanguageSwitcher component

## Dynamic Page Titles

To set a dynamic page title based on the current language:

```tsx
import { usePageTitle } from './utils/usePageTitle';

function MyPage() {
  // This will set the page title using the translation key 'myPage.title'
  usePageTitle('myPage.title');
  
  // With prefix/suffix
  // usePageTitle('myPage.title', { prefix: 'Library -', suffix: '| WSB' });
  
  return <div>...</div>;
}
```