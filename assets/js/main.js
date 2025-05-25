document.querySelectorAll('.nav-right a').forEach(link => {
  link.addEventListener('click', function (e) {
    const href = this.getAttribute('href');

    // Check if href starts with '#', indicating an internal anchor
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
    // else, for external links or different pages, do nothing -> allow normal navigation
  });
});


const fieldTags = document.querySelectorAll('#fieldFilter .filter-tag');
const langTags = document.querySelectorAll('#langFilter .filter-tag');
const simRealTags = document.querySelectorAll('#SimRealFilter .filter-tag');
const projectCards = document.querySelectorAll('.project-card');

let selectedFields = new Set();
let selectedLangs = new Set();
let selectedSimReal = new Set();

function normalizeTag(tag) {
  return tag.replace(/\s+/g, '').toLowerCase();
}

function normalizeSelectedTags(tagSet) {
  return [...tagSet].map(tag => tag.replace(/\s+/g, '').toLowerCase());
}

function updateTagSet(tagSet, tagText, isActive) {
  if (isActive) tagSet.add(tagText);
  else tagSet.delete(tagText);
}

function filterProjects() {
  const normalizedSelectedFields = normalizeSelectedTags(selectedFields);
  const normalizedSelectedLangs = normalizeSelectedTags(selectedLangs);
  const normalizedSelectedSimReal = normalizeSelectedTags(selectedSimReal);

  projectCards.forEach(card => {
    const cardField = card.dataset.field
      .split(',')
      .map(f => normalizeTag(f));
    const cardLangs = card.dataset.lang
      .split(',')
      .map(l => normalizeTag(l));
    const cardSimReal = card.dataset.simreal
      .split(',')
      .map(s => normalizeTag(s));

    const matchField = normalizedSelectedFields.length === 0 || normalizedSelectedFields.some(field => cardField.includes(field));
    const matchLang = normalizedSelectedLangs.length === 0 || normalizedSelectedLangs.some(lang => cardLangs.includes(lang));
    const matchSimReal = normalizedSelectedSimReal.length === 0 || normalizedSelectedSimReal.some(simReal => cardSimReal.includes(simReal));

    card.style.display = (matchField && matchLang && matchSimReal) ? 'flex' : 'none';
  });
}

function handleTagClick(tagElement, group, tagSet) {
  const tagText = tagElement.dataset.tag;
  const isActive = tagElement.classList.toggle('active');
  updateTagSet(tagSet, tagText, isActive);
  filterProjects();
}

fieldTags.forEach(tag => {
  tag.addEventListener('click', () => handleTagClick(tag, fieldTags, selectedFields));
});

langTags.forEach(tag => {
  tag.addEventListener('click', () => handleTagClick(tag, langTags, selectedLangs));
});

simRealTags.forEach(tag => {
  tag.addEventListener('click', () => handleTagClick(tag, simRealTags, selectedSimReal));
});


document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("modal-container");

  // Add click listener to all cards
  document.querySelectorAll(".project-card").forEach(card => {
    card.addEventListener("click", async (e) => {
      e.preventDefault();

      const projectId = card.dataset.project;
      if (!projectId) return;

      const modalUrl = `modals/modal-${projectId}.html`;

      try {
        const res = await fetch(modalUrl);
        const modalHtml = await res.text();

        // Replace the content of the modal container
        container.innerHTML = modalHtml;

        const modal = container.querySelector(".modal");
        if (modal) {
          modal.style.display = "flex";
        } else {
          console.warn(`Modal not found in ${modalUrl}`);
        }
      } catch (err) {
        console.error(`Could not load modal from ${modalUrl}`, err);
      }
    });
  });

  // Close when clicking outside
  window.addEventListener("click", (event) => {
    const modal = container.querySelector(".modal");
    if (modal && event.target === modal) {
      modal.style.display = "none";
    }
  });

  // Optional: global close function
  window.closeModal = function () {
    const modal = container.querySelector(".modal");
    if (modal) modal.style.display = "none";
  };
});
