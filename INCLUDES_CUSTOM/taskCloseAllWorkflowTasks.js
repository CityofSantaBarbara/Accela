// ********************************************************************************************************
// Script 		taskCloseAllWorkflowTasks.js
// Record Types: BLD, ENF, FIR, PLN, PBW
//
// Event: 	ASUA	
//
//			for Issue 127 of city issue tracking list
//
// Desc:	I would like a script that does the following:  
//				When I choose a Record Status of Void or Withdrawn, and click "Submit," 
//				the script runs and closes all open WF tasks.
//
//
//			For the Public Works module all record types, 
//			please make all workflow tasks Task Active=No 
//			when Status is changed to New Status=Closed, Completed, Denied, Expired, or Failed
//
// Created By: Silver Lining Solutions
// ********************************************************************************************************
// Change Log
//         		Date		Name		Modification
//				10/25/2019	Chad		Orig
//
// ********************************************************************************************************
function taskCloseAllWorkflowTasks(pStatus,pComment) {
	// Closes all active tasks in CAP with specified status and comment

	var workflowResult = aa.workflow.getTasks(capId);
	if (workflowResult.getSuccess())
  	 	var wfObj = workflowResult.getOutput();
	else { 
		logMessage("**ERROR: Failed to get workflow object: " + workflowResult.getErrorMessage()); 
		logDebug("**ERROR: Failed to get workflow object: " + workflowResult.getErrorMessage()); 
		return false; 
	}
	
	var fTask;
	var stepnumber;
	var processID;
	var dispositionDate = new Date();
	var statDate = aa.date.getCurrentDate();
	var wfnote = pStatus;
	var wftask, wftaskComplete;

	for (idToGet in wfObj) {
		fTask = wfObj[idToGet];
		wftask = fTask.getTaskDescription();
		wftaskStatDate = fTask.getStatusDate();
		wftaskComplete = fTask.getCompleteFlag();
		stepnumber = fTask.getStepNumber();
		processID = fTask.getProcessID();
		wfTaskstat = isTaskActive(wftask) || false;
		if (wftaskComplete != 'Y' ) {
			fTask.setActiveFlag("N");
			fTask.setDispositionDate(dispositionDate)
			fTask.setDispositionComment(pComment);
			fTask.setStatusDate(statDate);
			fTask.setCompleteFlag("Y");
			fTask.setDispositionNote(pComment);
			fTask.setDisposition(pStatus);
			aa.workflow.editTask(fTask);
			logDebug("   "+"Closing Workflow Task>>" + wftask + "<< with status " + pStatus);
		}
	}
	return true;
}