import { el } from '../libs/redom.es.min.js';

export default class {
    constructor(cnt) {
        this.initialCountBombs = cnt //количество бомб на поле
        this.countBombs = cnt
        this.fst_digit = Math.floor(this.countBombs / 100) //первая числа счетчика
        this.scd_digit = Math.floor(this.countBombs / 10) //вторая числа счетчика
        this.trd_digit = this.countBombs % 10 //третья числа счетчика
        this.fst = el('div', { class: `counter__fst digit digit${this.fst_digit}` }) //элемент первой цифры
        this.scd = el('div', { class: `counter__scd digit digit${this.scd_digit}` }) //элемент второй цифры
        this.trd = el('div', { class: `counter__trd digit digit${this.trd_digit}` }) //элемент третьей цифры
    }

    //геттер возвращающий html-элемент счетчика
    get element() {
        return el('div', { class: 'counter game__counter' }, [this.fst, this.scd, this.trd])
    }

    //обновление (отрисовка) счетчика
    update() {
        this.fst.classList.remove(`digit${this.fst_digit}`)
        this.scd.classList.remove(`digit${this.scd_digit}`)
        this.trd.classList.remove(`digit${this.trd_digit}`)
        this.fst_digit = Math.floor(this.countBombs / 100)
        this.scd_digit = Math.floor(this.countBombs / 10 % 10)
        this.trd_digit = this.countBombs % 10
        this.fst.classList.add(`digit${this.fst_digit}`)
        this.scd.classList.add(`digit${this.scd_digit}`)
        this.trd.classList.add(`digit${this.trd_digit}`)
    }

    //убавление счетчика
    reduce() {
        this.countBombs--
        this.update()
    }

    //добавление счетчика
    add() {
        this.countBombs++
        this.update()
    }

    // сброс счетчика
    reset() {
        this.countBombs = this.initialCountBombs
        this.update()
    }
}
