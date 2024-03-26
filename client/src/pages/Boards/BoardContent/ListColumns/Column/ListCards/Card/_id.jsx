import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import ListIcon from '@mui/icons-material/List';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Box from '@mui/material/Box';
import PersonIcon from '@mui/icons-material/Person';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import BadgeIcon from '@mui/icons-material/Badge';
import { convertHTMLToText } from '~/utils/formatters';
import TextField from '@mui/material/TextField';
import CommentIcon from '@mui/icons-material/Comment';

export default function CardDetail({ openModal, handleCloseModal, card }) {
  const [desc, setDesc] = useState(card ? card.description : '');
  const [title, setTitle] = useState(card ? card.title : '');
  const [isEditingTitle, setEditingTitle] = useState(false);
  const [isEditingDesc, setEditingDesc] = useState(false);

  const handleSaveDesc = () => {
    setEditingDesc(false);
  };

  const handleCancelEditDesc = () => {
    setEditingDesc(false);
  };

  const handleSaveTitle = (e) => {
    if (e.key === 'Enter') {
      setEditingTitle(false);
      setTitle(e.target.value);
    }
  };

  const handleCancelEditTitle = () => {
    setEditingTitle(false);
  };

  return (
    <Dialog
      sx={{
        '& .MuiPaper-root': {
          height: 'auto',
          maxWidth: '800px',
          width: '800px',
          borderRadius: '10px',
        },
      }}
      data-no-dnd="true"
      open={openModal}
      onClose={handleCloseModal}
    >
      <Grid
        container
        spacing={2}
        sx={{
          px: 3,
          pt: 3,
        }}
      >
        <Grid item xs={1}>
          <CreditCardIcon />
        </Grid>
        <Grid item xs={8}>
          {isEditingTitle ? (
            <Box>
              <TextField
                autoFocus
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleCancelEditTitle}
                size="small"
                onKeyUp={handleSaveTitle}
                sx={{
                  m: 0,
                  p: 0,
                  ' input': {
                    height: '10px',
                    fontWeight: 'bold',
                    fontSize: '16px',
                  },
                }}
              />
            </Box>
          ) : (
            <Typography
              sx={{
                fontWeight: 'bold',
                fontSize: '18px !important',
              }}
              onClick={() => setEditingTitle(true)}
            >
              {title}
            </Typography>
          )}
          <Typography gutterBottom>
            owned by <a href="#">{card?.columnId}</a>
          </Typography>
        </Grid>
        <Grid
          item
          xs={3}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
          }}
        >
          <Button>Delete</Button>
        </Grid>
      </Grid>
      <Grid
        container
        spacing={2}
        sx={{
          px: 3,
          pt: 3,
        }}
      >
        <Grid item xs={1}>
          <ListIcon />
        </Grid>
        <Grid item xs={7.5}>
          <Typography
            sx={{
              fontWeight: 'bold',
              fontSize: '18px !important',
            }}
            gutterBottom
          >
            Description
          </Typography>
          {isEditingDesc ? (
            <>
              <ReactQuill
                value={desc}
                onChange={setDesc}
                style={{
                  marginBottom: '12px',
                }}
              />
              <Button
                onClick={handleSaveDesc}
                size="small"
                variant="outlined"
                sx={{
                  mr: 1,
                }}
              >
                Save
              </Button>
              <Button onClick={handleCancelEditDesc} size="small" variant="outlined">
                Cancel
              </Button>
            </>
          ) : (
            <Typography variant="body1" onClick={() => setEditingDesc(true)}>
              {convertHTMLToText(desc)}
            </Typography>
          )}
        </Grid>
        <Grid item xs={3.5}>
          <Box
            sx={{
              width: '100%',
              bgcolor: '#e4e6ea',
              px: 2,
              py: 1,
              borderRadius: '3px',
              mb: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              fontSize: '14px',
            }}
          >
            <PersonIcon fontSize="small" color="action" />
            <Typography
              sx={{
                mt: '1px',
              }}
            >
              Thành viên
            </Typography>
          </Box>
          <Box
            sx={{
              width: '100%',
              bgcolor: '#e4e6ea',
              px: 2,
              py: 1,
              borderRadius: '3px',
              mb: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              fontSize: '14px',
            }}
          >
            <TaskAltIcon fontSize="small" color="action" />
            <Typography
              sx={{
                mt: '1px',
              }}
            >
              Việc cần làm
            </Typography>
          </Box>
          <Box
            sx={{
              width: '100%',
              bgcolor: '#e4e6ea',
              px: 2,
              py: 1,
              borderRadius: '3px',
              mb: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              fontSize: '14px',
            }}
          >
            <AttachFileIcon fontSize="small" color="action" />
            <Typography
              sx={{
                mt: '1px',
              }}
            >
              Đính kèm
            </Typography>
          </Box>
          <Box
            sx={{
              width: '100%',
              bgcolor: '#e4e6ea',
              px: 2,
              py: 1,
              borderRadius: '3px',
              mb: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              fontSize: '14px',
            }}
          >
            <BadgeIcon fontSize="small" color="action" />
            <Typography
              sx={{
                mt: '1px',
              }}
            >
              Ảnh bìa
            </Typography>
          </Box>
        </Grid>
      </Grid>
      <Grid
        container
        spacing={2}
        sx={{
          px: 3,
          pt: 3,
        }}
      >
        <Grid item xs={1}>
          <CommentIcon />
        </Grid>
        <Grid item xs={8}>
          <Typography
            sx={{
              fontWeight: 'bold',
              fontSize: '18px !important',
            }}
          >
            Comments
          </Typography>
        </Grid>
        <Grid item xs={3}></Grid>
      </Grid>
      <DialogActions>
        <Button
          onClick={handleCloseModal}
          sx={{
            mr: 2,
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
