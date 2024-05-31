import BoardBar from './BoardBar/BoardBar';
import BoardContent from './BoardContent/BoardContent';
// import { mockData } from '~/apis/mock-data';
import { useEffect, useState } from 'react';
import {
  createNewCardAPI,
  createNewColumnAPI,
  deleteColumnDetailsAPI,
  fetchBoardDetailsAPI,
  moveCardDifferentColumnAPI,
  updateBoardDetailsAPI,
  updateColumnDetailsAPI,
} from '~/apis';
import { generatePlaceholderCard } from '~/utils/formatters';
import { isEmpty } from 'lodash';
import { mapOrder } from '~/utils/sorts';
import CircularProgress from '@mui/material/CircularProgress';
import { Box } from '@mui/material';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import socket from '~/socket/socket';
import { useConfirm } from 'material-ui-confirm';
import { deleteCardDetails } from '~/apis/cardApi';

function BoardDetails() {
  const [board, setBoard] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    fetchBoardDetailsAPI(id).then((board) => {
      board.columns = mapOrder(board.columns, board.columnOrderIds, '_id');

      board.columns.forEach((column) => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)];
          column.cardOrderIds = [generatePlaceholderCard(column)._id];
        } else {
          column.cards = mapOrder(column?.cards, column?.cardOrderIds, '_id');
        }
      });

      setBoard(board);
    });
  }, [id]);

  useEffect(() => {
    const handleNewColumn = (newColumn) => {
      if (
        newColumn &&
        !board.columns.some((column) => column._id === newColumn._id)
      ) {
        newColumn.cards = [generatePlaceholderCard(newColumn)];
        newColumn.cardOrderIds = [generatePlaceholderCard(newColumn)._id];

        setBoard((prevBoard) => {
          const newBoard = { ...prevBoard };
          newBoard.columns.push(newColumn);
          newBoard.columnOrderIds.push(newColumn._id);
          return newBoard;
        });
      }
    };

    const handleNewCard = (newCard) => {
      if (!newCard) return;
      setBoard((prevBoard) => {
        const newBoard = { ...prevBoard };
        const columnToUpdate = newBoard.columns.find(
          (column) => column._id === newCard.columnId
        );

        if (!columnToUpdate) return newBoard;
        const cardExists = columnToUpdate.cards.some(
          (card) => card._id === newCard._id
        );
        const hasPlaceholder = columnToUpdate.cards.some(
          (card) => card.FE_PlaceholderCard
        );

        if (cardExists) return newBoard;

        if (hasPlaceholder) {
          columnToUpdate.cards = [newCard];
          columnToUpdate.cardOrderIds = [newCard._id];
        } else {
          columnToUpdate.cards.push(newCard);
          columnToUpdate.cardOrderIds.push(newCard._id);
        }
        return newBoard;
      });
    };

    const handleMoveColumn = (updatedBoard) => {
      setBoard(updatedBoard);
    };

    const handleMoveCardSameColumn = (updatedColumn) => {
      setBoard((prevBoard) => {
        const newBoard = { ...prevBoard };
        const columnToUpdate = newBoard.columns.find(
          (column) => column._id === updatedColumn._id
        );

        if (columnToUpdate) {
          columnToUpdate.cards = updatedColumn.cards;
          columnToUpdate.cardOrderIds = updatedColumn.cardOrderIds;
        }

        return newBoard;
      });
    };

    const moveCardDifferentColumn = (data) => {
      const dndOrderedColumnIds = data.dndOrderedColumns.map((c) => c._id);

      setBoard((prevBoard) => {
        const newBoard = { ...prevBoard };
        newBoard.columns = data.dndOrderedColumns;
        newBoard.columnOrderIds = dndOrderedColumnIds;
        return newBoard;
      });

      let prevCardOrderIds = data.dndOrderedColumns.find(
        (col) => col._id === data.prevColumnId
      )?.cardOrderIds;
      if (prevCardOrderIds[0].includes('-placeholder-card'))
        prevCardOrderIds = [];
    };

    const handleDeleteColumn = (columnId) => {
      setBoard((prevBoard) => {
        const newBoard = { ...prevBoard };
        newBoard.columns = newBoard.columns.filter((c) => c._id !== columnId);
        newBoard.columnOrderIds = newBoard.columnOrderIds.filter(
          (_id) => _id !== columnId
        );
        return newBoard;
      });
    };

    const handleDeleteCard = (cardId) => {
      setBoard((prevBoard) => {
        const newBoard = { ...prevBoard };

        newBoard.columns = newBoard.columns.map((column) => {
          if (column.cards.some((card) => card._id === cardId)) {
            column.cards = column.cards.filter((card) => card._id !== cardId);
            column.cardOrderIds = column.cardOrderIds.filter(
              (id) => id !== cardId
            );
          }
          return column;
        });

        return newBoard;
      });
    };

    socket.on('newColumn', handleNewColumn);
    socket.on('newCard', handleNewCard);
    socket.on('moveColumn', handleMoveColumn);
    socket.on('moveCardSameColumn', handleMoveCardSameColumn);
    socket.on('moveCardDifferentColumn', moveCardDifferentColumn);
    socket.on('deleteColumn', handleDeleteColumn);
    socket.on('deleteCard', handleDeleteCard);

    return () => {
      socket.off('newColumn', handleNewColumn);
      socket.off('newCard', handleNewCard);
      socket.off('moveColumn', handleMoveColumn);
      socket.off('moveCardSameColumn', handleMoveCardSameColumn);
      socket.off('moveCardDifferentColumn', moveCardDifferentColumn);
      socket.off('deleteColumn', handleDeleteColumn);
      socket.off('deleteCard', handleDeleteCard);
    };
  }, [board]);

  const createNewColumn = async (newColumnData) => {
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id,
    });

    createdColumn.cards = [generatePlaceholderCard(createdColumn)];
    createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id];

    if (!board.columns.some((column) => column._id === createdColumn._id)) {
      setBoard((prevBoard) => {
        const newBoard = { ...prevBoard };
        newBoard.columns.push(createdColumn);
        newBoard.columnOrderIds.push(createdColumn._id);
        return newBoard;
      });
    }

    // Emit an event to notify other clients about the new column
    socket.emit('newColumn', createdColumn);
  };

  const createNewCard = async (newCardData) => {
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id,
    });

    setBoard((prevBoard) => {
      const newBoard = { ...prevBoard };
      const columnToUpdate = newBoard.columns.find(
        (column) => column._id === createdCard.columnId
      );

      if (columnToUpdate) {
        if (columnToUpdate.cards.some((card) => card.FE_PlaceholderCard)) {
          columnToUpdate.cards = [createdCard];
          columnToUpdate.cardOrderIds = [createdCard._id];
        } else if (
          !columnToUpdate.cards.some((card) => card._id === createdCard._id)
        ) {
          columnToUpdate.cards.push(createdCard);
          columnToUpdate.cardOrderIds.push(createdCard._id);
        }
      }

      return newBoard;
    });

    socket.emit('newCard', createdCard);
  };

  const moveColumn = async (dndOrderedColumns) => {
    const dndOrderedColumnIds = dndOrderedColumns.map((c) => c._id);

    setBoard((prevBoard) => {
      const newBoard = { ...prevBoard };
      newBoard.columns = dndOrderedColumns;
      newBoard.columnOrderIds = dndOrderedColumnIds;
      return newBoard;
    });

    await updateBoardDetailsAPI(board._id, {
      columnOrderIds: dndOrderedColumnIds,
      columns: dndOrderedColumns,
    });
    socket.emit('moveColumn', board);
  };

  /* Khi di chuyển card trên một column */
  const moveCardSameColumn = (dndOrderedCards, dndOrderedCardIds, columnId) => {
    setBoard((prevBoard) => {
      const newBoard = { ...prevBoard };
      const columnToUpdate = newBoard.columns.find(
        (column) => column._id === columnId
      );

      if (columnToUpdate) {
        columnToUpdate.cards = dndOrderedCards;
        columnToUpdate.cardOrderIds = dndOrderedCardIds;
      }

      return newBoard;
    });

    updateColumnDetailsAPI(columnId, {
      cardOrderIds: dndOrderedCardIds,
      cards: dndOrderedCards,
    });
  };

  const moveCardDifferentColumn = (
    currentCardId,
    prevColumnId,
    nextColumnId,
    dndOrderedColumns
  ) => {
    const dndOrderedColumnIds = dndOrderedColumns.map((c) => c._id);

    setBoard((prevBoard) => {
      const newBoard = { ...prevBoard };
      newBoard.columns = dndOrderedColumns;
      newBoard.columnOrderIds = dndOrderedColumnIds;
      return newBoard;
    });

    let prevCardOrderIds = dndOrderedColumns.find(
      (col) => col._id === prevColumnId
    )?.cardOrderIds;
    if (prevCardOrderIds[0].includes('-placeholder-card'))
      prevCardOrderIds = [];

    moveCardDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      dndOrderedColumns,
      nextCardOrderIds: dndOrderedColumns.find(
        (col) => col._id === nextColumnId
      )?.cardOrderIds,
    });
  };

  const handleDeleteColumn = (columnId) => {
    setBoard((prevBoard) => {
      const newBoard = { ...prevBoard };
      newBoard.columns = newBoard.columns.filter((c) => c._id !== columnId);
      newBoard.columnOrderIds = newBoard.columnOrderIds.filter(
        (_id) => _id !== columnId
      );
      return newBoard;
    });

    deleteColumnDetailsAPI(columnId).then((res) => {
      toast.success(res?.deleteResult, { autoClose: 1000 });
    });
  };

  const confirmDeleteCard = useConfirm();
  const handleDeleteCard = async (cardId) => {
    confirmDeleteCard({
      title: 'Delete Card?',
      description:
        'Are you sure you want to delete this card? This action will delete the currently selected card',
      confirmationButtonProps: { color: 'error', variant: 'outlined' },
      confirmationText: 'Confirm',
    }).then(async () => {
      toast.success('Deleted card successfully!');
      await deleteCardDetails({ id: cardId });

      setBoard((prevBoard) => {
        const newBoard = { ...prevBoard };

        newBoard.columns = newBoard.columns.map((column) => {
          if (column.cards.some((card) => card._id === cardId)) {
            column.cards = column.cards.filter((card) => card._id !== cardId);
            column.cardOrderIds = column.cardOrderIds.filter(
              (id) => id !== cardId
            );
          }
          return column;
        });

        return newBoard;
      });
    });
  };

  if (!board) {
    return (
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          height: (theme) => theme.height.boardContentHeight,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <BoardBar board={board} />
      <BoardContent
        board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        moveColumn={moveColumn}
        moveCardSameColumn={moveCardSameColumn}
        moveCardDifferentColumn={moveCardDifferentColumn}
        handleDeleteColumn={handleDeleteColumn}
        handleDeleteCard={handleDeleteCard}
      />
    </>
  );
}

export default BoardDetails;
