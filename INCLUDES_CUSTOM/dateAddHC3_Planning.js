function dateAddHC3_Planning(td, amt)
// perform date arithmetic on a string; uses the agency holiday calendar to test for business days
// td can be "mm/dd/yyyy" (or any string that will convert to JS date)
// amt can be positive or negative (5, -3) days
// if optional parameter #3 is present, use working days only
// 
// function corrected by SLS Eric Koontz
//     correctly adjust the target date to ensure that the date returned is a working day
//     correctly handle a zero date adjustment 
{
   	var useWorking = false;
	if (arguments.length == 3)
		useWorking = true;

	if (!td) {
		dDate = new Date();
	}
	else {
		dDate = convertDate(td);
	}
	if (amt == 0 && !checkHolidayCalendar_Planning(dDate)) {
		useWorking = false;
	}
	else {
		var i = 1;
	}
	var nonWorking = false;
	var failsafe = 0;

	// incorporate logic that will increment the date without counting non-working days
	if (useWorking){
		while (i <= Math.abs(amt) && failsafe < 600) {
			// handle positive date changes
			if (amt >= 0) {
				dDate = convertDate(dateAdd(dDate,1));
				if (!checkHolidayCalendar_Planning(dDate)){
					i++;
					failsafe++;
				}
				else {
					failsafe++;
				}
			} 
			// handle negative date changes
			else {
				dDate = convertDate(dateAdd(dDate,-1));
				if (!checkHolidayCalendar_Planning(dDate)){
					i++;
					failsafe++;
				}
				else {
					failsafe++;
				}
			}
		}
	}
	// ignore non-working days and simply use calendar days increment
	else{
		dDate.setDate(dDate.getDate() + parseInt(amt, 10));
	}
	var hcMM = (dDate.getMonth() + 1).toString();
	if (hcMM.length < 2)
		hcMM = "0" + hcMM;
	var hcDD = dDate.getDate().toString();
	if (hcDD.length < 2)
		hcDD = "0" + hcDD;

	retDateStr = hcMM + "/" + hcDD + "/" + dDate.getFullYear()

	logDebug("done going through HC3 and we now have:"+retDateStr);
	return retDateStr;
}
