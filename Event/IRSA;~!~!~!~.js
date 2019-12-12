// ********************************************************************************************************
// Script 		IRSA:~/~/~/~.js
// Record Types: all
//
// Event: 	Inspection Result Submit After	
//
// Desc:	this script is for inspection result submit global actions
//
// Created By: Silver Lining Solutions
// ********************************************************************************************************
// Change Log
//         		Date	Name			Modification
//			11-13-2018  Chad			Initial Draft - Script 91
// ********************************************************************************************************

//script 91
var thisExpModelList = aa.expiration.getLicensesByCapID(capId);

if (thisExpModelList.getSuccess()) {
	var thisExpModel = thisExpModelList.getOutput();
	var thisExp = thisExpModel.getB1Expiration();
	if (thisExp != null ) { 
		var thisExpCurrentStatus = thisExpModel.getExpStatus();
//		if (!thisExpCurrentStatus || thisExpCurrentStatus == "" ) {
			thisExpModel.setExpStatus("Active");
			thisB1ExpModel = thisExpModel.getB1Expiration();
			var result = aa.expiration.editB1Expiration(thisB1ExpModel);

			var daysToAdd = lookup("INSPECTION_RECORD_EXPIRES_IN_DAYS",appTypeArray[0]);
			if (daysToAdd) {
				var tmpDate = new Date();
				var newExpDate = dateAdd(tmpDate,daysToAdd);
				
				thisExpModel.setExpDate(aa.date.parseDate(newExpDate));
				var result = aa.expiration.editB1Expiration(thisExpModel.getB1Expiration());
				comment("setting active AND setting expire date to:"+newExpDate);
			}
//		} 
	}
}

// added by Gray Quarter for Issue 40
handleFinalInspectionMap(capId);