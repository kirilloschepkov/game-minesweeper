import { el } from '../libs/redom.es.min.js';

export default class {
    constructor(index, bombs, onclickLeft, onclickRight) {
        this.index = index
        this.neighbors = this.#getNeighbors()
        this.countBomb = this.#getCountBomb(bombs)
        this.status = 'default'
        this.element = this.#createElement(onclickLeft, onclickRight)
    }

    //приватный метод создания html-элемента с инициализаций функций на нажатия клавиш мыши
    #createElement(left, right) { 
        const element = el('button', { class: 'game__cell cell_default' }, this.countBomb)
        element.addEventListener('click', () => { left(this) })
        element.addEventListener('contextmenu', () => { right(this) })
        return element
    }

    //метод "открытия клетки"
    open() {
        this.element.classList.remove(`cell_${this.status}`)
        if (this.countBomb == 9) this.status = 'bomb'
        else this.status = this.countBomb
        this.element.classList.add(`cell_${this.status}`)
        return true
    }

    //метод "выставления" флага на клетку
    flag() {
        this.element.classList.remove(`cell_${this.status}`)
        this.status = 'flag'
        this.element.classList.add(`cell_${this.status}`)
    }

    //метод "выставления" флага на вопроса
    question() {
        this.element.classList.remove(`cell_${this.status}`)
        this.status = 'question'
        this.element.classList.add(`cell_${this.status}`)
    }

    //метод "превращающий" клетку в неоткрытую
    default() {
        this.element.classList.remove(`cell_${this.status}`)
        this.status = 'default'
        this.element.classList.add(`cell_${this.status}`)
    }

    //метод обезврещенной бомбы
    defuse() {
        this.element.classList.remove(`cell_${this.status}`)
        this.status = 'defuse'
        this.element.classList.add(`cell_${this.status}`)
    }

    //метод взовранной бомбы
    active() {
        this.element.classList.remove(`cell_${this.status}`)
        this.status = 'active'
        this.element.classList.add(`cell_${this.status}`)
    }

    //приватный метод для получения количества бомб в соседних клетках
    #getCountBomb(bombs) {
        if (bombs.indexOf(this.index) > -1) return 9
        return this.neighbors.filter(neighbor => bombs.indexOf(neighbor) > -1).length
    }

    //приватный метод получения индексов соседей
    #getNeighbors() {
        if (this.index == 0) return [this.index + 1, this.index + 16, this.index + 17]
        if (this.index == 15) return [this.index - 1, this.index + 15, this.index + 16]
        if (this.index == 240) return [this.index - 16, this.index - 15, this.index + 1]
        if (this.index == 255) return [this.index - 17, this.index - 16, this.index - 1]
        if (this.index % 16 != 0 && (this.index + 1) % 16 != 0) {
            if (0 < Math.floor(this.index / 16) && Math.floor(this.index / 16) < 15) return [this.index - 17, this.index - 16, this.index - 15, this.index - 1, this.index + 1, this.index + 15, this.index + 16, this.index + 17]
            else if (Math.floor(this.index / 16) == 0) return [this.index - 1, this.index + 1, this.index + 15, this.index + 16, this.index + 17]
            else return [this.index - 17, this.index - 16, this.index - 15, this.index - 1, this.index + 1]
        } else if (this.index % 16 == 0) return [this.index - 16, this.index - 15, this.index + 1, this.index + 16, this.index + 17]
        else return [this.index - 17, this.index - 16, this.index - 1, this.index + 15, this.index + 16]
    }
}