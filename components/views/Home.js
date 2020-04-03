export default () => `
<div class="find-search">
    <input type = "text" class="search-box" size="40" id="peer-search" name="q" placeholder="Enter a friends email address" value="" maxlength="40" aria-label="Search for a peer by name">
    <button class="search-box" id="peer" form="">Search</button>
    <button class="search-box" id="pledge">Pledge Now</button>
    <input type = "text" class="search-box" size="40" id="charity-search" name="q" placeholder="Enter a Charity name" value="" maxlength="40" aria-label="Search for a Charity by name">
    <button class="search-box" id="charity" form="">Search</button>
</div><!--find-search-->
<div class="section3">
    <p id="numchar"> </p>
    <p id="numdollars"> </p>
    <p id ="nummembers"> </p>
</div><!--#section3-->
<div class="section4">
    <ul class="top3" id="topCharities"><h3>Top Charities</h3>
        <li>Charity A</li>
        <li>Charity B</li>
        <li>Charity C</li>
    </ul><!--topCharities-->
    <ul class="top3" id="topPledges"><h3>Top Pledges</h3>
        <li>1st Place</li>
        <li>2nd Place</li>
        <li>3rd Place</li>
    </ul><!--topPledges-->
    <ul class="top3" id="topMembers"><h3>Top Members</h3>
        <li>Member A</li>
        <li>Member B</li>
        <li>Member C</li>
    </ul><!--topMembers-->
</div><!--section4-->
    `;
