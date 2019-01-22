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
//********************************************************************************************************
function checkPBWRightOfWayConflicts () {
logDebug("START checkPBWRightOfWayConflicts ");
// get the ASIT and attach GIS objectds based on their values!
	var tpbwRowAddresses;
	
	if (!publicUser) {
		var searchWorkStart = AInfo["Work Start Date"];
		var searchWorkEnd = AInfo["Work End Date"]
		tpbwRowAddresses = loadASITable("PBW_ROWADDRESS", capId);
	}
	else if ( publicUser && (typeof controlString == "undefined")) {
		var searchWorkStart = AInfo["Work Start Date"];
		var searchWorkEnd = AInfo["Work End Date"]
		tpbwRowAddresses = loadASITable4ACA("PBW_ROWADDRESS",cap);
	}
	else { logDebug("END FALSE checkPBWRightOfWayConflicts "); return false; }
	
	overLapRecs = [];
	
	if (tpbwRowAddresses && tpbwRowAddresses.length > 0) {
		for ( asitRow in tpbwRowAddresses ) {
			var asitStreetName = tpbwRowAddresses[asitRow]["Street Name"].toString().toUpperCase();
			var asitStreetStartCheck = tpbwRowAddresses[asitRow]["Start Num"].toString().toUpperCase();
			var asitStreetEndCheck = tpbwRowAddresses[asitRow]["End Num"].toString().toUpperCase();

			var thisRowRecList = getROWOverlapStreetRecords( searchWorkStart, searchWorkEnd, asitStreetName, asitStreetStartCheck, asitStreetEndCheck );

			overLapRecs = overLapRecs.concat(thisRowRecList);
		}
	}
	else { 
		logDebug("no PBW_ROWADDRESS table information exists on this record:"+capId);
	}
	var unqOverLapRecs = uniqArray(overLapRecs);
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
				impactCode = "Notice",
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
logDebug("END checkPBWRightOfWayConflicts ");
}
