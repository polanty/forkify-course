import { API_URL, PaginationNum, KEY } from './config.js';
// import { getJSON, sendJSON } from './helpers.js';
import { AJAX } from './helpers.js';

export const state = {
  recipe: {},
  searchResult: {
    results: [],
    query: '',
    page: 1,
    resultsPerPage: PaginationNum,
  },
  bookmarked: [],
};

export const createRecipeData = function (data) {
  const { recipe } = data.data;

  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    // step 1: loading recipe
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    // assign the returned object to the data
    state.recipe = createRecipeData(data);

    if (state.bookmarked.some(bookmark => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }
  } catch (err) {
    console.log(`err ${err.status}`);
    throw err;
  }
};

export const LoadSearchResults = async function (query) {
  try {
    state.searchResult.query = query;

    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    // MAP EACH ELEMENT of the api array to rename each into an object named by myself
    state.searchResult.results = data.data.recipes.map(obj => {
      return {
        id: obj.id,
        title: obj.title,
        publisher: obj.publisher,
        image: obj.image_url,
        ...(recipe.key && { key: recipe.key }),
      };
    });
    state.searchResult.page = 1;
  } catch (err) {
    console.log(`err ${err.status}`);
    throw err;
  }
};

export const getPaginationPages = function (page = state.searchResult.page) {
  // storing the current page  of pagination
  state.searchResult.page = page;

  const start = (page - 1) * state.searchResult.resultsPerPage; //0;
  const end = page * state.searchResult.resultsPerPage; //9;

  return state.searchResult.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings;
};

const persisitBookMarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarked));
};

export const addbookmark = function (recipe) {
  // all bookmarked recipe should be pushed into an array
  state.bookmarked.push(recipe);
  // mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persisitBookMarks();
};

export const delbookmark = function (id) {
  // loop through the bookmark and delete the element with matching  id
  const index = state.bookmarked.findIndex(el => el.id === id);
  state.bookmarked.splice(index, 1);

  //unmark deleted element from bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persisitBookMarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarked = JSON.parse(storage);
};

init();

const clearBookM = function () {
  localStorage.clear('bookmarks');
};

// upload recipe to the api
export const upLoadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        //const ingArr = ing[1].replaceAll(' ', '').split(',');
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong Ingredient format! Please enter the correct format'
          );
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeData(data);
    addbookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
