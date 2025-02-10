import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    useTheme,
    Box,
    Avatar
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';

interface HeaderProps {
    onMenuClick: () => void;
    isMobile: boolean;
    drawerWidth: number;
}

export const Header = ({ onMenuClick, isMobile, drawerWidth }: HeaderProps) => {
    const theme = useTheme();
    return (
        <AppBar
            position="fixed"
            sx={{
                width: { sm: `calc(100% - ${drawerWidth}px)` },
                ml: { sm: `${drawerWidth}px` },
                backgroundColor: 'background.paper',
                color: 'text.primary',
                borderBottom: 1,
                borderColor: 'divider',
                transition: theme.transitions.create(['margin', 'width'], {
                    easing: theme.transitions.easing.easeOut,
                    duration: theme.transitions.duration.enteringScreen,
                })
            }}
        >
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {isMobile && (
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={onMenuClick}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Typography
                        variant={isMobile ? "body1" : "h6"}
                        noWrap
                        component="div"
                    >
                        News Aggregator
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography
                        variant="body2"
                        sx={{ display: { xs: 'none', md: 'block' } }}
                    >
                        alirezamirehe
                    </Typography>
                    <Avatar
                        sx={{
                            width: { xs: 32, sm: 40 },
                            height: { xs: 32, sm: 40 }
                        }}
                    >
                        AM
                    </Avatar>
                </Box>
            </Toolbar>
        </AppBar>
    );
};