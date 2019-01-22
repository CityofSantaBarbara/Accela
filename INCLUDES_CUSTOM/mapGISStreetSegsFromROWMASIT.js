//********************************************************************************************************
//Script 		mapGISStreetSegsFromROWMASIT
//
//Record Types:	Public Works Right of Way Management scripting
//
//Event: 		called by ACA and AA scripts to attach gis information to the record 
//
//Desc:			Find all parcels for every street segment listed in ASIT and attach them to the record 
//
//Created By: Silver Lining Solutions
//********************************************************************************************************
// Change Log
//			Date		Name		Modification
//			01-22-2019	Chad		created
//********************************************************************************************************
function mapGISStreetSegsFromROWMASIT( streetsToFindArr, gisObjSearchType ) {
	logDebug("START of mapGISStreetSegsFromROWMASIT;");
	var keepAPNsToAdd = [];

	// for each line of the ASIT, go find the segments to add to our record.
	for ( asitRow in streetsToFindArr ) {
		if (gisObjSearchType == "PARCEL") {
			var asitStreetName = streetsToFindArr[asitRow]["Street Name"].toString().toUpperCase();
			var asitStreetStartCheck = streetsToFindArr[asitRow]["Start Num"].toString().toUpperCase();
			var asitStreetEndCheck = streetsToFindArr[asitRow]["End Num"].toString().toUpperCase();
			var sbESRIQuery = "where=APN+like++%27ROW%25%27+and+SStreet+%3D+%27"+asitStreetName.replace(/ /g, "+")+"%27";
		}
		else {
			return false;
		}

		sbESRIQuery += "&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope";
		sbESRIQuery += "&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=";
		sbESRIQuery += "&outFields=APN%2C+ADLF%2C+ADLT%2C+ADRF%2C+ADRT";
		sbESRIQuery += "&returnGeometry=false";
		sbESRIQuery += "&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=";
		sbESRIQuery += "&returnIdsOnly=false";
		sbESRIQuery += "&returnCountOnly=false";
		sbESRIQuery += "&orderByFields=&groupByFieldsForStatistics=&outStatistics=";
		sbESRIQuery += "&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=true";
		sbESRIQuery += "&resultOffset=&resultRecordCount=&queryByDistance=&returnExtentsOnly=false";
		sbESRIQuery += "&datumTransformation=";
		sbESRIQuery += "\u0026+parameterValues=&rangeValues=";
		sbESRIQuery += "&f=pjson";

		var url = lookup("ROWM_ESRI_PARCEL_QUERY_URL", "Parcel");
		
		url += sbESRIQuery;
		logDebug("url: " + url);

		var login = "";
		logDebug("login: " + login);

		var password = "";
		logDebug("password: " + password);
		try {

			//Create an instance of the ObjectMapper that we'll be using for serialization
			var objectMapper = new org.codehaus.jackson.map.ObjectMapper();
			var esriGETResult = doHttpGET(login, password, url, "application/json");
			var arrFromJson = JSON.parse( esriGETResult );

			for (feat in arrFromJson.features) {
//				logDebug("************ parcel "+feat+" Found! **********************");
				var esriFeatureList = arrFromJson.features[feat];
				for ( attrList in esriFeatureList ) {
					//    print all
					//for ( esriAddrAttrib in esriFeatureList[attrList]) {
					//logDebug("----> "+esriAddrAttrib+" is:"+esriFeatureList[attrList][esriAddrAttrib]);
					//}
												
					if (!esriFeatureList[attrList]["APN"]) continue; // no full address, we can't parse
					if (!esriFeatureList[attrList]["ADLF"] && !esriFeatureList[attrList]["ADRF"]) continue;  //no from number can't do this
					if (!esriFeatureList[attrList]["ADLT"] && !esriFeatureList[attrList]["ADRT"]) continue;  //no from number can't do this

					if ( esriFeatureList[attrList]["ADLF"] <= esriFeatureList[attrList]["ADRF"] ) {
						var streetSegStartAddNbr = esriFeatureList[attrList]["ADLF"];
					}
					else {
						var streetSegStartAddNbr = esriFeatureList[attrList]["ADRF"];	
					}

					if ( esriFeatureList[attrList]["ADLT"] >= esriFeatureList[attrList]["ADRT"] ) {
						var streetSegEndAddNbr = esriFeatureList[attrList]["ADLT"];
					}
					else {
						var streetSegEndAddNbr = esriFeatureList[attrList]["ADRT"];	
					}

//logDebug(" determined start and end of street to be:");
//logDebug("     start->"+streetSegStartAddNbr);
//logDebug("       end->"+streetSegEndAddNbr);

					if	(  (streetSegStartAddNbr >= asitStreetStartCheck && streetSegStartAddNbr <= asitStreetEndCheck)
						|| (streetSegEndAddNbr >= asitStreetStartCheck && streetSegEndAddNbr <= asitStreetEndCheck) ) {
//							logDebug("we would keep this segment for later! >>>>>>>>>>"+esriFeatureList[attrList]["APN"]);
						keepAPNsToAdd.push(esriFeatureList[attrList]["APN"]);  // could put whole obj here though if needed!
					}
				}
			}
		} catch (exception) {
// we need to email PBW that this record could not link objects so they can investigate and fix!

			var subject = "getESRIStreetSegmentAddresses custom script function processing error alert";
			var message = "";

			try { message += "Exception caught in getESRIStreetSegmentAddresses custom script function\n" } catch (_exception) { }
			try { message += "exception: " + exception + "\n"; } catch (_exception) { }
			try { message += "exception.fileName: " + exception.fileName + "\n"; } catch (_exception) { }
			try { message += "exception.lineNumber: " + exception.lineNumber + "\n"; } catch (_exception) { }
			try { message += "exception.message: " + exception.message + "\n"; } catch (_exception) { }
			try { message += "exception.name: " + exception.name + "\n"; } catch (_exception) { }
			try { message += "exception.rhinoException: " + exception.rhinoException + "\n"; } catch (_exception) { }
			try { message += "exception.stack: " + exception.stack + "\n"; } catch (_exception) { }

			logDebug(message);
			return false;
		}
//		logDebug("For "+asitStreetStartCheck+"-"+asitStreetEndCheck+" "+asitStreetName);
//		logDebug("    we would keep:<br>     "+keepSegsToAdd.join("<br>     "));
	}
	keepAPNsToAdd = keepAPNsToAdd.sort();
//	logDebug("AFTER ALL ASIT rows checked we would keep "+keepAPNsToAdd.length+" elements:<br>     "+keepAPNsToAdd.join("<br>     "));
	var unqArrForMe = uniqArray(keepAPNsToAdd);
	logDebug("AFTER UNIQUE keep "+unqArrForMe.length+" elements:<br>     "+unqArrForMe.join("<br>     "));

//	keepSegAddressToAdd = keepSegAddressToAdd.sort();
//	var unqAddArr = uniqArray(keepSegAddressToAdd);
//	logDebug("And... the segments and address is:"+unqAddArr.join("<br>"));

	var gisAttachErrors = null;
	for (addGisObjId in unqArrForMe) {
		var wParcels = aa.parcel.getParceListForAdmin(unqArrForMe[addGisObjId],
								null, //java.lang.String addressStart,
								null, //java.lang.String addressEnd,
								null, //java.lang.String direction,
								null, //java.lang.String streetName,
								null, //java.lang.String suffix,
								null, //java.lang.String unitStart,
								null, // java.lang.String unitEnd,
								null, //java.lang.String city,
								null //java.lang.String ownerName
								).getOutput();

		var wParcelModelToWarp = wParcels[0].getParcelModel();

		var capParModel = aa.parcel.warpCapIdParcelModel2CapParcelModel(capId,wParcelModelToWarp).getOutput()

		var createPMResult = aa.parcel.createCapParcel(capParModel);
		if (createPMResult.getSuccess())
			logDebug("created CAP Parcel");
		else
			{ logDebug("**WARNING: Failed to create the cap Parcel " + createPMResult.getErrorMessage()); }
		
		var upGisObs = aa.gis.addCapGISObject(capId, "SANTABARBARA", "Assessors Parcels", unqArrForMe[addGisObjId]);
		if (upGisObs) logDebug("ATTACHED GIS OBJECT SUCCESSFULLY! ----->"+unqArrForMe[addGisObjId]);
		else gisAttachErrors += "<br>FAILED TO ATTACHED GIS OBJECT! ----->"+unqArrForMe[addGisObjId];
	}
	if (gisAttachErrors) {
		// its not specified as biz requirement but in the future you could add an email send here.
		logDebug(gisAttachErrors);
	}
	logDebug("END of mapGISStreetSegsFromROWMASIT;");
	return true;
} // END mapGISStreetSegsFromROWMASIT
