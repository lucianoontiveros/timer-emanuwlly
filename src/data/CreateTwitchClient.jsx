import tmi from "tmi.js";

const CreateTwitchClient = () => {
  const client = new tmi.Client({
    channels: ["brunispet", "emanuwlly"],
  });

  client
    .connect()
    .catch((err) => console.error("Error al conectar con Twitch:", err));

  return client;
};

export default CreateTwitchClient;
