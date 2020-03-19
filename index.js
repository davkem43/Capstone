//import * as components from "./components"
import { Nav, Banner, Search, Section3, Section4, Footer } from "./components";

import { Pledge, Login, Register } from "./components/views";

//create a function to render the page
function render() {
  document.querySelector(".root").innerHTML = `
${Nav()}
${Banner()}
${Search()}
${Section3()}
${Section4()}
${Footer()}
`;
}

//Invoke the function
render();

// add menu toggle to hamburger icon in nav bar
document.querySelector(".fa-bars").addEventListener("click", () => {
  document.querySelector("nav > ul").classList.toggle("hidden--mobile");
});

document.getElementById("pledge").addEventListener("click", () => {
  console.log("tried to open pledge form");
  console.log("button pressed");
});

document.getElementById("peer").addEventListener("click", () => {
  console.log("tried to open peer list");
  console.log("button pressed");
});

document.getElementById("charity").addEventListener("click", () => {
  console.log("tried to open charity search results");
  console.log("button pressed");
});
