//********************************************************************************************************
//Script 		checkPBWRightOfWayConflicts
//
//Record Types:	Public Works Right of Way Management scripting
//
//Event: 		usually Fired at ACA and in PageFlow for these record types 
//
//Desc:			Find all open ROW records with conflicting work dates on same streets 
//
//Created By: Silver Lining Solutions
//********************************************************************************************************
// Change Log
//			Date		Name		Modification
//			01-16-2019	Chad		Created
//			01-16-2019	Chad		Added in publicUser logic
//			01-21-2019	Chad		Add condition when triggered from event
//			01-22-2019	Chad		More logic to get correct cap when called from aca
//			01-23-2019	Chad		capId is null coming into this in back office now too.
//			01-30-2019	Chad		added street direction logic
//********************************************************************************************************
function checkPBWRightOfWayConflicts () {
logDebug("START checkPBWRightOfWayConflicts ");
logDebug(" checkpbwrow: public user is:"+publicUser);
if (typeof controlString != "undefined") { 
	logDebug(" checkpbwrow: control string is:"+controlString);
}
else {
	logDebug(" checkpbwrow: control string is: undefined");
}
logDebug(" checkpbwrow: capid is:"+capId);
logDebug(" checkpbwrow: work start date is:"+AInfo["Work Start Date"]);
logDebug(" checkpbwrow: work end date is:"+AInfo["Work End Date"]);

// get the ASIT and attach GIS objectds based on their values!
	var tpbwRowAddresses;
	
	if (!publicUser) {
		// force the cap Id to have something its getting reset somehow
		if (typeof(getCapId) != "undefined")
			capId = getCapId();

		if(capId == null){
			if(aa.env.getValue("CapId") != ""){
				sca = String(aa.env.getValue("CapId")).split("-");
				capId = aa.cap.getCapID(sca[0],sca[1],sca[2]).getOutput();
			}else if(aa.env.getValue("CapID") != ""){
				sca = String(aa.env.getValue("CapID")).split("-");
				capId = aa.cap.getCapID(sca[0],sca[1],sca[2]).getOutput();
			}
		}
		cap = aa.cap.getCap(capId).getOutput();

		var searchWorkStart = AInfo["Work Start Date"];
		var searchWorkEnd = AInfo["Work End Date"]
logDebug(" checkpbwrow: re loaded capid is:"+capId);
logDebug(" checkpbwrow: calling loadASITable");
		tpbwRowAddresses = loadASITable("PBW_ROWADDRESS", capId);
	}
	else if ( publicUser && (typeof controlString != "undefined") && controlString == "ConvertToRealCAPAfter")  {

// for some strange reason the capid and cap are getting reset so have to get them again
		if (typeof(getCapId) != "undefined")
			capId = getCapId();
		 
		if(capId == null){
			if(aa.env.getValue("CapId") != ""){
				sca = String(aa.env.getValue("CapId")).split("-");
				capId = aa.cap.getCapID(sca[0],sca[1],sca[2]).getOutput();
			}else if(aa.env.getValue("CapID") != ""){
				sca = String(aa.env.getValue("CapID")).split("-");
				capId = aa.cap.getCapID(sca[0],sca[1],sca[2]).getOutput();
			}
		}
		cap = aa.cap.getCap(capId).getOutput();


//		var cap = aa.env.getValue("CapModel");
//		var capId = cap.getCapID();
		var searchWorkStart = AInfo["Work Start Date"];
		var searchWorkEnd = AInfo["Work End Date"]
logDebug(" checkpbwrow: ctrca and re loaded capid is:"+capId);
logDebug(" checkpbwrow: public user but calling loadASITable");
		tpbwRowAddresses = loadASITable("PBW_ROWADDRESS", capId);
	}
	else if ( publicUser && (typeof controlString == "undefined")) {
		logDebug("you are public user and control string is not defined");
		var cap = aa.env.getValue("CapModel");
		var capId = cap.getCapID();
		var searchWorkStart = AInfo["Work Start Date"];
		var searchWorkEnd = AInfo["Work End Date"]
logDebug(" checkpbwrow: calling loadASITable4ACA");
		tpbwRowAddresses = loadASITable4ACA("PBW_ROWADDRESS",cap);
	}
	else { logDebug("END FALSE checkPBWRightOfWayConflicts "); return; }
	
	overLapRecs = [];
	
	if (tpbwRowAddresses && tpbwRowAddresses.length > 0) {
		for ( asitRow in tpbwRowAddresses ) {
			var asitStreetName = tpbwRowAddresses[asitRow]["Street Name"].toString().toUpperCase();
// street direction is not required so check for null
			if (tpbwRowAddresses[asitRow]["Direction"] && tpbwRowAddresses[asitRow]["Direction"].toString() != 'undefined' ) {
				var asitStreetDir = tpbwRowAddresses[asitRow]["Direction"].toString().toUpperCase();
			}
			else {
				var asitStreetDir = " ";
			}
			
			var asitStreetStartCheck = tpbwRowAddresses[asitRow]["Start Num"].toString().toUpperCase();
			var asitStreetEndCheck = tpbwRowAddresses[asitRow]["End Num"].toString().toUpperCase();

			var thisRowRecList = getROWOverlapStreetRecords( searchWorkStart, searchWorkEnd, asitStreetName, asitStreetDir, asitStreetStartCheck, asitStreetEndCheck );

			overLapRecs = overLapRecs.concat(thisRowRecList);
		}
	}
	else { 
		logDebug("no PBW_ROWADDRESS table information exists on this record:"+capId);
	}
	var unqOverLapRecs = [];
	if (overLapRecs.length > 0) unqOverLapRecs = uniqArray(overLapRecs);
	if (unqOverLapRecs.length > 0) {
		var checkMsg = "<Font Color=RED>Conflicting work in street may occur based upon application information."
						+"<br>Please verify dates, location, and traffic control description for further review."
						+"<br>OTHER project ids are:<br>     "+unqOverLapRecs.join("<br>     ")+"</Font Color>";
		comment(checkMsg);
		logDebug(checkMsg);
		
		//		if this is an event - it was called from asa or ctrca!
		
		if (typeof controlString != "undefined") { //must be an event...not a aca pageflow
		
			// place a condition on this record
			var conditionGroup = "PBW ROWM",
				conditionType = "Conflicting ROW Work",
				conditionName = "Conflicting ROW Work - Pre Record Submittal",
				conditionComment = "Conflicting work in street may occur based upon application information. Please verify dates, location, and traffic control description for further review.",
				impactCode = "Hold",
				condStatus = "Applied",
				auditStatus = "A",
				displayNotice = "Y",
				displayNoticeOnACA = "Y",
				condInheretible = "N",
				displayLongDesc = "Y";

			//Create new empty cap condition model and set the expected values.
			var newCondModel = aa.capCondition.getNewConditionScriptModel().getOutput();

			newCondModel.setCapID(capId);
			newCondModel.setConditionGroup(conditionGroup);
			newCondModel.setConditionType(conditionType);
			newCondModel.setConditionDescription(conditionName);
			newCondModel.setConditionComment(conditionComment);
			newCondModel.setLongDescripton(conditionComment);
			newCondModel.setDispConditionComment(conditionComment);
			newCondModel.setDispLongDescripton(displayLongDesc);
			newCondModel.setConditionStatus(condStatus);
			newCondModel.setEffectDate(sysDate);
			newCondModel.setIssuedDate(sysDate);
			newCondModel.setStatusDate(sysDate);
			newCondModel.setIssuedByUser(systemUserObj);
			newCondModel.setStatusByUser(systemUserObj);
			newCondModel.setAuditID(currentUserID);
			newCondModel.setAuditStatus(auditStatus);
			newCondModel.setDisplayConditionNotice(displayNotice);
			newCondModel.setDisplayNoticeOnACA(displayNoticeOnACA);
			newCondModel.setImpactCode(impactCode);
			newCondModel.setInheritable(condInheretible);
			newCondModel.setAdditionalInformation(checkMsg);

			aa.capCondition.createCapCondition(newCondModel);
			logDebug("ROWM Condition created!");
		}
	}
	else {
		if (typeof controlString != "undefined") { //must be an event...not a aca pageflow
			//advance the workflow  "Review of Conflicts" status of "Approved", comment "by EMSE"
			//advance the workflow "Review for Conflicts and Confirm Operating Division", comment "by EMSE"
			logDebug("closing workflow tasks");
			closeTask("Review of Conflicts","Approved","Closed by EMSE Script","");
			closeTask("Review for Conflicts and Confirm Operating Division","Approved","Closed by EMSE Script","");
			logDebug("done closing workflows");
		}
	}
logDebug("END checkPBWRightOfWayConflicts ");
}
