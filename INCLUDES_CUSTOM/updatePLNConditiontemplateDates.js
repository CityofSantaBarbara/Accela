function updatePLNConditiontemplateDates() {
	logDebug("START updatePLNConditiontemplateDates");

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

							// Look up the number of days to add or subtract
							var daysToAddToIssueDate = null;
							var theValueName = sgrpName + "." + fields[fld].getFieldName();
							daysToAddToIssueDate = lookup("PLN_PC_HEARING_GTMP_DATEADD", theValueName);
							
							if (daysToAddToIssueDate) {
								// create a new FieldPK object to use in the next aa.condition line
								var aFieldPK = new com.accela.aa.template.field.GenericTemplateFieldPK();
									aFieldPK.fieldName = fields[fld].getFieldName();
									aFieldPK.groupName = fields[fld].getGroupName();
									aFieldPK.subgroupName = fields[fld].getSubgroupName();
								
								//  PLN wants to initially just adjust the date
								//  based on the number of calendar days.  THEN check that date and if it falls on 
								//  a non-working day, move it one more (positive or negative).
								
								var newGTDate = dateAddHC3(chkIssuedDate,parseInt(daysToAddToIssueDate));
								var newGTmpDate = new Date(newGTDate);
								
								logDebug("okay before we check holidays the date is:"+newGTmpDate);
								if (checkHolidayCalendar(newGTmpDate)) {
									logDebug("OOPS that day is a Non Working Day Silly!");
									if (parseInt(daysToAddToIssueDate) > 0) {
										logDebug("The days to add is a positive number - Lets move FORWARD to a working day.");
										var newGTmpDate2 = dateAddHC3(newGTDate,1,"Y");
									}
									else {
										logDebug("The days to add is a negative number or zero - Lets move BACKWARD to a working day.");
										var newGTmpDate2 = dateAddHC3(newGTDate,-1,"Y");
									}
									newGTDate = newGTmpDate2;
								}
								
								// use dateAddHC3 with the lookup days to set the date 
								
								logDebug("After ALL THOSE DATE CHECKS we have:"+newGTDate);
								
								// set the date 
								aa.condition.editField4TemplateForm(myEntity,aFieldPK, newGTDate);
							}
						}
					}
				}
			}
		}
	}
}
