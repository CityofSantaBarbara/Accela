//********************************************************************************************************
//Script 		doHttpGET.js
//
//Record Types:	any
//
//Event: 		 
//
//Desc:			helper function to process web service GET json query
//
//Created By: Silver Lining Solutions
//********************************************************************************************************
// Change Log
//			Date		Name		Modification
//			01-22-2019	Chad		created
//********************************************************************************************************
function doHttpGET(username, password, url, contentType) {
    logDebug("Enter doHttpGET()");
    logDebug("username: " + username);
    logDebug("password: " + password);
    logDebug("url: " + url);
    logDebug("contentType: " + contentType);

    var getRDun = new org.apache.commons.httpclient.methods.GetMethod(url);
    var client = new org.apache.commons.httpclient.HttpClient();

    // ---- Authentication ---- //
    if(username !== null && password !== null){
        var creds = new org.apache.commons.httpclient.UsernamePasswordCredentials(username, password);
        client.getParams().setAuthenticationPreemptive(true);
        client.getState().setCredentials(org.apache.commons.httpclient.auth.AuthScope.ANY, creds);
    }
    // -------------------------- //
    getRDun.setRequestHeader("Content-type", contentType);
    
    var status = client.executeMethod(getRDun);

    if(status >= 400){
        throw "HTTP Error: " + status;
    }
    
    var br = new java.io.BufferedReader(new java.io.InputStreamReader(getRDun.getResponseBodyAsStream()));
    var response = "";
    var line = br.readLine();
    while(line != null){
        response = response + line;
        line = br.readLine();
    }

    getRDun.releaseConnection();

    logDebug("Exit doHttpGET()");
    return response;
}
