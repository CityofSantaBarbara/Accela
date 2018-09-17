logDebug("Hello - this is message receive");
associateMessagesToRecords(messages);
logDebug("Hello - this is message receive");

var sendResult = email("chad@esilverliningsolutions.com","cweiffenbach@santabarbaraCA.gov","this subject","this is the text for the email");
if (!sendResult) 
{ logDebug("UNABLE TO SEND NOTICE!  ERROR: "+sendResult); }
else
{ logDebug("Sent test email to chad");
}  