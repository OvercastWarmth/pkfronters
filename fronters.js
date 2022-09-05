/*
    Credits for code:
    Ringlings
    Alli
*/

// Collect system ID from query string
const queryString = window.location.search;
const system = new URLSearchParams(queryString).get("sys");

// Main document container
const container = document.querySelector('.container');

// Return fronters from pk api via the querystring
async function getFronters() {
    // Fetch from the pk api
    let response = await fetch("https://api.pluralkit.me/v2/systems/" + system + "/fronters");

    // Handle erorr if there is any
    if (response.status != 200) {
        showInput(response.status)
        return null
    }

    // Return the fronters if there is no error
    return await response.json()
}

// Fetches system information (Alli)
async function getSystem() {
    let response = await fetch("https://api.pluralkit.me/v2/systems/" + system);

    if (response.status != 200) {
        showInput(response.status)
        return null
    }

    return await response.json()
}

// Renders the list of current fronters
async function renderFronters() {
    const fronters = await getFronters();

    // Handle system being switched out
    if (fronters == null) {
        return
    }

    // System name logic (Alli)
    const sysObject = await getSystem();

    // System name container
    const nameContainer = document.getElementById("name-container");

    // System Colour
    let colour = sysObject.color;

    if (sysObject.name != null) {
        // Use system's name (if it has one)
        let sysName = sysObject.name;
        sysName += " Fronter Display";

        document.getElementById("tabname").innerHTML = sysName

        // Add system colour to title (if it has one)
        if (colour != null) {
            nameContainer.innerHTML = `<h1><span class="title" style = "color: #${colour};"> ${sysObject.name} </span> Fronter Display</h1>`
        } else {
            nameContainer.innerHTML = `<h1>${sysName}</h1>`
        }
    } else {
        // Use systems ID as it's name as a fallback
        document.getElementById("tabname").innerHTML = system + " Fronter Display"

        if (colour != null) {
            nameContainer.innerHTML = `<h1><code style = "color: #${colour};"> ${system} </code> Fronter Display</h1>`
        } else {
            nameContainer.innerHTML = `<h1><code> ${system} </code> Fronter Display</h1>`
        }
    }

    // HTMl Builder
    let html = '';
    fronters.members.forEach(fronter => {
        // Avatar logic
        let avatar

        if (fronter.avatar_url != null) {
            // Fronter's avatar
            avatar = `<img src="${fronter.avatar_url}" alt="Profile Picture", style="float:left;">`
        }
        else {
            // Use placeholder avatar if there is no avatar.
            avatar = `<img src="blank.png" alt="Profile Picture", style="float:left;">`
        }

        // Pronouns logic (Alli)
        let fronterPronouns

        if (fronter.pronouns != null) {
            fronterPronouns = fronter.pronouns
        } else {
            // Fallback for if fronter has no pronouns set
            fronterPronouns = "This fronter has no pronouns set."
        }

        /* TODO: Replace this with switch start time
        let dateObject
        let fronterCreated
        if(fronter.created != null) {
            dateObject = fronter.created;
            fronterCreated = dateObject.toLocaleString();
        }
        */

        // Build fronter item
        let htmlSegment = `<div class="fronter">
                            ${avatar}
                            <h2>${fronter.name}</h2>
                            <p>${fronterPronouns}</p>
                        </div>
                        <br style="clear:both">`;

        html += htmlSegment;
    });

    // Back Button (Alli)
    let segment = `<form>
                        <input type="submit" value="Go Back">
                    </form>
                    <!--<br>
                    <a href="systems.html">
                        <input type="submit" value="System info">
                    </a>-->`

    // Display the formatted fronters
    container.innerHTML = html;

    let goBack = document.querySelector('.goBack');
    goBack.innerHTML = segment;
}

// Function for displaying system ID input
function showInput(reason) {
    let label;

    if (reason == 404) {
        // Not found
        label = "There is no system by that ID."
    }
    else if (reason == 403) {
        // Forbidden
        label = "This system has their fronters hidden."
    }
    else if (reason == null) {
        // No system ID provided
        label = "Please enter a system ID:"
    };

    // Create form for inputting system ID
    container.innerHTML = `<form>
                            <label name="sys">${label}</label>
                            <input type="text" name="sys">
                            <input type="submit" value="Submit">
                        </form>`
}

// Handles which display appears on the page
if (system != null & system != "") {
    // Display fronters for requested system
    container.innerHTML = `<code>Loading fronters...</code>`
    renderFronters();
}
else {
    // Display system input
    showInput(null)
};
