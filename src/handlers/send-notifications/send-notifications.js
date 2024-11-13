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

  // Publish message to SNS topic
  const snsParams = {
    Message: message,
    TopicArn: process.env.SNS_TOPIC_ARN, // Ensure this environment variable is set
  };

  try {
    const command = new PublishCommand(snsParams);
    const result = await snsClient.send(command);
    console.log('Notification sent successfully', result);
  } catch (error) {
    console.error('Failed to send notification', error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Notifications processed successfully' }),
  };
};