import { elements } from './base';
import { clearTitle } from './searchView';

export const toggleLikeBtn = isliked => {
  const iconString = isliked ? 'icon-heart' : 'icon-heart-outlined';
  //element.heart.setAtrribute('href', liked : 'icon-heart' ? 'icon-heart-outlined');
  document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);
}

export const toggleLikeMenu = numLikes => {
  elements.likesMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden';
}

export const addLike = like => {
  const markup = `
    <li>
      <a class="likes__link" href="#${like.id}">
            <figure class="likes__fig">
                <img src="${like.img}" alt="${like.title}">
            </figure>
            <div class="likes__data">
                <h4 class="likes__name">${clearTitle(like.title)}</h4>
                <p class="likes__author">${like.author}</p>
            </div>
        </a>
    </li>
  `;
  elements.likeList.insertAdjacentHTML('beforeend', markup);
}

export const deleteLike = id => {
  const element = document.querySelector(`.likes__link[href*="${id}"]`);
  if (element) element.parentElement.removeChild(element);
}
