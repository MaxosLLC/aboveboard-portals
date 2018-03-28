import feathersClient from './feathersClient';
import reduxifyAuthentication from 'feathers-reduxify-authentication';

export default reduxifyAuthentication(feathersClient, {
  isUserAuthorized: user => true,
});
