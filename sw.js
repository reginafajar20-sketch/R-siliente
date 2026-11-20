/* Offline support: cache the app shell, serve from cache first, refresh in background. */
const V='resiliente-v1',SHELL=['./','./index.html','./manifest.json','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;
e.respondWith(caches.match(e.request).then(h=>{const n=fetch(e.request).then(r=>{if(r.ok&&(e.request.url.startsWith(self.location.origin)||/fonts\.(googleapis|gstatic)\.com/.test(e.request.url)))caches.open(V).then(c=>c.put(e.request,r.clone()));return r}).catch(()=>h);return h||n}))});
