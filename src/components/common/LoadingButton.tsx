import { Button, CircularProgress, keyframes } from '@mui/material';
import type { ButtonProps } from '@mui/material';

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

interface LoadingButtonProps extends ButtonProps {
    loading?: boolean;
    loadingText?: string;
}

export const LoadingButton = ({
                                  loading = false,
                                  loadingText = 'Loading...',
                                  disabled,
                                  children,
                                  startIcon,
                                  ...props
                              }: LoadingButtonProps) => {
    return (
        <Button
            {...props}
            disabled={disabled || loading}
            startIcon={
                loading ? (
                    <CircularProgress
                        size={20}
                        sx={{
                            color: 'inherit',
                            animation: `${spin} 1s linear infinite`,
                        }}
                    />
                ) : (
                    startIcon
                )
            }
        >
            {loading ? loadingText : children}
        </Button>
    );
};