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
import { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { useDispatch, useSelector } from 'react-redux';
import { updateBoardDetails } from '~/redux/slices/boardSlice';
import { toast } from 'react-toastify';

export default function InviteDialog({
  open,
  onClose,
  onSearch,
  result,
  oldBoard,
}) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const { error, updatedBoard } = useSelector((state) => state.boards);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }

    if (updatedBoard) {
      toast.success('Invite member successfully!');
    }
  }, [error, updatedBoard]);

  const handleSearch = () => {
    if (email) {
      onSearch(email);
    }
  };

  const handleInvite = () => {
    const newBoard = {
      ownerIds: oldBoard.ownerIds,
      title: oldBoard.title,
      userId: oldBoard.userId,
    };
    if (!newBoard.ownerIds.includes(result._id)) {
      newBoard.ownerIds.push(result._id);
      dispatch(updateBoardDetails({ id: oldBoard._id, data: newBoard }));
    } else {
      toast.error('Member already exists!');
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
          {result?.email ? (
            <ListItem>
              <ListItemText
                primary={result.displayName}
                secondary={result.email}
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
