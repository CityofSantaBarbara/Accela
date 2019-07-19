// stub out WTUA for enforcement records
cloneREQToENF();
if ( wfTask == "Investigation Findings" && wfStatus == "2.2 Yes-NOV Published") {
	var staffAsgnd = getAssignedStaff();
	scheduleInspection("Enforcement Follow-up",30,staffAsgnd,null,"workflow changed to 2.2 Yes-NOV Published.  Follow-up needed");
}
