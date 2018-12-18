//********************************************************************************************************
//Script 		notification
//Record Types:	​*/*/*/*
//
//Event: 		WFTA
//
//Desc:			this script will provide the Agency with a 'configurable' strategy for sending 
//				emails to both internal users and contacts using the Notification templates
//
//				this function can be called from WTUA, ASA, IRSA, DUA
//				each of these calls must identify the calling triggerEvent as follows:
//				WTUA = "Workflow"
//				IRSA = "Inspection"
//				ASA	= "AppSubmit"
//				DUA = "Document"
//
//				A standard choice table (NOTIFICATION_RULES) will be used with entries as follows
//		
//		lookup Value							
//		AppType|Task|Status					
//		AppType|InspGroup|InspType|Status	
//		AppType|"Submitted"			
//
//		lookup Result
//		NotificationTemplate|<toList>|<ccList>
//
//				the NotificationTemplate will then be used in the call to send and attach the emailParameters
//				the <toList> and <ccList> information will provide the ability to customize the list of people
//				to be contacted and will be parsed as follows:
//
//		<toList> = person,person,person...
//		where person may be:	AppStaff,WFStaff,Owner,ContactType
//
//			AppStaff: the user assigned to the recordAlias$$
//			WFStaff:  the user assigned to the WF task (will only work fow WF)
//			Owner:  the APO Owner
//			ContactType:  from the list of Contacts the contact type's email will be applied
//						for example - Applicant, Agent, etc.
//
//
// EXAMPLES
//	*/*/*/*|Submitted		ApplicationSubmittalNotification|Applicant,Owner|AppStaff
//	Fire/*/*/|Application Submittal|Submitted		SubmittalNotification|Applicant|AppStaff
//
//
//Created By: Silver Lining Solutions 
//********************************************************************************************************
// Change Log
//         		Date		Name			Modification
//				9/212018	Eric			Original Development
//********************************************************************************************************
function notification(triggerEvent)
{
	logDebug("Script 89 Notification Automation - Begin");

	var fromEmail = "noreply@SantaBarbaraCA.gov";
	var toEmail = "";
	var ccEmail = "";
	var notificationTemplateName = "";
	var reportFile = [];  // empty set for the file list
	var capID4Email = aa.cap.createCapIDScriptModel(capId.getID1(),capId.getID2(),capId.getID3());
	var emailParameters = aa.util.newHashtable();
	var staff = null;
	var lookupTable = "NOTIFICATION_RULES";
	var lookupResult = null;
	var lookupValue = null;

	showMessage = true;
	logDebug("notification - Begin");
	logDebug("controlString = " + controlString);
	logDebug("triggerEvent = " + triggerEvent);
		
	emailParameters = notificationParamBuild(emailParameters);

	/* based on what triggered the notification lookup, set the proper
	lookup value */
	if (triggerEvent == "Workflow")	{
		lookupValue = wfTask + "|" + wfStatus;
		emailParameters = notificationParamWFBuild(emailParameters);
	}
	else if (triggerEvent == "Inspection") {
		lookupValue = inspGroup + "|" + inspType + "|" + inspResult;
		emailParameters = notificationParamInspBuild(emailParameters);
	}
	else if (triggerEvent == "AppSubmit") {
		lookupValue = inspGroup + "|" + inspType + "|" + inspResult;
		emailParameters = notificationParamAppBuild(emailParameters);
	}
		
	var lookupResult = appTypePriorityLookup(lookupTable,lookupValue,appTypeString);
	logDebug("lookupResult: " + lookupResult);
	if (lookupResult)
	{
		var lookupResultArray = lookupResult.split("|");
		notificationTemplateName = lookupResultArray[0];
		var toEmailList=lookupResultArray[1];
		var ccEmailList=lookupResultArray[2];
		
		ccEmail = notificationDistributionBuild(ccEmailList);
		toEmail = notificationDistributionBuild(toEmailList);
	
	// send Notification
		var sendResult = sendNotification(fromEmail,toEmail,ccEmail,notificationTemplateName,emailParameters,reportFile,capID4Email);
		if (!sendResult) 
			{ logDebug("UNABLE TO SEND NOTICE!  ERROR: "+sendResult); }
		else
			{ logDebug("Sent Notification"); }  
	}		
	
	logDebug("Script 89 Notification Automation - End");
}

function notificationParamBuild(emailParameters)
{
	addParameter(emailParameters, "$$altID$$", cap.getCapModel().getAltID());
	addParameter(emailParameters, "$$recordAlias$$", cap.getCapType().getAlias());

	return emailParameters;
}

function notificationParamAppBuild(emailParameters)
{
	return emailParameters;
}

function notificationParamInspBuild(emailParameters)
{
	return emailParameters;
}

function notificationParamWFBuild(emailParameters)
{
	return emailParameters;
}

function notificationDistributionBuild(emailList)
{
	var emailListArray = emailList.split(",");
	for (var i, i<=emailList.length,i++);
	{
		if (emailListArray[i] == "AppStaff")
		{
			var staff = getRecordAssignedStaffEmail();
			if (staff){toEmail += "; " + staff; logDebug("toEmail: " + toEmail);}
		}
		else if (emailListArray[i] == "WFStaff")
		{
			var staff = getTaskAssignedStaffEmail("Plans Distribution");
			if (staff){toEmail += "; " + staff; logDebug("toEmail: " + toEmail);}
		}
		else
		{
			var contactType = emailListArray[i];
			var capContactResult = aa.people.getCapContactByCapID(capId);
			if (capContactResult.getSuccess())
			{
				var Contacts = capContactResult.getOutput();
				for (yy in Contacts)
					if (contactType.equals(Contacts[yy].getCapContactModel().getPeople().getContactType()))
						if (Contacts[yy].getEmail() != null)
						{
							toEmail += ";" + Contacts[yy].getEmail();
							logDebug("toEmail: " + toEmail);
						}
			}
		}
	}

	return toEmail;
}
