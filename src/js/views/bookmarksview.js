import View from './view';
import preview from './previewView';

//importing the Icons  and external libary(fractional)
//import icons from 'url:../../img/icons.svg';

class bookmarkView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _message = '';
  _errorMessage = 'No Results to Display! Try another Recipe';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkUp() {
    return this._data.map(result => preview.render(result, false)).join('');
  }
}

export default new bookmarkView();
