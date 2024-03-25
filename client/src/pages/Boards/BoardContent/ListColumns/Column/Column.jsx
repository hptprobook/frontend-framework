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
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';
import { useConfirm } from 'material-ui-confirm';

function Column({ column, createNewCard, handleDeleteColumn }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const [isEditingTitle, setEditingTitle] = useState(false);

  const orderedCards = column.cards;

  const [openNewCardForm, setOpenNewCardForm] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [editCardTitle, setEditCardTitle] = useState(column ? column.title : '');
  const toggleOpenNewCardForm = () => setOpenNewCardForm(!openNewCardForm);
  const addNewCard = async () => {
    if (!newCardTitle) {
      toast.error('Please enter Card Title', {
        position: 'bottom-right',
      });
      return;
    }

    const newCardData = {
      title: newCardTitle,
      columnId: column._id,
    };

    await createNewCard(newCardData);

    toggleOpenNewCardForm();
    setNewCardTitle('');
  };

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column?._id,
    data: { ...column },
  });

  const dndKitColumnStyles = {
    // touchAction: 'none',
    transform: CSS.Translate.toString(transform),
    transition,
    height: '100%',
    opacity: isDragging ? 0.4 : undefined,
  };

  const confirmDelete = useConfirm();
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
        //
      });
  };

  const handleUpdateColumnTitle = (e) => {
    if (e.key === 'Enter') {
      // Call API
    } else if (e.key === 'Escape') {
      setEditingTitle(false);
    }
  };

  return (
    <div ref={setNodeRef} style={dndKitColumnStyles} {...attributes}>
      <Box
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
              <Divider />
              <MenuItem>
                <ListItemIcon>
                  <Cloud fontSize="small" />
                </ListItemIcon>
                <ListItemText>Archive this column</ListItemText>
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
                  <DeleteForeverIcon className="delete-forever-icon" fontSize="small" />
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
            p: 1.2,
          }}
        >
          {!openNewCardForm ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: '100%',
              }}
            >
              <Button
                sx={{
                  width: '100%',
                  justifyContent: 'flex-start',
                  pl: 2,
                }}
                startIcon={
                  <AddCardIcon
                    sx={{
                      mb: 0.3,
                    }}
                  />
                }
                onClick={toggleOpenNewCardForm}
              >
                Add new card
              </Button>
              <Tooltip title={'Drag to move'}>
                <DragHandleIcon
                  sx={{
                    cursor: 'pointer',
                  }}
                />
              </Tooltip>
            </Box>
          ) : (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                pb: '5px',
              }}
            >
              <TextField
                size="small"
                label="Enter card title ..."
                type="text"
                variant="outlined"
                autoFocus
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                onKeyUp={(e) => {
                  if (e.key === 'Enter') addNewCard();
                  if (e.key === 'Escape') toggleOpenNewCardForm();
                }}
                data-no-dnd="true"
                sx={{
                  '& label': {
                    color: 'text.primary',
                  },
                  '& input': {
                    color: (theme) => theme.palette.primary.main,
                    bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : '#fff'),
                  },
                  '& label.Mui-focused': {
                    color: (theme) => theme.palette.primary.main,
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: (theme) => theme.palette.primary.main },
                    '&:hover fieldset': { borderColor: (theme) => theme.palette.primary.main },
                    '&.Mui-focused fieldset': { borderColor: (theme) => theme.palette.primary.main },
                  },
                  '& .MuiOutlinedInput-input': {
                    borderRadius: 1,
                  },
                }}
              />
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Button
                  variant="contained"
                  color="success"
                  // size="small"
                  sx={{
                    boxShadow: 'none',
                    border: '0.5px solid',
                    borderColor: (theme) => theme.palette.success.main,
                    '&:hover': { bgcolor: (theme) => theme.palette.success.main },
                  }}
                  onClick={addNewCard}
                >
                  Add
                </Button>
                <CloseIcon
                  fontSize="small"
                  sx={{
                    color: (theme) => theme.palette.warning.light,
                    cursor: 'pointer',
                    '&:hover': {
                      color: (theme) => theme.palette.warning.dark,
                    },
                  }}
                  onClick={toggleOpenNewCardForm}
                />
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </div>
  );
}

export default Column;
