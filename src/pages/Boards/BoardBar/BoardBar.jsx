import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import {capitalizeFirstLetter} from '~/utils/formatters'
const menu_Styles = {
  color: 'white',
  bgcolor: 'transparent',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  '.MuiSvgIcon-root': {
    color: 'white'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  }
}
function BoardBar({ board }) {
  return (
    <Box sx={{
      width: '100%',
      height: (theme) => theme.trello.boardBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      paddingX: 2,
      overflowX: 'auto',
      bgcolor: (theme) => (theme.palette.mode=== 'dark'? '#34495e' : '#1976d2'),
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Chip sx={ menu_Styles }
          icon={<DashboardIcon />}
          label={board?.title}
          clickable
          //onClick={() => {}}
        />
        <Chip sx={ menu_Styles }
          icon={<VpnLockIcon />}
          label={capitalizeFirstLetter(board?.type)}
          clickable
          //onClick={() => {}}
        />
        <Chip sx={ menu_Styles }
          icon={<AddToDriveIcon />}
          label="Add To Google Drive"
          clickable
          //onClick={() => {}}
        />
        <Chip sx={ menu_Styles }
          icon={<BoltIcon />}
          label="Automation"
          clickable
          //onClick={() => {}}
        />
        <Chip sx={ menu_Styles }
          icon={<FilterListIcon />}
          label="Filters"
          clickable
          //onClick={() => {}}
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button sx={{ color: 'white',
          borderColor: 'white',
          '&:hover': { borderColor: 'white' }
        }}
        variant="outlined"
        startIcon={<PersonAddIcon/>}>
          Invite
        </Button>
        <AvatarGroup max={7} sx={{
          gap: '10px',
          '& .MuiAvatar-root':{
            width: 34,
            height: 34,
            fontSize: 16,
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            '&:first-of-type': { bgcolor: '#a4b0be' }
          }
        }}>
          <Tooltip title="phuochieudev">
            <Avatar
              alt="phuochieudev"
              src="https://i.pinimg.com/736x/db/2d/a0/db2da06ee237eff7de3e468edde2bde4.jpg" />
          </Tooltip>
          <Tooltip title="manchestercity">
            <Avatar
              alt="phuochieudev"
              src="https://b.fssta.com/uploads/application/soccer/team-logos/manchester-city.vresize.350.350.medium.0.png" />
          </Tooltip>
          <Tooltip title="chelseafc">
            <Avatar
              alt="phuochieudev"
              src="https://static-00.iconduck.com/assets.00/chelsea-icon-2048x2048-f7v75m3m.png" />
          </Tooltip>
          <Tooltip title="manchesterunited">
            <Avatar
              alt="phuochieudev"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTC69iF-eVi-23mwzpZVbJYvFKtEDVH13bKjEpIxhYakA&s" />
          </Tooltip>
          <Tooltip title="arsenal">
            <Avatar
              alt="phuochieudev"
              src="https://upload.wikimedia.org/wikipedia/en/thumb/5/53/Arsenal_FC.svg/1200px-Arsenal_FC.svg.png" />
          </Tooltip>
          <Tooltip title="liver">
            <Avatar
              alt="phuochieudev"
              src="https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/Liverpool_FC.svg/1200px-Liverpool_FC.svg.png" />
          </Tooltip>
          <Tooltip title="arsenal">
            <Avatar
              alt="phuochieudev"
              src="https://upload.wikimedia.org/wikipedia/en/thumb/5/53/Arsenal_FC.svg/1200px-Arsenal_FC.svg.png" />
          </Tooltip>
          <Tooltip title="liver">
            <Avatar
              alt="phuochieudev"
              src="https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/Liverpool_FC.svg/1200px-Liverpool_FC.svg.png" />
          </Tooltip>
          <Tooltip title="arsenal">
            <Avatar
              alt="phuochieudev"
              src="https://upload.wikimedia.org/wikipedia/en/thumb/5/53/Arsenal_FC.svg/1200px-Arsenal_FC.svg.png" />
          </Tooltip>
          <Tooltip title="liver">
            <Avatar
              alt="phuochieudev"
              src="https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/Liverpool_FC.svg/1200px-Liverpool_FC.svg.png" />
          </Tooltip>
        </AvatarGroup>
      </Box>

    </Box>
  )
}

export default BoardBar