let page = 0;
let fetching = false;
const infoElement = document.querySelector(".info");
const levelpackTableElement = document.querySelector(".levelpacks");

const pageNumElement = document.querySelector(".pagination-number");
const prevPage = document.querySelector(".pagination-prev");
prevPage.addEventListener("click", async () => {
    if (page > 0) page -= 1;
    gotoPage();
});

const nextPage = document.querySelector(".pagination-next");
nextPage.addEventListener("click", async () => {
    page += 1;
    gotoPage();
});

async function gotoPage() {
    pageNumElement.innerText = page + 1;
    if (fetching === false) {
        fetching = true;
        await clearData();
        const results = await fetchData();
        if (results !== null) {
            await addData(results)
        }
        fetching = false;
    }
}

async function fetchData() {
    const apiresult = await fetch(`https://5beam.zelo.dev/api/level/page/${page}`);
    const levelpacks = await apiresult.json();
    switch (levelpacks.status) {
    case "success":
        infoElement.style.display = "none";
        return levelpacks;

    case "fail":
        infoElement.innerText = "Error! Failed to get API results.";
        infoElement.style.color = "red";
        return null;

    case "ratelimit":
        infoElement.innerText = "Error! You are being ratelimited.";
        infoElement.style.color = "red";
        return null;
    }
}

async function clearData() {
    levelpackTableElement.innerHTML = "";
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

gotoPage(page);