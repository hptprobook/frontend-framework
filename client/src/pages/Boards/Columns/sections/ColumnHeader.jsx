import {
  Box,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Tooltip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ContentCut from '@mui/icons-material/ContentCut';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import AddCardIcon from '@mui/icons-material/AddCard';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useConfirm } from 'material-ui-confirm';
import { toast } from 'react-toastify';
import { updateColumnDetails } from '~/redux/slices/columnSlice';

const ColumnHeader = ({
  column,
  handleDeleteColumn,
  openNewCardForm,
  toggleOpenNewCardForm,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const [isEditingTitle, setEditingTitle] = useState(false);
  const [editCardTitle, setEditCardTitle] = useState(
    column ? column.title : ''
  );
  // const [openNewCardForm, setOpenNewCardForm] = useState(false);
  const dispatch = useDispatch();
  const confirmDelete = useConfirm();
  // const toggleOpenNewCardForm = () => setOpenNewCardForm(!openNewCardForm);
  const inputRef = useRef();

  const handleDelete = () => {
    confirmDelete({
      title: 'Delete Columns?',
      description:
        'Are you sure you want to delete this column? This action will delete the currently selected column and all cards within it',
      confirmationButtonProps: { color: 'error', variant: 'outlined' },
      confirmationText: 'Confirm',
    })
      .then(() => {
        handleDeleteColumn(column._id);
      })
      .catch(() => {
        // Handle cancellation
      });
  };

  useEffect(() => {
    if (openNewCardForm) {
      inputRef.current?.focus();
    }
  }, [openNewCardForm]);

  const handleUpdateColumnTitle = (e) => {
    if (e.key === 'Enter') {
      if (editCardTitle.trim().length > 3) {
        dispatch(
          updateColumnDetails({
            id: column._id,
            data: {
              title: editCardTitle.trim(),
            },
          })
        );
        column.title = editCardTitle;
        setEditingTitle(false);
      } else {
        toast.error('Column title must be longer than 3 characters', {
          position: 'bottom-right',
        });
      }
    } else if (e.key === 'Escape') {
      setEditingTitle(false);
    }
  };

  return (
    <Box
      sx={{
        height: (theme) => theme.height.columnHeaderHeight,
        p: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {isEditingTitle ? (
        <TextField
          sx={{
            m: 0,
            p: 0,
            ' input': {
              height: '1px',
              fontWeight: 'bold',
            },
          }}
          autoFocus
          value={editCardTitle}
          onChange={(e) => setEditCardTitle(e.target.value)}
          onKeyUp={handleUpdateColumnTitle}
          onBlur={() => setEditingTitle(false)}
          data-no-dnd="true"
        />
      ) : (
        <Typography
          variant="h6"
          onClick={() => setEditingTitle(true)}
          sx={{
            fontWeight: 'bold',
            fontSize: '1rem',
            cursor: 'pointer',
            pl: 1,
          }}
        >
          {column?.title}
        </Typography>
      )}

      <Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
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
          <MenuItem
            onClick={toggleOpenNewCardForm}
            sx={{
              ':hover': {
                color: 'success.light',
                '& .add-card-icon': {
                  color: 'success.light',
                },
              },
            }}
          >
            <ListItemIcon>
              <AddCardIcon className="add-card-icon" fontSize="small" />
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
          <MenuItem
            onClick={handleDelete}
            sx={{
              ':hover': {
                color: 'warning.dark',
                '& .delete-forever-icon': {
                  color: 'warning.dark',
                },
              },
            }}
          >
            <ListItemIcon>
              <DeleteForeverIcon
                className="delete-forever-icon"
                fontSize="small"
              />
            </ListItemIcon>
            <ListItemText>Remove this column</ListItemText>
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default ColumnHeader;
