function getGisObjectInfo(gisServer, layerID, queryString) {

	var jsonObject = null;
	var params = [];
	params.push("outFields=*");
	params.push("returnGeometry=false");
	params.push("f=pjson");
	params.push("geometryType=esriGeometryEnvelope");
	params.push("spatialRel=esriSpatialRelIntersects");
	params.push("returnTrueCurves=false");
	params.push("returnIdsOnly=false");
	params.push("returnCountOnly=false");
	params.push("returnZ=false");
	params.push("returnM=false");
	params.push("returnDistinctValues=false");
	params.push("returnExtentsOnly=false");
	params.push("where=" + encodeURIComponent(queryString));

	var u = gisServer + "/" + layerID + "/query?"
		var p = params.join("&")
		logDebug("getGisObjectInfo making GIS call: " + u + p);
	try {
		var postResult = aa.util.httpPost(u, p);
		if (postResult.getSuccess()) {
			//logDebug("Post 1 Successful");
			jsonOutput = postResult.getOutput();
			jsonObject = JSON.parse(jsonOutput);
			return jsonObject;
		}
	} catch (err) {
		logDebug("getGisObjectInfo returned error: " + err.message)
		return null;
	}
}
