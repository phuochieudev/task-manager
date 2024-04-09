import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
import {
  DndContext,
  // PointerSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useEffect, useState } from 'react'
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

  useEffect(() => {
    //const orderedColumns = mapOrder(board?.columns, board?.columnOrderIds, '_id')
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  const handleDragEnd = (event) => {
    // console.log('handleDragEnd:', event)
    const { active, over } = event

    //Kiem tra neu over khong ton tai thi return de tranh loi (Vi du nhu keo ra ngoai)
    if (!over) return

    //Neu vi tri sau khi keo tha khac voi vi tri ban dau
    if (active.id !== over.id) {
      const oldIndex = orderedColumns.findIndex(c => c._id === active.id) //Lay vi tri cu tu thang active
      const newIndex = orderedColumns.findIndex(c => c._id === over.id) //Lay vi tri moi tu thang over

      //Dung arrayMove cua thang dnd-kit de sap xep lai mang columns ban dau
      //Code cua arrayMove : dnd-kit/packages/sortable/src/utilities/arrayMove.ts
      const dndOrderedColumns = arrayMove(orderedColumns, oldIndex, newIndex)

      //Phan nay dung de goi API
      // const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
      // console.log(dndOrderedColumns)
      // console.log(dndOrderedColumnsIds)


      //Cap nhat lai state columns ban dau sau khi da keo tha
      setOrderedColumns(dndOrderedColumns)
    }
  }
  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
      <Box sx={{
        bgcolor: (theme) => (theme.palette.mode=== 'dark'? '#34495e' : '#1976d2'),
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        display: 'flex',
        p: '10px 0'
      }}>
        <ListColumns columns={orderedColumns}/>
      </Box>
    </DndContext>

  )
}

export default BoardContent