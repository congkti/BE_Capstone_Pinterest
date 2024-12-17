import { removeVietnameseTones } from "./vietnamese-tones.util.js";

const createUrlPart = (name) => {
  const urlName = removeVietnameseTones(name)
    ?.trim()
    ?.toLowerCase()
    ?.split(" ")
    .join("-");
  // ?.replaceAll(" ", "-"); // replaceAll = split+join. Used in ES 2021+, not support with IE

  return urlName ? urlName : "";
};

export default createUrlPart;
