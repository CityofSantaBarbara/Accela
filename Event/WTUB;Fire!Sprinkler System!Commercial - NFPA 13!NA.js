//********************************************************************************************************
//Script 		WorkflowTaskUpdateBefore
//Record Types:	Fire!Sprinkler System!Commercial - NFPA 13!NA 
//
//Event: 		WTUB;Fire!Sprinkler System!Commercial - NFPA 13!NA
//
//Desc:			check for fire alarm monitor and make sure its closed before letting this close 
//
//Created By: Silver Lining Solutions
//********************************************************************************************************
// Change Log
//         		Date		Name			Modification
//				08-08-2018	Chad			Initial Draft
//********************************************************************************************************


logDebug("start of WTUB:Fire!Sprinkler System!Commercial - NFPA 13!NA");

if (wfTask == "Close" && wfStatus == "Closed" ) {
 checkSprinklerHeadAndCancel();
}
if (wfTask == "Inspection" && wfStatus == "Final Inspection Complete" ){

 logDebug("For underground inspections an underground fireline permit and a Public Works fireline service permit are required.");
  cancel();
}


logDebug("end of WTUB:Fire!Sprinkler System!Commercial - NFPA 13!NA");
