showMessage = true;
validateDocument();

function validateDocument(){

	
	if(docCapStatus && (docCapStatus == "Ready to Issue" || docCapStatus == "Revisions Required")){
		cancel = true;
		comment(" You can not edit the document because current records status is : " + docCapStatus);
	}
	
	
}
