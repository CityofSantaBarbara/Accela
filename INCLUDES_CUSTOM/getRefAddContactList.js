function getRefAddContactList(peoId){
    var conAdd = aa.proxyInvoker.newInstance("com.accela.orm.model.address.ContactAddressModel").getOutput();
    conAdd.setEntityID(parseInt(peoId));
    conAdd.setEntityType("CONTACT");
    var addList =  aa.address.getContactAddressList(conAdd).getOutput();
    var tmpList = aa.util.newArrayList();
    var pri = true;
    for(x in addList){
        if(pri){
            pri=false;
            addList[x].getContactAddressModel().setPrimary("Y");
        }
        tmpList.add(addList[x].getContactAddressModel());
    }
       
    return tmpList;
}