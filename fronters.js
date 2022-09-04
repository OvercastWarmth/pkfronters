const queryString = window.location.search;
const system = new URLSearchParams(queryString).get("sys");
const container = document.querySelector('.container');

async function getFronters() {
    let response = await fetch("https://api.pluralkit.me/v2/systems/" + system + "/fronters");
    if (response.status != 200) {
        showInput(response.status)
        return null
    }
    return await response.json()
}

async function renderFronters() {
    const fronters = await getFronters();
    if (fronters == null) {
        return
    }
    let html = '';
    fronters.members.forEach(fronter => {
        let avatar
        if (fronter.avatar_url != null) {
            avatar = `<img src="${fronter.avatar_url}" alt="Profile Picture", style="float:left">`
        }
        else {
            avatar = ``
        }

        let htmlSegment = `<div class="fronter">
                            ${avatar}
                            <h2>${fronter.name}</h2>
                            <p>${fronter.pronouns}</p>
                        </div>
                        <br style="clear:both">`;

        html += htmlSegment;
    });

    let container = document.querySelector('.container');
    container.innerHTML = html;
}

function showInput(reason) {
    console.log(reason)
    let label;
    if (reason == 404) {
        label = "There is no system by that ID."
    }
    else if (reason == 403) {
        label = "This system has their fronters hidden."
    }
    else if (reason == null) {
        label = "Please enter a system ID:"
    };
    container.innerHTML = `<form>
                            <label name="sys">${label}</label>
                            <input type="text" name="sys">
                            <input type="submit">
                        </form>`
}

if (system != null & system != "") {
    container.innerHTML = `<code>Loading fronters...</code>`
    renderFronters();
}
else {
    showInput(null)
};
