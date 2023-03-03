import { el } from '../libs/redom.es.min.js';

export default class {
    constructor(onclick) {
        this.element = this.#createElement(onclick) //html-элемент смайлика
    }

    //приватный метод cоздания html-элемента смайлика
    #createElement(f) {
        const element = el('button', { class: 'game__mood mood_smile' })
        element.addEventListener('click', f)
        return element
    }

    //изменение выражние улыбки на испуг
    shock() {
        this.element.classList.remove('mood_smile')
        this.element.classList.add('mood_shock')
    }

    //изменение выражние испуга, крутого, грустного на улыбку
    smile() {
        this.element.classList.remove('mood_cool')
        this.element.classList.remove('mood_dead')
        this.element.classList.remove('mood_shock')
        this.element.classList.add('mood_smile')
    }

    //изменение выражние улыбки на грусть
    dead() {
        this.element.classList.remove('mood_smile')
        this.element.classList.add('mood_dead')
    }

    //изменение выражние улыбки на крутого
    cool() {
        this.element.classList.remove('mood_smile')
        this.element.classList.remove('mood_shock')
        this.element.classList.add('mood_cool')
    }
}