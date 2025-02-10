import {
    Card,
    CardContent,
    Typography,
    CardActions,
    IconButton,
    Tooltip,
    Box
} from '@mui/material';
import {
    Bookmark as BookmarkIcon,
    BookmarkBorder as BookmarkBorderIcon,
    Launch as LaunchIcon
} from '@mui/icons-material';
import { LazyImage } from '../common/LazyImage';
import type { Article } from '@/types/news';

interface ArticleCardProps {
    article: Article;
    isSaved: boolean;
    onSave: () => void;
    onRemove: () => void;
}

export const ArticleCard = ({
                                article,
                                isSaved,
                                onSave,
                                onRemove
                            }: ArticleCardProps) => {
    return (
        <Card>
            <Box sx={{ height: 200 }}>
                <LazyImage
                    src={article.imageUrl || null}
                    alt={article.title}
                    height={200}
                />
            </Box>

            <CardContent>
                <Typography
                    gutterBottom
                    variant="h6"
                    component="h2"
                    sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: 1.2,
                        minHeight: '2.4em'
                    }}
                >
                    {article.title}
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        minHeight: '4.5em'
                    }}
                >
                    {article.description}
                </Typography>
            </CardContent>

            <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                <Typography variant="caption" color="text.secondary">
                    {new Date(article.publishedAt).toLocaleDateString()}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title={isSaved ? 'Remove from saved' : 'Save article'}>
                        <IconButton
                            onClick={isSaved ? onRemove : onSave}
                            color={isSaved ? 'primary' : 'default'}
                            size="small"
                        >
                            {isSaved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Open article">
                        <IconButton
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            size="small"
                        >
                            <LaunchIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </CardActions>
        </Card>
    );
};