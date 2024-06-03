import { useState } from 'react';
import {
  Box,
  Checkbox,
  FormControlLabel,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

export default function TodoChildList({
  child,
  todoId,
  handleToggleTodoChild,
  handleDeleteTodoChild,
  handleSaveEdit,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(child.text);

  const handleEditTitle = () => {
    setIsEditing(true);
  };

  const saveEdit = () => {
    handleSaveEdit(todoId, child._id, editText);
    setIsEditing(false);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mt: 1,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={child.done}
              onChange={() =>
                handleToggleTodoChild(todoId, child._id, child.done)
              }
            />
          }
        />
        {!isEditing ? (
          <Typography
            sx={{
              textDecoration: child.done ? 'line-through' : 'none',
            }}
            onClick={handleEditTitle}
          >
            {child.text}
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <TextField
              autoFocus
              size="small"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
            />
            <CheckIcon
              onClick={saveEdit}
              sx={{
                cursor: 'pointer',
                fontSize: '16px',
                color: 'primary.main',
              }}
            />
            <CloseIcon
              onClick={() => setIsEditing(false)}
              sx={{
                cursor: 'pointer',
                fontSize: '16px',
                color: 'primary.main',
              }}
            />
          </Box>
        )}
      </Box>
      <IconButton
        aria-label="delete"
        onClick={() => handleDeleteTodoChild(todoId, child._id)}
      >
        <DeleteIcon sx={{ fontSize: '22px' }} />
      </IconButton>
    </Box>
  );
}
