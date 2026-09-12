globalThis.__nitro_main__ = import.meta.url;
import "./_libs/unenv.mjs";

import { H as HTTPError, d as defineLazyEventHandler, a as H3Core } from "./_libs/h3.mjs";
import { H as HookableCore } from "./_libs/hookable.mjs";

import { c as FastResponse } from "./_libs/srvx.mjs";


import "./_libs/rou3.mjs";





function lazyService(loader) {
  let promise, mod;
  return {
    fetch(req) {
      if (mod) {
        return mod.fetch(req);
      }
      if (!promise) {
        promise = loader().then((_mod) => mod = _mod.default || _mod);
      }
      return promise.then((mod2) => mod2.fetch(req));
    }
  };
}
const services = {
  ["ssr"]: lazyService(() => import("./_ssr/index.mjs"))
};
globalThis.__nitro_vite_envs__ = services;
const assets = {
  "/favicon.svg": {
    "type": "image/svg+xml",
    "etag": '"109-h1Q2zftjkj4IUGXgye+ynREltww"',
    "mtime": "2026-09-11T05:29:25.872Z",
    "size": 265,
    "path": "../client/favicon.svg"
  },
  "/assets/anotacoes-BiPn3StA.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1f72-rnW7VPbJ7RZHjj/or4WzPDjkpwk"',
    "mtime": "2026-09-11T19:28:40.128Z",
    "size": 8050,
    "path": "../client/assets/anotacoes-BiPn3StA.js"
  },
  "/assets/arrow-right-D0s5vav-.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"a6-8BaC1SWtIfjYTE5u7v0bwZ3/QIU"',
    "mtime": "2026-09-11T19:28:40.130Z",
    "size": 166,
    "path": "../client/assets/arrow-right-D0s5vav-.js"
  },
  "/assets/cadastro-lIahGK31.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"151c-r4YjuCsXds1GcbbD8+FBlJdD+BY"',
    "mtime": "2026-09-11T19:28:40.128Z",
    "size": 5404,
    "path": "../client/assets/cadastro-lIahGK31.js"
  },
  "/assets/calculation-card-DwuskDgV.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1250-w7uvRk/+WXg0M9yk804zWP1wskY"',
    "mtime": "2026-09-11T19:28:40.129Z",
    "size": 4688,
    "path": "../client/assets/calculation-card-DwuskDgV.js"
  },
  "/assets/calculo-DWdSxxVh.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"17ff-SKdJBEnAe/YFfkuJcitUZdX0JS4"',
    "mtime": "2026-09-11T19:28:40.129Z",
    "size": 6143,
    "path": "../client/assets/calculo-DWdSxxVh.js"
  },
  "/assets/configuracoes-BHMRNWLc.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"2f09-DQsKD6bQ4yVd2ViKFdhIRsVRGs4"',
    "mtime": "2026-09-11T19:28:40.129Z",
    "size": 12041,
    "path": "../client/assets/configuracoes-BHMRNWLc.js"
  },
  "/assets/checkbox-Wf8g07qx.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1166-/f+vDYex+UEKWrkq9gv8bAW3cYw"',
    "mtime": "2026-09-11T19:28:40.129Z",
    "size": 4454,
    "path": "../client/assets/checkbox-Wf8g07qx.js"
  },
  "/assets/contato-BZIkfIm4.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"903-YnbPonekDgi4y/Ix4WKhKjh+Qdk"',
    "mtime": "2026-09-11T19:28:40.129Z",
    "size": 2307,
    "path": "../client/assets/contato-BZIkfIm4.js"
  },
  "/assets/dashboard-QOx8MAmy.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"2271-vhctmcF0UBus0xs0QBQiV4paQL4"',
    "mtime": "2026-09-11T19:28:40.129Z",
    "size": 8817,
    "path": "../client/assets/dashboard-QOx8MAmy.js"
  },
  "/assets/engine-calculo-BRDpoIae.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"710-Hkft2n3KTSbmGLTUFLcf9nTjeMM"',
    "mtime": "2026-09-11T19:28:40.129Z",
    "size": 1808,
    "path": "../client/assets/engine-calculo-BRDpoIae.js"
  },
  "/assets/file-text-DpEk6v_s.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"182-vUSbNpaqXVpEK1iIHOQxxnQ6REI"',
    "mtime": "2026-09-11T19:28:40.129Z",
    "size": 386,
    "path": "../client/assets/file-text-DpEk6v_s.js"
  },
  "/assets/flashcards-xVsuJmop.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"3655-EQ7wtViAkJHFbArxRP4UK6nHap0"',
    "mtime": "2026-09-11T19:28:40.129Z",
    "size": 13909,
    "path": "../client/assets/flashcards-xVsuJmop.js"
  },
  "/assets/index-DdeGQb_v.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"aca-AATDyxgt7MfqmG54igddv+t4f68"',
    "mtime": "2026-09-11T19:28:40.129Z",
    "size": 2762,
    "path": "../client/assets/index-DdeGQb_v.js"
  },
  "/assets/lei-1-CUO_I0Lp.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"9ca-zJxzByCAe2w5JXWKwhLAziXAhM0"',
    "mtime": "2026-09-11T19:28:40.129Z",
    "size": 2506,
    "path": "../client/assets/lei-1-CUO_I0Lp.js"
  },
  "/assets/index-Ck-xX6e-.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1307c-pBvZhQa/qPnFHGnRMyR+l6MHGYk"',
    "mtime": "2026-09-11T19:28:40.127Z",
    "size": 77948,
    "path": "../client/assets/index-Ck-xX6e-.js"
  },
  "/assets/lei-2-DreWxAAV.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"7e3-oUHCxm/La9ynSFkrIPUoCqq4r0k"',
    "mtime": "2026-09-11T19:28:40.129Z",
    "size": 2019,
    "path": "../client/assets/lei-2-DreWxAAV.js"
  },
  "/assets/lei-3-FkecxaE9.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"7b7-MS7uAdHd7gFfQfVEP70IPkCAHoA"',
    "mtime": "2026-09-11T19:28:40.129Z",
    "size": 1975,
    "path": "../client/assets/lei-3-FkecxaE9.js"
  },
  "/assets/lightbulb-qvAK2Lo_.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"11a-YgrmYj2UybeuVpOePYx0TFLFn7k"',
    "mtime": "2026-09-11T19:28:40.129Z",
    "size": 282,
    "path": "../client/assets/lightbulb-qvAK2Lo_.js"
  },
  "/assets/login-BwNzJQv_.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1000-aFMsjemFKtbKD37tXuSA6JcU8TI"',
    "mtime": "2026-09-11T19:28:40.129Z",
    "size": 4096,
    "path": "../client/assets/login-BwNzJQv_.js"
  },
  "/assets/newton-lesson-BFMIrwxR.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"9811-iGULzABzfeaulry2cRW8pLgzO48"',
    "mtime": "2026-09-11T19:28:40.129Z",
    "size": 38929,
    "path": "../client/assets/newton-lesson-BFMIrwxR.js"
  },
  "/assets/minus-DUH_JzA7.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"76-CKk5CmzA/WIa/qqoWN2+tVg0MFo"',
    "mtime": "2026-09-11T19:28:40.129Z",
    "size": 118,
    "path": "../client/assets/minus-DUH_JzA7.js"
  },
  "/assets/plus-CEr88EM8.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"2b2e-wkfrHiv5k650UHDlzEIPPowev20"',
    "mtime": "2026-09-11T19:28:40.129Z",
    "size": 11054,
    "path": "../client/assets/plus-CEr88EM8.js"
  },
  "/assets/apple-hero-scene-_-f9FRp5.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"855c8-cmURp5fVgzlvlW2/WxltNr8hg/A"',
    "mtime": "2026-09-11T19:28:40.130Z",
    "size": 546248,
    "path": "../client/assets/apple-hero-scene-_-f9FRp5.js"
  },
  "/assets/index-BXL1TCex.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"9d6ed-odlR0ok1R2902+CZOiwjcJFTTl8"',
    "mtime": "2026-09-11T19:28:40.129Z",
    "size": 644845,
    "path": "../client/assets/index-BXL1TCex.js"
  },
  "/assets/plus-R5ums3C1.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"9a-qmg0WUdeVWqpD+genax9vFGygn4"',
    "mtime": "2026-09-11T19:28:40.129Z",
    "size": 154,
    "path": "../client/assets/plus-R5ums3C1.js"
  },
  "/assets/privacidade-BnXCaCFR.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"b0c-Ev9sCQOsUVmeDabGAX01tkblKCY"',
    "mtime": "2026-09-11T19:28:40.129Z",
    "size": 2828,
    "path": "../client/assets/privacidade-BnXCaCFR.js"
  },
  "/assets/quadro-BoTNWBnx.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"5a1-YgG/adVF+hCG7BA1MFrWeoRUr1k"',
    "mtime": "2026-09-11T19:28:40.129Z",
    "size": 1441,
    "path": "../client/assets/quadro-BoTNWBnx.js"
  },
  "/assets/sobre-JCUDR2jd.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"e1d-yZJtU7GJJZeZH9xmNxvCKCP8KPQ"',
    "mtime": "2026-09-11T19:28:40.129Z",
    "size": 3613,
    "path": "../client/assets/sobre-JCUDR2jd.js"
  },
  "/assets/questoes-Cf465HDG.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"c2e1-eTcW3db47Y2lA3kD3QOPMXId7YA"',
    "mtime": "2026-09-11T19:28:40.129Z",
    "size": 49889,
    "path": "../client/assets/questoes-Cf465HDG.js"
  },
  "/assets/square-BESxZ31i.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"94-RFW6NDsPpmiu7soSAQhGFheu2VE"',
    "mtime": "2026-09-11T19:28:40.129Z",
    "size": 148,
    "path": "../client/assets/square-BESxZ31i.js"
  },
  "/assets/study-profile.server-DVtKnJy8.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"17e-4ZaG3wyqMx/jvPSYPtH5ghoKY5I"',
    "mtime": "2026-09-11T19:28:40.129Z",
    "size": 382,
    "path": "../client/assets/study-profile.server-DVtKnJy8.js"
  },
  "/assets/sync-DY5i-ZUa.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1554-TLTTAEG+RD/1ZkWKfrxk8Ts5B9o"',
    "mtime": "2026-09-11T19:28:40.129Z",
    "size": 5460,
    "path": "../client/assets/sync-DY5i-ZUa.js"
  },
  "/assets/styles-CYejATda.css": {
    "type": "text/css; charset=utf-8",
    "etag": '"dc17-tKH5wTBUWRDgajbzQKS9Mh0bITc"',
    "mtime": "2026-09-11T19:28:40.128Z",
    "size": 56343,
    "path": "../client/assets/styles-CYejATda.css"
  },
  "/assets/trash-2-CdUTZD1E.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"149-wOcawGNl399/97MvnEDLdTDEwfk"',
    "mtime": "2026-09-11T19:28:40.129Z",
    "size": 329,
    "path": "../client/assets/trash-2-CdUTZD1E.js"
  },
  "/assets/termos-DmbaGehY.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"8fd-QhuIStSgyH5YW1Yv1k4eMxftsdE"',
    "mtime": "2026-09-11T19:28:40.129Z",
    "size": 2301,
    "path": "../client/assets/termos-DmbaGehY.js"
  },
  "/assets/tutor-yGehOmVq.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"2938-f2Z9r2DEKC4p/NgLFOX0OlaVCgo"',
    "mtime": "2026-09-11T19:28:40.129Z",
    "size": 10552,
    "path": "../client/assets/tutor-yGehOmVq.js"
  },
  "/assets/use-study-profile-Bpz_6_35.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"b5e-LBkQhJjZkVQSQElc3Bj2MGxOxEE"',
    "mtime": "2026-09-11T19:28:40.129Z",
    "size": 2910,
    "path": "../client/assets/use-study-profile-Bpz_6_35.js"
  },
  "/assets/utils-CoH5crpE.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"8d2c-wbpaNIcCLz3UwuF6j7bomN2a47s"',
    "mtime": "2026-09-11T19:28:40.129Z",
    "size": 36140,
    "path": "../client/assets/utils-CoH5crpE.js"
  },
  "/assets/whiteboard-CZbI1lAa.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"8293-kiBXUyDKzad+cQ9sdkgNRHTtuHA"',
    "mtime": "2026-09-11T19:28:40.129Z",
    "size": 33427,
    "path": "../client/assets/whiteboard-CZbI1lAa.js"
  },
  "/assets/apple/skin-albedo.webp": {
    "type": "image/webp",
    "etag": '"773a-KwnLoPxuTCad28PVP22tZdPlWls"',
    "mtime": "2026-09-11T14:15:29.196Z",
    "size": 30522,
    "path": "../client/assets/apple/skin-albedo.webp"
  },
  "/assets/apple/skin-normal.webp": {
    "type": "image/webp",
    "etag": '"2de0a-iUeMc03bzDc8ggMojl6bwoWkXjY"',
    "mtime": "2026-09-11T13:42:55.767Z",
    "size": 187914,
    "path": "../client/assets/apple/skin-normal.webp"
  },
  "/assets/apple/skin-projection-roughness.webp": {
    "type": "image/webp",
    "etag": '"16f7a-hOdT0gs3IjIad1HqrxcMZ2b+NyI"',
    "mtime": "2026-09-11T14:17:34.549Z",
    "size": 94074,
    "path": "../client/assets/apple/skin-projection-roughness.webp"
  },
  "/assets/apple/skin-projection-normal.webp": {
    "type": "image/webp",
    "etag": '"2dc3c-/ce5aJJbscXlyn9Gq1tOBfHLwhY"',
    "mtime": "2026-09-11T14:17:34.570Z",
    "size": 187452,
    "path": "../client/assets/apple/skin-projection-normal.webp"
  },
  "/assets/apple/skin-projection-albedo.webp": {
    "type": "image/webp",
    "etag": '"283be-wGQdcaucW7HMNEPe8jGYin1sQ6Y"',
    "mtime": "2026-09-11T14:17:34.562Z",
    "size": 164798,
    "path": "../client/assets/apple/skin-projection-albedo.webp"
  },
  "/assets/apple/skin-roughness.webp": {
    "type": "image/webp",
    "etag": '"14e04-0+lPdG0c9CGlCNsaYRGgIuQ4iyc"',
    "mtime": "2026-09-11T13:42:55.748Z",
    "size": 85508,
    "path": "../client/assets/apple/skin-roughness.webp"
  }
};
const publicAssetBases = {};
function isPublicAssetURL(id = "") {
  if (assets[id]) {
    return true;
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) {
      return true;
    }
  }
  return false;
}
const errorHandler$1 = (error, event) => {
  const res = defaultHandler(error, event);
  return new FastResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
  const unhandled = error.unhandled ?? !HTTPError.isError(error);
  const { status = 500, statusText = "" } = unhandled ? {} : error;
  if (status === 404) {
    const url = event.url || new URL(event.req.url);
    const baseURL = "/";
    if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) {
      return {
        status: 302,
        headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
      };
    }
  }
  const headers2 = new Headers(unhandled ? {} : error.headers);
  headers2.set("content-type", "application/json; charset=utf-8");
  const jsonBody = unhandled ? {
    status,
    unhandled: true
  } : typeof error.toJSON === "function" ? error.toJSON() : {
    status,
    statusText,
    message: error.message
  };
  return {
    status,
    statusText,
    headers: headers2,
    body: {
      error: true,
      ...jsonBody
    }
  };
}
const errorHandlers = [errorHandler$1];
async function errorHandler(error, event) {
  for (const handler of errorHandlers) {
    try {
      const response = await handler(error, event, { defaultHandler });
      if (response) {
        return response;
      }
    } catch (error2) {
      console.error(error2);
    }
  }
}
const headers = ((m) => function headersRouteRule(event) {
  for (const [key, value] of Object.entries(m.options || {})) {
    event.res.headers.set(key, value);
  }
});
const findRouteRules = /* @__PURE__ */ (() => {
  const $0 = [{ name: "headers", route: "/assets/**", handler: headers, options: { "cache-control": "public, max-age=31536000, immutable" } }];
  return (m, p) => {
    let r = [];
    if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
    let s = p.split("/"), l = s.length;
    if (l > 1) {
      if (s[1] === "assets") {
        r.unshift({ data: $0, params: { "_": s.slice(2).join("/") } });
      }
    }
    return r;
  };
})();
const _lazy_3Mx1qL = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
const findRoute = /* @__PURE__ */ (() => {
  const data = { route: "/**", handler: _lazy_3Mx1qL };
  return ((_m, p) => {
    return { data, params: { "_": p.slice(1) } };
  });
})();
const APP_ID = "default";
function useNitroApp() {
  let instance = useNitroApp._instance;
  if (instance) {
    return instance;
  }
  instance = useNitroApp._instance = createNitroApp();
  globalThis.__nitro__ = globalThis.__nitro__ || {};
  globalThis.__nitro__[APP_ID] = instance;
  return instance;
}
function useNitroHooks() {
  const nitroApp = useNitroApp();
  const hooks = nitroApp.hooks;
  if (hooks) {
    return hooks;
  }
  return nitroApp.hooks = new HookableCore();
}
function createNitroApp() {
  const hooks = void 0;
  const captureError = (error, errorCtx) => {
    if (errorCtx?.event) {
      const errors = errorCtx.event.req.context?.nitro?.errors;
      if (errors) {
        errors.push({
          error,
          context: errorCtx
        });
      }
    }
  };
  const h3App = createH3App({ onError(error, event) {
    return errorHandler(error, event);
  } });
  let appHandler = (req) => {
    req.context ||= {};
    req.context.nitro = req.context.nitro || { errors: [] };
    return h3App.fetch(req);
  };
  const app = {
    fetch: appHandler,
    h3: h3App,
    hooks,
    captureError
  };
  return app;
}
function createH3App(config) {
  const h3App = new H3Core(config);
  h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
  {
    h3App["~getMiddleware"] = (event, route) => {
      const pathname = event.url.pathname;
      const method = event.req.method;
      const middleware = [];
      {
        const routeRules = getRouteRules(method, pathname);
        event.context.routeRules = routeRules?.routeRules;
        if (routeRules?.routeRuleMiddleware.length) {
          middleware.push(...routeRules.routeRuleMiddleware);
        }
      }
      if (route?.data?.middleware?.length) {
        middleware.push(...route.data.middleware);
      }
      return middleware;
    };
  }
  return h3App;
}
function getRouteRules(method, pathname) {
  const m = findRouteRules(method, pathname);
  if (!m?.length) {
    return { routeRuleMiddleware: [] };
  }
  const routeRules = {};
  for (const layer of m) {
    for (const rule of layer.data) {
      const currentRule = routeRules[rule.name];
      if (currentRule) {
        if (rule.options === false) {
          delete routeRules[rule.name];
          continue;
        }
        if (typeof currentRule.options === "object" && typeof rule.options === "object") {
          currentRule.options = {
            ...currentRule.options,
            ...rule.options
          };
        } else {
          currentRule.options = rule.options;
        }
        currentRule.route = rule.route;
        currentRule.params = {
          ...currentRule.params,
          ...layer.params
        };
      } else if (rule.options !== false) {
        routeRules[rule.name] = {
          ...rule,
          params: layer.params
        };
      }
    }
  }
  const middleware = [];
  const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
  for (const rule of orderedRules) {
    if (rule.options === false || !rule.handler) {
      continue;
    }
    middleware.push(rule.handler(rule));
  }
  return {
    routeRules,
    routeRuleMiddleware: middleware
  };
}
function createHandler(hooks) {
  const nitroApp = useNitroApp();
  const nitroHooks = useNitroHooks();
  return {
    async fetch(request, env, context) {
      globalThis.__env__ = env;
      augmentReq(request, {
        env,
        context
      });
      const ctxExt = {};
      const url = new URL(request.url);
      if (hooks.fetch) {
        const res = await hooks.fetch(request, env, context, url, ctxExt);
        if (res) {
          return res;
        }
      }
      return await nitroApp.fetch(request);
    },
    scheduled(controller, env, context) {
      globalThis.__env__ = env;
      context.waitUntil(nitroHooks.callHook("cloudflare:scheduled", {
        controller,
        env,
        context
      }) || Promise.resolve());
    },
    email(message, env, context) {
      globalThis.__env__ = env;
      context.waitUntil(nitroHooks.callHook("cloudflare:email", {
        message,
        event: message,
        env,
        context
      }) || Promise.resolve());
    },
    queue(batch, env, context) {
      globalThis.__env__ = env;
      context.waitUntil(nitroHooks.callHook("cloudflare:queue", {
        batch,
        event: batch,
        env,
        context
      }) || Promise.resolve());
    },
    tail(traces, env, context) {
      globalThis.__env__ = env;
      context.waitUntil(nitroHooks.callHook("cloudflare:tail", {
        traces,
        env,
        context
      }) || Promise.resolve());
    },
    trace(traces, env, context) {
      globalThis.__env__ = env;
      context.waitUntil(nitroHooks.callHook("cloudflare:trace", {
        traces,
        env,
        context
      }) || Promise.resolve());
    }
  };
}
function augmentReq(cfReq, ctx) {
  const req = cfReq;
  req.ip = cfReq.headers.get("cf-connecting-ip") || void 0;
  req.runtime ??= { name: "cloudflare" };
  req.runtime.cloudflare = {
    ...req.runtime.cloudflare,
    ...ctx
  };
  req.waitUntil = ctx.context?.waitUntil.bind(ctx.context);
}
const cloudflareModule = createHandler({ fetch(cfRequest, env, context, url) {
  if (env.ASSETS && isPublicAssetURL(url.pathname)) {
    return env.ASSETS.fetch(cfRequest);
  }
} });
export {
  cloudflareModule as default
};
