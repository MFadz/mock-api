// File: /src/controllers/registerRoutes.js
import redisClient from "../redis.config.js";

export async function registerMockRoutes(app) {
  try {
    const keys = await redisClient.keys("config_*");

    for (const key of keys) {
      const configStr = await redisClient.get(key);
      const config = JSON.parse(configStr);

      const method = config.method?.toLowerCase();
      const route = config.url;
      const reqMap = config.reqparam_map || {};
      const fixedParams = config.fixed_param || {};
      const resMap = config.resparam_map || {};

      if (!method || !route) continue;

      app[method](route, (req, res) => {
        const reqBody = req.body;
        const finalPayload = {};

        for (const [toKey, fromKey] of Object.entries(reqMap)) {
          finalPayload[toKey] = reqBody[fromKey];
        }

        for (const [k, v] of Object.entries(fixedParams)) {
          finalPayload[k] = v;
        }

        let response = {};
        const ic = finalPayload.ic;
        const icPattern = /^\d{6}-\d{2}-\d{4}$/;

        if (!ic) {
          response[resMap.status || "status"] = "failed";
        } else if (!icPattern.test(ic)) {
          response[resMap.status || "status"] = "invalid";
        } else if (ic === "000000-00-0000") {
          response[resMap.status || "status"] = "valid";
        } else {
          response[resMap.status || "status"] = "valid";
        }

        return res.json(response);
      });

      console.log(`✅ [${method.toUpperCase()}] Route loaded: ${route}`);
    }
  } catch (err) {
    console.error("❌ Redis error:", err);
  }
}
