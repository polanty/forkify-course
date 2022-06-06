import icons from 'url:../../img/icons.svg';

export default class View {
  _data;
  renderSpinner() {
    const markUp = `
               <div class="spinner">
                  <svg>
                    <use href="${icons}#icon-loader"></use>
                  </svg>
                </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markUp);
  }

  generateErrorMarkUp(message = this._errorMessage) {
    const markUp = `
            <div class="error">
            <div>
              <svg>
                <use href=${icons}#icon-alert-triangle></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
        `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markUp);
  }

  generateMessageMarkUp(message = this._Message) {
    const markUp = `
            <div class="error">
            <div>
              <svg>
                <use href=${icons}#icon-smile></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
        `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markUp);
  }
  render(data, render = true) {
    this._data = data;
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.generateErrorMarkUp();

    const markUpHtml = this._generateMarkUp();
    if (!render) return markUpHtml;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markUpHtml);
  }

  UpdatemarkUpHtml(data) {
    this._data = data;
    const newMarkUp = this._generateMarkUp();

    const newDOM = document.createRange().createContextualFragment(newMarkUp);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElement = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = curElement[i];
      //Update changed texts
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }
      //Update changed texts
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(atrr => {
          curEl.setAttribute(atrr.name, atrr.value);
        });
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }
}
