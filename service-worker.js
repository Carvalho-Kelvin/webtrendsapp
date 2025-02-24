const CACHE_NAME = "habit-tracker-cache-v1";
const urlsToCache = [
  "webtrendsapp/index.html",
  "webtrendsapp/habits.html",
  "webtrendsapp/style/style.css",
  "webtrendsapp/scripts/firebase.js",
  "webtrendsapp/scripts/signIn.js",
  "webtrendsapp/scripts/habits.js",
  "webtrendsapp/icons/favicon.ico",
  "webtrendsapp/icons/icon-192.png",
  "webtrendsapp/icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
