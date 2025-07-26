// Example: Tech Support Decision Tree
// Replace the decisionTree object in script.js with this example

const decisionTree = {
    nodes: {
        'start': {
            question: 'Ask customer: "What type of device are you having trouble with?"',
            guidance: 'Listen carefully to identify the device category',
            options: [
                { text: 'Computer/Laptop', next: 'computer-issues', hotkey: '1' },
                { text: 'Mobile Phone', next: 'mobile-issues', hotkey: '2' },
                { text: 'Tablet', next: 'tablet-issues', hotkey: '3' },
                { text: 'Smart TV', next: 'tv-issues', hotkey: '4' },
                { text: 'Other Device', next: 'other-device', hotkey: '5' }
            ]
        },
        'computer-issues': {
            question: 'Ask customer: "Is your computer turning on when you press the power button?"',
            guidance: 'Check for any lights, sounds, or fan activity',
            options: [
                { text: 'Yes - Computer turns on normally', next: 'computer-boots', hotkey: '1' },
                { text: 'No - Completely dead, no response', next: 'power-troubleshoot', hotkey: '2' },
                { text: 'Partially - Some lights/sounds but no display', next: 'display-issues', hotkey: '3' }
            ]
        },
        'computer-boots': {
            question: 'Ask customer: "Can you see the desktop or login screen?"',
            guidance: 'Determine if this is a software or display issue',
            options: [
                { text: 'Yes - Can see desktop normally', next: 'software-issues', hotkey: '1' },
                { text: 'No - Black screen or no display', next: 'display-troubleshoot', hotkey: '2' },
                { text: 'Stuck on loading/startup screen', next: 'boot-issues', hotkey: '3' },
                { text: 'Blue screen or error messages', article: 'blue-screen-guide', hotkey: '4' }
            ]
        },
        'software-issues': {
            question: 'Ask customer: "What specific problem are you experiencing with the software?"',
            guidance: 'Get details about the specific application or system issue',
            options: [
                { text: 'Application crashes or freezes', article: 'app-troubleshooting', hotkey: '1' },
                { text: 'Internet/browser problems', next: 'internet-issues', hotkey: '2' },
                { text: 'Email not working', article: 'email-setup-guide', hotkey: '3' },
                { text: 'Printer issues', article: 'printer-troubleshooting', hotkey: '4' },
                { text: 'Slow performance', next: 'performance-check', hotkey: '5' }
            ]
        },
        'power-troubleshoot': {
            question: 'Ask customer: "Is the power cord securely connected to both the computer and wall outlet?"',
            guidance: 'Have them physically check both connections',
            options: [
                { text: 'Yes - All connections secure', next: 'power-supply-test', hotkey: '1' },
                { text: 'No - Found loose connection', next: 'reconnect-power', hotkey: '2' },
                { text: 'Power cord appears damaged', article: 'power-cord-replacement', hotkey: '3' }
            ]
        },
        'reconnect-power': {
            question: 'Ask customer: "Please reconnect the power cord firmly and try turning on the computer again."',
            guidance: 'Wait for them to complete the action',
            options: [
                { text: 'Success - Computer now turns on', next: 'computer-boots', hotkey: '1' },
                { text: 'Still no response', next: 'power-supply-test', hotkey: '2' }
            ]
        },
        'power-supply-test': {
            question: 'Ask customer: "Can you try plugging another device into the same outlet to test if it works?"',
            guidance: 'This tests if the outlet has power',
            options: [
                { text: 'Other device works - Outlet is fine', article: 'hardware-repair-needed', hotkey: '1' },
                { text: 'Other device does not work', article: 'electrical-outlet-issue', hotkey: '2' },
                { text: 'No other device available to test', next: 'different-outlet', hotkey: '3' }
            ]
        },
        'different-outlet': {
            question: 'Ask customer: "Please try plugging the computer into a different wall outlet."',
            guidance: 'Have them use a completely different outlet',
            options: [
                { text: 'Computer works in different outlet', article: 'outlet-repair-needed', hotkey: '1' },
                { text: 'Still no response in different outlet', article: 'hardware-repair-needed', hotkey: '2' }
            ]
        },
        'mobile-issues': {
            question: 'Ask customer: "What type of problem are you experiencing with your phone?"',
            guidance: 'Identify the category of mobile issue',
            options: [
                { text: 'Phone won\'t turn on', next: 'mobile-power', hotkey: '1' },
                { text: 'Screen is cracked or not responding', article: 'screen-repair-guide', hotkey: '2' },
                { text: 'Apps crashing or phone is slow', next: 'mobile-performance', hotkey: '3' },
                { text: 'Can\'t connect to WiFi or cellular', next: 'mobile-connectivity', hotkey: '4' },
                { text: 'Battery drains quickly', article: 'battery-optimization', hotkey: '5' }
            ]
        },
        'mobile-power': {
            question: 'Ask customer: "How long has it been since you last charged your phone?"',
            guidance: 'Determine if this is a battery or hardware issue',
            options: [
                { text: 'Recently charged, should have battery', next: 'mobile-force-restart', hotkey: '1' },
                { text: 'Haven\'t charged in a while', next: 'mobile-charging', hotkey: '2' },
                { text: 'Was charging when it stopped working', article: 'charging-port-issues', hotkey: '3' }
            ]
        },
        'mobile-charging': {
            question: 'Ask customer: "Please connect your phone to the charger and wait 5 minutes, then try turning it on."',
            guidance: 'Sometimes phones need time to charge before they can turn on',
            options: [
                { text: 'Phone turns on after charging', article: 'battery-maintenance-tips', hotkey: '1' },
                { text: 'Still no response after charging', next: 'mobile-force-restart', hotkey: '2' },
                { text: 'Charging indicator not showing', article: 'charging-troubleshooting', hotkey: '3' }
            ]
        },
        'mobile-force-restart': {
            question: 'Ask customer: "Let\'s try a force restart. Hold the power button and volume down button together for 10 seconds."',
            guidance: 'This works for most smartphones - adjust instructions for specific models if needed',
            options: [
                { text: 'Phone restarted successfully', article: 'prevent-future-freezing', hotkey: '1' },
                { text: 'Still no response', article: 'hardware-repair-needed', hotkey: '2' }
            ]
        },
        'internet-issues': {
            question: 'Ask customer: "Are you having trouble with all websites or just specific ones?"',
            guidance: 'This helps determine if it\'s a general connectivity or site-specific issue',
            options: [
                { text: 'All websites/internet not working', next: 'connectivity-check', hotkey: '1' },
                { text: 'Only specific websites', article: 'website-specific-issues', hotkey: '2' },
                { text: 'Internet is slow but working', next: 'speed-troubleshoot', hotkey: '3' }
            ]
        },
        'connectivity-check': {
            question: 'Ask customer: "Can you see if other devices in your home can connect to the internet?"',
            guidance: 'This determines if it\'s a device-specific or network-wide issue',
            options: [
                { text: 'Other devices work fine', next: 'device-network-settings', hotkey: '1' },
                { text: 'No devices can connect', next: 'router-troubleshoot', hotkey: '2' },
                { text: 'No other devices to test', next: 'device-network-settings', hotkey: '3' }
            ]
        },
        'router-troubleshoot': {
            question: 'Ask customer: "Please unplug your router/modem for 30 seconds, then plug it back in and wait 2 minutes."',
            guidance: 'This is the standard router reset procedure',
            options: [
                { text: 'Internet working after router reset', article: 'router-maintenance-tips', hotkey: '1' },
                { text: 'Still no internet connection', article: 'contact-isp-guide', hotkey: '2' }
            ]
        },
        'device-network-settings': {
            question: 'Ask customer: "Let\'s check your WiFi settings. Can you see your network name in the available networks?"',
            guidance: 'Guide them to their device\'s WiFi settings',
            options: [
                { text: 'Yes - Can see network but can\'t connect', article: 'wifi-password-reset', hotkey: '1' },
                { text: 'No - Network name not showing', article: 'wifi-network-troubleshooting', hotkey: '2' },
                { text: 'Connected to WiFi but no internet', article: 'dns-settings-guide', hotkey: '3' }
            ]
        }
    }
};
