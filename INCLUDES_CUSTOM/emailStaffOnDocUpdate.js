//********************************************************************************************************
//Script 		Email Staff on Document Update
//Record Types:	​*/*/*/*
//
//Event: 		DUA
//
//Desc:			When a Revision Required Document gets resubmitted thru ACA. Email the Santa Barbara Staff 
// 				that is assigned to the Plan Distributed Workflow Task. Also set the Workflow Task Plans 
//				Distribution Status to Revisions Received.
//
//Assumptions:
//				Staff must always be assigned to Plans Distribution 
//				Staff must have a valid email defined in their User Profile
//
//Psuedo Code:	
// 				use Document Update Notification template
//
//Created By: Silver Lining Solutions 
//********************************************************************************************************
// Change Log
//         		Date		Name			Modification
//				08/15/2018	Eric 			Initial Development
//				09/11/2018	Eric			moved this code to incl custom and made mods to include all 
//											dept bus rules
//********************************************************************************************************
function emailStaffOnDocUpdate()
{
	logDebug("Script 31 Email Staff on Document Update - Begin");
/*
	activateTask("Plans Distribution");
	updateTask("Plans Distribution","Revisions Received","auto updated by script","auto updated by script");
*/
	handleNotificationEmail();

	logDebug("Script 31 Email Staff on Document Update - End");
}

function handleNotificationEmail()
{
	var toEmail = "";
	var fromEmail = "noreply@SantaBarbaraCA.gov";
	var ccEmail = "eric@esilverliningsolutions.com";
	var notificationTemplate = "DOCUMENT UPDATE";
	var reportFile = [];  // empty set for the file list
	var capID4Email = aa.cap.createCapIDScriptModel(capId.getID1(),capId.getID2(),capId.getID3());
	var emailParameters = aa.util.newHashtable();
	var staff = null;

	// ensure that we have an assigned staff that will be notified
	staff = getRecordAssignedStaffEmail();
	if (staff){toEmail += staff; logDebug("toEmail: " + toEmail);}
	staff = getTaskAssignedStaffEmail("Plans Distribution");
	if (staff){toEmail += staff; logDebug("toEmail: " + toEmail);}
	staff = getTaskAssignedStaffEmail("Application review");
	if (staff){toEmail += staff; logDebug("toEmail: " + toEmail);}
	staff = getTaskAssignedStaffEmail("Schedule and TTC Distribution");
	if (staff){toEmail += staff; logDebug("toEmail: " + toEmail);}
	staff = getTaskAssignedStaffEmail("Document Distribution");
	if (staff){toEmail += staff; logDebug("toEmail: " + toEmail);}
	staff = getTaskAssignedStaffEmail("Application Submittal");
	if (staff){toEmail += staff; logDebug("toEmail: " + toEmail);}
	staff = getTaskAssignedStaffEmail("ODLA Package Distribution");
	if (staff){toEmail += staff; logDebug("toEmail: " + toEmail);}
	staff = getTaskAssignedStaffEmail("Initial Application");
	if (staff){toEmail += staff; logDebug("toEmail: " + toEmail);}
	staff = getTaskAssignedStaffEmail("PreApp Assignment");
	if (staff){toEmail += staff; logDebug("toEmail: " + toEmail);}
	staff = getTaskAssignedStaffEmail("Sewer Lateral Inspection (SLIP) Video and Form submittal");
	if (staff){toEmail += staff; logDebug("toEmail: " + toEmail);}
	staff = getTaskAssignedStaffEmail("Map Review Distribution");
	if (staff){toEmail += staff; logDebug("toEmail: " + toEmail);}
	staff = getTaskAssignedStaffEmail("VLM Review Distribution");
	if (staff){toEmail += staff; logDebug("toEmail: " + toEmail);}
	staff = getTaskAssignedStaffEmail("Sewer Tap Application");
	if (staff){toEmail += staff; logDebug("toEmail: " + toEmail);}
	staff = getTaskAssignedStaffEmail("Sewer Service Abandonment Application");
	if (staff){toEmail += staff; logDebug("toEmail: " + toEmail);}
	staff = getTaskAssignedStaffEmail("Sewer Lateral installation/repair Permit request");
	if (staff){toEmail += staff; logDebug("toEmail: " + toEmail);}
	staff = getTaskAssignedStaffEmail("Routing Coordination");
	if (staff){toEmail += staff; logDebug("toEmail: " + toEmail);}
	staff = getTaskAssignedStaffEmail("Routing for Comments");
	if (staff){toEmail += staff; logDebug("toEmail: " + toEmail);}
	staff = getTaskAssignedStaffEmail("Routing Coordinator");
	if (staff){toEmail += staff; logDebug("toEmail: " + toEmail);}
	staff = getTaskAssignedStaffEmail("Route Resubmittal");
	if (staff){toEmail += staff; logDebug("toEmail: " + toEmail);}
	staff = getTaskAssignedStaffEmail("Initial Application Fees Paid");
	if (staff){toEmail += staff; logDebug("toEmail: " + toEmail);}

	if (staff != "")
	{
		logDebug("No Staff identified for notification");
		return null;
	}
	// prepare Notification parameters
	addParameter(emailParameters, "$$altID$$", cap.getCapModel().getAltID());
	addParameter(emailParameters, "$$recordAlias$$", cap.getCapType().getAlias());


	// identify the doc(s) that were just uploaded and for each doc, send a notification
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


		// send Notification
		var sendResult = sendNotification(fromEmail,toEmail,ccEmail,notificationTemplate,emailParameters,reportFile,capID4Email);
		if (!sendResult) 
			{ logDebug("UNABLE TO SEND NOTICE!  ERROR: "+sendResult); }
		else
			{ logDebug("Sent Notification"); }  

	}
	
}