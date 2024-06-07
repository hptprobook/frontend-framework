/* eslint-disable react-hooks/exhaustive-deps */
/* Config */
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

/* MUI components */
import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';

/* API endpoint */
import { updateCardDetails } from '~/redux/slices/cardSlice';
import socket from '~/socket/socket';

export default function CardDetailHeader({
  card,
  setCardTitle,
  cardDetail,
  setCardDetail,
  columnName,
  handleCloseModal,
  handleDeleteCard,
}) {
  const dispatch = useDispatch();
  const [title, setTitle] = useState(card ? card.title : '');
  const [isEditingTitle, setEditingTitle] = useState(false);

  useEffect(() => {
    socket.on('updateCard', (data) => {
      if (data) {
        setCardTitle(data.title);
        setCardDetail(data);
      }
    });

    return () => {
      socket.off('updateCard');
    };
  }, [cardDetail, setCardDetail]);

  const handleSaveTitle = (e) => {
    if (e.key === 'Enter') {
      setEditingTitle(false);
      const updatedCard = { ...cardDetail, title: e.target.value };
      setCardTitle(e.target.value);
      setCardDetail(updatedCard);
      dispatch(
        updateCardDetails({ id: card._id, data: { title: e.target.value } })
      );
    }
  };

  const handleCancelEditTitle = () => {
    setEditingTitle(false);
  };

  return (
    <Grid container spacing={2} sx={{ px: 3, pt: 3 }}>
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
          owned by <Link onClick={handleCloseModal}>{columnName}</Link>
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
        <Button
          onClick={() => {
            handleDeleteCard(card._id);
            handleCloseModal();
          }}
        >
          Delete
        </Button>
      </Grid>
    </Grid>
  );
}
