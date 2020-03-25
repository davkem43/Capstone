//import * as components from "./components"
import { Nav, Banner, Main, Footer } from "./components";
console.log("step1");

import * as state from "./store";
console.log("step2");
console.log(state);

import Navigo from "navigo";
import { capitalize } from "lodash";

import axios from "axios";
console.log("step3");

axios
  .get(
    "https://api.openweathermap.org/data/2.5/weather?q=affton&APPID=c9e76aa5f26df1294bf206610a0c0b46"
  )
  .then(response => {
    state.Home.city = response.data.name;
    state.Home.temp = response.data.main.temp;
    state.Home.condition = response.data.main;
    console.log(state.Home.temp - 273.15);
  });

import "./env";
// axios
//   .get(`https://api.github.com/users/${process.env.davkem43}/repos`, {
//     headers: {
//       Authorization: `token ${process.env.GITHUB_TOKEN}`
//     }
//   })
//   .then(response => console.log(response.data));

const router = new Navigo(window.location.origin);
console.log("step4");
router.on({
  "/": () => render(state.Home),
  ":page": params => {
    let page = capitalize(params.page);
    render(state[page]);
  }
});

function render() {
  document.querySelector(".root").innerHTML = `
  ${Nav()}
  ${Banner()}
  ${Main(state.Home)}
  ${Footer()}
`;
}

//console.log("step5");
//Call function
render(state);
//console.log("rendered");
addNavEventListeners();
//console.log("step6");
function addNavEventListeners() {
  document.querySelectorAll("nav a").forEach(navLink =>
    navLink.addEventListener("click", event => {
      event.preventDefault();
      render(state[event.target.title]);
      router.updatePageLinks();
    })
  );
}
console.log("step7");
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

const charityCount = state.Charities.length;
document.getElementById("numchar").textContent = `Charities: ${charityCount}`;
console.log(`# of Charities ${charityCount}`);

const pledgeCount = state.Pledges.length;
document.getElementById("numdollars").textContent = `Pledges: ${pledgeCount}`;
console.log(`# of Pledges ${pledgeCount}`);

const sumPledges = state.Pledges;
console.log(sumPledges);

const memberCount = state.Members.length;
document.getElementById("nummembers").textContent = `Members: ${memberCount}`;
console.log(`# of Members ${memberCount}`);
