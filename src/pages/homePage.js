import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LoadingButton from '@mui/lab/LoadingButton';
import { Avatar, Container, CssBaseline, Grid, TextField, Typography } from "@mui/material"
import { useContext, useEffect, useState } from "react"
import GameComponent from "../components/gameComponent"
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { SocketContext } from "../utils/socket"
import CodeComponent from '../components/codeComponent';

const theme = createTheme();

function validateSecretNumber(secretNumber) {
    let set = new Set(secretNumber)
    let arr  = Array.from(set)
    return arr.length === 5
}

export default function HomePage(params) {
    const socket = useContext(SocketContext)
    let [loading, setLoading] = useState(false)
    let [name, setName] = useState("")
    let [startGame, setStartGame] = useState(false)
    let [joinCode, setJoinCode] = useState("")
    let [code, setCode] = useState("")
    let [secretNumber, setSecretNumber] = useState("")
    useEffect(() => {
        socket.on("connect", (msg) => {
            console.log("Connected", msg);
        })
        socket.on("error", (msg) => {
            setLoading(false)
            alert(msg["message"]);
        })
        socket.on('room-join', (msg, id) => {
            setLoading(false)
            setStartGame(true)

        })
        socket.on('room-create', (msg) => {
            setLoading(false)
            setCode(msg["code"])
        })

    }, [socket])

    if (startGame !== true) {
        return <div>
            {code !== "" ? <CodeComponent code={code} /> :
                <ThemeProvider theme={theme}>
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
                            <Typography component="h1" variant="h5">
                                Create or Join a game
                            </Typography>
                            <Box>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            autoComplete="given-name"
                                            value={name}
                                            onChange={(v) => setName(v.target.value)}
                                            required
                                            fullWidth
                                            label="Name"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            type={"number"}
                                            error={validateSecretNumber(secretNumber) !== true}
                                            helperText={"Number must have 5 digits and no duplicates"}
                                            fullWidth
                                            label="Secret Number"
                                            value={secretNumber}
                                            onChange={(v) => setSecretNumber(v.target.value)}
                                        />
                                    </Grid>
                                    <LoadingButton
                                        loading={loading}
                                        disabled={validateSecretNumber(secretNumber) !== true}
                                        fullWidth
                                        variant="contained"
                                        sx={{ mt: 3, mb: 2 }}
                                        onClick={
                                            () => {
                                                socket.emit("create-room", { username: name, number: secretNumber })
                                                setLoading(true)
                                            }}
                                    >
                                        Create a new game
                                    </LoadingButton>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="joinCode"
                                            label="Game Code"
                                            name="joinCode"
                                            value={joinCode}
                                            onChange={(v) => setJoinCode(v.target.value)}
                                        />
                                    </Grid>
                                </Grid>
                                <LoadingButton
                                    loading={loading}
                                    disabled={joinCode === "" || validateSecretNumber(secretNumber) !== true}
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                    color={"secondary"}
                                    onClick={
                                        () => {
                                            socket.emit("join-room", { username: name, room: joinCode, number: secretNumber })
                                            setLoading(true)
                                        }}
                                >
                                    Join friend's game
                                </LoadingButton>
                            </Box>
                        </Box>
                    </Container>
                </ThemeProvider>
            } </div>
    } else {
        return <GameComponent socket={socket} />
    }
}