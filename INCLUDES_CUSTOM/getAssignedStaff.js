//********************************************************************************************************
//Script 		getAssignedStaff
//
//Record Types:	function only
//
//Event: 		non 
//
//Desc:			Gets the Assigned Staff to a CapID 
//
//Created By: CW 8-30-2018
//********************************************************************************************************
// Change Log
//         		Date		Name			Modification
//				08-30-2018	Alec			Initial Draft
//********************************************************************************************************


function getAssignedStaff() {
                try {
                                var assignedStaff = "";
                                var cdScriptObjResult = aa.cap.getCapDetail(capId);
                                if (!cdScriptObjResult.getSuccess()) {
                                                aa.debug("**ERROR: No cap detail script object : ",
                                                                                cdScriptObjResult.getErrorMessage());
                                                return "";
                                }

                                var cdScriptObj = cdScriptObjResult.getOutput();
                                if (!cdScriptObj) {
                                                aa.debug("**ERROR: No cap detail script object", "");
                                                return "";
                                }
                                cd = cdScriptObj.getCapDetailModel();
                                assignedStaff = cd.getAsgnStaff();

                                return assignedStaff

                } catch (e) {
                                aa.debug("getAssignedStaff ", e);
                                return null;
                }
}
