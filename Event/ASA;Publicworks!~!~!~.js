// ********************************************************************************************************
// Script 		ASA:Publicworks/~/~/~.js
// Record Types: all
//
// Event: 	ASA	
//
// Desc:	Script # 3
//        Calculate an 8% fee item automatically on top of all fees assessed under that record.  
//
// Created By: Silver Lining Solutions
// ********************************************************************************************************
// Change Log
//         		Date		Name			Modification
//			08-20-2018		Chad			Initial Draft - tech fee
//      01-22-2019    Chad      Added ROWM logic as there are many record types within PBW that need this
// ********************************************************************************************************

// populate GIS objects and ASI based on mapping std choice
if (!publicUser) {
	handleGisObjectMapping(capId);
}

logDebug("start ASA:PublicWorks/~/~/~ to add technology fee!");

sumFeesAssessedBeforeInvoiceAndAddTechFee();

	if(!publicUser){
		checkPBWRightOfWayConflicts();

		var tpbwRowAddresses;
		
		tpbwRowAddresses = loadASITable("PBW_ROWADDRESS", capId);
	
		if (tpbwRowAddresses) {
			var gisAddSearchType = 'PARCEL';
			mapGISStreetSegsFromROWMASIT(tpbwRowAddresses,gisAddSearchType);
		}
		else { 
			logDebug("no PBW_ROWADDRESS table information exists on this record:"+capId);
		}
	}


logDebug("end  ASA:PublicWorks/~/~/~ to add technology fee!");
