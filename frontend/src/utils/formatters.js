export const capitalizeFirstLetter = (val) => {
  if (!val) return ''
  return `${val.charAt(0).toUpperCase()}${val.slice(1)}`
}

/**
         * Xu li bug logic khi Column rong (Dnd Kit)
         * Phia FE se tu tao ra 1 cai Card dac biet: Placeholder Card, khong lien quan ti BE
         * Card dac biet nay se duoc an o giao dien UI nguoi dung
         * Cau truc id cua Card nay de unique rat don gian, khong can phai lam random phuc tap
         * "columnId-placeholder-card" moi column chi co the toi da 1 placeholder Card
         * Quan trong khi tao phai day du : _id, boardId, columnId, FE_PlaceholderCard
         *
         */

export const generatePlaceholderCard = (column) => {
  return {
    _id : `${column._id}-placeholder-card`,
    boardId : column.boardId,
    columnId : column.columnId,
    FE_PlaceholderCard: true
  }
}
