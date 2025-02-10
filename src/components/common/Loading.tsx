import {Box, CircularProgress} from '@mui/material';

export const Loading = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '50vh',
                gap: 2
            }}
        >
            <CircularProgress/>
        </Box>
    );
};