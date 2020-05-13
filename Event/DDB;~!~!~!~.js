showMessage = true;
validateDocument();

function validateDocument() {

	try {
		//aa.print("capstatus="+docCapStatus );
		if (docCapStatus && (docdocCapStatus == "Revisions Required")) {
			cancel = true;
			aa.print(" You can not edit the document because current records status is : " + docCapStatus);
		}
	} catch (err) {
		aa.print("Error " + err.message);
	}
}
