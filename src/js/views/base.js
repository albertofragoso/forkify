export const elements = {
  searchForm: document.querySelector('.search'),
  searchInput: document.querySelector('.search__field'),
  searchButton: document.querySelector('.search__btn'),
  resultList: document.querySelector('.results__list'),
  results: document.querySelector('.results'),
  resultPages: document.querySelector('.results__pages'),
  recipe: document.querySelector('.recipe'),
  shopping: document.querySelector('.shopping__list'),
  heart: document.querySelector('.recipe__love'),
  likeList: document.querySelector('.likes__list'),
  likesMenu: document.querySelector('.likes__field'),
}

export const elementsString = {
  loader: 'loader',
}

export const renderLoader = parent => {
  const loader = `
    <div class="${elementsString.loader}">
      <svg>
        <use href="img/icons.svg#icon-cw"></use>
      </svg>
    </div>
  `;

  parent.insertAdjacentHTML('afterbegin', loader);

}

export const clearLoader = () => {
  const loader = document.querySelector(`.${elementsString.loader}`);
  if (loader) loader.parentElement.removeChild(loader);
}
