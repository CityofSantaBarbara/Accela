// SAMPLE SCRIPT TO MAP GIS INFO TO AN ASI AND GET PROX ALERT!
showMessage = true;
logDebug("Script WTUB - Begin");
logDebug("BalanceDue = " + balanceDue);

var lookupString = appTypeString + "|" + wfTask + "|" + wfStatus;
logDebug("lookupString = " + lookupString);

var lookupValue = lookup("ValidationZeroBalance", lookupString);
logDebug("lookupValue = " + lookupValue);

if (lookupValue)
{
	logDebug("lookupValue matched in ValidationZeroBalance table");
	comment("This Workflow Action may not be completed while there is a Balance on the Record.");
	cancel = true;
}

logDebug("Script WTUB - End");
