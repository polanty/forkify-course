class searchView {
  #parentEl = document.querySelector('.search');

  getSearchQuery() {
    const query = this.#parentEl.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }

  _clearInput() {
    this.#parentEl.querySelector('.search__field').value = '';
  }

  addHandlerEvent(handler) {
    this.#parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new searchView();
