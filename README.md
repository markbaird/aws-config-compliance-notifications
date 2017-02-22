# AWS Config Compliance Notifications
Lambda function to send notification emails when the compliance status of an AWS Config Rule changes


## Prerequisites: 
- [Apex Framework](https://github.com/apex/apex) installed locally
- [NodeJS and NPM](https://nodejs.org) installed locally
- [AWS Config service](https://aws.amazon.com/config/) enabled in your AWS account and monitoring compliance
- AWS Config notifications streaming to an SNS topic.
- [AWS SES service](https://aws.amazon.com/ses/) enabled in your AWS account 
    and out of [sandbox mode](http://docs.aws.amazon.com/ses/latest/DeveloperGuide/request-production-access.html)
   
## Setup:
- Check out this project
- Modify the `FROM` and `EMAILS` Lambda environment variables in `function.json`. `FROM` should be the 
    from address you want your notification emails to come from. `EMAILS` should be a semicolon separated list
    of email addresses to send notifications to.
- Deploy the Lambda function to your AWS account using the `apex` command line tool.
- In the AWS SNS console, add the new Lambda function as a subscription to the SNS topic that AWS Config
    sends notifications to.
   