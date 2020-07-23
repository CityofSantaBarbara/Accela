/*------------------------------------------------------------------------------------------------------/
| Program : ACA_CHECK_GIS_CITYLIMITS.js
| Event   : ACA_BeforeButton Event
|
| Usage   : 
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
var showMessage = false;                    // Set to true to see results in popup window
var showDebug = false;                      // Set to true to see debug messages in popup window
var preExecute = "PreExecuteForBeforeEvents";   // Standard choice to execute first (for globals, etc)
var controlString = "ACA_Check_Council";            // Standard choice for control
var disableTokens = false;                  // turn off tokenizing of std choices (enables use of "{} and []")
var useAppSpecificGroupName = false;        // Use Group name when populating App Specific Info Values
var useTaskSpecificGroupName = false;       // Use Group name when populating Task Specific Info Values
var enableVariableBranching = false;        // Allows use of variable names in branching.  Branches are not followed in Doc Only
var maxEntries = 99;                        // Maximum number of std choice entries.  Entries must be Left Zero Padded
var useCustomScriptFile = true;             // if true, use Events->Custom Script, else use Events->Scripts->INCLUDES_CUSTOM
/*------------------------------------------------------------------------------------------------------/
| END User Configurable Parameters
/------------------------------------------------------------------------------------------------------*/
var cancel = false;
var startDate = new Date();
var startTime = startDate.getTime();
var message = "";                       // Message String
var debug = "";                             // Debug String
var br = "<BR>";                        // Break Tag
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
var servProvCode = capId.getServiceProviderCode()               // Service Provider Code
var publicUser = false;
var currentUserID = aa.env.getValue("CurrentUserID");
if (currentUserID.indexOf("PUBLICUSER") == 0) { currentUserID = "ADMIN"; publicUser = true }  // ignore public users
var capIDString = capId.getCustomID();              // alternate cap id string
var systemUserObj = aa.person.getUser(currentUserID).getOutput();   // Current User Object
var appTypeResult = cap.getCapType();
var appTypeString = appTypeResult.toString();           // Convert application type to string ("Building/A/B/C")
var appTypeArray = appTypeString.split("/");            // Array of application type string
var currentUserGroup;
var currentUserGroupObj = aa.userright.getUserRight(appTypeArray[0], currentUserID).getOutput()
if (currentUserGroupObj) currentUserGroup = currentUserGroupObj.getGroupName();
var capName = cap.getSpecialText();
var capStatus = cap.getCapStatus();
var AInfo = new Array();                    // Create array for tokenized variables
//loadAppSpecific4ACA(AInfo);                       // Add AppSpecific Info
//loadTaskSpecific(AInfo);                      // Add task specific info
//loadParcelAttributes(AInfo);                      // Add parcel attributes
//loadASITables4ACA();
/*------------------------------------------------------------------------------------------------------/
| <===========Main=Loop================>
|
/-----------------------------------------------------------------------------------------------------*/
//doStandardChoiceActions(controlString, true, 0);
var par = {};
try {
    par = cap.getParcelModel();
    var ParcelValidatedNumber = par.getParcelNo();
    
    var cityLimits = getGISInfo2ASB("SANTABARBARA", "City Limits", "Ownership");
    if (!cityLimits) {
        showMessage = true;
        cancel = true;
        comment("The parcel you have selected in out of City Limits. Please contact the City for more information");
    }
} catch (err) {
    //  cancel = true;
    //  showMessage = true;
    //  comment("ACA_Check_Council Error: " + err);
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
function getGISInfo2ASB(svc, layer, attributename) // optional: numDistance, distanceType
{
    // use buffer info to get info on the current object by using distance 0
    // usage: 
    //
    // x = getGISInfo("flagstaff","Parcels","LOT_AREA");
    // x = getGISInfo2("flagstaff","Parcels","LOT_AREA", -1, "feet");
    // x = getGISInfo2ASB("flagstaff","Parcels","LOT_AREA", -1, "feet");
    //
    // to be used with ApplicationSubmitBefore only
    var numDistance = 0
    if (arguments.length >= 4) numDistance = arguments[3]; // use numDistance in arg list
    var distanceType = "feet";
    if (arguments.length == 5) distanceType = arguments[4]; // use distanceType in arg list
    var retString;
    var bufferTargetResult = aa.gis.getGISType(svc, layer); // get the buffer target
    if (bufferTargetResult.getSuccess()) {
        var buf = bufferTargetResult.getOutput();
        buf.addAttributeName(attributename);
    }
    else { logDebug("**ERROR: Getting GIS Type for Buffer Target.  Reason is: " + bufferTargetResult.getErrorType() + ":" + bufferTargetResult.getErrorMessage()); return false }
    var gisObjResult = aa.gis.getParcelGISObjects(ParcelValidatedNumber); // get gis objects on the parcel number
    if (gisObjResult.getSuccess())
        var fGisObj = gisObjResult.getOutput();
    else { logDebug("**ERROR: Getting GIS objects for Parcel.  Reason is: " + gisObjResult.getErrorType() + ":" + gisObjResult.getErrorMessage()); return false }
    for (a1 in fGisObj) // for each GIS object on the Parcel.  We'll only send the last value
    {
        var bufchk = aa.gis.getBufferByRadius(fGisObj[a1], numDistance, distanceType, buf);
        if (bufchk.getSuccess())
            var proxArr = bufchk.getOutput();
        else { logDebug("**ERROR: Retrieving Buffer Check Results.  Reason is: " + bufchk.getErrorType() + ":" + bufchk.getErrorMessage()); return false }
        for (a2 in proxArr) {
            var proxObj = proxArr[a2].getGISObjects();  // if there are GIS Objects here, we're done
            for (z1 in proxObj) {
                var v = proxObj[z1].getAttributeValues()
                retString = v[0];
            }
        }
    }
    return retString
}