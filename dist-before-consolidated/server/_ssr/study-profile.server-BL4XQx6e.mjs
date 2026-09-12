import { k as createSsrRpc } from "./router-BiedwaEF.mjs";
import { c as createServerFn } from "./server-DwUI_Cux.mjs";
import { o as objectType, n as numberType, b as booleanType, s as stringType } from "../_libs/zod.mjs";
const activitySchema = objectType({
  eventId: stringType().uuid(),
  correct: booleanType(),
  corrected: booleanType()
}).strict();
const goalSchema = objectType({
  dailyGoal: numberType().int().min(1).max(40)
}).strict();
const getStudyProfileServerFn = createServerFn({
  method: "GET"
}).handler(createSsrRpc("90b59c6bd92c28e4b6063b4ca823be7c46c8198f8e5fa1eebf69021826fbc452"));
const updateDailyGoalServerFn = createServerFn({
  method: "POST"
}).validator((input) => goalSchema.parse(input)).handler(createSsrRpc("7645c34232cca93b40eec405566a5f48e3b921bca38cdc6495231e1819de46f7"));
const recordStudyActivityServerFn = createServerFn({
  method: "POST"
}).validator((input) => activitySchema.parse(input)).handler(createSsrRpc("26c8a62cc85b683df6a59458a67577251aff47955ade0210cc845d54889aeecc"));
export {
  getStudyProfileServerFn as g,
  recordStudyActivityServerFn as r,
  updateDailyGoalServerFn as u
};
