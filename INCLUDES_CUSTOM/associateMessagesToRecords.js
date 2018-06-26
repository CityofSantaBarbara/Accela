function associateMessagesToRecords(messages)
{
	if(messages){
		var i = 0;  var len = messages.length; 
		while(i < len)
		{
			var message = messages[i];
			var content = message.getTitle();
			var cmId = message.getCmId();
			var altId = parseAltIdFromContent(content);
			var messageBody = message.getContent();
			var messageModel = message.getModel();
			var messageFrom = messageModel.getFromString();
			var messageTo = messageModel.getToString();
			
			var altIdResult= new String(parseAltIdFromContent(content));
			var altIdMatch = altIdResult.split(',');
			logDebug("Subject: " + content);
			logDebug("Record ID from the Subject Line: " + altIdMatch);
			
			var altId = altIdMatch[1];
			if (altId)
			{
				aa.communication.associateEnities(cmId, altId, 'RECORD');
				logDebug("Successfully associated message with Record: " + altId);
				return true;
			}
			else
			{
				logDebug("Record ID not found, sending bounce back email.");
				email(messageFrom, messageTo, bouncebackSubject + ": " + content, bouncebackBody + ": <br><br>" + messageBody);
				
				if (sendDebugEmail)
				{
					email(debugEmailAddress, messageTo, "Debug log from CommunicationReceivingEmailAfter Event Script", debug);
				}
						
				return false;
			}
			i++;						
		}
	}
}
