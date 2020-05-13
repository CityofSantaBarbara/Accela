
//********************************************************************************************************
//Script 		Lock Document
//Record Types:	All
//
//Event: 		DUB  DRUB  DRAB  DUTB  DDB DRDB
//
//Desc:			When user try to issue the Building records ,system will check wheather there is an Fire 
// 				Final Inspection or not and the status of inspection should be resulted as passed.  
//				
//
//Assumptions:
//				
//				
//
//Psuedo Code:	
// 				
//
//Created By: Civic Tech Pro
//********************************************************************************************************
// Change Log
//         		Date		Name			Modification
//				12/16/2018	Michael 		Initial Development
//				
//											
//********************************************************************************************************

function validateDocument(){
//cancel = true;
//comment(capStatus )
	if(capStatus && (capStatus == "Revisions Required")){
		cancel = true;
		comment(" You can not edit the document because current records status is : " + capStatus );
	}
	
	
}

