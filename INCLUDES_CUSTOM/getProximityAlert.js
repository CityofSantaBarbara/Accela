function getProximityAlert(svc,layer,attributeName, numDistance, distanceType )
{
	try {
		aa.print("getProximityAlert: param svc is:"+svc);
		aa.print("getProximityAlert: param layer is:"+layer);
		aa.print("getProximityAlert: param attributeName is:"+attributeName);
		aa.print("getProximityAlert: param numDistance is:"+numDistance);
		aa.print("getProximityAlert: param distanceType is:"+distanceType);

		var arrGIS = getGISInfoArray2(svc, layer, attributeName, numDistance, distanceType);
		var gisVal = null;
		if (arrGIS != null && arrGIS.length > 0) {
			gisVal = arrGIS.toString();
			aa.print("found value:"+gisVal)
		}
		else { 
			aa.print("the arrGIS is null or arrGIS length is zero or less") 
		}
		return(gisVal);
	}
	catch (err) {
		aa.print("A JavaScript Error occurred: function mapGISAttribToASI: " + err.message);
		aa.print(err.stack);
	}	
}
