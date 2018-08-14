//********************************************************************************************************
//Script 		73 FIR - Close out cases 
//Record Types:	Fire!~!~!~ 
//
//Event: 		InspectionResultSubmitAfter
//
//Desc:			Details for the scrip requirements identified with group webex: 
//              Trigger: Inspection Result After 
//              Criteria Record Types: All Fire Records – no exceptions Inspection Group: Inspection Types: ‘Fire Final’ 
//				Inspection Result: ‘Passed’ 
//				Action Close Workflow Task Task = ‘Inspection’ 
//				Status = ‘Final Inspection Passed’ 
//				Task = ‘Close’ Status = ‘Closed’ Close Record Application Status = ‘Closed’
//
//Created By: ASH 8-14-2018
//********************************************************************************************************
// Change Log
//         		Date		Name			Modification
//				08-14-2018	Alec			Initial Draft
//********************************************************************************************************


logDebug("start of IRSA:Fire!~!~!~");

if (inspType == "Fire Final" && inspResult == "Passed") {
	logDebug("Criteria met at inspection type of fire final");
	closeTask("Inspection","Final Inspection Passed","Auto Closed by Script","Auto Closed by Script");
	closeTask("Close","Closed","Auto Closed by Script","Auto Closed by Script");
	updateAppStatus("Closed","Auto Closed by Script");
	}


logDebug("The Middle of the Script");





logDebug("end of IRSA:Fire!~!~!~");
