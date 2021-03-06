import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';
import { createLogger } from '../../utils/logger';
import { UpdateContact } from '../../businessLogic/phonebook';
import { ContactUpdateRequest } from '../../requests/ContactUpdateRequest';

// logger
const logger = createLogger('updatecontact');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const { contactId } = event.pathParameters;
  const newContactInfo: ContactUpdateRequest = JSON.parse(event.body);

  // verify user they are logged in
  const authorization = event.headers.Authorization;
  const split = authorization.split(' ');
  const jwtToken = split[1];

  logger.info('update contact with the id: ', contactId);

  const newContact = await UpdateContact(contactId, jwtToken, newContactInfo);

  console.log('newContact')
  console.log(newContact)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({
      ...newContact,
    }),
  };
};
