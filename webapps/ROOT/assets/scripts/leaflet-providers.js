/*Leaflet providers &
FULLSCREEEN: https://unpkg.com/browse/leaflet-fullscreen@1.0.2/dist/Leaflet.fullscreen.js
SEARCH: https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.js*/

(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(['leaflet'], factory);
	} else if (typeof modules === 'object' && module.exports) {
		// define a Common JS module that relies on 'leaflet'
		module.exports = factory(require('leaflet'));
	} else {
		// Assume Leaflet is loaded into global object L already
		factory(L);
	}
}(this, function (L) {
	'use strict';

	L.TileLayer.Provider = L.TileLayer.extend({
		initialize: function (arg, options) {
			var providers = L.TileLayer.Provider.providers;

			var parts = arg.split('.');

			var providerName = parts[0];
			var variantName = parts[1];

			if (!providers[providerName]) {
				throw 'No such provider (' + providerName + ')';
			}

			var provider = {
				url: providers[providerName].url,
				options: providers[providerName].options
			};

			// overwrite values in provider from variant.
			if (variantName && 'variants' in providers[providerName]) {
				if (!(variantName in providers[providerName].variants)) {
					throw 'No such variant of ' + providerName + ' (' + variantName + ')';
				}
				var variant = providers[providerName].variants[variantName];
				var variantOptions;
				if (typeof variant === 'string') {
					variantOptions = {
						variant: variant
					};
				} else {
					variantOptions = variant.options;
				}
				provider = {
					url: variant.url || provider.url,
					options: L.Util.extend({}, provider.options, variantOptions)
				};
			}

			// replace attribution placeholders with their values from toplevel provider attribution,
			// recursively
			var attributionReplacer = function (attr) {
				if (attr.indexOf('{attribution.') === -1) {
					return attr;
				}
				return attr.replace(/\{attribution.(\w*)\}/g,
					function (match, attributionName) {
						return attributionReplacer(providers[attributionName].options.attribution);
					}
				);
			};
			provider.options.attribution = attributionReplacer(provider.options.attribution);

			// Compute final options combining provider options with any user overrides
			var layerOpts = L.Util.extend({}, provider.options, options);
			L.TileLayer.prototype.initialize.call(this, provider.url, layerOpts);
		}
	});

	/**
	 * Definition of providers.
	 * see http://leafletjs.com/reference.html#tilelayer for options in the options map.
	 */

	L.TileLayer.Provider.providers = {
		OpenStreetMap: {
			url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
			options: {
				maxZoom: 19,
				attribution:
					'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			},
			variants: {
				Mapnik: {},
				DE: {
					url: 'https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png',
					options: {
						maxZoom: 18
					}
				},
				CH: {
					url: 'https://tile.osm.ch/switzerland/{z}/{x}/{y}.png',
					options: {
						maxZoom: 18,
						bounds: [[45, 5], [48, 11]]
					}
				},
				France: {
					url: 'https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png',
					options: {
						maxZoom: 20,
						attribution: '&copy; OpenStreetMap France | {attribution.OpenStreetMap}'
					}
				},
				HOT: {
					url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
					options: {
						attribution:
							'{attribution.OpenStreetMap}, ' +
							'Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> ' +
							'hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
					}
				},
				BZH: {
					url: 'https://tile.openstreetmap.bzh/br/{z}/{x}/{y}.png',
					options: {
						attribution: '{attribution.OpenStreetMap}, Tiles courtesy of <a href="http://www.openstreetmap.bzh/" target="_blank">Breton OpenStreetMap Team</a>',
						bounds: [[46.2, -5.5], [50, 0.7]]
					}
				}
			}
		},
		OpenSeaMap: {
			url: 'https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png',
			options: {
				attribution: 'Map data: &copy; <a href="http://www.openseamap.org">OpenSeaMap</a> contributors'
			}
		},
		OpenPtMap: {
			url: 'http://openptmap.org/tiles/{z}/{x}/{y}.png',
			options: {
				maxZoom: 17,
				attribution: 'Map data: &copy; <a href="http://www.openptmap.org">OpenPtMap</a> contributors'
			}
		},
		OpenTopoMap: {
			url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
			options: {
				maxZoom: 17,
				attribution: 'Map data: {attribution.OpenStreetMap}, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
			}
		},
		OpenRailwayMap: {
			url: 'https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png',
			options: {
				maxZoom: 19,
				attribution: 'Map data: {attribution.OpenStreetMap} | Map style: &copy; <a href="https://www.OpenRailwayMap.org">OpenRailwayMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
			}
		},
		OpenFireMap: {
			url: 'http://openfiremap.org/hytiles/{z}/{x}/{y}.png',
			options: {
				maxZoom: 19,
				attribution: 'Map data: {attribution.OpenStreetMap} | Map style: &copy; <a href="http://www.openfiremap.org">OpenFireMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
			}
		},
		SafeCast: {
			url: 'https://s3.amazonaws.com/te512.safecast.org/{z}/{x}/{y}.png',
			options: {
				maxZoom: 16,
				attribution: 'Map data: {attribution.OpenStreetMap} | Map style: &copy; <a href="https://blog.safecast.org/about/">SafeCast</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
			}
		},
		Stadia: {
			url: 'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png',
			options: {
				maxZoom: 20,
				attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
			},
			variants: {
				AlidadeSmooth: {
					url: 'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png'
				},
				AlidadeSmoothDark: {
					url: 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png'
				},
				OSMBright: {
					url: 'https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png'
				},
				Outdoors: {
					url: 'https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png'
				}
			}
		},
		Thunderforest: {
			url: 'https://{s}.tile.thunderforest.com/{variant}/{z}/{x}/{y}.png?apikey={apikey}',
			options: {
				attribution:
					'&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, {attribution.OpenStreetMap}',
				variant: 'cycle',
				apikey: '<insert your api key here>',
				maxZoom: 22
			},
			variants: {
				OpenCycleMap: 'cycle',
				Transport: {
					options: {
						variant: 'transport'
					}
				},
				TransportDark: {
					options: {
						variant: 'transport-dark'
					}
				},
				SpinalMap: {
					options: {
						variant: 'spinal-map'
					}
				},
				Landscape: 'landscape',
				Outdoors: 'outdoors',
				Pioneer: 'pioneer',
				MobileAtlas: 'mobile-atlas',
				Neighbourhood: 'neighbourhood'
			}
		},
		CyclOSM: {
			url: 'https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png',
			options: {
				maxZoom: 20,
				attribution: '<a href="https://github.com/cyclosm/cyclosm-cartocss-style/releases" title="CyclOSM - Open Bicycle render">CyclOSM</a> | Map data: {attribution.OpenStreetMap}'
			}
		},
		Hydda: {
			url: 'https://{s}.tile.openstreetmap.se/hydda/{variant}/{z}/{x}/{y}.png',
			options: {
				maxZoom: 20,
				variant: 'full',
				attribution: 'Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data {attribution.OpenStreetMap}'
			},
			variants: {
				Full: 'full',
				Base: 'base',
				RoadsAndLabels: 'roads_and_labels'
			}
		},
		Jawg: {
			url: 'https://{s}.tile.jawg.io/{variant}/{z}/{x}/{y}{r}.png?access-token={accessToken}',
			options: {
				attribution:
					'<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> ' +
					'{attribution.OpenStreetMap}',
				minZoom: 0,
				maxZoom: 22,
				subdomains: 'abcd',
				variant: 'jawg-terrain',
				// Get your own Jawg access token here : https://www.jawg.io/lab/
				// NB : this is a demonstration key that comes with no guarantee
				accessToken: '<insert your access token here>',
			},
			variants: {
				Streets: 'jawg-streets',
				Terrain: 'jawg-terrain',
				Sunny: 'jawg-sunny',
				Dark: 'jawg-dark',
				Light: 'jawg-light',
				Matrix: 'jawg-matrix'
			}
		},
		MapBox: {
			url: 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}{r}?access_token={accessToken}',
			options: {
				attribution:
					'&copy; <a href="https://www.mapbox.com/about/maps/" target="_blank">Mapbox</a> ' +
					'{attribution.OpenStreetMap} ' +
					'<a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a>',
				tileSize: 512,
				maxZoom: 18,
				zoomOffset: -1,
				id: 'mapbox/streets-v11',
				accessToken: '<insert your access token here>',
			}
		},
		MapTiler: {
			url: 'https://api.maptiler.com/maps/{variant}/{z}/{x}/{y}{r}.{ext}?key={key}',
			options: {
				attribution:
					'<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
				variant: 'streets',
				ext: 'png',
				key: '<insert your MapTiler Cloud API key here>',
				tileSize: 512,
				zoomOffset: -1,
				minZoom: 0,
				maxZoom: 21
			},
			variants: {
				Streets: 'streets',
				Basic: 'basic',
				Bright: 'bright',
				Pastel: 'pastel',
				Positron: 'positron',
				Hybrid: {
					options: {
						variant: 'hybrid',
						ext: 'jpg'
					}
				},
				Toner: 'toner',
				Topo: 'topo',
				Voyager: 'voyager'
			}
		},
		Stamen: {
			url: 'https://stamen-tiles-{s}.a.ssl.fastly.net/{variant}/{z}/{x}/{y}{r}.{ext}',
			options: {
				attribution:
					'Map tiles by <a href="http://stamen.com">Stamen Design</a>, ' +
					'<a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; ' +
					'Map data {attribution.OpenStreetMap}',
				subdomains: 'abcd',
				minZoom: 0,
				maxZoom: 20,
				variant: 'toner',
				ext: 'png'
			},
			variants: {
				Toner: 'toner',
				TonerBackground: 'toner-background',
				TonerHybrid: 'toner-hybrid',
				TonerLines: 'toner-lines',
				TonerLabels: 'toner-labels',
				TonerLite: 'toner-lite',
				Watercolor: {
					url: 'https://stamen-tiles-{s}.a.ssl.fastly.net/{variant}/{z}/{x}/{y}.{ext}',
					options: {
						variant: 'watercolor',
						ext: 'jpg',
						minZoom: 1,
						maxZoom: 16
					}
				},
				Terrain: {
					options: {
						variant: 'terrain',
						minZoom: 0,
						maxZoom: 18
					}
				},
				TerrainBackground: {
					options: {
						variant: 'terrain-background',
						minZoom: 0,
						maxZoom: 18
					}
				},
				TerrainLabels: {
					options: {
						variant: 'terrain-labels',
						minZoom: 0,
						maxZoom: 18
					}
				},
				TopOSMRelief: {
					url: 'https://stamen-tiles-{s}.a.ssl.fastly.net/{variant}/{z}/{x}/{y}.{ext}',
					options: {
						variant: 'toposm-color-relief',
						ext: 'jpg',
						bounds: [[22, -132], [51, -56]]
					}
				},
				TopOSMFeatures: {
					options: {
						variant: 'toposm-features',
						bounds: [[22, -132], [51, -56]],
						opacity: 0.9
					}
				}
			}
		},
		TomTom: {
			url: 'https://{s}.api.tomtom.com/map/1/tile/{variant}/{style}/{z}/{x}/{y}.{ext}?key={apikey}',
			options: {
				variant: 'basic',
				maxZoom: 22,
				attribution:
					'<a href="https://tomtom.com" target="_blank">&copy;  1992 - ' + new Date().getFullYear() + ' TomTom.</a> ',
				subdomains: 'abcd',
				style: 'main',
				ext: 'png',
				apikey: '<insert your API key here>',
			},
			variants: {
				Basic: 'basic',
				Hybrid: 'hybrid',
				Labels: 'labels'
			}
		},
		Esri: {
			url: 'https://server.arcgisonline.com/ArcGIS/rest/services/{variant}/MapServer/tile/{z}/{y}/{x}',
			options: {
				variant: 'World_Street_Map',
				attribution: 'Tiles &copy; Esri'
			},
			variants: {
				WorldStreetMap: {
					options: {
						attribution:
							'{attribution.Esri} &mdash; ' +
							'Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
					}
				},
				DeLorme: {
					options: {
						variant: 'Specialty/DeLorme_World_Base_Map',
						minZoom: 1,
						maxZoom: 11,
						attribution: '{attribution.Esri} &mdash; Copyright: &copy;2012 DeLorme'
					}
				},
				WorldTopoMap: {
					options: {
						variant: 'World_Topo_Map',
						attribution:
							'{attribution.Esri} &mdash; ' +
							'Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
					}
				},
				WorldImagery: {
					options: {
						variant: 'World_Imagery',
						attribution:
							'{attribution.Esri} &mdash; ' +
							'Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
					}
				},
				WorldTerrain: {
					options: {
						variant: 'World_Terrain_Base',
						maxZoom: 13,
						attribution:
							'{attribution.Esri} &mdash; ' +
							'Source: USGS, Esri, TANA, DeLorme, and NPS'
					}
				},
				WorldShadedRelief: {
					options: {
						variant: 'World_Shaded_Relief',
						maxZoom: 13,
						attribution: '{attribution.Esri} &mdash; Source: Esri'
					}
				},
				WorldPhysical: {
					options: {
						variant: 'World_Physical_Map',
						maxZoom: 8,
						attribution: '{attribution.Esri} &mdash; Source: US National Park Service'
					}
				},
				OceanBasemap: {
					options: {
						variant: 'Ocean_Basemap',
						maxZoom: 13,
						attribution: '{attribution.Esri} &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri'
					}
				},
				NatGeoWorldMap: {
					options: {
						variant: 'NatGeo_World_Map',
						maxZoom: 16,
						attribution: '{attribution.Esri} &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC'
					}
				},
				WorldGrayCanvas: {
					options: {
						variant: 'Canvas/World_Light_Gray_Base',
						maxZoom: 16,
						attribution: '{attribution.Esri} &mdash; Esri, DeLorme, NAVTEQ'
					}
				}
			}
		},
		OpenWeatherMap: {
			url: 'http://{s}.tile.openweathermap.org/map/{variant}/{z}/{x}/{y}.png?appid={apiKey}',
			options: {
				maxZoom: 19,
				attribution: 'Map data &copy; <a href="http://openweathermap.org">OpenWeatherMap</a>',
				apiKey:'<insert your api key here>',
				opacity: 0.5
			},
			variants: {
				Clouds: 'clouds',
				CloudsClassic: 'clouds_cls',
				Precipitation: 'precipitation',
				PrecipitationClassic: 'precipitation_cls',
				Rain: 'rain',
				RainClassic: 'rain_cls',
				Pressure: 'pressure',
				PressureContour: 'pressure_cntr',
				Wind: 'wind',
				Temperature: 'temp',
				Snow: 'snow'
			}
		},
		HERE: {
			/*
			 * HERE maps, formerly Nokia maps.
			 * These basemaps are free, but you need an api id and app key. Please sign up at
			 * https://developer.here.com/plans
			 */
			url:
				'https://{s}.{base}.maps.api.here.com/maptile/2.1/' +
				'{type}/{mapID}/{variant}/{z}/{x}/{y}/{size}/{format}?' +
				'app_id={app_id}&app_code={app_code}&lg={language}',
			options: {
				attribution:
					'Map &copy; 1987-' + new Date().getFullYear() + ' <a href="http://developer.here.com">HERE</a>',
				subdomains: '1234',
				mapID: 'newest',
				'app_id': '<insert your app_id here>',
				'app_code': '<insert your app_code here>',
				base: 'base',
				variant: 'normal.day',
				maxZoom: 20,
				type: 'maptile',
				language: 'eng',
				format: 'png8',
				size: '256'
			},
			variants: {
				normalDay: 'normal.day',
				normalDayCustom: 'normal.day.custom',
				normalDayGrey: 'normal.day.grey',
				normalDayMobile: 'normal.day.mobile',
				normalDayGreyMobile: 'normal.day.grey.mobile',
				normalDayTransit: 'normal.day.transit',
				normalDayTransitMobile: 'normal.day.transit.mobile',
				normalDayTraffic: {
					options: {
						variant: 'normal.traffic.day',
						base: 'traffic',
						type: 'traffictile'
					}
				},
				normalNight: 'normal.night',
				normalNightMobile: 'normal.night.mobile',
				normalNightGrey: 'normal.night.grey',
				normalNightGreyMobile: 'normal.night.grey.mobile',
				normalNightTransit: 'normal.night.transit',
				normalNightTransitMobile: 'normal.night.transit.mobile',
				reducedDay: 'reduced.day',
				reducedNight: 'reduced.night',
				basicMap: {
					options: {
						type: 'basetile'
					}
				},
				mapLabels: {
					options: {
						type: 'labeltile',
						format: 'png'
					}
				},
				trafficFlow: {
					options: {
						base: 'traffic',
						type: 'flowtile'
					}
				},
				carnavDayGrey: 'carnav.day.grey',
				hybridDay: {
					options: {
						base: 'aerial',
						variant: 'hybrid.day'
					}
				},
				hybridDayMobile: {
					options: {
						base: 'aerial',
						variant: 'hybrid.day.mobile'
					}
				},
				hybridDayTransit: {
					options: {
						base: 'aerial',
						variant: 'hybrid.day.transit'
					}
				},
				hybridDayGrey: {
					options: {
						base: 'aerial',
						variant: 'hybrid.grey.day'
					}
				},
				hybridDayTraffic: {
					options: {
						variant: 'hybrid.traffic.day',
						base: 'traffic',
						type: 'traffictile'
					}
				},
				pedestrianDay: 'pedestrian.day',
				pedestrianNight: 'pedestrian.night',
				satelliteDay: {
					options: {
						base: 'aerial',
						variant: 'satellite.day'
					}
				},
				terrainDay: {
					options: {
						base: 'aerial',
						variant: 'terrain.day'
					}
				},
				terrainDayMobile: {
					options: {
						base: 'aerial',
						variant: 'terrain.day.mobile'
					}
				}
			}
		},
		HEREv3: {
			/*
			 * HERE maps API Version 3.
			 * These basemaps are free, but you need an API key. Please sign up at
			 * https://developer.here.com/plans
			 * Version 3 deprecates the app_id and app_code access in favor of apiKey
			 *
			 * Supported access methods as of 2019/12/21:
			 * @see https://developer.here.com/faqs#access-control-1--how-do-you-control-access-to-here-location-services
			 */
			url:
				'https://{s}.{base}.maps.ls.hereapi.com/maptile/2.1/' +
				'{type}/{mapID}/{variant}/{z}/{x}/{y}/{size}/{format}?' +
				'apiKey={apiKey}&lg={language}',
			options: {
				attribution:
					'Map &copy; 1987-' + new Date().getFullYear() + ' <a href="http://developer.here.com">HERE</a>',
				subdomains: '1234',
				mapID: 'newest',
				apiKey: '<insert your apiKey here>',
				base: 'base',
				variant: 'normal.day',
				maxZoom: 20,
				type: 'maptile',
				language: 'eng',
				format: 'png8',
				size: '256'
			},
			variants: {
				normalDay: 'normal.day',
				normalDayCustom: 'normal.day.custom',
				normalDayGrey: 'normal.day.grey',
				normalDayMobile: 'normal.day.mobile',
				normalDayGreyMobile: 'normal.day.grey.mobile',
				normalDayTransit: 'normal.day.transit',
				normalDayTransitMobile: 'normal.day.transit.mobile',
				normalNight: 'normal.night',
				normalNightMobile: 'normal.night.mobile',
				normalNightGrey: 'normal.night.grey',
				normalNightGreyMobile: 'normal.night.grey.mobile',
				normalNightTransit: 'normal.night.transit',
				normalNightTransitMobile: 'normal.night.transit.mobile',
				reducedDay: 'reduced.day',
				reducedNight: 'reduced.night',
				basicMap: {
					options: {
						type: 'basetile'
					}
				},
				mapLabels: {
					options: {
						type: 'labeltile',
						format: 'png'
					}
				},
				trafficFlow: {
					options: {
						base: 'traffic',
						type: 'flowtile'
					}
				},
				carnavDayGrey: 'carnav.day.grey',
				hybridDay: {
					options: {
						base: 'aerial',
						variant: 'hybrid.day'
					}
				},
				hybridDayMobile: {
					options: {
						base: 'aerial',
						variant: 'hybrid.day.mobile'
					}
				},
				hybridDayTransit: {
					options: {
						base: 'aerial',
						variant: 'hybrid.day.transit'
					}
				},
				hybridDayGrey: {
					options: {
						base: 'aerial',
						variant: 'hybrid.grey.day'
					}
				},
				pedestrianDay: 'pedestrian.day',
				pedestrianNight: 'pedestrian.night',
				satelliteDay: {
					options: {
						base: 'aerial',
						variant: 'satellite.day'
					}
				},
				terrainDay: {
					options: {
						base: 'aerial',
						variant: 'terrain.day'
					}
				},
				terrainDayMobile: {
					options: {
						base: 'aerial',
						variant: 'terrain.day.mobile'
					}
				}
			}
		},
		FreeMapSK: {
			url: 'https://{s}.freemap.sk/T/{z}/{x}/{y}.jpeg',
			options: {
				minZoom: 8,
				maxZoom: 16,
				subdomains: 'abcd',
				bounds: [[47.204642, 15.996093], [49.830896, 22.576904]],
				attribution:
					'{attribution.OpenStreetMap}, vizualization CC-By-SA 2.0 <a href="http://freemap.sk">Freemap.sk</a>'
			}
		},
		MtbMap: {
			url: 'http://tile.mtbmap.cz/mtbmap_tiles/{z}/{x}/{y}.png',
			options: {
				attribution:
					'{attribution.OpenStreetMap} &amp; USGS'
			}
		},
		CartoDB: {
			url: 'https://{s}.basemaps.cartocdn.com/{variant}/{z}/{x}/{y}{r}.png',
			options: {
				attribution: '{attribution.OpenStreetMap} &copy; <a href="https://carto.com/attributions">CARTO</a>',
				subdomains: 'abcd',
				maxZoom: 19,
				variant: 'light_all'
			},
			variants: {
				Positron: 'light_all',
				PositronNoLabels: 'light_nolabels',
				PositronOnlyLabels: 'light_only_labels',
				DarkMatter: 'dark_all',
				DarkMatterNoLabels: 'dark_nolabels',
				DarkMatterOnlyLabels: 'dark_only_labels',
				Voyager: 'rastertiles/voyager',
				VoyagerNoLabels: 'rastertiles/voyager_nolabels',
				VoyagerOnlyLabels: 'rastertiles/voyager_only_labels',
				VoyagerLabelsUnder: 'rastertiles/voyager_labels_under'
			}
		},
		HikeBike: {
			url: 'https://tiles.wmflabs.org/{variant}/{z}/{x}/{y}.png',
			options: {
				maxZoom: 19,
				attribution: '{attribution.OpenStreetMap}',
				variant: 'hikebike'
			},
			variants: {
				HikeBike: {},
				HillShading: {
					options: {
						maxZoom: 15,
						variant: 'hillshading'
					}
				}
			}
		},
		BasemapAT: {
			url: 'https://maps{s}.wien.gv.at/basemap/{variant}/{type}/google3857/{z}/{y}/{x}.{format}',
			options: {
				maxZoom: 19,
				attribution: 'Datenquelle: <a href="https://www.basemap.at">basemap.at</a>',
				subdomains: ['', '1', '2', '3', '4'],
				type: 'normal',
				format: 'png',
				bounds: [[46.358770, 8.782379], [49.037872, 17.189532]],
				variant: 'geolandbasemap'
			},
			variants: {
				basemap: {
					options: {
						maxZoom: 20, // currently only in Vienna
						variant: 'geolandbasemap'
					}
				},
				grau: 'bmapgrau',
				overlay: 'bmapoverlay',
				terrain: {
					options: {
						variant: 'bmapgelaende',
						type: 'grau',
						format: 'jpeg'
					}
				},
				surface: {
					options: {
						variant: 'bmapoberflaeche',
						type: 'grau',
						format: 'jpeg'
					}
				},
				highdpi: {
					options: {
						variant: 'bmaphidpi',
						format: 'jpeg'
					}
				},
				orthofoto: {
					options: {
						maxZoom: 20, // currently only in Vienna
						variant: 'bmaporthofoto30cm',
						format: 'jpeg'
					}
				}
			}
		},
		nlmaps: {
			url: 'https://geodata.nationaalgeoregister.nl/tiles/service/wmts/{variant}/EPSG:3857/{z}/{x}/{y}.png',
			options: {
				minZoom: 6,
				maxZoom: 19,
				bounds: [[50.5, 3.25], [54, 7.6]],
				attribution: 'Kaartgegevens &copy; <a href="kadaster.nl">Kadaster</a>'
			},
			variants: {
				'standaard': 'brtachtergrondkaart',
				'pastel': 'brtachtergrondkaartpastel',
				'grijs': 'brtachtergrondkaartgrijs',
				'luchtfoto': {
					'url': 'https://geodata.nationaalgeoregister.nl/luchtfoto/rgb/wmts/2018_ortho25/EPSG:3857/{z}/{x}/{y}.png',
				}
			}
		},
		NASAGIBS: {
			url: 'https://map1.vis.earthdata.nasa.gov/wmts-webmerc/{variant}/default/{time}/{tilematrixset}{maxZoom}/{z}/{y}/{x}.{format}',
			options: {
				attribution:
					'Imagery provided by services from the Global Imagery Browse Services (GIBS), operated by the NASA/GSFC/Earth Science Data and Information System ' +
					'(<a href="https://earthdata.nasa.gov">ESDIS</a>) with funding provided by NASA/HQ.',
				bounds: [[-85.0511287776, -179.999999975], [85.0511287776, 179.999999975]],
				minZoom: 1,
				maxZoom: 9,
				format: 'jpg',
				time: '',
				tilematrixset: 'GoogleMapsCompatible_Level'
			},
			variants: {
				ModisTerraTrueColorCR: 'MODIS_Terra_CorrectedReflectance_TrueColor',
				ModisTerraBands367CR: 'MODIS_Terra_CorrectedReflectance_Bands367',
				ViirsEarthAtNight2012: {
					options: {
						variant: 'VIIRS_CityLights_2012',
						maxZoom: 8
					}
				},
				ModisTerraLSTDay: {
					options: {
						variant: 'MODIS_Terra_Land_Surface_Temp_Day',
						format: 'png',
						maxZoom: 7,
						opacity: 0.75
					}
				},
				ModisTerraSnowCover: {
					options: {
						variant: 'MODIS_Terra_Snow_Cover',
						format: 'png',
						maxZoom: 8,
						opacity: 0.75
					}
				},
				ModisTerraAOD: {
					options: {
						variant: 'MODIS_Terra_Aerosol',
						format: 'png',
						maxZoom: 6,
						opacity: 0.75
					}
				},
				ModisTerraChlorophyll: {
					options: {
						variant: 'MODIS_Terra_Chlorophyll_A',
						format: 'png',
						maxZoom: 7,
						opacity: 0.75
					}
				}
			}
		},
		NLS: {
			// NLS maps are copyright National library of Scotland.
			// http://maps.nls.uk/projects/api/index.html
			// Please contact NLS for anything other than non-commercial low volume usage
			//
			// Map sources: Ordnance Survey 1:1m to 1:63K, 1920s-1940s
			//   z0-9  - 1:1m
			//  z10-11 - quarter inch (1:253440)
			//  z12-18 - one inch (1:63360)
			url: 'https://nls-{s}.tileserver.com/nls/{z}/{x}/{y}.jpg',
			options: {
				attribution: '<a href="http://geo.nls.uk/maps/">National Library of Scotland Historic Maps</a>',
				bounds: [[49.6, -12], [61.7, 3]],
				minZoom: 1,
				maxZoom: 18,
				subdomains: '0123',
			}
		},
		JusticeMap: {
			// Justice Map (http://www.justicemap.org/)
			// Visualize race and income data for your community, county and country.
			// Includes tools for data journalists, bloggers and community activists.
			url: 'http://www.justicemap.org/tile/{size}/{variant}/{z}/{x}/{y}.png',
			options: {
				attribution: '<a href="http://www.justicemap.org/terms.php">Justice Map</a>',
				// one of 'county', 'tract', 'block'
				size: 'county',
				// Bounds for USA, including Alaska and Hawaii
				bounds: [[14, -180], [72, -56]]
			},
			variants: {
				income: 'income',
				americanIndian: 'indian',
				asian: 'asian',
				black: 'black',
				hispanic: 'hispanic',
				multi: 'multi',
				nonWhite: 'nonwhite',
				white: 'white',
				plurality: 'plural'
			}
		},
		Wikimedia: {
			url: 'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}{r}.png',
			options: {
				attribution: '<a href="https://wikimediafoundation.org/wiki/Maps_Terms_of_Use">Wikimedia</a>',
				minZoom: 1,
				maxZoom: 19
			}
		},
		GeoportailFrance: {
			url: 'https://wxs.ign.fr/{apikey}/geoportail/wmts?REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&STYLE={style}&TILEMATRIXSET=PM&FORMAT={format}&LAYER={variant}&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}',
			options: {
				attribution: '<a target="_blank" href="https://www.geoportail.gouv.fr/">Geoportail France</a>',
				bounds: [[-75, -180], [81, 180]],
				minZoom: 2,
				maxZoom: 18,
				// Get your own geoportail apikey here : http://professionnels.ign.fr/ign/contrats/
				// NB : 'choisirgeoportail' is a demonstration key that comes with no guarantee
				apikey: 'choisirgeoportail',
				format: 'image/jpeg',
				style : 'normal',
				variant: 'GEOGRAPHICALGRIDSYSTEMS.MAPS.SCAN-EXPRESS.STANDARD'
			},
			variants: {
				parcels: {
					options : {
						variant: 'CADASTRALPARCELS.PARCELS',
						maxZoom: 20,
						style : 'bdparcellaire',
						format: 'image/png'
					}
				},
				ignMaps: 'GEOGRAPHICALGRIDSYSTEMS.MAPS',
				maps: 'GEOGRAPHICALGRIDSYSTEMS.MAPS.SCAN-EXPRESS.STANDARD',
				orthos: {
					options: {
						maxZoom: 19,
						variant: 'ORTHOIMAGERY.ORTHOPHOTOS'
					}
				}
			}
		},
		OneMapSG: {
			url: 'https://maps-{s}.onemap.sg/v3/{variant}/{z}/{x}/{y}.png',
			options: {
				variant: 'Default',
				minZoom: 11,
				maxZoom: 18,
				bounds: [[1.56073, 104.11475], [1.16, 103.502]],
				attribution: '<img src="https://docs.onemap.sg/maps/images/oneMap64-01.png" style="height:20px;width:20px;"/> New OneMap | Map data &copy; contributors, <a href="http://SLA.gov.sg">Singapore Land Authority</a>'
			},
			variants: {
				Default: 'Default',
				Night: 'Night',
				Original: 'Original',
				Grey: 'Grey',
				LandLot: 'LandLot'
			}
		},
		USGS: {
			url: 'https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}',
			options: {
				maxZoom: 20,
				attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'
			},
			variants: {
				USTopo: {},
				USImagery: {
					url: 'https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}'
				},
				USImageryTopo: {
					url: 'https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryTopo/MapServer/tile/{z}/{y}/{x}'
				}
			}
		},
		WaymarkedTrails: {
			url: 'https://tile.waymarkedtrails.org/{variant}/{z}/{x}/{y}.png',
			options: {
				maxZoom: 18,
				attribution: 'Map data: {attribution.OpenStreetMap} | Map style: &copy; <a href="https://waymarkedtrails.org">waymarkedtrails.org</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
			},
			variants: {
				hiking: 'hiking',
				cycling: 'cycling',
				mtb: 'mtb',
				slopes: 'slopes',
				riding: 'riding',
				skating: 'skating'
			}
		},
		OpenAIP: {
			url: 'http://{s}.tile.maps.openaip.net/geowebcache/service/tms/1.0.0/openaip_basemap@EPSG%3A900913@png/{z}/{x}/{y}.{ext}',
			options: {
				attribution: '<a href="https://www.openaip.net/">openAIP Data</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-NC-SA</a>)',
				ext: 'png',
				minZoom: 4,
				maxZoom: 14,
				tms: true,
				detectRetina: true,
				subdomains: '12'
			}
		}
	};

	L.tileLayer.provider = function (provider, options) {
		return new L.TileLayer.Provider(provider, options);
	};

	return L;
}));


/*FULLSCREEEN: https://unpkg.com/browse/leaflet-fullscreen@1.0.2/dist/Leaflet.fullscreen.js*/
L.Control.Fullscreen = L.Control.extend({
    options: {
        position: 'topleft',
        title: {
            'false': 'View Fullscreen',
            'true': 'Exit Fullscreen'
        }
    },

    onAdd: function (map) {
        var container = L.DomUtil.create('div', 'leaflet-control-fullscreen leaflet-bar leaflet-control');

        this.link = L.DomUtil.create('a', 'leaflet-control-fullscreen-button leaflet-bar-part', container);
        this.link.href = '#';

        this._map = map;
        this._map.on('fullscreenchange', this._toggleTitle, this);
        this._toggleTitle();

        L.DomEvent.on(this.link, 'click', this._click, this);

        return container;
    },

    _click: function (e) {
        L.DomEvent.stopPropagation(e);
        L.DomEvent.preventDefault(e);
        this._map.toggleFullscreen(this.options);
    },

    _toggleTitle: function() {
        this.link.title = this.options.title[this._map.isFullscreen()];
    }
});

L.Map.include({
    isFullscreen: function () {
        return this._isFullscreen || false;
    },

    toggleFullscreen: function (options) {
        var container = this.getContainer();
        if (this.isFullscreen()) {
            if (options && options.pseudoFullscreen) {
                this._disablePseudoFullscreen(container);
            } else if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            } else {
                this._disablePseudoFullscreen(container);
            }
        } else {
            if (options && options.pseudoFullscreen) {
                this._enablePseudoFullscreen(container);
            } else if (container.requestFullscreen) {
                container.requestFullscreen();
            } else if (container.mozRequestFullScreen) {
                container.mozRequestFullScreen();
            } else if (container.webkitRequestFullscreen) {
                container.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            } else if (container.msRequestFullscreen) {
                container.msRequestFullscreen();
            } else {
                this._enablePseudoFullscreen(container);
            }
        }

    },

    _enablePseudoFullscreen: function (container) {
        L.DomUtil.addClass(container, 'leaflet-pseudo-fullscreen');
        this._setFullscreen(true);
        this.fire('fullscreenchange');
    },

    _disablePseudoFullscreen: function (container) {
        L.DomUtil.removeClass(container, 'leaflet-pseudo-fullscreen');
        this._setFullscreen(false);
        this.fire('fullscreenchange');
    },

    _setFullscreen: function(fullscreen) {
        this._isFullscreen = fullscreen;
        var container = this.getContainer();
        if (fullscreen) {
            L.DomUtil.addClass(container, 'leaflet-fullscreen-on');
        } else {
            L.DomUtil.removeClass(container, 'leaflet-fullscreen-on');
        }
        this.invalidateSize();
    },

    _onFullscreenChange: function (e) {
        var fullscreenElement =
            document.fullscreenElement ||
            document.mozFullScreenElement ||
            document.webkitFullscreenElement ||
            document.msFullscreenElement;

        if (fullscreenElement === this.getContainer() && !this._isFullscreen) {
            this._setFullscreen(true);
            this.fire('fullscreenchange');
        } else if (fullscreenElement !== this.getContainer() && this._isFullscreen) {
            this._setFullscreen(false);
            this.fire('fullscreenchange');
        }
    }
});

L.Map.mergeOptions({
    fullscreenControl: false
});

L.Map.addInitHook(function () {
    if (this.options.fullscreenControl) {
        this.fullscreenControl = new L.Control.Fullscreen(this.options.fullscreenControl);
        this.addControl(this.fullscreenControl);
    }

    var fullscreenchange;

    if ('onfullscreenchange' in document) {
        fullscreenchange = 'fullscreenchange';
    } else if ('onmozfullscreenchange' in document) {
        fullscreenchange = 'mozfullscreenchange';
    } else if ('onwebkitfullscreenchange' in document) {
        fullscreenchange = 'webkitfullscreenchange';
    } else if ('onmsfullscreenchange' in document) {
        fullscreenchange = 'MSFullscreenChange';
    }

    if (fullscreenchange) {
        var onFullscreenChange = L.bind(this._onFullscreenChange, this);

        this.whenReady(function () {
            L.DomEvent.on(document, fullscreenchange, onFullscreenChange);
        });

        this.on('unload', function () {
            L.DomEvent.off(document, fullscreenchange, onFullscreenChange);
        });
    }
});

L.control.fullscreen = function (options) {
    return new L.Control.Fullscreen(options);
};

/*SEARCH: https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.js*/

var leafletControlGeocoder = (function (L) {

  function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
      Object.keys(e).forEach(function (k) {
        if (k !== 'default') {
          var d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: function () {
              return e[k];
            }
          });
        }
      });
    }
    n['default'] = e;
    return n;
  }

  var L__namespace = /*#__PURE__*/_interopNamespace(L);

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  /**
   * @internal
   */

  function geocodingParams(options, params) {
    return L__namespace.Util.extend(params, options.geocodingQueryParams);
  }
  /**
   * @internal
   */

  function reverseParams(options, params) {
    return L__namespace.Util.extend(params, options.reverseQueryParams);
  }

  /**
   * @internal
   */

  var lastCallbackId = 0; // Adapted from handlebars.js
  // https://github.com/wycats/handlebars.js/

  /**
   * @internal
   */

  var badChars = /[&<>"'`]/g;
  /**
   * @internal
   */

  var possible = /[&<>"'`]/;
  /**
   * @internal
   */

  var escape = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  /**
   * @internal
   */

  function escapeChar(chr) {
    return escape[chr];
  }
  /**
   * @internal
   */


  function htmlEscape(string) {
    if (string == null) {
      return '';
    } else if (!string) {
      return string + '';
    } // Force a string conversion as this will be done by the append regardless and
    // the regex test will do this transparently behind the scenes, causing issues if
    // an object's to string has escaped characters in it.


    string = '' + string;

    if (!possible.test(string)) {
      return string;
    }

    return string.replace(badChars, escapeChar);
  }
  /**
   * @internal
   */

  function jsonp(url, params, callback, context, jsonpParam) {
    var callbackId = '_l_geocoder_' + lastCallbackId++;
    params[jsonpParam || 'callback'] = callbackId;
    window[callbackId] = L__namespace.Util.bind(callback, context);
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url + getParamString(params);
    script.id = callbackId;
    document.getElementsByTagName('head')[0].appendChild(script);
  }
  /**
   * @internal
   */

  function getJSON(url, params, callback) {
    var xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = function () {
      if (xmlHttp.readyState !== 4) {
        return;
      }

      var message;

      if (xmlHttp.status !== 200 && xmlHttp.status !== 304) {
        message = '';
      } else if (typeof xmlHttp.response === 'string') {
        // IE doesn't parse JSON responses even with responseType: 'json'.
        try {
          message = JSON.parse(xmlHttp.response);
        } catch (e) {
          // Not a JSON response
          message = xmlHttp.response;
        }
      } else {
        message = xmlHttp.response;
      }

      callback(message);
    };

    xmlHttp.open('GET', url + getParamString(params), true);
    xmlHttp.responseType = 'json';
    xmlHttp.setRequestHeader('Accept', 'application/json');
    xmlHttp.send(null);
  }
  /**
   * @internal
   */

  function template(str, data) {
    return str.replace(/\{ *([\w_]+) *\}/g, function (str, key) {
      var value = data[key];

      if (value === undefined) {
        value = '';
      } else if (typeof value === 'function') {
        value = value(data);
      }

      return htmlEscape(value);
    });
  }
  /**
   * @internal
   */

  function getParamString(obj, existingUrl, uppercase) {
    var params = [];

    for (var i in obj) {
      var key = encodeURIComponent(uppercase ? i.toUpperCase() : i);
      var value = obj[i];

      if (!Array.isArray(value)) {
        params.push(key + '=' + encodeURIComponent(String(value)));
      } else {
        for (var j = 0; j < value.length; j++) {
          params.push(key + '=' + encodeURIComponent(value[j]));
        }
      }
    }

    return (!existingUrl || existingUrl.indexOf('?') === -1 ? '?' : '&') + params.join('&');
  }

  /**
   * Implementation of the [ArcGIS geocoder](https://developers.arcgis.com/features/geocoding/)
   */

  var ArcGis = /*#__PURE__*/function () {
    function ArcGis(options) {
      this.options = {
        serviceUrl: 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer',
        apiKey: ''
      };
      L__namespace.Util.setOptions(this, options);
    }

    var _proto = ArcGis.prototype;

    _proto.geocode = function geocode(query, cb, context) {
      var params = geocodingParams(this.options, {
        token: this.options.apiKey,
        SingleLine: query,
        outFields: 'Addr_Type',
        forStorage: false,
        maxLocations: 10,
        f: 'json'
      });
      getJSON(this.options.serviceUrl + '/findAddressCandidates', params, function (data) {
        var results = [];

        if (data.candidates && data.candidates.length) {
          for (var i = 0; i <= data.candidates.length - 1; i++) {
            var loc = data.candidates[i];
            var latLng = L__namespace.latLng(loc.location.y, loc.location.x);
            var latLngBounds = L__namespace.latLngBounds(L__namespace.latLng(loc.extent.ymax, loc.extent.xmax), L__namespace.latLng(loc.extent.ymin, loc.extent.xmin));
            results[i] = {
              name: loc.address,
              bbox: latLngBounds,
              center: latLng
            };
          }
        }

        cb.call(context, results);
      });
    };

    _proto.suggest = function suggest(query, cb, context) {
      return this.geocode(query, cb, context);
    };

    _proto.reverse = function reverse(location, scale, cb, context) {
      var params = reverseParams(this.options, {
        location: location.lng + ',' + location.lat,
        distance: 100,
        f: 'json'
      });
      getJSON(this.options.serviceUrl + '/reverseGeocode', params, function (data) {
        var result = [];

        if (data && !data.error) {
          var center = L__namespace.latLng(data.location.y, data.location.x);
          var bbox = L__namespace.latLngBounds(center, center);
          result.push({
            name: data.address.Match_addr,
            center: center,
            bbox: bbox
          });
        }

        cb.call(context, result);
      });
    };

    return ArcGis;
  }();
  /**
   * [Class factory method](https://leafletjs.com/reference.html#class-class-factories) for {@link ArcGis}
   * @param options the options
   */

  function arcgis(options) {
    return new ArcGis(options);
  }

  /**
   * Implementation of the [Bing Locations API](https://docs.microsoft.com/en-us/bingmaps/rest-services/locations/)
   */

  var Bing = /*#__PURE__*/function () {
    function Bing(options) {
      this.options = {
        serviceUrl: 'https://dev.virtualearth.net/REST/v1/Locations'
      };
      L__namespace.Util.setOptions(this, options);
    }

    var _proto = Bing.prototype;

    _proto.geocode = function geocode(query, cb, context) {
      var params = geocodingParams(this.options, {
        query: query,
        key: this.options.apiKey
      });
      jsonp(this.options.apiKey, params, function (data) {
        var results = [];

        if (data.resourceSets.length > 0) {
          for (var i = data.resourceSets[0].resources.length - 1; i >= 0; i--) {
            var resource = data.resourceSets[0].resources[i],
                bbox = resource.bbox;
            results[i] = {
              name: resource.name,
              bbox: L__namespace.latLngBounds([bbox[0], bbox[1]], [bbox[2], bbox[3]]),
              center: L__namespace.latLng(resource.point.coordinates)
            };
          }
        }

        cb.call(context, results);
      }, this, 'jsonp');
    };

    _proto.reverse = function reverse(location, scale, cb, context) {
      var params = reverseParams(this.options, {
        key: this.options.apiKey
      });
      jsonp(this.options.serviceUrl + location.lat + ',' + location.lng, params, function (data) {
        var results = [];

        for (var i = data.resourceSets[0].resources.length - 1; i >= 0; i--) {
          var resource = data.resourceSets[0].resources[i],
              bbox = resource.bbox;
          results[i] = {
            name: resource.name,
            bbox: L__namespace.latLngBounds([bbox[0], bbox[1]], [bbox[2], bbox[3]]),
            center: L__namespace.latLng(resource.point.coordinates)
          };
        }

        cb.call(context, results);
      }, this, 'jsonp');
    };

    return Bing;
  }();
  /**
   * [Class factory method](https://leafletjs.com/reference.html#class-class-factories) for {@link Bing}
   * @param options the options
   */

  function bing(options) {
    return new Bing(options);
  }

  var Google = /*#__PURE__*/function () {
    function Google(options) {
      this.options = {
        serviceUrl: 'https://maps.googleapis.com/maps/api/geocode/json'
      };
      L__namespace.Util.setOptions(this, options);
    }

    var _proto = Google.prototype;

    _proto.geocode = function geocode(query, cb, context) {
      var params = geocodingParams(this.options, {
        key: this.options.apiKey,
        address: query
      });
      getJSON(this.options.serviceUrl, params, function (data) {
        var results = [];

        if (data.results && data.results.length) {
          for (var i = 0; i <= data.results.length - 1; i++) {
            var loc = data.results[i];
            var latLng = L__namespace.latLng(loc.geometry.location);
            var latLngBounds = L__namespace.latLngBounds(L__namespace.latLng(loc.geometry.viewport.northeast), L__namespace.latLng(loc.geometry.viewport.southwest));
            results[i] = {
              name: loc.formatted_address,
              bbox: latLngBounds,
              center: latLng,
              properties: loc.address_components
            };
          }
        }

        cb.call(context, results);
      });
    };

    _proto.reverse = function reverse(location, scale, cb, context) {
      var params = reverseParams(this.options, {
        key: this.options.apiKey,
        latlng: location.lat + ',' + location.lng
      });
      getJSON(this.options.serviceUrl, params, function (data) {
        var results = [];

        if (data.results && data.results.length) {
          for (var i = 0; i <= data.results.length - 1; i++) {
            var loc = data.results[i];
            var center = L__namespace.latLng(loc.geometry.location);
            var bbox = L__namespace.latLngBounds(L__namespace.latLng(loc.geometry.viewport.northeast), L__namespace.latLng(loc.geometry.viewport.southwest));
            results[i] = {
              name: loc.formatted_address,
              bbox: bbox,
              center: center,
              properties: loc.address_components
            };
          }
        }

        cb.call(context, results);
      });
    };

    return Google;
  }();
  /**
   * [Class factory method](https://leafletjs.com/reference.html#class-class-factories) for {@link Google}
   * @param options the options
   */

  function google(options) {
    return new Google(options);
  }

  /**
   * Implementation of the [HERE Geocoder API](https://developer.here.com/documentation/geocoder/topics/introduction.html)
   */

  var HERE = /*#__PURE__*/function () {
    function HERE(options) {
      this.options = {
        serviceUrl: 'https://geocoder.api.here.com/6.2/',
        app_id: '',
        app_code: '',
        apiKey: '',
        maxResults: 5
      };
      L__namespace.Util.setOptions(this, options);
      if (options.apiKey) throw Error('apiKey is not supported, use app_id/app_code instead!');
    }

    var _proto = HERE.prototype;

    _proto.geocode = function geocode(query, cb, context) {
      var params = geocodingParams(this.options, {
        searchtext: query,
        gen: 9,
        app_id: this.options.app_id,
        app_code: this.options.app_code,
        jsonattributes: 1,
        maxresults: this.options.maxResults
      });
      this.getJSON(this.options.serviceUrl + 'geocode.json', params, cb, context);
    };

    _proto.reverse = function reverse(location, scale, cb, context) {
      var prox = location.lat + ',' + location.lng;

      if (this.options.reverseGeocodeProxRadius) {
        prox += ',' + this.options.reverseGeocodeProxRadius;
      }

      var params = reverseParams(this.options, {
        prox: prox,
        mode: 'retrieveAddresses',
        app_id: this.options.app_id,
        app_code: this.options.app_code,
        gen: 9,
        jsonattributes: 1,
        maxresults: this.options.maxResults
      });
      this.getJSON(this.options.serviceUrl + 'reversegeocode.json', params, cb, context);
    };

    _proto.getJSON = function getJSON$1(url, params, cb, context) {
      getJSON(url, params, function (data) {
        var results = [];

        if (data.response.view && data.response.view.length) {
          for (var i = 0; i <= data.response.view[0].result.length - 1; i++) {
            var loc = data.response.view[0].result[i].location;
            var center = L__namespace.latLng(loc.displayPosition.latitude, loc.displayPosition.longitude);
            var bbox = L__namespace.latLngBounds(L__namespace.latLng(loc.mapView.topLeft.latitude, loc.mapView.topLeft.longitude), L__namespace.latLng(loc.mapView.bottomRight.latitude, loc.mapView.bottomRight.longitude));
            results[i] = {
              name: loc.address.label,
              properties: loc.address,
              bbox: bbox,
              center: center
            };
          }
        }

        cb.call(context, results);
      });
    };

    return HERE;
  }();
  /**
   * Implementation of the new [HERE Geocoder API](https://developer.here.com/documentation/geocoding-search-api/api-reference-swagger.html)
   */

  var HEREv2 = /*#__PURE__*/function () {
    function HEREv2(options) {
      this.options = {
        serviceUrl: 'https://geocode.search.hereapi.com/v1',
        apiKey: '',
        app_id: '',
        app_code: '',
        maxResults: 10
      };
      L__namespace.Util.setOptions(this, options);
    }

    var _proto2 = HEREv2.prototype;

    _proto2.geocode = function geocode(query, cb, context) {
      var params = geocodingParams(this.options, {
        q: query,
        apiKey: this.options.apiKey,
        limit: this.options.maxResults
      });

      if (!params.at && !params["in"]) {
        throw Error('at / in parameters not found. Please define coordinates (at=latitude,longitude) or other (in) in your geocodingQueryParams.');
      }

      this.getJSON(this.options.serviceUrl + '/discover', params, cb, context);
    };

    _proto2.reverse = function reverse(location, scale, cb, context) {
      var params = reverseParams(this.options, {
        at: location.lat + ',' + location.lng,
        limit: this.options.reverseGeocodeProxRadius,
        apiKey: this.options.apiKey
      });
      this.getJSON(this.options.serviceUrl + '/revgeocode', params, cb, context);
    };

    _proto2.getJSON = function getJSON$1(url, params, cb, context) {
      getJSON(url, params, function (data) {
        var results = [];

        if (data.items && data.items.length) {
          for (var i = 0; i <= data.items.length - 1; i++) {
            var item = data.items[i];
            var latLng = L__namespace.latLng(item.position.lat, item.position.lng);
            var bbox = void 0;

            if (item.mapView) {
              bbox = L__namespace.latLngBounds(L__namespace.latLng(item.mapView.south, item.mapView.west), L__namespace.latLng(item.mapView.north, item.mapView.east));
            } else {
              // Using only position when not provided
              bbox = L__namespace.latLngBounds(L__namespace.latLng(item.position.lat, item.position.lng), L__namespace.latLng(item.position.lat, item.position.lng));
            }

            results[i] = {
              name: item.address.label,
              properties: item.address,
              bbox: bbox,
              center: latLng
            };
          }
        }

        cb.call(context, results);
      });
    };

    return HEREv2;
  }();
  /**
   * [Class factory method](https://leafletjs.com/reference.html#class-class-factories) for {@link HERE}
   * @param options the options
   */

  function here(options) {
    if (options.apiKey) {
      return new HEREv2(options);
    } else {
      return new HERE(options);
    }
  }

  /**
   * Parses basic latitude/longitude strings such as `'50.06773 14.37742'`, `'N50.06773 W14.37742'`, `'S 50° 04.064 E 014° 22.645'`, or `'S 50° 4′ 03.828″, W 14° 22′ 38.712″'`
   * @param query the latitude/longitude string to parse
   * @returns the parsed latitude/longitude
   */

  function parseLatLng(query) {
    var match; // regex from https://github.com/openstreetmap/openstreetmap-website/blob/master/app/controllers/geocoder_controller.rb

    if (match = query.match(/^([NS])\s*(\d{1,3}(?:\.\d*)?)\W*([EW])\s*(\d{1,3}(?:\.\d*)?)$/)) {
      // [NSEW] decimal degrees
      return L__namespace.latLng((/N/i.test(match[1]) ? 1 : -1) * +match[2], (/E/i.test(match[3]) ? 1 : -1) * +match[4]);
    } else if (match = query.match(/^(\d{1,3}(?:\.\d*)?)\s*([NS])\W*(\d{1,3}(?:\.\d*)?)\s*([EW])$/)) {
      // decimal degrees [NSEW]
      return L__namespace.latLng((/N/i.test(match[2]) ? 1 : -1) * +match[1], (/E/i.test(match[4]) ? 1 : -1) * +match[3]);
    } else if (match = query.match(/^([NS])\s*(\d{1,3})°?\s*(\d{1,3}(?:\.\d*)?)?['′]?\W*([EW])\s*(\d{1,3})°?\s*(\d{1,3}(?:\.\d*)?)?['′]?$/)) {
      // [NSEW] degrees, decimal minutes
      return L__namespace.latLng((/N/i.test(match[1]) ? 1 : -1) * (+match[2] + +match[3] / 60), (/E/i.test(match[4]) ? 1 : -1) * (+match[5] + +match[6] / 60));
    } else if (match = query.match(/^(\d{1,3})°?\s*(\d{1,3}(?:\.\d*)?)?['′]?\s*([NS])\W*(\d{1,3})°?\s*(\d{1,3}(?:\.\d*)?)?['′]?\s*([EW])$/)) {
      // degrees, decimal minutes [NSEW]
      return L__namespace.latLng((/N/i.test(match[3]) ? 1 : -1) * (+match[1] + +match[2] / 60), (/E/i.test(match[6]) ? 1 : -1) * (+match[4] + +match[5] / 60));
    } else if (match = query.match(/^([NS])\s*(\d{1,3})°?\s*(\d{1,2})['′]?\s*(\d{1,3}(?:\.\d*)?)?["″]?\W*([EW])\s*(\d{1,3})°?\s*(\d{1,2})['′]?\s*(\d{1,3}(?:\.\d*)?)?["″]?$/)) {
      // [NSEW] degrees, minutes, decimal seconds
      return L__namespace.latLng((/N/i.test(match[1]) ? 1 : -1) * (+match[2] + +match[3] / 60 + +match[4] / 3600), (/E/i.test(match[5]) ? 1 : -1) * (+match[6] + +match[7] / 60 + +match[8] / 3600));
    } else if (match = query.match(/^(\d{1,3})°?\s*(\d{1,2})['′]?\s*(\d{1,3}(?:\.\d*)?)?["″]\s*([NS])\W*(\d{1,3})°?\s*(\d{1,2})['′]?\s*(\d{1,3}(?:\.\d*)?)?["″]?\s*([EW])$/)) {
      // degrees, minutes, decimal seconds [NSEW]
      return L__namespace.latLng((/N/i.test(match[4]) ? 1 : -1) * (+match[1] + +match[2] / 60 + +match[3] / 3600), (/E/i.test(match[8]) ? 1 : -1) * (+match[5] + +match[6] / 60 + +match[7] / 3600));
    } else if (match = query.match(/^\s*([+-]?\d+(?:\.\d*)?)\s*[\s,]\s*([+-]?\d+(?:\.\d*)?)\s*$/)) {
      return L__namespace.latLng(+match[1], +match[2]);
    }
  }
  /**
   * Parses basic latitude/longitude strings such as `'50.06773 14.37742'`, `'N50.06773 W14.37742'`, `'S 50° 04.064 E 014° 22.645'`, or `'S 50° 4′ 03.828″, W 14° 22′ 38.712″'`
   */

  var LatLng = /*#__PURE__*/function () {
    function LatLng(options) {
      this.options = {
        next: undefined,
        sizeInMeters: 10000
      };
      L__namespace.Util.setOptions(this, options);
    }

    var _proto = LatLng.prototype;

    _proto.geocode = function geocode(query, cb, context) {
      var center = parseLatLng(query);

      if (center) {
        var results = [{
          name: query,
          center: center,
          bbox: center.toBounds(this.options.sizeInMeters)
        }];
        cb.call(context, results);
      } else if (this.options.next) {
        this.options.next.geocode(query, cb, context);
      }
    };

    return LatLng;
  }();
  /**
   * [Class factory method](https://leafletjs.com/reference.html#class-class-factories) for {@link LatLng}
   * @param options the options
   */

  function latLng(options) {
    return new LatLng(options);
  }

  /**
   * Implementation of the [Mapbox Geocoding](https://www.mapbox.com/api-documentation/#geocoding)
   */

  var Mapbox = /*#__PURE__*/function () {
    function Mapbox(options) {
      this.options = {
        serviceUrl: 'https://api.mapbox.com/geocoding/v5/mapbox.places/'
      };
      L__namespace.Util.setOptions(this, options);
    }

    var _proto = Mapbox.prototype;

    _proto._getProperties = function _getProperties(loc) {
      var properties = {
        text: loc.text,
        address: loc.address
      };

      for (var j = 0; j < (loc.context || []).length; j++) {
        var id = loc.context[j].id.split('.')[0];
        properties[id] = loc.context[j].text; // Get country code when available

        if (loc.context[j].short_code) {
          properties['countryShortCode'] = loc.context[j].short_code;
        }
      }

      return properties;
    };

    _proto.geocode = function geocode(query, cb, context) {
      var _this = this;

      var params = geocodingParams(this.options, {
        access_token: this.options.apiKey
      });

      if (params.proximity !== undefined && params.proximity.lat !== undefined && params.proximity.lng !== undefined) {
        params.proximity = params.proximity.lng + ',' + params.proximity.lat;
      }

      getJSON(this.options.serviceUrl + encodeURIComponent(query) + '.json', params, function (data) {
        var results = [];

        if (data.features && data.features.length) {
          for (var i = 0; i <= data.features.length - 1; i++) {
            var loc = data.features[i];
            var center = L__namespace.latLng(loc.center.reverse());
            var bbox = void 0;

            if (loc.bbox) {
              bbox = L__namespace.latLngBounds(L__namespace.latLng(loc.bbox.slice(0, 2).reverse()), L__namespace.latLng(loc.bbox.slice(2, 4).reverse()));
            } else {
              bbox = L__namespace.latLngBounds(center, center);
            }

            results[i] = {
              name: loc.place_name,
              bbox: bbox,
              center: center,
              properties: _this._getProperties(loc)
            };
          }
        }

        cb.call(context, results);
      });
    };

    _proto.suggest = function suggest(query, cb, context) {
      return this.geocode(query, cb, context);
    };

    _proto.reverse = function reverse(location, scale, cb, context) {
      var _this2 = this;

      var url = this.options.serviceUrl + location.lng + ',' + location.lat + '.json';
      var param = reverseParams(this.options, {
        access_token: this.options.apiKey
      });
      getJSON(url, param, function (data) {
        var results = [];

        if (data.features && data.features.length) {
          for (var i = 0; i <= data.features.length - 1; i++) {
            var loc = data.features[i];
            var center = L__namespace.latLng(loc.center.reverse());
            var bbox = void 0;

            if (loc.bbox) {
              bbox = L__namespace.latLngBounds(L__namespace.latLng(loc.bbox.slice(0, 2).reverse()), L__namespace.latLng(loc.bbox.slice(2, 4).reverse()));
            } else {
              bbox = L__namespace.latLngBounds(center, center);
            }

            results[i] = {
              name: loc.place_name,
              bbox: bbox,
              center: center,
              properties: _this2._getProperties(loc)
            };
          }
        }

        cb.call(context, results);
      });
    };

    return Mapbox;
  }();
  /**
   * [Class factory method](https://leafletjs.com/reference.html#class-class-factories) for {@link Mapbox}
   * @param options the options
   */

  function mapbox(options) {
    return new Mapbox(options);
  }

  /**
   * Implementation of the [MapQuest Geocoding API](http://developer.mapquest.com/web/products/dev-services/geocoding-ws)
   */

  var MapQuest = /*#__PURE__*/function () {
    function MapQuest(options) {
      this.options = {
        serviceUrl: 'https://www.mapquestapi.com/geocoding/v1'
      };
      L__namespace.Util.setOptions(this, options); // MapQuest seems to provide URI encoded API keys,
      // so to avoid encoding them twice, we decode them here

      this.options.apiKey = decodeURIComponent(this.options.apiKey);
    }

    var _proto = MapQuest.prototype;

    _proto._formatName = function _formatName() {
      return [].slice.call(arguments).filter(function (s) {
        return !!s;
      }).join(', ');
    };

    _proto.geocode = function geocode(query, cb, context) {
      var params = geocodingParams(this.options, {
        key: this.options.apiKey,
        location: query,
        limit: 5,
        outFormat: 'json'
      });
      getJSON(this.options.serviceUrl + '/address', params, L__namespace.Util.bind(function (data) {
        var results = [];

        if (data.results && data.results[0].locations) {
          for (var i = data.results[0].locations.length - 1; i >= 0; i--) {
            var loc = data.results[0].locations[i];
            var center = L__namespace.latLng(loc.latLng);
            results[i] = {
              name: this._formatName(loc.street, loc.adminArea4, loc.adminArea3, loc.adminArea1),
              bbox: L__namespace.latLngBounds(center, center),
              center: center
            };
          }
        }

        cb.call(context, results);
      }, this));
    };

    _proto.reverse = function reverse(location, scale, cb, context) {
      var params = reverseParams(this.options, {
        key: this.options.apiKey,
        location: location.lat + ',' + location.lng,
        outputFormat: 'json'
      });
      getJSON(this.options.serviceUrl + '/reverse', params, L__namespace.Util.bind(function (data) {
        var results = [];

        if (data.results && data.results[0].locations) {
          for (var i = data.results[0].locations.length - 1; i >= 0; i--) {
            var loc = data.results[0].locations[i];
            var center = L__namespace.latLng(loc.latLng);
            results[i] = {
              name: this._formatName(loc.street, loc.adminArea4, loc.adminArea3, loc.adminArea1),
              bbox: L__namespace.latLngBounds(center, center),
              center: center
            };
          }
        }

        cb.call(context, results);
      }, this));
    };

    return MapQuest;
  }();
  /**
   * [Class factory method](https://leafletjs.com/reference.html#class-class-factories) for {@link MapQuest}
   * @param options the options
   */

  function mapQuest(options) {
    return new MapQuest(options);
  }

  /**
   * Implementation of the [Neutrino API](https://www.neutrinoapi.com/api/geocode-address/)
   */

  var Neutrino = /*#__PURE__*/function () {
    function Neutrino(options) {
      this.options = {
        userId: undefined,
        apiKey: undefined,
        serviceUrl: 'https://neutrinoapi.com/'
      };
      L__namespace.Util.setOptions(this, options);
    } // https://www.neutrinoapi.com/api/geocode-address/


    var _proto = Neutrino.prototype;

    _proto.geocode = function geocode(query, cb, context) {
      var params = geocodingParams(this.options, {
        apiKey: this.options.apiKey,
        userId: this.options.userId,
        //get three words and make a dot based string
        address: query.split(/\s+/).join('.')
      });
      getJSON(this.options.serviceUrl + 'geocode-address', params, function (data) {
        var results = [];

        if (data.locations) {
          data.geometry = data.locations[0];
          var center = L__namespace.latLng(data.geometry['latitude'], data.geometry['longitude']);
          var bbox = L__namespace.latLngBounds(center, center);
          results[0] = {
            name: data.geometry.address,
            bbox: bbox,
            center: center
          };
        }

        cb.call(context, results);
      });
    };

    _proto.suggest = function suggest(query, cb, context) {
      return this.geocode(query, cb, context);
    } // https://www.neutrinoapi.com/api/geocode-reverse/
    ;

    _proto.reverse = function reverse(location, scale, cb, context) {
      var params = reverseParams(this.options, {
        apiKey: this.options.apiKey,
        userId: this.options.userId,
        latitude: location.lat,
        longitude: location.lng
      });
      getJSON(this.options.serviceUrl + 'geocode-reverse', params, function (data) {
        var results = [];

        if (data.status.status == 200 && data.found) {
          var center = L__namespace.latLng(location.lat, location.lng);
          var bbox = L__namespace.latLngBounds(center, center);
          results[0] = {
            name: data.address,
            bbox: bbox,
            center: center
          };
        }

        cb.call(context, results);
      });
    };

    return Neutrino;
  }();
  /**
   * [Class factory method](https://leafletjs.com/reference.html#class-class-factories) for {@link Neutrino}
   * @param options the options
   */

  function neutrino(options) {
    return new Neutrino(options);
  }

  /**
   * Implementation of the [Nominatim](https://wiki.openstreetmap.org/wiki/Nominatim) geocoder.
   *
   * This is the default geocoding service used by the control, unless otherwise specified in the options.
   *
   * Unless using your own Nominatim installation, please refer to the [Nominatim usage policy](https://operations.osmfoundation.org/policies/nominatim/).
   */

  var Nominatim = /*#__PURE__*/function () {
    function Nominatim(options) {
      this.options = {
        serviceUrl: 'https://nominatim.openstreetmap.org/',
        htmlTemplate: function htmlTemplate(r) {
          var address = r.address;
          var className;
          var parts = [];

          if (address.road || address.building) {
            parts.push('{building} {road} {house_number}');
          }

          if (address.city || address.town || address.village || address.hamlet) {
            className = parts.length > 0 ? 'leaflet-control-geocoder-address-detail' : '';
            parts.push('<span class="' + className + '">{postcode} {city} {town} {village} {hamlet}</span>');
          }

          if (address.state || address.country) {
            className = parts.length > 0 ? 'leaflet-control-geocoder-address-context' : '';
            parts.push('<span class="' + className + '">{state} {country}</span>');
          }

          return template(parts.join('<br/>'), address);
        }
      };
      L__namespace.Util.setOptions(this, options || {});
    }

    var _proto = Nominatim.prototype;

    _proto.geocode = function geocode(query, cb, context) {
      var _this = this;

      var params = geocodingParams(this.options, {
        q: query,
        limit: 5,
        format: 'json',
        addressdetails: 1
      });
      getJSON(this.options.serviceUrl + 'search', params, function (data) {
        var results = [];

        for (var i = data.length - 1; i >= 0; i--) {
          var bbox = data[i].boundingbox;

          for (var j = 0; j < 4; j++) {
            bbox[j] = +bbox[j];
          }

          results[i] = {
            icon: data[i].icon,
            name: data[i].display_name,
            html: _this.options.htmlTemplate ? _this.options.htmlTemplate(data[i]) : undefined,
            bbox: L__namespace.latLngBounds([bbox[0], bbox[2]], [bbox[1], bbox[3]]),
            center: L__namespace.latLng(data[i].lat, data[i].lon),
            properties: data[i]
          };
        }

        cb.call(context, results);
      });
    };

    _proto.reverse = function reverse(location, scale, cb, context) {
      var _this2 = this;

      var params = reverseParams(this.options, {
        lat: location.lat,
        lon: location.lng,
        zoom: Math.round(Math.log(scale / 256) / Math.log(2)),
        addressdetails: 1,
        format: 'json'
      });
      getJSON(this.options.serviceUrl + 'reverse', params, function (data) {
        var result = [];

        if (data && data.lat && data.lon) {
          var center = L__namespace.latLng(data.lat, data.lon);
          var bbox = L__namespace.latLngBounds(center, center);
          result.push({
            name: data.display_name,
            html: _this2.options.htmlTemplate ? _this2.options.htmlTemplate(data) : undefined,
            center: center,
            bbox: bbox,
            properties: data
          });
        }

        cb.call(context, result);
      });
    };

    return Nominatim;
  }();
  /**
   * [Class factory method](https://leafletjs.com/reference.html#class-class-factories) for {@link Nominatim}
   * @param options the options
   */

  function nominatim(options) {
    return new Nominatim(options);
  }

  /**
   * Implementation of the [Plus codes](https://plus.codes/) (formerly OpenLocationCode) (requires [open-location-code](https://www.npmjs.com/package/open-location-code))
   */

  var OpenLocationCode = /*#__PURE__*/function () {
    function OpenLocationCode(options) {
      L__namespace.Util.setOptions(this, options);
    }

    var _proto = OpenLocationCode.prototype;

    _proto.geocode = function geocode(query, cb, context) {
      try {
        var decoded = this.options.OpenLocationCode.decode(query);
        var result = {
          name: query,
          center: L__namespace.latLng(decoded.latitudeCenter, decoded.longitudeCenter),
          bbox: L__namespace.latLngBounds(L__namespace.latLng(decoded.latitudeLo, decoded.longitudeLo), L__namespace.latLng(decoded.latitudeHi, decoded.longitudeHi))
        };
        cb.call(context, [result]);
      } catch (e) {
        console.warn(e); // eslint-disable-line no-console

        cb.call(context, []);
      }
    };

    _proto.reverse = function reverse(location, scale, cb, context) {
      try {
        var code = this.options.OpenLocationCode.encode(location.lat, location.lng, this.options.codeLength);
        var result = {
          name: code,
          center: L__namespace.latLng(location.lat, location.lng),
          bbox: L__namespace.latLngBounds(L__namespace.latLng(location.lat, location.lng), L__namespace.latLng(location.lat, location.lng))
        };
        cb.call(context, [result]);
      } catch (e) {
        console.warn(e); // eslint-disable-line no-console

        cb.call(context, []);
      }
    };

    return OpenLocationCode;
  }();
  /**
   * [Class factory method](https://leafletjs.com/reference.html#class-class-factories) for {@link OpenLocationCode}
   * @param options the options
   */

  function openLocationCode(options) {
    return new OpenLocationCode(options);
  }

  /**
   * Implementation of the [OpenCage Data API](https://opencagedata.com/)
   */

  var OpenCage = /*#__PURE__*/function () {
    function OpenCage(options) {
      this.options = {
        serviceUrl: 'https://api.opencagedata.com/geocode/v1/json'
      };
      L__namespace.Util.setOptions(this, options);
    }

    var _proto = OpenCage.prototype;

    _proto.geocode = function geocode(query, cb, context) {
      var params = geocodingParams(this.options, {
        key: this.options.apiKey,
        q: query
      });
      getJSON(this.options.serviceUrl, params, function (data) {
        var results = [];

        if (data.results && data.results.length) {
          for (var i = 0; i < data.results.length; i++) {
            var loc = data.results[i];
            var center = L__namespace.latLng(loc.geometry);
            var bbox = void 0;

            if (loc.annotations && loc.annotations.bounds) {
              bbox = L__namespace.latLngBounds(L__namespace.latLng(loc.annotations.bounds.northeast), L__namespace.latLng(loc.annotations.bounds.southwest));
            } else {
              bbox = L__namespace.latLngBounds(center, center);
            }

            results.push({
              name: loc.formatted,
              bbox: bbox,
              center: center
            });
          }
        }

        cb.call(context, results);
      });
    };

    _proto.suggest = function suggest(query, cb, context) {
      return this.geocode(query, cb, context);
    };

    _proto.reverse = function reverse(location, scale, cb, context) {
      var params = reverseParams(this.options, {
        key: this.options.apiKey,
        q: [location.lat, location.lng].join(',')
      });
      getJSON(this.options.serviceUrl, params, function (data) {
        var results = [];

        if (data.results && data.results.length) {
          for (var i = 0; i < data.results.length; i++) {
            var loc = data.results[i];
            var center = L__namespace.latLng(loc.geometry);
            var bbox = void 0;

            if (loc.annotations && loc.annotations.bounds) {
              bbox = L__namespace.latLngBounds(L__namespace.latLng(loc.annotations.bounds.northeast), L__namespace.latLng(loc.annotations.bounds.southwest));
            } else {
              bbox = L__namespace.latLngBounds(center, center);
            }

            results.push({
              name: loc.formatted,
              bbox: bbox,
              center: center
            });
          }
        }

        cb.call(context, results);
      });
    };

    return OpenCage;
  }();
  function opencage(options) {
    return new OpenCage(options);
  }

  /**
   * Implementation of the [Pelias](https://pelias.io/), [geocode.earth](https://geocode.earth/) geocoder (formerly Mapzen Search)
   */

  var Pelias = /*#__PURE__*/function () {
    function Pelias(options) {
      this.options = {
        serviceUrl: 'https://api.geocode.earth/v1'
      };
      this._lastSuggest = 0;
      L__namespace.Util.setOptions(this, options);
    }

    var _proto = Pelias.prototype;

    _proto.geocode = function geocode(query, cb, context) {
      var _this = this;

      var params = geocodingParams(this.options, {
        api_key: this.options.apiKey,
        text: query
      });
      getJSON(this.options.serviceUrl + '/search', params, function (data) {
        cb.call(context, _this._parseResults(data, 'bbox'));
      });
    };

    _proto.suggest = function suggest(query, cb, context) {
      var _this2 = this;

      var params = geocodingParams(this.options, {
        api_key: this.options.apiKey,
        text: query
      });
      getJSON(this.options.serviceUrl + '/autocomplete', params, function (data) {
        if (data.geocoding.timestamp > _this2._lastSuggest) {
          _this2._lastSuggest = data.geocoding.timestamp;
          cb.call(context, _this2._parseResults(data, 'bbox'));
        }
      });
    };

    _proto.reverse = function reverse(location, scale, cb, context) {
      var _this3 = this;

      var params = reverseParams(this.options, {
        api_key: this.options.apiKey,
        'point.lat': location.lat,
        'point.lon': location.lng
      });
      getJSON(this.options.serviceUrl + '/reverse', params, function (data) {
        cb.call(context, _this3._parseResults(data, 'bounds'));
      });
    };

    _proto._parseResults = function _parseResults(data, bboxname) {
      var results = [];
      L__namespace.geoJSON(data, {
        pointToLayer: function pointToLayer(feature, latlng) {
          return L__namespace.circleMarker(latlng);
        },
        onEachFeature: function onEachFeature(feature, layer) {
          var result = {};
          var bbox;
          var center;

          if (layer.getBounds) {
            bbox = layer.getBounds();
            center = bbox.getCenter();
          } else if (layer.feature.bbox) {
            center = layer.getLatLng();
            bbox = L__namespace.latLngBounds(L__namespace.GeoJSON.coordsToLatLng(layer.feature.bbox.slice(0, 2)), L__namespace.GeoJSON.coordsToLatLng(layer.feature.bbox.slice(2, 4)));
          } else {
            center = layer.getLatLng();
            bbox = L__namespace.latLngBounds(center, center);
          }

          result.name = layer.feature.properties.label;
          result.center = center;
          result[bboxname] = bbox;
          result.properties = layer.feature.properties;
          results.push(result);
        }
      });
      return results;
    };

    return Pelias;
  }();
  /**
   * [Class factory method](https://leafletjs.com/reference.html#class-class-factories) for {@link Pelias}
   * @param options the options
   */

  function pelias(options) {
    return new Pelias(options);
  }
  var GeocodeEarth = Pelias;
  var geocodeEarth = pelias;
  /**
   * r.i.p.
   * @deprecated
   */

  var Mapzen = Pelias;
  /**
   * r.i.p.
   * @deprecated
   */

  var mapzen = pelias;
  /**
   * Implementation of the [Openrouteservice](https://openrouteservice.org/dev/#/api-docs/geocode) geocoder
   */

  var Openrouteservice = /*#__PURE__*/function (_Pelias) {
    _inheritsLoose(Openrouteservice, _Pelias);

    function Openrouteservice(options) {
      return _Pelias.call(this, L__namespace.Util.extend({
        serviceUrl: 'https://api.openrouteservice.org/geocode'
      }, options)) || this;
    }

    return Openrouteservice;
  }(Pelias);
  /**
   * [Class factory method](https://leafletjs.com/reference.html#class-class-factories) for {@link Openrouteservice}
   * @param options the options
   */

  function openrouteservice(options) {
    return new Openrouteservice(options);
  }

  /**
   * Implementation of the [Photon](http://photon.komoot.de/) geocoder
   */

  var Photon = /*#__PURE__*/function () {
    function Photon(options) {
      this.options = {
        serviceUrl: 'https://photon.komoot.io/api/',
        reverseUrl: 'https://photon.komoot.io/reverse/',
        nameProperties: ['name', 'street', 'suburb', 'hamlet', 'town', 'city', 'state', 'country']
      };
      L__namespace.Util.setOptions(this, options);
    }

    var _proto = Photon.prototype;

    _proto.geocode = function geocode(query, cb, context) {
      var params = geocodingParams(this.options, {
        q: query
      });
      getJSON(this.options.serviceUrl, params, L__namespace.Util.bind(function (data) {
        cb.call(context, this._decodeFeatures(data));
      }, this));
    };

    _proto.suggest = function suggest(query, cb, context) {
      return this.geocode(query, cb, context);
    };

    _proto.reverse = function reverse(latLng, scale, cb, context) {
      var params = reverseParams(this.options, {
        lat: latLng.lat,
        lon: latLng.lng
      });
      getJSON(this.options.reverseUrl, params, L__namespace.Util.bind(function (data) {
        cb.call(context, this._decodeFeatures(data));
      }, this));
    };

    _proto._decodeFeatures = function _decodeFeatures(data) {
      var results = [];

      if (data && data.features) {
        for (var i = 0; i < data.features.length; i++) {
          var f = data.features[i];
          var c = f.geometry.coordinates;
          var center = L__namespace.latLng(c[1], c[0]);
          var extent = f.properties.extent;
          var bbox = extent ? L__namespace.latLngBounds([extent[1], extent[0]], [extent[3], extent[2]]) : L__namespace.latLngBounds(center, center);
          results.push({
            name: this._decodeFeatureName(f),
            html: this.options.htmlTemplate ? this.options.htmlTemplate(f) : undefined,
            center: center,
            bbox: bbox,
            properties: f.properties
          });
        }
      }

      return results;
    };

    _proto._decodeFeatureName = function _decodeFeatureName(f) {
      return (this.options.nameProperties || []).map(function (p) {
        return f.properties[p];
      }).filter(function (v) {
        return !!v;
      }).join(', ');
    };

    return Photon;
  }();
  /**
   * [Class factory method](https://leafletjs.com/reference.html#class-class-factories) for {@link Photon}
   * @param options the options
   */

  function photon(options) {
    return new Photon(options);
  }

  /**
   * Implementation of the What3Words service
   */

  var What3Words = /*#__PURE__*/function () {
    function What3Words(options) {
      this.options = {
        serviceUrl: 'https://api.what3words.com/v2/'
      };
      L__namespace.Util.setOptions(this, options);
    }

    var _proto = What3Words.prototype;

    _proto.geocode = function geocode(query, cb, context) {
      //get three words and make a dot based string
      getJSON(this.options.serviceUrl + 'forward', geocodingParams(this.options, {
        key: this.options.apiKey,
        addr: query.split(/\s+/).join('.')
      }), function (data) {
        var results = [];

        if (data.geometry) {
          var latLng = L__namespace.latLng(data.geometry['lat'], data.geometry['lng']);
          var latLngBounds = L__namespace.latLngBounds(latLng, latLng);
          results[0] = {
            name: data.words,
            bbox: latLngBounds,
            center: latLng
          };
        }

        cb.call(context, results);
      });
    };

    _proto.suggest = function suggest(query, cb, context) {
      return this.geocode(query, cb, context);
    };

    _proto.reverse = function reverse(location, scale, cb, context) {
      getJSON(this.options.serviceUrl + 'reverse', reverseParams(this.options, {
        key: this.options.apiKey,
        coords: [location.lat, location.lng].join(',')
      }), function (data) {
        var results = [];

        if (data.status.status == 200) {
          var center = L__namespace.latLng(data.geometry['lat'], data.geometry['lng']);
          var bbox = L__namespace.latLngBounds(center, center);
          results[0] = {
            name: data.words,
            bbox: bbox,
            center: center
          };
        }

        cb.call(context, results);
      });
    };

    return What3Words;
  }();
  /**
   * [Class factory method](https://leafletjs.com/reference.html#class-class-factories) for {@link What3Words}
   * @param options the options
   */

  function what3words(options) {
    return new What3Words(options);
  }

  var geocoders = {
    __proto__: null,
    geocodingParams: geocodingParams,
    reverseParams: reverseParams,
    ArcGis: ArcGis,
    arcgis: arcgis,
    Bing: Bing,
    bing: bing,
    Google: Google,
    google: google,
    HERE: HERE,
    HEREv2: HEREv2,
    here: here,
    parseLatLng: parseLatLng,
    LatLng: LatLng,
    latLng: latLng,
    Mapbox: Mapbox,
    mapbox: mapbox,
    MapQuest: MapQuest,
    mapQuest: mapQuest,
    Neutrino: Neutrino,
    neutrino: neutrino,
    Nominatim: Nominatim,
    nominatim: nominatim,
    OpenLocationCode: OpenLocationCode,
    openLocationCode: openLocationCode,
    OpenCage: OpenCage,
    opencage: opencage,
    Pelias: Pelias,
    pelias: pelias,
    GeocodeEarth: GeocodeEarth,
    geocodeEarth: geocodeEarth,
    Mapzen: Mapzen,
    mapzen: mapzen,
    Openrouteservice: Openrouteservice,
    openrouteservice: openrouteservice,
    Photon: Photon,
    photon: photon,
    What3Words: What3Words,
    what3words: what3words
  };

  /**
   * Leaflet mixins https://leafletjs.com/reference-1.7.1.html#class-includes
   * for TypeScript https://www.typescriptlang.org/docs/handbook/mixins.html
   * @internal
   */

  var EventedControl = // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function EventedControl() {// empty
  };

  L__namespace.Util.extend(EventedControl.prototype, L__namespace.Control.prototype);
  L__namespace.Util.extend(EventedControl.prototype, L__namespace.Evented.prototype);
  /**
   * This is the geocoder control. It works like any other [Leaflet control](https://leafletjs.com/reference.html#control), and is added to the map.
   */

  var GeocoderControl = /*#__PURE__*/function (_EventedControl) {
    _inheritsLoose(GeocoderControl, _EventedControl);

    /**
     * Instantiates a geocoder control (to be invoked using `new`)
     * @param options the options
     */
    function GeocoderControl(options) {
      var _this;

      _this = _EventedControl.call(this, options) || this;
      _this.options = {
        showUniqueResult: true,
        showResultIcons: false,
        collapsed: true,
        expand: 'touch',
        position: 'topright',
        placeholder: 'Search...',
        errorMessage: 'Nothing found.',
        iconLabel: 'Initiate a new search',
        query: '',
        queryMinLength: 1,
        suggestMinLength: 3,
        suggestTimeout: 250,
        defaultMarkGeocode: true
      };
      _this._requestCount = 0;
      L__namespace.Util.setOptions(_assertThisInitialized(_this), options);

      if (!_this.options.geocoder) {
        _this.options.geocoder = new Nominatim();
      }

      return _this;
    }

    var _proto = GeocoderControl.prototype;

    _proto.addThrobberClass = function addThrobberClass() {
      L__namespace.DomUtil.addClass(this._container, 'leaflet-control-geocoder-throbber');
    };

    _proto.removeThrobberClass = function removeThrobberClass() {
      L__namespace.DomUtil.removeClass(this._container, 'leaflet-control-geocoder-throbber');
    }
    /**
     * Returns the container DOM element for the control and add listeners on relevant map events.
     * @param map the map instance
     * @see https://leafletjs.com/reference.html#control-onadd
     */
    ;

    _proto.onAdd = function onAdd(map) {
      var _this2 = this;

      var className = 'leaflet-control-geocoder';
      var container = L__namespace.DomUtil.create('div', className + ' leaflet-bar');
      var icon = L__namespace.DomUtil.create('button', className + '-icon', container);
      var form = this._form = L__namespace.DomUtil.create('div', className + '-form', container);
      this._map = map;
      this._container = container;
      icon.innerHTML = '&nbsp;';
      icon.type = 'button';
      icon.setAttribute('aria-label', this.options.iconLabel);
      var input = this._input = L__namespace.DomUtil.create('input', '', form);
      input.type = 'text';
      input.value = this.options.query;
      input.placeholder = this.options.placeholder;
      L__namespace.DomEvent.disableClickPropagation(input);
      this._errorElement = L__namespace.DomUtil.create('div', className + '-form-no-error', container);
      this._errorElement.innerHTML = this.options.errorMessage;
      this._alts = L__namespace.DomUtil.create('ul', className + '-alternatives leaflet-control-geocoder-alternatives-minimized', container);
      L__namespace.DomEvent.disableClickPropagation(this._alts);
      L__namespace.DomEvent.addListener(input, 'keydown', this._keydown, this);

      if (this.options.geocoder.suggest) {
        L__namespace.DomEvent.addListener(input, 'input', this._change, this);
      }

      L__namespace.DomEvent.addListener(input, 'blur', function () {
        if (_this2.options.collapsed && !_this2._preventBlurCollapse) {
          _this2._collapse();
        }

        _this2._preventBlurCollapse = false;
      });

      if (this.options.collapsed) {
        if (this.options.expand === 'click') {
          L__namespace.DomEvent.addListener(container, 'click', function (e) {
            if (e.button === 0 && e.detail !== 2) {
              _this2._toggle();
            }
          });
        } else if (this.options.expand === 'touch') {
          L__namespace.DomEvent.addListener(container, L__namespace.Browser.touch ? 'touchstart mousedown' : 'mousedown', function (e) {
            _this2._toggle();

            e.preventDefault(); // mobile: clicking focuses the icon, so UI expands and immediately collapses

            e.stopPropagation();
          }, this);
        } else {
          L__namespace.DomEvent.addListener(container, 'mouseover', this._expand, this);
          L__namespace.DomEvent.addListener(container, 'mouseout', this._collapse, this);

          this._map.on('movestart', this._collapse, this);
        }
      } else {
        this._expand();

        if (L__namespace.Browser.touch) {
          L__namespace.DomEvent.addListener(container, 'touchstart', function () {
            return _this2._geocode();
          });
        } else {
          L__namespace.DomEvent.addListener(container, 'click', function () {
            return _this2._geocode();
          });
        }
      }

      if (this.options.defaultMarkGeocode) {
        this.on('markgeocode', this.markGeocode, this);
      }

      this.on('startgeocode', this.addThrobberClass, this);
      this.on('finishgeocode', this.removeThrobberClass, this);
      this.on('startsuggest', this.addThrobberClass, this);
      this.on('finishsuggest', this.removeThrobberClass, this);
      L__namespace.DomEvent.disableClickPropagation(container);
      return container;
    }
    /**
     * Sets the query string on the text input
     * @param string the query string
     */
    ;

    _proto.setQuery = function setQuery(string) {
      this._input.value = string;
      return this;
    };

    _proto._geocodeResult = function _geocodeResult(results, suggest) {
      if (!suggest && this.options.showUniqueResult && results.length === 1) {
        this._geocodeResultSelected(results[0]);
      } else if (results.length > 0) {
        this._alts.innerHTML = '';
        this._results = results;
        L__namespace.DomUtil.removeClass(this._alts, 'leaflet-control-geocoder-alternatives-minimized');
        L__namespace.DomUtil.addClass(this._container, 'leaflet-control-geocoder-options-open');

        for (var i = 0; i < results.length; i++) {
          this._alts.appendChild(this._createAlt(results[i], i));
        }
      } else {
        L__namespace.DomUtil.addClass(this._container, 'leaflet-control-geocoder-options-error');
        L__namespace.DomUtil.addClass(this._errorElement, 'leaflet-control-geocoder-error');
      }
    }
    /**
     * Marks a geocoding result on the map
     * @param result the geocoding result
     */
    ;

    _proto.markGeocode = function markGeocode(event) {
      var result = event.geocode;

      this._map.fitBounds(result.bbox);

      if (this._geocodeMarker) {
        this._map.removeLayer(this._geocodeMarker);
      }

      this._geocodeMarker = new L__namespace.Marker(result.center).bindPopup(result.html || result.name).addTo(this._map).openPopup();
      return this;
    };

    _proto._geocode = function _geocode(suggest) {
      var _this3 = this;

      var value = this._input.value;

      if (!suggest && value.length < this.options.queryMinLength) {
        return;
      }

      var requestCount = ++this._requestCount;

      var cb = function cb(results) {
        if (requestCount === _this3._requestCount) {
          var _event = {
            input: value,
            results: results
          };

          _this3.fire(suggest ? 'finishsuggest' : 'finishgeocode', _event);

          _this3._geocodeResult(results, suggest);
        }
      };

      this._lastGeocode = value;

      if (!suggest) {
        this._clearResults();
      }

      var event = {
        input: value
      };
      this.fire(suggest ? 'startsuggest' : 'startgeocode', event);

      if (suggest) {
        this.options.geocoder.suggest(value, cb);
      } else {
        this.options.geocoder.geocode(value, cb);
      }
    };

    _proto._geocodeResultSelected = function _geocodeResultSelected(geocode) {
      var event = {
        geocode: geocode
      };
      this.fire('markgeocode', event);
    };

    _proto._toggle = function _toggle() {
      if (L__namespace.DomUtil.hasClass(this._container, 'leaflet-control-geocoder-expanded')) {
        this._collapse();
      } else {
        this._expand();
      }
    };

    _proto._expand = function _expand() {
      L__namespace.DomUtil.addClass(this._container, 'leaflet-control-geocoder-expanded');

      this._input.select();

      this.fire('expand');
    };

    _proto._collapse = function _collapse() {
      L__namespace.DomUtil.removeClass(this._container, 'leaflet-control-geocoder-expanded');
      L__namespace.DomUtil.addClass(this._alts, 'leaflet-control-geocoder-alternatives-minimized');
      L__namespace.DomUtil.removeClass(this._errorElement, 'leaflet-control-geocoder-error');
      L__namespace.DomUtil.removeClass(this._container, 'leaflet-control-geocoder-options-open');
      L__namespace.DomUtil.removeClass(this._container, 'leaflet-control-geocoder-options-error');

      this._input.blur(); // mobile: keyboard shouldn't stay expanded


      this.fire('collapse');
    };

    _proto._clearResults = function _clearResults() {
      L__namespace.DomUtil.addClass(this._alts, 'leaflet-control-geocoder-alternatives-minimized');
      this._selection = null;
      L__namespace.DomUtil.removeClass(this._errorElement, 'leaflet-control-geocoder-error');
      L__namespace.DomUtil.removeClass(this._container, 'leaflet-control-geocoder-options-open');
      L__namespace.DomUtil.removeClass(this._container, 'leaflet-control-geocoder-options-error');
    };

    _proto._createAlt = function _createAlt(result, index) {
      var _this4 = this;

      var li = L__namespace.DomUtil.create('li', ''),
          a = L__namespace.DomUtil.create('a', '', li),
          icon = this.options.showResultIcons && result.icon ? L__namespace.DomUtil.create('img', '', a) : null,
          text = result.html ? undefined : document.createTextNode(result.name),
          mouseDownHandler = function mouseDownHandler(e) {
        // In some browsers, a click will fire on the map if the control is
        // collapsed directly after mousedown. To work around this, we
        // wait until the click is completed, and _then_ collapse the
        // control. Messy, but this is the workaround I could come up with
        // for #142.
        _this4._preventBlurCollapse = true;
        L__namespace.DomEvent.stop(e);

        _this4._geocodeResultSelected(result);

        L__namespace.DomEvent.on(li, 'click touchend', function () {
          if (_this4.options.collapsed) {
            _this4._collapse();
          } else {
            _this4._clearResults();
          }
        });
      };

      if (icon) {
        icon.src = result.icon;
      }

      li.setAttribute('data-result-index', String(index));

      if (result.html) {
        a.innerHTML = a.innerHTML + result.html;
      } else if (text) {
        a.appendChild(text);
      } // Use mousedown and not click, since click will fire _after_ blur,
      // causing the control to have collapsed and removed the items
      // before the click can fire.


      L__namespace.DomEvent.addListener(li, 'mousedown touchstart', mouseDownHandler, this);
      return li;
    };

    _proto._keydown = function _keydown(e) {
      var _this5 = this;

      var select = function select(dir) {
        if (_this5._selection) {
          L__namespace.DomUtil.removeClass(_this5._selection, 'leaflet-control-geocoder-selected');
          _this5._selection = _this5._selection[dir > 0 ? 'nextSibling' : 'previousSibling'];
        }

        if (!_this5._selection) {
          _this5._selection = _this5._alts[dir > 0 ? 'firstChild' : 'lastChild'];
        }

        if (_this5._selection) {
          L__namespace.DomUtil.addClass(_this5._selection, 'leaflet-control-geocoder-selected');
        }
      };

      switch (e.keyCode) {
        // Escape
        case 27:
          if (this.options.collapsed) {
            this._collapse();
          } else {
            this._clearResults();
          }

          break;
        // Up

        case 38:
          select(-1);
          break;
        // Up

        case 40:
          select(1);
          break;
        // Enter

        case 13:
          if (this._selection) {
            var index = parseInt(this._selection.getAttribute('data-result-index'), 10);

            this._geocodeResultSelected(this._results[index]);

            this._clearResults();
          } else {
            this._geocode();
          }

          break;

        default:
          return;
      }

      L__namespace.DomEvent.preventDefault(e);
    };

    _proto._change = function _change() {
      var _this6 = this;

      var v = this._input.value;

      if (v !== this._lastGeocode) {
        clearTimeout(this._suggestTimeout);

        if (v.length >= this.options.suggestMinLength) {
          this._suggestTimeout = setTimeout(function () {
            return _this6._geocode(true);
          }, this.options.suggestTimeout);
        } else {
          this._clearResults();
        }
      }
    };

    return GeocoderControl;
  }(EventedControl);
  /**
   * [Class factory method](https://leafletjs.com/reference.html#class-class-factories) for {@link GeocoderControl}
   * @param options the options
   */

  function geocoder(options) {
    return new GeocoderControl(options);
  }

  /* @preserve
   * Leaflet Control Geocoder
   * https://github.com/perliedman/leaflet-control-geocoder
   *
   * Copyright (c) 2012 sa3m (https://github.com/sa3m)
   * Copyright (c) 2018 Per Liedman
   * All rights reserved.
   */
  L__namespace.Util.extend(GeocoderControl, geocoders);
  L__namespace.Util.extend(L__namespace.Control, {
    Geocoder: GeocoderControl,
    geocoder: geocoder
  });

  return GeocoderControl;

}(L));
//# sourceMappingURL=Control.Geocoder.js.map
