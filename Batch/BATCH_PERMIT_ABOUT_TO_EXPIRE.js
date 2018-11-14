// ********************************************************************************************************
// Script 		BATCH_PERMIT_ABOUT_TO_EXPIRE.js
//			script # 12
//
// Record Types: BLD
//
// Event: 	Batch will run every 30 days on the first day of the month
//
// Desc:	City would like to send notifications for applications that are set to expire records.
//
//	Assumptions:  Assumes that expiration status will be null or active
//
//	Psuedo Code:
//					look up records that have expDate between today and today plus X days
//					change expire status to 'about to expire' (users can re-set to 'Active')
//					email applicant if email exists using template specified
//
// Created By: Silver Lining Solutions
// ********************************************************************************************************
// Change Log
//				Date		Name		Modification
//				08-22-2018	Chad		Initial Draft
//				11-02-2018	Chad		Changed FROM email
// ********************************************************************************************************


// testing parameters, uncomment to use in script test
/*
aa.env.setValue("showDebug","Y");
aa.env.setValue("fromDate","");
aa.env.setValue("toDate","");
aa.env.setValue("lookAheadDays","0"); 
aa.env.setValue("daySpan", "30"); 
aa.env.setValue("appGroup","Building");
aa.env.setValue("appTypeType","*");
aa.env.setValue("appSubtype","*");
aa.env.setValue("appCategory","*");
aa.env.setValue("expirationStatus","Active");  				
aa.env.setValue("newExpirationStatus","About To Expire");	
aa.env.setValue("newApplicationStatus","");					
aa.env.setValue("gracePeriodDays","0");						
aa.env.setValue("setPrefix","");							
aa.env.setValue("inspSched","");									
aa.env.setValue("skipAppStatus","Void,Withdrawn,Inactive");			
aa.env.setValue("emailAddress","chad@esilverliningsolutions.com");  
aa.env.setValue("sendEmailToContactTypes","Applicant");				
aa.env.setValue("emailTemplate","PERMIT_ABOUT_TO_EXPIRE");			
*/
// below are not used in this script...keep for examples 
//aa.env.setValue("deactivateLicense","N");							
//aa.env.setValue("lockParentLicense","N");							
//aa.env.setValue("createTempRenewalRecord","N");						
//aa.env.setValue("feeSched","");
//aa.env.setValue("feeList","");
//aa.env.setValue("feePeriod","");

/*------------------------------------------------------------------------------------------------------/
|
| START: USER CONFIGURABLE PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
emailText = "";
message = "";
br = "<br>";
useAppSpecificGroupName = false;
aa.env.setValue("CurrentUserID","ADMIN");
var currentUserID = "ADMIN"
/*------------------------------------------------------------------------------------------------------/
| BEGIN Includes
/------------------------------------------------------------------------------------------------------*/
SCRIPT_VERSION = 3.0;

eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
eval(getScriptText("INCLUDES_BATCH"));
eval(getScriptText("INCLUDES_CUSTOM"));

function getScriptText(vScriptName) {
	vScriptName = vScriptName.toUpperCase();
	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
	return emseScript.getScriptText() + "";
}

/*------------------------------------------------------------------------------------------------------/
|
| END: USER CONFIGURABLE PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
showDebug = true;
if (String(aa.env.getValue("showDebug")).length > 0) {
	showDebug = aa.env.getValue("showDebug").substring(0, 1).toUpperCase().equals("Y");
}

sysDate = aa.date.getCurrentDate();
batchJobResult = aa.batchJob.getJobID();
batchJobName = "" + aa.env.getValue("BatchJobName");
batchJobID = 0;
if (batchJobResult.getSuccess()) {
	batchJobID = batchJobResult.getOutput();
	logDebug("Batch Job " + batchJobName + " Job ID is " + batchJobID);
} else {
	logDebug("Batch job ID not found " + batchJobResult.getErrorMessage());
}

/*----------------------------------------------------------------------------------------------------/
|
| Start: BATCH PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
var fromDate = getParam("fromDate"); // Hardcoded dates.   Use for testing only
var toDate = getParam("toDate"); // Hardcoded dates.  Use for testing only
var dFromDate = aa.date.parseDate(fromDate); //dateformat
var dToDate = aa.date.parseDate(toDate); //dateformat
var lookAheadDays = aa.env.getValue("lookAheadDays"); // Number of days from today
var daySpan = aa.env.getValue("daySpan"); // Days to search (6 if run weekly, 0 if daily, etc.)
var appGroup = getParam("appGroup"); //   app Group to process {Licenses}
var appTypeType = getParam("appTypeType"); //   app type to process {Rental License}
var appSubtype = getParam("appSubtype"); //   app subtype to process {NA}
var appCategory = getParam("appCategory"); //   app category to process {NA}
var expStatus = getParam("expirationStatus"); //   test for this expiration status
var newExpStatus = getParam("newExpirationStatus"); //   update to this expiration status
var newAppStatus = getParam("newApplicationStatus"); //   update the CAP to this status
var gracePeriodDays = getParam("gracePeriodDays"); //	bump up expiration date by this many days
var setPrefix = getParam("setPrefix"); //   Prefix for set ID
var inspSched = getParam("inspSched"); //   Schedule Inspection
var skipAppStatusArray = getParam("skipAppStatus").split(","); //   Skip records with one of these application statuses
var emailAddress = getParam("emailAddress"); // email to send report
var sendEmailToContactTypes = getParam("sendEmailToContactTypes"); // send out emails?
var emailTemplate = getParam("emailTemplate"); // email Template

// below are not used, but good examples of what you might do with expire scripts

//var deactivateLicense = getParam("deactivateLicense"); // deactivate the LP
//var lockParentLicense = getParam("lockParentLicense"); // add this lock on the parent license
//var createRenewalRecord = getParam("createTempRenewalRecord"); // create a temporary record
//var feeSched = getParam("feeSched"); //what fee schedule to add fee from 
//var feeList = getParam("feeList"); // comma delimted list of fees to add
//var feePeriod = getParam("feePeriod"); // fee period to use {LICENSE}

/*----------------------------------------------------------------------------------------------------/
|
| End: BATCH PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
var startDate = new Date();
if (!fromDate.length) { // no "from" date, assume today 
	fromDate = dateAdd(null, parseInt(lookAheadDays))
}
if (!toDate.length) { // no "to" date, assume today + number of look ahead days + span
	toDate = dateAdd(null, parseInt(lookAheadDays) + parseInt(daySpan));
}
var mailFrom = lookup("SCRIPT_EMAIL_FROM", "AGENCY_FROM");
var acaSite = lookup("ACA_CONFIGS", "ACA_SITE");
acaSite = acaSite.substr(0, acaSite.toUpperCase().indexOf("/ADMIN"));

logDebug("Date Range -- fromDate: " + fromDate + ", toDate: " + toDate)

var startTime = startDate.getTime(); // Start timer
var systemUserObj = aa.person.getUser("ADMIN").getOutput();

appGroup = appGroup == "" ? "*" : appGroup;
appTypeType = appTypeType == "" ? "*" : appTypeType;
appSubtype = appSubtype == "" ? "*" : appSubtype;
appCategory = appCategory == "" ? "*" : appCategory;
var appType = appGroup + "/" + appTypeType + "/" + appSubtype + "/" + appCategory;

/*------------------------------------------------------------------------------------------------------/
| <===========Main=Loop================>
|
/-----------------------------------------------------------------------------------------------------*/
logDebug("Start of Job");

try {
	mainProcess();
} catch (err) {
	logDebug("ERROR: " + err.message + " In " + batchJobName + " Line " + err.lineNumber);
	logDebug("Stack: " + err.stack);
}

logDebug("End of Job: Elapsed Time : " + elapsed() + " Seconds");

if (emailAddress.length)
	aa.sendMail(mailFrom, emailAddress, "", batchJobName + " Results", emailText);

/*------------------------------------------------------------------------------------------------------/
| <===========END=Main=Loop================>
/-----------------------------------------------------------------------------------------------------*/

function mainProcess() {
logDebug("mainProcess START");
	var capFilterType = 0;
	var capFilterInactive = 0;
	var capFilterError = 0;
	var capFilterStatus = 0;
	var capDeactivated = 0;
	var capCount = 0;
	var setCode;
	var setName;

	// because there is no function to get non-licenses with a null expiration status 
	// you must insure that you have a ASA event script to set the expiration to 'Active' initially!
	
	
	
	var expResult = aa.expiration.getLicensesByDate(expStatus, fromDate, toDate);

	if (expResult.getSuccess()) {
		myExp = expResult.getOutput();
		logDebug("Processing " + myExp.length + " expiration records");
	} else {
		logDebug("ERROR: Getting Expirations, reason is: " + expResult.getErrorType() + ":" + expResult.getErrorMessage());
		return false;
	}
		// Create Set
		if (setPrefix != "" && capCount == 1) {
			var yy = startDate.getFullYear().toString().substr(2, 2);
			var mm = (startDate.getMonth() + 1).toString();
			if (mm.length < 2)
				mm = "0" + mm;
			var dd = startDate.getDate().toString();
			if (dd.length < 2)
				dd = "0" + dd;
			var hh = startDate.getHours().toString();
			if (hh.length < 2)
				hh = "0" + hh;
			var mi = startDate.getMinutes().toString();
			if (mi.length < 2)
				mi = "0" + mi;

			var setCode = setPrefix.substr(0, 5) + yy + mm + dd + hh + mi;

			setName = setPrefix + " : " + startDate.toLocaleString();
				var setCreateResult = aa.set.createSet(setCode, setName);

				if (setCreateResult.getSuccess()) {
					logDebug("Set ID " + setCode + " created for CAPs processed by this batch job.");
				} else {
					logDebug("ERROR: Unable to create new Set ID " + setCode + " created for CAPs processed by this batch job.");
				}
		}

	for (thisExp in myExp) // for each b1expiration (effectively, each license app)
	{
		b1Exp = myExp[thisExp];
		var expDate = b1Exp.getExpDate();
		if (expDate) {
			var b1ExpDate = expDate.getMonth() + "/" + expDate.getDayOfMonth() + "/" + expDate.getYear();
		}
		var b1Status = b1Exp.getExpStatus();
		var renewalCapId = null;

		capId = aa.cap.getCapID(b1Exp.getCapID().getID1(), b1Exp.getCapID().getID2(), b1Exp.getCapID().getID3()).getOutput();

		if (!capId) {
			logDebug("Could not get a Cap ID for " + b1Exp.getCapID().getID1() + "-" + b1Exp.getCapID().getID2() + "-" + b1Exp.getCapID().getID3());
			continue;
		}

		altId = capId.getCustomID();

		logDebug(altId + ": Renewal Status : " + b1Status + ", Expires on " + b1ExpDate);

		var capResult = aa.cap.getCap(capId);

		if (!capResult.getSuccess()) {
			logDebug(altId + ": Record is deactivated, skipping");
			capDeactivated++;
			continue;
		} else {
			var cap = capResult.getOutput();
		}

		var capStatus = cap.getCapStatus();

		appTypeResult = cap.getCapType(); //create CapTypeModel object
		appTypeString = appTypeResult.toString();
		appTypeArray = appTypeString.split("/");

		// Filter by CAP Type
		if (appType.length && !appMatch(appType)) {
			capFilterType++;
			logDebug(altId + ": Application Type does not match");
			continue;
		}

		// Filter by CAP Status
		if (exists(capStatus, skipAppStatusArray)) {
			capFilterStatus++;
			logDebug(altId + ": skipping due to application status of " + capStatus);
			continue;
		}

		capCount++;


		// Actions start here:

		var refLic = getRefLicenseProf(altId); // Load the reference License Professional

		if (refLic && deactivateLicense.substring(0, 1).toUpperCase().equals("Y")) {
			refLic.setAuditStatus("I");
			aa.licenseScript.editRefLicenseProf(refLic);
			logDebug(altId + ": deactivated linked License");
		}

		// update expiration status


		if (newExpStatus.length > 0) {
			b1Exp.setExpStatus(newExpStatus);
			aa.expiration.editB1Expiration(b1Exp.getB1Expiration());
			logDebug(altId + ": Update expiration status: " + newExpStatus);
		}

		// update expiration date based on interval

		if (parseInt(gracePeriodDays) != 0) {
			newExpDate = dateAdd(b1ExpDate, parseInt(gracePeriodDays));
			b1Exp.setExpDate(aa.date.parseDate(newExpDate));
			aa.expiration.editB1Expiration(b1Exp.getB1Expiration());

			logDebug(altId + ": updated CAP expiration to " + newExpDate);
			if (refLic) {
				refLic.setLicenseExpirationDate(aa.date.parseDate(newExpDate));
				aa.licenseScript.editRefLicenseProf(refLic);
				logDebug(altId + ": updated License expiration to " + newExpDate);
			}
		}
		// Add to Set

		if (setPrefix != "")
			aa.set.add(setName, capId);


		if (sendEmailToContactTypes.length > 0 && emailTemplate.length > 0) {

			var conTypeArray = sendEmailToContactTypes.split(",");
			var conArray = getContactArray(capId);

			for (thisCon in conArray) {
				conEmail = null;
				b3Contact = conArray[thisCon];
				if (exists(b3Contact["contactType"], conTypeArray)) {
					conEmail = b3Contact["email"];
				}
				else { continue; }

				if (conEmail) {
					emailParameters = aa.util.newHashtable();
					addParameter(emailParameters, "$$altid$$", altId);
					addParameter(emailParameters, "$$acaUrl$$", acaSite + getACAUrl());
					addParameter(emailParameters, "$$businessName$$", cap.getSpecialText());
					addParameter(emailParameters, "$$expirationDate$$", b1ExpDate);
					addParameter(emailParameters, "$$fullname$$", b3Contact["fullName"]);

					var capId4Email = aa.cap.createCapIDScriptModel(capId.getID1(), capId.getID2(), capId.getID3());

					var fileNames = [];

					var sendResult = aa.document.sendEmailAndSaveAsDocument(mailFrom, conEmail, "", emailTemplate, emailParameters, capId4Email, fileNames);
					if(sendResult.getSuccess()) {
						logDebug(altId + ": Sent Email template " + emailTemplate + " to " + b3Contact["fullName"] + " : " + b3Contact["contactType"] + " : " + conEmail);
					}
					else {
						logDebug("Failed to send mail. - " + sendResult.getErrorType());
					}
				}
				else {
					logDebug("Contact "+ b3Contact["fullName"]+" of type "+b3Contact["contactType"]+" does not have an email!");
				}
			}
		}

	} // for loop
	logDebug("Total CAPS qualified date range: " + myExp.length);
	logDebug("Ignored due to application type: " + capFilterType);
	logDebug("Ignored due to CAP Status: " + capFilterStatus);
	logDebug("Ignored due to Deactivated CAP: " + capDeactivated);
	logDebug("Total CAPS processed: " + capCount);

logDebug("mainProcess END");
}


function printObjProperties(obj){
    var idx;

    if(obj.getClass != null){
        logDebug("************* " + obj.getClass() + " *************");
    }
	else {
		logDebug("this is not an object with a class!");
	}

    for(idx in obj){
        if (typeof (obj[idx]) == "function") {
            try {
                logDebug(idx + "==>  " + obj[idx]());
            } catch (ex) { }
        } else {
            logDebug(idx + ":  " + obj[idx]);
        }
    }
}
