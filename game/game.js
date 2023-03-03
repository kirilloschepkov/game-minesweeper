import { el, setChildren } from './scripts/libs/redom.es.min.js';
import onloadStyle from './scripts/libs/onload_style.js'
import Counter from './scripts/classes/Counter.js'
import Mood from './scripts/classes/Mood.js'
import Timer from './scripts/classes/Timer.js'
import Cell from './scripts/classes/Cell.js'

document.oncontextmenu = function () { return false }; //отключение контекстного меню

const COUNT_BOMBS = 40

function getBombs() { //получение массива с индексами бомб
    let bombs = []
    while (bombs.length < COUNT_BOMBS) {
        const rn = Math.floor(Math.random() * 256)
        if (bombs.indexOf(rn) == -1) bombs.push(rn)
    }
    return bombs
}

function openCell(cell, cells) { //рекурсивая функция открытия клеток
    if (cell.status != 'default') return //выход из рекурсии
    cell.open() //открытие клетки (появление цифры, означающее количество бомб рядом)
    if (cell.countBombs == 0) { //если рядом бомб нет, то открываем соседние клетки
        cell.neighbors.forEach(neighbor => openCell(cells[neighbor], cells))
    }
}

function checkWin(cells) {
    return cells
        .every(cell => cell.countBombs != 9 && cell.status == cell.countBombs || cell.countBombs == 9) //проверка, что никакая клетка не является неоткрытой
}

function win(mood, timer, field, bombs, cells) {
    mood.cool() //меняет смайлик на "крутой"
    timer.stop() //останавливаем таймер
    bombs.map(i => { //открываем бомбы
        if (cells[i].status == 'flag')
            cells[i].defuse()
        else if (cells[i].status == 'default')
            cells[i].open()
    })
    const children = field.childNodes //отключаем нажание клеток
    for (let j = 0; j < children.length; j++)
        children[j].disabled = true
}

function startGame(counter, mood, timer, field, fromRestart) {
    let cells = []
    let bombs = getBombs() //получаем бомбы
    for (let i = 0; i < 16 * 16; i++) cells.push(new Cell( //создаем экземпляр клетки с передачей параметров: индекса, бомб, функии по клику правой и левой клавишей мыши
        i,
        bombs,
        function (cell) {
            if (timer.time == 0) { //первый клик
                timer.start()
                if (cell.countBombs == 9) { //первый клик на бомбе, 9 - бомба
                    let flags = cells //сохраняет выставленные флаги
                        .filter(cell => cell.status == 'flag')
                        .map(cell => cell.index)
                    startGame(counter, mood, timer, field, [cell.index, flags]) //перезапуск игру с передачей параметров текущей игры
                    return
                }
            }
            if (cell.status == 'default') {
                cells.forEach(cell => { if (cell.status == 'question') cell.flag() }) //убираем все неподтвержденные вопросы
                if (cell.countBombs != 9) openCell(cell, cells) //запускаем рекурсивную функцию открытия клеточек
                else { //проигрыш
                    cell.active() //меняем клетку на взовранную бомбу
                    mood.dead() //смайлик на грустный
                    bombs.map(i => { //открываем бомбы
                        if (cells[i].status == 'flag')
                            cells[i].defuse()
                        else if (cells[i].status == 'default')
                            cells[i].open()
                    })
                    const children = field.childNodes //отключаем нажание клеток
                    for (let j = 0; j < children.length; j++)
                        children[j].disabled = true
                    timer.stop() //останавливаем таймер
                }
            } else if (cell.status == 'question') {
                counter.add() //добавляем счетчик бомб
                cell.default() //меняем клетка на неоткрытую
            }
            if (checkWin(cells)) win(mood, timer, field, bombs, cells) //проверка победы
        },
        function (cell) {
            if (cell.status == 'default' && counter.countBombs > 0) { //ставим флаг
                cells.forEach(cell => { if (cell.status == 'question') cell.flag() }) //убираем все неподтвержденные вопросы
                counter.reduce() //вычитаение счетчика бомб
                cell.flag() //меняет неоткрытую клетку на флаг
            }
            else if (cell.status == 'flag') cell.question() //меняет флаг на вопрос при повторном нажатии правой клавишей мыши
            else if (cell.status == 'question') {
                counter.add() //добавляем счетчик бомб
                cell.default() //меняем клетка на неоткрытую
            }
        }
    ))
    setChildren(field, cells.map(cell => cell.element)) //устанавливаем клетки в поле
    if (fromRestart) { //проверка перезапуска предыдущей игры
        const [index, flags] = fromRestart
        if (cells[index].countBombs == 9) { //если после пересоздания поля на нажатой клетке опять появилась бомба
            startGame(counter, mood, timer, field, fromRestart) //перезапуск текущей игры
            return
        }
        flags.forEach(index => cells[index].flag()) //выставление флагов
        openCell(cells[index], cells) //открытие клеток
    }
}

function createGame(container) {
    function newGame() { //вспомогательная функция перезапуска игры
        counter.reset()
        mood.smile()
        timer.reset()
        startGame(counter, mood, timer, field)
    }

    const counter = new Counter(COUNT_BOMBS), //инициализация элементов игры
        mood = new Mood(newGame),
        timer = new Timer(),
        field = el('div', { class: 'game__field' })

    field.addEventListener('mousedown', () => { mood.shock() }) //смена смайлика на испуганного
    field.addEventListener('mouseup', () => { mood.smile() })

    setChildren(container, el('div', { class: 'game' }, [
        el('div', { class: 'game__header' }, [
            counter.element,
            mood.element,
            timer.element
        ]),
        field]
    )) //добавление элеменов в DOM-дерево

    startGame(counter, mood, timer, field) //запуск игры
}

export default (insertSelector) => {
    const insertBlock = document.querySelector(insertSelector);
    onloadStyle('./game/styles/style.css'); //загрузка стилей игры в DOM-дерево
    createGame(insertBlock) //создание игры
};