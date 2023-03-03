import { el } from '../libs/redom.es.min.js';

export default class {
    constructor() {
        this.time = 0
        this.timer = null
        this.fst_digit = 0 //первая цифра секундомера, далее соответствующе
        this.scd_digit = 0
        this.trd_digit = 0
        this.fst = el('div', { class: 'timer__fst digit digit0' }) //html-элемент первой цифры секундомера, далее соответствующе 
        this.scd = el('div', { class: 'timer__scd digit digit0' })
        this.trd = el('div', { class: 'timer__trd digit digit0' })
    }

    get element() {
        return el('div', { class: 'timer game__timer' }, [this.fst, this.scd, this.trd]) //html-элемент секундамера
    }

    //обновление (отрисовка) секундомера
    update() {
        this.fst.classList.remove(`digit${this.fst_digit}`)
        this.scd.classList.remove(`digit${this.scd_digit}`)
        this.trd.classList.remove(`digit${this.trd_digit}`)
        this.fst_digit = Math.floor(this.time / 100)
        this.scd_digit = Math.floor(this.time / 10 % 10)
        this.trd_digit = this.time % 10
        this.fst.classList.add(`digit${this.fst_digit}`)
        this.scd.classList.add(`digit${this.scd_digit}`)
        this.trd.classList.add(`digit${this.trd_digit}`)
    }

    //запуск секундомера
    start() {
        this.stop()
        this.update()
        this.time++
        this.timer = setInterval(() => {
            if (this.time >= 1000) this.time = 0
            this.update()
            this.time++
        }, 1000)
    }

    //остановка секундомера
    stop() {
        clearInterval(this.timer)
    }

    //сброс секундомера
    reset() {
        clearInterval(this.timer)
        this.time = 0
        this.update()
    }
}