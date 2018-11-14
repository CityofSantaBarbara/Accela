//********************************************************************************************************
//Script 		Email Staff on record creation
//Record Types:	Enforcement/Incident/Case/NA  Enforcement/Request/NA/NA
//
//Event: 		ASA CTRCA
//
//Desc:			When the record created in ACA, the system will email the Santa Barbara Staff 
// 				to inform them there the record has been created.  
//				
//
//Assumptions:
//				
//				Staff must have a valid email defined in their User Profile
//
//Psuedo Code:	
// 				
//
//Created By: Silver Lining Solutions 
//********************************************************************************************************
// Change Log
//         		Date		Name			Modification
//				10/15/2018	Michael 		Initial Development
//				
//											
//********************************************************************************************************
function emailToASIDepartmentUser(){
	var department = getAppSpecific("Department")
	aa.print("department = " + department)
	logDebug("department = " + department)
	
	if(!department) {
		logDebug("There is no department selected.");
		return false;
	}
	
	if(department.indexOf("BUILDING")>-1){
		department = "Building";
	}
	else if(department.indexOf("ARBORIST")>-1){
		department = "Arborist";
	}
	else if(department.indexOf("CREEKS")>-1){
		department = "Creeks";
	}
	else if(department.indexOf("ENV SERVICES")>-1){
		department = "Env Services";
	}
	else if(department.indexOf("FIRE")>-1){
		department = "Fire";
	}
	else if(department.indexOf("PUBLIC WORKS")>-1){
		department = "Public Works";
	}
	else if(department.indexOf("ZONING")>-1){
		department = "Zoning";
	}
	
	var lookupValue = lookup("ACA_DEPARTMENT_CONTACT_EMAIL", department);
	aa.print("lookupValue= "+ lookupValue);
	
	if(!lookupValue){
		logDebug("There is no contact email to be sent.");
		return false;	
	}

	//send Email to related user address
	var emailSubj=  "Record Creation : " + capIDString ;
	//var emailContent =" Please review this record " + "<a href=\"https:\//landuse-dt.santabarbaraca.gov\/CitizenAccessDev\/urlrouting.ashx?type=1000&agency=SANTABARBARA&capID1="+capId.getID1()+"&capID2="+capId.getID2()+"&capID3="+capId.getID3()+"&Module="+cap.getCapModel().getModuleName()+"&culture=en-US&FromACA=Y\">" + capIDString + "<\/a> with more detail."
	var emailContent =" Please review this record " + "<a href=\"https:\//landuse-web-dev.ch.sbcity.com\/portlets\/reports\/adHocReport.do?mode=deepLink&reportCommand=recordDetail&altID="+capIDString+"\">" +capIDString + "<\/a> with more detail."

	aa.sendMail(scriptAgencyEmailFrom, lookupValue, "", emailSubj,emailContent);

}
