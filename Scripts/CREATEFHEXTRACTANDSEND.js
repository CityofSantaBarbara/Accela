/*------------------------------------------------------------------------------------------------------/
| Program: CreateFHExtractAndSend.js  Trigger: Batch
| Client: Santa Barbara, CA
| Partner:  Silver Lining Solutions, Copywrite 2017
|
| Frequency: Run every night
|
| Desc: This batch script will create a fire house extract report and FTP it for 
|       every record with a passed fire inspection dated today.
|
/------------------------------------------------------------------------------------------------------*/
/*  - use the following for Script Tester  
aa.env.setValue("showDebug","Y");
aa.env.setValue("NumberDaysOld","28");
aa.env.setValue("BatchJobName", "CreateFirehouseExtract-TEST");
aa.env.setValue("emailAddress","chad@esilverliningsolutions.com.com");
aa.env.setValue("ftpURL","ftp.accela.com");
aa.env.setValue("ftpPort","21");
aa.env.setValue("ftpUserName","santa.barbara");
aa.env.setValue("ftpPassword","Enterpriseuser1");
aa.env.setValue("ftpFolder","");
 */
/*------------------------------------------------------------------------------------------------------/
|
| START: USER CONFIGURABLE PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
emailText = "";
maxSeconds = 3 * 60;		// number of seconds allowed for batch processing, usually < 5*60
message = "";
br = "<br>";
/*------------------------------------------------------------------------------------------------------/
| BEGIN Includes
/------------------------------------------------------------------------------------------------------*/
SCRIPT_VERSION = 2.0


eval(getMasterScriptText("INCLUDES_ACCELA_FUNCTIONS"));
eval(getScriptText("INCLUDES_BATCH"));
eval(getMasterScriptText("INCLUDES_CUSTOM"));


function getScriptText(vScriptName){
	vScriptName = vScriptName.toUpperCase();
	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(),vScriptName,"ADMIN");
	return emseScript.getScriptText() + "";
}

function getMasterScriptText(vScriptName){
	vScriptName = vScriptName.toUpperCase();
	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(),vScriptName);
	return emseScript.getScriptText() + "";
}

/*------------------------------------------------------------------------------------------------------/
|
| END: USER CONFIGURABLE PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
//showDebug = false;

if (String(aa.env.getValue("showDebug")).length > 0) {
	showDebug = aa.env.getValue("showDebug").substring(0, 1).toUpperCase().equals("Y");
}


sysDate = aa.date.getCurrentDate();

batchJobResult = aa.batchJob.getJobID()
batchJobName = "" + aa.env.getValue("BatchJobName");
batchJobID = 0;

if (batchJobResult.getSuccess())
  {
  batchJobID = batchJobResult.getOutput();
  logDebug("Batch Job " + batchJobName + " Job ID is " + batchJobID);
  }
else
  logDebug("Batch job ID not found " + batchJobResult.getErrorMessage());
/*----------------------------------------------------------------------------------------------------/
|
| Start: BATCH PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/

var numDaysOld = getParam("NumberDaysOld");
var emailAddress = getParam("emailAddress"); // email to send report
var ftpURL = getParam("ftpURL");
var ftpPort = getParam("ftpPort");
var ftpUserName = getParam("ftpUserName");
var ftpPassword = getParam("ftpPassword");
var ftpFolder = getParam("ftpFolder");
/*----------------------------------------------------------------------------------------------------/
|
| End: BATCH PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
var startDate = new Date();
var timeExpired = false;

var startTime = startDate.getTime();			// Start timer
var systemUserObj = aa.person.getUser("ADMIN").getOutput();


/*------------------------------------------------------------------------------------------------------/
| <===========Main=Loop================>
|
/-----------------------------------------------------------------------------------------------------*/

logDebug("Start of Job");

if (!timeExpired) mainProcess();

logDebug("End of Job: Elapsed Time : " + elapsed() + " Seconds");

logDebug(emailText);

if (emailAddress.length) {
	var emailSentOK = email(emailAddress,"noreply@accela.com", batchJobName + " Results", emailText);
	if (!emailSentOK) {
		logDebug("EMAIL COULD NOT BE SENT! >" + emailSentOK );
	}
	else {
		logDebug("EMAIL SENT.");
		logDebug(emailText);
	}
}

/*------------------------------------------------------------------------------------------------------/
| <===========END=Main=Loop================>
/-----------------------------------------------------------------------------------------------------*/

function mainProcess() {
	var today = new Date();
	var myParams = aa.util.newHashMap();
	var curMonth = ("0" + (today.getMonth() + 1)).slice(-2);

	myParams.put ("p1Value", numDaysOld);
	tmpFTPFName = "FireHouseExport_"+ today.getFullYear() + curMonth + today.getDate() + today.getHours() + today.getMinutes() + today.getSeconds() + ".csv";
	generateReportAndFTP("Firehouse Export", myParams,"Building", tmpFTPFName);
}

function generateReportAndFTP(aaReportName,parameters,rModule,ftpFileName) {
	var reportName = aaReportName;

	logDebug("- - - - inside generateReport - - - - ");
	logDebug("reportName = " + aaReportName + "or |"+reportName + "|");
	logDebug("rModule = " + rModule);
	logDebug("parameters:");
	logDebug(parameters);
	logDebug("ftp file name = " + ftpFileName);
	
	entries = parameters.entrySet();

	logDebug("entries is:");
	logDebug(entries);

    entriesIterator = entries.iterator();

    report = aa.reportManager.getReportInfoModelByName(reportName);
	report = report.getOutput();
    report.setModule(rModule);
    report.setReportParameters(parameters);
    var canRunReport = aa.reportManager.hasPermission(reportName,"ADMIN");
	
    if(canRunReport.getOutput().booleanValue()) {
		var reportResult = aa.reportManager.getReportResult(report);
		if(reportResult) {
			reportResult = reportResult.getOutput();
		   
			if (reportResult) {

				var myReportFileName = reportResult.name;
				var myNewRptFileName = ftpFileName;
				itWorkedForMe = reportResult.getReportResultModel().setName(myNewRptFileName);
				var myNReportFileName = reportResult.name;
				var reportFile = aa.reportManager.storeReportToDisk(reportResult);
				reportFile = reportFile.getOutput();
				logDebug("reportFile created " + reportFile);
				aa.print("file class: " + reportFile.getClass());

				// use Java.IO to get the file from the file system
				var file = new java.io.File(reportFile);   
					
				// upload the file to an FTP server
				var ftpResult = aa.util.ftpUpload(ftpURL, ftpPort, ftpUserName, ftpPassword, ftpFolder, file);
				if(ftpResult.getSuccess())
				{
					logDebug("Report file successfully uploaded to FTP Server: " + ftpURL + ":" + ftpPort + "/" + ftpFolder);
				}
				else
				{
					logDebug("ERROR Uploading File to FTP Server: " + ftpResult.getErrorMessage());
				} 
			}
			else {
				logMessage("Report returned no result: "+ reportName + " for Admin" + systemUserObj);
				logDebug("Report returned no result: "+ reportName + " for Admin" + systemUserObj);
			}
		} else {
			logMessage("Unable to run report: "+ reportName + " for Admin" + systemUserObj);
			logDebug("Unable to run report: "+ reportName + " for Admin" + systemUserObj);
			return false;
		}
	} else {
		logMessage("No permission to report: "+ reportName + " for Admin" + systemUserObj);
		logDebug("No permission to report: "+ reportName + " for Admin" + systemUserObj);
		return false;
	} 
}