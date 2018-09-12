// ********************************************************************************************************
// Script 		ACUA:~/~/~/~.js
// Record Types: all
//
// Event: 	ACUA	
//
// Desc:	this script is for app submit global actions
//
// Created By: Silver Lining Solutions
// ********************************************************************************************************
// Change Log
//         		Date		Name			Modification
//				9/12/2018	Eric			Orig
// ********************************************************************************************************

logDebug("ACUA Start");
printObjProperties(conditionObj);
var myCapConditionModel = conditionObj.getCapConditionModel();
printObjProperties(myCapConditionModel);

logDebug("ACUA End");