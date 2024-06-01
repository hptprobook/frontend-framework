import { useEffect } from 'react';
import socket from '~/socket/socket';
import { generatePlaceholderCard } from '~/utils/formatters';

const useSocketHandlers = (board, setBoard) => {
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
  }, [board, setBoard]);
};

export default useSocketHandlers;
