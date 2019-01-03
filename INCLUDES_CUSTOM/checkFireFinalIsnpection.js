//********************************************************************************************************
//Script 		Check Fire Final Inspection
//Record Types:	Building/Commercial/New/NA  Building/Commercial/Addition/NA Building/Commercial/Alteration/NA
//
//Event: 		WTUB 
//
//Desc:			When user try to issue the Building records ,system will check wheather there is an Fire 
// 				Final Inspection or not and the status of inspection should be resulted as passed.  
//				
//
//Assumptions:
//				
//				
//
//Psuedo Code:	
// 				
//
//Created By: Civic Tech Pro
//********************************************************************************************************
// Change Log
//         		Date		Name			Modification
//				12/10/2018	Michael 		Initial Development
//				
//											
//********************************************************************************************************

function checkFireFinalInspection(){
	var inspArrObj = aa.inspection.getInspections(capId);
	if(inspArrObj.getSuccess()){

		inspArr = inspArrObj.getOutput();
		if(inspArr.length < 1){
			cancel = true;
			aa.print("<font color=red><b>You don't have a Fire Department Final Inspection, please add one.</b></font>");
		}

		for(var i=0;i<inspArr.length;i++){

			var inspModScript = inspArr[i];
			var inspMod = inspModScript.getInspection();
			//aa.print(inspMod.getInspectionGroup()+","+inspMod.getInspectionType())
			if(inspMod.getInspectionGroup() !="BLD GENERAL" && inspMod.getInspectionType() !="Fire Final" ){
				cancel = true;
				aa.print("<font color=red><b>You don't have a Fire Department Final Inspection, please add one.</b></font>");
			}
			//aa.print(inspMod.getInspectionStatus())
			
			if(inspMod.getInspectionStatus()!="Passed"){
				cancel = true;
				aa.print("<font color=red><b>Please result the Fire Department Final Inspection as Passed.</b></font>");
                                logDebug("CapID = "+capId.getCustomID()+". Please result the Fire Department Final Inspection as Passed.");
			}
		}
	}
}
