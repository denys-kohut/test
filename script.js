//зробив глобальний обєкт з певними конфігураціями по грі
let confitGame = {
    canPlay: true,
    arrCountChips: [],
    sumRed: 0,
    sumBlack: 0,
    sumGreen: 0,
    budget: 0
}
//запускаємо гру
toGame();

//фунція запускає гру
function toGame() {
    setTimeout(() => askBudget(), 1500);
}

//функція спілкується з користувачем
function askBudget(text = "Привіт! Перевіримо удачу чи свою інтуіцію? Давай спробуємо! Вкажи свій бюджет, тільки врахуй, що у нас мінімальна ставка 5$ і давай будемо грати на суму не більше ніж 5000$.") {
    confitGame.budget = +prompt(text);
    let expressionsСroupiers = {
        wordsСroupier: "До зустрічі! =)",
        letsPlay: `Привіт! Я буду твоїм круп'є! Давай по правилам пройдемось - тобі потрібно лише обрати колір, поставивши на нього скільки фішок, скільки вважаєш за потрібним і натиснути кнопку "play", а далі я вже крутну барабан і подивимось чи в тебе гарна інтуіція!Якщо виграєш, то ставка подвоюється, коли виграєш 20000$ ти зірвеш наш Джекпот!`,
        go: "І так поїхали, перетягуй фішки на колір і натискай кнопку!",
        winRate: "Вов! Твоя ставка зіграла! Вітаю! Ставка була подвоєна! Можеш продовжувати ставити на бажаний колір! =)",
        notWinRate: "Нажаль не пощастило... Наступного разу спробуй уважніше слухати інтуіцію!",
        notWin: "Нажаль, грошей для ставок вже немає! Остання ставка не зайшла... Сподіваюсь пощастить наступного разу!",
        win: "Ура!!! Здається у нас новий чемпіон! Шкода, що це лише гра і у нас не можна вевести готівку ... =)"
    }
    let textForUser = {
        textGoodBye: "Сподіваюсь зіграємо іншим разом! До зустрічі!",
        notNamber: "Вкажи лише суму, слова тут зайві ! =)",
        goodRes: `Є! Дякую!`,
        badTextBudget: `Давай ще раз по умовам! Вкажи число кратне 5 і не быльше 5000! =)`
    }
    if (!confitGame.budget) {
        alert(textForUser.textGoodBye)
        changeClass("speak", "speak-passive")
        changeText(expressionsСroupiers.wordsСroupier, "speak", "speak-passive");
        confitGame.canPlay = false;
    } else {
        if (!`${confitGame.budget}`.match(/^\d+$/)) {
            askBudget(textForUser.notNamber)
        } else if (confitGame.budget % 5 !== 0 || confitGame.budget > 5000) {
            askBudget(textForUser.badTextBudget)
        } else {
            alert(textForUser.goodRes);
            changeClass("speak", "speak-passive")
            changeText(expressionsСroupiers.letsPlay, "speak", "speak-passive");
            confitGame.arrCountChips = getCountChips(confitGame.budget);
            creationImgChips(confitGame.arrCountChips);
            //дії на клік на кнопку
            let btn = document.getElementById("btn");
            btn.addEventListener("click", function () {
                let res = spinCircle(confitGame.lastRes)
                let color = getColorCircle(res);
                let summRate;
                //перевіряємо результат, засунув в сет таймаут, щоб дочекатись коли колесу докрутиться
                setTimeout(() => { if ((color == "black" && confitGame.sumBlack > 0) || (color == "red" && confitGame.sumRed > 0)) {
                    //ставка зайшла
                    changeClass("speak", "speak-passive")
                    changeText(expressionsСroupiers.winRate, "speak", "speak-passive");
                    summRate = confitGame.sumBlack > 0 ? confitGame.sumBlack : confitGame.sumRed;
                    confitGame.budget = confitGame.sumGreen + summRate * 2;
                    dellСhips();
                    confitGame.arrCountChips = getCountChips(confitGame.budget);
                    creationImgChips(confitGame.arrCountChips);

                } else {
                    //ставка не зайшла
                    changeClass("speak", "speak-passive")
                    changeText(expressionsСroupiers.notWinRate, "speak", "speak-passive");
                    summRate = confitGame.sumBlack > 0 ? confitGame.sumBlack : confitGame.sumRed;
                    confitGame.budget -= summRate;
                    dellСhips();
                    confitGame.arrCountChips = getCountChips(confitGame.budget);
                    creationImgChips(confitGame.arrCountChips);

                }
                //перевіряємо що там в клієнта по результату вийшло
                if (!confitGame.budget) {
                    changeClass("speak", "speak-passive")
                    changeText(expressionsСroupiers.notWin, "speak", "speak-passive");
                    
                    confitGame.canPlay = false
                } else if (confitGame.budget >= 20000) {
                    changeClass("speak", "speak-passive")
                    changeText(expressionsСroupiers.win, "speak", "speak-passive");
                    confitGame.canPlay = false;

                }
                removeClassName("active-color");
                removeClassName("passive");}, 5500);
                removeClassByClass("btn", "active")
            });
        }
    };
}

//функція крутить колесо
function spinCircle() {
    let randomNumber = randomInteger(720, 1800);
    let circle = document.getElementById("circle");
    circle.style.transform = `rotate(${randomNumber}deg)`;
    return randomNumber;

}
//функція перевіряє результат 
function getColorCircle(resReg) {
    //перевіряємо чи ділиться значення на 360
    let multiplier = Math.trunc(resReg / 360);
    if (multiplier > 1) {
        resReg -= multiplier * 360;
    }
    if (resReg >= 0 && resReg <= 45) {
        return "black"
    } else if (resReg >= 45 && resReg <= 135) {
        return "red"
    } else if (resReg >= 135 && resReg <= 225) {
        return "black"
    } else if (resReg >= 225 && resReg <= 315) {
        return "red"
    } else {
        return "black"
    }
}
//генерує випадкове число в інтервалі
function randomInteger(min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}

//функція або додає або видаляє клас
function changeClass(idParent, className) {
    let elem = document.getElementById(idParent);
    elem.classList.toggle(className);
}


//функція відмальовує фішки
function creationImgChips(arr) {
    let objChips = {
        "5": "./img/5.png",
        "10": "./img/10.png",
        "25": "./img/25.png",
        "100": "./img/100.png",
    }
    for (let i = 0; i < arr.length; i++) {
        for (let n = 1; n <= arr[i].count; n++) {
            createElemChips(`chips ${arr[i].className}`, "balans", objChips[arr[i].key], arr[i].key)
        }
    }
}

//функція формує фішки, пропорції сам накидав, щоб різні були
function getCountChips(summ) {
    let count100 = 0;
    let count25 = 0;
    let count10 = 0;
    let count5 = 0;
    let balanceAmount = summ;
    if (balanceAmount >= 100){
        count100 = Math.trunc((summ * 0.6) / 100);
        if (count100 > 0) {
            balanceAmount = summ - (count100 * 100);
        } 
    }
    if (balanceAmount>=25){
        count25 = Math.trunc((balanceAmount * 0.5) / 25);
        if (count25 > 0) {
            balanceAmount = balanceAmount - (count25 * 25);
        } 
    }
    if (balanceAmount >= 10) {
        count10 = Math.trunc((balanceAmount * 0.5) / 10);
        if (count10 > 0) {
            balanceAmount = balanceAmount - (count10 * 10);
        } 
    }
    count5 = balanceAmount / 5;
    changeText(`${summ}$`, "balans-user")
    return [
        {
            "key": "100",
            "count": count100,
            "className": "chips100"
        },
        {
            "key": "25",
            "count": count25,
            "className": "chips25"
        },
        {
            "key": "10",
            "count": count10,
            "className": "chips10"
        },
        {
            "key": "5",
            "count": count5,
            "className": "chips5"
        }
    ]
}


//функція перевіряє куди почали робити ставки
function checkСoordinates(elem) {
    var rect = elem.getBoundingClientRect();
    let elemRed = document.getElementById("red").getBoundingClientRect();
    let elemBlack = document.getElementById("black").getBoundingClientRect();
    if (rect.top >= elemRed.top && rect.bottom <= elemRed.bottom && rect.left >= elemRed.left && rect.right <= elemRed.right) {
        elem.setAttribute("data-color", "red");
    } else if (rect.top >= elemBlack.top && rect.bottom <= elemBlack.bottom && rect.left >= elemBlack.left && rect.right <= elemBlack.right) {
        elem.setAttribute("data-color", "black");
    } else {
        elem.setAttribute("data-color", "green");
    }
}

//функція підраховує баланси для запасу і ставки
function getSummBalans() {
    let sumRed = 0;
    confitGame.sumRed=0;
    let sumBlack = 0;
    confitGame.sumBlack =0;
    let sumGreen = 0;
    let elemRed = document.querySelectorAll('[data-color="red"]');
    elemRed.forEach(el => {
        sumRed += +el.getAttribute('data-summ')
        confitGame.sumRed = sumRed;

    })
    let elemBlack = document.querySelectorAll('[data-color="black"]');
    elemBlack.forEach(el => {
        sumBlack += +el.getAttribute('data-summ')
        confitGame.sumBlack = sumBlack;
    })

    let elemGreen = document.querySelectorAll('[data-color="green"]');
    elemGreen.forEach(el => {
        sumGreen += +el.getAttribute('data-summ')  
        confitGame.sumGreen = sumGreen
    })
    if (sumRed > 0) {
        addClassById("black", "passive");
        addClassById("red", "active-color");
        //не світимо кнопку плей, якщо гра скінчилась
        if (confitGame.canPlay) {
            addClassById("btn", "active");
        }

    } else if (sumBlack > 0) {
        addClassById("red", "passive");
        addClassById("black", "active-color");
        //не світимо кнопку плей, якщо гра скінчилась
        if (confitGame.canPlay) {
            addClassById("btn", "active");
            // changeClass("btn", "pasive-btn")
        }
    } else {
        removeClassName("active-color");
        removeClassName("passive");
        removeClassName("active");
    }
    changeText(`${sumGreen}$`, "balans-user");
    return {
        sumRed: sumRed,
        sumBlack: sumBlack,
        sumGreen: sumGreen
    }

}

//функція видаляє елементи
function dellСhips() {
    let elem = document.querySelectorAll('.chips ');
    elem.forEach(el => {
        el.remove();
    })

}

//генеруємо фішки і навішуємо на них можливість переміщення
function createElemChips(className, idParent, url, summ) {
    let elemidParent = document.getElementById(idParent);
    let elem = document.createElement("img");
    elem.setAttribute("src", url);
    elem.className = className;
    elem.setAttribute("alt", "chips");
    elem.setAttribute("data-summ", summ);
    elem.setAttribute("data-color", "green");
    let offsetX;
    let offsetY;
    elem.addEventListener("dragstart", function (event) {
        offsetX = event.offsetX;
        offsetY = event.offsetY;
        addClassByClass("speak", "speak-passive")
    })
    elem.addEventListener("dragend", function (event) {
        elem.style.top = `${event.pageY - offsetY}px`;
        elem.style.left = `${event.pageX - offsetX}px`;
        checkСoordinates(elem);
        getSummBalans();
        console.log(confitGame)
    })
    elemidParent.appendChild(elem);
}


//функція додає клас по className
function addClassByClass(classNameElem, classNameAdd) {
    if (classNameElem) {
        let elem = document.getElementsByClassName(classNameElem);
        for (let i = 0; i < elem.length; i++) {
            elem[i].classList.add(classNameAdd);
        }
    }
}

//функція видаляє клас по className
function removeClassName(classNameRemove) {
    let elem = document.querySelectorAll(`.${classNameRemove}`);
    elem.forEach(el => {
        el.classList.remove(classNameRemove);
    })
}
//функція додає  клас по id
function addClassById(id, className) {
    if (id) {
        let elem = document.getElementById(id);
        elem.classList.add(className);
    }
}


//функція видаляє клас 
function removeClassByClass(id, classNameRemove) {
    if (id) {
        let elem = document.getElementById(id);
            elem.classList.remove(`${classNameRemove}`);
    }
}
//функція виводить текст по словам
function changeText(text, id, classNameRemove = false) {
    if (id) {
        let elem = document.getElementById(id);
        if (classNameRemove) {
            removeClassName(classNameRemove);
        }
        elem.innerHTML = text;
    }

};


// перше завдання
let year = 1900;

while (year <= 2100) {
    if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) {
        console.log(year + " - високосний");
    } else {
        console.log(year + " - не високосний");
    } 
    year++;
}

