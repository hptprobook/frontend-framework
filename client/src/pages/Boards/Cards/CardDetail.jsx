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
import CardDetailTodo from './sections/todos/CardDetailTodo';
import CardDetailHeader from './sections/CardDetailHeader';
import CardDetailComment from './sections/comments/CardDetailComment';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

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

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 500,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  return (
    <React.Fragment key={card._id}>
      <DndContext sensors={sensors}>
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
          <SortableContext
            items={cardDetail.todos?.map((todo) => todo._id)}
            strategy={verticalListSortingStrategy}
          >
            <CardDetailTodo
              cardDetail={cardDetail}
              setCardDetail={setCardDetail}
            />
          </SortableContext>

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
      </DndContext>
    </React.Fragment>
  );
}
