import { Box, Button, TextField } from '@mui/material';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import CloseIcon from '@mui/icons-material/Close';
import { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';

const AddColumnForm = ({ createNewColumn }) => {
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (openNewColumnForm) {
      inputRef.current?.focus();
    }
  }, [openNewColumnForm]);

  const toggleOpenNewColumnForm = () => {
    setOpenNewColumnForm(!openNewColumnForm);
  };

  const addNewColumn = async () => {
    if (!newColumnTitle) {
      toast.error('Please enter Column Title!');
      return;
    }

    if (newColumnTitle.length < 3) {
      toast.error('Column title must be at least 3 characters');
      return;
    }

    const newColumnData = { title: newColumnTitle };

    await createNewColumn(newColumnData);
    setNewColumnTitle('');
    inputRef.current.focus();
  };

  useEffect(() => {
    if (openNewColumnForm) {
      inputRef.current?.focus();
    }
  }, [openNewColumnForm]);

  return (
    <>
      {!openNewColumnForm ? (
        <Box
          sx={{
            minWidth: '300px',
            maxWidth: '300px',
            bgcolor: '#ffffff3d',
            mx: 2,
            borderRadius: '6px',
            height: 'fit-content',
          }}
          onClick={toggleOpenNewColumnForm}
        >
          <Button
            startIcon={<PlaylistAddIcon />}
            sx={{
              color: '#fff',
              width: '100%',
              justifyContent: 'flex-start',
              pl: 4,
              py: 1.2,
            }}
          >
            Add new column
          </Button>
        </Box>
      ) : (
        <Box
          sx={{
            minWidth: '300px',
            maxWidth: '300px',
            bgcolor: '#ffffff3d',
            mx: 2,
            p: 1,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '6px',
            height: 'fit-content',
            gap: 1,
          }}
        >
          <TextField
            size="small"
            label="Enter column title ..."
            type="text"
            variant="outlined"
            autoFocus
            value={newColumnTitle}
            onChange={(e) => setNewColumnTitle(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === 'Enter') addNewColumn();
              if (e.key === 'Escape') toggleOpenNewColumnForm();
            }}
            inputRef={inputRef}
            sx={{
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
              size="small"
              sx={{
                boxShadow: 'none',
                border: '0.5px solid',
                borderColor: (theme) => theme.palette.success.main,
                '&:hover': { bgcolor: (theme) => theme.palette.success.main },
              }}
              onClick={addNewColumn}
            >
              Add Column
            </Button>
            <CloseIcon
              fontSize="small"
              sx={{
                color: '#fff',
                cursor: 'pointer',
                '&:hover': {
                  color: '#ecf0f1',
                },
              }}
              onClick={toggleOpenNewColumnForm}
            />
          </Box>
        </Box>
      )}
    </>
  );
};

export default AddColumnForm;
