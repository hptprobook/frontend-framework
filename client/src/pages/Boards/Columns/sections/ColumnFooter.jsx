import { Box, Button, TextField, Tooltip } from '@mui/material';
import AddCardIcon from '@mui/icons-material/AddCard';
import CloseIcon from '@mui/icons-material/Close';
import { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import DragHandleIcon from '@mui/icons-material/DragHandle';

const ColumnFooter = ({ column, createNewCard }) => {
  const [openNewCardForm, setOpenNewCardForm] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const inputRef = useRef(null);

  const toggleOpenNewCardForm = () => setOpenNewCardForm(!openNewCardForm);

  const addNewCard = async () => {
    if (!newCardTitle) {
      toast.error('Please enter Card Title', {
        position: 'bottom-right',
      });
      return;
    }
    if (newCardTitle.length < 3) {
      toast.error('Card title should be more than 3 characters', {
        position: 'bottom-right',
      });
      return;
    }

    const newCardData = {
      title: newCardTitle,
      columnId: column._id,
    };

    await createNewCard(newCardData);

    setNewCardTitle('');
    inputRef.current.focus();
  };

  useEffect(() => {
    if (openNewCardForm) {
      inputRef.current?.focus();
    }
  }, [openNewCardForm]);

  return (
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
            inputRef={inputRef}
            data-no-dnd="true"
            sx={{
              '& label': {
                color: 'text.primary',
              },
              '& input': {
                color: (theme) => theme.palette.primary.main,
                bgcolor: (theme) =>
                  theme.palette.mode === 'dark' ? '#333643' : '#fff',
              },
              '& label.Mui-focused': {
                color: (theme) => theme.palette.primary.main,
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: (theme) => theme.palette.primary.main,
                },
                '&:hover fieldset': {
                  borderColor: (theme) => theme.palette.primary.main,
                },
                '&.Mui-focused fieldset': {
                  borderColor: (theme) => theme.palette.primary.main,
                },
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
                '&:hover': {
                  bgcolor: (theme) => theme.palette.success.main,
                },
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
  );
};

export default ColumnFooter;
