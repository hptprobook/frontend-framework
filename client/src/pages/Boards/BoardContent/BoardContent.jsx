import Box from '@mui/material/Box';
import ListColums from './ListColumns/ListColums';
import { mapOrder } from '~/utils/sorts';
import { DndContext, useSensor, useSensors, MouseSensor, TouchSensor } from '@dnd-kit/core';
import { useEffect, useState } from 'react';
import { arrayMove } from '@dnd-kit/sortable';

function BoardContent({ board }) {
  // const pointerSensor = useSensor(PointerSensor, {
  //   activationConstraint: {
  //     distance: 10,
  //   },
  // });

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

  // const sensors = useSensors(pointerSensor);
  const sensors = useSensors(mouseSensor, touchSensor);

  const [orderedColumns, setorderedColumns] = useState([]);

  useEffect(() => {
    setorderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'));
  }, [board]);

  const handleDragEnd = (event) => {
    // console.log('HandleDragEnd: ', event);
    const { active, over } = event;

    // Kiểm tra vị trí thả
    if (!over) return;

    if (active.id !== over.id) {
      /* Lấy vị trí cũ */
      const oldIndex = orderedColumns.findIndex((c) => c._id === active.id);
      /* Lấy vị trí mới */
      const newIndex = orderedColumns.findIndex((c) => c._id === over.id);

      const dndOrderedColumns = arrayMove(orderedColumns, oldIndex, newIndex);

      // const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id);
      // console.log('🚀 ~ handleDragEnd ~ dndOrderedColumnsIds:', dndOrderedColumnsIds);

      setorderedColumns(dndOrderedColumns);
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
      <Box
        sx={{
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
          width: '100%',
          p: '10px 0',
          height: (theme) => theme.height.boardContentHeight,
        }}
      >
        <ListColums columns={orderedColumns} />
      </Box>
    </DndContext>
  );
}

export default BoardContent;
