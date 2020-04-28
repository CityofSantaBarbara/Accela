//********************************************************************************************************
//Script 		Email Staff on Document Update
//Record Types:	*/*/*/*
//
//Event: 		DUA
//
//Desc:			When a Revision Required Document gets resubmitted thru ACA. Email the Santa Barbara Staff 
// 				that is assigned to the Plan Distributed Workflow Task. For BLD cases ONLY, 
//        Also set the Workflow Task Plans 
//				Distribution Status to Revisions Received.
//
//Assumptions:
//				Staff must always be assigned to Plans Distribution 
//				Staff must have a valid email defined in their User Profile
//
//Psuedo Code:	
// 				use Document Update Notification template
//
//Created By: Silver Lining Solutions 

// commented emaiStaffOnDocUpdate as it is throwing and error and stopping the event!

emailStaffOnDocUpdate();

if(!publicUser){
    SendDataTicketAppealsRequestUploadedEmail();
    SendDataTicketAdminCitationUploadedEmail();
}
