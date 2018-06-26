/*------------------------------------------------------------------------------------------------------/
| Accela Automation
| Accela, Inc.
| Copyright (C): 2012
|
| Program : INCLUDES_CUSTOM.js
| Event   : N/A
|
| Usage   : Custom Script Include.  Insert custom EMSE Function below and they will be 
|	    available to all master scripts
|
| Notes   :
|
/------------------------------------------------------------------------------------------------------*/
function doScriptActions() {
	include(prefix + ":" + "*/*/*/*");
	if (typeof(appTypeArray) == "object") {
		include(prefix + ":" + appTypeArray[0] + "/*/*/*");
		include(prefix + ":" + appTypeArray[0] + "/" + appTypeArray[1] + "/*/*");
		include(prefix + ":" + appTypeArray[0] + "/" + appTypeArray[1] + "/" + appTypeArray[2] + "/*");
		include(prefix + ":" + appTypeArray[0] + "/*/" + appTypeArray[2] + "/*");
		include(prefix + ":" + appTypeArray[0] + "/*/" + appTypeArray[2] + "/" + appTypeArray[3]);
		include(prefix + ":" + appTypeArray[0] + "/*/*/" + appTypeArray[3]);
		include(prefix + ":" + appTypeArray[0] + "/" + appTypeArray[1] + "/*/" + appTypeArray[3]);
		include(prefix + ":" + appTypeArray[0] + "/" + appTypeArray[1] + "/" + appTypeArray[2] + "/" + appTypeArray[3]);
	}
}
