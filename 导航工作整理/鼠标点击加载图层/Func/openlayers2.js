var fromProjection = new OpenLayers.Projection("EPSG:4326");   // Transform from WGS 1984
var toProjection   = new OpenLayers.Projection("EPSG:900913"); // to Spherical Mercator Projection

OpenLayers.Control.Click = OpenLayers.Class(
	OpenLayers.Control, {
		defaultHandlerOptions: {
		  	'single': true,
		  	'double': false,
		  	'pixelTolerance': 0,
		  	'stopSingle': false,
		  	'stopDouble': false
		  },
		initialize: function(options) {
		  	this.handlerOptions = OpenLayers.Util.extend(
		  		{}, this.defaultHandlerOptions
		  	);
			  OpenLayers.Control.prototype.initialize.apply(
		  		this, arguments
			  );
		 	 this.handler = new OpenLayers.Handler.Click(
		  		this, 
		  		{
		  			'click': this.trigger
		  		}, 
		  		this.handlerOptions
			);
		}, 
		trigger: function(e) {
		  	var lonlat = map.getLonLatFromPixel(e.xy);
		  	showDebug("You clicked near " + lonlat.lat + " N, " + lonlat.lon + " E");
		  	var position = new OpenLayers.LonLat(lonlat.lon,lonlat.lat).transform(toProjection, fromProjection);
		  	showDebug("You clicked near " +position.lat + " N, " +position.lon + " E");
		  	var route = {x:position.lon,y:position.lat};
			var reqRouting = JSON.stringify(route);
			sendRequest(reqRouting,"/mouseClick",updatePage2);
		  }
});

var updatePage2 = function(){
	if(xmlHttp.readyState == 4 && xmlHttp.status == 200){
		var response = xmlHttp.responseText;
		var result = JSON.parse(xmlHttp.responseText);
		info = result;
		zoneMap();
	}
}



function showMap(){
           	var options = {
           		projection: toProjection,
              		displayProjection: fromProjection,
            		units: "m"
          	};
            	map = new OpenLayers.Map('mapdiv',options); 
      	OpenLayers.IMAGE_RELOAD_ATTEMPTS = 5;
                	
                	var osm_layer = new OpenLayers.Layer.OSM( 
       		'OpenStreetMap Layer' 
    	); 
                	routeLayer1 = new OpenLayers.Layer.Vector("routeLayer",{
           		styleMap: new OpenLayers.StyleMap(new OpenLayers.Style({
		pointRadius: 2.0,
		strokeColor: "#ff1900",
		fillColor:"#ff1900",
                		strokeWidth: 3
            		}))
       	});
       	routeLayer2 = new OpenLayers.Layer.Vector("routeLayer",{
           		styleMap: new OpenLayers.StyleMap(new OpenLayers.Style({
		pointRadius: 2.0,
		strokeColor: "#00ff00",
		fillColor:"#00ff19",
                		strokeWidth: 3
            		}))
       	});
       	
       	var roadCol=[];
       	var road ={};
       	
                	for(var i=0;i<info.length;i++){
                		var position1 = new OpenLayers.LonLat(info[i].x1, info[i].y1).transform(fromProjection, toProjection);
                		var position2 = new OpenLayers.LonLat(info[i].x2, info[i].y2).transform(fromProjection, toProjection);
                		//showDebug(position1);
                				
                		var components = [
                			new OpenLayers.Geometry.Point(position1.lon,position1.lat),
                			new OpenLayers.Geometry.Point(position2.lon,position2.lat)
                		];
                		//showDebug(info[i].x1+" "+info[i].y1+" "+info[i].x2+" "+info[i].y2+" "+info[i].time);
                		var linearRing = new OpenLayers.Geometry.LinearRing(components);
                		var fea = new OpenLayers.Feature.Vector(linearRing);
                		if(info[i].time == 25.0){
                			routeLayer1.addFeatures(fea);
                		}
                		else{
                			routeLayer2.addFeatures(fea);
                		}
	}
			
	map.addLayers([osm_layer]);
	map.addLayer(routeLayer1); 
	map.addLayer(routeLayer2); 
	 var click = new OpenLayers.Control.Click();
                	map.addControl(click);
                	click.activate();
	map.setCenter(new OpenLayers.LonLat(12955490, 4854208)); 
      	map.zoomTo(12);  
      	
}


var zoneMap = function(){
	var fromProjection = new OpenLayers.Projection("EPSG:4326");   // Transform from WGS 1984
    	var toProjection   = new OpenLayers.Projection("EPSG:900913"); // to Spherical Mercator Projection
                	for(var i=0;i<info.length;i++){
                		var position1 = new OpenLayers.LonLat(info[i].x1, info[i].y1).transform(fromProjection, toProjection);
                		var position2 = new OpenLayers.LonLat(info[i].x2, info[i].y2).transform(fromProjection, toProjection);
                		//showDebug(position1);
                		var components = [
                			new OpenLayers.Geometry.Point(position1.lon,position1.lat),
                			new OpenLayers.Geometry.Point(position2.lon,position2.lat)
                		];
                		//showDebug(info[i].x1+" "+info[i].y1+" "+info[i].x2+" "+info[i].y2+" "+info[i].time);
                		var linearRing = new OpenLayers.Geometry.LinearRing(components);
                		var fea = new OpenLayers.Feature.Vector(linearRing);
                		if(info[i].time == 25.0){
                			routeLayer1.addFeatures(fea);
                		}
                		else{
                			routeLayer2.addFeatures(fea);
                		}
	}
	map.addLayer(routeLayer1); 
	map.addLayer(routeLayer2); 	
}