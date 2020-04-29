//********************************************************************************************************
//Script 		CTRCA;Publicworks!~!~!~
//
//Record Types:	Publicworks
//
//Event: 		ConvertToRealCapAfter
//
//Desc:			When ACA record is created, add the GIS information based on ASIT
//
//Created By: Silver Lining Solutions
//********************************************************************************************************
// Change Log
//            Date        Name			Modification
//            01-22-2019  Chad			Created
//********************************************************************************************************
logDebug("START OF ctrca publicworks!*!*!*");

    // populate GIS objects and ASI based on mapping std choice
	handleGisObjectMapping(capId);

	checkPBWRightOfWayConflicts();
	
	// by the time you get to CTRCA you no longer need the 4ACA functions

	var tpbwRowAddresses;
		tpbwRowAddresses = loadASITable("PBW_ROWADDRESS", capId);

	if (tpbwRowAddresses) {
		var gisAddSearchType = 'PARCEL';
		mapGISStreetSegsFromROWMASIT(tpbwRowAddresses,gisAddSearchType);
	}
	else { 
		logDebug("no PBW_ROWADDRESS table information exists on this record:"+capId);
	}
logDebug("END OF ctrca publicworks!*!*!*");
