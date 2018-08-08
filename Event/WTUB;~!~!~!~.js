//Script 		Assessing Fees - Zero Balance Validation
//Record Types:	​*/*/*/*

//Event: 		WTUB

//Desc:			For all workflow actions, lookup in the ValidationZeroBalance Standard Choice table
//				to see if a zeroBalance validation should be performed.  The lookup uses the following 
//				'|' delimeted format:
//				format : appTypeString + "|" + wfTask + "|" + wfStatus
//				example: Fire/Alarm System/NA/NA|Application Submittal|Accepted
//				example: Building/Residential/New/NA|Permit Issuance|Issued
//
//Created By: Silver Lining Solutions

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
