//********************************************************************************************************
//Script 		Script tracker 3 - Technology Fee
//Record Types:	ALL
//
//Event: 		Fee Assess AFTER
//
//Desc:		Whenever a fees are assessed, add an 8% technology fee before invoicing
//
//Created By: Silver Lining Solutions
//********************************************************************************************************
// Change Log
//         		Date		Name			Modification
//				08-09-2018	Chad			Initial Draft
//********************************************************************************************************

logDebug("start FAA:~/~/~/~ to add technology fee!");

sumFeesAssessedBeforeInvoiceAndAddTechFee();

logDebug("end  FAA:~/~/~/~ to add technology fee!");
