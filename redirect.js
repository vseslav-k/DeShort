// Track the last processed URL to prevent repeated redirects
let lastUrl = location.href;

// Function to check and redirect Shorts URLs
function checkAndRedirect() {
    const currentUrl = location.href;

    if (currentUrl.includes("youtube.com/shorts/") && currentUrl !== lastUrl) {
        lastUrl = currentUrl; // Update last processed URL

        // Extract the video ID
        const videoId = currentUrl.split("/shorts/")[1].split("?")[0];

        // Construct the new watch URL
        const newUrl = `https://www.youtube.com/watch?v=${videoId}`;

        console.log("Redirecting to:", newUrl);

        // Redirect to the standard YouTube watch page
        window.location.replace(newUrl);
    }
}

// Hook into YouTube’s history changes (for SPA navigation)
function observeHistoryChanges() {
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function (...args) {
        originalPushState.apply(this, args);
        checkAndRedirect(); // Run redirect check when navigation happens
    };

    history.replaceState = function (...args) {
        originalReplaceState.apply(this, args);
        checkAndRedirect(); // Run redirect check when navigation happens
    };

    // Listen for popstate events (when navigating back/forward)
    window.addEventListener('popstate', checkAndRedirect);
}

// Listen for dynamic URL changes every 250ms (ensures detection while scrolling)
const urlObserver = setInterval(checkAndRedirect, 250);

// Run the redirect check immediately
checkAndRedirect();

// Start observing history changes (for internal navigation)
observeHistoryChanges();

// Stop observer when leaving YouTube (performance optimization)
window.addEventListener("beforeunload", () => {
    clearInterval(urlObserver);
});
