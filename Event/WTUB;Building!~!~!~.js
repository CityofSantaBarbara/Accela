//********************************************************************************************************
//Script 		Script tracker 8 - Blank Occupancy ID from GIS
//Record Types:	Building!~!~!~ 
//
//Event: 		WTUB;Building!~!~!~   (same logic currently applies to BLD records too!)
//
//Desc:			IF for some reason GIS does NOT have a occupancy ID, do not allow the 
//				permit to be issued (WF = Issued). Applies to All building and fire permits. 
//
//Created By: Silver Lining Solutions
//********************************************************************************************************
// Change Log
//         		Date		Name			Modification
//				08-08-2018	Chad			Initial Draft
//********************************************************************************************************


logDebug("start of WTUB:Building!~!~!~");

//if (wfStatus == "Issued" ) {
//	var thisAddrAttribsArr = [];
//	loadAddressAttributes(thisAddrAttribsArr, capId);
//
//	if (thisAddrAttribsArr["AddressAttribute.OCCUPANCYID"]) {
//		logDebug("you have an occupancy ID on file for the primary address!");
//	} else {
//		logDebug("you DO NOT have an occupancy ID on file for the primary address!");
//		cancel = true;
//		comment("<font color=red><b>You may not issue this permit until an occupancy ID is assigned to the address</b></font>");
//	}
//}

logDebug("end of WTUB:Building!~!~!~");
