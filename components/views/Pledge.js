export default () => `
<form id="Pledge-form" method="POST">
  <h3>Pledge</h3>
    <input type="text" placeholder="Enter friend's email" id="peer" required/>
    <input type="text" placeholder="Charity" id="charity" required/>
    <input type="text" placeholder="Email Address" id="user-email" autocomplete="email" required/>
    <input type="amount" placeholder="0.00" id="amount" required/>
    <input type="submit" id="Pledge" value="Pledge"/>
    <input type="submit" id="cancel" value="Cancel"/>
</form>
`;
