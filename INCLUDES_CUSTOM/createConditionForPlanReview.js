// ********************************************************************************************************
// Script 		createConditionForPlanReview.js
// Record Types: all
//
// Event: 	ACAA	
//
// Desc:	for plan reviews being set to Routed for Review, create the associated Condition
//
// Created By: Silver Lining Solutions
// ********************************************************************************************************
// Change Log
//         		Date		Name		Modification
//				06/18/2018	Eric		Orig
//
// ********************************************************************************************************

function createConditionForPlanReview()
{
	logDebug("START of createConditionForPlanReview");
	
	
	/* handle the counter */
	if (wfTask == "Plans Distribution" && wfStatus == "Routed for Review") {
		logDebug("Matched on Plans Distribution & Routed for Review");
		var prdCount = parseInt(getAppSpecific("Plan Review Distribution Count"));
		editAppSpecific("Plan Review Distribution Count", prdCount + 1);
	}
	
	/* create the associated plan review */
	var conditionDesc = lookup("BLD_WFTASK_CONDITION_MAP",wfTask);
	if (conditionDesc != -1 && wfStatus == "Routed to Reviewer") {

		var prdCount = getAppSpecific("Plan Review Distribution Count");	
		var title = "Review " + prdCount + ": " + conditionDesc;
		var newStatus = "Routed to Reviewer " + prdCount;
		logDebug("Matched on " + conditionDesc + " " & Routed & title =" + title + " & prdCount = " + prdCount);
		addAppCondition("Plan Review","Pending(Applied)",title,"01025","Notice");
		updateTask(wfTask,newStatus,"comment","note");
		}
	
	logDebug("END of createConditionForPlanReview");
}

