//********************************************************************************************************
//Script 		ASA;Publicworks!ROWM!~!~
//
//Record Types:	Publicworks
//
//Event: 		Application Submit After
//
//Desc:			Alert user of potential conflict of work in right of way
//
//Created By: Silver Lining Solutions
//********************************************************************************************************
// Change Log
//            Date        Name			Modification
//            01-16-2019  Chad			Created
//********************************************************************************************************
logDebug("START ASA:Publicworks\ROWM\*\* ");
checkPBWRightOfWayConflicts();

	if(!publicUser){
		tpbwRowAddresses = loadASITable("PBW_ROWADDRESS", capId);
	}
	else {
		tpbwRowAddresses = loadASITable4ACA("PBW_ROWADDRESS", capId);
	}
	
	if (tpbwRowAddresses) {
		var gisAddSearchType = 'PARCEL';
		mapGISStreetSegsFromROWMASIT(tpbwRowAddresses,gisAddSearchType);
	}
	else { 
		logDebug("no PBW_ROWADDRESS table information exists on this record:"+capId);
	}

logDebug("END ASA:Publicworks\ROWM\*\* ");
