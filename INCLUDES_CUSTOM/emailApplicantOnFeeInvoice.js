//********************************************************************************************************
//Script 		Email Applicant on Fee Invoice  ********* Script #27
//Record Types:	*/*/*/*
//
//Event: 		IFA
//
//Desc:			When a fee is invoiced let the Applicant know.
//
//Assumptions:
//				If an applicant does not have an email this script will return a warning to the User
//
//
//Created By: Silver Lining Solutions 
//********************************************************************************************************
// Change Log
//         		Date		Name		Modification
//			09/11/2018	Eric		orig
//			12/07/2018	Chad		took out "return null" when no staff found, send email anyway
//			02/12/2019	Chad		adding aca url to parameters for template - city can use this as example.
//			05/08/2020	Chad		new template, new parameters
//			06/01/2020	Chad		new requirement 05/27/2020 -check to see if the fee has been voided.  If so, do not send a notice!
//********************************************************************************************************
function emailApplicantOnFeeInvoice()
{
	logDebug("Script 27 Email Applicant on Fee Invoice - Begin");

	if (!publicUser) handleFeeInvoiceNotificationEmail();
	logDebug("Script 27 Email Applicant on Fee Invoice - End");
}

function getPayFeesACAUrl(){

	// returns the path to the record on ACA.  Needs to be appended to the site

	itemCap = capId;
	if (arguments.length == 1) itemCap = arguments[0]; // use cap ID specified in args
   	var acaUrl = "";
	var id1 = capId.getID1();
	var id2 = capId.getID2();
	var id3 = capId.getID3();
	var cap = aa.cap.getCap(capId).getOutput().getCapModel();

	acaUrl += "/urlrouting.ashx?type=1009";
	acaUrl += "&Module=" + cap.getModuleName();
	acaUrl += "&capID1=" + id1 + "&capID2=" + id2 + "&capID3=" + id3;
	acaUrl += "&agencyCode=" + aa.getServiceProviderCode();
	return acaUrl;
}

function handleFeeInvoiceNotificationEmail()
{
	var toEmail = "";
	var fromEmail = scriptAgencyEmailFrom;
	var ccEmail = "";
	var notificationTemplate = "INVOICED FEES";
	var reportFile = [];  // empty set for the file list
	var capID4Email = aa.cap.createCapIDScriptModel(capId.getID1(),capId.getID2(),capId.getID3());
	var emailParameters = aa.util.newHashtable();
	var staff = null;
	
	// prepare Notification parameters
	addParameter(emailParameters, "$$altID$$", cap.getCapModel().getAltID());
	addParameter(emailParameters, "$$recordAlias$$", cap.getCapType().getAlias());
	var acaSite = lookup("ACA_CONFIGS", "OFFICIAL_WEBSITE_URL");
	addParameter(emailParameters,"$$acaUrl$$",acaSite);
	var acaPayFeeUrl = acaSite + getPayFeesACAUrl();
	addParameter(emailParameters,"$$acaPayFeeUrl$$",acaPayFeeUrl);

	// fee invoice specific information: use these objects if you want to include fee info in email
	//	printObjProperties(FeeObjs); 
	//	printObjProperties(FeeObjs[0]);

	
	// ensure that we have an assigned staff that will be notified
/*	staff = getRecordAssignedStaffEmail();
	if (staff){ccEmail += "; " + staff; logDebug("ccEmail: " + ccEmail);}

	if (staff == "")
	{
		logDebug("No Staff identified for notification");
//		return null;
	}
*/
	// new requirement 05/27/2020
	// check to see if the fee has actually been voided.  If so, do not send a notice!


	var sendMsg = false;

	for (inv in InvoiceNbrArray) {
		thisInv = InvoiceNbrArray[inv];
		var myInvDataGet = aa.invoice.getFeeItemInvoiceByInvoiceNbr(thisInv);
		if (myInvDataGet.getSuccess() && myInvDataGet.getOutput()) {
			var myInvDataArr = myInvDataGet.getOutput();
			for (invFee in myInvDataArr) {
				var thisFeeStatus = myInvDataArr[invFee].getFeeitemStatus();
				if ( thisFeeStatus == 'INVOICED' ) {
					sendMsg = true;
				}
			}
		}
	}

	if (sendMsg) {
		// get the Applicant email
		var applicant = null;
		var contactType = "Applicant"
		var capContactResult = aa.people.getCapContactByCapID(capId);
		if (capContactResult.getSuccess())
		{
			var Contacts = capContactResult.getOutput();
			for (yy in Contacts)
			{
				if (contactType.equals(Contacts[yy].getCapContactModel().getPeople().getContactType()))
				{
					if (Contacts[yy].getEmail() != null)
					{
						toEmail = "" + Contacts[yy].getEmail();
						var conName = Contacts[yy].getCapContactModel().getPeople().getFullName();
						if (!conName) conName = "";
						addParameter(emailParameters, "$$ApplicantName$$", conName);
						// send Notification
						var sendResult = sendNotification(fromEmail,toEmail,ccEmail,notificationTemplate,emailParameters,reportFile,capID4Email);
						if (!sendResult) { logDebug("handleFeeInvoiceNotificationEmail:UNABLE TO SEND NOTICE!  ERROR: "+ sendResult); }
						else { logDebug("handleFeeInvoiceNotificationEmail:Sent Notification"); }  
					}
				}
			}
		}
	}
	else { logDebug("handleFeeInvoiceNotificationEmail: No Message send because no new Invoices where invoiced!"); }
}

function emailContact(mSubj,mText)   // optional: Contact Type, default Applicant
	{
	var replyTo = scriptAgencyEmailFrom;
	var contactType = "Applicant"
	var emailAddress = "";

	if (arguments.length == 3) contactType = arguments[2]; // use contact type specified

	var capContactResult = aa.people.getCapContactByCapID(capId);
	if (capContactResult.getSuccess())
		{
		var Contacts = capContactResult.getOutput();
		for (yy in Contacts)
			if (contactType.equals(Contacts[yy].getCapContactModel().getPeople().getContactType()))
				if (Contacts[yy].getEmail() != null)
					emailAddress = "" + Contacts[yy].getEmail();
		}

	if (emailAddress.indexOf("@") > 0)
		{
		aa.sendMail(replyTo, emailAddress, "", mSubj, mText);
		logDebug("Successfully sent email to " + contactType);
		}
	else
		logDebug("Couldn't send email to " + contactType + ", no valid email address");
	} 
// **** script # 27
