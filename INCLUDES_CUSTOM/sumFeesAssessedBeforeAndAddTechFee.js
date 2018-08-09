//********************************************************************************************************
//Script 		Script tracker 3 - Technology Fee
//Record Types:	ALL
//
//Event: 		FAB and ASA
//
//Desc:			Whenever a fees are assessed, add an 8% technology fee before invoicing
//
//Created By: Silver Lining Solutions
//********************************************************************************************************
// Change Log
//         		Date		Name			Modification
//				08-09-2018	Chad			Initial Draft
//********************************************************************************************************

function sumFeesAssessedBeforeAndAddTechFee () {
	logDebug("start sumFeesAssessedBeforeAndAddTechFee");

	logDebug(" globals available to this event: ");
	
	logDebug("************** FeeGroupNamesArray ******************");
	printObjProperties(FeeGroupNamesArray);
	
	logDebug("************** FeeGroupQuantityArray ******************");
	printObjProperties(FeeGroupQuantityArray);
	
	logDebug("************** FeeItemsList ******************");
	printObjProperties(FeeItemsList);
	
	logDebug("************** FeeItemsQuantityList ******************");
	printObjProperties(FeeItemsQuantityList);
	
	logDebug("************** NumberOfFeeItems ******************");
	printObjProperties(NumberOfFeeItems);
 
	logDebug("end sumFeesAssessedBeforeAndAddTechFee");
}
