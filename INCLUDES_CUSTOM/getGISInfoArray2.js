/*===========================================
Title : getGISInfoArray2 
Purpose : Returns an array of attributes from a layer in GIS with proximity parameters 
Author : Paul Rose
Functional Area : GIS
Description : Optional parameters for buffer distance allow you to shrink or enlarge
              the GIS feature on the record when overlaying the target layer in GIS.
              Using -1 "feet" will shrink the parcel shape to help eliminate touching
              features that the parcel is not actually within.
Reviewed By : 
Script Type : EMSE
General Purpose/Client Specific : General
Client developed for : 
Parameters : 
	svc: Text:  GIS service name, usually found on the map
	layer: Text: GIS layer name, found in GIS map layers list
	attributename: GIS field name value to be returned
	numDistance: Number: Optional, defaults to zero, distance from parcel to check
	distanceType: One of: feet, meters, miles
Example: getGISInfoArray2("SANDIEGO", "FEMA Floodways & Floodplains","FLD_ZONE",-1,"feet");
=========================================== */
function getGISInfoArray2(svc,layer,attributename) // optional: numDistance, distanceType
{
	try{	
		var numDistance = 0
		if (arguments.length >= 4) numDistance = arguments[3]; // use numDistance in arg list
		var distanceType = "feet";
		if (arguments.length == 5) distanceType = arguments[4]; // use distanceType in arg list
		var retArray = new Array();
	   	
		var bufferTargetResult = aa.gis.getGISType(svc,layer); // get the buffer target
		if (bufferTargetResult.getSuccess())
			{
			var buf = bufferTargetResult.getOutput();
			buf.addAttributeName(attributename);
			}
		else
			{ logDebug("**WARNING: Getting GIS Type for Buffer Target.  Reason is: " + bufferTargetResult.getErrorType() + ":" + bufferTargetResult.getErrorMessage()) ; return false }
				
		var gisObjResult = aa.gis.getCapGISObjects(capId); // get gis objects on the cap
		if (gisObjResult.getSuccess()) 	
			var fGisObj = gisObjResult.getOutput();
		else
			{ logDebug("**WARNING: Getting GIS objects for Cap.  Reason is: " + gisObjResult.getErrorType() + ":" + gisObjResult.getErrorMessage()) ; return false }
	
		for (a1 in fGisObj) // for each GIS object on the Cap.  We'll only send the last value
			{
			var bufchk = aa.gis.getBufferByRadius(fGisObj[a1], numDistance, distanceType, buf);
	
			if (bufchk.getSuccess())
				var proxArr = bufchk.getOutput();
			else
				{ logDebug("**WARNING: Retrieving Buffer Check Results.  Reason is: " + bufchk.getErrorType() + ":" + bufchk.getErrorMessage()) ; return false }	
			
			for (a2 in proxArr)
				{
				var proxObj = proxArr[a2].getGISObjects();  // if there are GIS Objects here, we're done
				for (z1 in proxObj)
					{
					var v = proxObj[z1].getAttributeValues();
					retArray.push(v[0]);
					}
				
				}
			}
		return retArray;
	}
	catch (err) {
		logDebug("A JavaScript Error occurred: function getGISInfoArray2: " + err.message);
		logDebug(err.stack);
	}
}
/***************************************************************************/