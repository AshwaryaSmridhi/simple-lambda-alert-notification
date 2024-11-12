const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");

const snsClient = new SNSClient({ region: "ap-southeast-2" });

module.exports.handler = async (event) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  if (!event.Records || !Array.isArray(event.Records) || event.Records.length === 0) {
    console.error('No records found in the event:', JSON.stringify(event, null, 2));
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'No records found in the event' }),
    };
  }

  const message = 'Oops! Something went wrong with the Dog Generator service.'; // Assuming the message body contains the notification content

  // Send SMS notification
  const smsParams = {
    Message: message,
    PhoneNumber: '+61469956784', // Replace with your phone number
    MessageAttributes: {
      'AWS.SNS.SMS.SenderID': {
        DataType: 'String',
        StringValue: 'MySenderID'
      },
      'AWS.SNS.SMS.SMSType': {
        DataType: 'String',
        StringValue: 'Transactional'
      }
    }
  };

  try {
    const command = new PublishCommand(smsParams);
    const result = await snsClient.send(command);
    console.log('SMS notification sent successfully', result);
  } catch (error) {
    console.error('Failed to send SMS notification', error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Notifications processed successfully' }),
  };
};