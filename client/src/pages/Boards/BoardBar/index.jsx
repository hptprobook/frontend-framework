import Box from '@mui/material/Box';
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

function BoardBar() {
  return (
    <Box
      px={2}
      sx={{
        width: '100%',
        height: (theme) => theme.height.boardBar,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        overflowX: 'auto',
        overflowY: 'hidden',
        borderBottom: '1px solid #fff',
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Chip sx={MENU_STYLES} clickable icon={<DashboardIcon />} label="PK02909 - Phan Thanh Hóa" />
        <Chip sx={MENU_STYLES} clickable icon={<SyncLockIcon />} label="Public/Private Workspace" />
        <Chip sx={MENU_STYLES} clickable icon={<AddToDriveIcon />} label="Add to Google Drive" />
        <Chip sx={MENU_STYLES} clickable icon={<BoltIcon />} label="Automation" />
        <Chip sx={MENU_STYLES} clickable icon={<FilterListIcon />} label="Filter" />
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
        >
          Invite
        </Button>
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
          <Tooltip title="Phan Hoa">
            <Avatar
              alt="Phan Hoa"
              src="https://cdn-prod.medicalnewstoday.com/content/images/articles/322/322868/golden-retriever-puppy.jpg"
            />
          </Tooltip>
          <Tooltip title="Aphelios">
            <Avatar alt="Aphelios" src="https://opgg-static.akamaized.net/meta/images/lol/14.5.1/champion/centered/Aphelios_30.jpg" />
          </Tooltip>
          <Tooltip title="K'Sante">
            <Avatar alt="K'Sante" src="https://i.pinimg.com/474x/30/23/27/302327800bb906b3bcfe9327a78178f3.jpg" />
          </Tooltip>
          <Tooltip title="Yone">
            <Avatar alt="Yone" src="https://i.redd.it/qa7lkrmrcawb1.jpg" />
          </Tooltip>
          <Tooltip title="Sett">
            <Avatar alt="Sett" src="https://prod.api.assets.riotgames.com/public/v1/asset/lol/14.4.1/CHAMPION_SKIN/875056/ICON" />
          </Tooltip>
          <Tooltip title="Ezreal">
            <Avatar
              alt="Ezreal"
              src="https://preview.redd.it/all-new-ezreal-icons-for-heartsteel-release-13-22-nov8th-v0-12ujao0vsfwb1.jpg?width=640&crop=smart&auto=webp&s=0c4a669116182f04273627b338735a676e039786"
            />
          </Tooltip>
          <Tooltip title="Kayn">
            <Avatar
              alt="Kayn"
              src="https://64.media.tumblr.com/e0f32d6034f3ec9abbaa9da78e91f52a/e458cd857c416dd5-e1/s1280x1920/6826a9c8c23b13b620966914d44a1bbdd2a7fadb.png"
            />
          </Tooltip>
          <Tooltip title="Kayn">
            <Avatar
              alt="Kayn"
              src="https://64.media.tumblr.com/e0f32d6034f3ec9abbaa9da78e91f52a/e458cd857c416dd5-e1/s1280x1920/6826a9c8c23b13b620966914d44a1bbdd2a7fadb.png"
            />
          </Tooltip>
          <Tooltip title="Kayn">
            <Avatar
              alt="Kayn"
              src="https://64.media.tumblr.com/e0f32d6034f3ec9abbaa9da78e91f52a/e458cd857c416dd5-e1/s1280x1920/6826a9c8c23b13b620966914d44a1bbdd2a7fadb.png"
            />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  );
}

export default BoardBar;
