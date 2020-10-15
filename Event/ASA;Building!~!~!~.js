//Added by Gray Quarter per request of Andrew on 4/29/2020 and tracked in zen #500 sharepoint 254
if (!publicUser) {  
	addRefContactToRecord(183,"Contact");
	addRefContactToRecord(212,"Business Owner"); // added for zen 1106
}

// Added by Gray Quarter for zen #493
if (publicUser) {  
var acaFeeMap = getFeeRecsToProcess();

for (var i in acaFeeMap) {
	// add by record type
		var m = acaFeeMap[i];
		for (var j in m.recType) {
			//logDebug("inserting fee for " + m.recType[j]);
			if (appMatch(String(m.recType[j])))
			{
				updateFee(m.feeCode, m.feeSchedule,"FINAL",m.feeAmount, "N");
			}
		}
	}
}
