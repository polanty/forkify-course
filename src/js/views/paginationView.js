import View from './view';
import icons from 'url:../../img/icons.svg';

class paginationView extends View {
  _parentElement = document.querySelector('.pagination');

  _generateMarkUp() {
    const currentPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    // this indicate being on the first page
    if (currentPage === 1 && numPages > 1) {
      return `
          <button data-goto=${
            currentPage + 1
          } class="btn--inline pagination__btn--next">
            <span>Page ${currentPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button> 
      `;
    }

    // this indicate being on the last page
    if (currentPage === numPages && numPages > 1) {
      return `
        <button data-goto="${
          currentPage - 1
        }" class="btn--inline pagination__btn--next">
          <span>Page ${currentPage - 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </button> 
      `;
    }

    // other pages inbetween
    if (currentPage < numPages) {
      return `
        <button data-goto="${
          currentPage - 1
        }"class="btn--inline pagination__btn--prev">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${currentPage - 1}</span>
        </button>
        <button data-goto="${
          currentPage + 1
        }" class="btn--inline pagination__btn--next">
          <span>Page ${currentPage + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </button> 
      `;
    }

    return '';
  }

  addHandlerRender(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const clicked = e.target.closest('.btn--inline');
      if (!clicked) return;
      const goto = +clicked.dataset.goto;

      handler(goto);
    });
  }
}

export default new paginationView();
