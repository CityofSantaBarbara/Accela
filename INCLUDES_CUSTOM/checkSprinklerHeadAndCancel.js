//********************************************************************************************************
//Script 		script tracker 9 - Fire Sprinkler Monitoring
//Record Types:	F​ire!Sprinkler System!Commercial - NFPA 13!NA 
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
//				08-04-2018	Chad			Initial Draft
//********************************************************************************************************

function checkSprinklerHeadAndCancel() {
	logDebug("START of checkSprinklerHeadAndCancel");
	
	var numSprinklerHeads = AInfo["Total Number of Heads"] || 0;
	
	if (numSprinklerHeads > 6) {
		logDebug("checkSprinklerHeadAndCancel: number of sprinkler heads is greater than 6!");
		
		var sprkParent = getParent();
		
		if (sprkParent) {
			var siblingFireSpklrMonitorAlarm = childGetByCapType("Fire/Alarm System/NA/NA", sprkParent, capId)
			logDebug("checkSprinklerHeadAndCancel: got sibling of:"+siblingFireSpklrMonitorAlarm);

			var isSiblingFireSpklrMonitorAlarmClosed = taskStatus("Close","",siblingFireSpklrMonitorAlarm);
			logDebug("checkSprinklerHeadAndCancel: got Close wf status of:"+isSiblingFireSpklrMonitorAlarmClosed);

			if (isSiblingFireSpklrMonitorAlarmClosed != "Closed") {
				cancel = true;
				comment("<font color=red><b>Number of Sprinkler Heads is Greater than 6 AND Related Fire Alarm is Not Complete!</b></font>")
				logDebug("checkSprinklerHeadAndCancel: canceling!");
			}
		}
		else {
			cancel = true;
			comment("<font color=red><b>There is no Parent Building Record! Please relate and update Inspection Workflow Task manually!</b></font>")
			logDebug("checkSprinklerHeadAndCancel: canceling!");
		}
	}
	logDebug("END of checkSprinklerHeadAndCancel");
	return cancel;
}

