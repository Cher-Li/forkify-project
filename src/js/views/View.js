// import icons from '../img/icons.svg'; // parcel 1
import { mark } from 'regenerator-runtime';
import icons from 'url:../../img/icons.svg'; // parcel 2, static assets not programming files
// console.log(icons);
// import previewView from './previewView.js'; // ok this line creates circular reference since recipeView imports View.js which imports recipeView again

export default class View {
  // parent class of other view childs
  _data;

  // jsdoc.app, write documentation

  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g. the recipe)
   * @param {boolean} [render = true] If false, create markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup string is returned if render=false
   * @this {Object} View instance
   * @author Cher Li
   * @todo Finish implementation
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);

    // recipeContainer.innerHTML = ''; // remove previous message
    // recipeContainer.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    // if (!data || (Array.isArray(data) && data.length === 0))
    //   return this.renderError();
    // now remove b/c every time open page it tries to load empty array

    this._data = data;
    const newMarkup = this._generateMarkup(); // create new markup then compare w/ old, only change what's changed

    const newDOM = document.createRange().createContextualFragment(newMarkup); // becomes big obj like a virtual DOM so could compare to prev DOM
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    // console.log(newElements);
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    // console.log(curElements);
    // console.log(newElements);
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // console.log(curEl, newEl.isEqualNode(curEl));

      // updates changed text
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        // only change when needed
        // console.log(newEl.firstChild.nodeValue.trim(), 'text');
        curEl.textContent = newEl.textContent;
      }

      // updates changed attributes
      if (!newEl.isEqualNode(curEl)) {
        // console.log(newEl.attributes);
        // console.log(Array.from(newEl.attributes));
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markup = `
    <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div> 
    `;

    // this._parentElement.innerHTML = ''
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
    <div class="error">
      <div>
        <svg>
          <use href="${icons}#icon-alert-triangle"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>
    `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
    <div class="message">
      <div>
        <svg>
          <use href="${icons}#icon-smile"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>
    `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
