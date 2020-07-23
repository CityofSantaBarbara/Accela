/*------------------------------------------------------------------------------------------------------/
| Program : ACA_BLD_OTC_RRF_OWNER_BUILDER_ONLOAD_PAGEFLOW.js
| Event   : ACA_BLD_OTC_RRF_OWNER_BUILDER_ONLOAD_PAGEFLOW Event
|
| Usage   : If no explanations required skip page this fires on multiple record types
|           
| Client  : N/A
| Action# : N/A
|
| Notes   : 
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| START User Configurable Parameters
|
/------------------------------------------------------------------------------------------------------*/
var showMessage = false; 					// Set to true to see results in popup window
var showDebug = false; 						// Set to true to see debug messages in popup window
var preExecute = "PreExecuteForBeforeEvents"; 	// Standard choice to execute first (for globals, etc)
var controlString = "NA"; 			// Standard choice for control
var disableTokens = false; 					// turn off tokenizing of std choices (enables use of "{} and []")
var useAppSpecificGroupName = false; 		// Use Group name when populating App Specific Info Values
var useTaskSpecificGroupName = false; 		// Use Group name when populating Task Specific Info Values
var enableVariableBranching = false; 		// Allows use of variable names in branching.  Branches are not followed in Doc Only
var maxEntries = 99; 						// Maximum number of std choice entries.  Entries must be Left Zero Padded
var useCustomScriptFile = true;  			// if true, use Events->Custom Script, else use Events->Scripts->INCLUDES_CUSTOM
/*------------------------------------------------------------------------------------------------------/
| END User Configurable Parameters
/------------------------------------------------------------------------------------------------------*/
var cancel = false;
var startDate = new Date();
var startTime = startDate.getTime();
var message = ""; 						// Message String
var debug = ""; 							// Debug String
var br = "<BR>"; 						// Break Tag

//add include files
eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", null, useCustomScriptFile));
eval(getScriptText("INCLUDES_CUSTOM", null, useCustomScriptFile));


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

var cap = aa.env.getValue("CapModel");
var capId = cap.getCapID();
var servProvCode = capId.getServiceProviderCode()       		// Service Provider Code
var publicUser = false;
var currentUserID = aa.env.getValue("CurrentUserID");
if (currentUserID.indexOf("PUBLICUSER") == 0) { currentUserID = "ADMIN"; publicUser = true }  // ignore public users
var capIDString = capId.getCustomID(); 				// alternate cap id string
var systemUserObj = aa.person.getUser(currentUserID).getOutput();  	// Current User Object
var appTypeResult = cap.getCapType();
var appTypeString = appTypeResult.toString(); 			// Convert application type to string ("Building/A/B/C")
var appTypeArray = appTypeString.split("/"); 			// Array of application type string
var currentUserGroup;
var currentUserGroupObj = aa.userright.getUserRight(appTypeArray[0], currentUserID).getOutput()
if (currentUserGroupObj) currentUserGroup = currentUserGroupObj.getGroupName();
var capName = cap.getSpecialText();
var capStatus = cap.getCapStatus();

var AInfo = new Array(); 					// Create array for tokenized variables
loadAppSpecific4ACA(AInfo); 						// Add AppSpecific Info
//loadTaskSpecific(AInfo);						// Add task specific info
//loadParcelAttributes(AInfo);						// Add parcel attributes
//loadASITables4ACAXX();
/*------------------------------------------------------------------------------------------------------/
| <===========Main=Loop================>
|
/-----------------------------------------------------------------------------------------------------*/


try {
   var hide = true;
    if ( String(AInfo["Owner Builder or Licesne Professional"]).toLowerCase() == 'owner builder' )
         {
        hide = false;
        for(var x in AInfo){
            logDebug(x + " + " + AInfo[x]);
        }
    }
    else{
        hide=true;
    }
    if(hide){
        aa.acaPageFlow.hideCapPage4ACA(capId, 2, 2);
        aa.env.setValue("ReturnData", "{'PageFlow': {'HidePage' : 'Y'}}");
    }


} catch (err) {
    showDebug = true;
    logDebug("An error has occurred in ACA_BLD_OTC_RRF_OWNER_BUILDER_ONLOAD_PAGEFLOW: Main function: " + err.message);
    logDebug(err.stack);
}

/*------------------------------------------------------------------------------------------------------/
| <===========END=Main=Loop================>
/-----------------------------------------------------------------------------------------------------*/

if (debug.indexOf("**ERROR") > 0) {
    aa.env.setValue("ErrorCode", "1");
    aa.env.setValue("ErrorMessage", debug);
}
else {
    if (cancel) {
        aa.env.setValue("ErrorCode", "-2");
        if (showMessage) aa.env.setValue("ErrorMessage", message);
        if (showDebug) aa.env.setValue("ErrorMessage", debug);
    }
    else {
        aa.env.setValue("ErrorCode", "0");
        if (showMessage) aa.env.setValue("ErrorMessage", message);
        if (showDebug) aa.env.setValue("ErrorMessage", debug);
    }
}

/*------------------------------------------------------------------------------------------------------/
| <===========External Functions (used by Action entries)
/------------------------------------------------------------------------------------------------------*/

function populateASITable4Pageflow(ASITables) {
    
    //if (vRowCount == 0) {
    for(var t in ASITables){
        removeASITable(t);
        addASITable(t,ASITables[t])
    }

    var tmpCap = aa.cap.getCapViewBySingle(capId);
    cap.setAppSpecificTableGroupModel(tmpCap.getAppSpecificTableGroupModel());
    aa.env.setValue("CapModel", cap);
    //}
}

function loadASITables4ACAXX() {
    //
    // Loads App Specific tables into their own array of arrays.  Creates global array objects
    //
    // Optional parameter, cap ID to load from.  If no CAP Id specified, use the capModel
    //
    var itemCap = capId;
    if (arguments.length == 1) {
        itemCap = arguments[0]; // use cap ID specified in args
        var gm = aa.appSpecificTableScript.getAppSpecificTableGroupModel(itemCap).getOutput();
    } else {
        var gm = cap.getAppSpecificTableGroupModel()
    }
    var ta = gm.getTablesMap();
    var tai = ta.values().iterator();
    while (tai.hasNext()) {
        var tsm = tai.next();
        if (tsm.rowIndex.isEmpty())
            continue; // empty table
        var tempObject = new Array();
        var tempArray = new Array();
        var tn = tsm.getTableName();
        tn = String(tn).replace(/[^a-zA-Z0-9]+/g, '');
        if (!isNaN(tn.substring(0, 1)))
            tn = "TBL" + tn // prepend with TBL if it starts with a number
        var tsmfldi = tsm.getTableField().iterator();
        var tsmcoli = tsm.getColumns().iterator();
        var numrows = 1;
        while (tsmfldi.hasNext()) // cycle through fields
        {
            if (!tsmcoli.hasNext()) // cycle through columns
            {
                var tsmcoli = tsm.getColumns().iterator();
                tempArray.push(tempObject); // end of record
                var tempObject = new Array(); // clear the temp obj
                numrows++;
            }
            var tcol = tsmcoli.next();
            var tval = tsmfldi.next();

            //var tval = tnxt.getInputValue();
            tempObject[tcol.getColumnName()] = tval;
        }
        tempArray.push(tempObject); // end of record
        var copyStr = "" + tn + " = tempArray";
        //	  logDebug(copyStr);
        //    logDebug("ASI Table Array : " + tn + " (" + numrows + " Rows)");
        eval(copyStr); // move to table name
    }
}


