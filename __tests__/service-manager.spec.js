import nock from 'nock';
import { checkServiceManager, register } from '../src/service-manager';

describe('When check service manager', () => {
  describe('With wrong signature', () => {
    it('Should reject with signature error', () => {
      const scope = nock('http://service-manager.com')
        .get('/')
        .reply(200, {
          not: 'valid',
        });

      return checkServiceManager('http://service-manager.com').catch((err) => {
        expect(err.toString()).toBe('Error: service-manager signature mismatch');
        expect(scope.isDone()).toBeTruthy();
      });
    });
  });

  describe('With right signature', () => {
    it('Should not return error', () => {
      const scope = nock('http://service-manager.com')
        .get('/')
        .reply(200, {
          service: 'service-manager',
        });

      return checkServiceManager('http://service-manager.com').catch((err) => {
        expect(err).toBeNull();
        expect(scope.isDone()).toBeTruthy();
      });
    });
  });
});

describe('Register a new service', () => {
  describe('With missing name', () => {
    it('Should throw error', () => {
      try {
        register({
          managerEndpoint: 'http://localhost:8080',
          endpoint: 'http://10.0.0.10:9000',
          value: 'no value',
        });
      } catch (e) {
        expect(e.toString()).toBe('Error: service-manager name not set');
      }
    });
  });

  describe('With missing serverManager', () => {
    it('Should throw error', () => {
      try {
        register({
          name: 'MyService',
          endpoint: 'http://10.0.0.10:9000',
          value: 'no value',
        });
      } catch (e) {
        expect(e.toString()).toBe('Error: service-manager managerEndpoint not set');
      }
    });
  });

  describe('With all fields', () => {
    it('Should not throw error', () => {
      const scope = nock('http://localhost:8080')
        .get('/')
        .reply(200, {
          service: 'service-manager',
        })
        .post('/register', JSON.stringify('no value'))
        .query({
          service: 'MyService',
          endpoint: 'http://10.0.0.10:9000',
        })
        .delayBody()
        .reply(200, {});

      try {
        register({
          name: 'MyService',
          managerEndpoint: 'http://localhost:8080',
          endpoint: 'http://10.0.0.10:9000',
          value: 'no value',
          updateInterval: -1,
        });
      } catch (e) {
        expect(e).toBeNull();
        expect(scope.isDone()).toBeTruthy();
      }
    });
  });
});
