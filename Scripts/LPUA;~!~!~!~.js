var licNum = getLPLicNum(capId);
var licType = getLPLicType(capId);

if (matches(currentUserID,"JJACKSON","ADMIN")) {
	showDebug = 3;
	showMessage= true;
	logDebug("In Lic Prof Update After");
	logDebug("licType = " + licType);
	logDebug("licNum = " + licNum);
}

var conType = false;
if(matches(licType,"Contractor","Electrical","Plumbing","Mechanical")) {
	conType = true;
}

var cslbMessage = null;
cslbMessage = externalLP_CA_AT(null,licType,true,true,capId);
if (conType && cslbMessage) {
	showMessage = true;
	comment(cslbMessage);
}
	
if (matches(currentUserID,"JJACKSON","ADMIN")) {
	logDebug("value of cslbMessage: " + cslbMessage);
}