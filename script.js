window.onload = function() {

// 1. Parâmetros de inicialização da página inicial
	var map = L.map("meumapa", {
		center: [-25.47, -49.27],
		zoom: 12,
		zoomSnap: 0.5,
		zoomDelta: 0.5,
		minZoom: 4.5,
		maxZoom: 18
	});

	// 2. Adição do mapa base (Base Cartografica)
	var osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

  // 3. Adição dos demais layers:
  // - layer referente aos conflitos (formato geoJson)
	var eventos = L.geoJson(protestos).addTo(map);

  // - layer referente aos bairros de Curitiba (formato geoJson)
  var bairrosCwb = L.geoJson(bairros).addTo(map);

	// 4. Em seguida vem a elaboração do Mapa de Calor
	// 4.a. a princípio é necessária a função que analisa o geoJSON e extrai as coordenadas, retornando-as no formato requerido pelo plugin leaflet.heat
	geoJson2heat = function(geojson, intensidade) {
		return geojson.features.map(function(feature) {
			return [parseFloat(feature.geometry.coordinates[1]),
							parseFloat(feature.geometry.coordinates[0]), intensidade];
		});
	}
	//'protestos' é o nome da variável inserida dentro do arquivo geoJson, seguido do valor da intensidade
	var coord_mapa = geoJson2heat(protestos, 2);

	// 4.b. Agora que temos a matriz de coordenadas, com as respectivas intensidades, é possível utilizar o plugin leaflet.heat
	var mapaCalor = L.heatLayer(coord_mapa, {radius: 23, blur: 40, maxZoom: 13});
	map.addLayer(mapaCalor);

	// 5. Seleção de camadas: osm, eventos pontuais, mapa de calor, divisas de bairros
	var baseMaps = {
		"Mapa de Calor": mapaCalor
	};

	var overlayMaps = {
		"Eventos": eventos,
    "Divisa de Bairros": bairrosCwb
	};

	L.control.layers(baseMaps, overlayMaps).addTo(map);


}
