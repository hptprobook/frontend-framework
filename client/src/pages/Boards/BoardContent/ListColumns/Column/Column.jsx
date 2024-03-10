import { useState } from 'react';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ContentCut from '@mui/icons-material/ContentCut';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ListItemText from '@mui/material/ListItemText';
import Cloud from '@mui/icons-material/Cloud';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import AddCardIcon from '@mui/icons-material/AddCard';
import Button from '@mui/material/Button';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import ListCards from './ListCards/ListCards';
import { mapOrder } from '~/utils/sorts';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function Column({ column }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const orderedCards = mapOrder(column?.cards, column?.cardOrderIds, '_id');

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: column?._id,
    data: { ...column },
  });

  const dndKitColumnStyles = {
    // touchAction: 'none',
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <Box
      ref={setNodeRef}
      style={dndKitColumnStyles}
      {...attributes}
      {...listeners}
      sx={{
        minWidth: '300px',
        maxWidth: '300px',
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : '#ebecf0'),
        ml: 2,
        borderRadius: '6px',
        height: 'fit-content',
        maxHeight: (theme) => `calc(${theme.height.boardContentHeight} - ${theme.spacing(5)})`,
      }}
    >
      {/* Box Column Header */}
      <Box
        sx={{
          height: (theme) => theme.height.columnHeaderHeight,
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            fontSize: '1rem',
            cursor: 'pointer',
          }}
        >
          {column?.title}
        </Typography>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
            <Tooltip title="More options">
              <IconButton
                onClick={handleClick}
                size="small"
                aria-controls={open ? 'column-dropdown' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
              >
                <ExpandMoreIcon
                  sx={{
                    color: 'text.primary',
                    cursor: 'pointer',
                  }}
                />
              </IconButton>
            </Tooltip>
          </Box>
          <Menu
            anchorEl={anchorEl}
            id="column-dropdown"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem>
              <ListItemIcon>
                <AddCardIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Add new card</ListItemText>
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <ContentCut fontSize="small" />
              </ListItemIcon>
              <ListItemText>Cut</ListItemText>
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <ContentCopyIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Copy</ListItemText>
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <ContentPasteIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Paste</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem>
              <ListItemIcon>
                <Cloud fontSize="small" />
              </ListItemIcon>
              <ListItemText>Archive this column</ListItemText>
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <DeleteForeverIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Remove this column</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* List Cards */}
      <ListCards cards={orderedCards} />

      {/* Box Column Footer */}
      <Box
        sx={{
          height: (theme) => theme.height.columnHeaderHeight,
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Button startIcon={<AddCardIcon />}>Add new card</Button>
        <Tooltip title={'Drag to move'}>
          <DragHandleIcon
            sx={{
              cursor: 'pointer',
            }}
          />
        </Tooltip>
      </Box>
    </Box>
  );
}

export default Column;
