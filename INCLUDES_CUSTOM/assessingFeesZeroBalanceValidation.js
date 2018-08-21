//********************************************************************************************************
//Script 		Assessing Fees - Zero Balance Validation
//Record Types:	​*/*/*/*
//
//Event: 		this script may be triggered from IRSB & WTUB
//
//Desc:			For all Inspection Results, lookup in the ValidationZeroBalance Standard Choice table
//				to see if a zeroBalance validation should be performed.  The lookup uses the following 
//				'|' delimeted format:
//
//				For Workflow:
//				format : appTypeString + "|" + wfTask + "|" + wfStatus
//				example: Fire/Alarm System/NA/NA|Application Submittal|Accepted
//				example: Building/Residential/New/NA|Permit Issuance|Issued
//
//				For Inspections:
//				format : appTypeString + "|" + inspGroup + "|" + InspType + "|" + inspResult
//				example: Fire/Alarm System/NA/NA|FIRE_SA|Final|Passed
//				example: Fire/Sprinkler/NA/NA|
//				example: Building/Residential/New/NA|BLD Residential|Building Final|OK for Service
//
//Created By: Silver Lining Solutions 
//********************************************************************************************************
// Change Log
//         		Date		Name			Modification
//
//********************************************************************************************************
function assessingFeesZeroBalanceValidation()
{
	showMessage = true;
	logDebug("Script Assessing Fees - Zero Balance Validation - Begin");
	logDebug("BalanceDue = " + balanceDue);
	logDebug("controlString = " + controlString);
	
	var appTypeArray = appTypeString.split("/");
	
	// perform lookup with fully defined record type
	if (controlString == "WorkflowTaskUpdateBefore")
		{var lookupString = appTypeString + "|" + wfTask + "|" + wfStatus;}
	else if (controlString == "InspectionResultUpdateBefore" || controlString == "InspectionResultModifyBefore"
		  || controlString == "V360InspectionResultSubmitBefore")
		{var lookupString = appTypeString + "|" + inspGroup + "|" + inspType + "|" + inspResult;}

	logDebug("lookupString = " + lookupString);

	var lookupValue = lookup("ValidationZeroBalance", lookupString);
	logDebug("lookupValue = " + lookupValue);
	
	// perform lookup with 1 levels of wild cards
	if (!lookupValue)
	{
		logDebug("Script Assessing Fees - lookup with 1 wild card");
		if (controlString == "WorkflowTaskUpdateBefore")
			{var lookupString = appTypeArray[0] + "/" + appTypeArray[1] + "/" + appTypeArray[2] + "/*" + "|" + wfTask + "|" + wfStatus;}
		else if (controlString == "InspectionResultUpdateBefore" || controlString == "InspectionResultModifyBefore"
			  || controlString == "V360InspectionResultSubmitBefore")
			{var lookupString = appTypeArray[0] + "/" + appTypeArray[1] + "/" + appTypeArray[2] + "/*" + "|" + inspGroup + "|" + inspType + "|" + inspResult;}
		
		logDebug("lookupString = " + lookupString);

		var lookupValue = lookup("ValidationZeroBalance", lookupString);
		logDebug("lookupValue = " + lookupValue);	
	}

	// perform lookup with 2 levels of wild cards
	if (!lookupValue)
	{
		logDebug("Script Assessing Fees - lookup with 2 wild cards");
		if (controlString == "WorkflowTaskUpdateBefore")
			{var lookupString = appTypeArray[0] + "/" + appTypeArray[1] + "/*/*" + "|" + wfTask + "|" + wfStatus;}
		else if (controlString == "InspectionResultUpdateBefore" || controlString == "InspectionResultModifyBefore"
			  || controlString == "V360InspectionResultSubmitBefore")
			{var lookupString = appTypeArray[0] + "/" + appTypeArray[1] + "/*/*" + "|" + inspGroup + "|" + inspType + "|" + inspResult;}

		logDebug("lookupString = " + lookupString);

		var lookupValue = lookup("ValidationZeroBalance", lookupString);
		logDebug("lookupValue = " + lookupValue);	
	}

	// perform lookup with 3 levels of wild cards
	if (!lookupValue)
	{
		logDebug("Script Assessing Fees - lookup with 3 wild cards");
		if (controlString == "WorkflowTaskUpdateBefore")
			{var lookupString = appTypeArray[0] + "/*/*/*" + "|" + wfTask + "|" + wfStatus;}
		else if (controlString == "InspectionResultUpdateBefore" || controlString == "InspectionResultModifyBefore"
			  || controlString == "V360InspectionResultSubmitBefore")
			{var lookupString = appTypeArray[0] + "/*/*/*" + "|" + inspGroup + "|" + inspType + "|" + inspResult;}
		
		logDebug("lookupString = " + lookupString);

		var lookupValue = lookup("ValidationZeroBalance", lookupString);
		logDebug("lookupValue = " + lookupValue);	
	}

	if (lookupValue && balanceDue > 0)
	{
		logDebug("lookupValue matched in ValidationZeroBalance table");
		comment("This Action may not be completed while there is a Balance on the Record.");
		cancel = true;
	}

	logDebug("Script Assessing Fees - Zero Balance Validation - End");
}