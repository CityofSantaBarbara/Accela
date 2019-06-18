// ********************************************************************************************************
// Script 		ACUA:Building/~/~/~.js
// Record Types: all
//
// Event: 	ACAA	
//
// Desc:	this script is for app submit global actions
//
// Created By: Silver Lining Solutions
// ********************************************************************************************************
// Change Log
//         		Date		Name		Modification
//				06/18/2018	Eric		Orig
//
// ********************************************************************************************************
logDebug("START of ACUA Building/*/*/* !");

var tempStr = conditionObj.getDispConditionDescription().toString();
var condDesc = "" + tempStr.toString();
var lenDesc = condDesc.length;
var startPos = condDesc.indexOf(":");
var lookupValue = condDesc.substr(startPos+2,lenDesc);

logDebug("******* Condition Info *********************");
logDebug("       Condition Type = " + conditionType);
logDebug("	   Condition Status = " + conditionStatus);
logDebug("Condition Description = " + condDesc);
logDebug("				 length = " + lenDesc);
logDebug("             startPos = " + startPos);
logDebug("          lookupValue = " + lookupValue);

var testString = "follow me to the drive";
var tsLen = testString.length;
logDebug("testString and length = " + testString + " " + tsLen);

var task = lookup("BLD_CONDITION_WFTASK_MAP", lookupValue);

printObjProperties(conditionObj);


logDebug("END of ACUA Building/*/*/* !");