import Container from '@mui/material/Container'
import AppBar from '../../components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
// import { mockData } from '~/apis/mock-data'
import { useEffect, useState } from 'react'
import { fetchBoardDetailsAPI } from '~/apis'
function Board() {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    //Tam thoi fix cung boardId
    const boardId = '669792dc59995eb0f567ba17'
    //Call API
    fetchBoardDetailsAPI(boardId).then(board => {
      setBoard(board)
    })
  }, [])
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar/>
      <BoardBar board = {board}/>
      <BoardContent board = {board}/>
    </Container>
  )
}

export default Board