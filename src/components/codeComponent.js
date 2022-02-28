import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LoadingButton from '@mui/lab/LoadingButton';
import { Alert, Avatar, Container, CssBaseline, Typography } from "@mui/material"
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useState } from 'react';

const theme = createTheme();

export default function CodeComponent({ code }) {
    let [copied, setCopied] = useState()
    return <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5" textAlign={"center"}>
                    Share this code with a friend to join the game
                </Typography>
                <Box>
                    <Typography component="h1" variant="h3" color={"cornflowerblue"}>
                        {code}
                    </Typography>
                    <LoadingButton
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        color={copied ? "success" : "info"}
                        onClick={
                            () => {
                                navigator.clipboard.writeText(code)
                                setCopied(true)
                            }}
                    >
                        Copy code
                    </LoadingButton>
                    {copied && <Alert severity="success">Code copied to clipboard</Alert>}
                </Box>
            </Box>
        </Container>
    </ThemeProvider>
}