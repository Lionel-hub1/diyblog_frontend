export function register() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            const swUrl = `${process.env.PUBLIC_URL}/serviceWorker.js`;

            registerValidSW(swUrl);
        });
    }
}

function registerValidSW(swUrl) {
    navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
            registration.onupdatefound = () => {
                const installingWorker = registration.installing;
                if (installingWorker == null) {
                    return;
                }
                installingWorker.onstatechange = () => {
                    if (installingWorker.state === 'installed') {
                        if (navigator.serviceWorker.controller) {
                            // At this point, the updated precached content has been fetched,
                            // but the previous service worker will still serve the older
                            // content until all client tabs are closed.
                            console.log('New content is available and will be used when all tabs for this page are closed.');

                            // You could show a notification here that a new version is available
                        } else {
                            // At this point, everything has been precached.
                            console.log('Content is cached for offline use.');
                        }
                    }
                };
            };
        })
        .catch((error) => {
            console.error('Error during service worker registration:', error);
        });
}

export function unregister() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready
            .then((registration) => {
                registration.unregister();
            })
            .catch((error) => {
                console.error(error.message);
            });
    }
}
