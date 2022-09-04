const queryString = window.location.search;
const system = new URLSearchParams(queryString).get("sys");

async function getFronters() {
    let response = await fetch("https://api.pluralkit.me/v2/systems/" + system + "/fronters");
    return await response.json()
}

async function renderFronters() {
    let fronters = await getFronters();
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

renderFronters();

