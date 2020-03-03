
// added 11/6/19 JHS Gray Quarter, Inc.
function handleGisObjectMapping(itemCap) {
	var gisService = "SANTABARBARA";
	var gisMapString = lookup("PW_GIS_MAPPING",appTypeString);
	var url = lookup("GIS_REST_SERVICES_URL", "URL");

	// sample:  [{"gisId":"LATERALID","id":"Sewer Lateral ID", "layer":"Sewer Laterals","gisLayerId":"145","map": [{"gis":"Size of Lateral","asi":"Diameter of Sewer Lateral"}]},{"gisId":"LINK","id":"Sewer Main ID", "layer":"Sewer Mains", "gisLayerId":"145","map": [{"gis":"MATERIAL","asi":"Sewer Main Material"}]}]

	// get GIS Objects already on record
	
	var fGisObj = [];
	var gisObjResult = aa.gis.getCapGISObjects(capId); // get gis objects on the cap
	if (gisObjResult.getSuccess()) {
		var output = gisObjResult.getOutput();
		for (var n in output) {
			logDebug("adding: " + output[n]);
			fGisObj = fGisObj.concat(output[n].getGISObjects());
			logDebug("fGisObj size is now " + fGisObj.length);
			//logDebug(output[i].getGISObjects()[0].getGisObjectModel().getGisObjectID() + "," + output[i].getGISObjects()[0].getGisObjectModel().getGisId() + "," + output[i].getGISObjects()[0].getGisObjectModel().getLayerId());
		}
	}
	else {
		logDebug("**WARNING: Getting GIS objects for Cap.  Reason is: " + gisObjResult.getErrorType() + ":" + gisObjResult.getErrorMessage());
	}
	
	//testing
	
	if (!gisMapString || gisMapString == "") {
		logDebug("no mapping found for " + appTypeString);
		return false;
	}
	
	try {
		var gisMap = JSON.parse(gisMapString);
	}
	catch(err) {
		logDebug("can't parse GIS mapping for " + appTypeString + " result: " + err.message);
		return false;
	}
	
	for (var i in gisMap) { // once for each object
		var thisId = gisMap[i].id; // ASI Field containing ID field
		var valueString = AInfo[thisId]; // delimited list from either ASI or built from existing GIS objects
		var gisId = gisMap[i].gisId; // field used in GIS for ID
		var gisLayerId = gisMap[i].gisLayerId;  // layer number
		var thisLayer = gisMap[i].layer // layer name 
		if (!valueString || valueString== "") {
			logDebug("empty ASI field for GIS object mapping to layer " + thisLayer + ", " + thisId + " is empty, checking if one already exists");
			var tempValues = [];
			for (var n in fGisObj) {
				var gisObj = fGisObj[n].getGisObjectModel();
				logDebug("checking layer " + thisLayer + " = " + gisObj.getLayerId());
				if (thisLayer.equals(gisObj.getLayerId())) {
					tempValues.push(gisObj.getGisId()); // push objects to Array
				}
				if (tempValues.length > 0) {
					valueString = tempValues.join(",");
					logDebug("retrieved GIS objects for this layer, values are '" + valueString + "'");
				}
			}
		}
		else {
			logDebug("found an value of '" + valueString + "' in ASI Field " + thisId + " for layer " + thisLayer);
		}

		if (!valueString || valueString== "") {
			logDebug("No objects or ASI data in ASI field " + thisId + " for Layer " + thisLayer + ".  No ASI mapping will happen");
			continue;
		}
		else {
			logDebug("Begin ASI Mapping for Layer " + thisLayer + ".  The object id(s) are: " + valueString);
		}
		
		var value = [];		
		var idSplit = String(valueString).split(/[ ,]+/);
		for (var ii in idSplit) {
			var objectId = trim(idSplit[ii]);
			if (objectId && objectId != "") {

				logDebug("Adding " + thisLayer + "." + thisId + "." + objectId + " to record " + itemCap.getCustomID() + ".  Success? " + aa.gis.addCapGISObject(itemCap, gisService, thisLayer, objectId).getSuccess());
			
				// now do the ASI mapping
				//var a = getGisLayerInfo(gisService,thisLayer,AInfo[thisId],"OBJECTID");
				
				var a = getGisObjectInfo(url,gisLayerId,gisId + "='" + objectId + "'");  // search ESRI Service
				logDebug("getGisObjectInfo returns " + JSON.stringify(a));

				for (var j in gisMap[i].map) {
					var asiMapping = gisMap[i].map[j];
					logDebug("mapping: " + JSON.stringify(asiMapping));
					if (a && a.features) {
						logDebug("we have features : " + JSON.stringify(a.features));
						for (var k in a.features) {
							var newValue = a.features[k].attributes[asiMapping.gis];
							if (asiMapping.map) {
								newValue = lookup(asiMapping.map,newValue);
								logDebug("used std choice " + asiMapping.map + " to translate to " + newValue);	
							}
							logDebug("adding value to : " + asiMapping.gis + " : " + newValue);
							if (!value[asiMapping.gis]) {
								value[asiMapping.gis] = [];
							}
							value[asiMapping.gis].push(newValue);
						}
					}
				}
			}
		}
		for (var iii in value) {
			logDebug("value['" + iii + "'] = " + JSON.stringify(value[iii]));
			logDebug("editAppSpecific(" + asiMapping.asi + ",'" + value[iii].join(",") + "',itemCap)");
			editAppSpecific(asiMapping.asi,value[iii].join(","),itemCap);
		}
	}
}
