const cleanString = (str) => {
  return str ? str.replace(/\s+/g, " ").trim() : null;
};
export default cleanString;
