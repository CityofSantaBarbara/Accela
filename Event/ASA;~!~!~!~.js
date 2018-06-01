if (matches(currentUserID,"JJACKSON","ADMIN")) {
	showDebug = 3;
	showMessage= true;
}
// call CSLB Interface for LP
try {
	var newLicNum = false; 
	newLicNum = getLPLicNum(capId);
	var newLicType = false; 
	newLicType = getLPLicType(capId);
	var conType = false;
	if(matches(newLicType,"Contractor","Electrical","Plumbing","Mechanical")) {
		conType = true;
	}

	var cslbMessage = null;
	cslbMessage = externalLP_CA_AT(newLicNum,newLicType,true,true,capId);
	if (conType && cslbMessage) {
		showMessage = true;
		comment(cslbMessage);
	}

}
catch (err) {
	logDebug("A JavaScript Error occurred: ASA;DS~!~!~!~ - CSLB Interface" + err.message);
} ;
//Copy Parcel GIS Objects to Record using function copyParcelGisObjects()
 try{
      if(!publicUser){
            copyParcelGisObjects();
      }
} catch (err) {
      logDebug("A JavaScript Error occurred: ASA:*/*/*/*: copyParcelGisObjects()" + err.message);
      logDebug(err.stack);
};

//Proximity Alert for High Fire Hazard Areas
var vIsWithinProximity = getGISInfo("SANTABARBARA","High Fire Hazard Areas","Assessment","yes");

if (vIsWithinProximity == true) {
		showMessage = true;
		//cancel = true; 
		comment("<B><Font Color=RED>Please be advised, this property is within a High Fire Hazard Area</B></Font>.");
}

