
/**
 * MC6 Service Worker - Day 3
 * Cache inteligente para performance mobile
 */

const CACHE_VERSION = 'mc6-v3.0';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;
const IMAGE_CACHE = `${CACHE_VERSION}-images`;

// Recursos estáticos para cache
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/dist/style.purged.css',
    '/assets/js/main-optimized.js',
    '/assets/media/images/logo.webp',
    '/assets/media/images/hero-emp.webp',
    '/manifest.json'
];

// Recursos de imagem para cache dinâmico
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.svg'];

// Máximo de itens no cache dinâmico
const MAX_DYNAMIC_ITEMS = 50;
const MAX_IMAGE_ITEMS = 100;

self.addEventListener('install', event => {
    console.log('[SW] Installing Service Worker');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('[SW] Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                return self.skipWaiting();
            })
    );
});

self.addEventListener('activate', event => {
    console.log('[SW] Activating Service Worker');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE && 
                            cacheName !== DYNAMIC_CACHE && 
                            cacheName !== IMAGE_CACHE) {
                            console.log('[SW] Removing old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                return self.clients.claim();
            })
    );
});

self.addEventListener('fetch', event => {
    const requestUrl = new URL(event.request.url);
    
    // Estratégia para imagens
    if (isImageRequest(event.request)) {
        event.respondWith(handleImageRequest(event.request));
        return;
    }
    
    // Estratégia para recursos estáticos
    if (STATIC_ASSETS.includes(requestUrl.pathname) || 
        requestUrl.pathname.includes('.css') || 
        requestUrl.pathname.includes('.js')) {
        event.respondWith(handleStaticRequest(event.request));
        return;
    }
    
    // Estratégia para HTML (Network First)
    if (event.request.headers.get('accept').includes('text/html')) {
        event.respondWith(handleHTMLRequest(event.request));
        return;
    }
    
    // Outros recursos
    event.respondWith(handleOtherRequests(event.request));
});

function isImageRequest(request) {
    return IMAGE_EXTENSIONS.some(ext => request.url.includes(ext));
}

// Cache First para imagens
async function handleImageRequest(request) {
    try {
        const cache = await caches.open(IMAGE_CACHE);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            // Limitar tamanho do cache
            await limitCacheSize(IMAGE_CACHE, MAX_IMAGE_ITEMS);
            await cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
        
    } catch (error) {
        console.log('[SW] Image fetch failed:', error);
        // Retornar imagem placeholder se disponível
        return caches.match('/assets/media/images/placeholder.webp') || 
               new Response('', { status: 503 });
    }
}

// Cache First para recursos estáticos
async function handleStaticRequest(request) {
    try {
        const cachedResponse = await caches.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        const cache = await caches.open(STATIC_CACHE);
        await cache.put(request, networkResponse.clone());
        
        return networkResponse;
        
    } catch (error) {
        return caches.match(request);
    }
}

// Network First para HTML
async function handleHTMLRequest(request) {
    try {
        const networkResponse = await fetch(request);
        const cache = await caches.open(DYNAMIC_CACHE);
        await cache.put(request, networkResponse.clone());
        await limitCacheSize(DYNAMIC_CACHE, MAX_DYNAMIC_ITEMS);
        
        return networkResponse;
        
    } catch (error) {
        const cachedResponse = await caches.match(request);
        return cachedResponse || caches.match('/index.html');
    }
}

// Estratégia padrão
async function handleOtherRequests(request) {
    try {
        return await fetch(request);
    } catch (error) {
        return caches.match(request);
    }
}

// Limitar tamanho do cache
async function limitCacheSize(cacheName, maxItems) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    
    if (keys.length > maxItems) {
        await cache.delete(keys[0]);
        await limitCacheSize(cacheName, maxItems);
    }
}

// Background sync para analytics
self.addEventListener('sync', event => {
    if (event.tag === 'background-analytics') {
        event.waitUntil(sendAnalytics());
    }
});

async function sendAnalytics() {
    // Implementar envio de analytics offline
    console.log('[SW] Sending analytics data');
}
