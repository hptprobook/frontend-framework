import React, { useState } from 'react';
import { Avatar, Box, Divider, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getRandomColor } from '~/utils/getRandomColor';
import { NavLink } from 'react-router-dom';

function Workspaces({ workspaces }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <Button
        id="basic-button-workspaces"
        aria-controls={open ? 'basic-menu-workspaces' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        endIcon={<ExpandMoreIcon />}
        sx={{ color: '#fff' }}
      >
        Workspaces
      </Button>
      <Menu
        id="basic-menu-workspaces"
        anchorEl={anchorEl}
        open={open}
        sx={{
          mt: 1.4,
        }}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button-workspaces',
        }}
      >
        <Typography
          sx={{
            mx: 2,
            my: 1,
          }}
        >
          Your workspace
        </Typography>
        {workspaces?.created?.map((workspace) => (
          <React.Fragment key={workspace._id}>
            <NavLink to={`/w/${workspace._id}`}>
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <Avatar
                    sx={{
                      width: '28px',
                      height: '28px',
                      bgcolor: getRandomColor(),
                      fontSize: '12px',
                      color: '#fff',
                    }}
                  >
                    {workspace?.title[0]}
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  sx={{
                    color: '#333',
                  }}
                >
                  {workspace?.title}
                </ListItemText>
              </MenuItem>
            </NavLink>
          </React.Fragment>
        ))}
        <Divider
          sx={{
            m: 1,
          }}
        />
        <Typography
          sx={{
            mx: 2,
            my: 1,
          }}
        >
          Client workspace
        </Typography>
        {workspaces?.clienter?.map((workspace) => (
          <Box key={workspace._id}>
            <NavLink to={`/w/${workspace._id}`}>
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <Avatar
                    sx={{
                      width: '28px',
                      height: '28px',
                      bgcolor: getRandomColor(),
                      fontSize: '12px',
                      color: '#fff',
                    }}
                  >
                    {workspace?.title[0]}
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  sx={{
                    color: '#333',
                  }}
                >
                  {workspace?.title}
                </ListItemText>
              </MenuItem>
            </NavLink>
          </Box>
        ))}
      </Menu>
    </Box>
  );
}

export default Workspaces;
