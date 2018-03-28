import reduxifyServices from 'feathers-redux';
import feathersClient from './feathersClient';

const appType = /issuer/.test(window.location.hostname) ? 'issuer' : 'broker';

const services = ['user', 'token'];

if (appType === 'broker') {
  services.push('whitelist');
}

export default reduxifyServices(feathersClient, services);
