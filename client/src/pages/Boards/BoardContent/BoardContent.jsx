import Box from '@mui/material/Box';
import ListColums from './ListColumns/ListColums';
import {
  DndContext,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
  pointerWithin,
  getFirstCollision,
} from '@dnd-kit/core';
import { MouseSensor, TouchSensor } from '~/customLibs/DndKitSensors';
import { useCallback, useEffect, useRef, useState } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import Column from './ListColumns/Column/Column';
import Card from './ListColumns/Column/ListCards/Card/Card';
import { cloneDeep, isEmpty } from 'lodash';
import { generatePlaceholderCard } from '~/utils/formatters';

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD',
};

function BoardContent({
  board,
  createNewColumn,
  createNewCard,
  moveColumn,
  moveCardSameColumn,
  moveCardDifferentColumn,
  handleDeleteColumn,
}) {
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
  const [orderedColumns, setOrderedColumns] = useState([]);
  const [activeDragItemId, setActiveDragItemId] = useState(null);
  const [activeDragItemType, setActiveDragItemType] = useState(null);
  const [activeDragItemData, setActiveDragItemData] = useState(null);
  const [oldColumn, setOldColumn] = useState(null);
  const lastOverId = useRef(null);

  useEffect(() => {
    setOrderedColumns(board.columns);
  }, [board]);

  const findColumnByCardId = (cardId) => {
    return orderedColumns.find((column) => column?.cards?.map((card) => card._id)?.includes(cardId));
  };

  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData,
    triggerFrom
  ) => {
    setOrderedColumns((prevColumns) => {
      // Tính toán vị trí mới cho thẻ đang kéo trong cột đích
      let newCardIndex;
      const overCardIndex = overColumn?.cards?.findIndex((card) => card._id === overCardId);
      const isBelowOverItem = active.rect.current.translated && active.rect.current.translated.top > over.rect.top + over.rect.height;
      const modifier = isBelowOverItem ? 1 : 0;
      newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1;

      // Sao chép và cập nhật danh sách thẻ trong các cột
      const nextColumns = cloneDeep(prevColumns);
      const nextActiveColumn = nextColumns.find((c) => c._id === activeColumn._id);
      const nextOverColumn = nextColumns.find((c) => c._id === overColumn._id);

      // Loại bỏ thẻ đang kéo khỏi cột hiện tại
      if (nextActiveColumn) {
        nextActiveColumn.cards = nextActiveColumn.cards.filter((card) => card._id !== activeDraggingCardId);

        // Thêm placeholder card nếu column rỗng sau khi kéo card
        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)];
        }

        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map((c) => c._id);
      }

      // Thêm thẻ vào vị trí mới trong cột đích
      if (nextOverColumn) {
        nextOverColumn.cards = nextOverColumn.cards.filter((card) => card._id !== activeDraggingCardId);

        nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, {
          ...activeDraggingCardData,
          columnId: nextOverColumn._id,
        });

        // Xóa placeholder Card đi nếu nó đang tồn tại
        nextOverColumn.cards = nextOverColumn.cards.filter((c) => !c.FE_PlaceholderCard);

        nextOverColumn.cardOrderIds = nextOverColumn.cards.map((c) => c._id);
      }

      if (triggerFrom === 'handleDragEnd') {
        moveCardDifferentColumn(activeDraggingCardId, oldColumn._id, nextOverColumn._id, nextColumns);
      }

      return nextColumns; // Cập nhật danh sách cột sau khi di chuyển
    });
  };

  const handleDragStart = (event) => {
    setActiveDragItemId(event?.active?.id);
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN);
    setActiveDragItemData(event?.active?.data?.current);

    if (event?.active?.data?.current?.columnId) setOldColumn(findColumnByCardId(event?.active?.id));
  };

  const handleDragOver = (event) => {
    // Kiểm tra nếu đang kéo một cột, thì không thực hiện hành động kéo thả cho thẻ
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return;

    const { active, over } = event; // Lấy thông tin của thẻ đang kéo (active) và thẻ đích (over)

    if (!active || !over) return; // Nếu không có thông tin về thẻ đang kéo hoặc thẻ đích, hủy bỏ hành động

    // Lấy ID và dữ liệu của thẻ đang kéo
    const {
      id: activeDraggingCardId,
      data: { current: activeDraggingCardData },
    } = active;
    const { id: overCardId } = over; // Lấy ID của thẻ đích

    // Tìm cột chứa thẻ đang kéo và cột của thẻ đích
    const activeColumn = findColumnByCardId(activeDraggingCardId);
    const overColumn = findColumnByCardId(overCardId);

    // Nếu không tìm thấy cột chứa thẻ đang kéo hoặc cột đích, hủy bỏ hành động
    if (!activeColumn || !overColumn) return;

    // Kiểm tra nếu thẻ đang kéo và thẻ đích thuộc hai cột khác nhau
    if (activeColumn._id !== overColumn._id) {
      // Cập nhật trạng thái các cột để phản ánh việc di chuyển thẻ
      moveCardBetweenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData,
        'handleDragOver'
      );
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    // Kiểm tra vị trí thả
    if (!active || !over) return;

    // Xử lý kéo thả Card
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      // Lấy ID và dữ liệu của thẻ đang kéo
      const {
        id: activeDraggingCardId,
        data: { current: activeDraggingCardData },
      } = active;
      const { id: overCardId } = over; // Lấy ID của thẻ đích

      // Tìm cột chứa thẻ đang kéo và cột của thẻ đích
      const activeColumn = findColumnByCardId(activeDraggingCardId);
      const overColumn = findColumnByCardId(overCardId);

      // Nếu không tìm thấy cột chứa thẻ đang kéo hoặc cột đích, hủy bỏ hành động
      if (!activeColumn || !overColumn) return;

      if (oldColumn._id !== overColumn._id) {
        // 2 Column khác nhau
        moveCardBetweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData,
          'handleDragEnd'
        );
      } else {
        // Column giống nhau
        const oldCardIndex = oldColumn?.cards?.findIndex((c) => c._id === activeDragItemId);
        const newCardIndex = overColumn?.cards?.findIndex((c) => c._id === overCardId);
        // Tương tự kéo Column
        const dndOrderedCards = arrayMove(oldColumn?.cards, oldCardIndex, newCardIndex);
        const dndOrderedCardIds = dndOrderedCards.map((c) => c._id);

        setOrderedColumns((prevColumns) => {
          // Sao chép và cập nhật danh sách thẻ trong các cột
          const nextColumns = cloneDeep(prevColumns);
          // Tìm column đang thả
          const targetColumn = nextColumns.find((c) => c._id === overColumn._id);

          // Cập nhật lại cards[] và cardOrderIds[]
          targetColumn.cards = dndOrderedCards;
          targetColumn.cardOrderIds = dndOrderedCardIds;

          return nextColumns;
        });

        moveCardSameColumn(dndOrderedCards, dndOrderedCardIds, oldColumn._id);
      }
    }

    // Xử lý kéo thả Column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && active.id !== over.id) {
      const oldColumnIndex = orderedColumns.findIndex((c) => c._id === active.id);
      const newColumnIndex = orderedColumns.findIndex((c) => c._id === over.id);
      const dndOrderedColumns = arrayMove(orderedColumns, oldColumnIndex, newColumnIndex);

      setOrderedColumns(dndOrderedColumns);

      moveColumn(dndOrderedColumns);
    }

    setActiveDragItemId(null);
    setActiveDragItemType(null);
    setActiveDragItemData(null);
    setOldColumn(null);
  };

  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } }),
  };

  // Custom thuật toán phát hiện va chạm
  const collisionDetectionStrategy = useCallback(
    (args) => {
      if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
        return closestCorners({ ...args });
      }

      // Tìm các điểm va chạm với con trỏ
      const pointerIntersections = pointerWithin(args);

      if (!pointerIntersections?.length) return;
      // const intersections = pointerIntersections.length > 0 ? pointerIntersections : rectIntersection(args);

      let overId = getFirstCollision(pointerIntersections, 'id');

      if (overId) {
        const checkColumn = orderedColumns.find((c) => c._id === overId);
        if (checkColumn) {
          overId = closestCorners({
            ...args,
            droppableContainers: args.droppableContainers.filter(
              (container) => container.id !== overId && checkColumn?.cardOrderIds?.includes(container.id)
            ),
          })[0]?.id;
        }

        lastOverId.current = overId;
        return [{ id: overId }];
      }

      return lastOverId.current ? [{ id: lastOverId.current }] : [];
    },
    [activeDragItemType, orderedColumns]
  );

  return (
    <DndContext
      sensors={sensors}
      // collisionDetection={closestCorners}
      collisionDetection={collisionDetectionStrategy}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Box
        sx={{
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
          width: '100%',
          p: '10px 0',
          height: (theme) => theme.height.boardContentHeight,
        }}
      >
        <ListColums
          columns={orderedColumns}
          createNewColumn={createNewColumn}
          createNewCard={createNewCard}
          handleDeleteColumn={handleDeleteColumn}
        />
        <DragOverlay dropAnimation={customDropAnimation}>
          {!activeDragItemType && null}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && <Column column={activeDragItemData} />}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD && <Card card={activeDragItemData} />}
        </DragOverlay>
      </Box>
    </DndContext>
  );
}

export default BoardContent;
