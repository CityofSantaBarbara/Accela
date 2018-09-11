//**************************************************************************
//Function		getRecordAssignedStaffEmail
//Desc:			return the staff email for the staff that has been
// 				assigned to the record or null if does not exist.
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

function getRecordAssignedStaffEmail() 
{
	var cdScriptObjResult = aa.cap.getCapDetail(capId);
	if (!cdScriptObjResult.getSuccess()) {
		logDebug("**ERROR: No cap detail script object : " + cdScriptObjResult.getErrorMessage());
        return ""
	}
	var cdScriptObj = cdScriptObjResult.getOutput();
	if (!cdScriptObj) {
		logDebug("**ERROR: No cap detail script object");
		return ""
	}
	var cd = cdScriptObj.getCapDetailModel();
    var	userId=cd.getAsgnStaff();
    if (userId==null) return "";
	var iNameResult = aa.person.getUser(userId);
	var iName = iNameResult.getOutput();
	var email=iName.getEmail();
	return email;
}