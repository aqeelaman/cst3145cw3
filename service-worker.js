var cacheName = 'afterschool-v1';
var cacheFiles = [
    'afterSchool.html',
    'server.js',
    'afterschool.webmanifest',
    'images/art.png',
    'images/badminton.png',
    'images/basketball.png',
    'images/coding.png',
    'images/cricket.png',
    'images/dance.png',
    'images/football.png',
    'images/mathematics.png',
    'images/swimming.png',
    'images/tennis.png',
    'images/icon-store-512.png'
];
self.addEventListener('install',(e)=>{
    console.log('[Service Worker] Install');
    e.waitUntil(
        caches.open(cacheName).then((cache) => {
            console.log('[Service Worker] Caching all the files');
            return cache.addAll(cacheFiles);
        })
    );
});
// self.addEventListener('fetch', function(e) {
//     e.respondWith(
//         caches.match(e.request).then(function (r) {
//             console.log('[Service Worker] Fetching resource: ' + e.request.url);
//             return r
//         })
//     );
// });
self.addEventListener('fetch', function(e) {
    e.respondWith(
        caches.match(e.request).then(function (r) {
            //download the file if it is not in the cache
            return r || fetch(e.request).then(function(response){
                //add the new file to cache
                return caches.open(cacheName).then(function (cache){
                    cache.put(e.request,response.clone());
                    return response;
                });
            });
        })
    );
});