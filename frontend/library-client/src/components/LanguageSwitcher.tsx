import { useTranslation } from 'react-i18next';
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { GlobeEuropeAfricaIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../context/ThemeContext.js';

const languages = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'pl', name: 'Polski', nativeName: 'Polski', flag: '🇵🇱' }
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

interface LanguageSwitcherProps {
  className?: string;
  buttonClassName?: string;
  dropdownClassName?: string;
}

const LanguageSwitcher = ({ 
  className = '', 
  buttonClassName = '',
  dropdownClassName = ''
}: LanguageSwitcherProps) => {
  const { i18n } = useTranslation();
  const currentLanguageCode = i18n.language;
  const currentLanguage = languages.find(lang => lang.code === currentLanguageCode) || languages[0];

  const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    // Update HTML document language attribute
    document.documentElement.setAttribute('lang', languageCode);
  };

  const { theme } = useTheme();
  
  return (
    <Menu as="div" className={`relative inline-block text-left ${className}`}>
      <div>
        <Menu.Button 
          className={`inline-flex items-center justify-center gap-x-1.5 rounded-md p-2 text-sm font-medium
          ${theme === 'light' 
            ? 'hover:bg-burrito-beige text-burrito-brown' 
            : 'hover:bg-burrito-burgundy/20 text-burrito-cheese'} 
          ${buttonClassName}`}
        >
          <GlobeEuropeAfricaIcon className="h-5 w-5" aria-hidden="true" />
          <span className="hidden sm:inline-block">{currentLanguage.flag}</span>
          <ChevronDownIcon className="-mr-1 h-5 w-5" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className={`absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-burrito-dark-surface dark:ring-burrito-dark-border ${dropdownClassName}`}>
          <div className="py-1">
            {languages.map((language) => (
              <Menu.Item key={language.code}>
                {({ active }) => (
                  <button
                    onClick={() => changeLanguage(language.code)}
                    className={classNames(
                      active ? 'bg-gray-100 dark:bg-burrito-dark-hover text-gray-900 dark:text-burrito-cheese' : 'text-gray-700 dark:text-burrito-dark-text',
                      'flex w-full items-center px-4 py-2 text-sm',
                      language.code === currentLanguageCode ? 'font-bold' : ''
                    )}
                  >
                    <span className="mr-2">{language.flag}</span>
                    {language.nativeName}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default LanguageSwitcher;
