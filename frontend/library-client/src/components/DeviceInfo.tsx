import { useState, useEffect } from 'react';

// TypeScript interfaces for browser APIs that might not be fully typed
interface NetworkInformation {
  downlink: number;
  effectiveType: string;
  rtt: number;
  addEventListener: (type: string, listener: EventListener) => void;
  removeEventListener: (type: string, listener: EventListener) => void;
}

interface NavigatorWithConnection extends Navigator {
  connection?: NetworkInformation;
  getBattery?: () => Promise<any>;
}

/**
 * Small debugging component for mobile devices
 * Can be added to any page to help identify device-specific issues
 */
const DeviceInfo = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [networkInfo, setNetworkInfo] = useState({
    downlink: 'unknown',
    effectiveType: 'unknown',
    rtt: 'unknown'
  });
  const [batteryInfo, setBatteryInfo] = useState({
    level: 'unknown',
    charging: 'unknown'
  });
  const [storageInfo, setStorageInfo] = useState({
    localStorage: 'unknown',
    sessionStorage: 'unknown'
  });
  
  useEffect(() => {
    // Update network information when available
    const nav = navigator as NavigatorWithConnection;
    
    if (nav.connection) {
      const connection = nav.connection;
      const updateNetworkInfo = () => {
        setNetworkInfo({
          downlink: connection.downlink.toString(),
          effectiveType: connection.effectiveType,
          rtt: connection.rtt.toString()
        });
      };
      
      updateNetworkInfo();
      connection.addEventListener('change', updateNetworkInfo);
      
      return () => {
        connection.removeEventListener('change', updateNetworkInfo);
      };
    }
    
    // Check battery status if available
    if (nav.getBattery) {
      nav.getBattery().then(battery => {
        const updateBatteryInfo = () => {
          setBatteryInfo({
            level: (battery.level * 100).toFixed(0) + '%',
            charging: battery.charging ? 'Yes' : 'No'
          });
        };
        
        updateBatteryInfo();
        battery.addEventListener('levelchange', updateBatteryInfo);
        battery.addEventListener('chargingchange', updateBatteryInfo);
        
        return () => {
          battery.removeEventListener('levelchange', updateBatteryInfo);
          battery.removeEventListener('chargingchange', updateBatteryInfo);
        };
      }).catch(err => {
        console.log('Battery API not supported or permission denied', err);
      });
    }
    
    // Check storage usage
    try {
      let localStorageSize = 0;
      let sessionStorageSize = 0;
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const value = localStorage.getItem(key);
          localStorageSize += (key.length + (value?.length || 0)) * 2; // UTF-16 characters = 2 bytes
        }
      }
      
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key) {
          const value = sessionStorage.getItem(key);
          sessionStorageSize += (key.length + (value?.length || 0)) * 2;
        }
      }
      
      setStorageInfo({
        localStorage: (localStorageSize / 1024).toFixed(2) + 'KB',
        sessionStorage: (sessionStorageSize / 1024).toFixed(2) + 'KB'
      });
    } catch (e) {
      console.log('Error calculating storage info', e);
    }
  }, []);
  
  if (!import.meta.env.DEV) {
    return null; // Only show in development
  }
  
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isAndroid = /Android/i.test(navigator.userAgent);
  const isSafari = /Safari/i.test(navigator.userAgent) && !/Chrome/i.test(navigator.userAgent);
  const appVersion = import.meta.env.VITE_APP_VERSION || 'unknown';
  const apiUrl = import.meta.env.VITE_API_URL || '/api';
  
  return (
    <div className="fixed bottom-2 right-2 z-50">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-gray-800 text-white p-2 rounded-full shadow-lg text-xs"
      >
        {isExpanded ? 'Hide Info' : 'Debug'}
      </button>
      
      {isExpanded && (
        <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg text-xs mt-2 max-w-[300px] overflow-auto max-h-[80vh]">
          <h3 className="font-bold mb-2">Device Info</h3>
          <ul className="space-y-1">
            <li>Mobile: {isMobile ? 'Yes' : 'No'}</li>
            <li>Platform: {isIOS ? 'iOS' : isAndroid ? 'Android' : 'Desktop'}</li>
            <li>Browser: {isSafari ? 'Safari' : /Chrome/i.test(navigator.userAgent) ? 'Chrome' : 'Other'}</li>
            <li>App Version: {appVersion}</li>
            <li>API URL: {apiUrl}</li>
            <li>Online: {navigator.onLine ? 'Yes' : 'No'}</li>
            <li>Screen: {window.innerWidth}x{window.innerHeight}</li>
            <li>Pixel Ratio: {window.devicePixelRatio}</li>
            <li>Touch: {('ontouchstart' in window) ? 'Yes' : 'No'}</li>
            <li>Dark Mode: {window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'Yes' : 'No'}</li>
            <li>User Agent: <div className="truncate">{navigator.userAgent}</div></li>
          </ul>
          
          <h3 className="font-bold mt-3 mb-2">Network</h3>
          <ul className="space-y-1">
            <li>Connection: {networkInfo.effectiveType}</li>
            <li>Downlink: {networkInfo.downlink} Mbps</li>
            <li>Latency (RTT): {networkInfo.rtt} ms</li>
          </ul>
          
          <h3 className="font-bold mt-3 mb-2">Storage</h3>
          <ul className="space-y-1">
            <li>Local Storage: {storageInfo.localStorage}</li>
            <li>Session Storage: {storageInfo.sessionStorage}</li>
          </ul>
          
          <h3 className="font-bold mt-3 mb-2">Battery</h3>
          <ul className="space-y-1">
            <li>Level: {batteryInfo.level}</li>
            <li>Charging: {batteryInfo.charging}</li>
          </ul>
          
          <div className="mt-3 pt-2 border-t border-gray-600 grid grid-cols-2 gap-2">
            <button 
              onClick={() => {
                localStorage.clear();
                sessionStorage.clear();
                alert('Storage cleared. Refreshing...');
                window.location.reload();
              }}
              className="bg-red-600 text-white px-2 py-1 rounded text-xs"
            >
              Clear Storage & Reload
            </button>
            
            <button
              onClick={() => {
                const debugInfo = {
                  userAgent: navigator.userAgent,
                  viewport: `${window.innerWidth}x${window.innerHeight}`,
                  devicePixelRatio: window.devicePixelRatio,
                  network: networkInfo,
                  storage: storageInfo,
                  timestamp: new Date().toISOString()
                };
                
                console.log('Debug Info:', debugInfo);
                
                // Copy to clipboard if available
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(JSON.stringify(debugInfo, null, 2))
                    .then(() => alert('Debug info copied to clipboard'))
                    .catch(err => {
                      console.error('Failed to copy:', err);
                      alert('Failed to copy debug info');
                    });
                } else {
                  alert('Clipboard API not available');
                }
              }}
              className="bg-blue-600 text-white px-2 py-1 rounded text-xs"
            >
              Copy Debug Info
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceInfo;
