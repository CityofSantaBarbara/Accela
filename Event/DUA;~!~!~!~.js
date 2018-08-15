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
//********************************************************************************************************
logDebug("Script 31 Email Staff on Document Update - Begin");

activateTask("Plans Distribution");
taskStatus("Plans Distribution","Revisions Received");

// prepare Notification parameters
var staff = getTaskAssignedStaff("Plans Distribution");
logDebug("staff = " + typeof(staff) + "   " + staff);
var fromEmail = "noreply@SantaBarbaraCA.gov";
var toEmail = staff.getEmail();
var ccEmail = "eric@esilverliningsolutions.com";
var notificationTemplate = "DOCUMENT UPDATE";
var reportFile = [];  // empty set for the file list
var capID4Email = aa.cap.createCapIDScriptModel(capId.getID1(),capId.getID2(),capId.getID3());
var emailParameters = aa.util.newHashtable();

addParameter(emailParameters, "$$altID$$", cap.getCapModel().getAltID());
addParameter(emailParameters, "$$recordAlias$$", cap.getCapType().getAlias());

logDebug("documentModelArray = " + typeof(documentModelArray) + "   " + documentModelArray.length + "    " + documentModelArray);
logDebug("dMA.docName = " + documentModelArray.docName);
logDebug("dma.docName = " + documentModelArray["docName"]);
//logDebug("dma.dName = " + documentModelArray[0].["docName"]); syntax err
//logDebug("dma.dName = " + documentModelArray.[0].["docName"]); syntax err
//logDebug("dma.dName = " + documentModelArray[0].[docName]); syntax err
// var docOne = documentModelArray[0];
// logDebug("docOne" + docOne);
logDebug("************* documentModelArray ****************");
printObjProperties(documentModelArray);
logDebug("dMA size = " + documentModelArray.size);

var docArray = documentModelArray.toArray();
logDebug("************* docArray ****************");
printObjProperties(docArray);

var da = docArray.getOutput();
logDebug("************* da ****************");
printObjProperties(da);

// var doc = documentModelArray.getOutput();
// printObjProperties(doc);


// send Notification
var sendResult = sendNotification(fromEmail,toEmail,ccEmail,notificationTemplate,emailParameters,reportFile,capID4Email);
if (!sendResult) 
	{ logDebug("UNABLE TO SEND NOTICE!  ERROR: "+sendResult); }
else
	{ logDebug("Sent Notification"); }  

logDebug("Script 31 Email Staff on Document Update - End");
