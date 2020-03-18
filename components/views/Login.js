export default () => `
  <form id="login-form" onsubmit="return login()">
    <h3>Sign In</h3>
    <input type="text" placeholder="Email Address" id="user-email" required/>
    <input type="password" placeholder="Password" id="user-pass" required/>
    <input type="submit" value="Sign In"/>
    <input type="submit" value="Cancel"/>
    <span class="psw">Forgot <a href="#">password?</a></span>
  </form>
  `;
