export default st => `
<div class="find-search">
    <input type = "text" class="searchBox" id="searchBar" size="30" name="q" onkeyup="" placeholder="Enter a Charity name" maxlength="30" aria-label="Search for a Charity by name">
    <button class="search-box" id="pledge">Pledge Now</button>
</div><!--find-search-->
<div class="section3">
    <p id="Number of Charities"> </p>
    <p id="Pledges"> </p>
    <p id ="Members"> </p>
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
