# Mobile Testing Guide

This guide provides instructions for testing the WSBurrito library management system on mobile devices.

## Prerequisites

- Docker and Docker Compose must be installed on your development machine
- Both your mobile device and development machine must be connected to the same WiFi network

## Running the Application for Mobile Testing

1. From the root of the project, run the mobile testing script:

```bash
./mobile-test.sh
```

2. The script will display your local IP address and the URLs for accessing the frontend and backend:
   - Frontend: http://YOUR_LOCAL_IP:3000
   - Backend API: http://YOUR_LOCAL_IP:5000

3. On your mobile device, open a web browser and navigate to the frontend URL displayed by the script

## Testing Specific Features

### Mobile Navigation
- Test the hamburger menu functionality
- Verify that all menu items appear properly
- Check that login/register buttons work correctly
- Test theme and language switchers

### Login and Registration
- Try registering a new account
- Test logging in with existing credentials
- Verify that error messages display correctly
- Check that the session persists after login

### Book Browsing and Checkout
- Test browsing the book collection
- Verify that book details display correctly
- Test checking out and returning books
- Verify that cover images load properly

## Mobile Debugging

A debugging component is included to help diagnose mobile-specific issues:

1. In any screen, tap the "Debug" button in the bottom-right corner
2. The debug panel will show device information like:
   - Device details (platform, browser, screen size)
   - Network information
   - Storage usage
   - Battery information

3. Use the "Copy Debug Info" button to copy diagnostic data that can be shared for troubleshooting

4. If you encounter issues with stored credentials, use the "Clear Storage & Reload" button to reset the application state

## Common Mobile Issues and Solutions

### Layout Issues
- If elements appear out of place, try adjusting the viewport settings in the browser
- If text is too small, enable text zoom in your browser settings

### Authentication Issues
- If login fails, use the Debug panel to check network connectivity
- Try clearing browser cache and cookies

### Performance Issues
- For slower devices, be patient during initial load
- If the application seems unresponsive, check your network connection quality in the Debug panel

## Reporting Issues

When reporting mobile-specific issues, please include:
1. Mobile device model and OS version
2. Browser name and version
3. Step-by-step reproduction instructions
4. Debug information from the debug panel
5. Screenshots if applicable
