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

showMessage = true;
logDebug("Script Assessing Fees - Zero Balance Validation - Begin");
logDebug("BalanceDue = " + balanceDue);

if (controlString == "WorkflowTaskUpdateBefore")
	{var lookupString = appTypeString + "|" + wfTask + "|" + wfStatus;}
else if (controlString == "InspectionResultUpdateBefore")
	{var lookupString = appTypeString + "|" + inspGroup + "|" + InspType + "|" + inspResult;}

logDebug("lookupString = " + lookupString);

var lookupValue = lookup("ValidationZeroBalance", lookupString);
logDebug("lookupValue = " + lookupValue);

if (lookupValue && balanceDue > 0)
{
	logDebug("lookupValue matched in ValidationZeroBalance table");
	comment("This Inspection Action may not be completed while there is a Balance on the Record.");
	cancel = true;
}

logDebug("Script Assessing Fees - Zero Balance Validation - End");
