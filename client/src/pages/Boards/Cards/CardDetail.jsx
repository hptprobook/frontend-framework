/* eslint-disable indent */

/* Config */
import socket from '~/socket/socket';
import React, { useEffect, useState } from 'react';

/* MUI components */
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';

/* Sections */
import CardDetailDesc from './sections/CardDetailDesc';
import CardDetailTodo from './sections/CardDetailTodo';
import CardDetailHeader from './sections/CardDetailHeader';
import CardDetailComment from './sections/comments/CardDetailComment';

export default function CardDetail({
  openModal,
  handleCloseModal,
  card,
  columnName,
  setCardTitle,
  handleDeleteCard,
}) {
  const [cardDetail, setCardDetail] = useState(card);

  useEffect(() => {
    socket.on('comment', (newComment) => {
      if (newComment._id === card._id) {
        setCardDetail((prevCardDetail) => ({
          ...prevCardDetail,
          comments: newComment.comments,
        }));
      }
    });

    socket.on('replyComment', (newReplyComment) => {
      setCardDetail(newReplyComment);
    });

    return () => {
      socket.off('comment');
      socket.off('replyComment');
    };
  }, [card._id]);

  return (
    <React.Fragment key={card._id}>
      <Dialog
        sx={{
          '& .MuiPaper-root': {
            height: 'auto',
            maxWidth: '900px',
            width: '900px',
            borderRadius: '10px',
          },
        }}
        data-no-dnd="true"
        open={openModal}
        onClose={handleCloseModal}
      >
        {/* Card Detail Header */}
        <CardDetailHeader
          card={card}
          handleCloseModal={handleCloseModal}
          columnName={columnName}
          setCardTitle={setCardTitle}
          handleDeleteCard={handleDeleteCard}
          cardDetail={cardDetail}
          setCardDetail={setCardDetail}
        />

        {/* Card Detail Description */}
        <CardDetailDesc
          card={card}
          cardDetail={cardDetail}
          setCardDetail={setCardDetail}
        />

        {/* Card Detail Todos */}
        <CardDetailTodo cardDetail={cardDetail} setCardDetail={setCardDetail} />

        {/* Card Detail Comments */}
        <CardDetailComment
          card={card}
          cardDetail={cardDetail}
          setCardDetail={setCardDetail}
        />

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
    </React.Fragment>
  );
}
