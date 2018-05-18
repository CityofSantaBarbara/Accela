/*------------------------------------------------------------------------------------------------------/
| Program : LicProfAddAfter1.6.js
| Event   : LicProfAddAfter
|
| Usage   : Master Script by Accela.  See accompanying documentation and release notes.
|
| Client  : N/A
| Action# : N/A
|
| Notes   :
| 4/5/2010 KCT version remarked out the code causing the issue on line 126
| 4/25/2012 KCT Fixed CA URL to use aspx in place of asp
| 12/1-/2012  dlh concord fixed call to CSLB per Accela Update doc
|
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| START User Configurable Parameters
|
|     Only variables in the following section may be changed.  If any other section is modified, this
|     will no longer be considered a "Master" script and will not be supported in future releases.  If
|     changes are made, please add notes above.
/------------------------------------------------------------------------------------------------------*/
var showMessage = false;			// Set to true to see results in popup window
var showDebug = false;				// Set to true to see debug messages in popup window
var controlString = "LicProfAddAfter";
var preExecute = "PreExecuteForAfterEvents"
var documentOnly = false;			// Document Only -- displays hierarchy of std choice steps
var disableTokens = false;			// turn off tokenizing of App Specific and Parcel Attributes
var useAppSpecificGroupName = false;		// Use Group name when populating App Specific Info Values
var useTaskSpecificGroupName = false;		// Use Group name when populating Task Specific Info Values
var enableVariableBranching = false;					// Allows use of variable names in branching.  Branches are not followed in Doc Only
var maxEntries = 99;				// Maximum number of std choice entries.  Must be Left Zero Padded
/*------------------------------------------------------------------------------------------------------/
| END User Configurable Parameters
/------------------------------------------------------------------------------------------------------*/
var startDate = new Date();
var startTime = startDate.getTime();
var message =	"";							// Message String
var debug = "";								// Debug String
var br = "<BR>";							// Break Tag
var feeSeqList = new Array();						// invoicing fee list
var paymentPeriodList = new Array();					// invoicing pay periods

if (documentOnly) {
	doStandardChoiceActions(controlString,false,0);
	aa.env.setValue("ScriptReturnCode", "0");
	aa.env.setValue("ScriptReturnMessage", "Documentation Successful.  No actions executed.");
	aa.abortScript();
	}

capId= aa.env.getValue("CapIdModel")
var cap = aa.cap.getCap(capId).getOutput();				// Cap object
var servProvCode = capId.getServiceProviderCode()       		// Service Provider Code
var currentUserID = aa.env.getValue("CurrentUserID");   		// Current User
var capIDString = capId.getCustomID();					// alternate cap id string
var systemUserObj = aa.person.getUser(currentUserID).getOutput();  	// Current User Object
var appTypeResult = cap.getCapType();
var appTypeString = appTypeResult.toString();				// Convert application type to string ("Building/A/B/C")
var appTypeArray = appTypeString.split("/");				// Array of application type string
var currentUserGroup = null;

if(appTypeArray[0].substr(0,1) !="_") //Model Home Check
{
	var currentUserGroupObj = aa.userright.getUserRight(appTypeArray[0],currentUserID).getOutput()
	if (currentUserGroupObj) currentUserGroup = currentUserGroupObj.getGroupName();
}

var capName = cap.getSpecialText();
var capStatus = cap.getCapStatus();
var fileDateObj = cap.getFileDate();					// File Date scriptdatetime
var fileDate = "" + fileDateObj.getMonth() + "/" + fileDateObj.getDayOfMonth() + "/" + fileDateObj.getYear();
var fileDateYYYYMMDD = dateFormatted(fileDateObj.getMonth(),fileDateObj.getDayOfMonth(),fileDateObj.getYear(),"YYYY-MM-DD");
var sysDate = aa.date.getCurrentDate();
var sysDateMMDDYYYY = dateFormatted(sysDate.getMonth(),sysDate.getDayOfMonth(),sysDate.getYear(),"");
var parcelArea = 0;

var estValue = 0; var calcValue = 0; var feeFactor			// Init Valuations
var valobj = aa.finance.getContractorSuppliedValuation(capId,null).getOutput();	// Calculated valuation
if (valobj.length) {
	estValue = valobj[0].getEstimatedValue();
	calcValue = valobj[0].getCalculatedValue();
	feeFactor = valobj[0].getbValuatn().getFeeFactorFlag();
	}

var balanceDue = 0 ; var houseCount = 0; feesInvoicedTotal = 0;		// Init detail Data
var capDetail = "";
var capDetailObjResult = aa.cap.getCapDetail(capId);			// Detail
if (capDetailObjResult.getSuccess())
	{
	capDetail = capDetailObjResult.getOutput();
	var houseCount = capDetail.getHouseCount();
	var feesInvoicedTotal = capDetail.getTotalFee();
	var balanceDue = capDetail.getBalance();
	}

var AInfo = new Array();
//loadAppSpecific(AInfo); don't load, using updated values		// Add AppSpecific Info
loadTaskSpecific(AInfo);						// Add task specific info
loadParcelAttributes(AInfo);						// Add parcel attributes
loadASITables();


logDebug("<B>EMSE Script Results for " + capIDString + "</B>");
logDebug("capId = " + capId.getClass());
logDebug("cap = " + cap.getClass());
logDebug("currentUserID = " + currentUserID);
logDebug("currentUserGroup = " + currentUserGroup);
logDebug("systemUserObj = " + systemUserObj.getClass());
logDebug("appTypeString = " + appTypeString);
logDebug("capName = " + capName);
logDebug("capStatus = " + capStatus);
logDebug("fileDate = " + fileDate);
logDebug("fileDateYYYYMMDD = " + fileDateYYYYMMDD);
logDebug("sysDate = " + sysDate.getClass());
logDebug("parcelArea = " + parcelArea);
logDebug("estValue = " + estValue);
logDebug("calcValue = " + calcValue);
logDebug("feeFactor = " + feeFactor);

logDebug("houseCount = " + houseCount);
logDebug("feesInvoicedTotal = " + feesInvoicedTotal);
logDebug("balanceDue = " + balanceDue);

/*------------------------------------------------------------------------------------------------------/
| BEGIN Event Specific Variables
/------------------------------------------------------------------------------------------------------*/
// remarked out by KCT 4/5/2010
// var licenseList = aa.env.getValue("LicenseList").toArray();
// logDebug("licenseList = " + licenseList.getClass());
// for (i in licenseList)
//	logDebug("licenseList[" + i + "] = " + licenseList[i].getStateLicense());
var LicProfModel = aa.env.getValue("LicProfModel");
var LicProfAttribute = aa.env.getValue("LicProfAttribute");
var licNum = LicProfModel.getLicenseNbr();

/*------------------------------------------------------------------------------------------------------/
| END Event Specific Variables
/------------------------------------------------------------------------------------------------------*/

if (preExecute.length) doStandardChoiceActions(preExecute,true,0); 	// run Pre-execution code

logGlobals(AInfo);

/*------------------------------------------------------------------------------------------------------/
| <===========Main=Loop================>
|
/-----------------------------------------------------------------------------------------------------*/
//
//  Get the Standard choices entry we'll use for this App type
//  Then, get the action/criteria pairs for this app
//

doStandardChoiceActions(controlString,true,0);
//
// Check for invoicing of fees
//
if (feeSeqList.length)
	{
	invoiceResult = aa.finance.createInvoice(capId, feeSeqList, paymentPeriodList);
	if (invoiceResult.getSuccess())
		logMessage("Invoicing assessed fee items is successful.");
	else
		logMessage("**ERROR: Invoicing the fee items assessed to app # " + appId + " was not successful.  Reason: " +  invoiceResult.getErrorMessage());
	}

/*------------------------------------------------------------------------------------------------------/
| <===========END=Main=Loop================>
/-----------------------------------------------------------------------------------------------------*/

if (debug.indexOf("**ERROR") > 0)
	{
	aa.env.setValue("ScriptReturnCode", "1");
	aa.env.setValue("ScriptReturnMessage", debug);
	}
else
	{
	aa.env.setValue("ScriptReturnCode", "0");
	if (showMessage) aa.env.setValue("ScriptReturnMessage", message);
	if (showDebug) 	aa.env.setValue("ScriptReturnMessage", debug);
	}

/*------------------------------------------------------------------------------------------------------/
| <===========External Functions (used by Action entries)
/------------------------------------------------------------------------------------------------------*/
/*===================================================================
//Script Number:
//Script Name: California State License Board validation element
//Script Developer: Jason Jackson
//Script Agency: SLS
//Script Description: 
//Script Run Event: 
//Script Parents:
//         
===================================================================*/
function createRefLicProfFromLicProf()
	{
	//
	// Get the lic prof from the app
	//
	capLicenseResult = aa.licenseScript.getLicenseProf(capId);
	if (capLicenseResult.getSuccess())
		{ capLicenseArr = capLicenseResult.getOutput();  }
	else
		{ logDebug("**ERROR: getting lic prof: " + capLicenseResult.getErrorMessage()); return false; }

	if (!capLicenseArr.length)
		{ logDebug("WARNING: no license professional available on the application:"); return false; }

	licProfScriptModel = capLicenseArr[0];
	rlpId = licProfScriptModel.getLicenseNbr();
	//
	// Now see if a reference version exists
	//
	var updating = false;

	var newLic = getRefLicenseProf(rlpId)

	if (newLic)
		{
		updating = true;
		logDebug("Updating existing Ref Lic Prof : " + rlpId);
		}
	else
		var newLic = aa.licenseScript.createLicenseScriptModel();

	//
	// Now add / update the ref lic prof
	//
	newLic.setStateLicense(rlpId);
	newLic.setAddress1(licProfScriptModel.getAddress1());
	newLic.setAddress2(licProfScriptModel.getAddress2());
	newLic.setAddress3(licProfScriptModel.getAddress3());
	newLic.setAgencyCode(licProfScriptModel.getAgencyCode());
	newLic.setAuditDate(licProfScriptModel.getAuditDate());
	newLic.setAuditID(licProfScriptModel.getAuditID());
	newLic.setAuditStatus(licProfScriptModel.getAuditStatus());
	newLic.setBusinessLicense(licProfScriptModel.getBusinessLicense());
	newLic.setBusinessName(licProfScriptModel.getBusinessName());
	newLic.setCity(licProfScriptModel.getCity());
	newLic.setCityCode(licProfScriptModel.getCityCode());
	newLic.setContactFirstName(licProfScriptModel.getContactFirstName());
	newLic.setContactLastName(licProfScriptModel.getContactLastName());
	newLic.setContactMiddleName(licProfScriptModel.getContactMiddleName());
	newLic.setContryCode(licProfScriptModel.getCountryCode());
	newLic.setCountry(licProfScriptModel.getCountry());
	newLic.setEinSs(licProfScriptModel.getEinSs());
	newLic.setEMailAddress(licProfScriptModel.getEmail());
	newLic.setFax(licProfScriptModel.getFax());
	newLic.setLicenseType(licProfScriptModel.getLicenseType());
	newLic.setLicOrigIssDate(licProfScriptModel.getLicesnseOrigIssueDate());
	newLic.setPhone1(licProfScriptModel.getPhone1());
	newLic.setPhone2(licProfScriptModel.getPhone2());
	newLic.setSelfIns(licProfScriptModel.getSelfIns());
	newLic.setState(licProfScriptModel.getState());
	newLic.setLicState(licProfScriptModel.getState());
	newLic.setSuffixName(licProfScriptModel.getSuffixName());
	newLic.setWcExempt(licProfScriptModel.getWorkCompExempt());
	newLic.setZip(licProfScriptModel.getZip());

	if (updating)
		myResult = aa.licenseScript.editRefLicenseProf(newLic);
	else
		myResult = aa.licenseScript.createRefLicenseProf(newLic);

	if (myResult.getSuccess())
		{
		logDebug("Successfully added/updated License ID : " + rlpId)
		return rlpId;
		}
	else
		{ logDebug("**ERROR: can't create ref lic prof: " + myResult.getErrorMessage()); }
	}

/*--------------------------------------------------------------------------------------------------------------------/
| End createRefLicProfFromLicProf Function
/--------------------------------------------------------------------------------------------------------------------*/

/*===================================================================
//Script Number:
//Script Name: California State License Board validation element
//Script Developer: Jason Jackson
//Script Agency: SLS
//Script Description: 
//Script Run Event: 
//Script Parents:
//         
===================================================================*/
function externalLP_CA(licNum,rlpType,doPopulateRef,doPopulateTrx,itemCap)
	{

	/*
	Version: 3.2 

	Usage:

		licNum			:  Valid CA license number.   Non-alpha, max 8 characters.  If null, function will use the LPs on the supplied CAP ID
		rlpType			:  License professional type to use when validating and creating new LPs
		doPopulateRef 	:  If true, will create/refresh a reference LP of this number/type
		doPopulateTrx 	:  If true, will copy create/refreshed reference LPs to the supplied Cap ID.   doPopulateRef must be true for this to work
		itemCap			:  If supplied, licenses on the CAP will be validated.  Also will be refreshed if doPopulateRef and doPopulateTrx are true

	returns: non-null string of status codes for invalid licenses

	examples:

	appsubmitbefore   (will validate the LP entered, if any, and cancel the event if the LP is inactive, cancelled, expired, etc.)
	===============
	true ^ cslbMessage = "";
	CAELienseNumber ^ cslbMessage = externalLP_CA(CAELienseNumber,false,false,CAELienseType,null);
	cslbMessage.length > 0 ^ cancel = true ; showMessage = true ; comment(cslbMessage)

	appsubmitafter  (update all CONTRACTOR LPs on the CAP and REFERENCE with data from CSLB.  Link the CAP LPs to REFERENCE.   Pop up a message if any are inactive...)
	==============
	true ^ 	cslbMessage = externalLP_CA(null,true,true,"CONTRACTOR",capId)
	cslbMessage.length > 0 ^ showMessage = true ; comment(cslbMessage);

	Note;  Custom LP Template Field Mappings can be edited in the script below
	*/

	var returnMessage = "";

	var workArray = new Array();
	if (licNum)
		workArray.push(String(licNum));

	if (itemCap)
		{
		var capLicenseResult = aa.licenseScript.getLicenseProf(itemCap);
		if (capLicenseResult.getSuccess())
			{
			var capLicenseArr = capLicenseResult.getOutput();  }
		else
			{ logDebug("**ERROR: getting lic prof: " + capLicenseResult.getErrorMessage()); return false; }

		if (capLicenseArr == null || !capLicenseArr.length)
			{ logDebug("**WARNING: no licensed professionals on this CAP"); }
		//else
			//{
			//for (var thisLic in capLicenseArr)
			//	if (capLicenseArr[thisLic].getLicenseType() == rlpType)
			//		workArray.push(capLicenseArr[thisLic]);
			//}
		}
	else
		doPopulateTrx = false; // can't do this without a CAP;


	for (var thisLic = 0; thisLic < workArray.length; thisLic++)
		{
		var licNum = workArray[thisLic];
		var licObj = null;
		var isObject = false;

		if (typeof(licNum) == "object")  // is this one an object or string?
			{
			licObj = licNum;
			licNum = licObj.getLicenseNbr();
			isObject = true;
			}

		// Make the call to the California State License Board
		//changed dlh concord per accela document

        var document;
		var root;        
		var aURLArgList = "https://www2.cslb.ca.gov/IVR/License+Detail.aspx?LicNum=" + licNum;
		var vOutObj = aa.httpClient.get(aURLArgList);
		var isError = false;
		if(vOutObj.getSuccess()){
			var vOut = vOutObj.getOutput();
			var sr =  aa.proxyInvoker.newInstance("java.io.StringBufferInputStream", new Array(vOut)).getOutput();
			var saxBuilder = aa.proxyInvoker.newInstance("org.jdom.input.SAXBuilder").getOutput();
			document = saxBuilder.build(sr);
			root = document.getRootElement();
			errorNode = root.getChild("Error");
		}
		else{
			isError = true;
		}
		if (isError){
			logDebug("The CSLB web service is currently unavailable");
			continue;
		}
		else if (errorNode)
		{
			logDebug("Error for license " + licNum + " : " + errorNode.getText().replace(/\+/g," "));
			returnMessage+="License " + licNum +  " : " + errorNode.getText().replace(/\+/g," ") + " ";
			continue;
		}


		var lpBiz = root.getChild("BusinessInfo");
		var lpStatus = root.getChild("PrimaryStatus");
		var lpClass = root.getChild("Classifications");
		var lpBonds = root.getChild("ContractorBond");
		var lpWC = root.getChild("WorkersComp");

		// Primary Status
		// 3 = expired, 10 = good, 11 = inactive, 1 = canceled.   We will ignore all but 10 and return text.
		var stas = lpStatus.getChildren();
		for (var i=0 ; i<stas.size(); i++) {
			var sta = stas.get(i);

			if (sta.getAttribute("Code").getValue() != "10")
				returnMessage+="License:" + licNum + ", " + sta.getAttribute("Desc").getValue() + " ";
		}

		if (doPopulateRef)  // refresh or create a reference LP
			{
			var updating = false;

			// check to see if the licnese already exists...if not, create.

			var newLic = getRefLicenseProf(licNum)

			if (newLic)
				{
				updating = true;
				logDebug("Updating existing Ref Lic Prof : " + licNum);
				}
			else
				{
				var newLic = aa.licenseScript.createLicenseScriptModel();
				}

			if (isObject)  // update the reference LP with data from the transactional, if we have some.
				{
				if (licObj.getAddress1()) newLic.setAddress1(licObj.getAddress1());
				if (licObj.getAddress2()) newLic.setAddress2(licObj.getAddress2());
				if (licObj.getAddress3()) newLic.setAddress3(licObj.getAddress3());
				if (licObj.getAgencyCode()) newLic.setAgencyCode(licObj.getAgencyCode());
				if (licObj.getBusinessLicense()) newLic.setBusinessLicense(licObj.getBusinessLicense());
				if (licObj.getBusinessName()) newLic.setBusinessName(licObj.getBusinessName());
				if (licObj.getBusName2()) newLic.setBusinessName2(licObj.getBusName2());
				if (licObj.getCity()) newLic.setCity(licObj.getCity());
				if (licObj.getCityCode()) newLic.setCityCode(licObj.getCityCode());
				if (licObj.getContactFirstName()) newLic.setContactFirstName(licObj.getContactFirstName());
				if (licObj.getContactLastName()) newLic.setContactLastName(licObj.getContactLastName());
				if (licObj.getContactMiddleName()) newLic.setContactMiddleName(licObj.getContactMiddleName());
				if (licObj.getCountryCode()) newLic.setContryCode(licObj.getCountryCode());
				if (licObj.getEmail()) newLic.setEMailAddress(licObj.getEmail());
				if (licObj.getCountry()) newLic.setCountry(licObj.getCountry());
				if (licObj.getEinSs()) newLic.setEinSs(licObj.getEinSs());
				if (licObj.getFax()) newLic.setFax(licObj.getFax());
				if (licObj.getFaxCountryCode()) newLic.setFaxCountryCode(licObj.getFaxCountryCode());
				if (licObj.getHoldCode()) newLic.setHoldCode(licObj.getHoldCode());
				if (licObj.getHoldDesc()) newLic.setHoldDesc(licObj.getHoldDesc());
				if (licObj.getLicenseExpirDate()) newLic.setLicenseExpirationDate(licObj.getLicenseExpirDate());
				if (licObj.getLastRenewalDate()) newLic.setLicenseLastRenewalDate(licObj.getLastRenewalDate());
				if (licObj.getLicesnseOrigIssueDate()) newLic.setLicOrigIssDate(licObj.getLicesnseOrigIssueDate());
				if (licObj.getPhone1()) newLic.setPhone1(licObj.getPhone1());
				if (licObj.getPhone1CountryCode()) newLic.setPhone1CountryCode(licObj.getPhone1CountryCode());
				if (licObj.getPhone2()) newLic.setPhone2(licObj.getPhone2());
				if (licObj.getPhone2CountryCode()) newLic.setPhone2CountryCode(licObj.getPhone2CountryCode());
				if (licObj.getSelfIns()) newLic.setSelfIns(licObj.getSelfIns());
				if (licObj.getState()) newLic.setState(licObj.getState());
				if (licObj.getSuffixName()) newLic.setSuffixName(licObj.getSuffixName());
				if (licObj.getZip()) newLic.setZip(licObj.getZip());
				}

			// Now set data from the CSLB

			if (lpBiz.getChild("Name").getText() != "") newLic.setBusinessName(unescape(lpBiz.getChild("Name").getText()).replace(/\+/g," "));
			if (lpBiz.getChild("Addr1").getText() != "") newLic.setAddress1(unescape(lpBiz.getChild("Addr1").getText()).replace(/\+/g," "));
			if (lpBiz.getChild("Addr2").getText() != "") newLic.setAddress2(unescape(lpBiz.getChild("Addr2").getText()).replace(/\+/g," "));
			if (lpBiz.getChild("City").getText() != "") newLic.setCity(unescape(lpBiz.getChild("City").getText()).replace(/\+/g," "));
			if (lpBiz.getChild("State").getText() != "") newLic.setState(unescape(lpBiz.getChild("State").getText()).replace(/\+/g," "));
			if (lpBiz.getChild("Zip").getText() != "") newLic.setZip(unescape(lpBiz.getChild("Zip").getText()).replace(/\+/g," "));
			if (lpBiz.getChild("BusinessPhoneNum").getText() != "") newLic.setPhone1(unescape(stripNN(lpBiz.getChild("BusinessPhoneNum").getText()).replace(/\+/g," ")));
			newLic.setAgencyCode(aa.getServiceProviderCode());
			newLic.setAuditDate(sysDate);
			newLic.setAuditID(currentUserID);
			newLic.setAuditStatus("A");
			newLic.setLicenseType(rlpType);
			newLic.setLicState("CA");  // hardcode CA
			newLic.setStateLicense(licNum);

			if (lpBiz.getChild("IssueDt").getText()) newLic.setLicenseIssueDate(aa.date.parseDate(lpBiz.getChild("IssueDt").getText()));
			if (lpBiz.getChild("ExpireDt").getText()) newLic.setLicenseExpirationDate(aa.date.parseDate(lpBiz.getChild("ExpireDt").getText()));
			if (lpBiz.getChild("ReissueDt").getText()) newLic.setLicenseLastRenewalDate(aa.date.parseDate(lpBiz.getChild("ReissueDt").getText()));

			var wcs = root.getChild("WorkersComp").getChildren();

			for (var j=0 ; j<wcs.size(); j++) {
				wc = wcs.get(j);

				if (wc.getAttribute("PolicyNo").getValue()) newLic.setWcPolicyNo(wc.getAttribute("PolicyNo").getValue());				 				
				if (wc.getAttribute("InsCoCde").getValue()) newLic.setWcInsCoCode(unescape(wc.getAttribute("InsCoCde").getValue()));
			/*	if (wc.getAttribute("InsCoName").getValue()) newLic.setWcInsCoName(unescape(wc.getAttribute("InsCoName").getValue()));	*/
				if (wc.getAttribute("WCEffDt").getValue()) newLic.setWcEffDate(aa.date.parseDate(wc.getAttribute("WCEffDt").getValue()));
				if (wc.getAttribute("WCExpDt").getValue()) newLic.setWcExpDate(aa.date.parseDate(wc.getAttribute("WCExpDt").getValue()));
				if (wc.getAttribute("WCCancDt").getValue()) newLic.setWcCancDate(aa.date.parseDate(wc.getAttribute("WCCancDt").getValue()));
				if (wc.getAttribute("Exempt").getValue() == "E") newLic.setWcExempt("Y"); else newLic.setWcExempt("N");

				break; // only use first
				}

			//
			// Do the refresh/create and get the sequence number
			//
			if (updating)
				{
				var myResult = aa.licenseScript.editRefLicenseProf(newLic);
				var licSeqNbr = newLic.getLicSeqNbr();
				}
			else
				{
				var myResult = aa.licenseScript.createRefLicenseProf(newLic);

				if (!myResult.getSuccess())
					{
					logDebug("**WARNING: can't create ref lic prof: " + myResult.getErrorMessage());
					continue;
					}

				var licSeqNbr = myResult.getOutput()
				}

			logDebug("Successfully added/updated License No. " + licNum + ", Type: " + rlpType + " Sequence Number " + licSeqNbr);


			/////
			/////  Attribute Data -- first copy from the transactional LP if it exists
			/////


			if (isObject)  // update the reference LP with attributes from the transactional, if we have some.
				{
				var attrArray = licObj.getAttributes();

				if (attrArray)
					{
					for (var k in attrArray)
						{
						var attr = attrArray[k];
						editRefLicProfAttribute(licNum,attr.getAttributeName(),attr.getAttributeValue());
						}
					}
				}

			/////
			/////  Attribute Data
			/////
			/////  NOTE!  Agencies may have to configure template data below based on their configuration.  Please note all edits
			/////

			var cbs = root.getChild("Classifications").getChildren();
			for (var m=0 ; m<cbs.size(); m++) {
				cb = cbs.get(m);

				if (m == 0)
					{
					editRefLicProfAttribute(licNum,"CLASS CODE 1",cb.getAttribute("Code").getValue());
					editRefLicProfAttribute(licNum,"CLASS DESC 1",unescape(cb.getAttribute("Desc").getValue()).replace(/\+/g," "));
					}

				if (m == 1)
					{
					editRefLicProfAttribute(licNum,"CLASS CODE 2",cb.getAttribute("Code").getValue());
					editRefLicProfAttribute(licNum,"CLASS DESC 2",unescape(cb.getAttribute("Desc").getValue()).replace(/\+/g," "));
					}
				if (m == 2)
					{
					editRefLicProfAttribute(licNum,"CLASS CODE 3",cb.getAttribute("Code").getValue());
					editRefLicProfAttribute(licNum,"CLASS DESC 3",unescape(cb.getAttribute("Desc").getValue()).replace(/\+/g," "));
					}

				if (m == 3)
					{
					editRefLicProfAttribute(licNum,"CLASS CODE 4",cb.getAttribute("Code").getValue());
					editRefLicProfAttribute(licNum,"CLASS DESC 4",unescape(cb.getAttribute("Desc").getValue()).replace(/\+/g," "));
					}
				}

// dlh add in Status

	var stas = lpStatus.getChildren();
		for (var i=0 ; i<stas.size(); i++) {
			var sta = stas.get(i);

				if (sta.getAttribute("Desc").getValue()) editRefLicProfAttribute(licNum,"STATUS",unescape(sta.getAttribute("Desc").getValue()));

				break; // only use first
				}
				
//  do this again for WC  

            var wcs = root.getChild("WorkersComp").getChildren();
			for (var j=0 ; j< wcs.size(); j++) {
				wc = wcs.get(j);

				if (wc.getAttribute("PolicyNo").getValue()) editRefLicProfAttribute(licNum,"WC POLICY NO",unescape(wc.getAttribute("PolicyNo").getValue()));

				if (wc.getAttribute("InsCoCde").getValue()) editRefLicProfAttribute(licNum,"WC CO CODE",unescape(wc.getAttribute("InsCoCde").getValue()));
			
				if (wc.getAttribute("InsCoName").getValue()) editRefLicProfAttribute(licNum,"WC CO NAME",unescape(wc.getAttribute("InsCoName").getValue()).replace(/\+/g," "));

				if (wc.getAttribute("WCEffDt").getValue()) editRefLicProfAttribute(licNum,"WC EFF DATE",unescape(wc.getAttribute("WCEffDt").getValue()));

				if (wc.getAttribute("WCExpDt").getValue()) editRefLicProfAttribute(licNum,"WC EXP DATE",unescape(wc.getAttribute("WCExpDt").getValue()));

				if (wc.getAttribute("WCCancDt").getValue()) editRefLicProfAttribute(licNum,"WC CAN DATE",unescape(wc.getAttribute("WCCancDt").getValue()));

				if (wc.getAttribute("Exempt").getValue() == "E") 
					editRefLicProfAttribute(licNum,"WC EXEMPT","Y"); 
				else 
					editRefLicProfAttribute(licNum,"WC EXEMPT","N");
					 
				break; // only use first
				}

// end dlh change update attribute WC data 

			var bos = root.getChild("ContractorBond").getChildren();

			for (var n=0 ; n<bos.size(); n++) {
				var bo = bos.get(n);
				if (bo.getAttribute("BondAmt").getValue()) editRefLicProfAttribute(licNum,"BOND AMOUNT",unescape(bo.getAttribute("BondAmt").getValue()));
				if (bo.getAttribute("BondCancDt").getValue()) editRefLicProfAttribute(licNum,"BOND EXPIRATION",unescape(bo.getAttribute("BondCancDt").getValue()));

				// Currently unused but could be loaded into custom attributes.
				if (bo.getAttribute("SuretyTp").getValue()) editRefLicProfAttribute(licNum,"BOND SURETYTP",unescape(bo.getAttribute("SuretyTp").getValue()));

				if (bo.getAttribute("InsCoCde").getValue()) editRefLicProfAttribute(licNum,"BOND INSOCDE",unescape(bo.getAttribute("InsCoCde").getValue()).replace(/\+/g," "));

				if (bo.getAttribute("InsCoName").getValue()) editRefLicProfAttribute(licNum,"BOND ICONAME",unescape(bo.getAttribute("InsCoName").getValue()).replace(/\+/g," "));

				if (bo.getAttribute("BondNo").getValue()) editRefLicProfAttribute(licNum,"BOND NO",unescape(bo.getAttribute("BondNo").getValue()));

				if (bo.getAttribute("BondEffDt").getValue()) editRefLicProfAttribute(licNum,"BOND EFFDATE",unescape(bo.getAttribute("BondEffDt").getValue()));

			   


/*           dlh concord added above 
				aa.print("Bond Surety Type       : " + unescape(bo.getAttribute("SuretyTp").getValue()))
				aa.print("Bond Code              : " + unescape(bo.getAttribute("InsCoCde").getValue()))
				aa.print("Bond Insurance Company : " + unescape(bo.getAttribute("InsCoName").getValue()).replace(/\+/g," "))
				aa.print("Bond Number            : " + unescape(bo.getAttribute("BondNo").getValue()))
				aa.print("Bond Amount            : " + unescape(bo.getAttribute("BondAmt").getValue()))
				aa.print("Bond Effective Date    : " + unescape(bo.getAttribute("BondEffDt").getValue()))
				aa.print("Bond Cancel Date       : " + unescape(bo.getAttribute("BondCancDt").getValue()))
*/
				break; // only use first bond
				}

			if (doPopulateTrx)
				{
				var lpsmResult = aa.licenseScript.getRefLicenseProfBySeqNbr(servProvCode,licSeqNbr)
					if (!lpsmResult.getSuccess())
					{ logDebug("**WARNING error retrieving the LP just created " + lpsmResult.getErrorMessage()) ; }

				var lpsm = lpsmResult.getOutput();

				// Remove from CAP

				var isPrimary = false;

				for (var currLic in capLicenseArr)
					{
					var thisLP = capLicenseArr[currLic];
					if (thisLP.getLicenseType() == rlpType && thisLP.getLicenseNbr() == licNum)
						{
						logDebug("Removing license: " + thisLP.getLicenseNbr() + " from CAP.  We will link the new reference LP");
						if (thisLP.getPrintFlag() == "Y")
							{
							logDebug("...remove primary status...");
							isPrimary = true;
							thisLP.setPrintFlag("N");
							aa.licenseProfessional.editLicensedProfessional(thisLP);
							}
						var remCapResult = aa.licenseProfessional.removeLicensedProfessional(thisLP);
						if (capLicenseResult.getSuccess())
							{
							logDebug("...Success."); }
						else
							{ logDebug("**WARNING removing lic prof: " + remCapResult.getErrorMessage()); }
						}
					}

				// add the LP to the CAP
				var asCapResult= aa.licenseScript.associateLpWithCap(itemCap,lpsm)
				if (!asCapResult.getSuccess())
				{ logDebug("**WARNING error associating CAP to LP: " + asCapResult.getErrorMessage()) }
				else
					{ logDebug("Associated the CAP to the new LP") }

				// Now make the LP primary again
				if (isPrimary)
					{
					var capLps = getLicenseProfessional(itemCap);

					for (var thisCapLpNum in capLps)
						{
						if (capLps[thisCapLpNum].getLicenseNbr().equals(licNum))
							{
							var thisCapLp = capLps[thisCapLpNum];
							thisCapLp.setPrintFlag("Y");
							aa.licenseProfessional.editLicensedProfessional(thisCapLp);
							logDebug("Updated primary flag on Cap LP : " + licNum);

							// adding this return will cause the test script to work without error, even though this is the last statement executed
							//if (returnMessage.length > 0) return returnMessage;
							//else return null;

							}
						}
				}
			} // do populate on the CAP
		} // do populate on the REF
	} // for each license

	if (returnMessage.length > 0) return returnMessage;
	else return null;

} 
/*--------------------------------------------------------------------------------------------------------------------/
| End externalLP_CA Function
/--------------------------------------------------------------------------------------------------------------------*/

/*===================================================================
//Script Number:
//Script Name: California State License Board validation element
//Script Developer: Jason Jackson
//Script Agency: SLS
//Script Description: 
//Script Run Event: 
//Script Parents:
//         
===================================================================*/
function getCSLBInfo(doPop,doWarning)   // doPop = true populate the cap lic prof with this data  
					// doWarning = true, message if license is expired.
	{
	// Requires getNode and getProp functions.
	//
	// Get the first lic prof from the app
	//
	var capLicenseResult = aa.licenseScript.getLicenseProf(capId);
	if (capLicenseResult.getSuccess())
		{ var capLicenseArr = capLicenseResult.getOutput();  }
	else
		{ logDebug("**ERROR: getting lic prof: " + capLicenseResult.getErrorMessage()); return false; }
		
	if (capLicenseArr == null || !capLicenseArr.length)
		{ logDebug("**WARNING: no licensed professionals on this CAP"); return false; }

	var licProfScriptModel = capLicenseArr[0];
	var rlpId = licProfScriptModel.getLicenseNbr();

	//
	// Now make the call to the California State License Board
	//
	// dlh concord changed per accela doc
	//var getout = aa.util.httpPost("http://www2.cslb.ca.gov/IVR/License+Detail.aspx?LicNum=" + rlpId);
	//new code 
	var getout = aa.httpClient.get("http://www2.cslb.ca.gov/IVR/License+Detail.aspx?LicNum=" + rlpId);

	if (getout.getSuccess())
	  var lpXML = getout.getOutput();
	else
	   { logDebug("**ERROR: communicating with CSLB: " + getout.getErrorMessage()); return false; }
	
	// Check to see if error message in the XML:
	
	if (lpXML.indexOf("<Error>") > 0 )
		{
		logDebug("**ERROR: CSLB information returned an error: " + getNode(getNode(lpXML,"License"),"**ERROR"))
		return false;
		}
		
	var lpBiz = getNode(lpXML,"BusinessInfo");
	var lpStatus = getNode(lpXML,"PrimaryStatus");
	var lpClass = getNode(lpXML,"Classifications");
	var lpBonds = getNode(lpXML,"ContractorBond"); 
	var lpWC = getNode(lpXML,"WorkersComp");

	if (doWarning)
		{
		var expDate = new Date(getNode(lpBiz,"ExpireDt"));
		if (expDate < startDate)		
			{
			showMessage = true ;
			comment("**WARNING: Professional License expired on " + expDate.toString());
			}
		}

	if (doPop)  
		{ 	
		licProfScriptModel.setAddress1(getNode(lpBiz,"Addr1").replace(/\+/g," ")); 
		licProfScriptModel.setAddress2(getNode(lpBiz,"Addr2").replace(/\+/g," "));
		licProfScriptModel.setBusinessName(getNode(lpBiz,"Name").replace(/\+/g," "));
		licProfScriptModel.setCity(getNode(lpBiz,"City").replace(/\+/g," "));
		licProfScriptModel.setLicenseExpirDate(aa.date.parseDate(getNode(lpBiz,"ExpireDt")))
		licProfScriptModel.setLicesnseOrigIssueDate(aa.date.parseDate(getNode(lpBiz,"IssueDt")))  
		licProfScriptModel.setState(getNode(lpBiz,"State").replace(/\+/g," "))
		licProfScriptModel.setPhone1(getNode(lpBiz,"BusinessPhoneNum"))
		licProfScriptModel.setState(getNode(lpBiz,"State").replace(/\+/g," "))
		licProfScriptModel.setZip(getNode(lpBiz,"Zip"))
		aa.m_licenseProfessional.editLicensedProfessional(licProfScriptModel);
		}
	}
/*--------------------------------------------------------------------------------------------------------------------/
| End getCSLBInfo Function
/--------------------------------------------------------------------------------------------------------------------*/

function getRefLicenseProf(refstlic)
	{
	var refLicObj = null;
	var refLicenseResult = aa.licenseScript.getRefLicensesProfByLicNbr(aa.getServiceProviderCode(),refstlic);
	if (!refLicenseResult.getSuccess())
		{ logDebug("**ERROR retrieving Ref Lic Profs : " + refLicenseResult.getErrorMessage()); return false; }
	else
		{
		var newLicArray = refLicenseResult.getOutput();
		if (!newLicArray) return null;
		for (var thisLic in newLicArray)
			if (refstlic && newLicArray[thisLic] && refstlic.toUpperCase().equals(newLicArray[thisLic].getStateLicense().toUpperCase()))
				refLicObj = newLicArray[thisLic];
		}

	return refLicObj;
	}
/*--------------------------------------------------------------------------------------------------------------------/
| End getRefLicenseProf Function
/--------------------------------------------------------------------------------------------------------------------*/

function getLicenseProfessional(itemcapId)
{
	capLicenseArr = null;
	var s_result = aa.licenseProfessional.getLicenseProf(itemcapId);
	if(s_result.getSuccess())
	{
		capLicenseArr = s_result.getOutput();
		if (capLicenseArr == null || capLicenseArr.length == 0)
		{
			aa.print("WARNING: no licensed professionals on this CAP:" + itemcapId);
			capLicenseArr = null;
		}
	}
	else
	{
		aa.print("ERROR: Failed to license professional: " + s_result.getErrorMessage());
		capLicenseArr = null;
	}
	return capLicenseArr;
}
/*--------------------------------------------------------------------------------------------------------------------/
| End getLicenseProfessional Function
/--------------------------------------------------------------------------------------------------------------------*/

/*===================================================================
//Script Number:
//Script Name: California State License Board validation element
//Script Developer: Jason Jackson
//Script Agency: SLS
//Script Description: 
//Script Run Event: 
//Script Parents:
//         
===================================================================*/
function editRefLicProfAttribute(pLicNum,pAttributeName,pNewAttributeValue)
	{

	var attrfound = false;
	var oldValue = null;

	licObj = getRefLicenseProf(pLicNum)

	if (!licObj)
		{ logDebug("**WARNING Licensed Professional : " + pLicNum + " not found") ; return false }

	licSeqNum = licObj.getLicSeqNbr();
	attributeType = licObj.getLicenseType();

	if (licSeqNum==0 || licSeqNum==null || attributeType=="" || attributeType==null)
		{ logDebug("**WARNING Licensed Professional Sequence Number or Attribute Type missing") ; return false }

	var peopAttrResult = aa.people.getPeopleAttributeByPeople(licSeqNum, attributeType);

	if (!peopAttrResult.getSuccess())
		{ logDebug("**WARNING retrieving reference license professional attribute: " + peopAttrResult.getErrorMessage()); return false }

	var peopAttrArray = peopAttrResult.getOutput();

	for (i in peopAttrArray)
		{
		if ( pAttributeName.equals(peopAttrArray[i].getAttributeName()))
			{
			oldValue = peopAttrArray[i].getAttributeValue()
			attrfound = true;
			break;
			}
		}

	if (attrfound)
		{
		logDebug("Updated Ref Lic Prof: " + pLicNum + ", attribute: " + pAttributeName + " from: " + oldValue + " to: " + pNewAttributeValue)
		peopAttrArray[i].setAttributeValue(pNewAttributeValue);
		aa.people.editPeopleAttribute(peopAttrArray[i].getPeopleAttributeModel());
		}
	else
		{
		logDebug("**WARNING attribute: " + pAttributeName + " not found for Ref Lic Prof: "+ pLicNum)
		/* make a new one with the last model.  Not optimal but it should work
		newPAM = peopAttrArray[i].getPeopleAttributeModel();
		newPAM.setAttributeName(pAttributeName);
		newPAM.setAttributeValue(pNewAttributeValue);
		newPAM.setAttributeValueDataType("Number");
		aa.people.createPeopleAttribute(newPAM);
		*/
		}
	}function editReportedChannel(reportedChannel) // option CapId
{
	var itemCap = capId
	if (arguments.length > 1) itemCap = arguments[1]; // use cap ID specified in args

	var cdScriptObjResult = aa.cap.getCapDetail(itemCap);
	if (!cdScriptObjResult.getSuccess())
		{ logDebug("**ERROR: No cap detail script object : " + cdScriptObjResult.getErrorMessage()) ; return false; }

	var cdScriptObj = cdScriptObjResult.getOutput();

	if (!cdScriptObj)
		{ logDebug("**ERROR: No cap detail script object") ; return false; }

	cd = cdScriptObj.getCapDetailModel();

	cd.setReportedChannel(reportedChannel);

	cdWrite = aa.cap.editCapDetail(cd);

	if (cdWrite.getSuccess())
		{ logDebug("updated reported channel to " + reportedChannel) ; return true; }
	else
		{ logDebug("**ERROR writing capdetail : " + cdWrite.getErrorMessage()) ; return false ; }
}
/*--------------------------------------------------------------------------------------------------------------------/
| End editRefLicProfAttribute Function
/--------------------------------------------------------------------------------------------------------------------*/



