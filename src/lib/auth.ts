import { headers } from 'next/headers';
import { WhopServerSdk } from '@whop/sdk';
import { getWhopClient } from './whop';

export async function verifyUserToken() {
  try {
    const headersList = await headers();
    const authorization = headersList.get('authorization');

    if (!authorization || !authorization.startsWith('Bearer ')) {
      // Local demo fallback
      if (process.env.NODE_ENV === 'development') {
        return { user: { id: 'usr_mock_123', name: 'Nuri (Dev Mode)' }, token: 'mock_token', error: null };
      }
      return { user: null, error: 'No token provided' };
    }

    const token = authorization.split(' ')[1];
    
    // Gerçek Whop Entegrasyonu
    // Whop iframe üzerinden gelen kullanıcı token'ı ile SDK'yı başlatıyoruz
    const userClient = new WhopServerSdk({ token });
    
    // Kullanıcı bilgilerini çekiyoruz
    const userResponse = await userClient.users.retrieve({ id: 'me' });
    
    return { 
      user: { 
        id: userResponse.id, 
        name: userResponse.name || userResponse.username || 'Whop User'
      }, 
      token,
      error: null 
    };

  } catch (error) {
    console.error('Token verification failed:', error);
    // Local demo fallback
    if (process.env.NODE_ENV === 'development') {
      return { user: { id: 'usr_mock_123', name: 'Nuri (Dev Mode Fallback)' }, token: 'mock_token', error: null };
    }
    return { user: null, error: 'Invalid token' };
  }
}
