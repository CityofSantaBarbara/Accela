//********************************************************************************************************
//Script 		InspectionResultSubmitAfter
//Record Types:	Fire!Sprinkler System!Commercial - NFPA 13!NA 
//
//Event: 		
//
//Desc:			Use this script to move the record status and close the entire 
//          record if final inspection complete
//
//Created By: Silver Lining Solutions
//********************************************************************************************************
// Change Log
//         		Date		Name			Modification
//				08-04-2018	Chad			Initial Draft
//				08-08-2018	Chad			changed to look for specific status and then close workflow task
//********************************************************************************************************


logDebug("start of IRSA:Fire!Sprinkler System!Commercial - NFPA 13!NA");

if (InspectionType == "Final" && InspectionResult == "Passed" ) {
	var donotCloseRecord = checkSprinklerHeadAndCancel();
	cancel = false; // need to reset this so the event doesn't cancel because of the checkSprinklerHeadAndCancel call
	 
	if (donotCloseRecord) {
		// there is a problem, so you don't want to close anything yet.
	} else {
		logDebug("IRSA:Fire!Sprinkler System!Commercial - NFPA 13!NA - final inspection complete, closing inspection workflow task")
		closeTask("Inspection","Final Inspection Complete", "Final inspection completed, closed by script");
		
		// you could expand this to check for balance due and if none close the whole workflow and record.
	}
}

logDebug("end of IRSA:Fire!Sprinkler System!Commercial - NFPA 13!NA");
