export const capitalizeFirstLetter = (val) => {
  if (!val) return '';
  return `${val.charAt(0).toUpperCase()}${val.slice(1)}`;
};

export const generatePlaceholderCard = (col) => ({
  _id: `${col._id}-placeholder-card`,
  boardId: col.boardId,
  columnId: col._id,
  FE_PlaceholderCard: true,
});

export const convertHTMLToText = (htmlString) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  return doc.body.textContent || '';
};
