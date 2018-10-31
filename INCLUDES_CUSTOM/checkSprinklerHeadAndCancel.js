//********************************************************************************************************
//Script 		script tracker 9 - Fire Sprinkler Monitoring
//Record Types:	Fire!Sprinkler System!Commercial - NFPA 13!NA 
//
//Event: 		this script may be triggered from WTUB and IRSA (b/c IRSA can close tasks and records)
//
//Desc:			If a NFPA 13 system has more than 6 sprinkler heads, the sprinkler permit cannot 
//				be finalled until a Fire Sprinkler Monitoring Alarm permit is finalled under the same
//				parent commercial building permit.
//
//Created By: Silver Lining Solutions
//********************************************************************************************************
// Change Log
//         		Date		Name			Modification
//			08-04-2018	Chad			Initial Draft
//			10-31-2018	Chad			Fixed bug where getChildren array was not handled properly
//********************************************************************************************************

function checkSprinklerHeadAndCancel() {
	logDebug("START of checkSprinklerHeadAndCancel");
	
	var numSprinklerHeads = AInfo["Total Number of Heads"] || 0;
	
	if (numSprinklerHeads > 6) {
		logDebug("checkSprinklerHeadAndCancel: number of sprinkler heads is greater than 6!");
		
		var sprkFireAlarmSys = getChildren("Fire/Alarm System/NA/NA");
		
		if (sprkFireAlarmSys) {
			var isSiblingFireSpklrMonitorAlarmClosed = taskStatus("Close","",sprkFireAlarmSys[0]);
			logDebug("checkSprinklerHeadAndCancel: got Close wf status of:"+isSiblingFireSpklrMonitorAlarmClosed);

			if (isSiblingFireSpklrMonitorAlarmClosed != "Closed") {
				cancel = true;
				comment("<font color=red><b>Number of Sprinkler Heads is Greater than 6 AND Related Fire Alarm is Not Complete!</b></font>")
				logDebug("checkSprinklerHeadAndCancel: canceling!");
			}
		}
		else {
			cancel = true;
			comment("<font color=red><b>There is no Alarm System related to this Record! Please relate and update Inspection Workflow Task manually!</b></font>")
			logDebug("checkSprinklerHeadAndCancel: canceling!");
		}
	}
	logDebug("END of checkSprinklerHeadAndCancel");
	return cancel;
}
