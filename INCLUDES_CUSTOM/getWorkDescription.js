function getWorkDescription(capId)
{
	var capAddresses = null;
	var workDesc = "";
	
	var workDescResult = aa.cap.getCapWorkDesByPK(capId);	
	var workDesObj = workDescResult.getOutput().getCapWorkDesModel();
	
	workDesc = workDesObj.getDescription();

	return workDesc;
}
