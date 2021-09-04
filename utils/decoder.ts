

export function decodeTokenURI(data: string){
  const newJson = Buffer.from(data.substring(29), "base64").toString();
  return JSON.parse(newJson);
}
