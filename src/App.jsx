import { useState, useEffect } from "react";
import CreateTwitchClient from "./data/createTwitchClient";
import campana from "./campana.mp3";
import backgroundImgPomo from "./img/michi_adulto.png";
import backgroundImgBreak from "./img/michi_joven.png";

import "./App.css";

function App() {
  const [client, setClient] = useState(null);
  var [timer, setTimer] = useState(10 * 60);
  var [pomodoroTotal, setPomodoroTotal] = useState(3);
  const [pomoCount, setPomoCount] = useState(0);
  const [etiquetas, setEtiquetas] = useState("💻Estamos por iniciar🍵");
  const [autoTimer, setAutoTimer] = useState(true);
  const [backgroundImg, setBackgroundImg] = useState(backgroundImgBreak);

  useEffect(() => {
    const newClient = CreateTwitchClient(); // Crea y conecta el cliente
    setClient(newClient);

    return () => {
      if (newClient) {
        console.log("Me desconecto");
        newClient.disconnect();
      }
    };
  }, []); // No necesitas pasarlo en dependencias

  useEffect(() => {
    var iniciado = false;
    let interval;
    let minutos;
    let segundos;
    var pomo = 0;
    var vueltas = 2;
    function startTimer() {
      interval = setInterval(() => {
        minutos = parseInt(timer / 60, 10);
        segundos = parseInt(timer % 60, 10);
        const minutosFormateados = minutos < 10 ? `0${minutos}` : minutos;
        const segundosFormateados = segundos < 10 ? `0${segundos}` : segundos;
        setTimer(`${minutosFormateados}:${segundosFormateados}`);

        if (--timer < 0) {
          let audio = new Audio(campana);
          if (vueltas % 2 == 0) {
            timer = 60 * 60; // Pomodoro de 10 minuto de descanso, ajustar según lo que crean necesario.
            client.say(
              "brunispet",
              "Estamos en este momento estudiando / trabajando, puedes ocultar el chat para no distraerte. Si no sabes cómo se hace, avísanos y te explicamos."
            );
            setEtiquetas("PRODUCTIVO 📚📖");
            audio.play();
            setBackgroundImg(backgroundImgPomo);
            vueltas++;
            pomo++;
          } else {
            vueltas++;
            timer = 10 * 60; // Pomodoro de 10 minuto de descanso, ajustar según lo que crean necesario.
            client.say(
              "brunispet",
              "Estamos en break, a estirar, a reponer y jugar. Que sea un buen descanso. ¿Cómo estuvo el pomo?. Si el streamer no se dio cuenta podes cambiar este mensaje por !lachancla"
            );
            setEtiquetas("DESCANSO 🍙🥤");
            setBackgroundImg(backgroundImgBreak);
            audio.play();
          }
          if (pomo === pomodoroTotal + 1) {
            clearInterval(interval);
            console.log(`Se completaron ${pomodoroTotal} pomodoros`);
            client.say(
              "brunispet",
              "Es el final del break, a estirar, a reponer y jugar. Espero que fuera una buena jornada para ti"
            );
            setEtiquetas("FINAL DE STREAM");
            client.say("brunispet", "Llegamos al final del stream");
            iniciado = false;
            audio.play();
            return;
          }
          setPomoCount(pomo);
        }
      }, 1000);
    }

    /* Funciones */

    function minutosOn(num) {
      const newTimer = parseInt(num) * 60;
      const newMinutes = Math.floor(newTimer / 60);
      const newSeconds = newTimer % 60;
      timer = newTimer;
      setTimer(
        `${newMinutes.toString().padStart(2, "0")}:${newSeconds
          .toString()
          .padStart(2, "0")}`
      );
    }

    function stopTimer() {
      clearInterval(interval);
      iniciado = false;
    }

    function timerAuto() {
      setAutoTimer(!autoTimer);
    }

    function pomot(num) {
      pomodoroTotal = parseInt(num);
      setPomodoroTotal(num);
    }

    /* Handler de Twitch */
    if (client) {
      client.on("message", (channel, userstate, message, self) => {
        if (self) return;
        if (!message.startsWith("!")) return;
        const args = message.slice(1).split(" ");
        const command = args.shift().toLowerCase();
        const username = userstate.username;
        const mod = userstate?.mod;
        const num = parseInt(args);
        if (username === "cuartodechenz" || mod) {
          switch (command) {
            case "start":
              if (!iniciado) {
                iniciado = true;
                startTimer();
              } else {
                return console.log("Ya hay un timer activo");
              }
              break;
            case "pause":
              stopTimer();
              break;
            case "auto":
              timerAuto();
              break;
            case "min":
              if (!isNaN(num)) {
                minutosOn(num);
              } else {
                console.log("El argumento no es un número válido");
              }
              break;
            case "pomot":
              if (!isNaN(num)) {
                pomot(num);
              } else {
                console.log("El argumento no es un número válido");
              }
              break;
            default:
              console.log("No es un comando válido");
          }
        }
      });
    }
  }, [client]);

  return (
    <div>
      <div
        className="contenedor"
        style={{
          backgroundImage: `url(${backgroundImg})`,
        }}
      >
        <div className="contenedor_elementos">
          <div>
            <div>Pomo Actual {pomoCount}</div>
            <div>Pomo Totales {pomodoroTotal}</div>
          </div>
          <div
            className="contendor_timer"
            id="timer"
          >
            <div className="contendor_timer_elements">{timer}</div>
          </div>
          <div className="contendor_etiqueta">
            <div id="timerNote">
              <div className="contenedor_etiqueta_element">{etiquetas}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
