//********************************************************************************************************
//Script 		ACA_PBW_CHECK_FOR_ROW_CONFLICTS.js
//
//Record Types:	Publicworks
//
//Event: 		ACA PAGEFLOW
//
//Desc:			
//
//Created By: Silver Lining Solutions
//********************************************************************************************************
// Change Log
//            Date        Name			Modification
//            01-16-2019  Chad			Created
//            04-08-2020  Chad			removing me from cc of debug email
//********************************************************************************************************
/*------------------------------------------------------------------------------------------------------/
| START User Configurable Parameters
|
|     Only variables in the following section may be changed.  If any other section is modified, this
|     will no longer be considered a "Master" script and will not be supported in future releases.  If
|     changes are made, please add notes above.
/------------------------------------------------------------------------------------------------------*/
var showMessage = false; // Set to true to see results in popup window
var showDebug = false; // Set to true to see debug messages in popup window
var useAppSpecificGroupName = false; // Use Group name when populating App Specific Info Values
var useTaskSpecificGroupName = false; // Use Group name when populating Task Specific Info Values
var cancel = false;
var useCustomScriptFile = true; // if true, use Events->Custom Script, else use Events->Scripts->INCLUDES_CUSTOM
/*------------------------------------------------------------------------------------------------------/
| END User Configurable Parameters
/------------------------------------------------------------------------------------------------------*/
var startDate = new Date();
var startTime = startDate.getTime();
var message = ""; // Message String
var debug = ""; // Debug String
var br = "<BR>"; // Break Tag

var useSA = false;
var SA = null;
var SAScript = null;
var bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS", "SUPER_AGENCY_FOR_EMSE");
if (bzr.getSuccess() && bzr.getOutput().getAuditStatus() != "I") {
	useSA = true;
	SA = bzr.getOutput().getDescription();
	bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS", "SUPER_AGENCY_INCLUDE_SCRIPT");
	if (bzr.getSuccess()) {
		SAScript = bzr.getOutput().getDescription();
	}
}

if (SA) {
	eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", SA, useCustomScriptFile));
	eval(getScriptText(SAScript, SA));
} else {
	eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", null, useCustomScriptFile));
}

eval(getScriptText("INCLUDES_CUSTOM", null, useCustomScriptFile));

function getScriptText(vScriptName, servProvCode, useProductScripts) {
	if (!servProvCode)
		servProvCode = aa.getServiceProviderCode();
	vScriptName = vScriptName.toUpperCase();
	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	try {
		if (useProductScripts) {
			var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName);
		} else {
			var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
		}
		return emseScript.getScriptText() + "";
	} catch (err) {
		return "";
	}
}

var cap = aa.env.getValue("CapModel");
var capId = cap.getCapID();
var servProvCode = capId.getServiceProviderCode() // Service Provider Code
	var publicUser = false;
var currentUserID = aa.env.getValue("CurrentUserID");
var publicUserID = aa.env.getValue("CurrentUserID");
if (currentUserID.indexOf("PUBLICUSER") == 0) {
	currentUserID = "ADMIN";
	publicUser = true
} // ignore public users
var capIDString = capId.getCustomID(); // alternate cap id string
var systemUserObj = aa.person.getUser(currentUserID).getOutput(); // Current User Object
var appTypeResult = cap.getCapType();
var appTypeString = appTypeResult.toString(); // Convert application type to string ("Building/A/B/C")
var appTypeArray = appTypeString.split("/"); // Array of application type string
var currentUserGroup;
var currentUserGroupObj = aa.userright.getUserRight(appTypeArray[0], currentUserID).getOutput()
	if (currentUserGroupObj)
		currentUserGroup = currentUserGroupObj.getGroupName();
	var capName = cap.getSpecialText();
var capStatus = cap.getCapStatus();
var sysDate = aa.date.getCurrentDate();
var sysDateMMDDYYYY = dateFormatted(sysDate.getMonth(), sysDate.getDayOfMonth(), sysDate.getYear(), "");
var parcelArea = 0;

var estValue = 0;
var calcValue = 0;
var feeFactor // Init Valuations
var valobj = aa.finance.getContractorSuppliedValuation(capId, null).getOutput(); // Calculated valuation
if (valobj.length) {
	estValue = valobj[0].getEstimatedValue();
	calcValue = valobj[0].getCalculatedValue();
	feeFactor = valobj[0].getbValuatn().getFeeFactorFlag();
}

var balanceDue = 0;
var houseCount = 0;
feesInvoicedTotal = 0; // Init detail Data
var capDetail = "";
var capDetailObjResult = aa.cap.getCapDetail(capId); // Detail
if (capDetailObjResult.getSuccess()) {
	capDetail = capDetailObjResult.getOutput();
	var houseCount = capDetail.getHouseCount();
	var feesInvoicedTotal = capDetail.getTotalFee();
	var balanceDue = capDetail.getBalance();
}

var AInfo = new Array(); // Create array for tokenized variables
loadAppSpecific4ACA(AInfo); // Add AppSpecific Info
//loadTaskSpecific(AInfo);						// Add task specific info
//loadParcelAttributes(AInfo);						// Add parcel attributes
loadASITables();

emlText += "<br>" + "<B>EMSE Script Results for " + capIDString + "</B>";
emlText += "<br>" + "capId = " + capId.getClass();
emlText += "<br>" + "cap = " + cap.getClass();
emlText += "<br>" + "currentUserID = " + currentUserID;
emlText += "<br>" + "currentUserGroup = " + currentUserGroup;
emlText += "<br>" + "systemUserObj = " + systemUserObj.getClass();
emlText += "<br>" + "appTypeString = " + appTypeString;
emlText += "<br>" + "capName = " + capName;
emlText += "<br>" + "capStatus = " + capStatus;
emlText += "<br>" + "sysDate = " + sysDate.getClass();
emlText += "<br>" + "sysDateMMDDYYYY = " + sysDateMMDDYYYY;
emlText += "<br>" + "parcelArea = " + parcelArea;
emlText += "<br>" + "estValue = " + estValue;
emlText += "<br>" + "calcValue = " + calcValue;
emlText += "<br>" + "feeFactor = " + feeFactor;

emlText += "<br>" + "houseCount = " + houseCount;
emlText += "<br>" + "feesInvoicedTotal = " + feesInvoicedTotal;
emlText += "<br>" + "balanceDue = " + balanceDue;

var emlText = "";
function EMAIL_printObjProperties(obj){
	try {
		var idx;


		emlText += "<br>" + "**************** PRINTING "+obj+" ************************";
		emlText += "<br>" + "the type is:"+typeof obj;
		
		if(obj.getClass != null){
			emlText += "<br>" + "************* " + obj.getClass() + " *************";
		}
		else {
			emlText += "<br>" + "this is not an object with a class!";
		}


		for(idx in obj){
			try {
				if( obj[idx] != null) {
					if ((obj[idx]) && (typeof (obj[idx]) == "function")) {
						try {
							emlText += "<br>" + "FUNCTION: "+ idx + "==>  " + obj[idx]();
						} catch (ex) { }
					} 
					else if (obj[idx]) {
						emlText += "<br>" + "ATTRIBUTE: "+ idx + ":  " + obj[idx];
					}
					else emlText += "<br>" + "cannot print object and idx ref is null:"+idx;
				}
				else emlText += "<br>" + "the idx of this object is null!";
			}
			catch (err) {
				emlText += "<br>" + "ERROR Printing Object Properties for element ["+idx+"]:  >>"+err;
			}
		}
	}
	catch (err) {
		emlText += "<br>" + "ERROR IN EMAIL OBJECTS:  >>"+err;
	}
}

/*

var cap = aa.env.getValue("CapModel");
var capId = cap.getCapID();
var parentId = cap.getParentCapID();
var appTypeResult = cap.getCapType();
var appTypeString = appTypeResult.toString();           // Convert application type to string ("Building/A/B/C")
var appTypeArray = appTypeString.split("/");            // Array of application type string

*/
showMessage = true;
//showDebug = true;
// page flow custom code begin
try{
	emlText += "<br>" + "START ACA_PBW_CHECK_FOR_ROW_CONFLICTS";
	emlText += "<br>" + "the capId is:"+capId;
	emlText += "<br>" + "the cap is:"+cap;
	emlText += "<br>" + "the cap typeof is:"+typeof cap;

	checkPBWRightOfWayConflicts();
}
catch(err){
    //cancel = true;
    //showDebug = 3;
    logDebug("Error on custom pageflow ACA_PBW_CHECK_FOR_ROW_CONFLICTS. Err: " + err);
	emlText += "<br>" + "Error on custom pageflow ACA_PBW_CHECK_FOR_ROW_CONFLICTS. Err: " + err;
}


emlText += "<br>" + "END ACA_PBW_CHECK_FOR_ROW_CONFLICTS" + "<br>**************<br>"+ debug;
aa.sendMail("SBCityLDT@santabarbaraca.gov", "", "", "email from aca debug", emlText);
//cancel=true;
//comment(emlText);

// page flow custom code end

if (debug.indexOf("**ERROR") > 0) {
    aa.env.setValue("ErrorCode", "1");
	logDebug("set error code to 1 because there is error in message");
    aa.env.setValue("ErrorMessage", debug);
} else {
    if (cancel) {
		logDebug("cancel was true, setting err code to -2");
		aa.env.setValue("ErrorCode", "-2");
        if (showMessage)
            aa.env.setValue("ErrorMessage", message);
        if (showDebug)
            aa.env.setValue("ErrorMessage", debug);
    } else {
		logDebug("cancel was NOT true, setting err code to 0");
        aa.env.setValue("ErrorCode", "0");
        if (showMessage)
            aa.env.setValue("ErrorMessage", message);
        if (showDebug)
            aa.env.setValue("ErrorMessage", debug);
    }
}

