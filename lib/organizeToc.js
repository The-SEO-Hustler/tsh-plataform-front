const organizeToc = (tocArray) => {
  const result = [];
  let currentH2 = null;

  tocArray.forEach(({ id, title, tag }) => {
    if (tag === "h2") {
      currentH2 = { id, title, children: [], tag: tag };
      result.push(currentH2);
    } else if (tag === "h3" && currentH2) {
      currentH2.children.push({ id, title, tag });
    } else if (tag === "h3" && !currentH2) {
      result.push({ id, title, children: [], tag: tag });
    }
  });
  // console.log("results", result);

  return result;
};
export default organizeToc;
