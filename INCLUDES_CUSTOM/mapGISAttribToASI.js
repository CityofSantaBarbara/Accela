function mapGISAttribToASI(svc,layer,attributeName,asiName) {
/* 
	for example: "SANTABARBARA", "High Fire Hazard Areas", "assessment", "In High Fire"
		will copy assessment value of High Fire Hazard Areas layer to "In High Fire" custom field
*/
	try {
		logDebug("mapGISAttribToASI: param svc is:"+svc);
		logDebug("mapGISAttribToASI: param layer is:"+layer);
		logDebug("mapGISAttribToASI: param attributeName is:"+attributeName);
		logDebug("mapGISAttribToASI: param asiName is:"+asiName);
		
		var arrGIS = getGISInfoArray2(svc, layer, attributeName, -2);
		if (arrGIS != null && arrGIS.length > 0) {
			var gisAttrforASI = arrGIS.toString();
			editAppSpecific(asiName,gisAttrforASI);
		}
		else { logDebug("mapGISAttribToASI: NO ATTRIBUTE FOUND FOR ATTRIB:"+attributeName); }
	}
	catch (err) {
		logDebug("A JavaScript Error occurred: function mapGISAttribToASI: " + err.message);
		logDebug(err.stack);
	}
}
