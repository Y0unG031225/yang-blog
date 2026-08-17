const CACHE = "yang-blog-v3-core";
const RUNTIME = "yang-blog-v3-runtime";
const BASE = new URL(self.registration.scope).pathname.replace(/\/$/, "");
const CORE = ["/", "/archives/", "/categories/", "/tags/", "/favicon.svg", "/city-hero-optimized.webp"].map(path => `${BASE}${path}`);

async function trimRuntimeCache(limit = 80) {
  const cache = await caches.open(RUNTIME);
  const keys = await cache.keys();
  await Promise.all(keys.slice(0, Math.max(0, keys.length - limit)).map(key => cache.delete(key)));
}

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => ![CACHE, RUNTIME].includes(key)).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET" || new URL(event.request.url).origin !== self.location.origin) return;
  if (event.request.mode === "navigate") {
    event.respondWith(fetch(event.request).then(response => {
      if (response.ok) caches.open(RUNTIME).then(cache => cache.put(event.request, response.clone())).then(() => trimRuntimeCache());
      return response;
    }).catch(async () => (await caches.match(event.request)) || caches.match(`${BASE}/`)));
    return;
  }
  if (!["style", "script", "image", "font"].includes(event.request.destination)) return;
  event.respondWith(caches.match(event.request).then(cached => {
    const fresh = fetch(event.request).then(response => {
      if (response.ok) caches.open(RUNTIME).then(cache => cache.put(event.request, response.clone())).then(() => trimRuntimeCache());
      return response;
    });
    return cached || fresh;
  }));
});
