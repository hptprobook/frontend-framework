import { Box } from '@mui/material';
import Chip from '@mui/material/Chip';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SyncLockIcon from '@mui/icons-material/SyncLock';
import AddToDriveIcon from '@mui/icons-material/AddToDrive';
import BoltIcon from '@mui/icons-material/Bolt';
import FilterListIcon from '@mui/icons-material/FilterList';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { capitalizeFirstLetter } from '~/utils/formatters';
import { useEffect, useState } from 'react';
import InviteDialog from './InviteDialog';
import { useDispatch, useSelector } from 'react-redux';
import { findUser } from '~/redux/slices/userSlice';

const MENU_STYLES = {
  color: '#fff',
  bgcolor: 'transparent',
  border: 'none',
  px: '5px',
  borderRadius: '4px',
  '& .MuiSvgIcon-root': {
    color: '#fff',
  },
  '&:hover': {
    bgcolor: 'primary.50',
  },
};

function BoardBar({ board }) {
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const result = useSelector((state) => state.users.findResults);
  const [searchResult, setSearchResult] = useState(null);
  const dispatch = useDispatch();

  const handleInviteMember = () => {
    setInviteDialogOpen(true);
  };

  const handleCloseInvite = () => {
    setInviteDialogOpen(false);
  };

  const handleSearchEmail = async (email) => {
    dispatch(findUser({ email }));
  };

  useEffect(() => {
    if (result) {
      setSearchResult(result);
    }
  }, [result]);

  return (
    <Box
      px={2}
      sx={{
        width: '100%',
        height: (theme) => theme.height.boardBarHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        overflowX: 'auto',
        overflowY: 'hidden',
        bgcolor: (theme) =>
          theme.palette.mode === 'dark' ? '#34495e' : '#1976d2',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Chip
          sx={MENU_STYLES}
          clickable
          icon={<DashboardIcon />}
          label={board?.title}
        />
        <Chip
          sx={MENU_STYLES}
          clickable
          icon={<SyncLockIcon />}
          label={capitalizeFirstLetter(board?.type)}
        />
        <Chip
          sx={MENU_STYLES}
          clickable
          icon={<AddToDriveIcon />}
          label="Add to Google Drive"
        />
        <Chip
          sx={MENU_STYLES}
          clickable
          icon={<BoltIcon />}
          label="Automation"
        />
        <Chip
          sx={MENU_STYLES}
          clickable
          icon={<FilterListIcon />}
          label="Filter"
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<PersonAddIcon />}
          sx={{
            color: '#fff',
            borderColor: '#fff',
            '&:hover': {
              border: '2px solid #fff',
            },
            '& .MuiButton-startIcon': {
              mb: '3px',
            },
          }}
          onClick={handleInviteMember}
        >
          Invite
        </Button>
        <InviteDialog
          open={inviteDialogOpen}
          onClose={handleCloseInvite}
          onSearch={handleSearchEmail}
          result={searchResult}
          oldBoard={board}
        />
        <AvatarGroup
          max={8}
          sx={{
            '& .MuiAvatar-root': {
              width: '32px',
              height: '32px',
              fontSize: '16px',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
            },
          }}
        >
          {board?.members.map((member, id) => (
            <Tooltip key={id} title={member.displayName}>
              <Avatar alt={member.displayName} src={member.photoURL} />
            </Tooltip>
          ))}
        </AvatarGroup>
      </Box>
    </Box>
  );
}

export default BoardBar;
