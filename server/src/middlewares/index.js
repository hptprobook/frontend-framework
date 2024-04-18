// Verify Access Token
import * as admin from 'firebase-admin';
// import * as serviceAccount from '~/firebase/serviceAccount.json';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      type: 'service_account',
      project_id: 'trelloapp-b7c15',
      private_key_id: 'e055a6dd8f8227a8164bd3b2bcb41fcbdc546b0c',
      private_key:
        '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDLk2bhHJ7LtUMN\nJVIon+ZhpWvL4v0VAW3TlPH5YdAq/9maQ1XTUF2ZNUIRYPLyQvnYxwDNRhIbJfxX\nRq39xJ27czR2N3ub/6/b4gqP0eW3iSUk1KnlocB9njJKvuVv0B5ZptBL/2n+Gl9/\nMaytvmj0gHKiYi2kyhuLaq+Dkz7+PD2mQOVr7EdvZ6eXbVNb7bQdrJH6HijvI84y\n1nMzdrAbSKyTCjXWYbVkwpjbnJeY1T4Lt9J6/vyk0oMPnNXLELMgtbNPDhr4/qhR\novXZvzEGaIDFF0o28D+qDc35dQbq6ENoUnL5RuU0npfwgu7lS6/4RPobjv/rJe+r\nesW2HzNJAgMBAAECggEAZbCm5nImfHl6Gfn3lWVybnp0Y29qnnCNTPCNAtayZphR\nOXbDS4BMkPiCnS3BjfSY24lkxCVpa/hImcwro6Twaa99mEPU0jMhxIOgZQEjb8/p\nJwG4MIXhIp7AXogHEhhy4LOsPxpB9vVzmJTWvh9sTB5RpP3H8RYoNjc/n0kRYWsO\n+HNGp0s2D9Xk8bfr5GJrA3COFp2CvmRwgnTCYlStvfb26qXqrqpPOL2sJhW0E18r\nUDZ0sZjzMLmGGr+DCCBolJ/a3UNSx73gvt9i9DBu3jsJJEAATz52wOxPIUcW8DZt\nRvBP6uyToQP3/AEZ+1oQGWGIPktqbwTgTh/d3n8MlQKBgQD7fUC39jTutmkFx6wG\nnw/p/2ZVYFCUExzvtcLz3HfRoHCkdJ+xgMaECwzOO0K+vgxDb3iDeeIxOZgSbCrV\nOV2ABCQhgGnu1kcZLNkkFauABR0+X3jmIlfy/DjekAaO0jFtFCfP5I3r/EOhSsV7\nJbnLznAdFH/wvOePgn4k0ktObwKBgQDPOiXWX3w7sd7+lv/SqLBITR5x6F9pdbW5\nCDaoLLSAUsDowZhex1jBfIRu5J6tNBAcd67qOJjx6TOFTegNmZQ6MjfxH31gp05a\nsJVpa6eAsEPT2kZbpA9/jWDzNy3cBE8qPcIICLMSr1aVlkmJs/r+t1/hcnnBkJOS\nJRdXX0v1xwKBgAkr2i5bRjbmZBIX5AghyNzJuZundYjQ4Z9ES6XFBoGYjkMRFbnN\nbm/mT0M+GgMGvz++UvDIgx00cn1JgI5iFyzR+ddW7YYOPm2GmyybtbNnfFeH98q8\nueRcml5TdknDFJZbw8/rD9npSzYYmfcRuyLZlnEZDEllOjSbl6oUGTb1AoGBAJNx\nhhZ/nf9DUazHd4JFsBfhdzYI5ko9DG144JrMJCnht4xkoqtdH1Ob6waT+Cq4jnYS\n2gug9YG6MYQ5qFB047h8nr0bcLPilqeEWOrHREkWIUyNU95EXxqcV0z2B9Ux47nk\nczgQKIm04+BPLEekHYQ6qSfZsbP90GH9rhvmnD9lAoGBAMSt2neEdM7JWk8pfdNa\nV7V8XvfZiVQiHiR1a/cJrUHO5vmR1MMr4S8T5lQIDNymgcY9A5A9frP+/FbfrnOt\nDMH3y/eh2T/pFwLhq7epGlCRBIZSomppAfBsYvc1OXdmf7W+CHh8oDCe9o2VrCeX\nk8Oo1eVV9WJ8qpGUc465QnAC\n-----END PRIVATE KEY-----\n',
      client_email:
        'firebase-adminsdk-47zzu@trelloapp-b7c15.iam.gserviceaccount.com',
      client_id: '118080807695875855559',
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url:
        'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-47zzu%40trelloapp-b7c15.iam.gserviceaccount.com',
      universe_domain: 'googleapis.com',
    }),
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
