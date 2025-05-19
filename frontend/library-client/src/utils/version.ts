// This file contains the current application version/build ID
// This value should be updated with each deployment to invalidate existing sessions
export const APP_VERSION = '1.0.0';

// The version when the user's session was created
// Stored in localStorage
export const SESSION_VERSION_KEY = 'app_version';

// Check if the current app version matches the stored session version
export const isSessionValid = (): boolean => {
  const storedVersion = localStorage.getItem(SESSION_VERSION_KEY);
  return storedVersion === APP_VERSION;
};

// Update the stored session version to the current app version
export const updateSessionVersion = (): void => {
  localStorage.setItem(SESSION_VERSION_KEY, APP_VERSION);
};
