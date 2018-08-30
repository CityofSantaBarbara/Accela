//********************************************************************************************************
//Script 		
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
//********************************************************************************************************
logDebug("DUB - Begin");
var recordDocArray = null;
recordDocArray = getDocumentList();
logDebug("recordDocArray = " + recordDocArray);
printObjProperties(recordDocArray);
logDebug("DUB - End");
