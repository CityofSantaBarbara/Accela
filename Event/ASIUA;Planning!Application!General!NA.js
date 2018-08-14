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


var dNow = "" + dateAdd(null,0); 
logDebug("updating gmp NONresidential 2 update date with:"+dNow);
useAppSpecificGroupName=true;
editAppSpecific("GMP NONRESIDENTIAL 2.Update Date",dNow);
useAppSpecificGroupName=false;
//useAppSpecificGroupName=false;}

logDebug("end of ASIUA:Planning!Application!General!NA");
