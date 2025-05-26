// src/firebase-admin.ts
import * as admin from 'firebase-admin';
import * as serviceAccount from '../../../secrets/appofertando-43aca-firebase-adminsdk-fbsvc-177c0a1bba.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export { admin };
