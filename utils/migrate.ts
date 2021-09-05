import {ages, governments, morales, realms, resources, sizes, spirits} from "constants/traits";
import {Contract} from "@ethersproject/contracts";


export async function buildMigrationPayload(tokenId: string, legacyContract: Contract){

  const tokenURI = await legacyContract.tokenURI(tokenId);

  const json = Buffer.from(tokenURI.substring(29), "base64").toString();
  const result = JSON.parse(json);

  const size = sizes.indexOf(result.attributes[0].value);
  const spirit = spirits.indexOf(result.attributes[1].value);
  const age = ages.indexOf(result.attributes[2].value);
  const resource = resources.indexOf(result.attributes[3].value);
  const morale = morales.indexOf(result.attributes[4].value);
  const government = governments.indexOf(result.attributes[5].value);
  const turns = realms.indexOf(result.attributes[6].value);

  return {
    size,
    spirit,
    age,
    resource,
    morale,
    government,
    turns
  }
}
