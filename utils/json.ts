export function prepareJson(json: any) {
  return JSON.parse(JSON.stringify(json));
}
