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
      if (newCard) {
        setBoard((prevBoard) => {
          const newBoard = { ...prevBoard };
          const columnToUpdate = newBoard.columns.find(
            (column) => column._id === newCard.columnId
          );

          if (columnToUpdate) {
            if (columnToUpdate.cards.some((card) => card._id === newCard._id)) {
              return newBoard;
            }

            if (columnToUpdate.cards.some((card) => card.FE_PlaceholderCard)) {
              columnToUpdate.cards = [newCard];
              columnToUpdate.cardOrderIds = [newCard._id];
            } else {
              columnToUpdate.cards.push(newCard);
              columnToUpdate.cardOrderIds.push(newCard._id);
            }
          }

          return newBoard;
        });
      }
    };

    socket.on('newColumn', handleNewColumn);
    socket.on('newCard', handleNewCard);
    socket.on('moveColumn', (data) => {
      setBoard((prevBoard) => {
        const newBoard = { ...prevBoard };
        const columnToUpdate = newBoard.columns.find(
          (column) => column._id === data.columnId
        );
        if (columnToUpdate) {
          columnToUpdate.cards = mapOrder(
            columnToUpdate.cards,
            data.cardOrderIds,
            '_id'
          );
        }
        return newBoard;
      });
    });

    return () => {
      socket.off('newColumn', handleNewColumn);
      socket.off('newCard', handleNewCard);
      socket.off('moveColumn');
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

  const moveColumn = (dndOrderedColumns) => {
    const dndOrderedColumnIds = dndOrderedColumns.map((c) => c._id);

    setBoard((prevBoard) => {
      const newBoard = { ...prevBoard };
      newBoard.columns = dndOrderedColumns;
      newBoard.columnOrderIds = dndOrderedColumnIds;
      return newBoard;
    });

    updateBoardDetailsAPI(board._id, { columnOrderIds: dndOrderedColumnIds });
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

    updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardIds });
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
      />
    </>
  );
}

export default BoardDetails;
