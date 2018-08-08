//Script 		Assessing Fees - Zero Balance Validation
//Record Types:	​*/*/*/*

//Event: 		IRSB

//Desc:			For all Inspection Results, lookup in the ValidationZeroBalance Standard Choice table
//				to see if a zeroBalance validation should be performed.  The lookup uses the following 
//				'|' delimeted format:
//				format : appTypeString + "|" + inspGroup + "|" + InspType + "|" + inspResult
//				example: Fire/Alarm System/NA/NA|FIRE_SA|Final|Passed
//				example: Fire/Sprinkler/NA/NA|
//				example: Building/Residential/New/NA|BLD Residential|Building Final|OK for Service
//
//Created By: Silver Lining Solutions

showMessage = true;
logDebug("Script IRSB - Begin");
logDebug("BalanceDue = " + balanceDue);

var lookupString = appTypeString + "|" + inspGroup + "|" + InspType + "|" + inspResult;
logDebug("lookupString = " + lookupString);

var lookupValue = lookup("ValidationZeroBalance", lookupString);
logDebug("lookupValue = " + lookupValue);

if (lookupValue)
{
	logDebug("lookupValue matched in ValidationZeroBalance table");
	comment("This Inspection Action may not be completed while there is a Balance on the Record.");
	cancel = true;
}

logDebug("Script IRSB - End");
