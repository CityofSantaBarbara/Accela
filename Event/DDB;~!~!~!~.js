showMessage = true;
validateDocument();

function validateDocument(){
if (typeof(docCapStatus) != 'undefined')
      {
	//aa.print("capstatus="+docCapStatus );
	if(docCapStatus && (docCapStatus == "Ready to Issue" || docCapStatus == "Revisions Required")){
		cancel = true;
		comment(" You can not edit the document because current records status is : " + docCapStatus);
	        }
      }
	
}
