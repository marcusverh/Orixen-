/* Orixen Command Center · cache de l'interface uniquement (aucune donnée de prospect) */
var CACHE = 'cc-shell-v1';
var SHELL = ['/command-center/', '/command-center/cc.css', '/command-center/cc.js', '/command-center/cc-data.js', '/assets/inter.woff2', '/assets/icon-192.png'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (k) { return Promise.all(k.filter(function (n) { return n !== CACHE; }).map(function (n) { return caches.delete(n); })); }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  if (SHELL.indexOf(u.pathname) < 0) return;
  e.respondWith(
    fetch(e.request).then(function (r) { var copy = r.clone(); caches.open(CACHE).then(function (c) { c.put(e.request, copy); }); return r; })
      .catch(function () { return caches.match(e.request); })
  );
});
