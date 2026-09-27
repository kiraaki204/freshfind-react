import { useBookmarks } from '../hooks/useBookmarks.jsx';
import Icon from './Icon.jsx';



export default function SaveButton({ item, size = 'md' }) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const saved = isBookmarked(item.id);
  return (
    <button
      type="button"
      className={`heart-btn${saved ? ' saved' : ''}${size === 'sm' ? ' sm' : ''}`}
      aria-label={`${saved ? 'Remove' : 'Save'} ${item.name}`}
      onClick={(e) => {
        e.stopPropagation();
        toggleBookmark(item);
      }}
    >
      <Icon name="heart" size={size === 'sm' ? 16 : 18} />
    </button>
  );
}
