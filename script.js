const gameboard = (() => {
    let board = [
        '', '', '',
        '', '', '',
        '', '', ''
    ]

    const resetBoard = () => {
        gameboard.board = [
            '', '', '',
            '', '', '',
            '', '', ''
        ]
    }

    return { board, resetBoard }
})();

const player = (() => {    
    const playerAction = (e) => {
        gameController.playRound(e)
    }

    const handleNameSubmit = (e) => {
        e.preventDefault();
        const input = document.querySelector(`.name-input`)
        if(input.value === ``) {
            input.classList.add(`alert`)
        } else {
            const name = input.value
            displayController.showGame(name)
        }
        
    }

    const startGameBtn = document.querySelector(`.start-game-btn`)
    startGameBtn.addEventListener(`click`, handleNameSubmit)

    return { playerAction }
})();

const gameController = (() => {
    
    let playing = false

    const playNewGame = () => {
        playing = true
        gameboard.resetBoard()
        displayController.showBoard()

        displayController.nextRoundBtn.addEventListener(`click`, () => {
            displayController.hideNextRoundBtn()
            gameController.playNewGame()
            
            const message = document.querySelector(`.display .message`)
            message.innerText = ``
        })
    }

    const playerMove = e => {
        if (!gameboard.board[e.target.id] && !gameOver()) {
            gameboard.board[e.target.id] = `×`
            displayController.showBoard()
            return true
        }
        return false
    }
    
    const oponentMove = () => {
        const randomNum = Math.floor(Math.random() * 9)
        if (!gameboard.board[randomNum]) {
            gameboard.board[randomNum] = `◯`
            displayController.showBoard()
            return true
        } else if (!gameOver()) {
            return oponentMove()
        }
    }

    const playRound = e => {
        const lastPlayerMove = playerMove(e)
        if(lastPlayerMove && !gameOver()) oponentMove()
        gameOver()
    }

    const gameTie = () => {
        if (gameboard.board.reduce((a, b) => a + b, ``).length === 9) {
            if (gameWinner()) {
                return false
            } else {
                return `tie`
            }
        }
        return false
    }

    const gameWinner = () => {
        const b = gameboard.board

        if (b[0] && b[1] && b[2] && 
            b[0] === b[1] && b[0] === b[2]) {
            return b[0]
        } else if (b[3] && b[4] && b[5] && 
                   b[3] === b[4] && b[3] === b[5]) {
            return b[3]
        } else if (b[6] && b[7] && b[8] && 
                   b[6] === b[7] && b[6] === b[8]) {
            return b[6]
        } else if (b[0] && b[3] && b[6] && 
                   b[0] === b[3] && b[0] === b[6]) {
            return b[0]
        } else if (b[1] && b[4] && b[7] && 
                   b[1] === b[4] && b[1] === b[7]) {
            return b[1]
        } else if (b[2] && b[5] && b[8] && 
                   b[2] === b[5] && b[2] === b[8]) {
            return b[2]
        } else if (b[0] && b[4] && b[8] && 
                   b[0] === b[4] && b[0] === b[8]) {
            return b[0]
        } else if (b[2] && b[4] && b[6] && 
                   b[2] === b[4] && b[2] === b[6]) {
            return b[2]
        }
        return false

    }

    const gameOver = () => {
        const gameOver = gameWinner() || gameTie()

        if(playing && gameOver) {
            displayController.showNextRoundBtn()

            if(gameWinner() === `×`) score.player += 1
            if(gameWinner() === `◯`) score.opponent += 1

            displayController.showScore(score.player, score.opponent)

            playing = false
        }

        return gameOver
    }

    const score = {
        player: 0,
        opponent: 0
    }

    return { score, playNewGame, playRound, gameOver }
})();

const displayController = (() => {
    const cells = document.querySelectorAll(`.cell`)
    
    const addCellsContent = () => {
        cells.forEach((cell, i) => {
            cell.innerText = gameboard.board[i]
        })
    }

    const addEventListeners = () => {
        cells.forEach(cell => cell.addEventListener(`click`, player.playerAction))
    }

    const showBoard = () => {
        displayController.addCellsContent()
        displayController.addEventListeners()
        displayController.gameOverMessage()  // change
    }

    const gameOverMessage = () => {
        if (gameController.gameOver()) {
            let message = document.querySelector(`.display .message`)
            if (gameController.gameOver() === `×`) {
                message.innerText = `Congratulations, you win this round!`
            } else if (gameController.gameOver() === `◯`) {
                message.innerText = `Unfortunately, you lost this round...`
            } else if (gameController.gameOver() === `tie`) {
                message.innerText = `It's a tie!`
            } else {
                message.innerText = `Error`
            }
        }
    }

    const nextRoundBtn = document.querySelector(`.next-round-btn`)
    const showNextRoundBtn = () => nextRoundBtn.classList.remove(`invisible`)
    const hideNextRoundBtn = () => nextRoundBtn.classList.add(`invisible`)

    showScore = (playerScore, opponentScore) => {
        const playerScoreDisplay = document.querySelector(`.player-score`)
        const opponentScoreDisplay = document.querySelector(`.computer-score`)

        playerScoreDisplay.innerText = playerScore
        opponentScoreDisplay.innerText = opponentScore
    }

    const showGame = (name) => {
        const intro = document.querySelector(`.introduction`)
        const main = document.querySelector(`.main`)
        const playerDisplay = document.querySelector(`.player`)

        intro.classList.add(`intangible`)
        main.classList.remove(`intangible`)
        playerDisplay.innerText = name
    }

    return { cells, nextRoundBtn, addCellsContent, addEventListeners, showBoard,
        gameOverMessage, showNextRoundBtn, hideNextRoundBtn, showScore, showGame }
})();

gameController.playNewGame()
