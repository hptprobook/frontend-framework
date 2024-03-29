import Box from '@mui/material/Box';
import ModeSelect from '../ModeSelect/ModeSelect';
import AppsIcon from '@mui/icons-material/Apps';
import Logo from '~/assets/trello.svg?react';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import Workspaces from './Menus/Workspaces';
import Recent from './Menus/Recent';
import Starred from './Menus/Starred';
import Templates from './Menus/Templates';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Badge from '@mui/material/Badge';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import Tooltip from '@mui/material/Tooltip';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Profile from './Menus/Profile';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';

function AppBar() {
  const [searchValue, setSearchValue] = useState('');

  return (
    <Box
      px={2}
      sx={{
        width: '100%',
        height: (theme) => theme.height.appBar,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        overflowX: 'auto',
        overflowY: 'hidden',
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2c3e50' : '#1565c0'),
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <AppsIcon sx={{ color: '#fff' }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <SvgIcon component={Logo} inheritViewBox fontSize="small" sx={{ color: '#fff' }} />
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fff' }}>Trello</Typography>
        </Box>

        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            gap: 1,
          }}
        >
          <Workspaces />
          <Recent />
          <Starred />
          <Templates />

          <Button
            variant="outlined"
            sx={{
              color: '#fff',
              border: 'none',
              '& .MuiButton-startIcon': {
                mb: '1.5px',
              },
              '&:hover': {
                border: 'none',
              },
            }}
            startIcon={<LibraryAddIcon />}
          >
            Create
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <TextField
          size="small"
          id="outlined-search"
          label="Search..."
          type="text"
          onChange={(e) => setSearchValue(e.target.value)}
          value={searchValue}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon
                  sx={{
                    color: '#fff',
                  }}
                />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                {searchValue ? (
                  <CloseIcon
                    fontSize="small"
                    sx={{
                      color: '#fff',
                      cursor: 'pointer',
                      '&:hover': {
                        color: '#ecf0f1',
                      },
                    }}
                    onClick={() => setSearchValue('')}
                  />
                ) : (
                  ''
                )}
              </InputAdornment>
            ),
          }}
          sx={{
            minWidth: '120px',
            maxWidth: '180px',
            '& label': {
              color: '#fff',
            },
            '& input': {
              color: '#fff',
            },
            '& label.Mui-focused': {
              color: '#fff',
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#fff' },
              '&:hover fieldset': { borderColor: '#fff' },
              '&.Mui-focused fieldset': { borderColor: '#fff' },
            },
          }}
        />
        <ModeSelect />
        <Tooltip title="Notifications">
          <Badge color="warning" variant="dot" sx={{ cursor: 'pointer' }}>
            <NotificationsNoneIcon
              sx={{
                color: '#fff',
              }}
            />
          </Badge>
        </Tooltip>

        <Tooltip title="Help">
          <HelpOutlineIcon sx={{ cursor: 'pointer', color: '#fff' }} />
        </Tooltip>

        <Profile />
      </Box>
    </Box>
  );
}

export default AppBar;
