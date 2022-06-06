import View from './view';
import previewView from './previewView';
import icons from 'url:../../img/icons.svg';

class resultView extends View {
  _parentElement = document.querySelector('.results');
  _message = '';
  _errorMessage = 'No Results to Display! Try another Recipe';

  _generateMarkUp() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new resultView();
