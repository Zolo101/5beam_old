const infoElement = document.querySelector(".info");
const levelpackTableElement = document.querySelector(".levelpacks");

async function init() {
    const apiresult = await fetch("https://5beam.zelo.dev/api/all");
    const levelpacks = await apiresult.json();
    switch (levelpacks.status) {
    case "success":
        await addData(levelpacks);
        infoElement.style.display = "none";
        break;

    case "fail":
    case "unsure":
        infoElement.innerText = "Error! Failed to get API results.";
        infoElement.style.color = "red";
        break;

    case "ratelimit":
        infoElement.innerText = "Error! You are being ratelimited.";
        infoElement.style.color = "red";
        break;
    }
}

async function addData(levelpacks) {
    for (const levelpack of levelpacks.data) {
        const levelpackElement = document.createElement("tr");
        const elementID = document.createElement("td");
        elementID.className = "lp-id";
        elementID.innerText = levelpack.ID;

        const elementName = document.createElement("td");
        elementName.className = "lp-name";
        elementName.innerText = levelpack.name;

        const elementAuthor = document.createElement("td");
        elementAuthor.className = "lp-author";
        elementAuthor.innerText = levelpack.author;

        const elementDate = document.createElement("td");
        elementDate.className = "lp-date";
        elementDate.innerText = new Date(Number(levelpack.date)).toUTCString();

        const elementVersion = document.createElement("td");
        elementVersion.className = "lp-version";
        elementVersion.innerHTML = levelpack.version;

        levelpackElement.appendChild(elementID);
        levelpackElement.appendChild(elementName);
        levelpackElement.appendChild(elementAuthor);
        levelpackElement.appendChild(elementDate);
        levelpackElement.appendChild(elementVersion);
        levelpackTableElement.appendChild(levelpackElement)
    }
}

init();