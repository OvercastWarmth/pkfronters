/*
    Credits for code:
    Ringlings
    Alli
    Purrrpley
*/

// Collect system ID from query string
const queryString = window.location.search;
const system = new URLSearchParams(queryString).get("sys");

// Main document container
const container = document.querySelector('.container');

// Helper function for interacting with the PluralKit API
async function pkAPI(path) {
    // Fetch from the PluralKit API
    let response = await fetch('https://api.pluralkit.me/v2/' + path)
    // Handle error if there is one
    if (response.status != 200) {
        showInput(response.status)
        return null
    }
    return await response.json()
}

async function getFronters(system) {
    let fronters = (await pkAPI(`systems/${system}/fronters`)).members
    // Return only the UUIDs. The other data we get from the `getMembers()`
    // call, so we only need to store it there and not here too. If the system
    // is switched out, it will return an empty array.
    return fronters.map(i => {
        return i.uuid
    })
}

async function getMembers(system) {
    return await pkAPI(`systems/${system}/members`)
}

async function getSystemInfo(system) {
    return await pkAPI(`systems/${system}`)
}

// Separate members into groups depending on whether they're fronting or not
function separateMembers(fronting, members) {
    return {
        'fronting': members.filter(member => {
            return fronting.indexOf(member.uuid) != -1
        }),
        'nonFronting': members.filter(member => {
            return fronting.indexOf(member.uuid) == -1
        })
    }
}

function backButton() {
    // Back Button (Alli)
    // TODO: refactor to use buttons instead, or add all the required aria properties
    let segment = `<form>
                        <input type="submit" value="Go Back">
                        &mdash;
                    </form>
                    <!--<br>
                    <a href="systems.html">
                        <input type="submit" value="System info">
                    </a>-->`

    let goBack = document.querySelector('.goBack');
    goBack.innerHTML = segment;

}

async function renderCard(member, isFronting) {
    /* TODO: Replace this with switch start time
    let dateObject
    let fronterCreated
    if(fronter.created != null) {
        dateObject = fronter.created;
        fronterCreated = dateObject.toLocaleString();
    }
    */
    return `
        <div class="card ${isFronting ? 'fronting' : 'non-fronting'}", style="--border-color: #${member.color}">
            <img src="${member.avatar_url == null ? 'blank.png' : member.avatar_url}" alt="Profile Picture">
            <div class="card-info">
                <h2>${member.name}</h2>
                <p>${member.pronouns == null ? 'This member has no pronouns set.' : member.pronouns}</p>
            </div>
        </div>
    `
}

async function renderCards(system) {
    // Fetch requests in parallel
    let [fronting, members] = await Promise.all([
        getFronters(system),
        getMembers(system)
    ])

    // Separate the members
    members = separateMembers(fronting, members)
    delete fronting

    let html = ''
    for (const fronter of members.fronting) {
        html += await renderCard(fronter, true)
    }
    for (const nonFronter of members.nonFronting) {
        html += await renderCard(nonFronter, false)
    }

    // Display the formatted fronters
    container.innerHTML = html
}

async function updateTitles(system) {
    let systemInfo = await getSystemInfo(system)

    // System name container
    const nameContainer = document.getElementById("name-container");

    // System Colour
    let colour = systemInfo.color;

    if (systemInfo.name != null) {
        // Use system's name (if it has one)
        let sysName = systemInfo.name;
        sysName += " Fronter Display";

        document.getElementById("tabname").innerHTML = sysName

        // Add system colour to title (if it has one)
        if (colour != null) {
            nameContainer.innerHTML = `<h1><span class="title" style = "color: #${colour};"> ${systemInfo.name} </span> Fronter Display</h1>`
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
    container.innerHTML = `<form class="system-form">
                            <label for="sys">${label}</label>
                            <input type="text" name="sys" id="sys">
                            <input type="submit" value="Submit">
                        </form>`
}

// Handles which display appears on the page
if (system != null & system != "") {
    // Display fronters for requested system
    container.innerHTML = `<code>Loading fronters...</code>`
    Promise.all([updateTitles(system), renderCards(system)])
    backButton()
}
else {
    // Display system input
    showInput(null)
};
