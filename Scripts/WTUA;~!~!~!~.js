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
//				12/18/2018  Eric			Addition of the Notification Script
//              1/3/2019    Alec			Change to Corrections Required for status
//				02/19/2019	Eric			Per Amber request, Alec's changes were commented out
//********************************************************************************************************
logDebug("Script 89 Notification Automation - Begin");
notification("Workflow");
logDebug("Script 89 Notification Automation - End");

logDebug("************* workflow revisions required email ****************");
// ensure that we have an assigned staff that will be notified
//var staff = getTaskAssignedStaff("Plans Distribution");
//if (staff)
/*	commenting out the corrections notification.  Amber will now use script 89 functionality to do this

if (wfStatus == "Corrections Required" && wfTask == "Plans Coordination") {
		logDebug("Found revisions required");
		var contactType = "Applicant"
		var toEmail = "";
		var capContactResult = aa.people.getCapContactByCapID(capId);
		
		if (capContactResult.getSuccess())
			{
			var Contacts = capContactResult.getOutput();
			for (yy in Contacts)
				if (contactType.equals(Contacts[yy].getCapContactModel().getPeople().getContactType()))
					if (Contacts[yy].getEmail() != null)
						toEmail = "" + Contacts[yy].getEmail();


			if (toEmail.indexOf("@") > 0)
				{
				logDebug("Successfully sent email to " + contactType);
				var fromEmail = lookup("SCRIPT_EMAIL_FROM", "AGENCY_FROM");
				var ccEmail = ""; //blank for now
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
			else
				logDebug("Couldn't send email to " + contactType + ", no valid email address");
			} 
		}*/



		
	
