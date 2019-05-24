let web_cache_name = 'restaurant_cache'

self.addEventListener('activate',function(event){
	event.waitUntil(
		caches.keys().then(function(cacheNames){
			return Promise.all(
				cacheNames.filter(function(cacheName){
					cacheName.starstWith('restaurant_')&&
					cacheName != web_cache_name;
				}).map(function(cacheName){
					caches.delete(cacheName);
				})
			);
		})
	)
})

self.addEventListener('fetch', function(event) {
	event.respondWith(
		caches.match(event.request).then(function(response){
			if (response){return response;}

			return fetch(event.request).then(function(response){
				let responseToCache = response.clone();
				caches.open(web_cache_name).then(function(cache){
					let fetchUrl = event.request.url;
					if(fetchUrl.startsWith("http://localhost")){
						cache.put(event.request,responseToCache);
					}

				});
				return response;
			})
		})
	)
});