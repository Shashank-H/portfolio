import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAnalytics, logEvent } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-analytics.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);

let analytics = null;

// Initialize analytics only if not in development
if (location.hostname !== "localhost" && location.hostname !== "127.0.0.1") {
  analytics = getAnalytics(app);
  console.log("Firebase Analytics initialized");
} else {
  console.log("Firebase Analytics disabled in development");
}

export { analytics, logEvent };

export function logResumeDownload() {
  if (analytics) {
    logEvent(analytics, 'resume_download');
  } else {
    console.log("Resume download logged (mock)");
  }
}
