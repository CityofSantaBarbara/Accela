// ********************************************************************************************************
// Script 		ACAA:~/~/~/~.js
// Record Types: all
//
// Event: 	ACAA	
//
// Desc:	this script is for app submit global actions
//
// Created By: Silver Lining Solutions
// ********************************************************************************************************
// Change Log
//         		Date		Name		Modification
//				09/12/2018  Eric		Orig
//				12/10/2018	Chad		Altered to use the std cond template data to update fields
// ********************************************************************************************************

logDebug("ACAA Start");

// ********************************************************************************************************
// Need to turn this into a function in includes custom so can be used for condition updates too!
// ********************************************************************************************************


var myEntity = conditionObj.getEntityPK();
var chkIssuedDate = conditionObj.getIssuedDate();
var chkCondType = conditionObj.getConditionType();
var chkCondDesc = conditionObj.getCapConditionModel().getConditionDescription();

if (chkCondType == "PC Hearing" && chkIssuedDate && chkIssuedDate != "" && (
		chkCondDesc != "PC-Lunch Meeting" || 
		chkCondDesc != "PC-Substantial Conformance Lunch Meeting (Level 3)" ||
		chkCondDesc != "PC-Substantial Conformance Staff Review (Level 2)" ||
		chkCondDesc != "PC-Substantial Conformance Staff Review (Level 1)" ||
		chkCondDesc != "PC-Time Extension (Staff Review)"
		))
{
	var thisTemplate = conditionObj.getTemplateModel();
	if (thisTemplate) { 
		thisTemplateFormsArrPtr = thisTemplate.getTemplateForms();
		var formGroups = thisTemplateFormsArrPtr.toArray();
		for (grp in formGroups) {
			var subgroupsObj = formGroups[grp].getSubgroups();
			if (subgroupsObj != null) {
				var subgroups = subgroupsObj.toArray();
				for (sgrp in subgroups) {
					var sgrpName = subgroups[sgrp].getSubgroupName();
					var fields = subgroups[sgrp].getFields().toArray();
					for (fld in fields) {
						logDebug(">>GTemplate ASI["+sgrpName + "." + fields[fld].getFieldName()+"] = "+ fields[fld].getDefaultValue() +"<<");
						
						// eventually you need to remove this if statement and do this generically for all
						// once its working for site visit

						// Look up the number of days to add or subtract
						var daysToAddToIssueDate = null;
						var theValueName = sgrpName + "." + fields[fld].getFieldName();
						logDebug("going to look up PLN_PC_HEARING_GTMP_DATEADD for value:"+theValueName);
						daysToAddToIssueDate = lookup("PLN_PC_HEARING_GTMP_DATEADD", theValueName);
						logDebug("the days to add based on lookup ->" + theValueName + "< is:" + daysToAddToIssueDate);
						
//						if (fields[fld].getFieldName() == "Site Visit") {
						if (daysToAddToIssueDate) {
							// create a new FieldPK object to use in the next aa.condition line
							var aFieldPK = new com.accela.aa.template.field.GenericTemplateFieldPK();
								aFieldPK.fieldName = fields[fld].getFieldName();
								aFieldPK.groupName = fields[fld].getGroupName();
								aFieldPK.subgroupName = fields[fld].getSubgroupName();
							
							logDebug("calling dateAddHC3 with this date:"+chkIssuedDate);
							
							// use dateAddHC3 with the lookup days to set the date 
							var newGTmpDate = dateAddHC3(chkIssuedDate,daysToAddToIssueDate,"Y");
							
//							newGTmpDate = "12/31/2018";
							
							logDebug("After calling dateAddHC3 we have:"+newGTmpDate);
							
							// set the date 
							aa.condition.editField4TemplateForm(myEntity,aFieldPK, newGTmpDate);
							
							// Potentially right here we'll need a look up to the ASIT for each Gtmp Field to
							// populate a list on the record ... if that is still needed!

									// look up the ASIT for this field 
									// create an ASIT row for the myEntity (the condition) 
										// each column in the ASIT is the field list here 
										
									// we could make this generic by looking at the controlstring for the event
									// and if its an update we update the appropriate ASIT row (replace it)
									// otherwise we just add the new row
							
						}
					}
				}
			}
		}
	}
}

logDebug("ACAA End");
