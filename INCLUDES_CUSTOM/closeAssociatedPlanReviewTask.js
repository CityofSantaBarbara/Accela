// ********************************************************************************************************
// Script 		closeAssociatedPlanReviewTask.js
// Record Types: all
//
// Event: 	ACAA	
//
// Desc:	for plan reviews being completed using the conditions, close the associated WF task
//
// Created By: Silver Lining Solutions
// ********************************************************************************************************
// Change Log
//         		Date		Name		Modification
//				06/18/2018	Eric		Orig
//
// ********************************************************************************************************

function closeAssociatedPlanReviewTask()
{
	
	logDebug("START of closeAssociatedPlanReviewTask");
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

	var task = lookup("BLD_CONDITION_WFTASK_MAP", lookupValue);
	logDebug("                 task = " + task);

	var stat = lookup("BLD_PLANREVIEW_STATUS", conditionStatus);
	logDebug("                 stat = " + stat);
	
	if (task != -1 && stat == 1 && isTaskActive(task)){	
		logDebug("the associated task is active");
		closeTask(task,conditionStatus,"Associated Condition updated","Associated Condition updated");
		}
		
	//printObjProperties(conditionObj);
	logDebug("END of closeAssociatedPlanReviewTask");
}
