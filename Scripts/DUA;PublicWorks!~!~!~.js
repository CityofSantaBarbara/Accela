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
//				  then  closeTask(City task)
//
//Created By: Silver Lining Solutions / City of SB - Adam Nares
//********************************************************************************************************
// Change Log
//         		Date		Name			Modification
//				08/22/2018	Adam Nares		Initial Development
//				08/31/2018  Adam Nares		Added taskStatus to get only if "Returned to Applicant" 
//				09/17/2018  Adam Nares		closing task with "Re-Submittal Received"
//				09/17/2018 	Adam Nares		Added "Incomplete to Applicant" task 
//				09/18/2018 	Adam Nares		Using isTaskStatus function
//********************************************************************************************************
*/
logDebug("*******Script 19 to Applicant - Resubmittal Received ACA********");

	var taskName = "Returned to Applicant";
	var taskSts = "Returned to Applicant";
	var taskName2 = "Incomplete to Applicant"; 
	var taskSts2 = "Incomplete to Applicant";
	var RSRd = "Re-Submittal received"; //task status
	
	if (isTaskActive(taskName) == true) // checks to see if "Returned to Applicant" is active
	{
	
		if (isTaskStatus(taskName,taskSts) == true) // checks to see if "Returned to Applicant" is active
		{
			closeTask(taskName,RSRd,"auto updated by script","auto updated by script"); //closes task and goes to next task in workflow
		}
	}
	if (isTaskActive(taskName2) == true) //checks to see if "Incomplete to Applicant" is active
	{
		if (isTaskStatus(taskName2,taskSts2) == true) // checks to see if "Incomplete to Applicant" is active
		{
			closeTask(taskName2,RSRd,"auto updated by script","auto updated by script"); //closes task and goes to next task in workflow
		}
	}	
	
logDebug("***Script 19 - End***");