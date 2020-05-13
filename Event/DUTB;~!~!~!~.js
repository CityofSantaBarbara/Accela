showMessage = true;
validateDocument();

function validateDocument(){

	if(docCapStatus && (docdocCapStatus == "Revisions Required")){
		cancel = true;
		comment(" You can not edit the document because current records status is : " + docCapStatus);
	}
	
	
}
