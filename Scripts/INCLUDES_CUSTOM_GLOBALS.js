/*------------------------------------------------------------------------------------------------------/
| Program : INCLUDES_CUSTOM_GLOBALS.js
| Event   : N/A
|
| Usage   : Accela Custom Includes.  Required for all Custom Parameters
|
| Notes   : 
|              11-02-2018: CW - added scriptAgencyEmailFrom so that we can use this to 
|                               send all email message from scripts FROM this variable
|
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| Custom Parameters
|	Ifchanges are made, please add notes above.
/------------------------------------------------------------------------------------------------------*/
feeEstimate=false;
if(vEventName.equals("FeeEstimateAfter4ACA")) 
	feeEstimate=true;
/*------------------------------------------------------------------------------------------------------/
| END Custom Parameters
/------------------------------------------------------------------------------------------------------*/

if (matches(currentUserID, "LCOOPER","ADMIN", "JJACKSON", "CWEIFFENBACH", "EKOONTZ","AHARDY","EJUST","MDOUVILLE","ANARES","TBOLTON","MDurousseau", "DKATO","JSCHOMP")) 
{
showDebug = 3;
showMessage = true;
}
else {
showDebug = false;
}

var scriptAgencyEmailFrom = lookup("SCRIPT_EMAIL_FROM", "AGENCY_FROM");
