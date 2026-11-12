// Serves uploaded games (stored in this browser's IndexedDB) at /_user/<id>/<path>
var DBN = "schoolhub";
var MIME = {html:"text/html",htm:"text/html",js:"text/javascript",mjs:"text/javascript",css:"text/css",json:"application/json",png:"image/png",jpg:"image/jpeg",jpeg:"image/jpeg",gif:"image/gif",svg:"image/svg+xml",webp:"image/webp",ico:"image/x-icon",mp3:"audio/mpeg",ogg:"audio/ogg",wav:"audio/wav",m4a:"audio/mp4",mp4:"video/mp4",webm:"video/webm",wasm:"application/wasm",woff:"font/woff",woff2:"font/woff2",ttf:"font/ttf",otf:"font/otf",txt:"text/plain",xml:"application/xml",data:"application/octet-stream"};

self.addEventListener("install", function () { self.skipWaiting(); });
self.addEventListener("activate", function (e) { e.waitUntil(self.clients.claim()); });

function openDB() {
  return new Promise(function (res, rej) {
    var r = indexedDB.open(DBN, 1);
    r.onupgradeneeded = function () {
      var d = r.result;
      if (!d.objectStoreNames.contains("games")) d.createObjectStore("games", { keyPath: "id" });
      if (!d.objectStoreNames.contains("files")) d.createObjectStore("files");
    };
    r.onsuccess = function () { res(r.result); };
    r.onerror = function () { rej(r.error); };
  });
}
function get(db, key) {
  return new Promise(function (res, rej) {
    var q = db.transaction("files").objectStore("files").get(key);
    q.onsuccess = function () { res(q.result); };
    q.onerror = function () { rej(q.error); };
  });
}

self.addEventListener("fetch", function (e) {
  var u = new URL(e.request.url);
  var m = u.pathname.match(/\/_user\/([^/]+)\/(.*)$/);
  if (!m || u.origin !== self.location.origin) return;
  e.respondWith(serve(m[1], decodeURIComponent(m[2])));
});

async function serve(id, path) {
  try {
    var db = await openDB();
    var blob = await get(db, id + "/" + path);
    if (!blob && (path === "" || path.slice(-1) === "/")) blob = await get(db, id + "/" + path + "index.html");
    if (!blob) return new Response("Not found", { status: 404 });
    var ext = path.split(".").pop().toLowerCase();
    return new Response(blob, { headers: { "Content-Type": blob.type || MIME[ext] || "application/octet-stream" } });
  } catch (err) {
    return new Response("Error loading file", { status: 500 });
  }
}
