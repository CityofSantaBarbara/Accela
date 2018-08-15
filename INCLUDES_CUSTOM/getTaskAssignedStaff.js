//**************************************************************************
//Function		getTaskAssignedStaff
//Desc:			given a workflow task, return the staff object that has been
// 				assigned to the task.
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
//				08/15/2018	Eric 			Initial Development
//********************************************************************************************************

function getTaskAssignedStaff(wfstr) // optional process name
{
	logDebug("function getTaskAssignedStaff - Begin");

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

			logDebug("function getTaskAssignedStaff - End");
			return(staffObj);
		}
	}
}