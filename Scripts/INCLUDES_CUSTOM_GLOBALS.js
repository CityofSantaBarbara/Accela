/*------------------------------------------------------------------------------------------------------/
| Program : INCLUDES_CUSTOM_GLOBALS.js
| Event   : N/A
|
| Usage   : Accela Custom Includes.  Required for all Custom Parameters
|
| Notes   : 
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

if (matches(currentUserID, "ADMIN", "JJACKSON", "CWEIFFENBACH", "EKOONTZ","AHARDY","EJUST","MDOUVILLE","ANARES","TBOLTON")) {
showDebug = 3;
showMessage = true;
}
