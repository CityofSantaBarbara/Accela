//********************************************************************************************************
//Script 		settingsLookup
//Record Types:	​n/a
//
//Event: 		n/a
//
//Desc:			given a lookup table name (std choice table), lookupValue, and the application type, search 
// 				through the lookup table to see if the the value is found and return the corresponding result
//				this function will look for a match in the look up table by starting with the 
//				fully defined application type and if not found continue to apply a wild cards
//				until a match is made.  this strategy provides a heirarchial approach where 
//				fully identified apptypes definitions will take precidence over the wild card defoinitions.
//Created By: Silver Lining Solutions 
//********************************************************************************************************
// Change Log
//         		Date		Name			Modification
//				9/21/2018	Eric			Original Development
//********************************************************************************************************
function appTypePriorityLookup(lookupTableName,lookupValue,appType)
{
	showMessage = true;
	logDebug("appTypePriorityLookup - Begin");
	var lookupResult = false;
	
	var appTypeArray = appType.split("/");
	
	// start with full appType
	var lookupString = appTypeString + "|" + lookupValue;
	logDebug("lookupString = " + lookupString);
	var lookupResult = lookup(lookupTableName, lookupString);
	logDebug("Full lookupValue = " + lookupValue);
	
	// perform lookup with 1 levels of appType wild cards
	if (!lookupResult)
	{
		lookupString = appTypeArray[0] + "/" + appTypeArray[1] + "/" + appTypeArray[2] + "/*" + "|" + lookupValue;
		logDebug("lookupString = " + lookupString);
		lookupResult = lookup(lookupTableName, lookupString);
		logDebug("1 Wild lookupValue = " + lookupValue);	
	}

	// perform lookup with 2 levels of appType wild cards
	if (!lookupResult)
	{
		lookupString = appTypeArray[0] + "/" + appTypeArray[1] + "/*/*" + "|" + lookupValue;
		logDebug("lookupString = " + lookupString);
		lookupResult = lookup(lookupTableName, lookupString);
		logDebug("2 Wild lookupValue = " + lookupValue);	
	}

	// perform lookup with 3 levels of appType wild cards
	if (!lookupResult)
	{
		lookupString = appTypeArray[0] + "/*/*/*" + "|" + lookupValue;
		logDebug("lookupString = " + lookupString);
		lookupResult = lookup(lookupTableName, lookupString);
		logDebug("3 Wild lookupValue = " + lookupValue);	
	}

	// perform lookup with 4 levels of appType wild cards
	if (!lookupResult)
	{
		lookupString = "*/*/*/*" + "|" + lookupValue;
		logDebug("lookupString = " + lookupString);
		lookupResult = lookup(lookupTableName, lookupString);
		logDebug("3 Wild lookupValue = " + lookupValue);	
	}

	logDebug("appTypePriorityLookup - End");
	return lookupResult;
}