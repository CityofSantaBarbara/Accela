/*------------------------------------------------------------------------------------------------------/
| Accela Automation
| Accela, Inc.
| Copyright (C): 2012
|
| Program : INCLUDES_CUSTOM.js
| Event   : N/A
|
| Usage   : Custom Script Include.  Insert custom EMSE Function below and they will be 
|	    available to all master scripts
|
| Notes   :
|
/------------------------------------------------------------------------------------------------------*/

function externalLP_CA_AT(licNum,rlpType,doPopulateRef,doPopulateTrx,itemCap)
	{

	/*
	Version: 3.2

	Usage:

		licNum			:  Valid CA license number.   Non-alpha, max 8 characters.  If null, function will use the LPs on the supplied CAP ID
		rlpType			:  License professional type to use when validating and creating new LPs
		doPopulateRef 	:  If true, will create/refresh a reference LP of this number/type
		doPopulateTrx 	:  If true, will copy create/refreshed reference LPs to the supplied Cap ID.   doPopulateRef must be true for this to work
		itemCap			:  If supplied, licenses on the CAP will be validated.  Also will be refreshed if doPopulateRef and doPopulateTrx are true

	returns: non-null string of status codes for invalid licenses

	examples:

	appsubmitbefore   (will validate the LP entered, if any, and cancel the event if the LP is inactive, cancelled, expired, etc.)
	===============
	true ^ cslbMessage = "";
	CAELienseNumber ^ cslbMessage = externalLP_CA(CAELienseNumber,CAELienseType,false,false,null);
	cslbMessage.length > 0 ^ cancel = true ; showMessage = true ; comment(cslbMessage)

	appsubmitafter  (update all CONTRACTOR LPs on the CAP and REFERENCE with data from CSLB.  Link the CAP LPs to REFERENCE.   Pop up a message if any are inactive...)
	==============
	true ^ 	cslbMessage = externalLP_CA(null,"CONTRACTOR",true,true,capId)
	cslbMessage.length > 0 ^ showMessage = true ; comment(cslbMessage);

	Note;  Custom LP Template Field Mappings can be edited in the script below
	*/

	var returnMessage = "";

	var workArray = new Array();
	if (licNum)
		workArray.push(String(licNum));

	if (itemCap)
		{
		var capLicenseResult = aa.licenseScript.getLicenseProf(itemCap);
		if (capLicenseResult.getSuccess())
			{
			var capLicenseArr = capLicenseResult.getOutput();  }
		else
			{ logDebug("**ERROR: getting lic prof: " + capLicenseResult.getErrorMessage()); return false; }

		if (capLicenseArr == null || !capLicenseArr.length)
			{ logDebug("**WARNING: no licensed professionals on this CAP"); }
		//else
			//{
			//for (var thisLic in capLicenseArr)
			//	if (capLicenseArr[thisLic].getLicenseType() == rlpType)
			//		workArray.push(capLicenseArr[thisLic]);
			//}
		}
	else
		doPopulateTrx = false; // can't do this without a CAP;

	for (var thisLic = 0; thisLic < workArray.length; thisLic++)
		{
		var licNum = workArray[thisLic];
		var licObj = null;
		var isObject = false;

		if (typeof(licNum) == "object")  // is this one an object or string?
			{
			licObj = licNum;
			licNum = licObj.getLicenseNbr();
			isObject = true;
			}

// Make the call to the California State License Board

		var document;
		var root;        
		var aURLArgList = "https://www2.cslb.ca.gov/IVR/License+Detail.aspx?LicNum=" + licNum;
		var vOutObj = aa.httpClient.get(aURLArgList);
		var isError = false;
		if(vOutObj.getSuccess()){
			var vOut = vOutObj.getOutput();
			var sr =  aa.proxyInvoker.newInstance("java.io.StringBufferInputStream", new Array(vOut)).getOutput();
			var saxBuilder = aa.proxyInvoker.newInstance("org.jdom.input.SAXBuilder").getOutput();
			document = saxBuilder.build(sr);
			root = document.getRootElement();
			errorNode = root.getChild("Error");
		}
		else{
			isError = true;
		}
		if (isError){
			logDebug("The CSLB web service is currently unavailable");
			continue;
		}
		else if (errorNode)
		{
			logDebug("Error for license " + licNum + " : " + errorNode.getText().replace(/\+/g," "));
			returnMessage+="License " + licNum +  " : " + errorNode.getText().replace(/\+/g," ") + " ";
			continue;
		}


		var lpBiz = root.getChild("BusinessInfo");
		var lpStatus = root.getChild("PrimaryStatus");
		var lpClass = root.getChild("Classifications");
		var lpBonds = root.getChild("ContractorBond");
		var lpWC = root.getChild("WorkersComp");

		// Primary Status
		// 3 = expired, 10 = good, 11 = inactive, 1 = canceled.   We will ignore all but 10 and return text.
		var stas = lpStatus.getChildren();
		for (var i=0 ; i<stas.size(); i++) {
			var sta = stas.get(i);

			if (sta.getAttribute("Code").getValue() != "10")
				returnMessage+="License:" + licNum + ", " + sta.getAttribute("Desc").getValue() + " ";
		}

		if (doPopulateRef)  // refresh or create a reference LP
			{
			var updating = false;

			// check to see if the licnese already exists...if not, create.

			var newLic = getRefLicenseProf(licNum)

			if (newLic)
				{
				updating = true;
				logDebug("Updating existing Ref Lic Prof : " + licNum);
				}
			else
				{
				var newLic = aa.licenseScript.createLicenseScriptModel();
				}

			if (isObject)  // update the reference LP with data from the transactional, if we have some.
				{
				if (licObj.getAddress1()) newLic.setAddress1(licObj.getAddress1());
				if (licObj.getAddress2()) newLic.setAddress2(licObj.getAddress2());
				if (licObj.getAddress3()) newLic.setAddress3(licObj.getAddress3());
				if (licObj.getAgencyCode()) newLic.setAgencyCode(licObj.getAgencyCode());
				if (licObj.getBusinessLicense()) newLic.setBusinessLicense(licObj.getBusinessLicense());
				if (licObj.getBusinessName()) newLic.setBusinessName(licObj.getBusinessName());
				if (licObj.getBusName2()) newLic.setBusinessName2(licObj.getBusName2());
				if (licObj.getCity()) newLic.setCity(licObj.getCity());
				if (licObj.getCityCode()) newLic.setCityCode(licObj.getCityCode());
				if (licObj.getContactFirstName()) newLic.setContactFirstName(licObj.getContactFirstName());
				if (licObj.getContactLastName()) newLic.setContactLastName(licObj.getContactLastName());
				if (licObj.getContactMiddleName()) newLic.setContactMiddleName(licObj.getContactMiddleName());
				if (licObj.getCountryCode()) newLic.setContryCode(licObj.getCountryCode());
				if (licObj.getEmail()) newLic.setEMailAddress(licObj.getEmail());
				if (licObj.getCountry()) newLic.setCountry(licObj.getCountry());
				if (licObj.getEinSs()) newLic.setEinSs(licObj.getEinSs());
				if (licObj.getFax()) newLic.setFax(licObj.getFax());
				if (licObj.getFaxCountryCode()) newLic.setFaxCountryCode(licObj.getFaxCountryCode());
				if (licObj.getHoldCode()) newLic.setHoldCode(licObj.getHoldCode());
				if (licObj.getHoldDesc()) newLic.setHoldDesc(licObj.getHoldDesc());
				if (licObj.getLicenseExpirDate()) newLic.setLicenseExpirationDate(licObj.getLicenseExpirDate());
				if (licObj.getLastRenewalDate()) newLic.setLicenseLastRenewalDate(licObj.getLastRenewalDate());
				if (licObj.getLicesnseOrigIssueDate()) newLic.setLicOrigIssDate(licObj.getLicesnseOrigIssueDate());
				if (licObj.getPhone1()) newLic.setPhone1(licObj.getPhone1());
				if (licObj.getPhone1CountryCode()) newLic.setPhone1CountryCode(licObj.getPhone1CountryCode());
				if (licObj.getPhone2()) newLic.setPhone2(licObj.getPhone2());
				if (licObj.getPhone2CountryCode()) newLic.setPhone2CountryCode(licObj.getPhone2CountryCode());
				if (licObj.getSelfIns()) newLic.setSelfIns(licObj.getSelfIns());
				if (licObj.getState()) newLic.setState(licObj.getState());
				if (licObj.getSuffixName()) newLic.setSuffixName(licObj.getSuffixName());
				if (licObj.getZip()) newLic.setZip(licObj.getZip());
				}

			// Now set data from the CSLB

			if (lpBiz.getChild("Name").getText() != "") newLic.setBusinessName(unescape(lpBiz.getChild("Name").getText()).replace(/\+/g," "));
			if (lpBiz.getChild("Addr1").getText() != "") newLic.setAddress1(unescape(lpBiz.getChild("Addr1").getText()).replace(/\+/g," "));
			if (lpBiz.getChild("Addr2").getText() != "") newLic.setAddress2(unescape(lpBiz.getChild("Addr2").getText()).replace(/\+/g," "));
			if (lpBiz.getChild("City").getText() != "") newLic.setCity(unescape(lpBiz.getChild("City").getText()).replace(/\+/g," "));
			if (lpBiz.getChild("State").getText() != "") newLic.setState(unescape(lpBiz.getChild("State").getText()).replace(/\+/g," "));
			if (lpBiz.getChild("Zip").getText() != "") newLic.setZip(unescape(lpBiz.getChild("Zip").getText()).replace(/\+/g," "));
			if (lpBiz.getChild("BusinessPhoneNum").getText() != "") newLic.setPhone1(unescape(stripNN(lpBiz.getChild("BusinessPhoneNum").getText()).replace(/\+/g," ")));
			newLic.setAgencyCode(aa.getServiceProviderCode());
			newLic.setAuditDate(sysDate);
			newLic.setAuditID(currentUserID);
			newLic.setAuditStatus("A");
			newLic.setLicenseType(rlpType);
			newLic.setLicState("CA");  // hardcode CA
			newLic.setStateLicense(licNum);

			if (lpBiz.getChild("IssueDt").getText()) newLic.setLicenseIssueDate(aa.date.parseDate(lpBiz.getChild("IssueDt").getText()));
			if (lpBiz.getChild("ExpireDt").getText()) newLic.setLicenseExpirationDate(aa.date.parseDate(lpBiz.getChild("ExpireDt").getText()));
			if (lpBiz.getChild("ReissueDt").getText()) newLic.setLicenseLastRenewalDate(aa.date.parseDate(lpBiz.getChild("ReissueDt").getText()));

			var wcs = root.getChild("WorkersComp").getChildren();

			for (var j=0 ; j<wcs.size(); j++) {
				wc = wcs.get(j);

				if (wc.getAttribute("PolicyNo").getValue()) newLic.setWcPolicyNo(wc.getAttribute("PolicyNo").getValue());
				if (wc.getAttribute("InsCoCde").getValue()) newLic.setWcInsCoCode(unescape(wc.getAttribute("InsCoCde").getValue()));
				if (wc.getAttribute("WCEffDt").getValue()) newLic.setWcEffDate(aa.date.parseDate(wc.getAttribute("WCEffDt").getValue()))
				if (wc.getAttribute("WCExpDt").getValue()) newLic.setWcExpDate(aa.date.parseDate(wc.getAttribute("WCExpDt").getValue()))
				if (wc.getAttribute("WCCancDt").getValue()) newLic.setWcCancDate(aa.date.parseDate(wc.getAttribute("WCCancDt").getValue()))
				if (wc.getAttribute("Exempt").getValue() == "E") newLic.setWcExempt("Y"); else newLic.setWcExempt("N");

				break; // only use first
				}

			//
			// Do the refresh/create and get the sequence number
			//
			if (updating)
				{
				var myResult = aa.licenseScript.editRefLicenseProf(newLic);
				var licSeqNbr = newLic.getLicSeqNbr();
				}
			else
				{
				var myResult = aa.licenseScript.createRefLicenseProf(newLic);

				if (!myResult.getSuccess())
					{
					logDebug("**WARNING: can't create ref lic prof: " + myResult.getErrorMessage());
					continue;
					}

				var licSeqNbr = myResult.getOutput()
				}

			logDebug("Successfully added/updated License No. " + licNum + ", Type: " + rlpType + " Sequence Number " + licSeqNbr);


			/////
			/////  Attribute Data -- first copy from the transactional LP if it exists
			/////


			if (isObject)  // update the reference LP with attributes from the transactional, if we have some.
				{
				var attrArray = licObj.getAttributes();

				if (attrArray)
					{
					for (var k in attrArray)
						{
						var attr = attrArray[k];
						editRefLicProfAttribute(licNum,attr.getAttributeName(),attr.getAttributeValue());
						}
					}
				}

			/////
			/////  Attribute Data
			/////
			/////  NOTE!  Agencies may have to configure template data below based on their configuration.  Please note all edits
			/////

			var cbs = root.getChild("Classifications").getChildren();
			for (var m=0 ; m<cbs.size(); m++) {
				cb = cbs.get(m);

				if (m == 0)
					{
					editRefLicProfAttribute(licNum,"CLASS CODE 1",cb.getAttribute("Code").getValue());
					editRefLicProfAttribute(licNum,"CLASS DESC 1",unescape(cb.getAttribute("Desc").getValue()).replace(/\+/g," "));
					}

				if (m == 1)
					{
					editRefLicProfAttribute(licNum,"CLASS CODE 2",cb.getAttribute("Code").getValue());
					editRefLicProfAttribute(licNum,"CLASS DESC 2",unescape(cb.getAttribute("Desc").getValue()).replace(/\+/g," "));
					}
				if (m == 2)
					{
					editRefLicProfAttribute(licNum,"CLASS CODE 3",cb.getAttribute("Code").getValue());
					editRefLicProfAttribute(licNum,"CLASS DESC 3",unescape(cb.getAttribute("Desc").getValue()).replace(/\+/g," "));
					}

				if (m == 3)
					{
					editRefLicProfAttribute(licNum,"CLASS CODE 4",cb.getAttribute("Code").getValue());
					editRefLicProfAttribute(licNum,"CLASS DESC 4",unescape(cb.getAttribute("Desc").getValue()).replace(/\+/g," "));
					}
				}

// dlh add in Status

	var stas = lpStatus.getChildren();
		for (var i=0 ; i<stas.size(); i++) {
			var sta = stas.get(i);

				if (sta.getAttribute("Desc").getValue()) editRefLicProfAttribute(licNum,"STATUS",unescape(sta.getAttribute("Desc").getValue()));

				break; // only use first
				}
				
//  do this again for WC  

            var wcs = root.getChild("WorkersComp").getChildren();
			for (var j=0 ; j< wcs.size(); j++) {
				wc = wcs.get(j);

				if (wc.getAttribute("PolicyNo").getValue()) editRefLicProfAttribute(licNum,"WC POLICY NO",unescape(wc.getAttribute("PolicyNo").getValue()));

				if (wc.getAttribute("InsCoCde").getValue()) editRefLicProfAttribute(licNum,"WC CO CODE",unescape(wc.getAttribute("InsCoCde").getValue()));
			
				if (wc.getAttribute("InsCoName").getValue()) editRefLicProfAttribute(licNum,"WC CO NAME",unescape(wc.getAttribute("InsCoName").getValue()).replace(/\+/g," "));

				if (wc.getAttribute("WCEffDt").getValue()) editRefLicProfAttribute(licNum,"WC EFF DATE",unescape(wc.getAttribute("WCEffDt").getValue()));

				if (wc.getAttribute("WCExpDt").getValue()) editRefLicProfAttribute(licNum,"WC EXP DATE",unescape(wc.getAttribute("WCExpDt").getValue()));

				if (wc.getAttribute("WCCancDt").getValue()) editRefLicProfAttribute(licNum,"WC CAN DATE",unescape(wc.getAttribute("WCCancDt").getValue()));

				if (wc.getAttribute("Exempt").getValue() == "E") 
					editRefLicProfAttribute(licNum,"WC EXEMPT","Y"); 
				else 
					editRefLicProfAttribute(licNum,"WC EXEMPT","N");
					 
				break; // only use first
				}

// end dlh change update attribute WC data 

			var bos = root.getChild("ContractorBond").getChildren();

			for (var n=0 ; n<bos.size(); n++) {
				var bo = bos.get(n);
				if (bo.getAttribute("BondAmt").getValue()) editRefLicProfAttribute(licNum,"BOND AMOUNT",unescape(bo.getAttribute("BondAmt").getValue()).replace(/[$,]/g,""));
				if (bo.getAttribute("BondCancDt").getValue()) editRefLicProfAttribute(licNum,"BOND EXPIRATION",unescape(bo.getAttribute("BondCancDt").getValue()));

				// Currently unused but could be loaded into custom attributes.
				if (bo.getAttribute("SuretyTp").getValue()) editRefLicProfAttribute(licNum,"BOND SURETYTP",unescape(bo.getAttribute("SuretyTp").getValue()));

				if (bo.getAttribute("InsCoCde").getValue()) editRefLicProfAttribute(licNum,"BOND INSOCDE",unescape(bo.getAttribute("InsCoCde").getValue()).replace(/\+/g," "));

				if (bo.getAttribute("InsCoName").getValue()) editRefLicProfAttribute(licNum,"BOND ICONAME",unescape(bo.getAttribute("InsCoName").getValue()).replace(/\+/g," "));

				if (bo.getAttribute("BondNo").getValue()) editRefLicProfAttribute(licNum,"BOND NO",unescape(bo.getAttribute("BondNo").getValue()));

				if (bo.getAttribute("BondEffDt").getValue()) editRefLicProfAttribute(licNum,"BOND EFFDATE",unescape(bo.getAttribute("BondEffDt").getValue()));

	

/*
				aa.print("Bond Surety Type       : " + unescape(bo.getAttribute("SuretyTp").getValue()))
				aa.print("Bond Code              : " + unescape(bo.getAttribute("InsCoCde").getValue()))
				aa.print("Bond Insurance Company : " + unescape(bo.getAttribute("InsCoName").getValue()).replace(/\+/g," "))
				aa.print("Bond Number            : " + unescape(bo.getAttribute("BondNo").getValue()))
				aa.print("Bond Amount            : " + unescape(bo.getAttribute("BondAmt").getValue()))
				aa.print("Bond Effective Date    : " + unescape(bo.getAttribute("BondEffDt").getValue()))
				aa.print("Bond Cancel Date       : " + unescape(bo.getAttribute("BondCancDt").getValue()))
*/
				break; // only use first bond
				}

			if (doPopulateTrx)
				{
				var lpsmResult = aa.licenseScript.getRefLicenseProfBySeqNbr(servProvCode,licSeqNbr)
					if (!lpsmResult.getSuccess())
					{ logDebug("**WARNING error retrieving the LP just created " + lpsmResult.getErrorMessage()) ; }

				var lpsm = lpsmResult.getOutput();

				// Remove from CAP

				var isPrimary = false;

				for (var currLic in capLicenseArr)
					{
					var thisLP = capLicenseArr[currLic];
					if (thisLP.getLicenseType() == rlpType && thisLP.getLicenseNbr() == licNum)
						{
						logDebug("Removing license: " + thisLP.getLicenseNbr() + " from CAP.  We will link the new reference LP");
						if (thisLP.getPrintFlag() == "Y")
							{
							logDebug("...remove primary status...");
							isPrimary = true;
							thisLP.setPrintFlag("N");
							aa.licenseProfessional.editLicensedProfessional(thisLP);
							}
						var remCapResult = aa.licenseProfessional.removeLicensedProfessional(thisLP);
						if (capLicenseResult.getSuccess())
							{
							logDebug("...Success."); }
						else
							{ logDebug("**WARNING removing lic prof: " + remCapResult.getErrorMessage()); }
						}
					}

				// add the LP to the CAP
				var asCapResult= aa.licenseScript.associateLpWithCap(itemCap,lpsm)
				if (!asCapResult.getSuccess())
				{ logDebug("**WARNING error associating CAP to LP: " + asCapResult.getErrorMessage()) }
				else
					{ logDebug("Associated the CAP to the new LP") }

				// Now make the LP primary again
				if (isPrimary)
					{
					var capLps = getLicenseProfessional(itemCap);

					for (var thisCapLpNum in capLps)
						{
						if (capLps[thisCapLpNum].getLicenseNbr().equals(licNum))
							{
							var thisCapLp = capLps[thisCapLpNum];
							thisCapLp.setPrintFlag("Y");
							aa.licenseProfessional.editLicensedProfessional(thisCapLp);
							logDebug("Updated primary flag on Cap LP : " + licNum);

							// adding this return will cause the test script to work without error, even though this is the last statement executed
							//if (returnMessage.length > 0) return returnMessage;
							//else return null;

							}
						}
				}
			} // do populate on the CAP
		} // do populate on the REF
	} // for each license

	if (returnMessage.length > 0) return returnMessage;
	else return null;

} // end function

function getLPLicNum(pCapId) {
//Function find licensed professionals number
        var newLicNum = null;
	var licProf = aa.licenseProfessional.getLicensedProfessionalsByCapID(pCapId).getOutput();
	if (licProf != null)
		for(x in licProf)
		{
                        newLicNum = licProf[x].getLicenseNbr();
		        // logDebug("Found " + licProf[x].getLicenseNbr());
                        return newLicNum;
		}
	else
		// logDebug("No licensed professional on source");
                return null;
}


function getLPLicType(pCapId) {
//Function find licensed professionals number
	var newLicType = null;
	var licProf = aa.licenseProfessional.getLicensedProfessionalsByCapID(pCapId).getOutput();
	if (licProf != null)
	for(x in licProf)
	{
		newLicType = licProf[x].getLicenseType();
		// logDebug("Found " + licProf[x].getLicenseType());
		return newLicType;
	}
	else
	// logDebug("No licensed professional on source");
		return null;
}


function doScriptActions() {
                include(prefix + ":" + "*/*/*/*");
                if (typeof(appTypeArray) == "object") {
                                                include(prefix + ":" + appTypeArray[0] + "/*/*/*");
                                                include(prefix + ":" + appTypeArray[0] + "/" + appTypeArray[1] + "/*/*");
                                                include(prefix + ":" + appTypeArray[0] + "/" + appTypeArray[1] + "/" + appTypeArray[2] + "/*");
                                                include(prefix + ":" + appTypeArray[0] + "/*/" + appTypeArray[2] + "/*");
                                                include(prefix + ":" + appTypeArray[0] + "/*/" + appTypeArray[2] + "/" + appTypeArray[3]);
                                                include(prefix + ":" + appTypeArray[0] + "/*/*/" + appTypeArray[3]);
                                                include(prefix + ":" + appTypeArray[0] + "/" + appTypeArray[1] + "/*/" + appTypeArray[3]);
                                                include(prefix + ":" + appTypeArray[0] + "/" + appTypeArray[1] + "/" + appTypeArray[2] + "/" + appTypeArray[3]);
                                                }
                }
/*
Functions to attach incoming email messages to a record
*/
function associateMessagesToRecords(messages)
{
	if(messages){
		var i = 0;  var len = messages.length; 
		while(i < len)
		{
			var message = messages[i];
			var content = message.getTitle();
			var cmId = message.getCmId();
			var altId = parseAltIdFromContent(content);
			var messageBody = message.getContent();
			var messageModel = message.getModel();
			var messageFrom = messageModel.getFromString();
			var messageTo = messageModel.getToString();
			
			var altIdResult= new String(parseAltIdFromContent(content));
			var altIdMatch = altIdResult.split(',');
			logDebug("Subject: " + content);
			logDebug("Record ID from the Subject Line: " + altIdMatch);
			
			var altId = altIdMatch[1];
			if (altId)
			{
				aa.communication.associateEnities(cmId, altId, 'RECORD');
				logDebug("Successfully associated message with Record: " + altId);
				return true;
			}
			else
			{
				logDebug("Record ID not found, sending bounce back email.");
				email(messageFrom, messageTo, bouncebackSubject + ": " + content, bouncebackBody + ": <br><br>" + messageBody);
				
				if (sendDebugEmail)
				{
					email(debugEmailAddress, messageTo, "Debug log from CommunicationReceivingEmailAfter Event Script", debug);
				}
						
				return false;
			}
			i++;						
		}
	}
}


function parseAltIdFromContent(content)
{       
		//This is just a sample.
		//Note, please customize the RegExp for actual AlternateID.
        var altIdFormat = /Record ID #(.*\w)+/; 		
		var result = altIdFormat.exec(content);
		if(result){
			return result;
		}
		aa.print('No record id has been parsed from content.');
}


/*--------------------------------------------------------------------------------------------------------------------/
| Start Fuction getGISInfo
/--------------------------------------------------------------------------------------------------------------------*/
function getGISInfo(svc,layer,attributename) // optional: numDistance, distanceType
{
	try{
	var numDistance = 0
	if (arguments.length >= 4) numDistance = arguments[3]; // use numDistance in arg list
	var distanceType = "feet";
	if (arguments.length == 5) distanceType = arguments[4]; // use distanceType in arg list

	var retString;
   	
	var bufferTargetResult = aa.gis.getGISType(svc,layer); // get the buffer target
	if (bufferTargetResult.getSuccess())
		{
		var buf = bufferTargetResult.getOutput();
		buf.addAttributeName(attributename);
		}
	else
		{ logDebug("**WARNING: Getting GIS Type for Buffer Target.  Reason is: " + bufferTargetResult.getErrorType() + ":" + bufferTargetResult.getErrorMessage()) ; return false }
			
	var gisObjResult = aa.gis.getCapGISObjects(capId); // get gis objects on the cap
	if (gisObjResult.getSuccess()) 	
		var fGisObj = gisObjResult.getOutput();
	else
		{ logDebug("**WARNING: Getting GIS objects for Cap.  Reason is: " + gisObjResult.getErrorType() + ":" + gisObjResult.getErrorMessage()) ; return false }

	for (a1 in fGisObj) // for each GIS object on the Cap.  We'll only send the last value
		{
		var bufchk = aa.gis.getBufferByRadius(fGisObj[a1], numDistance, distanceType, buf);

		if (bufchk.getSuccess())
			var proxArr = bufchk.getOutput();
		else
			{ logDebug("**WARNING: Retrieving Buffer Check Results.  Reason is: " + bufchk.getErrorType() + ":" + bufchk.getErrorMessage()) ; return false }	
		
		for (a2 in proxArr)
			{
			var proxObj = proxArr[a2].getGISObjects();  // if there are GIS Objects here, we're done
			for (z1 in proxObj)
				{
				var v = proxObj[z1].getAttributeValues()
				retString = v[0];
				}
			
			}
		}
	return retString;
	}
	catch (err) {
		logDebug("A JavaScript Error occurred: function getGISInfo: " + err.message);
		logDebug(err.stack);
	}
}
/*--------------------------------------------------------------------------------------------------------------------/
| End Function getGISInfo
/--------------------------------------------------------------------------------------------------------------------*/

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

function resultWorkflowTask(wfstr, wfstat, wfcomment, wfnote) // optional process name
{
	var useProcess = false;
	var processName = "";
	if (arguments.length == 5) {
		processName = arguments[4]; // subprocess
		useProcess = true;
	}

	var workflowResult = aa.workflow.getTaskItems(capId, wfstr, processName, null, null, null);
	if (workflowResult.getSuccess())
		var wfObj = workflowResult.getOutput();
	else {
		logMessage("**ERROR: Failed to get workflow object: " + workflowResult.getErrorMessage());
		return false;
	}

	if (!wfstat)
		wfstat = "NA";

	for (i in wfObj) {
		var fTask = wfObj[i];
		if (fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase()) && (!useProcess || fTask.getProcessCode().equals(processName))) {
			var statObj = aa.workflow.getTaskStatus(fTask, wfstat);
			var dispo = "U";
			if (statObj.getSuccess()) {
				var status = statObj.getOutput();
				dispo = status.getResultAction();
			} else {
				logDebug("Could not get status action resulting to no change")
			}

			var dispositionDate = aa.date.getCurrentDate();
			var stepnumber = fTask.getStepNumber();
			var processID = fTask.getProcessID();

			if (useProcess)
				aa.workflow.handleDisposition(capId, stepnumber, processID, wfstat, dispositionDate, wfnote, wfcomment, systemUserObj, dispo);
			else
				aa.workflow.handleDisposition(capId, stepnumber, wfstat, dispositionDate, wfnote, wfcomment, systemUserObj, dispo);

			logMessage("Resulting Workflow Task: " + wfstr + " with status " + wfstat);
			logDebug("Resulting Workflow Task: " + wfstr + " with status " + wfstat);
		}
	}
} 


function runReportAsyncAttach(itemCapId, aaReportName) {
	// optional parameters are report parameter pairs
	// for example: runReportAttach(capId,"ReportName","altid",capId.getCustomID(),"months","12");

	var reportName = aaReportName;
	reportResult = aa.reportManager.getReportInfoModelByName(reportName);
	if (!reportResult.getSuccess()) {
		logDebug("**WARNING** couldn't load report " + reportName + " " + reportResult.getErrorMessage());
		return false;
	}
	var report = reportResult.getOutput();
	var itemCap = aa.cap.getCap(itemCapId).getOutput();
	appTypeResult = itemCap.getCapType();
	appTypeString = appTypeResult.toString();
	appTypeArray = appTypeString.split("/");
	report.setModule(appTypeArray[0]);
	report.setCapId(itemCapId.getID1() + "-" + itemCapId.getID2() + "-" + itemCapId.getID3());
	report.getEDMSEntityIdModel().setAltId(itemCapId.getCustomID());
	var parameters = aa.util.newHashMap();
	for (var i = 2; i < arguments.length; i = i + 2) {
		parameters.put(arguments[i], arguments[i + 1]);
		logDebug("Report parameter: " + arguments[i] + " = " + arguments[i + 1]);
	}
	report.setReportParameters(parameters);
	var permit = aa.reportManager.hasPermission(reportName, 'ADMIN');

	if (permit.getOutput().booleanValue()) {
		var scriptName = "RUN_REPORT_ATTACH_ASYNC";
		var envParameters = aa.util.newHashMap();
		envParameters.put("report", report);
		aa.runAsyncScript(scriptName, envParameters);
		//var reportResult = aa.reportManager.getReportResult(report);
		logDebug("Report " + aaReportName + " has been run async for " + itemCapId.getCustomID());
	} else
		logDebug("No permission to report: " + reportName + " for user: " + currentUserID);
}
