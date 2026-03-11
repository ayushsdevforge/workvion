import { formatDistanceToNow, parseISO } from 'date-fns';

export const timeAgo = (ts) => {
  try { return formatDistanceToNow(parseISO(ts), { addSuffix: true }); }
  catch { return ''; }
};
