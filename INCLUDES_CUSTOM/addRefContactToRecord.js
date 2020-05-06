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
                      
        }
    }
}
