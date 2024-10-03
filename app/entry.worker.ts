/// <reference lib="WebWorker" />

import { json } from "@remix-run/server-runtime";

export type {};
declare let self: ServiceWorkerGlobalScope;

const ASSETS = [
  "/build/",
  "/icons/",
  "/",
  "/dashboard",
  "/calculator",
];

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match("/") as Promise<Response>;
      })
    );
  } else if (ASSETS.some(asset => event.request.url.includes(asset))) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request).then((response) => {
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response;
          }
          const responseToCache = response.clone();
          caches.open("v1").then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return response;
        });
      })
    );
  }
});
