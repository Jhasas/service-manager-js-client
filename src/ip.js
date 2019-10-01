import * as internalIp from 'internal-ip';

export const getLocalIP = () => internalIp.v4.sync();
export default getLocalIP;
