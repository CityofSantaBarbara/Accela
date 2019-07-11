//********************************************************************************************************
//Script 		copyRecordAssignedStaff
//Event: 		
//Desc:			helper function to copy record assigned staff value
//Created By: Silver Lining Solutions
//********************************************************************************************************
// Change Log
//         		Date        Name          Modification
//            07/10/2019	Chad          Created
//********************************************************************************************************
function copyRecordAssignedStaff(capIdFrom, capIdTo) {
	var cdScriptObjResult = aa.cap.getCapDetail(capIdFrom);
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
	
	if ( userId ) {	assignCap(userId,capIdTo); }
	else { logDebug("No assigned user to copy"); }
}