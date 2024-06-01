import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  List,
  ListItem,
  ListItemText,
  Box,
  IconButton,
  Button,
} from '@mui/material';
import { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { findUser } from '~/redux/slices/userSlice';
import { unwrapResult } from '@reduxjs/toolkit';

export default function InviteToWorkspaceDialog({ open, onClose, onInvite }) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  const handleSearch = async () => {
    if (email) {
      try {
        const resultAction = await dispatch(findUser({ email }));
        const result = unwrapResult(resultAction);
        setSearchResult(result);
      } catch (err) {
        toast.error('User not found!');
        setSearchResult(null);
      }
    }
  };

  const handleInvite = () => {
    if (searchResult) {
      onInvite(searchResult);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Invite a member</DialogTitle>
      <DialogContent
        sx={{
          width: '500px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <TextField
            autoFocus
            margin="dense"
            id="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="outlined"
            value={email}
            size="small"
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={(event) => {
              if (event.key === 'Enter' && email) {
                handleSearch();
                event.preventDefault();
              }
            }}
          />
          <IconButton
            type="button"
            aria-label="search"
            sx={{
              mt: '3px',
              ml: 1,
            }}
            onClick={handleSearch}
          >
            <SearchIcon />
          </IconButton>
        </Box>
        <List>
          {searchResult ? (
            <ListItem>
              <ListItemText
                primary={searchResult.displayName}
                secondary={searchResult.email}
              />
              <Button onClick={handleInvite}>Invite</Button>
            </ListItem>
          ) : (
            'No result'
          )}
        </List>
      </DialogContent>
    </Dialog>
  );
}
