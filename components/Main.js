import * as views from "./views";

export default st => {
  console.log(st);
  return `
${views[st.view](st)}
`;
};
