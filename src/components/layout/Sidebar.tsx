import {
    Box,
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    Divider,
    useTheme
} from '@mui/material';
import {
    Bookmark as BookmarkIcon,
    Home as HomeIcon
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';

interface SidebarProps {
    mobileOpen: boolean;
    onDrawerToggle: () => void;
    drawerWidth: number;
    isMobile: boolean;
}

export const Sidebar = ({
                            mobileOpen,
                            onDrawerToggle,
                            drawerWidth,
                            isMobile
                        }: SidebarProps) => {
    const location = useLocation();
    const navigate = useNavigate();
    const theme = useTheme();

    const menuItems = [
        { text: 'Home', icon: <HomeIcon />, path: '/' },
        { text: 'Saved Articles', icon: <BookmarkIcon />, path: '/saved' }
    ];

    const drawer = (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
        }}>
            <Box sx={{ p: 2 }}>
                <Typography
                    variant="h6"
                    sx={{
                        fontSize: { xs: '1.1rem', sm: '1.25rem' },
                        fontWeight: 600
                    }}
                >
                    Menu
                </Typography>
            </Box>
            <Divider />
            <List sx={{ flex: 1 }}>
                {menuItems.map((item) => (
                    <ListItemButton
                        key={item.text}
                        selected={location.pathname === item.path}
                        onClick={() => {
                            navigate(item.path);
                            if (isMobile) {
                                onDrawerToggle();
                            }
                        }}
                        sx={{
                            mx: 1,
                            borderRadius: 1,
                            mb: 0.5,
                            '&.Mui-selected': {
                                backgroundColor: theme.palette.primary.main + '20',
                                '&:hover': {
                                    backgroundColor: theme.palette.primary.main + '30',
                                },
                            },
                        }}
                    >
                        <ListItemIcon
                            sx={{
                                color: location.pathname === item.path
                                    ? 'primary.main'
                                    : 'inherit',
                                minWidth: { xs: 40, sm: 48 }
                            }}
                        >
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText
                            primary={item.text}
                            primaryTypographyProps={{
                                fontSize: { xs: '0.875rem', sm: '1rem' }
                            }}
                        />
                    </ListItemButton>
                ))}
            </List>
            <Divider />
            <Box sx={{ p: 2 }}>
                <Typography variant="caption" color="text.secondary">
                    © 2025 News Aggregator
                </Typography>
            </Box>
        </Box>
    );

    return (
        <Box
            component="nav"
            sx={{
                width: { sm: drawerWidth },
                flexShrink: { sm: 0 },
                // Add max-width to prevent drawer from becoming too wide
                maxWidth: {
                    sm: '30vw',    // 30% of viewport width on tablet
                    md: '25vw',    // 25% of viewport width on laptop
                    lg: '20vw'     // 20% of viewport width on desktop
                }
            }}
        >
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={onDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: drawerWidth,
                        maxWidth: '80vw',
                        backgroundColor: theme.palette.background.default,
                        borderRight: `1px solid ${theme.palette.divider}`,
                    }
                }}
            >
                {drawer}
            </Drawer>

            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: drawerWidth,
                        maxWidth: {
                            sm: '30vw',
                            md: '25vw',
                            lg: '20vw'
                        },
                        backgroundColor: theme.palette.background.default,
                        borderRight: `1px solid ${theme.palette.divider}`,
                        transition: theme.transitions.create(['width', 'margin'], {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.enteringScreen
                        })
                    }
                }}
                open
            >
                {drawer}
            </Drawer>
        </Box>
    );
};