if (matches(currentUserID,"JJACKSON","ADMIN")) {
	showDebug = 3;
	showMessage= true;
	logDebug("In Lic Prof Add After");
	logDebug("licType = " + licType);
	logDebug("licNum = " + licNum);
}

var conType = false;
if(matches(licType,"Contractor","Electrical","Plumbing","Mechanical")) {
	conType = true;
}

var cslbMessage = null;
cslbMessage = externalLP_CA_AT(licNum,licType,true,true,capId);
if (conType && cslbMessage) {
	showMessage = true;
	comment(cslbMessage);
}

if (matches(currentUserID,"JJACKSON","ADMIN")) {
	logDebug("value of cslbMessage: " + cslbMessage);
}