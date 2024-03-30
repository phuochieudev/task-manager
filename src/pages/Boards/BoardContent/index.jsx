import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
function BoardContent() {
  return (
    <Box sx={{
      bgcolor: (theme) => (theme.palette.mode=== 'dark'? '#34495e' : '#1976d2'),
      width: '100%',
      height: (theme) => `calc(100vh - ${theme.trello.boardBarHeight} - ${theme.trello.appBarHeight})`,
      display: 'flex'
      // alignItems: 'center'
    }}>


    </Box>
  )
}

export default BoardContent