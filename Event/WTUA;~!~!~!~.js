//********************************************************************************************************
//Script 		Email Staff on Document Update
//Record Types:	​BLD,FIR,PLN,PBW
//
//Event: 		WTUA
//
//Desc:			When Plans Coordination Workflow task has a status of "Revisions Required" Send email 
//              notification to Applicant. Need to get Verbiage for email from the City of Santa Barbara Staff
//
//Assumptions:
//				same notification for all record types 
//				
//
//Psuedo Code:	
// 				use Document Update Notification template
//
//Created By: Silver Lining Solutions 
//********************************************************************************************************
// Change Log
//         		Date		Name			Modification
//				08/15/2018	Eric 			Initial Development
//********************************************************************************************************
logDebug("************* workflow revisions required email ****************");
if (wfStatus == "Revisions Required" && wfTask == "Plans Coordination") {

logDebug("Found revisions required");

		var fromEmail = "noreply@SantaBarbaraCA.gov";
		var toEmail = staff.getEmail();
		var ccEmail = "anares@santabarbaraca.gov";
		var reportFile = [];  // empty set for the file list
		var capID4Email = aa.cap.createCapIDScriptModel(capId.getID1(),capId.getID2(),capId.getID3());
		var emailParameters = aa.util.newHashtable();
		var notificationTemplate = "WORKFLOW REVISIONS REQUIRED NOTICE";
	
		addParameter(emailParameters, "$$altID$$", cap.getCapModel().getAltID());
		addParameter(emailParameters, "$$recordAlias$$", cap.getCapType().getAlias());
		// send Notification
		var sendResult = sendNotification(fromEmail,toEmail,ccEmail,notificationTemplate,emailParameters,reportFile,capID4Email);
		if (!sendResult) 
			{ logDebug("UNABLE TO SEND NOTICE!  ERROR: "+sendResult); }
		else
			{ logDebug("Sent Notification"); }  

	
} 