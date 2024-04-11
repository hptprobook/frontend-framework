// Verify Access Token
import * as admin from 'firebase-admin';
import serviceAccount from '~/firebase/serviceAccount.json';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const verifyAccessToken = async (req, res, next) => {
  const accessToken = req.headers.authorization?.split(' ')[1];

  if (!accessToken) {
    return res.status(401).send({ message: 'Unauthenticated' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(accessToken);
    req.userId = decodedToken.user_id;
    if (!decodedToken) {
      return res.status(401).send({ message: 'Invalid access token.' });
    }

    req.user = decodedToken;

    next();
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
};

export default verifyAccessToken;
