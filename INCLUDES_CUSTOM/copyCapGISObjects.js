//********************************************************************************************************
//Script 		copyCapGISObjects
//Event: 		
//Desc:			helper function to copy GIS Objects 
//Created By: Silver Lining Solutions
//********************************************************************************************************
// Change Log
//         		Date        Name          Modification
//            07/10/2019	Chad          Created
//********************************************************************************************************
function copyCapGISObjects(capIdFrom, capIdTo)
{
	var resultgetGISObjects = aa.gis.getCapGISObjects(capIdFrom);
	if (resultgetGISObjects.getSuccess()) {
		var fromCapGISObjects = resultgetGISObjects.getOutput();
		for (zz in fromCapGISObjects) {
			var thisGISServiceName = fromCapGISObjects[zz].gisServiceId;
			var thisGISLayer = fromCapGISObjects[zz].gisTypeId;
			var thisGisObjArray = fromCapGISObjects[zz].GISObjects;
			for (xx in thisGisObjArray) {
				var thisGISObjectGisId = thisGisObjArray[xx].gisId;
				var thisGISObjectObjectId = thisGisObjArray[xx].objectId;
				var addGISObjResult = aa.gis.addCapGISObject(capIdTo, thisGISServiceName, thisGISLayer, thisGISObjectGisId);
				if (addGISObjResult.getSuccess()) {
					logDebug("GIS Object "+thisGISServiceName+"."+thisGISLayer+"."+thisGISObjectGisId+" Added!");
				}
				else {
					logDebug("GIS Object NOT added: error:");
				}
			}
		}
	}	
}
