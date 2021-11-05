<script type="text/javascript">
    /* For polygons coordinates */
    function chunkArray(myArray, chunk_size){
    var index = 0;
    var arrayLength = myArray.length;
    var tempArray = [];
    for (index = 0; index &lt; arrayLength; index += chunk_size) {
    myChunk = myArray.slice(index, index+chunk_size);
    tempArray.push(myChunk);
    }
    return tempArray;
    }
    
    /*Maps layers*/
    var dare = L.tileLayer('https://dh.gu.se/tiles/imperium/{z}/{x}/{y}.png', {
    minZoom: 4,
    maxZoom: 11,
    attribution: 'Map data &lt;a href="https://imperium.ahlfeldt.se/"&gt;Digital Atlas of the Roman Empire&lt;/a&gt; CC BY 4.0'
    });
    var terrain = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles and source Esri',
    maxZoom: 13
    });
    var watercolor = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
    attribution: 'Map tiles &lt;a href="http://stamen.com"&gt;Stamen Design&lt;/a&gt;, &lt;a href="http://creativecommons.org/licenses/by/3.0"&gt;CC BY 3.0&lt;/a&gt;, Map data &lt;a href="https://www.openstreetmap.org/copyright"&gt;OpenStreetMap&lt;/a&gt;',
    subdomains: 'abcd',
    minZoom: 1,
    maxZoom: 16,
    ext: 'jpg'
    });
    var osm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &lt;a href="https://www.openstreetmap.org/copyright"&gt;OpenStreetMap&lt;/a&gt;'
    }); 
    
    
    var polygons_places = [];
    var lines_places = [];
    var purple_places = [];
    var golden_places = [];
    var ports_places = [];
    var fortifications_places = [];
    var residences_places = [];
    var revenues_places = [];
    var estates_places = [];
    var tenures_places = [];
    var land_places = [];
    var fallow_places = [];
    var uncertain_places = [];
    var select_linked_places = [];
    
    var LeafIcon = L.Icon.extend({ options: {iconSize: [14, 14]} });
    var purpleIcon = new LeafIcon({iconUrl: '../../../assets/images/marker-icon.png'}),
    goldenIcon = new LeafIcon({iconUrl: '../../../assets/images/marker-icon.png'}),
    purpleUncertainIcon = new LeafIcon({iconUrl: '../../../assets/images/marker-icon.png'}),
    goldenUncertainIcon = new LeafIcon({iconUrl: '../../../assets/images/marker-icon.png'});
/*add different icons in assets/images*/
    
    for (var [key, value] of Object.entries(points)) {
    var info = key.substring(key.indexOf("@"), key.lastIndexOf("@"));
    symbols = info.replace('@c', '&lt;img src="../../../assets/images/marker-icon.png" alt="marker" class="mapicon"/&gt;'); 
    if (key.includes('#a')) {
    purple_places.push(L.marker([value.substring(0, value.lastIndexOf(",")), value.substring(value.lastIndexOf(",") +1)], {time: key.substring(0, key.indexOf("|")), icon: purpleIcon, id:key.substring(key.lastIndexOf("@") +1)}).bindPopup('&lt;a target="_blank" href="places.html#0"&gt;'.replace("0", key.substring(key.lastIndexOf("@") +1)) + key.substring(key.indexOf("|") +1, key.indexOf("#")) + '&lt;/a&gt; ' + symbols + ' &lt;span class="block"&gt;Linked documents: ' + key.substring(key.indexOf("#") +1, key.lastIndexOf("#")) + '&lt;/span&gt;'));
    if (key.includes('c@')) {
    ports_places.push(L.marker([value.substring(0, value.lastIndexOf(",")), value.substring(value.lastIndexOf(",") +1)], {time: key.substring(0, key.indexOf("|")), icon: purpleIcon, id:key.substring(key.lastIndexOf("@") +1)}).bindPopup('&lt;a target="_blank" href="places.html#0"&gt;'.replace("0", key.substring(key.lastIndexOf("@") +1)) + key.substring(key.indexOf("|") +1, key.indexOf("#")) + '&lt;/a&gt; ' + symbols + ' &lt;span class="block"&gt;Linked documents: ' + key.substring(key.indexOf("#") +1, key.lastIndexOf("#")) + '&lt;/span&gt;'));
    }
    if (key.includes('d@')) {
    fortifications_places.push(L.marker([value.substring(0, value.lastIndexOf(",")), value.substring(value.lastIndexOf(",") +1)], {time: key.substring(0, key.indexOf("|")), icon: purpleIcon, id:key.substring(key.lastIndexOf("@") +1)}).bindPopup('&lt;a target="_blank" href="places.html#0"&gt;'.replace("0", key.substring(key.lastIndexOf("@") +1)) + key.substring(key.indexOf("|") +1, key.indexOf("#")) + '&lt;/a&gt; ' + symbols + ' &lt;span class="block"&gt;Linked documents: ' + key.substring(key.indexOf("#") +1, key.lastIndexOf("#")) + '&lt;/span&gt;'));
    }
    if (key.includes('e@')) {
    residences_places.push(L.marker([value.substring(0, value.lastIndexOf(",")), value.substring(value.lastIndexOf(",") +1)], {time: key.substring(0, key.indexOf("|")), icon: purpleIcon, id:key.substring(key.lastIndexOf("@") +1)}).bindPopup('&lt;a target="_blank" href="places.html#0"&gt;'.replace("0", key.substring(key.lastIndexOf("@") +1)) + key.substring(key.indexOf("|") +1, key.indexOf("#")) + '&lt;/a&gt; ' + symbols + ' &lt;span class="block"&gt;Linked documents: ' + key.substring(key.indexOf("#") +1, key.lastIndexOf("#")) + '&lt;/span&gt;'));
    }
    if (key.includes('f@')) {
    revenues_places.push(L.marker([value.substring(0, value.lastIndexOf(",")), value.substring(value.lastIndexOf(",") +1)], {time: key.substring(0, key.indexOf("|")), icon: purpleIcon, id:key.substring(key.lastIndexOf("@") +1)}).bindPopup('&lt;a target="_blank" href="places.html#0"&gt;'.replace("0", key.substring(key.lastIndexOf("@") +1)) + key.substring(key.indexOf("|") +1, key.indexOf("#")) + '&lt;/a&gt; ' + symbols + ' &lt;span class="block"&gt;Linked documents: ' + key.substring(key.indexOf("#") +1, key.lastIndexOf("#")) + '&lt;/span&gt;'));
    }
    if (key.includes('g@')) {
    estates_places.push(L.marker([value.substring(0, value.lastIndexOf(",")), value.substring(value.lastIndexOf(",") +1)], {time: key.substring(0, key.indexOf("|")), icon: purpleIcon, id:key.substring(key.lastIndexOf("@") +1)}).bindPopup('&lt;a target="_blank" href="places.html#0"&gt;'.replace("0", key.substring(key.lastIndexOf("@") +1)) + key.substring(key.indexOf("|") +1, key.indexOf("#")) + '&lt;/a&gt; ' + symbols + ' &lt;span class="block"&gt;Linked documents: ' + key.substring(key.indexOf("#") +1, key.lastIndexOf("#")) + '&lt;/span&gt;'));
    }
    if (key.includes('h@')) {
    tenures_places.push(L.marker([value.substring(0, value.lastIndexOf(",")), value.substring(value.lastIndexOf(",") +1)], {time: key.substring(0, key.indexOf("|")), icon: purpleIcon, id:key.substring(key.lastIndexOf("@") +1)}).bindPopup('&lt;a target="_blank" href="places.html#0"&gt;'.replace("0", key.substring(key.lastIndexOf("@") +1)) + key.substring(key.indexOf("|") +1, key.indexOf("#")) + '&lt;/a&gt; ' + symbols + ' &lt;span class="block"&gt;Linked documents: ' + key.substring(key.indexOf("#") +1, key.lastIndexOf("#")) + '&lt;/span&gt;'));
    }
    if (key.includes('i@')) {
    land_places.push(L.marker([value.substring(0, value.lastIndexOf(",")), value.substring(value.lastIndexOf(",") +1)], {time: key.substring(0, key.indexOf("|")), icon: purpleIcon, id:key.substring(key.lastIndexOf("@") +1)}).bindPopup('&lt;a target="_blank" href="places.html#0"&gt;'.replace("0", key.substring(key.lastIndexOf("@") +1)) + key.substring(key.indexOf("|") +1, key.indexOf("#")) + '&lt;/a&gt; ' + symbols + ' &lt;span class="block"&gt;Linked documents: ' + key.substring(key.indexOf("#") +1, key.lastIndexOf("#")) + '&lt;/span&gt;'));
    }
    if (key.includes('j@')) {
    fallow_places.push(L.marker([value.substring(0, value.lastIndexOf(",")), value.substring(value.lastIndexOf(",") +1)], {time: key.substring(0, key.indexOf("|")), icon: purpleIcon, id:key.substring(key.lastIndexOf("@") +1)}).bindPopup('&lt;a target="_blank" href="places.html#0"&gt;'.replace("0", key.substring(key.lastIndexOf("@") +1)) + key.substring(key.indexOf("|") +1, key.indexOf("#")) + '&lt;/a&gt; ' + symbols + ' &lt;span class="block"&gt;Linked documents: ' + key.substring(key.indexOf("#") +1, key.lastIndexOf("#")) + '&lt;/span&gt;'));
    }
    if (key.includes('k@')) {
    uncertain_places.push(L.marker([value.substring(0, value.lastIndexOf(",")), value.substring(value.lastIndexOf(",") +1)], {time: key.substring(0, key.indexOf("|")), icon: purpleUncertainIcon, id:key.substring(key.lastIndexOf("@") +1)}).bindPopup('&lt;a target="_blank" href="places.html#0"&gt;'.replace("0", key.substring(key.lastIndexOf("@") +1)) + key.substring(key.indexOf("|") +1, key.indexOf("#")) + '&lt;/a&gt; ' + symbols + ' &lt;span class="block"&gt;Linked documents: ' + key.substring(key.indexOf("#") +1, key.lastIndexOf("#")) + '&lt;/span&gt;'));
    }
    }
    if (key.includes('#b')) {
    golden_places.push(L.marker([value.substring(0, value.lastIndexOf(",")), value.substring(value.lastIndexOf(",") +1)], {time: key.substring(0, key.indexOf("|")), icon: goldenIcon, id:key.substring(key.lastIndexOf("@") +1)}).bindPopup('&lt;a target="_blank" href="places.html#0"&gt;'.replace("0", key.substring(key.lastIndexOf("@") +1)) + key.substring(key.indexOf("|") +1, key.indexOf("#")) + '&lt;/a&gt; ' + symbols + ' &lt;span class="block"&gt;Linked documents: ' + key.substring(key.indexOf("#") +1, key.lastIndexOf("#")) + '&lt;/span&gt;'));
    if (key.includes('c@')) {
    ports_places.push(L.marker([value.substring(0, value.lastIndexOf(",")), value.substring(value.lastIndexOf(",") +1)], {time: key.substring(0, key.indexOf("|")), icon: goldenIcon, id:key.substring(key.lastIndexOf("@") +1)}).bindPopup('&lt;a target="_blank" href="places.html#0"&gt;'.replace("0", key.substring(key.lastIndexOf("@") +1)) + key.substring(key.indexOf("|") +1, key.indexOf("#")) + '&lt;/a&gt; ' + symbols + ' &lt;span class="block"&gt;Linked documents: ' + key.substring(key.indexOf("#") +1, key.lastIndexOf("#")) + '&lt;/span&gt;'));
    }
    if (key.includes('d@')) {
    fortifications_places.push(L.marker([value.substring(0, value.lastIndexOf(",")), value.substring(value.lastIndexOf(",") +1)], {time: key.substring(0, key.indexOf("|")), icon: goldenIcon, id:key.substring(key.lastIndexOf("@") +1)}).bindPopup('&lt;a target="_blank" href="places.html#0"&gt;'.replace("0", key.substring(key.lastIndexOf("@") +1)) + key.substring(key.indexOf("|") +1, key.indexOf("#")) + '&lt;/a&gt; ' + symbols + ' &lt;span class="block"&gt;Linked documents: ' + key.substring(key.indexOf("#") +1, key.lastIndexOf("#")) + '&lt;/span&gt;'));
    }
    if (key.includes('e@')) {
    residences_places.push(L.marker([value.substring(0, value.lastIndexOf(",")), value.substring(value.lastIndexOf(",") +1)], {time: key.substring(0, key.indexOf("|")), icon: goldenIcon, id:key.substring(key.lastIndexOf("@") +1)}).bindPopup('&lt;a target="_blank" href="places.html#0"&gt;'.replace("0", key.substring(key.lastIndexOf("@") +1)) + key.substring(key.indexOf("|") +1, key.indexOf("#")) + '&lt;/a&gt; ' + symbols + ' &lt;span class="block"&gt;Linked documents: ' + key.substring(key.indexOf("#") +1, key.lastIndexOf("#")) + '&lt;/span&gt;'));
    }
    if (key.includes('f@')) {
    revenues_places.push(L.marker([value.substring(0, value.lastIndexOf(",")), value.substring(value.lastIndexOf(",") +1)], {time: key.substring(0, key.indexOf("|")), icon: goldenIcon, id:key.substring(key.lastIndexOf("@") +1)}).bindPopup('&lt;a target="_blank" href="places.html#0"&gt;'.replace("0", key.substring(key.lastIndexOf("@") +1)) + key.substring(key.indexOf("|") +1, key.indexOf("#")) + '&lt;/a&gt; ' + symbols + ' &lt;span class="block"&gt;Linked documents: ' + key.substring(key.indexOf("#") +1, key.lastIndexOf("#")) + '&lt;/span&gt;'));
    }
    if (key.includes('g@')) {
    estates_places.push(L.marker([value.substring(0, value.lastIndexOf(",")), value.substring(value.lastIndexOf(",") +1)], {time: key.substring(0, key.indexOf("|")), icon: goldenIcon, id:key.substring(key.lastIndexOf("@") +1)}).bindPopup('&lt;a target="_blank" href="places.html#0"&gt;'.replace("0", key.substring(key.lastIndexOf("@") +1)) + key.substring(key.indexOf("|") +1, key.indexOf("#")) + '&lt;/a&gt; ' + symbols + ' &lt;span class="block"&gt;Linked documents: ' + key.substring(key.indexOf("#") +1, key.lastIndexOf("#")) + '&lt;/span&gt;'));
    }
    if (key.includes('h@')) {
    tenures_places.push(L.marker([value.substring(0, value.lastIndexOf(",")), value.substring(value.lastIndexOf(",") +1)], {time: key.substring(0, key.indexOf("|")), icon: goldenIcon, id:key.substring(key.lastIndexOf("@") +1)}).bindPopup('&lt;a target="_blank" href="places.html#0"&gt;'.replace("0", key.substring(key.lastIndexOf("@") +1)) + key.substring(key.indexOf("|") +1, key.indexOf("#")) + '&lt;/a&gt; ' + symbols + ' &lt;span class="block"&gt;Linked documents: ' + key.substring(key.indexOf("#") +1, key.lastIndexOf("#")) + '&lt;/span&gt;'));
    }
    if (key.includes('i@')) {
    land_places.push(L.marker([value.substring(0, value.lastIndexOf(",")), value.substring(value.lastIndexOf(",") +1)], {time: key.substring(0, key.indexOf("|")), icon: goldenIcon, id:key.substring(key.lastIndexOf("@") +1)}).bindPopup('&lt;a target="_blank" href="places.html#0"&gt;'.replace("0", key.substring(key.lastIndexOf("@") +1)) + key.substring(key.indexOf("|") +1, key.indexOf("#")) + '&lt;/a&gt; ' + symbols + ' &lt;span class="block"&gt;Linked documents: ' + key.substring(key.indexOf("#") +1, key.lastIndexOf("#")) + '&lt;/span&gt;'));
    }
    if (key.includes('j@')) {
    fallow_places.push(L.marker([value.substring(0, value.lastIndexOf(",")), value.substring(value.lastIndexOf(",") +1)], {time: key.substring(0, key.indexOf("|")), icon: goldenIcon, id:key.substring(key.lastIndexOf("@") +1)}).bindPopup('&lt;a target="_blank" href="places.html#0"&gt;'.replace("0", key.substring(key.lastIndexOf("@") +1)) + key.substring(key.indexOf("|") +1, key.indexOf("#")) + '&lt;/a&gt; ' + symbols + ' &lt;span class="block"&gt;Linked documents: ' + key.substring(key.indexOf("#") +1, key.lastIndexOf("#")) + '&lt;/span&gt;'));
    }
    if (key.includes('k@')) {
    uncertain_places.push(L.marker([value.substring(0, value.lastIndexOf(",")), value.substring(value.lastIndexOf(",") +1)], {time: key.substring(0, key.indexOf("|")), icon: goldenUncertainIcon, id:key.substring(key.lastIndexOf("@") +1)}).bindPopup('&lt;a target="_blank" href="places.html#0"&gt;'.replace("0", key.substring(key.lastIndexOf("@") +1)) + key.substring(key.indexOf("|") +1, key.indexOf("#")) + '&lt;/a&gt; ' + symbols + ' &lt;span class="block"&gt;Linked documents: ' + key.substring(key.indexOf("#") +1, key.lastIndexOf("#")) + '&lt;/span&gt;'));
    }
    }
    };
    
    for (var [key, value] of Object.entries(polygons)) {
    var split_values = value.split(';');
    split_values.forEach(function(item, index, array) {
    array[index] = parseFloat(item);
    });
    var coords = chunkArray(split_values, 2);
    polygons_places.push(L.polygon([coords], {time: key.substring(0, key.indexOf("|")), color: 'green', id:key.substring(key.lastIndexOf("@") +1)}).bindPopup('&lt;a target="_blank" href="places.html#0"&gt;'.replace("0", key.substring(key.lastIndexOf("#") +1)) + key.substring(key.indexOf("|") +1, key.indexOf("#")) + '&lt;/a&gt; &lt;span class="block"&gt;Linked documents: ' + key.substring(key.indexOf("#") +1, key.lastIndexOf("#")) + '&lt;/span&gt;'));
    }; 
    
    for (var [key, value] of Object.entries(lines)) {
    var split_values = value.split(';');
    split_values.forEach(function(item, index, array) {
    array[index] = parseFloat(item);
    });
    var coords = chunkArray(split_values, 2);
    lines_places.push(L.polyline([coords], {time: key.substring(0, key.indexOf("|")), color: 'blue', id:key.substring(key.lastIndexOf("@") +1)}).bindPopup('&lt;a target="_blank" href="places.html#0"&gt;'.replace("0", key.substring(key.lastIndexOf("#") +1)) + key.substring(key.indexOf("|") +1, key.indexOf("#")) + '&lt;/a&gt; &lt;span class="block"&gt;Linked documents: ' + key.substring(key.indexOf("#") +1, key.lastIndexOf("#")) + '&lt;/span&gt;'));
    }; 
    
    var toggle_ports_places = L.layerGroup(ports_places);
    var toggle_fortifications_places = L.layerGroup(fortifications_places);
    var toggle_residences_places = L.layerGroup(residences_places);
    var toggle_revenues_places = L.layerGroup(revenues_places);
    var toggle_estates_places = L.layerGroup(estates_places);
    var toggle_tenures_places = L.layerGroup(tenures_places);
    var toggle_land_places = L.layerGroup(land_places);
    var toggle_fallow_places = L.layerGroup(fallow_places);
    var toggle_uncertain_places = L.layerGroup(uncertain_places);
    var toggle_purple_places = L.layerGroup(purple_places); 
    var toggle_golden_places = L.layerGroup(golden_places);
    var toggle_polygons = L.layerGroup(polygons_places);
    var toggle_lines = L.layerGroup(lines_places);
    var toggle_select_linked_places = L.layerGroup(select_linked_places);
    
    var baseMaps = {
    "DARE": dare,
    "Terrain": terrain, 
    "Watercolor": watercolor,
    "Open Street Map": osm
    };
    
    var overlayMaps = {
    "All places linked to fiscal properties": toggle_golden_places,
    "All places not linked to fiscal properties": toggle_purple_places,
    "Places not precisely located or wider areas": toggle_polygons,
    "Rivers": toggle_lines,
    "From uncertain tradition": toggle_uncertain_places,
    "Ports and fords": toggle_ports_places,
    "Fortifications": toggle_fortifications_places,
    "Residences": toggle_residences_places,
    "Markets, crafts and revenues": toggle_revenues_places,
    "Estates and estate units": toggle_estates_places,
    "Tenures": toggle_tenures_places,
    "Land plots and rural buildings": toggle_land_places,
    "Fallow land": toggle_fallow_places
    };
    
    var layers = [osm, terrain, watercolor];
    
    var markers = purple_places.concat(golden_places);
    
    function openPopupById(id){ for(var i = 0; i &lt; markers.length; ++i) { if (markers[i].options.id == id){ markers[i].openPopup(); }; }}
    
    function displayById(id){ for(var i = 0; i &lt; markers.length; ++i) { if (markers[i].options.id == id){
    toggle_select_linked_places.addLayer(markers[i]); 
    }; }}
</script>