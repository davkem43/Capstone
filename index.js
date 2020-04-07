import { Nav, Banner, Main, Footer } from "./components";
import * as state from "./store";

import Navigo from "navigo";
import { capitalize } from "lodash";
import axios from "axios";

import "./env";
import { auth, db } from "./firebase";

// ROUTER
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
    const celcius = (response.data.main.temp - 273.15) * 0.555 + 32;
    console.log("temp is", celcius);
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
  addStatistics(st);
}

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

// Add listener for Cancel buttons to return home
function addCancelButtonListener(st) {
  if (st.view === "Home") {
    return;
  } else {
    document.getElementById("cancel").addEventListener("click", event => {
      event.preventDefault();
      console.log("cancel pressed, returning home");
      render(state.Home);
    });
  }
}

//Listen for and process Registrations
function addRegisterListener(st) {
  if (st.view === "Register") {
    document
      .getElementById("Register-form")
      .addEventListener("submit", event => {
        event.preventDefault();
        addCancelButtonListener(st);
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
          console.log("user registered", response);
          addUserToStateAndDb(firstName, lastName, email, password);
          render(state.Home);
        });
      });
  }
}

// Add user to State and Firebase
function addUserToStateAndDb(first, last, email, password) {
  state.User.userName = first + last;
  state.User.email = email;
  state.User.firstName = first;
  state.User.lastName = last;
  state.User.signedIn = true;

  db.collection("users").add({
    firstname: first,
    lastname: last,
    email: email,
    password: password,
    signedIn: true
  });
}

// Listen for and process Login events
function addLoginListener(st) {
  if (st.view === "Login") {
    document.getElementById("Login-form").addEventListener("submit", event => {
      event.preventDefault();
      let userInfo = Array.from(event.target.elements);
      const inputs = userInfo.map(input => input.value);
      let email = inputs[0];
      let password = inputs[1];
      auth.signInWithEmailAndPassword(email, password).then(response => {
        console.log("user signed in", response);
        getUserInfoFromDb(email);
        render(state.Home);
        console.log("email", email);
      });
    });
  }
}

//Function pull user info from db on Login
function getUserInfoFromDb(email) {
  db.collection("users")
    .get()
    .then(snapshot =>
      snapshot.docs.forEach(doc => {
        if (email === doc.data().email) {
          let id = doc.id;
          db.collection("users")
            .doc(id)
            .update({ signedIn: true });
          console.log("signed in db");
          let user = doc.data();
          state.User.userName = user.firstname + user.lastname;
          state.User.firstName = user.firstname;
          state.User.lastName = user.lastname;
          state.User.email = email;
          state.User.signedIn = true;
          console.log("state", state.User);
        }
      })
    );
}

// Add listener for Pledge Now button
function addPledgeNowListener(st) {
  if (st.view === "Home") {
    document.getElementById("pledge").addEventListener("click", event => {
      event.preventDefault();
      console.log("button", state);
      render(state.Pledge);
      addPledgeSubmitListener(st);
    });
  }
}

//Add a listener for Submit pledge
function addPledgeSubmitListener(st) {
  if (st.view === "Pledge") {
    console.log(st.view);
    document.getElementById("Pledge-form").addEventListener("submit", event => {
      event.preventDefault();
      console.log("creating pledge");
      createPledge(st);
    });
  }
}

// Save Pledge form data on submit and call db to add
function createPledge(st) {
  console.log("created pledge");
  document.getElementById("Pledge-form").addEventListener("submit", event => {
    event.preventDefault();
    console.log("pledge listener created");
    let pledgeData = Array.from(event.target.elements);
    const inputs = pledgeData.map(input => input.value);
    console.log("inputs", inputs);
    let peer = inputs[0];
    let charity = inputs[1];
    let email = inputs[2];
    let amount = inputs[4];
    let date = Date();
    console.log("adding pledge to db", amount);
    addPledgeToDb(date, amount, charity, email, peer);
  });
}

// Add pledge to db with a generated id.
function addPledgeToDb(date, amount, charity, email, peer) {
  db.collection("pledges")
    .add({
      addedOn: date,
      amount: amount,
      charityName: charity,
      email: email,
      peerEmail: peer
    })
    .then(function(docRef) {
      console.log("Document written with ID: ", docRef.id);
      addPledgeToState();
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });
}

//Add pledge to state and then db
function addPledgeToState(date, peer, charity, email, amount) {
  state.Pledge.peerEmail = peer;
  state.Pledge.charity = charity;
  state.Pledge.email = email;
  state.Pledge.amount = amount;
  state.Pledge.addedOn = date;
  console.log("added to db");
  render(state.home);
}

//Calculate statistics
function addStatistics(st) {
  //const topPledge = db.collection.pledges.amount;
  // document.getElementById("numdollars").textContent = `Pledges: ${topPledge}`;
  console.log("need to define statistics");

  // const memberCount = db.collection.users.length;
  // document.getElementById("Members").textContent = `Members: ${memberCount}`;
  // console.log(`# of Members ${memberCount}`);
}
