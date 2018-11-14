var myMessage = "";


    function getScriptText(vScriptName, servProvCode, useProductScripts) {
        if (!servProvCode) servProvCode = aa.getServiceProviderCode();
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

    var SCRIPT_VERSION = 3.0;
    var useCustomScriptFile = true;  // if true, use Events->Custom Script, else use Events->Scripts->INCLUDES_CUSTOM
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
        eval(getScriptText("INCLUDES_ACCELA_GLOBALS", SA, useCustomScriptFile));
        eval(getScriptText(SAScript, SA));
    } else {
        eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", null, useCustomScriptFile));
        eval(getScriptText("INCLUDES_ACCELA_GLOBALS", null, useCustomScriptFile));
    }

    eval(getScriptText("INCLUDES_CUSTOM", null, useCustomScriptFile));

    //Get capId
    var capId1 = aa.env.getValue("PermitId1");
    var capId2 = aa.env.getValue("PermitId2");
    var capId3 = aa.env.getValue("PermitId3");
    var capId = aa.cap.getCapID(capId1, capId2, capId3).getOutput();
	
	if (capId) {
		var altId = capId.getCustomID();
		var cap = aa.cap.getCap(capId).getOutput();
		appTypeString = cap.getCapType().toString();
		appTypeArray = appTypeString.split("/");
	}
	
myMessage += "<BR>"+"START OF COMMUNICATION SEND BEFORE SB";

function getTitle(){
	return aa.env.getValue('Title');
}
function getContent(){
	return aa.env.getValue('Content');
}
function getCc(){
	return aa.env.getValue('Cc');
}
function getBcc(){
	return aa.env.getValue('Bcc');
}
function getTo(){
	return aa.env.getValue('To');
}
function getFrom(){
	return aa.env.getValue('From');
}
function getComments(){
	return aa.env.getValue('Comments');
}
function getCommunicationId(){
	return aa.env.getValue('CommunicationId');
}


function printObjProperties_email(obj){
    var idx;

	if (obj) {
		if(obj.getClass != null){
			myMessage += "<BR>" + "************* " + obj.getClass() + " *************";
		}
		else {
			myMessage += "<BR>" + "this is not an object with a class!";
		}

		for(idx in obj){
			if (typeof (obj[idx]) == "function") {
				try {
					myMessage += "<BR>" + idx + "==>  " + obj[idx]();
				} catch (ex) { }
			} else {
				myMessage += "<BR>" + idx + ":  " + obj[idx];
			}
		}
	}
	else { myMessage += "<BR" + "cannot print object, it is null!"; }
}


try {

var mCommId = getCommunicationId();
var mFrom = getFrom();
var mTo = getTo();
var mCc = getCc();
var mBcc = getBcc();
var mTitle = getTitle();
var mContent = getContent();
var mComments = getComments();


	myMessage += "<BR>"+"CommunicationId:"+mCommId;

	myMessage += "<BR>"+"From:"+mFrom;
	myMessage += "<BR>"+"To:"+mTo;
	myMessage += "<BR>"+"Cc:"+mCc;
	myMessage += "<BR>"+"Bcc:"+mBcc;

	myMessage += "<BR>"+"Title:"+mTitle;
	myMessage += "<BR>"+"Content:"+mContent;
	myMessage += "<BR>"+"Comments:"+mComments;
	
	myMessage += "<BR>"+ "---------------- EOM --------------------------- <BR>";
	
	aa.env.setValue('Title',mTitle+ " " + "##record id would be here##" );
	
	var myEmailMessageScriptResult = aa.communication.getEmailMessageScriptModel();
	var myEmailMessageScriptModel = myEmailMessageScriptResult.getOutput();
	
	printObjProperties_email(myEmailMessageScriptModel);
	var myEmailMessageModel = myEmailMessageScriptModel.getModel();
	printObjProperties_email(myEmailMessageModel);
	
    myMessage += "lhlhlhlhlhllhlhlhllhlhlhlhlhlhlhlhlhlhlhlhlhlhlhlhlhlhlhlhlhlhlhlhlhlhlhlhlhlhlhlhlhlhlhlhlhlhlhlhl";
	printObjProperties_email(aa.env);
    myMessage += "cocococococococococococococococococococococococococococococococococococococococococococococococococ";
	
}
catch(err) {
	myMessage += "COMMUNICATION SEND BEFORE ERROR<BR>"+ err + ". Line Number: " + err.lineNumber;
}
	myMessage += "<BR>"+"END OF COMMUNICATION SEND BEFORE SB";

showDebug = true;
showMessage = true;
logDebug(myMessage);
aa.print(myMessage);
comment(myMessage);


