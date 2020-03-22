import * as Views from "./views";

export default st => {
  console.log(st);
  return `
${Views[st.view](st)}
`;
};
