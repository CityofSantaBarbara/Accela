//Get environmental variables pass into the script
var report = aa.env.getValue("report");

try {
	var reportResult = aa.reportManager.getReportResult(report);
	if (!reportResult.getSuccess()) {
		aa.debug("RUN_REPORT_ATTACH_ASYNC error",reporResult.getErrorMessage());
	}
} catch (err) {
	aa.debug("RUN_REPORT_ATTACH_ASYNC error",err.message());
}