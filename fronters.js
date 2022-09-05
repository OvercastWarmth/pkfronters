/*
    Credits for code:
    Fetch fronters from PK: Ringlings
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

// Renders the list of current fronters
async function renderFronters() {
    const fronters = await getFronters();

    // Handle system being switched out
    if (fronters == null) {
        return
    }

    let html = '';
    fronters.members.forEach(fronter => {
        // Avatar logic
        let avatar
        if (fronter.avatar_url != null) {
            avatar = `<img src="${fronter.avatar_url}" alt="Profile Picture", style="float:left">`
        }
        else {
            // TODO: Use placeholder avatar if there is no avatar.
            avatar = ``
        }

        // Build fronter item
        let htmlSegment = `<div class="fronter">
                            ${avatar}
                            <h2>${fronter.name}</h2>
                            <p>${fronter.pronouns}</p>
                        </div>
                        <br style="clear:both">`;

        html += htmlSegment;
    });

    // Display the formatted fronters
    container.innerHTML = html;
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
                            <input type="submit">
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
