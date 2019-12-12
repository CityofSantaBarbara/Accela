function handleFinalInspectionMap(itemCap) {
    var inspMapString = lookup("FINAL_INSPECTION_MAPPING", appTypeString);

    // sample:  [{"inspection":"Final Electrical","result":["Passed","Passed with Conditions"],"task":"taskName","status":"statusName","reportName":"InspectionReport"},{"inspection":"Final Plumbing","result":["Passed","Passed with Conditions"],"task":"taskName","status":"statusName","reportName":"InspectionReport"}]

    if (!inspMapString || inspMapString == "") {
        logDebug("no mapping found for " + appTypeString);
        return false;
    }

    try {
        var inspMap = JSON.parse(inspMapString);
    } catch (err) {
        logDebug("can't parse mapping for " + appTypeString + " result: " + err.message);
        return false;
    }

    for (var i in inspMap) { // once for each object
        var m = inspMap[i];
        if (((m.inspection instanceof Array) && m.inspection.indexOf(String(inspType)) >= 0) || (!(m.inspection instanceof Array) && m.inspection.equals(String(inspType)))) {
            logDebug("handleFinalInspectionMap 1: found matching inspType of " + inspType);
            if ((m.result instanceof Array && m.result.indexOf(String(inspResult)) >= 0) || (!(m.result instanceof Array) && m.result.equals(String(inspResult)))) {
                logDebug("handleFinalInspectionMap 2: found matching result of " + inspResult);
                if (m.task && m.status) {
                    resultWorkflowTask(m.task, m.status, "", "");
                }
                if (m.reportName) {
                     logDebug("report sample " + m.reportName);
                    runReportAsyncAttach(capId, m.reportName,"AGENCY_ALT_ID",capId.getCustomID());
                }
            }
        }
    }
}	
