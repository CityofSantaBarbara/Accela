
var inspAssignArea = String(getGISInfo(aa.getServiceProviderCode(), "Building Permit Inspection Areas", "Region", "-1"));

if (inspId && inspAssignArea.length() > 0) {
	var inspectorId = String(lookup("BLD_INSP_ASSIGNMENT_MAPPING", inspAssignArea));
	if (inspectorId.length() > 0) {
		assignInspection(inspId, inspectorId);
	}
}
