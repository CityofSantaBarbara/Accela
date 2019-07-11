//********************************************************************************************************
//Script 		copyAppSpecificInfo
//Event: 		
//Desc:			helper function to copy ASI  
//Created By: Silver Lining Solutions
//********************************************************************************************************
// Change Log
//         		Date        Name          Modification
//            07/10/2019	Chad          Created
//********************************************************************************************************
function copyAppSpecificInfo(srcCapId, targetCapId)
{
	//1. Get Application Specific Information with source CAPID.
	var  appSpecificResult = aa.appSpecificInfo.getByCapID(srcCapId);
	if (appSpecificResult.getSuccess()){
		appSpecificInfo = appSpecificResult.getOutput();
	}
	else return;
	
	if (appSpecificInfo == null || appSpecificInfo.length == 0)
	{
		return;
	}

	//2. Set target CAPID to source Specific Information.
	for (loopk in appSpecificInfo)
	{
		var sourceAppSpecificInfoModel = appSpecificInfo[loopk];
		sourceAppSpecificInfoModel.setPermitID1(targetCapId.getID1());
		sourceAppSpecificInfoModel.setPermitID2(targetCapId.getID2());
		sourceAppSpecificInfoModel.setPermitID3(targetCapId.getID3());	
		//3. Edit ASI on target CAP (Copy info from source to target)
		var appSpecEditOK = aa.appSpecificInfo.editAppSpecInfoValue(sourceAppSpecificInfoModel);
		if (appSpecEditOK.getSuccess()) {
			logDebug("app specific "+sourceAppSpecificInfoModel.checkboxDesc+" Added!");
		} else {
			logDebug("app specific "+sourceAppSpecificInfoModel.checkboxDesc+" NOT Added!");
		}
	}
}
