import { formatDistanceToNow } from 'date-fns';

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

export const formatTimestamp = (timestamp) => {
  return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
};

export const truncateString = (str, num) => {
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num) + '...';
};
