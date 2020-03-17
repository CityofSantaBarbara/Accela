// GQ Ticket #270   


var capStatus = cap.getCapStatus();

if(capStatus != "Issued" && capStatus != "Permit Issued"){
	//cancel scheduling
	//logDebug("You Can't Schedule This!!!");	
	showMessage = true;
	showDebug = false;
	comment("Inspections may not be scheduled until a permit has been issued!");
	cancel = true;
}
