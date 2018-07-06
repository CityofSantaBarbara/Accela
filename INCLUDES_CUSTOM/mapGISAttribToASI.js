function mapGISAttribToASI(svc,layer,attributeName,asiName) {
/* 
	for example: "SANTABARBARA", "High Fire Hazard Areas", "assessment", "In High Fire"
		will copy assessment value of High Fire Hazard Areas layer to "In High Fire" custom field
*/
	try {
		aa.print("mapGISAttribToASI: param svc is:"+svc);
		aa.print("mapGISAttribToASI: param layer is:"+layer);
		aa.print("mapGISAttribToASI: param attributeName is:"+attributeName);
		aa.print("mapGISAttribToASI: param asiName is:"+asiName);
		
		var arrGIS = getGISInfoArray2(svc, layer, attributeName);
		if (arrGIS != null && arrGIS.length > 0) {
			var gisAttrforASI = arrGIS.toString();
			editAppSpecific(asiName,gisAttrforASI);
		}
		else { aa.print("mapGISAttribToASI: NO ATTRIBUTE FOUND FOR ATTRIB:"+attributeName); }
	}
	catch (err) {
		aa.print("A JavaScript Error occurred: function mapGISAttribToASI: " + err.message);
		aa.print(err.stack);
	}
}
