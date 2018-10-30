//********************************************************************************************************
//Script 		Script tracker 37
//Record Types:	Enforcement!Request!NA!NA 
//
//Event: 		ASA
//
//Desc:			Assign user to workflow task 'Request Status'
//					
//				Upon application submittal, system will be assigned a user which from an ASI dropdownlist 'Department'
//				and sent the email to this user.
//
//Created By: Silver Lining Solutions
//********************************************************************************************************
// Change Log
//         		Date		Name			Modification
//			08-15-2018	Michael			Initial Draft
//********************************************************************************************************

//logDebug("start of ASA:Enforcement!Request!NA!NA");
if(!publicUser){
emailToASIDepartmentUser();
}
//logDebug("end of ASA:Enforcement!Request!NA!NA");
