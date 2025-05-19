#!/usr/bin/env node

/**
 * This script helps migrate legacy theme styling to the new theme system
 * It finds and replaces common CSS patterns with the new theme utility classes
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Colors to replace
const COLOR_REPLACEMENTS = {
  // Background colors
  'bg-burrito-black': 'bg-burrito-dark-bg',
  'bg-burrito-charcoal': 'bg-burrito-dark-surface',
  'bg-white dark:bg-burrito-black': 'auto-theme-bg',
  'bg-white dark:bg-burrito-charcoal': 'auto-theme-card',
  'bg-neutral-50 dark:bg-burrito-black': 'auto-theme-bg',
  'bg-neutral-50 dark:bg-burrito-charcoal': 'auto-theme-bg',
  'bg-burrito-beige dark:bg-burrito-black': 'auto-theme-bg',
  'bg-burrito-beige dark:bg-burrito-charcoal': 'auto-theme-bg',
  
  // Text colors
  'text-neutral-600 dark:text-burrito-gray': 'auto-theme-text',
  'text-neutral-700 dark:text-burrito-gray': 'auto-theme-text',
  'text-neutral-800 dark:text-burrito-gray': 'auto-theme-text',
  'text-neutral-900 dark:text-burrito-gray': 'auto-theme-text',
  
  // Borders
  'border-neutral-200 dark:border-burrito-burgundy': 'border-burrito-light-border dark:border-burrito-dark-border',
  'border-burrito-burgundy': 'border-burrito-dark-border',
};

// Element patterns to replace with utility classes
const ELEMENT_PATTERNS = [
  {
    regex: /className="(.*?)bg-white dark:bg-burrito-charcoal(.*?)border dark:border-burrito-burgundy(.*?)rounded/g,
    replacement: (match, p1, p2, p3) => `className="${p1}auto-theme-card${p2}${p3}rounded`
  },
  {
    regex: /className="(.*?)text-neutral-[6-9]00 dark:text-burrito-gray(.*?)"/g,
    replacement: (match, p1, p2) => `className="${p1}auto-theme-text${p2}"`
  }
];

// Hardcoded colors in inline styles
const INLINE_STYLE_PATTERNS = [
  {
    regex: /style={{.*?backgroundColor: ['"]#242424['"].*?}}/g,
    replacement: `style={{ backgroundColor: 'var(--color-bg)' }}`
  },
  {
    regex: /style={{.*?backgroundColor: ['"]#181818['"].*?}}/g,
    replacement: `style={{ backgroundColor: 'var(--color-bg)' }}`
  },
  {
    regex: /style={{.*?color: ['"]#E5DED6['"].*?}}/g,
    replacement: `style={{ color: 'var(--color-text)' }}`
  }
];

// Find all TSX files
const findFiles = () => {
  return glob.sync('src/**/*.tsx', { cwd: process.cwd() });
};

// Process a single file
const processFile = (filePath) => {
  console.log(`Processing ${filePath}...`);
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Replace color classes
  for (const [pattern, replacement] of Object.entries(COLOR_REPLACEMENTS)) {
    const regex = new RegExp(pattern, 'g');
    if (regex.test(content)) {
      content = content.replace(regex, replacement);
      modified = true;
    }
  }
  
  // Replace element patterns
  for (const { regex, replacement } of ELEMENT_PATTERNS) {
    if (regex.test(content)) {
      content = content.replace(regex, replacement);
      modified = true;
    }
  }
  
  // Replace inline styles
  for (const { regex, replacement } of INLINE_STYLE_PATTERNS) {
    if (regex.test(content)) {
      content = content.replace(regex, replacement);
      modified = true;
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
};

// Main function
const main = () => {
  console.log('Starting theme migration...');
  const files = findFiles();
  console.log(`Found ${files.length} files to process`);
  
  files.forEach(processFile);
  
  console.log('Theme migration complete!');
};

main();
