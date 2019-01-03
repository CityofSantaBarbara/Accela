/*------------------------------------------------------------------------------------------------------/
| Accela Automation
| Accela, Inc.
| Copyright (C): 2012-2013
|
| Program : DocumentReviewUpdateBefore.0.js
| Event   : DocumentReviewUpdateBefore
|
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| START User Configurable Parameters
|
|     Only variables in the following section may be changed.  If any other section is modified, this
|     will no longer be considered a "Master" script and will not be supported in future releases.  If
|     changes are made, please add notes above.
/------------------------------------------------------------------------------------------------------*/
var controlString = "DocumentReviewUpdateBefore"; 			// Standard choice for control
var preExecute = "PreExecuteForAfterEvents";				// Standard choice to execute first (for globals, etc)
var documentOnly = false;						// Document Only -- displays hierarchy of std choice steps

/*------------------------------------------------------------------------------------------------------/
| END User Configurable Parameters
/------------------------------------------------------------------------------------------------------*/
var DocumentReviewModel = aa.env.getValue("DocumentReviewModel");

//////////////////////////////
//Addd By Prathamesh 02/14/2018: Accela Product not Setting required CapId in Before Event
var documentModel = aa.document.getDocumentByPK(DocumentReviewModel.getDocumentID()).getOutput();
var docCapId = documentModel.getCapID();
aa.env.setValue("CapId", docCapId);
//////////////////////////////


var SCRIPT_VERSION = 9.0;
var useCustomScriptFile = true;  // if true, use Events->Custom Script and Master Scripts, else use Events->Scripts->INCLUDES_*
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

var controlFlagStdChoice = "EMSE_EXECUTE_OPTIONS";
var doStdChoices = true; // compatibility default
var doScripts = false;
var bzr = aa.bizDomain.getBizDomain(controlFlagStdChoice).getOutput().size() > 0;
if (bzr) {
	var bvr1 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice, "STD_CHOICE");
	doStdChoices = bvr1.getSuccess() && bvr1.getOutput().getAuditStatus() != "I";
	var bvr1 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice, "SCRIPT");
	doScripts = bvr1.getSuccess() && bvr1.getOutput().getAuditStatus() != "I";
	var bvr3 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice, "USE_MASTER_INCLUDES");
	if (bvr3.getSuccess()) {if(bvr3.getOutput().getDescription() == "No") useCustomScriptFile = false}; 
}

if (SA) {
	eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", SA,useCustomScriptFile));
	eval(getScriptText("INCLUDES_ACCELA_GLOBALS", SA,useCustomScriptFile));
	eval(getScriptText(SAScript, SA));
} else {
	eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS",null,useCustomScriptFile));
	eval(getScriptText("INCLUDES_ACCELA_GLOBALS",null,useCustomScriptFile));
}

eval(getScriptText("INCLUDES_CUSTOM",null,useCustomScriptFile));  

 //Add Standard Solution Includes 
 solutionInc = aa.bizDomain.getBizDomain("STANDARD_SOLUTIONS").getOutput().toArray(); 
 for (sol in solutionInc) { 
 	if (solutionInc[sol].getAuditStatus() != "I") eval(getScriptText(solutionInc[sol].getBizdomainValue(),null)); 
 }  
 
 //Add Configurable RuleSets 
 configRules = aa.bizDomain.getBizDomain("CONFIGURABLE_RULESETS").getOutput().toArray(); 
 for (rule in configRules) { 
 	if (configRules[rule].getAuditStatus() != "I") eval(getScriptText(configRules[rule].getBizdomainValue(),null)); 
 }

 if (documentOnly) {
 	doStandardChoiceActions(controlString, false, 0);
 	aa.env.setValue("ScriptReturnCode", "0");
 	aa.env.setValue("ScriptReturnMessage", "Documentation Successful.  No actions executed.");
 	aa.abortScript();
 }

 var prefix = lookup("EMSE_VARIABLE_BRANCH_PREFIX", vEventName);

 function getScriptText(vScriptName, servProvCode, useProductScripts) {
 	if (!servProvCode)  servProvCode = aa.getServiceProviderCode();
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
/*------------------------------------------------------------------------------------------------------/
| BEGIN Event Specific Variables
/------------------------------------------------------------------------------------------------------*/



// var eventParams = getEventScriptParams();
// aa.print(eventParams);

function getEventScriptParams() {
	/*get environment object and iterate through session variables*/
	var returnString = "";
	var envParams = aa.env.paramValues;
	var e = envParams.keys();
	while(e.hasMoreElements()) {
		param = e.nextElement();
		returnString += param + " = " + aa.env.getValue(param.toString()) + "<br>"
		aa.print(param + " = " + aa.env.getValue(param.toString()));
	}
	return returnString;
}

if(DocumentReviewModel != null)
{
	logDebug("docReviewId			=:" + DocumentReviewModel.getResID());
	logDebug("documentId		=:" + DocumentReviewModel.getDocumentID());
	logDebug("entityType		=:" + DocumentReviewModel.getEntityType());
	logDebug("entityId		=:" + DocumentReviewModel.getEntityID());
	logDebug("reviewerUserId		=:" + DocumentReviewModel.getEntityID1());
	logDebug("wfProcessID		=:" + DocumentReviewModel.getEntityID2());
	logDebug("wfStepNumber		=:" + DocumentReviewModel.getEntityID3());
	logDebug("assignPages		=:" + DocumentReviewModel.getTaskReviewPages());
	logDebug("assignComments	=:" + DocumentReviewModel.getTaskReviewComments());
	logDebug("status =:" + DocumentReviewModel.getStatus());

	var docReviewId = DocumentReviewModel.getResID();
	var documentId = DocumentReviewModel.getDocumentID();
	var entityType = DocumentReviewModel.getEntityType();
	var entityId = DocumentReviewModel.getEntityID();
	var reviewerUserId = DocumentReviewModel.getEntityID1();
	var wfProcessID = DocumentReviewModel.getEntityID2();
	var wfStepNumber = DocumentReviewModel.getEntityID3();
	var assignPages = DocumentReviewModel.getTaskReviewPages();
	var assignComments = DocumentReviewModel.getTaskReviewComments();
	var status = DocumentReviewModel.getStatus(); 
}
else
{
	logDebug("ERROR: 'DocumentReviewModel' is null.");
}

/*------------------------------------------------------------------------------------------------------/
| END Event Specific Variables
/------------------------------------------------------------------------------------------------------*/

if (preExecute.length)
	doStandardChoiceActions(preExecute, true, 0); // run Pre-execution code

logGlobals(AInfo);

/*------------------------------------------------------------------------------------------------------/
| <===========Main=Loop================>
|
/-----------------------------------------------------------------------------------------------------*/

if (doStdChoices)
	doStandardChoiceActions(controlString, true, 0);

if (doScripts)
	doScriptActions();

//
// Check for invoicing of fees
//
if (feeSeqList.length) {
	invoiceResult = aa.finance.createInvoice(capId, feeSeqList, paymentPeriodList);
	if (invoiceResult.getSuccess())
		logDebug("Invoicing assessed fee items is successful.");
	else
		logDebug("**ERROR: Invoicing the fee items assessed to app # " + capIDString + " was not successful.  Reason: " + invoiceResult.getErrorMessage());
}

/*------------------------------------------------------------------------------------------------------/
| <===========END=Main=Loop================>
/-----------------------------------------------------------------------------------------------------*/

if (debug.indexOf("**ERROR") > 0) {
	aa.env.setValue("ScriptReturnCode", "1");
	aa.env.setValue("ScriptReturnMessage", debug);
} else {
	if (cancel) {
		aa.env.setValue("ScriptReturnCode", "1");
		if (showMessage)
			aa.env.setValue("ScriptReturnMessage", "<font color=red><b>Action Cancelled</b></font><br><br>" + message);
		if (showDebug)
			aa.env.setValue("ScriptReturnMessage", "<font color=red><b>Action Cancelled</b></font><br><br>" + debug);
	} else {
		aa.env.setValue("ScriptReturnCode", "0");
		if (showMessage)
			aa.env.setValue("ScriptReturnMessage", message);
		if (showDebug)
			aa.env.setValue("ScriptReturnMessage", debug);
	}
}
