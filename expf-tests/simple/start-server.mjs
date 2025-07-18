import { pathToFileURL } from "url";

export default async function (label) {
  let lib;
  if (label === "candidate") {
    lib = await import(pathToFileURL("/app/index.js").href);
  } else if (label === "latest") {
    lib = await import("express");
  } else {
    throw new Error(`Unknown label: ${label}`);
  }

  const app = lib();
  const port = 3000;

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  await new Promise((resolve) => app.listen(port, resolve));
  const url = "http://localhost:" + port;
  console.log(`Server is running at ${url}`);

  return { url, server };
}
