import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
import {
  DndContext,
  // PointerSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
  closestCenter,
  pointerWithin,
  rectIntersection,
  getFirstCollision
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useEffect, useState, useCallback, useRef } from 'react'
import { cloneDeep, isEmpty } from 'lodash'
import { generatePlaceholderCard } from '~/utils/formatters'

import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}
function BoardContent({ board }) {

  //Yeu cau di chuyen chuot 10px thi moi kich hoat event (fix truong hop click bi goi event)
  //Neu dung pointerSensor mac dinh thi phai phai ket hop thuoc tinh CSS touch-action: none o nhung phan tu keo tha
  //Nhung van con bug
  //const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })

  //Yeu cau di chuyen chuot 10px thi moi kich hoat event (fix truong hop click bi goi event)
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })

  //Nhan giu 250ms va dung sai cua cam ung 500px thi moi kich hoat event
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } })

  //Uu tien su dung 2 loai sensor mouse va touch de co trai nghiem tren mobile tot nhat, ko bi bug
  // const sensors = useSensors(pointerSensor)
  const sensors = useSensors(mouseSensor, touchSensor)

  const [orderedColumns, setOrderedColumns] = useState([])

  //Cung 1 thoi diem chi co 1 phan tu dang duoc keo (column hoac card)
  const [activeDragItemId, setActiveDragItemId] = useState([null])
  const [activeDragItemType, setActiveDragItemType] = useState([null])
  const [activeDragItemData, setActiveDragItemData] = useState([null])
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState([null])

  //Diem va cham cuoi cung truoc do (Xu ly thuat toan phat hien va cham )
  const lastOverId = useRef(null)

  useEffect(() => {
    //const orderedColumns = mapOrder(board?.columns, board?.columnOrderIds, '_id')
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  //Tim 1 column theo CardId
  const findColumnByCardId = (cardId) => {
    //Doan nay can luu y, nen dung c.cards thay vi c.cardOrderIds boi vi o buoc handleDragEnd chung ta se lam du
    //lieu cho cards hoan chinh truoc roi moi tao ra cardOrderIds moi.
    return orderedColumns.find(column => column?.cards?.map(card => card._id)?.includes(cardId))
  }

  //Function chung xu ly viec: Cap nhat lai state trong truong hop di chuyen Card giua cac Column khac nhau
  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData
  ) => {
    setOrderedColumns (prevColumns => {
      //Tim vi tri (index) cua cai overCard trong column dich (noi ma activeCard sap duoc tha)
      const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)

      //Logic tinh toan "cardIndex moi " (tren hoac duoi cua overCard) lay chuan ra tu code cua thu vien
      let newCardIndex
      const isBelowOverItem = active.rect.current.translated &&
      active.rect.current.translated.top > over.rect.top + over.rect.height
      const modifier = isBelowOverItem ? 1 : 0
      newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1

      // console.log('isBelowOverItem', isBelowOverItem)
      // console.log('modifier', modifier)
      // console.log('newCardIndex', newCardIndex)

      //clone mang OrderedColumnsState cu ra mot cai moi de xu ly data roi return - cap nhat lai OrderedColumnsState moi
      const nextColumns = cloneDeep(prevColumns)
      const nextActiveColumn = nextColumns.find(column => column._id === activeColumn._id)
      const nextOverColumn = nextColumns.find(column => column._id === overColumn._id)

      //nextActiveColumn: column cu~
      if (nextActiveColumn)
      {
        //Xoa card o 1 cai column active (cung co the hieu la column cu, cai luc ma keo card ra khoi no de sang column khac)
        nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId)

        //Them Placeholder Card neu Column bi rong: Bi keo het card di, khong con cai nao nua
        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards=[generatePlaceholderCard(nextActiveColumn)]
        }


        //Cap nhat lai mang cardOrderIds cho chuan du lieu
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
      }
      //nextOverColumn: column moi'
      if (nextOverColumn)
      {
        //Kiem tra xem card dang keo no ton tai o overColumn hay chua, neu co thi can xoa no truoc
        nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)
        //Doi voi truong hop dragEnd thi phai cap nhat lai chuan du lieu columnId trong card sau khi keo card giua 2 colum khac nhau
        const rebuild_activeDraggingCardData = {
          ...activeDraggingCardData,
          columnId: nextOverColumn._id
        }

        //Tiep theo la them cai card dang keo vao overColumn theo vi tri index moi
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, rebuild_activeDraggingCardData)

        // Xoa cai Placeholder Card di neu no dang ton tai
        nextActiveColumn.cards = nextActiveColumn.cards.filter(card => !card.FE_PlaceholderCard)

        //Cap nhat lai mang cardOrderIds cho chuan du lieu
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
      }
      return nextColumns
    })
  }

  //Khi bat dau keo 1 phan tu
  const handleDragStart = (event) => {
    // console.log(event)
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)

    //Neu la keo card thi moi thuc hien hanh dong set gia tri oldColumn
    if (event?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id))
    }
  }
  //Qua trinh keo 1 phan tu
  const handleDragOver = (event) => {

    //Khong lam gi them neu dang keo Column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return

    // console.log('handleDragOver:', event)
    const { active, over } = event

    //Can dam bao neu khong ton tai active hoac over  khi keo ra khoi pham vi container thi ko lam gi (tranh crash trang)
    if (!active || !over) return

    //activeDraggingCard: la card dang duoc keo
    const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
    //overCard: la card dang tuong tac tren hoac duoi so voi card duoc keo o tren
    const { id: overCardId } = over

    //Tim 2 cai columns theo cardId
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    //Neu ko ton tai 1 trong 2 columns thi ko lam gi het, tranh crash
    if (!activeColumn || !overColumn) return

    //Neu keo card qua 2 column khac nhau thi moi xu ly logic, con neu keo card trong chinh column thi khong lam gi
    //Vi day dang la doan xu ly luc keo (handleDragOver), con xu ly luc keo xong xuoi thi no lai la van de khac o (handleDragEnd)
    if (activeColumn._id !== overColumn._id ) {
      moveCardBetweenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData
      )
    }
  }
  //Khi ket thuc hanh dong keo 1 phan tu => hanh dong tha
  const handleDragEnd = (event) => {
    // console.log('handleDragEnd:', event)
    const { active, over } = event

    //Kiem tra neu over khong ton tai thi return de tranh loi (Vi du nhu keo ra ngoai)
    if (!active || !over) return

    //Xu ly keo tha Cards
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      //activeDraggingCard: la card dang duoc keo
      const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
      //overCard: la card dang tuong tac tren hoac duoi so voi card duoc keo o tren
      const { id: overCardId } = over

      //Tim 2 cai columns theo cardId
      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)

      //Neu ko ton tai 1 trong 2 columns thi ko lam gi het, tranh crash
      if (!activeColumn || !overColumn) return

      // Hanh dong keo tha card giua 2 column khac nhau
      // Phai dung toi activeDragItemData.columnId hoac oldColumnWhenDraggingCard._id (set vao state tu buoc handleDragStart) chu khong phai activeData trong scope handleDragEnd nay vi sau khi di qua onDragOver toi day la state cua card da bi cap nhat 1 lan roi
      if (oldColumnWhenDraggingCard._id !== overColumn._id ) {
        moveCardBetweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData
        )
      } else {
        //Hanh dong keo tha card trong cung 1 column
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(c => c._id === activeDragItemId) //Lay vi tri cu tu thang oldColumnWhenDraggingCard
        const newCardIndex = overColumn?.cards?.findIndex(c => c._id === overCardId) //Lay vi tri moi tu thang overColumn
        //Dung arrayMove vi keo card trong 1 cai column thi tuong tu voi logic keo column trong 1 cai boardContent
        const dndOrderedCards = arrayMove(oldColumnWhenDraggingCard?.cards, oldCardIndex, newCardIndex)

        setOrderedColumns (prevColumns => {
          //clone mang OrderedColumnsState cu ra mot cai moi de xu ly data roi return - cap nhat lai OrderedColumnsState moi
          const nextColumns = cloneDeep(prevColumns)

          //Tim toi cai Column ma chung ta dang tha
          const targetColumn = nextColumns.find(c => c._id === overColumn._id)

          //Cap nhat lai 2 gia tri moi la card va cardOrderIds trong cai targetColumn
          targetColumn.cards = dndOrderedCards
          targetColumn.cardOrderIds = dndOrderedCards.map(card => card._id)

          //Tra ve gia tri state moi (chuan vi tri)
          return nextColumns
        })
      }
    }
    //Xu ly keo tha Columns trong 1 cai boardContent
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      //Neu vi tri sau khi keo tha khac voi vi tri ban dau
      if (active.id !== over.id) {
        const oldColumnIndex = orderedColumns.findIndex(c => c._id === active.id) //Lay vi tri cu tu thang active
        const newColumnIndex = orderedColumns.findIndex(c => c._id === over.id) //Lay vi tri moi tu thang over


        //Dung arrayMove cua thang dnd-kit de sap xep lai mang columns ban dau
        //Code cua arrayMove : dnd-kit/packages/sortable/src/utilities/arrayMove.ts
        const dndOrderedColumns = arrayMove(orderedColumns, oldColumnIndex, newColumnIndex)


        //Phan nay dung de goi API
        // const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
        // console.log(dndOrderedColumns)
        // console.log(dndOrderedColumnsIds)


        //Cap nhat lai state columns ban dau sau khi da keo tha
        setOrderedColumns(dndOrderedColumns)
      }
    }


    //Nhung du lieu sau khi keo tha nay luon phai dua ve gia tri null mac dinh ban dau
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnWhenDraggingCard(null)
  }

  //Animation khi drop phan tu - Test bang cach keo xong tha truc tiep va nhin pha giu cho Overlay
  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } })
  }

  //args = arguments = Cac doi so, tham so
  const collisionDetectionStrategy = useCallback((args) => {
    //Truong hop keo column thi dung thuat toan closestCorners chuan nhat
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      return closestCorners({ ...args })
    }

    //Tim cac diem va cham - intersections voi con tro
    const pointerIntersections = pointerWithin(args)
    const intersections = !!pointerIntersections?.length
      ? pointerIntersections
      : rectIntersection(args)

    //Tim overId dau tien trong dam intersections o tren
    let overId = getFirstCollision(intersections, 'id')
    if (overId) {
      const checkColumn = orderedColumns.find(column => column._id === overId)
      if (checkColumn) {
        overId = closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter(container => {
            return (container.id !== overId) && (checkColumn?.cardOrderIds?.includes(container.id))
          })
        })[0]?.id
      }
      lastOverId.current = overId
      return [{ id: overId }]
    }

    //Neu overId la null thi tra ve mang rong
    return lastOverId.current ? [{ id: lastOverId.current }] : []
  }, [activeDragItemType, orderedColumns] )

  return (
    <DndContext
    //Cam? bien' (video 30 tqdev)
      sensors={sensors}
      //Thuat toan phat hien va cham (neu ko co thi card vs cover lon khong the keo qua Column duoc vi luc nay no dang bi conflict giua card vs colum), chung ta se dung closestCorners thay vi closestCenters
      //Neu chi dung closestCorners se co bug flickering + sai lech du lieu
      // collisionDetection={closestCorners}

      //Custom nang cao thuat toan phat hien va cham
      collisionDetection={collisionDetectionStrategy}

      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Box sx={{
        bgcolor: (theme) => (theme.palette.mode=== 'dark'? '#34495e' : '#1976d2'),
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        display: 'flex',
        p: '10px 0'
      }}>
        <ListColumns columns={orderedColumns}/>
        <DragOverlay dropAnimation={dropAnimation}>
          {!activeDragItemType && null}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN ) && <Column column={activeDragItemData}/>}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD ) && <Card card={activeDragItemData}/>}
        </DragOverlay>
      </Box>
    </DndContext>

  )
}

export default BoardContent