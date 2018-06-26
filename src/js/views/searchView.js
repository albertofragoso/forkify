import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
  elements.searchInput.value = '';
}

export const clearResults = () => {
  elements.resultList.innerHTML = '';
  elements.resultPages.innerHTML = '';
}

export const highlightSelected = id => {
  const resultsArr = Array.from(document.querySelectorAll('.results__link--active'));
  resultsArr.forEach(item => item.classList.remove('results__link--active'));

  document.querySelector(`.results__link[href*="#${id}"]`).classList.add('results__link--active');
}

/*
// Pasta with tomato and spinach
accumulator: 0 / accumulator + current.lenght = 5 / newTitle = ['Pasta']
accumulator: 5 / accumulator + current.lenght = 9 / newTitle = ['Pasta', 'with']
accumulator: 9 / accumulator + current.lenght = 15 / newTitle = ['Pasta', 'with', 'tomato']
accumulator: 15 / accumulator + current.lenght = 18 / newTitle = ['Pasta', 'with', 'tomato']
accumulator: 18 / accumulator + current.lenght = 25 / newTitle = ['Pasta', 'with', 'tomato']
*/
export const clearTitle = (title, limit = 17) => {
  const newTitle = [];

  title.split(' ').reduce((accumulator, current) => {
    if(accumulator + current.length <= limit) {
      newTitle.push(current);
    }
    return accumulator + current.length;
  }, 0)

  return `${newTitle.join(' ')} ...`;
}

const renderRecipe = recipe => {
  const markup = `
    <li>
        <a class="results__link results__link" href="?#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${clearTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
  `;

  elements.resultList.insertAdjacentHTML('beforeend', markup);
}

const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
    </button>
  `;

const renderButtons = (page, numResults, resPerPage) => {
  const pages = Math.ceil(numResults / resPerPage);
  let button;

  if (page === 1 && pages > 1) {
    // Add only next button.
    button = createButton(page, 'next');

  } else if( page < pages) {
    // Add previous and next button.
    button = `
      ${createButton(page, 'prev')};
      ${createButton(page, 'next')};
    `

  } else if(page === pages && pages > 1) {
    // Add only previous button.
    button = createButton(page, 'prev');
  }

  elements.resultPages.insertAdjacentHTML('beforeend', button);
}

export const renderResults = (recipes, page = 1, resPerPage = 10) => {

  // Add results
  const start = (page - 1) * resPerPage;
  const end = page * resPerPage;

  recipes.slice(start, end).forEach(element => renderRecipe(element));

  // Add buttons
  renderButtons(page, recipes.length, resPerPage);
}
