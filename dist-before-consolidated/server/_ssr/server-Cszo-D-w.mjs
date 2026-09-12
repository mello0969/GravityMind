import { c as createServerRpc, b as cadastrarUsuario, d as entrarUsuario, s as sairUsuario, f as consultarUsuarioAtual } from "./session.server-DL0xVT0X.mjs";
import { c as createServerFn } from "./server-DwUI_Cux.mjs";
import { c as cadastroSchema, l as loginSchema } from "./schemas-Dga4YmnR.mjs";

import "../_libs/seroval.mjs";
import "../_libs/react.mjs";

import "../_libs/h3-v2.mjs";
import "../_libs/unenv.mjs";


import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";





import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";

import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "../_libs/isbot.mjs";
import "../_libs/zod.mjs";
const cadastrarServerFn_createServerFn_handler = createServerRpc({
  id: "a93c7d29dc73b777b0f0ea26ab5e37520976feae5ad4155eb490f502cfdf9929",
  name: "cadastrarServerFn",
  filename: "src/lib/auth/server.ts"
}, (opts) => cadastrarServerFn.__executeServer(opts));
const cadastrarServerFn = createServerFn({
  method: "POST"
}).validator((input) => cadastroSchema.parse(input)).handler(cadastrarServerFn_createServerFn_handler, async ({
  data
}) => cadastrarUsuario(data));
const entrarServerFn_createServerFn_handler = createServerRpc({
  id: "a2a7e09df68aa418c09c5c47b442b3c43a8053e189d416aa45576dac89578b26",
  name: "entrarServerFn",
  filename: "src/lib/auth/server.ts"
}, (opts) => entrarServerFn.__executeServer(opts));
const entrarServerFn = createServerFn({
  method: "POST"
}).validator((input) => loginSchema.parse(input)).handler(entrarServerFn_createServerFn_handler, async ({
  data
}) => entrarUsuario(data));
const sairServerFn_createServerFn_handler = createServerRpc({
  id: "401636db0da1d1ecefedee10ff54763b1d7d2df898f1ccd84fd75e96ada87c80",
  name: "sairServerFn",
  filename: "src/lib/auth/server.ts"
}, (opts) => sairServerFn.__executeServer(opts));
const sairServerFn = createServerFn({
  method: "POST"
}).handler(sairServerFn_createServerFn_handler, sairUsuario);
const usuarioAtualServerFn_createServerFn_handler = createServerRpc({
  id: "6ae29343e7713fd303a6449ca2798cb3ea2a9cfe734a51dc0a2706bdc8a32083",
  name: "usuarioAtualServerFn",
  filename: "src/lib/auth/server.ts"
}, (opts) => usuarioAtualServerFn.__executeServer(opts));
const usuarioAtualServerFn = createServerFn({
  method: "GET"
}).handler(usuarioAtualServerFn_createServerFn_handler, consultarUsuarioAtual);
export {
  cadastrarServerFn_createServerFn_handler,
  entrarServerFn_createServerFn_handler,
  sairServerFn_createServerFn_handler,
  usuarioAtualServerFn_createServerFn_handler
};
