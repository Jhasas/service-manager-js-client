import { getLocalIP } from '../src/ip';

describe('Get local ip', () => {
  it('Should return the correct ip', () => {
    const ip = getLocalIP();
    expect(ip).toEqual('192.168.0.10');
  });
});
