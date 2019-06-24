//********************************************************************************************************
//Script 		SendDataTicketAppealsRequestUploadedEmail 
//Record Types:	Enforcement/*/*/*
//
//Event: 		this script may be triggered from DocumentUploadAfter.
//
//Desc:			When a user uploads a document that has "APPEAL REQUEST" in its name, send 
//				dataticket.com an email notification and attach the new uploaded file.
//
//Created By: Silver Lining Solutions 
//********************************************************************************************************
// Change Log
//				Date		Name			Modification
//				06/24/2019	Chad			Original Development
//				06/24/2019	Chad			Added to email lookup
//********************************************************************************************************
function SendDataTicketAppealsRequestUploadedEmail()
{
	var toEmail = lookup("APPEALS_REQUEST_UPLOADED_EMAIL", "EMAIL_TO");

	var fromEmail = scriptAgencyEmailFrom;
//	var fromEmail = 'AccelaDev@santabarbaraca.gov';
	var ccEmail = "";
	var notificationTemplate = "APPEAL REQUEST UPLOADED";
	var reportFile = [];  // empty set for the file list
	var capID4Email = aa.cap.createCapIDScriptModel(capId.getID1(),capId.getID2(),capId.getID3());
	var emailParameters = aa.util.newHashtable();
	var staff = null;
	var lAltId = cap.getCapModel().getAltID();
	var lRecAlias = cap.getCapType().getAlias();

//	toEmail += " admincites@dataticket.com   ROLL THIS WHEN YOU ARE READY TO ACTUALL TEST
//	toEmail += "cweiffenbach@santabarbaraca.gov";
	

	//	spec says no aca as of 6-11-19
	//	var acaSite = lookup("ACA_CONFIGS", "OFFICIAL_WEBSITE_URL");
	//	addParameter(emailParameters,"$$acaUrl$$",acaSite);


	// identify the doc(s) that were just uploaded and for each doc, send a notification
	//chad add this line back when you are ready to roll
	//	var docArray = documentModelArray.toArray();
	// fake it out here
	docArray = documentModelArray.toArray();
	var err = 0;

	var documentModel = null;
	var fileName = null;

	// find the doc uploaded that has 'Appeal Request%' in the doc name 
	// - talk to biz about this, might be better to have docd type
	logDebug("document model array length is :"+docArray.length);
	for (i = 0; i < docArray.length; i++) {
		documentModel = docArray[i];
		var iDocFileName = documentModel.getDocName();
		iDocFileName = iDocFileName.toUpperCase();
		
		if (iDocFileName.indexOf("APPEAL REQUEST") >= 0 ) {  // FOUND IT!
		
			var iDocCustomID	= lAltId;
			var iDocEntityID	= documentModel.getEntityID();
			var iDocEntityType	= documentModel.getEntityType();
			var iDocCat			= documentModel.getDocCategory();
			var iDocGroup		= documentModel.getDocGroup();
			var iDocType		= documentModel.getDocType();
			var iDocID			= documentModel.getDocumentNo();
			var iDocFileKey		= documentModel.getFileKey();
			var iDocFileName	= documentModel.getFileName();
			var iDocFileSize	= documentModel.getFileSize();
			var iDocUploadedBy	= documentModel.getFileUpLoadBy();
			var iDocUploadDate	= documentModel.getFileUpLoadDate();
			var iDocSource		= documentModel.getSource();

			var iDocFileName2 = encodeURI(iDocFileName);
			logDebug("doc name is:"+iDocFileName);
			logDebug("doc name uri:"+iDocFileName2);

			// prepare Notification parameters
			addParameter(emailParameters, "$$altID$$", lAltId);
			addParameter(emailParameters, "$$recordAlias$$", lRecAlias);
			addParameter(emailParameters, "$$docNo$$", iDocID);
			addParameter(emailParameters, "$$docType$$", iDocType);
			addParameter(emailParameters, "$$docGroup$$", iDocGroup);
			addParameter(emailParameters, "$$docFileName$$", iDocFileName);
			addParameter(emailParameters, "$$docName$$", iDocFileName);
			addParameter(emailParameters, "$$docCategory$$", iDocCat);
			addParameter(emailParameters, "$$docUploadBy$$", iDocUploadedBy);
			addParameter(emailParameters, "$$docUploadDate$$", iDocUploadDate);


			var iFilePathResult = aa.document.downloadFile2Disk(documentModel, documentModel.getModuleName(),"","",true);
			if(iFilePathResult.getSuccess())
			{
				var iFilePath = iFilePathResult.getOutput();
				logDebug("the file path is :"+iFilePath);
				reportFile.push(iFilePath);
				var sendResult = sendNotification(fromEmail,toEmail,ccEmail,notificationTemplate,emailParameters,reportFile,capID4Email);
				if (!sendResult) 
					{ logDebug("UNABLE TO SEND NOTICE!  ERROR: "+sendResult); }
				else
					{ logDebug("Sent Notification"); }  
			}
		}
	}
}
