self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  // A minimal fetch event handler is required by some browsers to trigger the "Add to Home Screen" prompt.
  // We aren't doing any complex caching here, just letting the request pass through.
});
