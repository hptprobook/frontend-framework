import { Container, Grid, Avatar, TextField, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getCurrent, updateUser } from '~/redux/slices/userSlice';

const ProfilePage = () => {
  const { current } = useSelector((state) => state.users);
  const dispatch = useDispatch();

  const [photoURL, setPhotoURL] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    dispatch(getCurrent());
  }, [dispatch]);

  useEffect(() => {
    if (current) {
      setPhotoURL(current.photoURL || '');
      setDisplayName(current.displayName || '');
      setEmail(current.email || '');
      setPhoneNumber(current.phoneNumber || '');
    }
  }, [current]);

  const handleSaveChanges = () => {
    dispatch(updateUser({ photoURL, displayName, email, phoneNumber }));
    toast.success('Update profile successfully!');
  };

  return (
    <Container
      sx={{
        mt: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        <Grid item xs={12} display="flex" justifyContent="center">
          <Avatar
            alt="Profile Picture"
            src={photoURL}
            sx={{ width: 100, height: 100 }}
          />
        </Grid>
        <Grid item xs={12} display="flex" justifyContent="center">
          <Button variant="contained" component="label">
            Upload Photo
            <input
              type="file"
              hidden
              onChange={(e) =>
                setPhotoURL(URL.createObjectURL(e.target.files[0]))
              }
            />
          </Button>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Full Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={current?.loginMethod === 'email'}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            disabled={current?.loginMethod === 'phone'}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} display="flex" justifyContent="center">
          <Button variant="contained" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfilePage;
