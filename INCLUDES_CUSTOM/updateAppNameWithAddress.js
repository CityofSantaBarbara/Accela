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
//
// ********************************************************************************************************
function updateAppNameWithAddress() {

	var appName = cap.getSpecialText();

	var itemCap = capId;
	var fcapAddressObj = null;
   	var capAddressResult = aa.address.getAddressWithAttributeByCapId(itemCap);
   	if (capAddressResult.getSuccess()) {
   		var fcapAddressObj = capAddressResult.getOutput();
	}
   	else {
     		aa.print("**ERROR: Failed to get Address object: " + capAddressResult.getErrorType() + ":" + capAddressResult.getErrorMessage())
	}
	var addressAttrObj = null;
	var lCapAddress = null;
	var lAddrPrimary = null;

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

	if ( AInfo["ParcelAttribute.ZONING"] != "" ) {
		lCapAddress2 += ", " + AInfo["ParcelAttribute.ZONING"] + " ZONE";
	}
	
	if (appName == null) {
		appName = lCapAddress2;
	} else {
		if ( (appName.indexOf(lCapAddress) == -1) && (appName.indexOf(lCapAddress2) == -1) ) {
			//prevent multiple concatenation
			appName = lCapAddress2 + ": " + appName;
		}
	}

	//only update if value was changed
	if (appName != cap.getSpecialText()) {
		editAppName(appName);
		aa.print("we would set the app name to:"+appName);
	}

	return true;
}
