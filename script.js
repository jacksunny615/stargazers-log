const list = document.querySelector("#repo-list");
const status = document.querySelector("#list-status");

function formatDate(value) {
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

function renderEvent(event, index) {
  const { repository, starredAt } = event;
  const item = document.createElement("li");
  const link = document.createElement("a");
  const owner = document.createElement("span");
  const description = document.createElement("p");
  const meta = document.createElement("div");
  const language = document.createElement("span");
  const date = document.createElement("time");

  item.className = "repo-item";
  item.style.animationDelay = `${index * 70}ms`;
  link.className = "repo-link";
  link.href = repository.url;
  link.target = "_blank";
  link.rel = "noreferrer";
  link.textContent = repository.name;
  owner.className = "repo-owner";
  owner.textContent = ` / ${repository.owner}`;
  description.className = "repo-description";
  description.textContent = repository.description;
  meta.className = "repo-meta";
  language.className = "repo-language";
  language.textContent = repository.language;
  date.className = "repo-date";
  date.dateTime = starredAt;
  date.textContent = formatDate(starredAt);

  item.append(link, owner, description, meta);
  meta.append(language, date);
  return item;
}

async function loadEvents() {
  try {
    const response = await fetch("events.json");
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    if (!Array.isArray(data.events)) {
      throw new Error("The events data is not a list");
    }

    list.replaceChildren(...data.events.map(renderEvent));
    status.hidden = true;
  } catch (error) {
    status.textContent = "Repositories could not be loaded. Please try again later.";
    console.error("Unable to load starred repositories:", error);
  }
}

loadEvents();