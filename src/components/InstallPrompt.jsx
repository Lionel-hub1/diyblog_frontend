import { useState, useEffect } from "react";

const InstallPrompt = () => {
    const [showPrompt, setShowPrompt] = useState(false);
    const [installEvent, setInstallEvent] = useState(null);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        // Check if running on iOS device
        const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        setIsIOS(isIOSDevice);

        // Handle PWA install event for non-iOS devices
        const handleBeforeInstallPrompt = (e) => {
            // Prevent the default browser install prompt
            e.preventDefault();
            // Store the event for later use
            setInstallEvent(e);
            // Show custom install prompt
            setShowPrompt(true);
        };

        // Check if app is already installed
        const isAppInstalled = window.matchMedia('(display-mode: standalone)').matches;
        if (isAppInstalled) {
            setShowPrompt(false);
            return;
        }

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!installEvent) return;

        // Show the browser install prompt
        installEvent.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await installEvent.userChoice;

        // Hide our custom prompt regardless of outcome
        setShowPrompt(false);

        // Optionally log outcome for analytics
        console.log(`User response to install prompt: ${outcome}`);
    };

    const handleClose = () => {
        setShowPrompt(false);
        // Store user preference in localStorage to not show again for a while
        localStorage.setItem('installPromptDismissed', Date.now().toString());
    };

    // Don't show if user has dismissed recently
    useEffect(() => {
        const lastDismissed = localStorage.getItem('installPromptDismissed');
        if (lastDismissed) {
            // Don't show for 3 days after dismissal
            const dismissedTime = parseInt(lastDismissed, 10);
            const threeDay = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds
            if (Date.now() - dismissedTime < threeDay) {
                setShowPrompt(false);
            }
        }
    }, []);

    if (!showPrompt) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4 z-50 border border-gray-200">
            <div className="flex items-center">
                <div className="bg-[#FFA559]/10 rounded-full p-2 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#FFA559]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-[#454545]">Install DIY Blog</h3>
                    <p className="text-sm text-gray-600">
                        {isIOS
                            ? "Add to your home screen for the best experience! Tap the share icon and then 'Add to Home Screen'."
                            : "Install our app for a better experience and offline access!"
                        }
                    </p>
                </div>
                <div className="flex items-center">
                    {!isIOS && (
                        <button
                            onClick={handleInstallClick}
                            className="mr-2 bg-[#FFA559] text-white px-3 py-1 rounded-md text-sm font-medium"
                        >
                            Install
                        </button>
                    )}
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InstallPrompt;
