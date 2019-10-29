// ********************************************************************************************************
// Script 		closeWorkflowsAfterAppStatusChange.js
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
//			This function will lookup the new capSTatut
//
//
// Created By: Silver Lining Solutions
// ********************************************************************************************************
// Change Log
//         		Date		Name		Modification
//				10/25/2019	Chad		Orig
//
// ********************************************************************************************************
function closeWorkflowsAfterAppStatusChange() {
	// do a look up based on cap type module to get status to include in this script.
	
	var lookupResult = null;
	var lookupTableName = "AppStatusToCloseWorkflows";
	var lookupValueName = appTypeArray[0];
	lookupResult = lookup(lookupTableName, lookupValueName);
	logDebug("Full lookupValue = " + lookupResult);

	if (lookupResult) {
		var lookupResults = lookupResult.split(",");
		var statChecker = "" + capStatus;
		logDebug("now going to check the index of stat checker:"+statChecker);
		if (lookupResults.indexOf(statChecker) >= 0) {
			logDebug("We found a status that requires a close of all workflow!");
			var statusNote = "Closed - App Status Changed to " + capStatus;
			var statusDescNote = "Closed by automation script on " + (new Date());
			var myClosedOK = taskCloseAllWorkflowTasks(statusNote,statusDescNote);
			logDebug("closing all open tasks was:"+myClosedOK);
		} else {
			logDebug("capStatus:"+capStatus+" was not found in the lookup results");
		}
	}
}
