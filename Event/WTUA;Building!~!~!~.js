// WTUA:Building/*/*/*

/* following block of code was in Accela but not Github... it was added by "ADMIN" 12-22-2016
if (wfTask == "Permit Issuance" && wfStatus == "Issued")
editAppSpecific("Permit Issued Date", sysDateMMDDYYYY);
if (wfTask == "Permit Issuance" && wfStatus == "Issued")
editAppSpecific("Permit Expiration Date", dateAdd(null, 180));
if (wfTask == "Permit Status" && wfStatus == "Permit Issued")
editAppSpecific("Permit Issued Date", sysDateMMDDYYYY);
if (wfTask == "Permit Status" && wfStatus == "Permit Issued")
editAppSpecific("Permit Expiration Date", dateAdd(null, 180));
if (wfTask == "Permit Issuance" && wfStatus == "Issued")
licEditExpInfo(null, AInfo["Permit Expiration Date"]);
if (wfTask == "Permit Status" && wfStatus == "Permit Issued")
licEditExpInfo(null, AInfo["Permit Expiration Date"]);
// end ADMIN code
*/
//script205_DeactivateSpecInsp();

//Script 202 - Auto create inspections for Building
/*------------------------------------------------------------------------------------------------------/
| Purpose		: Auto create inspections for building
| Notes			: Assumed the following mapping (between the approved wftask & the inspection type to be scheduled):
			 wfTask :Electrical Plan Review/ InspTypes : Electrical Final,Electrical Rough
                         wfTask :Mechanical Plan Review/ InspTypes : :Mechanical Final,:Mechanical Rough
                         wfTask :Plumbing Plan Review/ InspTypes : Plumbing Final,Plumbing Rough
                         wfTask :Structural Plan Review/ InspTypes : Framing Final,Framing Rough
| Created by	: ISRAA
| Created at	: 01/02/2018 16:19:04
|
/------------------------------------------------------------------------------------------------------*/

//**********************************************************************************
//* updates made 6/5 for automation of BLD conditions creation for plan review tasks
//* EK
if (wfTask == "Plans Distribution" && wfStatus == "Routed for Review") {
	logDebug("Matched on Plans Distribution & Routed for Review");
	var prdCount = parseInt(getAppSpecific("Plan Review Distribution Count"));
	editAppSpecific("Plan Review Distribution Count", prdCount + 1);
}

if (wfTask == "B-General" && wfStatus == "Routed to Reviewer") {

	var prdCount = getAppSpecific("Plan Review Distribution Count");	
	var title = "Review " + prdCount + ": Building-General";
	var newStatus = "Routed to Reviewer" + prdCount;
	logDebug("Matched on B-General & Routed & title =" + title + " & prdCount = " + prdCount);
	addAppCondition("Plan Review","Pending(Applied)",title,"01025","Notice");
	updateTask(wfTask,newStatus,"comment","note");
}

if (wfTask == "Z-General" && wfStatus == "Routed to Reviewer") {

	var prdCount = getAppSpecific("Plan Review Distribution Count");	
	var title = "Review " + prdCount + ": Zoning-General";
	logDebug("Matched on Z-General & Routed & title =" + title + " & prdCount = " + prdCount);
	addAppCondition("Plan Review","Pending(Applied)",title,"01025","Notice");
}
if (wfTask == "B-Electrical" && wfStatus == "Routed to Reviewer") {

	var prdCount = getAppSpecific("Plan Review Distribution Count");	
	var title = "Review " + prdCount + ": Building-Electrical";
	logDebug("Matched on B-Electrical & Routed & title =" + title + " & prdCount = " + prdCount);
	addAppCondition("Plan Review","Pending(Applied)",title,"01025","Notice");
}

//**********************************************************************************

logDebug("WTUB;Building/*/*/* ------------------------>> Status check on Event flow");
include("5074_Building_WF_Accept_Plans_Withdrawn");

if (wfTask == "Permit Issuance" && wfStatus == "Issued") {
	var tasksToCheck = [ "Mechanical Plan Review", "Electrical Plan Review", "Plumbing Plan Review", "Structural Plan Review" ];
	createAutoInspection(tasksToCheck);
}

// Script #205

if (wfTask == "Permit Issuance" && wfStatus == "Issued") {
	if(AInfo["Special Inspections"] != "Yes")
	{
		deactivateTask("Special Inspections Check","BLD_NEWCON_INSPSUB");
		deactivateTask("Special Inspections Check","BLD_MASTER_INSPSUB");
	}

	if(!isTaskStatus("Engineering Review","Approved with FEMA Cert Required"))
	{
		deactivateTask("FEMA Elevation Certification","BLD_NEWCON_INSPSUB");
		deactivateTask("FEMA Elevation Certification","BLD_MASTER_INSPSUB");
	}
	
	if(!isTaskStatus("Waste Water Review","Approved Inspection Required"))
	{
		deactivateTask("Waste Water","BLD_NEWCON_INSPSUB");
		deactivateTask("Waste Water","BLD_MASTER_INSPSUB");
	}

}

if(isTaskActive("Subtasks Complete","BLD_NEWCON_INSPSUB")&& allTasksComplete("BLD_NEWCON_INSPSUB","Subtasks Complete"))
{
    closeTask("Subtasks Complete","Complete","","", "BLD_NEWCON_INSPSUB")
}

// Script#206
if(isTaskActive("Subtasks Complete","BLD_MASTER_INSPSUB") && allTasksComplete("BLD_MASTER_INSPSUB","Subtasks Complete"))
{
	closeTask("Subtasks Complete","Complete","","", "BLD_MASTER_INSPSUB")
}

/**ACCELA CIVIC PLATFORM TO CRM SCRIPTING LOGIC 
 * Workflow automation for all Building Records 
 * @namespace WTUA:Building///
 * @requires INCLUDES_CRM
 */

//Retreive Enterprise CRM Function File 
eval(getScriptText("INCLUDES_CRM", null, false));

//logDebug("*** BEGIN process_WF_JSON_Rules for CRM (Building) ***");
// execute workflow propagation rules
//process_WF_JSON_Rules(capId, wfTask, wfStatus);
//logDebug("*** FINISH process_WF_JSON_Rules for CRM (Building) ***");

//Retreive Custom CRM Logic File
//includesCrmCustomWorkflowRules();

