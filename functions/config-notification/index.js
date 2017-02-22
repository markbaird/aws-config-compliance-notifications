var AWS = require("aws-sdk");
AWS.config.region = process.env.AWS_REGION;
var ses = new AWS.SES({region: 'us-east-1'});

var main = function(event, context, callback) {
  console.log('Received event:', JSON.stringify(event, null, 2));

  if (event.hasOwnProperty("Records")) {
    for (var i = 0; i < event.Records.length; i++) {
      if (event.Records[i].hasOwnProperty("Sns") && event.Records[i].Sns.hasOwnProperty("Message")) {
        var message = JSON.parse(event.Records[i].Sns.Message);
        console.log('Received message:', JSON.stringify(message, null, 2));

        if (message.hasOwnProperty("messageType") && message.messageType === "ComplianceChangeNotification") {
          if (message.oldEvaluationResult !== null) {
            // Compliance status changed
            var subject = "Compliance changed from [" +
                message.oldEvaluationResult.complianceType + "] to [" +
                message.newEvaluationResult.complianceType + "]";
            console.log(subject);

            if (message.oldEvaluationResult.complianceType !== message.newEvaluationResult.complianceType) {
              // Send notification email
              sendEmail(subject, message)
                  .then(function(data) {}, function(e) {console.log(e.stack); callback(e, null);});
            }
          }
          else if (message.newEvaluationResult.complianceType !== "COMPLIANT") {
            // New non-compliance event
            var subject = "New non-compliance event recorded [" +
                message.newEvaluationResult.complianceType + "]";
            console.log(subject);

            // Send notification email
            sendEmail(subject, message)
                .then(function(data) {}, function(e) {console.log(e.stack); callback(e, null);});
          }
        }
      }
    }
  }

  callback(null, "Done");
};
exports.handle = main;


function sendEmail(subject, configMessage) {
  var emails = process.env.EMAILS.split(';');
  console.log(" = " + emails);
  process.env.EMAILS
  var params = {
    Destination: {
      ToAddresses: emails
    },
    Message: {
      Body: {
        Html: {
          Data: "A compliance change event has been recorded: <br/>" +
            "<pre>" + JSON.stringify(configMessage, null, 2) + "</pre>"
        }
      },
      Subject: {
        Data: subject
      }
    },
    Source: process.env.FROM
  };

  return ses.sendEmail(params).promise();
}