import pino from "pino";
import redisClient from "#configs/redis.config";

const logger = pino({
  level: "trace",
  timestamp: pino.stdTimeFunctions.isoTime,
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      timestampKey: "time",
      translateTime: false,
      ignore: "pid,hostname",
    },
  },
});

/**
 * Core logger that writes to console, Redis Stream, and Elasticsearch.
 *
 * @param {Object} options
 * @param {"info"|"warn"|"error"} options.level
 * @param {String} options.source - Origin (e.g., zakatController.create)
 * @param {String} options.message - Log message or object
 * @param {String} [options.username="system"]
 * @param {String} [options.activity_id="-"]
 * @param {String} [options.action="-"]
 * @param {String} [options.status="-"]
 * @param {Object|String|null} [options.data=null]
 * @param {Boolean} [options.persist=true]
 * @param {String} [options.logType="audit"]
 * @param {String} [options.service="psm"]
 * @param {String} [options.function="-"]
 * @param {String} [options.timestamp] - Optional ISO string
 */

const log = async ({
  level = "info",
  source = "unknown",
  message = "",
  username = "system",
  activity_id = "-",
  action = "-",
  status = "-",
  data = null,
  persist = true,
  logType = "audit",
  service = "PSM",
  function: fn = source,
  timestamp = new Date().toISOString(),
}) => {
  // Console log (for dev)
  const consoleMsg = `[${source}] - ${message}`;
  logger[level]?.(consoleMsg);

  if (!persist) return;

  // Build a structured payload that will ALWAYS be valid JSON
  const payload = {
    source,
    message,
    username,
    activity_id,
    action,
    status,
    data, // can be object/string/null – we don't care, whole wrapper is JSON.stringified
  };

  const flatMessage = JSON.stringify(payload);

  const entry = {
    logType,     // e.g. "audit"
    level,       // info / warn / error
    service,     // e.g. "PSM"
    function: fn,
    timestamp,
    message: flatMessage, // <-- always JSON string
  };

  try {
    await redisClient.xAdd("audit-logs-stream", "*", entry);
  } catch (err) {
    logger.error("❌ Failed to write to Redis Stream:", err);
  }
};

export default {
  log,
  info: (props) => log({ ...props, level: "info" }),
  warn: (props) => log({ ...props, level: "warn" }),
  error: (props) => log({ ...props, level: "error" }),
};
