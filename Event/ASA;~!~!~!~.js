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
//			11-12-2018	Chad			Added logic for Script 90
// ********************************************************************************************************
logDebug("Start of ASA:*/*/*/*");
updateAppNameWithAddress();

var GISService = "SANTABARBARA";

var thisExpModelList = aa.expiration.getLicensesByCapID(capId);

if (thisExpModelList.getSuccess()) {
	var thisExpModel = thisExpModelList.getOutput();
	var thisExp = thisExpModel.getB1Expiration();
	if (thisExp != null ) { 
		var thisExpCurrentStatus = thisExpModel.getExpStatus();
		if (!thisExpCurrentStatus || thisExpCurrentStatus == "" ) {
			thisExpModel.setExpStatus("Active");
			thisB1ExpModel = thisExpModel.getB1Expiration();
			var result = aa.expiration.editB1Expiration(thisB1ExpModel);

			var daysToAdd = lookup("INITIAL_RECORD_EXPIRES_IN_DAYS",appTypeArray[0]);
			if (daysToAdd) {
				var tmpDate = new Date();
				var newExpDate = dateAdd(tmpDate,daysToAdd);
				
				thisExpModel.setExpDate(aa.date.parseDate(newExpDate));
				var result = aa.expiration.editB1Expiration(thisExpModel.getB1Expiration());
				comment("setting active AND setting expire date to:"+newExpDate);

				// update asi 
				logDebug("updating ASI Application Expiration Date to:" + newExpDate);
				editAppSpecific("Application Expiration Date",newExpDate);
			}
		} 
	}
}


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

//mapGISAttribToASI("SANTABARBARA", "Zoning", "ZONE", "Zone");
// flood zone 
//mapGISAttribToASI("SANTABARBARA", "FEMA Flood 2015", "FLD_ZONE", "Flood Zone");
// parcel sq ft
//mapGISAttribToASI("SANTABARBARA", "Assessors Parcels", "Shape.STArea()", "Parcel Sq Ft");

logDebug("END of ASA:*/*/*/*");

