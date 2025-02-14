import { useState, useEffect } from "react";
import TwitchClient from "./data/CreateTwitchClient.jsx";
import campana from "./campana.mp3";
import backgroundImgPomo from "./img/michi_adulto.png";
import backgroundImgBreak from "./img/michi_joven.png";

import "./App.css";

function App() {
  const [client, setClient] = useState(null);
  var [timer, setTimer] = useState(10 * 60);
  var [pomodoroTotal, setPomodoroTotal] = useState(5);
  const [pomoCount, setPomoCount] = useState(0);
  const [etiquetas, setEtiquetas] = useState("💻 Vamos começar 🍵");
  const [backgroundImg, setBackgroundImg] = useState(backgroundImgBreak);

  useEffect(() => {
    const newClient = TwitchClient(); // Crea y conecta el cliente
    setClient(newClient);

    return () => {
      if (newClient) {
        console.log("Me desconecto");
        newClient.disconnect();
      }
    };
  }, []);

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
            timer = 50 * 60;
            client.say(
              "emanuwlly",
              "No momento, estamos estudando/trabalhando. Você pode ocultar o chat para não se distrair. Se não souber como fazer isso, informe-nos e nós explicaremos a você."
            );
            setEtiquetas("📖 é hora de focar 📖");
            audio.play();
            setBackgroundImg(backgroundImgPomo);
            vueltas++;
            pomo++;
          } else {
            vueltas++;
            timer = 15 * 60;
            client.say(
              "emanuwlly",
              "Estamos no intervalo, nos alongamos, nos reabastecemos e jogamos. Bom tempo de descanso. "
            );
            setEtiquetas("🥤Intervalo / hora do café 🍙");
            setBackgroundImg(backgroundImgBreak);
            audio.play();
          }
          if (pomo === pomodoroTotal + 1) {
            clearInterval(interval);
            console.log(`Se completaron ${pomodoroTotal} pomodoros`);
            client.say(
              "emanuwlly",
              "É o fim do intervalo, esticar, reabastecer e jogar. Espero que tenha sido um bom dia para você"
            );
            setEtiquetas("Fim da transmissã");
            client.say(
              "emanuwlly",
              "Chegamos ao final, obrigado pela companhia"
            );
            iniciado = false;
            audio.play();
            return;
          }
          setPomoCount(pomo);
        }
      }, 1000);
    }

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

    function pomot(num) {
      pomodoroTotal = parseInt(num);
      setPomodoroTotal(num);
    }

    if (client) {
      client.on("message", (channel, userstate, message, self) => {
        if (self) return;
        if (!message.startsWith("!")) return;
        const args = message.slice(1).split(" ");
        const command = args.shift().toLowerCase();
        const username = userstate.username;
        const mod = userstate?.mod;
        const num = parseInt(args);
        if (username === "cuartodechenz" || username === "emanuwlly" || mod) {
          switch (command) {
            case "start":
              if (!iniciado) {
                iniciado = true;
                startTimer();
              } else {
                return console.log("Já existe um tempo definido");
              }
              break;
            case "pause":
              stopTimer();
              break;
            case "min":
              if (!isNaN(num)) {
                minutosOn(num);
              } else {
                console.log("o argumento não é um número válido");
              }
              break;
            case "pomot":
              if (!isNaN(num)) {
                pomot(num);
              } else {
                console.log("O argumento não é um número válido");
              }
              break;
            default:
              console.log("Não é um comando válido");
          }
        }
      });
    }
  }, [client]);

  return (
    <div>
      <div className="contenedor">
        <div className="contenedor_elementos">
          <div className="contendor_pomos">
            <div className="contendor_pomos_items">
              <div className="contendor_pomos_item">{pomoCount}</div>
              <div className="contendor_pomos_item">/</div>
              <div className="contendor_pomos_item"> {pomodoroTotal}</div>
            </div>
          </div>
          <div
            className="contendor_timer"
            id="timer"
          >
            <div className="contendor_timer_elements">{timer}</div>
          </div>
        </div>
        <div
          className="image"
          style={{
            backgroundImage: `url(${backgroundImg})`,
          }}
        ></div>
      </div>
      <div className="contendor_etiqueta">
        <div id="timerNote">
          <div className="contenedor_etiqueta_element">{etiquetas}</div>
        </div>
      </div>
    </div>
  );
}

export default App;
