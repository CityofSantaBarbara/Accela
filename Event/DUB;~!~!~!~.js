//********************************************************************************************************
//Script 	 Script # 59 	
//Record Types:	​*/*/*/*
//
//Event: 		DUB

//
//Desc:			
//
//Assumptions:
//
//Psuedo Code:	
//
//Created By: Silver Lining Solutions 
//********************************************************************************************************
// Change Log
//         		Date		Name			Modification
//				08/15/2018	Eric 			Initial Development
// 				9/21/2018       Alec			use for testing. 
//********************************************************************************************************
logDebug("DUB - Begin- Script 59");

var recordDocArray = null;
var recDocModel = null;

recordDocArray = getDocumentList();
logDebug("recordDocArray = " + recordDocArray);
printObjProperties(recordDocArray);

for (i = 0; i < recordDocArray.length; i++) {
	recDocModel = recordDocArray[i];
	logDebug("************* doc Model ****************");
	printObjProperties(recDocModel);
}

logDebug("DUB - End - Script 59");
