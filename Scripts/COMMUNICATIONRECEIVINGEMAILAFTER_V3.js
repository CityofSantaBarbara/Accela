/*------------------------------------------------------------------------------------------------------/
| Program : CommunicationReceivingEmailAfterV3.0.js
| Event   : CommunicationReceivingEmailAfter
|
| Usage   : CommunicationReceivingEmailAfter master script
|
| Client  : N/A
| Action# : N/A
|
| Notes   :
|
|
/------------------------------------------------------------------------------------------------------*/


/*------------------------------------------------------------------------------------------------------/
| START User Configurable Parameters
|
|     Only variables in the following section may be changed.  If any other section is modified, this
|     will no longer be considered a "Master" script and will not be supported in future releases.  If
|     changes are made, please add notes above.
/------------------------------------------------------------------------------------------------------*/
// only enable sendDebugEmail when debugging this script
// when sendDebugEmail = true, the debug log will be emailed to the debugEmailAddress
sendDebugEmail = true;
debugEmailAddress = "chad@esilverliningsolutions.com";

// set the bounceback subject and body
bouncebackSubject = "Your message could not be accepted: ";
bouncebackBody = "Please make sure the Record ID #XXXXXX is in the subject line when replying to a message. ";

var controlString = "CommunicationReceivingEmailAfter"; 				// Standard choice for control
var showMessage = false;		// Set to true to see results in popup window
var showDebug = false;			// Set to true to see debug messages in popup window
var disableTokens = false;		// turn off tokenizing of std choices (enables use of "{} and []")
var useAppSpecificGroupName = false;	// Use Group name when populating App Specific Info Values
var useTaskSpecificGroupName = false;	// Use Group name when populating Task Specific Info Values
var enableVariableBranching = true;	// Allows use of variable names in branching.  Branches are not followed in Doc Only
var maxEntries = 99;			// Maximum number of std choice entries.  Entries must be Left Zero Padded



/*------------------------------------------------------------------------------------------------------/
| END User Configurable Parameters
/------------------------------------------------------------------------------------------------------*/

var SCRIPT_VERSION = 3.0;
var useSA = false;
var SA = null;
var SAScript = null;
var bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS","SUPER_AGENCY_FOR_EMSE"); 
if (bzr.getSuccess() && bzr.getOutput().getAuditStatus() != "I") { 
	useSA = true; 	
	SA = bzr.getOutput().getDescription();
	bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS","SUPER_AGENCY_INCLUDE_SCRIPT"); 
	if (bzr.getSuccess()) { SAScript = bzr.getOutput().getDescription(); }
	}
	
if (SA) {
	eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS",SA));
	eval(getScriptText(SAScript,SA));
	}
else {
	eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
	}
	
//eval(getScriptText("INCLUDES_CUSTOM"));



//manually load globals specifically for this event

var cancel = false;

var vScriptName = aa.env.getValue("ScriptCode");
var vEventName = aa.env.getValue("EventName");

var startDate = new Date();
var startTime = startDate.getTime();
var message =	"";									// Message String
if (typeof debug === 'undefined') {
	var debug = "";										// Debug String, do not re-define if calling multiple
	}
var br = "<BR>";									// Break Tag
var feeSeqList = new Array();						// invoicing fee list
var paymentPeriodList = new Array();				// invoicing pay periods

var currentUserID = aa.env.getValue("CurrentUserID"); // Current User
var systemUserObj = null;  							// Current User Object
var currentUserGroup = null;						// Current User Group
var publicUserID = null;
var publicUser = false;

if (currentUserID.indexOf("PUBLICUSER") == 0){
	publicUserID = currentUserID; 
	currentUserID = "ADMIN"; 
	publicUser = true;
}
if(currentUserID != null) {
	systemUserObj = aa.person.getUser(currentUserID).getOutput();  	// Current User Object
}

var sysDate = aa.date.getCurrentDate();
var sysDateMMDDYYYY = dateFormatted(sysDate.getMonth(),sysDate.getDayOfMonth(),sysDate.getYear(),"");
var servProvCode = aa.getServiceProviderCode();

logDebug("EMSE Script Framework Versions");
logDebug("EVENT TRIGGERED: " + vEventName);
logDebug("SCRIPT EXECUTED: " + vScriptName);
logDebug("INCLUDE VERSION: " + INCLUDE_VERSION);
logDebug("SCRIPT VERSION : " + SCRIPT_VERSION);


var prefix = lookup("EMSE_VARIABLE_BRANCH_PREFIX",vEventName);

var controlFlagStdChoice = "EMSE_EXECUTE_OPTIONS";
var doStdChoices = true;  // compatibility default
var doScripts = false;
var bzr = aa.bizDomain.getBizDomain(controlFlagStdChoice ).getOutput().size() > 0;
if (bzr) {
	var bvr1 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice ,"STD_CHOICE");
	doStdChoices = bvr1.getSuccess() && bvr1.getOutput().getAuditStatus() != "I";
	var bvr1 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice ,"SCRIPT");
	doScripts = bvr1.getSuccess() && bvr1.getOutput().getAuditStatus() != "I";
	}

	
function getScriptText(vScriptName){
	var servProvCode = aa.getServiceProviderCode();
	if (arguments.length > 1) servProvCode = arguments[1]; // use different serv prov code
	vScriptName = vScriptName.toUpperCase();	
	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	try {
		var emseScript = emseBiz.getScriptByPK(servProvCode,vScriptName,"ADMIN");
		return emseScript.getScriptText() + "";	
		} catch(err) {
		return "";
	}
}

/*
Functions to attach incoming email messages to a record
*/
function associateMessagesToRecords(messages)
{
	if(messages){
		var i = 0;  var len = messages.length; 
		while(i < len)
		{
			var message = messages[i];
			var content = message.getTitle();
			var cmId = message.getCmId();
			var altId = parseAltIdFromContent(content);
			var messageBody = message.getContent();
			var messageModel = message.getModel();
			var messageFrom = messageModel.getFromString();
			var messageTo = messageModel.getToString();
			
			var altIdResult= new String(parseAltIdFromContent(content));
			var altIdMatch = altIdResult.split(',');
			logDebug("Subject: " + content);
			logDebug("Record ID from the Subject Line: " + altIdMatch);
			
			var altId = altIdMatch[1];
			if (altId)
			{
				aa.communication.associateEnities(cmId, altId, 'RECORD');
				logDebug("Successfully associated message with Record: " + altId);
				return true;
			}
			else
			{
				logDebug("Record ID not found, sending bounce back email.");
				email(messageFrom, messageTo, bouncebackSubject + ": " + content, bouncebackBody + ": <br><br>" + messageBody);
				
				if (sendDebugEmail)
				{
					email(debugEmailAddress, messageTo, "Debug log from CommunicationReceivingEmailAfter Event Script", debug);
				}
						
				return false;
			}
			i++;						
		}
	}
}


function parseAltIdFromContent(content)
{       
		//This is just a sample.
		//Note, please customize the RegExp for actual AlternateID.
        var altIdFormat = /Record ID #(.*\w)+/; 		
		var result = altIdFormat.exec(content);
		if(result){
			return result;
		}
		aa.print('No record id has been parsed from content.');
}
/*------------------------------------------------------------------------------------------------------/
| BEGIN Event Specific Variables
/------------------------------------------------------------------------------------------------------*/
var messages = aa.env.getValue('EmailMessageList');   

/*------------------------------------------------------------------------------------------------------/
| END Event Specific Variables
/------------------------------------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------------------------------/
| <===========Main=Loop================>
|
/-----------------------------------------------------------------------------------------------------*/
//
//  Get the Standard choices entry we'll use for this App type
//  Then, get the action/criteria pairs for this app
//

if (doStdChoices) doStandardChoiceActions(controlString,true,0);


//
//  Next, execute and scripts that are associated to the record type
//

if (doScripts) doScriptActions();

aa.env.setValue("ScriptReturnCode","0");
aa.env.setValue("ScriptReturnMessage",'The output below:');
