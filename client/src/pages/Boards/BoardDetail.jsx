import BoardBar from './sections/BoardBar';
import {
  createNewCardAPI,
  createNewColumnAPI,
  deleteColumnDetailsAPI,
  moveCardDifferentColumnAPI,
  updateBoardDetailsAPI,
  updateColumnDetailsAPI,
} from '~/apis';
import { generatePlaceholderCard } from '~/utils/formatters';
import CircularProgress from '@mui/material/CircularProgress';
import { Box } from '@mui/material';
import { toast } from 'react-toastify';
import socket from '~/socket/socket';
import { useConfirm } from 'material-ui-confirm';
import { deleteCardDetails } from '~/apis/cardApi';
import useBoardDetails from '~/hooks/boards/useBoardDetail';
import useSocketHandlers from '~/hooks/boards/useSocketHandlers';
import BoardContent from './BoardContent';

function BoardDetails() {
  const { board, setBoard } = useBoardDetails();
  useSocketHandlers(board, setBoard);

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
