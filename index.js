//import * as components from "./components"
import { Nav, Banner, Main, Footer } from "./components";
import * as state from "./store";

import Navigo from "navigo";
import { capitalize } from "lodash";
import axios from "axios";

import "./env";
import { auth, db } from "./firebase";

// ROUTER //
const router = new Navigo(window.location.origin);
router
  .on({
    ":page": params => render(state[capitalize(params.page)]),
    "/": () => render(state.Home)
  })
  .resolve();
router.updatePageLinks();

// API to get weather
axios
  .get(
    "https://api.openweathermap.org/data/2.5/weather?q=affton&APPID=c9e76aa5f26df1294bf206610a0c0b46"
  )
  .then(response => {
    state.Home.city = response.data.name;
    state.Home.temp = response.data.main.temp;
    state.Home.weather.description = response.data.main;
    console.log(state.Home.temp - 273.15);
  });

//API for Charity search

//Function to render State
export function render(st = state.Home) {
  document.querySelector(".root").innerHTML = `
    ${Nav()}
    ${Banner()}
    ${Main(st)}
    ${Footer()}
  `;

  addNavEventListeners();
  addLoginListener(st);
  addRegisterListener(st);
  addToggleEventListeners();
  router.updatePageLinks;
  addPledgeNowListener(st);
  addCancelButtonListener(st);
}

// Fix this...add menu toggle to hamburger icon in nav bar
document
  .querySelector(".fa-bars")
  .addEventListener("click", () =>
    document.querySelector("nav > ul").classList.toggle("hidden--mobile")
  );

//Render the Navigation links
function addNavEventListeners() {
  document.querySelectorAll("nav a").forEach(navLink =>
    navLink.addEventListener("click", event => {
      event.preventDefault();
      render(state[event.target.text]);
      router.updatePageLinks();
    })
  );
}

function addToggleEventListeners() {
  document
    .querySelector(".fa-bars")
    .addEventListener("click", () =>
      document.querySelector("nav > ul").classList.toggle("hidden--mobile")
    );
}

//Listen for and process Registrations
function addRegisterListener(st) {
  if (st.view === "Register") {
    document
      .getElementById("Register-form")
      .addEventListener("submit", event => {
        event.preventDefault();
        let userData = Array.from(event.target.elements);
        console.log(event.target.elements);
        //
        const inputs = userData.map(input => input.value);
        let firstName = inputs[0];
        let lastName = inputs[1];
        let email = inputs[2];
        let password = inputs[3];
        //
        //create user in Firebase db
        auth.createUserWithEmailAndPassword(email, password).then(response => {
          console.log("user registered");
          addUserToStateAndDb(firstName, lastName, email, password);
          render(state.Home);
        });
      });
  }
}

// Add user to State and Firebase
function addUserToStateAndDb(first, last, email, pass) {
  state.User.userName = first + last;
  state.User.firstName = first;
  state.User.lastName = last;
  state.User.email = email;
  state.User.signedIn = true;

  db.collection("users").add({
    firstname: first,
    lastname: last,
    email: email,
    password: pass,
    signedIn: true
  });
}

// Listen for and process Login events
function addLoginListener(st) {
  console.log(st.view);
  if (st.view === "Login") {
    document.getElementById("Login-form").addEventListener("submit", event => {
      event.preventDefault();
      let userInfo = Array.from(event.target.elements);
      const inputs = userInfo.map(input => input.value);
      let email = inputs[0];
      let password = inputs[1];
      auth.signInWithEmailAndPassword(email, password).then(() => {
        console.log("user signed in");
        getUserInfoFromDb(email).then(() => render(state.Home));
      });
    });
  }
}

//Function pull user info from db on Login
function getUserInfoFromDb(email) {
  return db
    .collection("users")
    .get()
    .then(snapshot =>
      snapshot.docs.forEach(doc => {
        if (email === doc.data().email) {
          let id = doc.id;
          db.collection("users")
            .doc(id)
            .update({ signedin: true });
          console.log("signed in db");
          let user = doc.data();
          state.User.userName = user.firstname + user.lastname;
          state.User.firstName = user.firstname;
          state.User.lastName = user.lastname;
          state.User.email = email;
          state.User.signedIn = true;
          console.log(state.User);
        }
      })
    );
}

// Add listener for Cancel buttons to return home
function addCancelButtonListener(st) {
  if (state.view !== "Home") {
    document.getElementById("cancel").addEventListener("click", event => {
      event.preventDefault();
      console.log("cancel pressed, returning home");
      render(state.Home);
    });
  }
}

// Add listener for Pledge button
function addPledgeNowListener(st) {
  if (state.view === "Home") {
    document.getElementById("pledge").addEventListener("click", event => {
      event.preventDefault();
      console.log("Pledge Now pressed");
      // let searchData = Array.from(event.target.elements);
      // const searchInputs = searchData.map(input => input.value);
      // let peer = searchInputs[0];
      // let charity = searchInputs[4];
      // let email = state.User.email;
      // render(state.Pledge);
      // addPledgeSubmitListener(st);
    });
  }
}

// Pull values for peer and charity into Pledge form
function addPledgeSubmitListener(st) {
  if (st.view === "Pledge") {
    document.getElementById("Pledge-form").addEventListener("submit", event => {
      event.preventDefault();
      // let pledgeData = Array.from(event.target.elements);
      // const inputs = pledgeData.map(input => input.value);
      // let peer = inputs[0];
      // let charity = inputs[1];
      // let email = inputs[2];
      // let password = inputs[3];
      // let amount = inputs[4];
    });
  }
}

//Add listener for peer search button
document.getElementById("peer").addEventListener("click", () => {
  console.log("peer search pressed");
});

//Add listener for peer search button
document.getElementById("charity").addEventListener("click", () => {
  console.log("charity search pressed");
});

const pledgeCount = state.Pledges.length;
document.getElementById("numdollars").textContent = `Pledges: ${pledgeCount}`;
console.log(`# of Pledges ${pledgeCount}`);

const sumPledges = state.Pledges;
console.log(sumPledges);

const memberCount = state.Members.length;
document.getElementById("nummembers").textContent = `Members: ${memberCount}`;
console.log(`# of Members ${memberCount}`);
