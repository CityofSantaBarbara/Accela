function associateMessagesToRecords(messages)
{
	if(messages){
		var i = 0;  var len = messages.length; 
		logDebug("<br> PROCESSING "+len+" MESSAGES THIS TIME!");
		var assocSuccessCnt = 0;
		while(i < len)
		{
			logDebug("<br> Now processing message number:"+i);
			var message = messages[i];
			var content = message.getTitle();
			var cmId = message.getCmId();
			var altId = parseAltIdFromContent(content);
			var messageBody = message.getContent();
			var messageModel = message.getModel();
			var messageFrom = messageModel.getFromString();
			var messageTo = messageModel.getToString();
			
			if (altId)
			{
				var altIdResult= new String(parseAltIdFromContent(content));
				var altIdMatch = altIdResult.split(',');
				logDebug("<br> Subject: " + content);
				logDebug("<br> Record ID from the Subject Line: " + altIdMatch);
				logDebug("<br> msg from:"+messageFrom);
				logDebug("<br> msg Body:"+messageBody);
				
				var altIdStrArr = altIdMatch[1].split(' ');
				var altId = altIdStrArr[0].toUpperCase();

				aa.communication.associateEnities(cmId, altId, 'RECORD');
				logDebug("<br> Successfully associated message with Record: " + altId + " TO THE COMM ID:"+cmId);
				assocSuccessCnt += 1; 
				break;
			}
			else
			{
				logDebug("<br> Record ID not found, sending bounce back email.");
				email(messageTo, scriptAgencyEmailFrom, bouncebackSubject + ": " + content, bouncebackBody + ": <br><br>" + messageBody);
				break;
			}
			i++;
		}
	}
	if (sendDebugEmail)
	{
//		var bugDte = new Date();
		var bugDte = "11-09-2018 at the time I say";
		var debugTitle = "Debug log from INCLUDES CUSTOM CommunicationReceivingEmailAfter Event Script on " + bugDte;
		
		logDebug("<br>"+"trying to send an DEBUG email from inside .INCLUDES CUSTOM.associateMessagesToRecords");
		logDebug("<br>"+">>>>>>>>>>>>>> debugEmailAddress:"+debugEmailAddress);
		logDebug("<br>"+">>>>>>>>>>>>>> scriptAgencyEmailFrom:"+scriptAgencyEmailFrom);
		logDebug("<br>"+">>>>>>>>>>>>>> debugTitle:"+debugTitle);
		logDebug("<br>"+">>>>>>>>>>>>>> assocSuccessCnt:"+assocSuccessCnt);
		
		email(debugEmailAddress, scriptAgencyEmailFrom, "no debug date in INCLUDES CUSTOM.associateMessagesToRecords", debug);
//		email(debugEmailAddress, scriptAgencyEmailFrom, debugTitle, debug);
	}
	if ( assocSuccessCnt > 0 ) {
		return true;
	}
	else {
		return false;
	}
}
