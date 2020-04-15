import { Nav, Banner, Main, Footer } from "./components";
import * as state from "./store";

import Navigo from "navigo";
import { capitalize } from "lodash";
import axios from "axios";

import { auth, db } from "./firebase";

// ROUTER
const router = new Navigo(window.location.origin);

router
  .on({
    ":page": (params) => render(state[capitalize(params.page)]),
    "/": () => render(state.Home),
  })
  .resolve();
router.updatePageLinks();

// API to get weather
axios
  .get(
    "https://api.openweathermap.org/data/2.5/weather?q=affton&APPID=c9e76aa5f26df1294bf206610a0c0b46"
  )
  .then((response) => {
    const farenheit = Math.round((response.data.main.temp - 273.15) * 1.8 + 32);
    state.Home.city = response.data.name;
    state.Home.temp = farenheit;
    state.Home.description = response.data.main;
    //Add temperature display
    let para = document.createElement("p");
    let node = document.createTextNode(`Temp: ${farenheit}F`);
    para.appendChild(node);
    let element = document.getElementById("div2");
    element.appendChild(para);
  });

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
  router.updatePageLinks;
  addPledgeNowListener(st);
  addCancelButtonListener(st);
  addPledgeSubmitListener(st);
  addListenForSignOut(st);
}

//Render the Navigation links
function addNavEventListeners() {
  document.querySelectorAll("nav a").forEach((navLink) =>
    navLink.addEventListener("click", (event) => {
      event.preventDefault();
      render(state[event.target.text]);
      router.updatePageLinks();
    })
  );
}

// Add listener for Cancel buttons to return home
function addCancelButtonListener(st) {
  if (st.view === "Home") {
    return;
  } else {
    document.getElementById("cancel").addEventListener("click", (event) => {
      event.preventDefault();
      render(state.Home);
    });
  }
}

//Listen for and process Registrations
function addRegisterListener(st) {
  if (st.view === "Register") {
    document
      .getElementById("Register-form")
      .addEventListener("submit", (event) => {
        event.preventDefault();
        addCancelButtonListener(st);
        let userData = Array.from(event.target.elements);
        //
        const inputs = userData.map((input) => input.value);
        let firstName = inputs[0];
        let lastName = inputs[1];
        let email = inputs[2];
        let password = inputs[3];
        //
        //create user in Firebase db
        auth.createUserWithEmailAndPassword(email, password).then(() => {
          addUserToStateAndDb(firstName, lastName, email, password);
          render(state.Home);
          //Add message to user on login
          let para = document.createElement("p");
          let node = document.createTextNode(
            `Welcome ${firstName} ${lastName}!`
          );
          para.appendChild(node);
          let element = document.getElementById("div1");
          element.appendChild(para);
        });
      });
  }
}

//Add user to state only after login
function addUserToState(first, last, email, status) {
  state.User.firstName = first;
  state.User.lastName = last;
  state.User.email = email;
  state.User.signedIn = status;
}

// Add user to State and Firebase
function addUserToStateAndDb(first, last, email, password) {
  state.User.firstName = first;
  state.User.lastName = last;
  state.User.email = email;
  state.User.signedIn = status;

  db.collection("users").add({
    firstname: first,
    lastname: last,
    email: email,
    password: password,
    signedIn: true,
  });
}
// Listen for and process Login events
function addLoginListener(st) {
  if (st.view === "Login") {
    document
      .getElementById("Login-form")
      .addEventListener("submit", (event) => {
        event.preventDefault();
        if (event.returnValue === false)
        let userInfo = Array.from(event.target.elements);
        const inputs = userInfo.map((input) => input.value);
        let email = inputs[0];
        let password = inputs[1];
        auth.signInWithEmailAndPassword(email, password).then(() => {
          render(state.Home);
          addUserStatusToDb(email);
        });
      });
  }
}

//Function pull user info from db on Login
function addUserStatusToDb(email) {
  db.collection("users")
    .get()
    .then((snapshot) =>
      snapshot.docs.forEach((doc) => {
        if (email === doc.data().email) {
          let id = doc.id;
          db.collection("users").doc(id).update({ signedIn: true });
          let email = doc.data().email;
          let first = doc.data().firstname;
          let last = doc.data().lastname;
          let status = true;
          //Add message to user on login
          let para = document.createElement("p");
          let node = document.createTextNode(`Welcome ${first} ${last}!`);
          para.appendChild(node);
          let element = document.getElementById("div1");
          element.appendChild(para);
          addUserToState(first, last, email, status);
        }
      })
    );
}

// Add listener for Pledge Now button
function addPledgeNowListener(st) {
  if (st.view === "Home") {
    document.getElementById("pledge").addEventListener("click", (event) => {
      event.preventDefault();
      render(state.Pledge);
      addPledgeSubmitListener(st);
    });
  }
}

//Add a listener for Submit pledge
function addPledgeSubmitListener(st) {
  if (st.view === "Pledge") {
    document
      .getElementById("Pledge-form")
      .addEventListener("submit", (event) => {
        event.preventDefault();
        createPledge();
      });
  }
}

// Save Pledge form data on submit and call db to add
function createPledge() {
  let pledgeData = Array.from(event.target.elements);
  const inputs = pledgeData.map((input) => input.value);
  let peer = inputs[0];
  let charity = inputs[1];
  let email = inputs[2];
  let amount = inputs[3];
  let date = Date();
  addPledgeToDb(date, amount, charity, email, peer);
}

// Add pledge to db with a generated id.
function addPledgeToDb(date, amount, charity, email, peer) {
  db.collection("pledges").add({
    addedOn: date,
    amount: amount,
    charityName: charity,
    email: email,
    peerEmail: peer,
  });
  addPledgeToState(date, peer, charity, email, amount);
}

//Add pledge to state and then db
function addPledgeToState(date, peer, charity, email, amount) {
  state.Pledges.push({
    addedOn: date,
    amount: amount,
    charityName: charity,
    email: email,
    peerEmail: peer,
  });
  render(state.Home);
  //Display pledge message
  let para = document.createElement("p");
  let node = document.createTextNode(
    `Thank you for the $ ${amount} pledge to ${charity}`
  );
  para.appendChild(node);
  let element = document.getElementById("div1");
  element.appendChild(para);
}

//Listen for logout
function addListenForSignOut() {
  document.getElementById("Logout").addEventListener("click", (event) => {
    event.preventDefault();
    let email = state.User.email;
    logoutUserInStateAndDb(email);
  });
}

// if user is logged in, log out when clicked
function logoutUserInStateAndDb(email) {
  event.preventDefault();
  // log out functionality
  logOutUserInDb(email);
  render(state.Home);

  //Add message to user on logout
  let para = document.createElement("p");
  let node = document.createTextNode(`Goodbye       `);
  para.appendChild(node);
  let element = document.getElementById("div1");
  element.appendChild(para);
}
//update user in database
function logOutUserInDb(email) {
  db.collection("users")
    .get()
    .then((snapshot) =>
      snapshot.docs.forEach((doc) => {
        if (email === doc.data().email) {
          let id = doc.id;
          db.collection("users").doc(id).update({ signedIn: false });
        }
      })
    );
}
