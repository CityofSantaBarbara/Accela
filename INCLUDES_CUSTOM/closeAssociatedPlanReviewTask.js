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
//			Date		Name		Modification
//			06/18/2018	Eric		Orig
//			01/31/2020	Chad		Assign task before closing to document who updated the condition
//			02/06/2020	Chad		City requested that the applied by user ID be assigned the task
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
	var condAppliedBy = conditionObj.getIssuedByUser();
	var asnPerson = aa.person.getUser(condAppliedBy.getFirstName(), condAppliedBy.getMiddleName(), condAppliedBy.getLastName());

	if ( asnPerson.getSuccess() ) var asnPersonId = asnPerson.getOutput().getGaUserID();
	else var asnPersonId = currentUserID;


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
	logDebug("assigned person ID:"+asnPersonId);	
	
	if (task != -1 && stat == 1 && isTaskActive(task)){	
		logDebug("the associated task is active ... assigning and closing now.");
		assignTask(task,asnPersonId);
		closeTask(task,conditionStatus,"Associated Condition updated","Associated Condition updated");
		}
		
	logDebug("END of closeAssociatedPlanReviewTask");
}
