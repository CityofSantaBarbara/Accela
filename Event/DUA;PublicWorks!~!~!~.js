//********************************************************************************************************
//Script 		Returned to Applicant - Resubmittal Received ACA
//Record Types:	​PBW / * / * / * 
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
//				08/22/2018	Adam Nares			Initial Development
//********************************************************************************************************
logDebug(" to Applicant - Resubmittal Received ACA");
function getTask (taskName)
{
	
activateTask(taskName);
updateTask(taskName,"Revisions Received","auto updated by script","auto updated by script");

//************ ensure that we have an assigned staff that will be notified
 var staff = getTaskAssignedStaff("Plans Distribution");
 var comment = " plans have been updated";
/* if (staff)
{
	
	logDebug("**************** staff = " + staff + "*****************************");
	printObjProperties(staff);

	// ************** prepare Notification parameters
	var fromEmail = "noreply@SantaBarbaraCA.gov";
	var toEmail = staff.getEmail();
	var ccEmail = "eric@esilverliningsolutions.com";
	var notificationTemplate = "DOCUMENT UPDATE";
	var reportFile = [];  // empty set for the file list
	var capID4Email = aa.cap.createCapIDScriptModel(capId.getID1(),capId.getID2(),capId.getID3());
	var emailParameters = aa.util.newHashtable();

	addParameter(emailParameters, "$$altID$$", cap.getCapModel().getAltID());
	addParameter(emailParameters, "$$recordAlias$$", cap.getCapType().getAlias());


	// *************** identify the doc(s) that were just uploaded and for each doc, 
	var docArray = documentModelArray.toArray();
	var err = 0;

	var documentModel = null;
	var fileName = null;

	for (i = 0; i < docArray.length; i++) {
		documentModel = docArray[i];
		logDebug("************* doc Model ****************");
		printObjProperties(documentModel);
		addParameter(emailParameters, "$$docNo$$", documentModel.getDocumentNo());
		addParameter(emailParameters, "$$docType$$", documentModel.getDocType());
		addParameter(emailParameters, "$$docGroup$$", documentModel.getDocGroup());
		addParameter(emailParameters, "$$docFileName$$", documentModel.getFileName());
		addParameter(emailParameters, "$$docName$$", documentModel.getDocName());
		addParameter(emailParameters, "$$docCategory$$", documentModel.getDocCategory());
		addParameter(emailParameters, "$$docUploadBy$$", documentModel.getFileUpLoadBy());
		addParameter(emailParameters, "$$docUploadDate$$", documentModel.getFileUpLoadDate());
		addParameter(emailParameters, "$$staffTitle$$", staff.getTitle());


		// *******************send Notification********************
		//var sendResult = sendNotification(fromEmail,toEmail,ccEmail,notificationTemplate,emailParameters,reportFile,capID4Email);
		//if (!sendResult) 
			//{ logDebug("UNABLE TO SEND NOTICE!  ERROR: "+sendResult); }
		//else
			//{ logDebug("Sent Notification"); }  

	}
} */
// Close task to	
closeTask(taskName);

}

getTask("Plans Distribution");
getTask("Initial Review for Completeness");
logDebug("Script 19 - End");