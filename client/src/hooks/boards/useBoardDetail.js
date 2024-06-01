import { useEffect, useState } from 'react';
import { fetchBoardDetailsAPI } from '~/apis';
import { useParams } from 'react-router-dom';
import { isEmpty } from 'lodash';
import { generatePlaceholderCard } from '~/utils/formatters';
import { mapOrder } from '~/utils/sorts';

const useBoardDetails = () => {
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

  return { board, setBoard };
};

export default useBoardDetails;
