let web_cache_name = 'restaurant_cache_01'

self.addEventListener('activate',function(event){
	event.waitUntil(

		caches.keys().then(function(cacheNames){
			return Promise.all(
				cacheNames.filter(function(cacheName){
					cacheName.startWith('restaurant_')&&
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

			var request = event.request.clone();
			return fetch(request).then(function(response){
				var responseToCache = response.clone();
				caches.open(web_cache_name).then(function(cache){
					cache.put(event.request,responseToCache);
				});
			return response;
			})
		})
	)
});