
Javascript client for [https://github.com/crossworth/service-manager](https://github.com/crossworth/service-manager)

Example usage:
```js
 register({
  name: 'MyService',
  managerEndpoint: 'http://localhost:8080',
  endpoint: 'http://10.0.0.10:9000',
  value: 'my value',
});

```