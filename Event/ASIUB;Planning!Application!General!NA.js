//********************************************************************************************************
//Script 		Script tracker 8 - Blank Occupancy ID from GIS
//Record Types:	Planning!Application!General!NA 
//
//Event: 		ASIUB
//
//Desc:			Add Application Date into ASI field
//
//
//				Upon updating of the following fields, I would like the Residential 2.Update Date to be updated to the day it was updated. 
//				 
//				GMP Residential.Existing Dwelling Units
//				GMP Residential.Dwelling Units to be Demo'd
//				GMP Residential.Total Dwelling Units 
//				GMP Residential 2.New Dwelling Units
//				GMP Residential 2.Net New Dwelling Units
//				 
//				Upon updating of the following fields, I would like the Nonresidential 2. Update Date to be updated to the day it was updated. 
//				 
//				GMP NONRESIDENTIAL.Existing Nonres sq ft
//				GMP NONRESIDENTIAL.Nonres sq ft to be Demo'd
//				GMP NONRESIDENTIAL.Total Nonres sq ft
//				GMP NONRESIDENTIAL.Existing Hotel Rooms
//				GMP NONRESIDENTIAL.Hotel Rooms to be Demolished
//				GMP NONRESIDENTIAL.Total Hotel Rooms
//				GMP NONRESIDENTIAL 2.New Nonres sq ft
//				GMP NONRESIDENTIAL 2.Net New Nonres sq ft
//				GMP NONRESIDENTIAL 2.New Hotel Rooms
//				GMP NONRESIDENTIAL 2.Net New Hotel Rooms
//
//Created By: Silver Lining Solutions
//********************************************************************************************************
// Change Log
//         		Date		Name			Modification
//				08-08-2018	Chad			Initial Draft
//********************************************************************************************************
logDebug("start of ASIUB:Planning!Application!General!NA");

logDebug("******************* GMP Residential values ************");
var subgroupName = 'GMP Residential';
var beforeValueList = aa.appSpecificInfo.getAppSpecificInfos(capId,subgroupName,null).getOutput();
var updateNeeded = false;
var asiToLookFor = [ "Existing Residential Units", "Residential Units to be Demolished", "Total Residential Units" ];
for (var i=0;i<beforeValueList.length && updateNeeded == false ;i++)
{
	var beforeValName = "" + beforeValueList[i].checkboxDesc;
	if ( asiToLookFor.indexOf(beforeValName) > -1 ) {

		var beforeValue = beforeValueList[i].checklistComment || '';
		var afterValue = AInfo[beforeValName] || '';
		logDebug("--->before value of "+beforeValName+" is:"+beforeValue);
		logDebug("---> the AInfo field value is:"+afterValue);
		
		if (afterValue != beforeValue) { logDebug ("THEY ARE DIFFERENT!");  updateNeeded = true; }
	}
}
if (updateNeeded == false ) {
	logDebug("******************* GMP Residential 2 values ************");
	var subgroupName = 'GMP Residential 2';
	var beforeValueList = aa.appSpecificInfo.getAppSpecificInfos(capId,subgroupName,null).getOutput();
	var asiToLookFor = [ "New Residential Units", "Net New Residential Units" ];
	for (var i=0;i<beforeValueList.length && updateNeeded == false ;i++)
	{
		var beforeValName = "" + beforeValueList[i].checkboxDesc;
		if ( asiToLookFor.indexOf(beforeValName) > -1 ) {

			var beforeValue = beforeValueList[i].checklistComment || '';
			var afterValue = AInfo[beforeValName] || '';
			logDebug("--->before value of "+beforeValName+" is:"+beforeValue);
			logDebug("---> the AInfo field value is:"+afterValue);
			
			if (afterValue != beforeValue) { logDebug ("THEY ARE DIFFERENT!");  updateNeeded = true; }
		}
	}
}
if (updateNeeded) { 
	var dNow = dateAdd(null,0); 
	logDebug("updating gmp residential 2 update date with:"+dNow);
	aa.appSpecificInfo.editSingleAppSpecific(capId,"Update Date",dNow, "GMP Residential 2"); 
}

updateNeeded = false;
logDebug("******************* GMP NONRESIDENTIAL values ************");
subgroupName = 'GMP NONRESIDENTIAL';
beforeValueList = aa.appSpecificInfo.getAppSpecificInfos(capId,subgroupName,null).getOutput();
var asiToLookFor = [ "Existing Nonres sq ft", "Nonres sq ft to be Demo'd", "Total Nonres sq ft", "Existing Hotel Rooms", "Hotel Rooms to be Demolished", "Total Hotel Rooms" ];
for (var i=0;i<beforeValueList.length && updateNeeded == false ;i++)
{
	var beforeValName = "" + beforeValueList[i].checkboxDesc;
	if ( asiToLookFor.indexOf(beforeValName) > -1 ) {

		var beforeValue = beforeValueList[i].checklistComment || '';
		var afterValue = AInfo[beforeValName] || '';
		logDebug("--->before value of "+beforeValName+" is:"+beforeValue);
		logDebug("---> the AInfo field value is:"+afterValue);
		
		if (afterValue != beforeValue) { logDebug ("THEY ARE DIFFERENT!");  updateNeeded = true; }
	}
}
if (updateNeeded == false ) {
	logDebug("******************* GMP NONRESIDENTIAL 2 values ************");
	subgroupName = 'GMP NONRESIDENTIAL 2';
	beforeValueList = aa.appSpecificInfo.getAppSpecificInfos(capId,subgroupName,null).getOutput();
	var asiToLookFor = [ "New Nonres sq ft", "Net New Nonres sq ft", "New Hotel Rooms", "Net New Hotel Rooms" ];
	for (var i=0;i<beforeValueList.length && updateNeeded == false ;i++)
	{
		var beforeValName = "" + beforeValueList[i].checkboxDesc;
		if ( asiToLookFor.indexOf(beforeValName) > -1 ) {

			var beforeValue = beforeValueList[i].checklistComment || '';
			var afterValue = AInfo[beforeValName] || '';
			logDebug("--->before value of "+beforeValName+" is:"+beforeValue);
			logDebug("---> the AInfo field value is:"+afterValue);
			
			if (afterValue != beforeValue) { logDebug ("THEY ARE DIFFERENT!");  updateNeeded = true; }
		}
	}
}

if (updateNeeded) { 
	var dNow = dateAdd(null,0); 
	logDebug("updating gmp NONresidential 2 update date with:"+dNow);
	aa.appSpecificInfo.editSingleAppSpecific(capId,"Update Date",dNow, "GMP NONRESIDENTIAL 2"); 
}


logDebug("end of ASIUB:Planning!Application!General!NA");
