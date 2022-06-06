import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as model from './model.js';
import recipeview from './views/recipeview.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarksview.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

// if (module.hot) {
//   module.hot.accept();
// }

//got turned to a private variable in d recipeview
//const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipe = async function () {
  try {
    // getting the hash from d window body
    const id = window.location.hash.slice(1);
    if (!id) return;
    //to mark result view
    resultView.UpdatemarkUpHtml(model.getPaginationPages());

    //render spinner until fetch is fufilled
    recipeview.renderSpinner();

    // to load the recipe from the api
    await model.loadRecipe(id);
    //let { recipe } = model.state;

    //step 2 : rendering recipe
    recipeview.render(model.state.recipe);

    //highlight the current seleted bookmark
    bookmarkView.UpdatemarkUpHtml(model.state.bookmarked);
  } catch (err) {
    recipeview.generateErrorMarkUp();
  }
};

const controlSearchResults = async function () {
  try {
    const query = searchView.getSearchQuery();
    if (!query) return;
    // render the spinner before displaying the awaited data
    resultView.renderSpinner();

    await model.LoadSearchResults(query);
    // render search result to the DOM
    resultView.render(model.getPaginationPages());

    // render initial pagination button
    paginationView.render(model.state.searchResult);
  } catch (err) {
    resultView.generateErrorMarkUp();
  }
};

//pagination controller
const controlPagination = function (goto) {
  resultView.render(model.getPaginationPages(goto));

  // render initial pagination button
  paginationView.render(model.state.searchResult);
};

// update controlservings
const controlServings = function (newServings) {
  // increment or decrease the control servings
  model.updateServings(newServings);

  // update the recipe view
  recipeview.UpdatemarkUpHtml(model.state.recipe);
};

const controlBookmark = function () {
  //add or remove a bookmark
  if (!model.state.recipe.bookmarked) model.addbookmark(model.state.recipe);
  else model.delbookmark(model.state.recipe.id);
  // update the dom on active recipe
  recipeview.UpdatemarkUpHtml(model.state.recipe);
  // render bookmarks
  bookmarkView.render(model.state.bookmarked);
};

const controlBookM = function () {
  bookmarkView.render(model.state.bookmarked);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //render spinner
    addRecipeView.renderSpinner();
    // passing in the recipe from the model
    await model.upLoadRecipe(newRecipe);
    console.log(model.state.recipe);

    //render recipe view
    recipeview.render(model.state.recipe);

    // success message
    addRecipeView.generateMessageMarkUp();

    // re-render the bookmark view
    bookmarkView.render(model.state.bookmarked);
    // change Id in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    //close add recipe form and modal
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    addRecipeView.generateErrorMarkUp(err.message);
  }
};

// function to call on hashchange and load event and any other event happening on the page
const init = function () {
  bookmarkView.addHandlerRender(controlBookM);
  recipeview.addHandlerRender(controlRecipe);
  recipeview.addUpdateHandlerEvent(controlServings);
  recipeview.addHandlerBookmark(controlBookmark);
  searchView.addHandlerEvent(controlSearchResults);
  paginationView.addHandlerRender(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  // controlServings();
};

init();
