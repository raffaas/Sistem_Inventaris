/* =========================================================
   INVENTRA — SERVICE WORKER
   Menyediakan dukungan offline sederhana & stabil.
   Ubah CACHE_VERSION setiap kali file di bawah diperbarui
   agar pengguna mendapatkan versi terbaru.
   ========================================================= */

   const CACHE_VERSION = "inventra-cache-v4";

   // File inti yang wajib tersedia secara offline
   const CORE_ASSETS = [
     "./",
     "./index.html",
     "./style.css",
     "./script.js",
     "./manifest.json",
     "./icons/icon-192.png",
     "./icons/icon-512.png"
   ];

   // Library pihak ketiga (dari CDN) yang dipakai script.js.
   // Wajib di-cache terpisah karena cache.addAll akan GAGAL TOTAL
   // (termasuk membatalkan cache CORE_ASSETS) kalau salah satu URL
   // cross-origin gagal diambil — makanya tidak digabung ke CORE_ASSETS.
   const CDN_ASSETS = [
     "https://cdn.jsdelivr.net/npm/chart.js@4.4.4/dist/chart.umd.min.js",
     "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js",
     "https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js"
   ];

   /* ---------- INSTALL: simpan file inti + library CDN ke cache ---------- */
   self.addEventListener("install", (event) => {
     event.waitUntil(
       caches.open(CACHE_VERSION).then(async (cache) => {
         // File inti (lokal): kalau ini gagal, instalasi tetap dilanjutkan,
         // tapi coba sebaik mungkin.
         try {
           await cache.addAll(CORE_ASSETS);
         } catch (e) {
           // Jangan gagalkan seluruh instalasi hanya karena satu file lokal hilang.
         }

         // Library CDN: coba cache satu per satu (bukan addAll) supaya
         // kalau satu CDN sedang down, yang lain tetap ke-cache.
         await Promise.all(
           CDN_ASSETS.map((url) =>
             fetch(url, { mode: "cors" })
               .then((res) => {
                 if (res.ok) return cache.put(url, res);
               })
               .catch(() => {
                 // Offline saat install / CDN diblokir → lewati, akan dicoba
                 // lagi otomatis lewat fetch handler di bawah saat online.
               })
           )
         );
       })
     );
     self.skipWaiting();
   });
   
   /* ---------- ACTIVATE: bersihkan cache versi lama ---------- */
   self.addEventListener("activate", (event) => {
     event.waitUntil(
       caches.keys().then((keys) =>
         Promise.all(
           keys
             .filter((key) => key !== CACHE_VERSION)
             .map((key) => caches.delete(key))
         )
       )
     );
     self.clients.claim();
   });
   
   /* ---------- FETCH: strategi "cache first, fallback network" ---------- */
   self.addEventListener("fetch", (event) => {
     // Hanya tangani request GET agar tidak mengganggu request lain
     if (event.request.method !== "GET") return;
   
     event.respondWith(
       caches.match(event.request).then((cachedResponse) => {
         if (cachedResponse) return cachedResponse;
   
         return fetch(event.request)
           .then((networkResponse) => {
             // Simpan salinan baru ke cache untuk penggunaan offline berikutnya
             const responseClone = networkResponse.clone();
             caches.open(CACHE_VERSION).then((cache) => {
               // Cache request yang berhasil: file sendiri (same-origin),
               // atau library CDN yang sudah didaftarkan di CDN_ASSETS.
               const isSameOrigin = event.request.url.startsWith(self.location.origin);
               const isKnownCdnAsset = CDN_ASSETS.includes(event.request.url);
               if (networkResponse.ok && (isSameOrigin || isKnownCdnAsset)) {
                 cache.put(event.request, responseClone);
               }
             });
             return networkResponse;
           })
           .catch(() => {
             // Jika offline dan halaman utama diminta, kembalikan index.html dari cache
             if (event.request.mode === "navigate") {
               return caches.match("./index.html");
             }
           });
       })
     );
   });