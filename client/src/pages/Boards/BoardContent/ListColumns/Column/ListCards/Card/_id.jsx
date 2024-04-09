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
import { Box } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import BadgeIcon from '@mui/icons-material/Badge';
import { convertHTMLToText } from '~/utils/formatters';
import TextField from '@mui/material/TextField';
import CommentIcon from '@mui/icons-material/Comment';
import { useDispatch /* useSelector */ } from 'react-redux';
import { deleteCardDetails, updateCardDetails } from '~/redux/slices/cardSlice';
import { toast } from 'react-toastify';
import { useConfirm } from 'material-ui-confirm';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import MenuModal from '~/components/MenuModal';
import CardAction from './CardAction';

export default function CardDetail({
  openModal,
  handleCloseModal,
  card,
  setCardTitle,
}) {
  const [desc, setDesc] = useState(card ? card.description : '');
  const [title, setTitle] = useState(card ? card.title : '');
  const [isEditingTitle, setEditingTitle] = useState(false);
  const [isEditingDesc, setEditingDesc] = useState(false);
  const [initialDesc, setInitialDesc] = useState(card ? card.description : '');

  const dispatch = useDispatch();
  // const updatedCard = useSelector((state) => state.cards.updatedCard);

  const handleSaveDesc = () => {
    setEditingDesc(false);
    // setDesc(e.target.value);
    dispatch(
      updateCardDetails({
        id: card._id,
        data: {
          description: desc,
        },
      })
    );
    setInitialDesc(desc);
  };

  const handleCancelEditDesc = () => {
    setEditingDesc(false);
    setDesc(initialDesc);
  };

  const handleSaveTitle = (e) => {
    if (e.key === 'Enter') {
      setEditingTitle(false);
      setTitle(e.target.value);
      dispatch(
        updateCardDetails({
          id: card._id,
          data: {
            title,
          },
        })
      );
      setCardTitle(title);
    }
  };

  const handleCancelEditTitle = () => {
    setDesc(initialDesc);
    setEditingTitle(false);
  };

  const confirmDeleteCard = useConfirm();

  const handleDeleteCard = () => {
    confirmDeleteCard({
      title: 'Delete Card?',
      description:
        'Are you sure you want to delete this card? This action will delete the currently selected card',
      confirmationButtonProps: { color: 'error', variant: 'outlined' },
      confirmationText: 'Confirm',
    }).then(() => {
      dispatch(deleteCardDetails({ id: card._id }));

      toast.success('Deleted card successfully!');
      handleCloseModal();
    });
  };

  const [addMemberMenu, setaddMemberMenu] = useState(null);
  const handleAddMemberClick = (event) => {
    setaddMemberMenu(event.currentTarget);
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
          <Button onClick={handleDeleteCard}>Delete</Button>
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
              <Button
                onClick={handleCancelEditDesc}
                size="small"
                variant="outlined"
              >
                Cancel
              </Button>
            </>
          ) : (
            <Typography variant="body1" onClick={() => setEditingDesc(true)}>
              {desc ? (
                convertHTMLToText(desc)
              ) : (
                <Typography
                  sx={{ fontStyle: 'italic', color: 'gray', cursor: 'pointer' }}
                >
                  Click to add Description
                </Typography>
              )}
            </Typography>
          )}
        </Grid>
        <Grid item xs={3.5}>
          <CardAction
            icon={<PersonIcon />}
            text={'Thành viên'}
            handleClick={handleAddMemberClick}
          />
          <MenuModal
            anchorEl={addMemberMenu}
            setAnchorEl={setaddMemberMenu}
            id={'add-member'}
            menuChildren={
              <>
                <MenuItem>
                  <Avatar /> Profile
                </MenuItem>
              </>
            }
          />

          <CardAction icon={<TaskAltIcon />} text={'Việc cần làm'} />
          <MenuModal
            anchorEl={''}
            setAnchorEl={''}
            id={'add-todo'}
            menuChildren={
              <>
                <MenuItem>
                  <Avatar /> Todo
                </MenuItem>
              </>
            }
          />

          <CardAction icon={<AttachFileIcon />} text={'Đính kèm'} />
          <MenuModal
            anchorEl={''}
            setAnchorEl={''}
            id={'add-todo'}
            menuChildren={
              <>
                <MenuItem>
                  <Avatar /> Todo
                </MenuItem>
              </>
            }
          />

          <CardAction icon={<BadgeIcon />} text={'Ảnh bìa'} />
          <MenuModal
            anchorEl={''}
            setAnchorEl={''}
            id={'add-todo'}
            menuChildren={
              <>
                <MenuItem>
                  <Avatar /> Todo
                </MenuItem>
              </>
            }
          />
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
