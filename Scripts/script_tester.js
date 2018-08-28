/*------------------------------------------------------------------------------------------------------/
| Cap ID to use
/------------------------------------------------------------------------------------------------------*/
//var myCapId = "BLD2018-00105";                      // for address, lp, and inspection
var myCapId = "";
var myUserId = "EKOONTZ";

var controlString = "InspectionResultSubmitBefore";       // Standard Choice Starting Point
var preExecute = "PreExecuteForAfterEvents";    // Standard choice to execute first (for globals, etc) (PreExecuteForAfterEvent or PreExecuteForBeforeEvents)

aa.env.setValue("EventName",controlString);

/*------------------------------------------------------------------------------------------------------/
| ScriptTester settings
|
/------------------------------------------------------------------------------------------------------*/
var wfTask = "TCP Review";
var wfStatus = "Estimate Fee";

var inspGroup = "BLD Residential";
var inspType = "Building Final";
var inspResult = "Passed";

var wfComment = "";
var message =   "";                                                                                           // Message String
var debug = "";                                                                                                 // Debug String
var capId = aa.cap.getCapID(myCapId).getOutput();
var cap = aa.cap.getCap(capId).getOutput();                                                 // Cap object
var servProvCode = capId.getServiceProviderCode();                     // Service Provider Code
var currentUserID = "ADMIN";
var capIDString = capId.getCustomID();                                                          // alternate cap id string
var systemUserObj = aa.person.getUser(currentUserID).getOutput();                // Current User Object
var appTypeResult = cap.getCapType();
var appTypeString = appTypeResult.toString();                                             // Convert application type to string ("Building/A/B/C")
var appTypeArray = appTypeString.split("/");                                                // Array of application type string
var currentUserGroup;
var currentUserGroupObj = aa.userright.getUserRight(appTypeArray[0],currentUserID).getOutput()
if (currentUserGroupObj) currentUserGroup = currentUserGroupObj.getGroupName();
var capName = cap.getSpecialText();
var capStatus = cap.getCapStatus();
//var fileDateObj = cap.getFileDate();                                                            // File Date scriptdatetime
//var fileDate = "" + fileDateObj.getMonth() + "/" + fileDateObj.getDayOfMonth() + "/" + fileDateObj.getYear();
//var fileDateYYYYMMDD = dateFormatted(fileDateObj.getMonth(),fileDateObj.getDayOfMonth(),fileDateObj.getYear(),"YYYY-MM-DD");
//var sysDate = aa.date.getCurrentDate();
//var sysDateMMDDYYYY = dateFormatted(sysDate.getMonth(),sysDate.getDayOfMonth(),sysDate.getYear(),"YYYY-MM-DD");
var parcelArea = 0;
var balanceDue = 0 ; var houseCount = 0; feesInvoicedTotal = 0;                     // Init detail Data
var capDetail = "";
var capDetailObjResult = aa.cap.getCapDetail(capId);                                  // Detail

/*------------------------------------------------------------------------------------------------------/
| Master Script Code - DO NOT TOUCH
/------------------------------------------------------------------------------------------------------*/
var tmpID = aa.cap.getCapID(myCapId).getOutput(); 
if(tmpID != null){
                                aa.env.setValue("PermitId1",tmpID.getID1()); 
                                aa.env.setValue("PermitId2",tmpID.getID2()); 
                                aa.env.setValue("PermitId3",tmpID.getID3());
} 
aa.env.setValue("CurrentUserID",myUserId); 
var preExecute = "PreExecuteForAfterEvents";
var documentOnly = false;
var SCRIPT_VERSION = 3.0;
var useSA = false; /*super agency flag*/
var SA = null; /*super agency flag*/
var SAScript = null;
var bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS","SUPER_AGENCY_FOR_EMSE"); 
if (bzr.getSuccess() && bzr.getOutput().getAuditStatus() != "I") {             
                useSA = true;                     
                SA = bzr.getOutput().getDescription();  
                bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS","SUPER_AGENCY_INCLUDE_SCRIPT");                 
                if (bzr.getSuccess()) { 
                                SAScript = bzr.getOutput().getDescription(); 
                }              
}
if (SA) { 
                eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS",SA));        
                eval(getScriptText("INCLUDES_ACCELA_GLOBALS",SA));              /* force for script test*/ 
                eval(getScriptText("INCLUDES_CUSTOM"));        
                showDebug = true; 
                eval(getScriptText(SAScript,SA));             
}else {   
                eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));               
                eval(getScriptText("INCLUDES_ACCELA_GLOBALS")); 
                eval(getScriptText("INCLUDES_CUSTOM"));                                                 
}              

if (documentOnly) {
              doStandardChoiceActions(controlString,false,0);
              aa.env.setValue("ScriptReturnCode", "0");
              aa.env.setValue("ScriptReturnMessage", "Documentation Successful.  No actions executed.");
              aa.abortScript();
              }
              

var prefix = lookup("EMSE_VARIABLE_BRANCH_PREFIX",vEventName);
var controlFlagStdChoice = "EMSE_EXECUTE_OPTIONS";
var doStdChoices = true;  
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
                if (arguments.length > 1) servProvCode = arguments[1]; 
                vScriptName = vScriptName.toUpperCase();                      
                var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();               
                try {                        
                                var emseScript = emseBiz.getScriptByPK(servProvCode,vScriptName,"ADMIN");                              
                                return emseScript.getScriptText() + "";                                  
                } 
                catch(err) {                         
                                return "";             
                }
} 
logGlobals(AInfo); 

var z = debug.replace(/<BR>/g,"\r");  


aa.print("*************************************************************************");
aa.print("*****  Global Values                                        Begin   *****");
aa.print("*************************************************************************");
aa.print(z);
aa.print("*************************************************************************");
aa.print("*****  Global Values                                        End     *****");
aa.print("*************************************************************************");
aa.print("*************************************************************************");

/*------------------------------------------------------------------------------------------------------/
| Testing Utility Functions
/------------------------------------------------------------------------------------------------------*/


/*------------------------------------------------------------------------------------------------------/
| function: printObjProperties
|
| Desc: will provide both function and propery information for the class provided as a parameter.
|       this function is valuable for assisting a developer in researching the contents of an unknown
|       or undocumented class.
|
| Created By: Silver Lining Solutions
|------------------------------------------------------------------------------------------------------*/
function printObjProperties(obj){
    var idx;

    if(obj.getClass != null){
        aa.print("************* " + obj.getClass() + " *************");
    }
                else {
                                aa.print("this is not an object with a class!");
                }

    for(idx in obj){
        if (typeof (obj[idx]) == "function") {
            try {
                aa.print("METHOD " + idx + "==>  " + obj[idx]());
            } catch (ex) { }
        } else {
            aa.print("ATTRIBUTE                      " + idx + ":  " + obj[idx]);
        }
    }
}

/*------------------------------------------------------------------------------------------------------/
| function: printClassDiagram
|
| Desc: using the printObjProperties function, this function will generate information for several 
|       commonly used objects.  these objects are: capId, capDetail, ?, owners, contacts, LPs, primary LPs, 
|       inspection, Parcel and Attributes.
|
| Created By: Silver Lining Solutions
|------------------------------------------------------------------------------------------------------*/
function printClassDiagram (capId) {
    var idx, myInsp, myInspector, arr, myInspDate;
              

              aa.print("");
aa.print("*************************************************");
              aa.print("**  Accela Object / Class Information          **");
aa.print("*************************************************");
    printObjProperties(aa.cap.getCapDetail(capId).getOutput());  //also known as capDetail in custom_globals
              aa.print("");

              aa.print("");
              aa.print("*************************");
              aa.print("**  capId              **");
              aa.print("*************************");
    printObjProperties(capId);
              aa.print("");

              aa.print("");
              aa.print("*************************");
              aa.print("**  capView            **");
              aa.print("*************************");
              var capView = aa.cap.getCapViewByID(capId).getOutput();
              printObjProperties(capView);
              aa.print("");

              aa.print("");
              aa.print("*************************");
              aa.print("**  capDetailsDesc     **");
              aa.print("*************************");
              var capDetailsDesc = capView.getCapWorkDesModel().getDescription();
              printObjProperties(capDetailsDesc);
              aa.print("");

              aa.print("");
              aa.print("*************************");
              aa.print("**  workDescResult     **");
              aa.print("*************************");
              var workDescResult = aa.cap.getCapWorkDesByPK(capId);
              printObjProperties(workDescResult);
              aa.print("");

              aa.print("");
              aa.print("*************************");
              aa.print("**  workDesObj     **");
              aa.print("*************************");
              var workDesObj = workDescResult.getOutput().getCapWorkDesModel();
              printObjProperties(workDesObj);
              aa.print("");
                           
              aa.print("");
              aa.print("*************************");
              aa.print("**  capDetail          **");
              aa.print("*************************");
    printObjProperties(aa.cap.getCapDetail(capId).getOutput());  //also known as capDetail in custom_globals
              aa.print("");

              aa.print("");
              aa.print("*************************");
              aa.print("**  cap                **");
              aa.print("*************************");
    printObjProperties(aa.cap.getCap(capId).getOutput());  
              aa.print("");
              
              aa.print("");
              aa.print("*************************");
              aa.print("**  person             **");
              aa.print("*************************");
    aa.print("systemUserObj = " + systemUserObj);  
              printObjProperties(systemUserObj);  
              aa.print("");
              
              aa.print("");
              aa.print("*************************");
              aa.print("**  Owners             **");
              aa.print("*************************");
              aa.owner.getOwnerByCapId(capId).getOutput();
    for (idx in arr) {
        printObjProperties(arr[idx]);
    }
              aa.print("");
                           
              aa.print("");
              aa.print("*************************");
              aa.print("**  inspections        **");
              aa.print("*************************");

    arr = aa.inspection.getInspections(capId).getOutput();
    for (idx in arr) { 
                           // loop through all inspections
                           myInsp = arr[idx];
                           myInspector = myInsp.getInspector();
                           myInspDate = myInsp.getInspectionDate();
                           aa.print("*************************");
                           aa.print("** Inspection #: " + idx );
                           aa.print("** Inspection type: " + myInsp.getInspectionType());
                           aa.print("*************************");
                           aa.print("");
                           aa.print("** Inspection info: ");
                           printObjProperties(myInsp);
                           aa.print("************************* end of Inspection info");
                           aa.print("** Inspector info: ");
                           printObjProperties(myInspector);
                           aa.print("************************* end of Inspector Model Info");
                           aa.print("");
                           aa.print("** Inspection Date info: ");
                           aa.print("** Inspection Date: " + myInsp.getScheduledTime());
                           aa.print("** Inspection Date: " + myInsp.getScheduleTime());
                           aa.print("************************* end of Inspection Date info");
                           }
              aa.print("");
    
              
};

/*------------------------------------------------------------------------------------------------------/
| Provide Accela Class / Object Information
/------------------------------------------------------------------------------------------------------*/
printClassDiagram(capId);


/*------------------------------------------------------------------------------------------------------/
| Test Code below
/------------------------------------------------------------------------------------------------------*/
aa.print("");
aa.print("*************************************************");
aa.print("**  Testing Starts Here                        **");
aa.print("*************************************************");
aa.print("");


