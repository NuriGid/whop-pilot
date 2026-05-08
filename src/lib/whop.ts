import { WhopServerSdk } from '@whop/sdk';

function getWhopClient() {
  const apiKey = process.env.WHOP_API_KEY;
  if (!apiKey) {
    throw new Error('WHOP_API_KEY environment variable is not set');
  }
  return new WhopServerSdk({ token: apiKey });
}

export { getWhopClient };
