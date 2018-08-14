//********************************************************************************************************
//Script 		Script tracker 8 - Blank Occupancy ID from GIS
//Record Types:	Planning!Application!General!NA 
//
//Event: 		ASIUA
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


logDebug("start of ASIUA:Planning!Application!General!NA");


logDebug("NOTICE THE DIFFERENCE IN THE VALUES - THIS IS HOW YOU CAN CHECK WHAT HAS CHANGED!")


logDebug("******************* printing the GMP Residential values ************");
var subgroupName = 'GMP Residential';
var beforeValueList = aa.appSpecificInfo.getAppSpecificInfos(capId,subgroupName,null).getOutput();
for (var i=0;i<beforeValueList.length;i++)
{

	printObjProperties(beforeValueList[i]);

	var beforeValName = beforeValueList[i].getAttributeValue();
	logDebug("--->"+beforeValName);
	var beforeValue = beforeValueList[i].getChecklistComment();
	logDebug("--->before value is:"+beforeValue);
}

logDebug("******************* printing the GMP NONRESIDENTIAL values ************");
subgroupName = 'GMP NONRESIDENTIAL';
beforeValueList = aa.appSpecificInfo.getAppSpecificInfos(capId,subgroupName,null).getOutput();
for (var i=0;i<beforeValueList.length;i++)
{
	printObjProperties(beforeValueList[i]);

	var beforeValName = beforeValueList[i].getAttributeValue();
	logDebug("--->"+beforeValName);
	var beforeValue = beforeValueList[i].getChecklistComment();
	logDebug("--->before value is:"+beforeValue);
}

logDebug("end of ASIUA:Planning!Application!General!NA");
