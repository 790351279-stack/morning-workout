var CACHE_NAME = 'morning-workout-v12';
var ASSETS = ['./', './index.html', './manifest.json'];

self.addEventListener('install', function(e) {
  e.waitUntil(caches.open(CACHE_NAME).then(function(c) { return c.addAll(ASSETS); }));
  self.skipWaiting();
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    fetch(e.request).then(function(response) {
      var clone = response.clone();
      caches.open(CACHE_NAME).then(function(c) { c.put(e.request, clone); });
      return response;
    }).catch(function() {
      return caches.match(e.request);
    })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(caches.keys().then(function(keys) { return Promise.all(keys.filter(function(k) { return k !== CACHE_NAME; }).map(function(k) { return caches.delete(k); })); }));
});
