import data from "/assets/js/searchData.js";
import serializedIndex from "./assets/js/serialized.js";
//import lunr from "lunr"; // assuming lunr is a separate module

// Constants
const MIN_SEARCH_LENGTH = 3;

// State definition
const state = {
  filters: {
    class: true,
    method: true,
    type: true,
  },
  results: {
    filtered: [],
    full: [],
  },
  visible: false,
};

// Elements for reference
const elements = {
  input: null,
  resultsBox: null,
  resultList: null,
  numberOfResults: null,
  numberResultsShowing: null,
  backdrop: null,
  filters: null,
  searchLabel: null,
  close: null,
};

// Initialize search
async function initializeSearch() {
  const root = document.getElementById("search_button");
  elements.input = document.getElementById("searchInput");
  elements.resultsBox = document.getElementById("searchResults");
  elements.resultList = document.getElementById("resultList");
  elements.numberOfResults = document.getElementById("numberOfResults");
  elements.numberResultsShowing = document.getElementById("numberResultsShowing");
  elements.filters = document.getElementById("searchFilters")
    .getElementsByTagName("input");
  elements.searchLabel = document.getElementById("searchLabel");
  elements.close = elements.resultsBox.querySelector("#close_search_dialog");

  // Add event listeners
  elements.input.addEventListener("input", search);
  elements.close.addEventListener("click", hideSearchBox);

  const openSearch = document.getElementById('search_button');

  openSearch.addEventListener('click', showResultsBox);
  document.addEventListener('keydown', (e)=>{
    if (e.key === '/') {
      e.preventDefault();
      showResultsBox();
    };
  }, false);

  // Load the index
  const index = lunr.Index.load(serializedIndex);

  // Initialize search filter toggles
  for (let i = 0; i < elements.filters.length; ++i) {
    elements.filters[i].addEventListener("change", () => {
      state.filters[elements.filters[i].value] = elements.filters[i].checked;
      updateResultList();
    });
  }

  // Define functions
  function appendBackdrop() {
    elements.backdrop = document.createElement("div");
    elements.backdrop.id = "backdrop";
    elements.backdrop.addEventListener("click", hideSearchBox);
    document.body.appendChild(elements.backdrop);
  }

  function removeBackdrop() {
    elements.backdrop.removeEventListener("click", appendBackdrop);
    elements.backdrop.remove();
    elements.backdrop = undefined;
  }

  function handleKeyboardSelection() {
    const items = elements.list.querySelectorAll("a");
    if (items.length > 0) {
      if (document.activeElement === elements.input) {
        e.preventDefault();
        items[0].focus();
      } else {
        for (let i = 0; i < results.length; i++) {
          if (items[i] === document.activeElement) {
            e.preventDefault();
            if (i + 1 < items.length) {
              items[i + 1].focus();
            } else {
              elements.input.focus();
            }
            break;
          }
        }
      }
    }
  }

  function checkKeyPress(e) {
    if (e.key === "Tab") {
      handleKeyboardSelection(e);
    }
    if (e.key === "Escape") {
      hideSearchBox();
    }
  }

  function showResultsBox() {
    appendBackdrop();
    state.visible = true;
    elements.resultsBox.classList.remove("hidden");
    elements.input.focus();
    document.addEventListener("keydown", checkKeyPress);
  }

  function hideSearchBox() {
    state.visible = false;
    elements.resultsBox.classList.add("hidden");
    document.removeEventListener("keydown", checkKeyPress);
    removeBackdrop();
  }

  function updateResultList() {
    state.results.filtered = [];
    elements.resultList.innerHTML = "";
    // elements.numberOfResults.innerHTML = state.results.full.length;
    // elements.numberResultsShowing.innerHTML = state.results.filtered.length;

    if (state.results.full.length > 0) {
      state.results.full.forEach((result) => {
        const doc = data.find((doc) => doc.name === result.ref);
        const type = doc.type === "interface" ? "type" : doc.type;
        if (state.filters[type]) {
          state.results.filtered.push(result.ref);
          const section = document.createElement("section");
          const desc = document.createElement("p");
          const link = document.createElement("a");
          const li = document.createElement("li");
          li.classList.add(doc.type);

          link.href = `/sprite/doc/${doc.name}`;
          link.className = "searchResultLink";
          link.addEventListener("click", () => {});
          link.textContent = doc.parent
            ? `${doc.parent}.${doc.name}`
            : doc.name;

          desc.textContent = doc.desc;

          section.appendChild(link);
          section.appendChild(desc);

          li.appendChild(section);

          elements.resultList.appendChild(li);
        }
      });

      //elements.numberResultsShowing.innerHTML = state.results.filtered.length;
    }
  }

  function displayResults() {
    if (!state.visible) {
      showResultsBox();
    }
    updateResultList();
  }

  function search() {
    if (elements.input.value.length > 0) {
      elements.searchLabel.classList.add("hidden");
    } else {
      elements.searchLabel.classList.remove("hidden");
    }

    if (elements.input.value.length >= MIN_SEARCH_LENGTH) {
      const initial = index.search(elements.input.value);

      if (initial.length === 0) {
        const wildcardResults = index.search(`${elements.input.value}*`);
        state.results.full =
          wildcardResults.length > 0
            ? wildcardResults
            : index.search(`*${elements.input.value}*`);
      } else {
        state.results.full = initial;
      }

      displayResults();
    }
  }
}

document.addEventListener("DOMContentLoaded", initializeSearch);