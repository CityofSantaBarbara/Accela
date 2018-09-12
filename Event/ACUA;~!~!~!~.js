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
logDebug("statusDate = " + statusDate + "  hearingDate = " + hearingDate);
//pop(templateModel);
printObjProperties(templateModel);
var templateForms = templateModel.getTemplateForms();
var pk = templateModel.getEntityPKModel();
printObjProperties(pk);
printObjProperties(templateForms);
logDebug("templateModel = " + templateModel);
var fieldpk;
var x = aa.condition.getFields4TemplateTable(pk,fieldpk);
if (x.getSuccess()) {
	printObjProperties(x.getoutput());
}
printObjProperties(x);
printObjProperties(fieldpk);
logDebug("ACUA End");