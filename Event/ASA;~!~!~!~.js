// ********************************************************************************************************
// Script 		ASA:~/~/~/~.js
// Record Types: all
//
// Event: 	ASA	
//
// Desc:	this script is for app submit global actions
//
// Created By: Silver Lining Solutions
// ********************************************************************************************************
// Change Log
//         		Date		Name			Modification
//			06-11-2018	Jason			Initial Draft - copy GIS objects
//			08-08-2018	Chad			changed header, can't have slash star in headers
// ********************************************************************************************************

var GISService = "SANTABARBARA";



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

// ******************************** begin GIS attribs to Accela section
// ********************************  

// zoning 

mapGISAttribToASI("SANTABARBARA", "Zoning", "ZONE", "Zone");
// flood zone 
mapGISAttribToASI("SANTABARBARA", "FEMA Flood 2015", "FLD_ZONE", "Flood Zone");
// parcel sq ft
mapGISAttribToASI("SANTABARBARA", "Assessors Parcels", "Shape.STArea()", "Parcel Sq Ft");



