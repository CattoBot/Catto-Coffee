const client = require("../index");


client.on("ready", async () => {
  client.user.setPresence({
    status: "idle",
  });

  console.log(
    "\x1b[34m\x1b[1m\x1b[4mBot en línea como " + client.user.tag + " ✔️\x1b[0m"
  );

});
