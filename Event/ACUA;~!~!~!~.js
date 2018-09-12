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
var myTemplate = myCapConditionModel.getTemplate();
printObjProperties(myTemplate);
logDebug("ACUA End");
var templateForms = myTemplate.getTemplateForms();
var pk = myTemplate.getEntityPKModel();
printObjProperties(pk);
printObjProperties(templateForms);

var condScript = aa.condition.getNewConditionScriptModel();
printObjProperties(condScript);