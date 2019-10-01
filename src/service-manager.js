import axios from 'axios';
import { getLocalIP } from './ip';

const ServiceManagerSignature = 'service-manager';

export const checkServiceManager = (serviceManagerEndpoint) => axios.get(serviceManagerEndpoint)
  .then((response) => {
    if (response.data && response.data.service !== ServiceManagerSignature) {
      return Promise.reject(new Error('service-manager signature mismatch'));
    }

    return Promise.resolve();
  });

export const notifyServiceManager = (serviceManagerEndpoint, name, endpoint, value = '') => {
  const data = JSON.stringify(value);
  const url = `${serviceManagerEndpoint}/register?service=${name}&endpoint=${endpoint}`;
  return axios.post(url, data);
};

export const register = (opts = {}) => {
  const defaultOptions = {
    updateInterval: 20 * 1000,
    endpoint: getLocalIP(),
    value: () => '',
  };

  const options = Object.assign(defaultOptions, opts);

  if (options.name === undefined || options.name === '') {
    throw new Error('service-manager name not set');
  }

  if (options.managerEndpoint === undefined || options.managerEndpoint === '') {
    throw new Error('service-manager managerEndpoint not set');
  }

  const getValue = (v) => {
    if (v instanceof Function) {
      return v();
    }

    return v;
  };

  const notify = () => notifyServiceManager(
    options.managerEndpoint,
    options.name,
    options.endpoint,
    getValue(options.value),
  );

  return checkServiceManager(options.managerEndpoint).then(() => {
    if (options.updateInterval > 0) {
      setInterval(() => {
        notify().catch((err) => {
          console.error(`service-manager endpoint error, errno=${err.errno} code=${err.code}`);
        });
      }, options.updateInterval).unref();
    }

    return notify();
  });
};
