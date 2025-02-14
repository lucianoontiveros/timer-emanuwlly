import tmi from "tmi.js";

const Create_twitch_client = () => {
  const client = new tmi.Client({
    channels: ["emanuwlly"],
  });

  client
    .connect()
    .catch((err) => console.error("Error al conectar con Twitch:", err));

  return client;
};

export default Create_twitch_client;
