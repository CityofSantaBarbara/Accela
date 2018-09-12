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
var templateModel = conditionObj.getTemplateModel();
var statusDate = conditionObj.getStatusDate();
var hearingDate = conditionObj.getEffectDate();
//pop(templateModel);
printObjProperties(templateModel);
var templateForms = templateModel.getTemplateForms();
printObjProperties(templateForms);
logDebug("templateModel = " + templateModel);
logDebug("ACUA End");