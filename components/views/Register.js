export default () => `
<form id="Register-form" method="POST">
    <h3>Register</h3>
		<input type="text" placeholder="First Name" id="firstname" required/>
		<input type="text" placeholder="Last Name" id="lastname" required/>
		<input type="text" placeholder="Email Address" id="user-email" required/>
		<input type="password" placeholder="Password" id="user-pass" autocomplete = "current-password" required/>
		<input type="password" placeholder="Verify Password" id="vuser-pass" autocomplete = "current-password" required/>
    <input type="submit" id="register" value="Register"/>
    <input type="submit" id="cancel" value="Cancel"/>
  </form>
  `;
