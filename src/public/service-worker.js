// Smart Tourism India - Service Worker for PWA
const CACHE_NAME = 'smart-tourism-v1.0.0';
const OFFLINE_URL = '/offline.html';

// Assets to cache immediately
const PRECACHE_ASSETS = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
];

// Install event - cache core assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching core assets');
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => {
      console.log('[Service Worker] Skip waiting');
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[Service Worker] Claiming clients');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Handle navigation requests
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(OFFLINE_URL);
      })
    );
    return;
  }

  // For other requests, try cache first, then network
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached version and update cache in background
        fetch(event.request).then((response) => {
          if (response && response.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, response);
            });
          }
        });
        return cachedResponse;
      }

      // Not in cache, fetch from network
      return fetch(event.request).then((response) => {
        // Don't cache if not a success response
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }

        // Clone the response
        const responseToCache = response.clone();

        // Add to cache for future use
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      }).catch(() => {
        // Network failed, try to return cached offline page
        return caches.match(OFFLINE_URL);
      });
    })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background sync:', event.tag);
  
  if (event.tag === 'sync-bookings') {
    event.waitUntil(syncBookings());
  } else if (event.tag === 'sync-messages') {
    event.waitUntil(syncMessages());
  }
});

// Push notification handler
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push notification received');
  
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Smart Tourism India';
  const options = {
    body: data.body || 'You have a new notification',
    icon: '/icon-192x192.png',
    badge: '/icon-72x72.png',
    vibrate: [200, 100, 200],
    data: data.data || {},
    actions: data.actions || [],
    tag: data.tag || 'default',
    requireInteraction: data.requireInteraction || false,
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification clicked:', event.notification.tag);
  
  event.notification.close();

  // Handle action clicks
  if (event.action) {
    console.log('[Service Worker] Action clicked:', event.action);
  }

  // Open or focus the app
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if app is already open
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      // If not open, open new window
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

// Helper function to sync bookings
async function syncBookings() {
  try {
    const cache = await caches.open(CACHE_NAME);
    const requests = await cache.keys();
    
    console.log('[Service Worker] Syncing bookings...');
    
    // Send queued bookings to server
    const pendingBookings = await getPendingBookings();
    if (pendingBookings.length > 0) {
      // Make API calls to sync
      await Promise.all(
        pendingBookings.map(booking => 
          fetch('/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(booking)
          })
        )
      );
      console.log('[Service Worker] Bookings synced successfully');
    }
  } catch (error) {
    console.error('[Service Worker] Sync failed:', error);
  }
}

// Helper function to sync messages
async function syncMessages() {
  try {
    console.log('[Service Worker] Syncing messages...');
    
    const pendingMessages = await getPendingMessages();
    if (pendingMessages.length > 0) {
      await Promise.all(
        pendingMessages.map(message =>
          fetch('/api/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(message)
          })
        )
      );
      console.log('[Service Worker] Messages synced successfully');
    }
  } catch (error) {
    console.error('[Service Worker] Message sync failed:', error);
  }
}

// Helper functions to get pending data from IndexedDB
function getPendingBookings() {
  // In production, this would read from IndexedDB
  return Promise.resolve([]);
}

function getPendingMessages() {
  // In production, this would read from IndexedDB
  return Promise.resolve([]);
}

// Periodic background sync
self.addEventListener('periodicsync', (event) => {
  console.log('[Service Worker] Periodic sync:', event.tag);
  
  if (event.tag === 'update-content') {
    event.waitUntil(updateContent());
  }
});

async function updateContent() {
  try {
    console.log('[Service Worker] Updating content...');
    
    // Fetch latest data
    const response = await fetch('/api/destinations');
    const data = await response.json();
    
    // Update cache
    const cache = await caches.open(CACHE_NAME);
    await cache.put('/api/destinations', new Response(JSON.stringify(data)));
    
    console.log('[Service Worker] Content updated successfully');
  } catch (error) {
    console.error('[Service Worker] Content update failed:', error);
  }
}

// Handle messages from clients
self.addEventListener('message', (event) => {
  console.log('[Service Worker] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

console.log('[Service Worker] Loaded successfully');
