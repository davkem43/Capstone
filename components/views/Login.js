export default () => `
  <form id="Login-form" method="POST">
    <h3>Sign In</h3>
    <input type="text" placeholder="Email Address" id="user-email" required/>
    <input type="password" placeholder="Password" id="user-pass" autocomplete = "current-password" required/>
    <input type="submit" id="login" value="Sign In"/>
    <input type="submit" id="cancel" value="Cancel"/>
    <span class="psw">Forgot <a href="#">password?</a></span>
  </form>
  `;
