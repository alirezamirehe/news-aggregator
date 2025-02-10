import { createTheme } from '@mui/material';

// TODO - Add new theme configuration here
export const theme = createTheme({
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 960,
            lg: 1280,
            xl: 1920,
        },
    },
    components: {
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    width: 280,
                },
            },
        },
        MuiTextField: {
            defaultProps: {
                size: 'small',
            },
        },
        MuiButton: {
            defaultProps: {
                size: 'medium',
            },
        },
        MuiChip: {
            defaultProps: {
                size: 'small',
            },
        },
    },
});