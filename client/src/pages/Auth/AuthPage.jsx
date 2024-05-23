import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import Logo from '~/assets/trello.svg?react';
import SvgIcon from '@mui/material/SvgIcon';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import GoogleIcon from '@mui/icons-material/Google';
import MicrosoftIcon from '@mui/icons-material/Microsoft';
import FacebookIcon from '@mui/icons-material/Facebook';
import AppleIcon from '@mui/icons-material/Apple';
import { Link } from 'react-router-dom';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import 'firebase/auth';
import { toast } from 'react-toastify';
import useAuthStatus from '~/hooks/useAuthStatus';
import { loginGoogle } from '~/redux/slices/authSlice';

export default function AuthPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuth = useAuthStatus();
  const provider = new GoogleAuthProvider();
  const auth = getAuth();

  useEffect(() => {
    if (isAuth) {
      navigate('/w');
    }
  }, [isAuth, navigate]);

  const handleLoginGoogle = () => {
    signInWithPopup(auth, provider)
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
        navigate('/w');
        window.location.reload();
      })
      .catch(() => {
        toast.error('Cannot sign in with Google! Please try again');
      });
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
        label="Email"
        fullWidth
        size="small"
        sx={{
          mt: 2,
        }}
        disabled
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{
          mt: 2,
        }}
        disabled
      >
        Continue
      </Button>
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
      <Button
        variant="outlined"
        fullWidth
        sx={{ mb: 1 }}
        startIcon={<MicrosoftIcon />}
        disabled
      >
        Login With Microsoft
      </Button>
      <Button
        variant="outlined"
        fullWidth
        sx={{ mb: 1 }}
        startIcon={<FacebookIcon />}
      >
        Login With Facebook
      </Button>
      <Button
        variant="outlined"
        fullWidth
        sx={{ mb: 1 }}
        startIcon={<AppleIcon />}
        disabled
      >
        Login With Apple
      </Button>
      <Link>Forgot password ?</Link>
      {/* eslint-disable-next-line quotes */}
      <Link>{"You don't have an account?"}</Link>
    </Box>
  );
}
