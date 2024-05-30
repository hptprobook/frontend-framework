import Menu from '@mui/material/Menu';
import React from 'react';

export default function MenuModal({ id, anchorEl, setAnchorEl, menuChildren }) {
  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <React.Fragment>
      <Menu
        data-no-dnd="true"
        anchorEl={anchorEl}
        id={id}
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
          },
        }}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      >
        {menuChildren}
      </Menu>
    </React.Fragment>
  );
}
