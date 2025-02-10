import { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    Grid,
    Autocomplete,
    Paper,
    useTheme,
    useMediaQuery,
    IconButton,
    CircularProgress
} from '@mui/material';
import {
    Search as SearchIcon,
    Clear as ClearIcon,
} from '@mui/icons-material';
import type { SearchFilters as SearchFiltersType } from '@/types/news';
import { LoadingButton } from "@/components/common/LoadingButton";
import { useQuery } from '@tanstack/react-query';
import { NewsServiceFactory } from '@/services/news/NewsServiceFactory';

interface SearchFiltersProps {
    onSearch: (filters: SearchFiltersType) => void;
    initialFilters: SearchFiltersType;
    isLoading?: boolean;
}

const AVAILABLE_SOURCES = [
    { id: 'newsapi', name: 'News API' },
    { id: 'guardian', name: 'The Guardian' },
    { id: 'nytimes', name: 'The New York Times' }
] as const;

const DEFAULT_SOURCE = AVAILABLE_SOURCES[0];

const COMMON_CATEGORIES = [
    'Business',
    'Technology',
    'Sports',
    'Science',
    'World',
    'Health'
] as const;

export const SearchFilters = ({
                                  onSearch,
                                  initialFilters,
                                  isLoading = false
                              }: SearchFiltersProps) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [filters, setFilters] = useState<SearchFiltersType>({
        ...initialFilters,
        sources: initialFilters.sources?.length ? initialFilters.sources : [DEFAULT_SOURCE.id]
    });

    const [searchInput, setSearchInput] = useState(initialFilters.query || '');
    const [selectedSource, setSelectedSource] = useState<typeof AVAILABLE_SOURCES[number]>(
        AVAILABLE_SOURCES.find(source => filters.sources?.[0] === source.id) || DEFAULT_SOURCE
    );
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        filters.categories?.[0] || null
    );
    const [selectedAuthor, setSelectedAuthor] = useState<string | null>(
        initialFilters.author || null
    );

    // Fetch authors based on selected source
    const { data: authors = [], isLoading: isLoadingAuthors } = useQuery({
        queryKey: ['authors', selectedSource.id],
        queryFn: async () => {
            const newsService = NewsServiceFactory.getService();
            return newsService.getAuthors(selectedSource.id);
        },
        enabled: !!selectedSource.id,
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    });

    useEffect(() => {
        setFilters({
            ...initialFilters,
            sources: initialFilters.sources?.length ? initialFilters.sources : [DEFAULT_SOURCE.id]
        });
        setSearchInput(initialFilters.query || '');
        setSelectedSource(
            AVAILABLE_SOURCES.find(source => initialFilters.sources?.[0] === source.id) || DEFAULT_SOURCE
        );
        setSelectedCategory(initialFilters.categories?.[0] || null);
        setSelectedAuthor(initialFilters.author || null);
    }, [initialFilters]);

    const handleSearch = () => {
        const baseFilters = {
            ...filters,
            query: searchInput.trim(),
            sources: [selectedSource.id],
            categories: selectedCategory ? [selectedCategory.toLowerCase()] : [],
            author: selectedAuthor,
            page: 1,
            pageSize: 12
        };

        onSearch(baseFilters);
    };

    const handleClear = () => {

        setSearchInput('');
        setSelectedSource(DEFAULT_SOURCE);
        setSelectedCategory(null);
        setSelectedAuthor(null);
    };

    return (
        <Box sx={{ mb: 3 }}>
            <Paper sx={{ p: 2 }}>
                <Grid container spacing={2}>
                    {/* Search Input */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            placeholder="Search news..."
                            size="small"
                            InputProps={{
                                endAdornment: searchInput && (
                                    <IconButton
                                        size="small"
                                        onClick={() => setSearchInput('')}
                                        aria-label="clear search"
                                    >
                                        <ClearIcon />
                                    </IconButton>
                                ),
                            }}
                        />
                    </Grid>

                    {/* Filters */}
                    <Grid item xs={12} md={6}>
                        <Grid container spacing={2}>
                            <Grid item xs={4}>
                                <Autocomplete
                                    size="small"
                                    options={AVAILABLE_SOURCES}
                                    getOptionLabel={(option) => option.name}
                                    value={selectedSource}
                                    onChange={(_, newValue) => {
                                        setSelectedSource(newValue || DEFAULT_SOURCE);
                                        setSelectedAuthor(null);
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} placeholder="Select source" />
                                    )}
                                    disableClearable
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <Autocomplete
                                    size="small"
                                    options={COMMON_CATEGORIES}
                                    value={selectedCategory}
                                    onChange={(_, newValue) => setSelectedCategory(newValue)}
                                    renderInput={(params) => (
                                        <TextField {...params} placeholder="Category" />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <Autocomplete
                                    size="small"
                                    options={authors.map(author => author.name)}
                                    value={selectedAuthor}
                                    onChange={(_, newValue) => setSelectedAuthor(newValue)}
                                    loading={isLoadingAuthors}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            placeholder="Select author"
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <>
                                                        {isLoadingAuthors ? (
                                                            <CircularProgress color="inherit" size={20} />
                                                        ) : null}
                                                        {params.InputProps.endAdornment}
                                                    </>
                                                ),
                                            }}
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* Action Buttons */}
                    <Grid item xs={12}>
                        <Box sx={{
                            display: 'flex',
                            gap: 1,
                            justifyContent: 'flex-end',
                            flexDirection: isMobile ? 'column' : 'row'
                        }}>
                            <LoadingButton
                                variant="outlined"
                                onClick={handleClear}
                                fullWidth={isMobile}
                            >
                                Clear
                            </LoadingButton>
                            <LoadingButton
                                variant="contained"
                                onClick={handleSearch}
                                loading={isLoading}
                                startIcon={<SearchIcon />}
                                fullWidth={isMobile}
                            >
                                Search
                            </LoadingButton>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};