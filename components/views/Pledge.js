export default () => `
<form id="pledge-form" onsubmit="return pledge()">
<h3>Pledge</h3>
<input type="text" placeholder="Peer" id="peer" readonly="true" required/>
<input type="text" placeholder="Charity" id="charity" readonly="true" required/>
<input type="text" placeholder="First Name" id="firstname" required/>
<input type="text" placeholder="Last Name" id="lastname" required/>
<input type="text" placeholder="Email Address" id="user-email" autocomplete="email" required/>
<input type="password" placeholder="Password" id="user-pass" autocomplete="current-password" required/>
<input type="amount" placeholder="Amount" pattern="0.00" id="amount" required/>
<input type="submit" value="Pledge"/>
<input type="submit" value="Cancel"/>
</form>
`;
