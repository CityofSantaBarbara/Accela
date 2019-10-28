// ********************************************************************************************************
// Script 		updateAppNameWithAddress.js
// Record Types: PLN
//
// Event: 	ASA	
//
// Desc:	Update the application name to include address and zoning information
//			for Issue 30 of city issue tracking list
//
// Created By: Silver Lining Solutions
// ********************************************************************************************************
// Change Log
//         		Date		Name		Modification
//				10/17/2019	Chad		Orig
//				10/28/2019	Chad		Added Building, Fire, PublicWorks, Enforcement logic
//
// ********************************************************************************************************
function updateAppNameWithAddress() {
logDebug("start of updateAppNameWithAddress");
	var itemCap = null;

	if (arguments.length == 1) itemCap = arguments[0]; // use cap ID specified in args
	else var itemCapID = capId;
	
	var itemAltID			= itemCapID.getCustomID();
	var itemCap				= aa.cap.getCap(itemCapID).getOutput();
	var itemAppTypeResult	= itemCap.getCapType();
	var itemAppTypeString	= appTypeResult.toString();
	var itemAppTypeArray	= appTypeString.split("/");
	var appName				= itemCap.getSpecialText();
	var fcapAddressObj		= null;
	var addressAttrObj		= null;
	var lCapAddress			= "";
	var lAddrPrimary		= null;

   	var capAddressResult	= aa.address.getAddressWithAttributeByCapId(itemCapID);
   	if (capAddressResult.getSuccess()) {
   		var fcapAddressObj	= capAddressResult.getOutput();
	}
   	else {
     		logDebug("**ERROR: Failed to get Address object: " + capAddressResult.getErrorType() + ":" + capAddressResult.getErrorMessage())
	}

  	for (i in fcapAddressObj)
  	{
		lCapAddress = fcapAddressObj[i].getAddressDescription();
		lAddrPrimary = fcapAddressObj[i].getPrimaryFlag();
		
		if (lAddrPrimary) break;
	}	

	lCapAddress2 = lCapAddress;
	if (lCapAddress) {
		// for some reason the regex utils do not work with this address desc so... looping through old fashioned way!		
		var i = 0;
		while (lCapAddress2.indexOf(" ") >= 0 && i<100) {
			lCapAddress2 = lCapAddress2.replace("  "," ");
			i++;
			if (i == 99) break;  // don't ever want to get stuck here
		}
	}
	
	if (appName == null) { appName = ""; }
	if ( (appName.indexOf(lCapAddress) == -1) && (appName.indexOf(lCapAddress2) == -1) ) {
		//prevent multiple concatenation
		
		if ( itemAppTypeArray[0] == 'Building' ) {
			logDebug("update for Building!");
			appName = lCapAddress2 + ": " + appName;
		}
		else if ( itemAppTypeArray[0] == 'Planning' ) {
			logDebug("update for Planning!");
			if ( AInfo["ParcelAttribute.ZONING"] != "" ) {
				appName = lCapAddress2 + ", " + AInfo["ParcelAttribute.ZONING"] + " ZONE: " + appName;
			} else {
				appName = lCapAddress2 + ": " + appName;
				
			}
		}
		else if ( itemAppTypeArray[0] == 'Enforcement' ) {
			logDebug("update for Enforcement!");
			if ( AInfo["ParcelAttribute.ZONING"] != "" ) {
				appName = lCapAddress2 + ", " + AInfo["ParcelAttribute.ZONING"] + " ZONE: " + appName;
			} else {
				appName = lCapAddress2 + ": " + appName;
				
			}
		}
		else if ( itemAppTypeArray[0] == 'Fire' ) {
			logDebug("update for Fire!");
			appName = lCapAddress2 + ": " + appName;
		}
		else if ( itemAppTypeArray[0] == 'PublicWorks' ) {
			logDebug("update for PublicWorks!");
			appName = lCapAddress2 + ": " + appName;
		}
		else { //default
			appName = lCapAddress2 + ": " + appName;
		}
	}

	//only update if value was changed
	if (appName != cap.getSpecialText()) {
		editAppName(appName);
		logDebug("we would set the app name to:"+appName);
	}
	else {
		logDebug("app name update not required");
	}

logDebug("end of updateAppNameWithAddress");
	return true;
}
