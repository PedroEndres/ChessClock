import { useState, useEffect } from "react";
import "./App.css";
import ModalAlert from "./components/ModalAlert";

function ChessClock() {
  const [player1Time, setPlayer1Time] = useState(600); // Tiempo inicial en segundos
  const [player2Time, setPlayer2Time] = useState(600);
  const [activePlayer, setActivePlayer] = useState(1); // Jugador activo (1 o 2)
  const [isRunning, setIsRunning] = useState(false);
  const [customIncrement, setCustomIncrement] = useState(0); // Incremento personalizado en segundos (2 minutos)
  const [gameStarted, setGameStarted] = useState(false);
  const [customPlayer1Time, setCustomPlayer1Time] = useState(600); // Tiempo personalizado jugador 1 en segundos
  const [customPlayer2Time, setCustomPlayer2Time] = useState(600); // Tiempo personalizado jugador 2 en segundos
  const [theme, setTheme] = useState("light"); // Estado para el tema (light o dark)

  // Use effects para sincronizar jugadores
  useEffect(() => {
    if (!gameStarted) {
      setPlayer1Time(customPlayer1Time);
      setPlayer2Time(customPlayer2Time);
    }
  }, [customPlayer1Time, customPlayer2Time, gameStarted]);

  useEffect(() => {
    let timer;

    if (isRunning && gameStarted) {
      timer = setInterval(() => {
        if (activePlayer === 1) {
          setPlayer1Time((prevTime) => prevTime - 1);
        } else {
          setPlayer2Time((prevTime) => prevTime - 1);
        }
      }, 1000); // El temporizador aún se actualiza cada segundo para el control del incremento.
    } else {
      clearInterval(timer);
    }

    // Verificar si el tiempo se ha agotado
    if ((player1Time === 0) & isRunning || (player2Time === 0) & isRunning) {
      // alert(`¡Jugador ${activePlayer} ha perdido por tiempo!`);
      setIsRunning(false);
    }

    return () => clearInterval(timer);
  }, [activePlayer, isRunning, player1Time, player2Time, gameStarted]);

  // Función para cambiar el tema
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  const chessClockClass = `chess-clock ${theme}-theme`;

  const handleStartPause = () => {
    if (!gameStarted) {
      setGameStarted(true);
      setPlayer1Time(customPlayer1Time);
      setPlayer2Time(customPlayer2Time);
    }

    setIsRunning((prevIsRunning) => !prevIsRunning); // setea el valor contrario
  };

  const handleReset = () => {
    setCustomPlayer1Time(600);
    setCustomPlayer2Time(600);
    setIsRunning(false);
    setActivePlayer(1);
    setGameStarted(false); // Reiniciar la partida
  };

  const handlePlayerClick = () => {
    if (gameStarted && isRunning) {
      if (activePlayer === 1) {
        setPlayer1Time((prevTime) => prevTime + customIncrement);
      } else {
        setPlayer2Time((prevTime) => prevTime + customIncrement);
      }
      setActivePlayer((prevPlayer) => (prevPlayer === 1 ? 2 : 1));
    }
  };
  const handleCustomIncrementChange = (event) => {
    // Actualizar el valor del incremento personalizado en segundos
    const newIncrement = parseInt(event.target.value, 10);
    setCustomIncrement(isNaN(newIncrement) ? 0 : newIncrement);
  };

  const handleCustomPlayer1TimeChange = (event) => {
    // Actualizar el tiempo personalizado del jugador 1 en segundos
    const newTimeInSeconds = parseInt(event.target.value, 10) * 60; // Convertir minutos a segundos
    setCustomPlayer1Time(isNaN(newTimeInSeconds) ? 0 : newTimeInSeconds);
  };

  const handleCustomPlayer2TimeChange = (event) => {
    // Actualizar el tiempo personalizado del jugador 2 en segundos
    const newTimeInSeconds = parseInt(event.target.value, 10) * 60; // Convertir minutos a segundos
    setCustomPlayer2Time(isNaN(newTimeInSeconds) ? 0 : newTimeInSeconds);
  };

  // Función para formatear el tiempo en minutos y segundos
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className={chessClockClass}>
      <div
        id="player1"
        className={`${activePlayer === 1 ? "active-timer " : ""}${
          player1Time <= 15 ? "player-timer-red " : ""
        }player-timer ${theme}-theme`}
        onClick={
          activePlayer === 1 && gameStarted ? handlePlayerClick : undefined
        }
      >
        {formatTime(player1Time)}
      </div>
      <div id="buttons-start-reset">
        <button onClick={handleStartPause}>
          {isRunning ? "Pausa" : "Iniciar"}
        </button>
        <button onClick={handleReset}>Reiniciar</button>
      </div>
      <div
        id="player2"
        className={`${activePlayer === 2 ? "active-timer " : ""}${
          player2Time <= 15 ? "player-timer-red " : ""
        }player-timer ${theme}-theme`}
        onClick={
          activePlayer === 2 && gameStarted ? handlePlayerClick : undefined
        }
      >
        {formatTime(player2Time)}
      </div>
      <div id="settings-container">
        <div className="settings">
          <span>Incremento opcional (seg):</span>
          <input
            type="number"
            value={customIncrement}
            onChange={handleCustomIncrementChange}
            disabled={gameStarted && isRunning} // Deshabilitar el input durante la partida en curso y en funcionamiento
          />
        </div>
        <div className="settings">
          <span>Tiempo Jugador 1 (min):</span>
          <input
            type="number"
            value={customPlayer1Time / 60} // Mostrar el tiempo personalizado en minutos
            onChange={handleCustomPlayer1TimeChange}
            disabled={gameStarted && isRunning} // Deshabilitar el input durante la partida en curso y en funcionamiento
          />
        </div>
        <div className="settings">
          <span>Tiempo Jugador 2 (min):</span>
          <input
            type="number"
            value={customPlayer2Time / 60} // Mostrar el tiempo personalizado en minutos
            onChange={handleCustomPlayer2TimeChange}
            disabled={gameStarted && isRunning} // Deshabilitar el input durante la partida en curso y en funcionamiento
          />
        </div>
        <div id="button-theme">
          <button onClick={toggleTheme}>Cambiar Tema</button>
        </div>
      </div>
      <ModalAlert
        player={
          player1Time === 0 && isRunning
            ? "Jugador 1"
            : player2Time === 0 && isRunning
            ? "Jugador 2"
            : null
        }
      />
    </div>
  );
}

export default ChessClock;
