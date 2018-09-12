//********************************************************************************************************
//Script 		Script tracker 37
//Record Types:	Planning!Application!General!NA 
//
//Event: 		ASA
//
//Desc:			Add Application Date into ASI field
//					
//				Upon application submittal, I would like to have ASI fields be 
//				automatically populated with the date that the application was submitted.
//
//Created By: Silver Lining Solutions
//********************************************************************************************************
// Change Log
//         		Date		Name			Modification
//				08-15-2018	Chad			Initial Draft
//********************************************************************************************************

logDebug("start of ASA:Planning!Application!General!NA");

useAppSpecificGroupName=true;
var dNow = "" + dateAdd(null,0); 
editAppSpecific("GMP RESIDENTIAL 2.Update Date",dNow)
editAppSpecific("GMP NONRESIDENTIAL 2.Update Date",dNow)

if (publicUser) {
  editAppSpecific("GMP RESIDENTIAL 2.Updated By",publicUserID);
  editAppSpecific("GMP NONRESIDENTIAL 2.Updated By",publicUserID);
}
else {
  editAppSpecific("GMP RESIDENTIAL 2.Updated By",currentUserID);
  editAppSpecific("GMP NONRESIDENTIAL 2.Updated By",currentUserID);
}
  
  

useAppSpecificGroupName=false;

logDebug("end of ASA:Planning!Application!General!NA");
