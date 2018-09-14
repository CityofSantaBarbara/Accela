/* *******************************************************************************************************
//Script 		Returned to Applicant - Resubmittal Received ACA
//Record Types:	​PublicWorks / * / * / * 
//
//Event: 		DUA
//
//Desc:			Design a script to take ACA applicant document resubmittal
// 				Action button from "Returned to Applicant"  and "Incomplete
//				to Applicant" tasks back to next City task (various).  
//
//Assumptions:	Immaterial whether ACA or Civic Platform
//				
//
//Psuedo Code:	
// 				use Document Update Notification template created by Eric K

//				if wftask = "Returned to Applicant" or "Incomplete to Applicant"
//				  then  activateTask(City task)
//
//Created By: Silver Lining Solutions / City of SB - Adam Nares
//********************************************************************************************************
// Change Log
//         		Date		Name			Modification
//				08/22/2018	Adam Nares		Initial Development
//				08/31/2018  Adam Nares		Added taskStatus to get only if "Returned to Applicant" 
//********************************************************************************************************
*/
logDebug("*******Script 19 to Applicant - Resubmittal Received ACA********");

// This function gets the two tasks "Returned to Applicant" and "Incomplete to Applicant"
//function getTask (taskName)
//{
	var taskName = "Returned to Applicant";
	activateTask(taskName);
// gets task status .. don't want this to run if null or resub already received
	var taskSts = taskStatus(taskName);

	if (taskSts == "Returned to Applicant")
	{
		var RSRd = "Re-Submittal Received"; //task status
		//updateTask(taskName,RSRd,"auto updated by script","auto updated by script");
		closeTask(taskName,RSRd);
	}
logDebug("***Script 19 - End***");
//}

//getTask("Returned to Applicant");
//getTask("Incomplete to Applicant");
