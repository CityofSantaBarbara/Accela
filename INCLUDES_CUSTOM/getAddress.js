function getAddress(capId)
{
	var capAddresses = null;
	var theAddress = "";
	
	var s_result = aa.address.getAddressByCapId(capId);
	if(s_result.getSuccess())
	{
		capAddresses = s_result.getOutput();
		if (capAddresses == null || capAddresses.length == 0)
		{
			logDebug("WARNING: no addresses on this CAP:" + capId);
			capAddresses = null;
		}
		else
		{
			var theAddress = capAddresses[0].getDisplayAddress();
			logDebug("theAddress = " + theAddress);
		}
	}
	else
	{
		logDebug("Error: Failed to address: " + s_result.getErrorMessage());
		capAddresses = null;	
	}
	return theAddress;
}
