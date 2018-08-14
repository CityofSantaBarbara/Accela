//********************************************************************************************************
//Script 		Script tracker 8 - Blank Occupancy ID from GIS
//Record Types:	Planning!Application!General!NA 
//
//Event: 		ASIUA
//
//Desc:			TESTING an idea...
//
//
//
//Created By: Silver Lining Solutions
//********************************************************************************************************
// Change Log
//         		Date		Name			Modification
//				08-14-2018	Chad			Initial Draft
//********************************************************************************************************


logDebug("start of ASIUA:Planning!Application!General!NA");

var upGMPRes = aa.env.getValue("ASIUB_PLN_MST_UpdateDate_GMPRes");
var upGMPNonRes = aa.env.getValue("ASIUB_PLN_MST_UpdateDate_GMPNonRes");

logDebug(" the upGMPRes is:" + upGMPRes );
logDebug(" the upGMPNonRes:" + upGMPNonRes );

if ( upGMPRes ) {
	var dNow = "" + dateAdd(null,0); 
	logDebug("updating gmp residential 2 update date with:"+dNow);
	useAppSpecificGroupName=true;
	editAppSpecific("GMP Residential 2.Update Date",dNow);
	useAppSpecificGroupName=false;
}

if ( upGMPNonRes ) {
	var dNow = "" + dateAdd(null,0); 
	logDebug("updating gmp residential 2 update date with:"+dNow);
	useAppSpecificGroupName=true;
	editAppSpecific("GMP Residential 2.Update Date",dNow);
	useAppSpecificGroupName=false;
}

aa.env.setValue("ASIUB_PLN_MST_UpdateDate_GMPRes",false);
aa.env.setValue("ASIUB_PLN_MST_UpdateDate_GMPNonRes",false);


logDebug("end of ASIUA:Planning!Application!General!NA");
