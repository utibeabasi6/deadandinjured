import { useEffect, useState } from "react"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import LoadingButton from '@mui/lab/LoadingButton';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box, Container, CssBaseline, TextField, Grid, Alert, AlertTitle } from "@mui/material";

function validateSecretNumber(secretNumber) {
    let set = new Set(secretNumber)
    let arr = Array.from(set)
    return arr.length === 5
}

function updateState(code, rows, currentPlayer, secretCode) {
    localStorage.setItem("data", JSON.stringify({ code, rows, currentPlayer, secretCode }))
}

const theme = createTheme();

export default function GameComponent({ socket, code, secretCode }) {
    let data = JSON.parse(localStorage.getItem("data"))
    let [guess, setGuess] = useState("")
    let [loading, setLoading] = useState(false)
    let [gameOver, setGameOver] = useState(false)
    let [winner, setWinner] = useState("")
    let [currentPlayer, setCurrentPlayer] = useState(() => {
        if (data) {
            let prevCode = data["code"]
            if (prevCode === code) {
                return data["currentPlayer"]
            }else{
                return false
            }
        } else {
            return false
        }
    })
    let [rows, setRows] = useState(() => {
        if (data) {
            let prevCode = data["code"]
            if (prevCode === code) {
                return data["rows"]
            } else {
                return []
            }
        } else {
            return []
        }
    }
    )

    if (data) {
        let prevCode = data["code"]
        if (prevCode === code) {
            let prevSecretCode = data['secretCode']
            if (prevSecretCode !== secretCode){
                socket.emit('update-secret-number', prevSecretCode)
                localStorage.setItem("data", JSON.stringify({...data, secretCode: prevSecretCode}))
            }

            
        } 
    }
    console.log(data);


    useEffect(() => {
        socket.on('game-over', (msg) => {
            setGameOver(true)
            setWinner(msg)
        })

        socket.on('result', (data) => {
            setRows((p) => [...p, data])
            setLoading(false)
            if (data["dead"] === 5) {
                socket.emit("game-over", { winner: socket.id })
            }
        })

        socket.on("next-player", (id) => {
            setCurrentPlayer(socket.id !== id)
        })


    }, [socket])
    return <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="md">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Guesses</TableCell>
                                <TableCell align="right">Result</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows && rows.map((row) => (
                                <TableRow
                                    key={row.name}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell>{row.guess}</TableCell>
                                    <TableCell align="right">{row.dead} Dead, {row.injured} Injured</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                {gameOver !== true ? <Grid container spacing={2} alignItems={"center"} style={{ marginTop: 40 }}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            type={"number"}
                            maxLength={5}
                            error={validateSecretNumber(guess) !== true}
                            helperText={"Number must have 5 digits and no duplicates"}
                            value={guess}
                            onChange={(v) => {
                                setGuess(v.target.value)
                            }}
                            required
                            fullWidth
                            label="Enter guess"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        {currentPlayer ? <LoadingButton
                            fullWidth
                            disabled={loading}
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={
                                () => {
                                    setLoading(true)
                                    socket.emit("guess", guess)
                                    updateState(code, rows, currentPlayer, secretCode)
                                }}
                        >
                            Check Guess
                        </LoadingButton> : <LoadingButton
                            disabled
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Check Guess
                        </LoadingButton>}
                    </Grid>
                    <Grid item xs={12}>
                        {currentPlayer ? <Alert severity="success">You can play now!</Alert> : <Alert severity="info">Waiting for other player!</Alert>}
                    </Grid>
                </Grid> : <Alert style={{ marginTop: 40 }} onClose={() => {
                    localStorage.removeItem("data")
                    window.location.reload() }} severity="success">
                    <AlertTitle>Game Over</AlertTitle>
                    {winner["winner"]} won! - {winner["winner"]}'s last guess was {winner["guess"]}
                </Alert>}
            </Box>
        </Container>
    </ThemeProvider >
}