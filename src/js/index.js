// Global app controller
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Like';

import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';

import { elements, renderLoader, clearLoader } from './views/base';

/* Global state of the app
* - Search object
* - Current recipe object
* - Shopping list object
* - Liked recipes
*/
const state = {};

/******************
* SEARCH CONTROLLER
*******************/
const controlSearch = async () => {
  // 1.- Get query from the view.
  const query = searchView.getInput();

  if(query) {
      // 2.- New search object and add to state
      state.search = new Search(query);

      // 3.- Prepare UI for results
      searchView.clearInput();
      searchView.clearResults();
      renderLoader(elements.results);

      try {
        // 4.- To search for recipes
        await state.search.getResponse();

        // 5.- Render results in UI
        clearLoader();
        searchView.renderResults(state.search.results);
      } catch(error) {
        alert('Ops! Something was worng with the seach :(');
        clearLoader();
      }
  }
};

const button = elements.searchForm.addEventListener('submit', event => {
  event.preventDefault();
  controlSearch();
});


elements.resultPages.addEventListener('click', event => {
  const btn = event.target.closest('.btn-inline');

  if(btn){
    const goToPage = parseInt(btn.dataset.goto);
    searchView.clearResults();
    searchView.renderResults(state.search.results, goToPage);
  }
});

/******************
* RECIPE CONTROLLER
******************/

const controlRecipe = async () => {
  //console.log(event);
  const id = window.location.hash.replace('#', '');
  console.log(id);

  if(id){
    // 1.- Prepare UI for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    // 2.- Highlight selected search item
    if(state.search) searchView.highlightSelected(id);

    // 3.- Create new recipe object
    state.recipe = new Recipe(id);

    try {
      // 4.- Get recipe data
      await state.recipe.getRecipe();

      // 5.- Calculate serving and time
      state.recipe.calcServings();
      state.recipe.calcTime();
      state.recipe.parseIngredients();

      // 6.- Render recipe
      //console.log(state.recipe);
      clearLoader();
      recipeView.renderRecipe(
        state.recipe,
        state.likes.isLiked(id)
      );

    } catch(error) {
      console.log(error);
      alert('Ops! Something was wrong with the recipe :(');
    }

  }
}

/******************
* LIST CONTROLLER
******************/
const controlList = () => {
  // Create a new list IF there is not one yet
  if(!state.list) state.list = new List();

  // Add each ingredient to the list
  state.recipe.ingredients.forEach(element => {
    const item = state.list.addItem(element.count, element.unit, element.ingredient);
    listView.renderItem(item);
  })

}

/******************
* LIKE CONTROLLER
******************/
const controlLike = () => {
  if(!state.likes) state.likes = new Likes();
  const currentID = state.recipe.id;

  // User has NOT yet liked current recipe
  if(!state.likes.isLiked(currentID)) {

    // Add like to the state
    const newLike = state.likes.addLike(
      currentID,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img,
    );

    // Toggle the like button
    likesView.toggleLikeBtn(true);

    // Add like to UI list
    likesView.addLike(newLike);

  // User HAS yet liked current recipe
  } else {
    // Remove like from the state
    state.likes.deleteLike(currentID);

    // Toggle the like button
    likesView.toggleLikeBtn(false);

    // Remove like from UI list
    likesView.deleteLike(currentID);
  }
  likesView.toggleLikeMenu(state.likes.getNumLikes());
  //
}

//window.addEventListener('hashchange', controlRecipe);
//window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

// Handling delete and update list item event
elements.shopping.addEventListener('click', event => {
  // Geting current id wherever you click
  const id = event.target.closest('.shopping__item').dataset.itemid;

  if(event.target.matches('.shopping__delete, .shopping__delete *')) {
    // Delete from state
    state.list.deleteItem(id);

    // Delete from UI
    listView.deleteItem(id);
  } else if(event.target.matches('.shopping__count-value')) {

    const value = parseInt(event.target.value);
    state.list.updateCount(id, value);
  }

});

//Restore liked recipes on page load
window.addEventListener('load', ()  => {
  state.likes = new Likes();

  // Restore likes
  state.likes.readStorage();

  // Toggle like menu button
  likesView.toggleLikeMenu(state.likes.getNumLikes());

  // Render the existing likes
  state.likes.likes.forEach(like => likesView.addLike(like));
});

// Handling recipe button click
elements.recipe.addEventListener('click', event => {

  //Handle delete button
  if(event.target.matches('.btn-decrease, .btn-decrease *')) {
    // Decrease button is clicked
    if(state.recipe.servings > 1) {
      state.recipe.updateServing('dec');
    }
  //Handle the count update
  } else if(event.target.matches('.btn-increase, .btn-increase *')) {
    // Increase button is clicked
    state.recipe.updateServing('inc');

  } else if(event.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
    // Add ingredients to shopping list
    controlList();
  } else if(event.target.matches('.recipe__love, .recipe__love *')) {
    // Like Controller
    controlLike();
  }

  recipeView.updateServingsIngredients(state.recipe);
});


window.state = state;
