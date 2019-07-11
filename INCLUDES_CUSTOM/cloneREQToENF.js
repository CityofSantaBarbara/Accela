//********************************************************************************************************
//Script 		cloneREQToENF 
//Record Types:	​Enforcement/*/*/*
//
//Event: 		this script may be triggered from WorkflowTaskUpdateAfter.
//
//Desc:			When wfStatus = 'ENF Record Needed'  and wfTask = 'Request Received' create a case record 
//
//Created By: Silver Lining Solutions 
//********************************************************************************************************
// Change Log
//				Date		Name			Modification
//				06/24/2018	Chad			Original Development
//********************************************************************************************************
function cloneREQToENF()
{
	logDebug("about to clone ENF if wf is correct!");
	logDebug("wfstatus:"+wfStatus);
	logDebug("wfTask:"+wfTask)
			
	if ( wfStatus == "ENF Record Needed" && wfTask == "Request Status") {
		var newCaseID = createChild('Enforcement','Incident','Case','NA',capName);
		logDebug("new case:"+newCaseID);
		var newCaseIDGetCapResult = aa.cap.getCap(newCaseID);
		if (newCaseIDGetCapResult.getSuccess()) {
			var newCaseIDCap = newCaseIDGetCapResult.getOutput();
			var newCaseIDCapModel = newCaseIDCap.getCapModel();
			var dFileDateJava = convertDate(fileDate);
			newCaseIDCapModel.setFileDate(dFileDateJava);
			
			// owners are not copying correctly, so force it here
			copyOwner(capId, newCaseID);
// contacts are copying on create
//			copyContacts(capId, newCaseID);
			copyLicensedProf(capId, newCaseID);
/*cust*/	copyCapGISObjects(capId, newCaseID);
/*cust*/	copyAppSpecificInfo(capId, newCaseID);
			copyASITables(capId, newCaseID);
// copy the documents, yeah this a licencing function but it works!
			aa.cap.copyRenewCapDocument(capId, newCaseID,currentUserID);

			copyRecordAssignedStaff(capId, newCaseID);
			updateWorkDesc(workDescGet(capId),newCaseID);
		}
	}
}
