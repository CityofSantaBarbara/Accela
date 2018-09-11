//**************************************************************************
//Function		getTaskAssignedStaffEmail
//Desc:			given a workflow task, return the staff email for the staff that has been
// 				assigned to the task or null if does not exist.
//
//input:		wfstr: the workflow task name (string)
//				process name (string) [optional]
//
//returns:		people object 
//
//Created By: Silver Lining Solutions
//**************************************************************************
//********************************************************************************************************
// Change Log
//         		Date		Name			Modification
//				09/11/2018	Eric 			Initial Development
//********************************************************************************************************

function getTaskAssignedStaffEmail(wfstr) // optional process name
{
	logDebug("function getTaskAssignedStaff - Begin");
	
	var staffEmail = null;
	var useProcess = false;
	var processName = "";
	if (arguments.length == 2) {
		processName = arguments[1]; // subprocess
		useProcess = true;
	}

	var workflowResult = aa.workflow.getTaskItems(capId, wfstr, processName, null, null, null);
	
	if (workflowResult.getSuccess()) {
		var wfObj = workflowResult.getOutput();
	}
	else {
		aa.print("**ERROR: Failed to get workflow object: " + workflowResult.getErrorMessage());
		logDebug("function getTaskAssignedStaff - End");
		return false;
	}

	for (i in wfObj) {
		var fTask = wfObj[i];

		if (fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase()) && (!useProcess || fTask.getProcessCode().equals(processName))) 
		{
			var aStaff = fTask.getAssignedStaff();
			var staffObj = aa.person.getUser(aStaff.firstName, "", aStaff.lastName).getOutput(); 
			if (staffObj)
			{
				staffEmail = staffObj.getEmail();
				logDebug("StaffEmail: " + staffEmail);
				return staffEmail;
			}
			logDebug("function getTaskAssignedStaff - End");
			return staffEmail;			
		}
	}
}