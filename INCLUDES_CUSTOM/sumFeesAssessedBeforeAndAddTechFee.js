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

	var checkFeesArr = [];
	checkFeesArr = loadFees();
	
	logDebug("printing check fees array -----------");
	for (var x in checkFeesArr) {
		printObjProperties(checkFeesArr[x]);
	}

	comment("<font color=red><b>FEE TOTAL = "+FeeItemsTotalFee+"</b></font>");
	
	logDebug("end sumFeesAssessedBeforeAndAddTechFee");
}
