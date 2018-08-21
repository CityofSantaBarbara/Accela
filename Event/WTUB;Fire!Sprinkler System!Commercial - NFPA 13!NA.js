//********************************************************************************************************
//Script 		9 - Fire Sprinkler Monitoring
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


logDebug("start of 9 - Fire Sprinkler Monitoring");

if (wfTask == "Close" && wfStatus == "Closed" ) {
 checkSprinklerHeadAndCancel();
}



logDebug("end of 9 - Fire Sprinkler Monitoring");

//********************************************************************************************************
//Script 		11 - Underground Fireline
//Record Types:	Fire!Sprinkler System!Commercial - NFPA 13!NA 
//
//Event: 		WTUB;Fire!Sprinkler System!Commercial - NFPA 13!NA
//
//Desc:			On a FIR sprinkler pmt if the checkbox indicates that an underground fire line is required then there must be 2 separate permits for the fire line.
 
				//Event Trigger: WorkflowTaskUpdateBefore & InspectionResultSubmitBefore (because we are 
				//trying to automate the workflow from the inspection) 
				//Record Type(s): Fire Sprinkler – NFPA 13 
				//Criteria: Task: Task = ‘Inspection’ and status = ‘Final Inspection Complete’ and if checkbox ‘Underground By Others’ = ‘Yes’ 
				//Actions: verify that 2 related records exists and are closed: Underground Fireline & PBW Fire Line Service 
//
//Created By: EJ
//********************************************************************************************************
// Change Log
//         		Date		Name			Modification
//				08-21-18	EJ				Initial Draft
//********************************************************************************************************
logDebug("start of 11 - Underground Fireline");

if (wfTask == "Inspection" && wfStatus == "Final Inspection Complete" ){

 showMessage = true;
 comment("For underground inspections an underground fireline permit and a Public Works fireline service permit are required.");
  cancel=true;
 
}
logDebug("start of 11 - Underground Fireline");