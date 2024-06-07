import { useState } from 'react';
import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import Logo from '~/assets/trello.svg?react';
import SvgIcon from '@mui/material/SvgIcon';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import GoogleIcon from '@mui/icons-material/Google';
import { Link } from 'react-router-dom';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import 'firebase/auth';
import { toast } from 'react-toastify';
import useAuthStatus from '~/hooks/useAuthStatus';
import { loginGoogle, loginWithPhoneNumber } from '~/redux/slices/authSlice';

export default function AuthPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [showOtpForm, setShowOtpForm] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuth = useAuthStatus();
  const googleProvider = new GoogleAuthProvider();
  const auth = getAuth();

  useEffect(() => {
    if (isAuth) {
      navigate('/w');
    }
  }, [isAuth, navigate]);

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        'recaptcha-container',
        {
          size: 'normal',

          'expired-callback': () => {
            toast.error('OTP expired! Please try again.');
          },
        }
      );
    }
  }, [auth]);

  /* Xử lý login bằng Google */
  const handleLoginGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const user = result.user;
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('accessToken', user.accessToken);
        dispatch(
          loginGoogle({
            data: {
              user_id: user.uid,
              displayName: user.displayName,
              email: user.email,
              photoURL: user.photoURL,
              refreshToken: user.refreshToken,
            },
          })
        );
        // navigate('/w');
        // window.location.reload();
      })
      .catch(() => {
        toast.error('Cannot sign in with Google! Please try again');
      });
  };

  const handleSendOtp = () => {
    const appVerifier = window.recaptchaVerifier;

    signInWithPhoneNumber(auth, `+84${phoneNumber}`, appVerifier)
      .then((confirmationResult) => {
        setConfirmationResult(confirmationResult);
        setShowOtpForm(true);
        toast.success('OTP has been sent!');
      })
      .catch(() => {
        toast.error('Failed to send OTP! Please try again.');
      });
  };

  const handleVerifyOtp = () => {
    if (confirmationResult && otp) {
      confirmationResult
        .confirm(otp)
        .then((result) => {
          const user = result.user;
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('accessToken', user.accessToken);
          dispatch(
            loginWithPhoneNumber({
              data: {
                user_id: user.uid,
                phoneNumber: user.phoneNumber,
                refreshToken: user.refreshToken,
              },
            })
          );
          // navigate('/w');
          // window.location.reload();
        })
        .catch(() => {
          toast.error('Invalid OTP! Please try again.');
        });
    }
  };

  return (
    <Box
      sx={{
        width: '400px',
        p: 3,
        bgcolor: '#fff',
        boxShadow: '2xl',
        borderRadius: '5px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Link to={'/'}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <SvgIcon
            component={Logo}
            inheritViewBox
            fontSize="medium"
            sx={{ color: '#333' }}
          />
          <Typography
            sx={{ fontSize: '20px', fontWeight: 'bold', color: '#333' }}
          >
            Trello
          </Typography>
        </Box>
      </Link>
      {!showOtpForm && (
        <>
          <Typography
            variant="h6"
            sx={{
              textAlign: 'center',
              mt: 2,
              fontSize: '18px',
            }}
          >
            Please login to continue ...
          </Typography>
          <TextField
            label="Phone number..."
            fullWidth
            size="small"
            sx={{
              mt: 2,
            }}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <Box
            sx={{
              mt: 2,
            }}
            id="recaptcha-container"
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              mt: 2,
            }}
            onClick={handleSendOtp}
          >
            Send OTP
          </Button>
        </>
      )}

      {showOtpForm && (
        <>
          <TextField
            label="OTP..."
            fullWidth
            size="small"
            sx={{
              mt: 2,
            }}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              mt: 2,
            }}
            onClick={handleVerifyOtp}
          >
            Verify OTP
          </Button>
        </>
      )}
      <Typography
        variant="h6"
        sx={{
          fontSize: '18px',
          my: 2,
        }}
      >
        Or continue with:{' '}
      </Typography>
      <Button
        variant="outlined"
        fullWidth
        sx={{ mb: 1 }}
        startIcon={<GoogleIcon />}
        onClick={handleLoginGoogle}
      >
        Login With Google
      </Button>
    </Box>
  );
}
