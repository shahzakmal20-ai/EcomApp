import base64 from 'base-64';

export const DOMAIN_URL = 'https://staging.meetdaisy.co';

export const STAGING_USERNAME = 'meetdaisy staging';
export const STAGING_PASSWORD = 'meetdaisyco';

export const getAuthHeader = () => {
  return 'Basic ' + base64.encode(`${STAGING_USERNAME}:${STAGING_PASSWORD}`);
};