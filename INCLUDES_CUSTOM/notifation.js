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

	var fromEmail = lookup("SCRIPT_EMAIL_FROM","AGENCY_FROM");
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
		
	
	logDebug("notification - End");
}
