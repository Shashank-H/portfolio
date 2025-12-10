import { firebaseConfig } from "./firebase-config.js";

let analytics = null;
let logEventFn = null;

// Use dynamic imports to handle CORS/auth errors gracefully
(async () => {
  try {
    const { initializeApp } = await import("https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js");
    const firebaseAnalytics = await import("https://www.gstatic.com/firebasejs/12.6.0/firebase-analytics.js");
    
    logEventFn = firebaseAnalytics.logEvent;
    const app = initializeApp(firebaseConfig);

    // Initialize analytics only if not in development
    if (location.hostname !== "localhost" && location.hostname !== "127.0.0.1") {
      analytics = firebaseAnalytics.getAnalytics(app);
      console.log("Firebase Analytics initialized");
    } else {
      console.log("Firebase Analytics disabled in development");
    }
  } catch (error) {
    console.warn("Failed to load Firebase SDK:", error);
    console.log("Firebase Analytics will be disabled");
  }
})();

// Export a wrapper function for logEvent
export const logEvent = (...args) => {
  if (logEventFn) {
    return logEventFn(...args);
  }
};

export { analytics };

export function logResumeDownload() {
  if (analytics && logEventFn) {
    logEventFn(analytics, 'resume_download');
  } else {
    console.log("Resume download logged (mock)");
  }
}

// Make logResumeDownload available globally for onclick handlers
window.logResumeDownload = logResumeDownload;
