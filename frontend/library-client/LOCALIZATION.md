# Localization Guide for the Library Management System

This document explains how to use the localization (i18n) system in our application.

## Overview

Our application uses the [i18next](https://www.i18next.com/) library along with [react-i18next](https://react.i18next.com/) to provide multilingual support. Currently, we support two languages:

- English (default)
- Polish

## Key Files and Directories

- `src/i18n.ts` - Main configuration file for i18next
- `src/locales/` - Directory containing translation files
  - `en/translation.json` - English translations
  - `pl/translation.json` - Polish translations
- `src/components/LanguageSwitcher.tsx` - Component for switching between languages
- `src/utils/usePageTitle.ts` - Utility hooks for managing page titles

## Using Translations in Components

### Basic Translation

```jsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('home.title')}</h1>
      <p>{t('home.subtitle')}</p>
    </div>
  );
}
```

### Translations with Variables

```jsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer>
      {t('footer.copyright', { year: currentYear })}
    </footer>
  );
}
```

### Page Titles

Use the `usePageTitle` hook to dynamically update page titles:

```jsx
import { usePageTitle } from '../utils/usePageTitle';

function MyPage() {
  // This will set the page title to the translated value of 'myPage.title'
  usePageTitle('myPage.title');
  
  return (
    // Your component content
  );
}
```

## Adding the Language Switcher

The LanguageSwitcher component is already included in the ModernNavbar component.

If you need to add it to other components, import and use it:

```jsx
import LanguageSwitcher from '../components/LanguageSwitcher';

function MyComponent() {
  return (
    <div>
      <LanguageSwitcher />
    </div>
  );
}
```

## Adding New Translations

1. Identify the text that needs translation
2. Add a new key in the `src/locales/en/translation.json` file in the appropriate section
3. Add the same key with the Polish translation in `src/locales/pl/translation.json`

Example:
```json
// In en/translation.json
{
  "mySection": {
    "newKey": "This is a new text"
  }
}

// In pl/translation.json
{
  "mySection": {
    "newKey": "To jest nowy tekst"
  }
}
```

## Adding a New Language

To add a new language:

1. Create a new folder in `src/locales/` for the language (e.g., `src/locales/de/` for German)
2. Copy the `translation.json` file from the English folder and translate all values
3. Update the `languages` array in `src/components/LanguageSwitcher.tsx`
4. Update the resources object in `src/i18n.ts`

## Best Practices

1. Use nested keys for better organization (e.g., `home.title` instead of `homeTitle`)
2. Don't hardcode any user-facing text - always use translation keys
3. Use meaningful key names that indicate the content
4. Keep translations organized by feature or page
5. Use variables for dynamic content instead of string concatenation

## Troubleshooting

If translations aren't working:

1. Check if the key exists in the translation files
2. Ensure that the i18n system is properly initialized before the app renders
3. Check the browser's localStorage for the correct language setting
4. Use the browser dev tools to check for any errors related to i18next
