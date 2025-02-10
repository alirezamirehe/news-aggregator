import { Box, useTheme, useMediaQuery } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useState, useEffect } from 'react';

// Responsive drawer configuration with more reasonable widths
const DRAWER_CONFIG = {
    defaultWidth: 240,
    breakpoints: {
        xs: 240,  // Mobile
        sm: 240,  // Tablet
        md: 260,  // Small Laptop
        lg: 280,  // Desktop
        xl: 300   // Large screens (reduced from 320)
    }
} as const;

export const MainLayout = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isLaptop = useMediaQuery(theme.breakpoints.between('md', 'lg'));
    const [mobileOpen, setMobileOpen] = useState(false);
    const [drawerWidth, setDrawerWidth] = useState<number>(DRAWER_CONFIG.defaultWidth);

    // Updates drawer width based on screen size
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            let newWidth: number = DRAWER_CONFIG.defaultWidth;

            // Adjusts drawer width based on screen size
            if (width >= theme.breakpoints.values.xl) {
                newWidth = DRAWER_CONFIG.breakpoints.xl;
            } else if (width >= theme.breakpoints.values.lg) {
                newWidth = DRAWER_CONFIG.breakpoints.lg;
            } else if (width >= theme.breakpoints.values.md) {
                newWidth = DRAWER_CONFIG.breakpoints.md;
            } else if (width >= theme.breakpoints.values.sm) {
                newWidth = DRAWER_CONFIG.breakpoints.sm;
            } else {
                newWidth = DRAWER_CONFIG.breakpoints.xs;
            }

            if (isLaptop) {
                newWidth = Math.min(newWidth, DRAWER_CONFIG.breakpoints.md);
            }

            setDrawerWidth(newWidth);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [theme.breakpoints.values, isLaptop]);

    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

    return (
        <Box sx={{
            display: 'flex',
            minHeight: '100vh',
            overflow: 'hidden'
        }}>
            <Header
                onMenuClick={handleDrawerToggle}
                isMobile={isMobile}
                drawerWidth={drawerWidth}
            />
            <Sidebar
                mobileOpen={mobileOpen}
                onDrawerToggle={handleDrawerToggle}
                drawerWidth={drawerWidth}
                isMobile={isMobile}
            />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    width: {
                        xs: '100%',
                        sm: `calc(100% - ${drawerWidth}px)`
                    },
                    mt: {
                        xs: '56px',  // Mobile header height
                        sm: '64px'   // Desktop header height
                    },
                    p: {
                        xs: 1,       // Smaller padding on mobile
                        sm: 2,       // Medium padding on tablet
                        md: 3        // Larger padding on desktop
                    },
                    transition: theme.transitions.create(
                        ['margin', 'width', 'padding'],
                        {
                            easing: theme.transitions.easing.easeOut,
                            duration: theme.transitions.duration.enteringScreen
                        }
                    ),
                    overflowX: 'hidden',
                    // Adds max-width for better content distribution
                    maxWidth: {
                        sm: `calc(100vw - ${drawerWidth}px)`,
                        md: theme.breakpoints.values.xl,
                    },
                    mx: 'auto'
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
};