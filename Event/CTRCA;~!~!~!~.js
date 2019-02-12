//********************************************************************************************************
//Script 		CTRC:~/~/~/~.js
//Record Types:	all
//
//Event: 		
//
//Desc:		for aca 
//
//Created By: Silver Lining Solutions
//********************************************************************************************************
// Change Log
//         		Date		Name			Modification
//				      Jason			Initial Draft
//			08-08-2018	Chad			changed header
//			02-12-2018	Chad			Fixed UAT issue 319 by adding exp logic here.
//********************************************************************************************************
      
      
//Needed to get GIS feature associated when created by ACA
//Copy Parcel GIS Objects to Record using function copyParcelGisObjects()
try{
      copyParcelGisObjects();
} catch (err) {
      logDebug("A JavaScript Error occurred: CTRCA:~/~/~/~: copyParcelGisObjects()" + err.message);
      logDebug(err.stack);
};


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
