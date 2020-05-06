function addRefContactToRecord(refNum, cType) {
    itemCap = capId;
    if (arguments.length > 2)
        itemCap = arguments[2];
    var refConResult = aa.people.getPeople(refNum);
    if (refConResult.getSuccess()) {
        var refPeopleModel = refConResult.getOutput();
        if (refPeopleModel != null) {
            pm = refPeopleModel;
            pm.setContactType(cType);
            pm.setFlag("N");
            pm.setContactAddressList(getRefAddContactList(refNum));
            
            // var result = aa.people.createCapContactWithRefPeopleModel(itemCap, pm);
            if (pm.getSuccess()) {
                logDebug("Successfully added the contact");
            }   
            else {
                logDebug("Error creating the applicant " + pm.getErrorMessage());
            }
        }
    }
}
