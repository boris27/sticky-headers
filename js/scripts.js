const stickyContainer = document.querySelectorAll('[data-sticky-container]')[0]; // Определяем контейнер для sticky элементов

stickyContainer.stickyKey = stickyContainer.getAttribute('data-sticky-container'); // Сохраняем ключ для идентификации sticky элементов
stickyContainer.cssProps = window.getComputedStyle(stickyContainer);

const stickyElems = document.querySelectorAll(`[data-sticky="${stickyContainer.stickyKey}"]`); // Определяем sticky элементы
// это сделано для того. чтобы можно было создавать несколько параллельных или вложенных модулей
let stickyNumber = -1;

stickyContainer.addEventListener('scroll', function () {
    // проверяем взаимное расположение элементов относительно контейнера
    let topPosition = this.getBoundingClientRect().top;
    let fixedStickyNumber = stickyNumber;   //сохраняем номер текущего фиксированного элемента
    switch (stickyNumber) {
        case -1: { // фиксированных элементов нет
            let elemTopPosition = stickyElems[0].getBoundingClientRect().top;
            if(elemTopPosition - topPosition <= 0) {
                checkSticky(stickyElems[0], 0 ,  topPosition);
            }
            break;
        }
        case 0: { // фиксированн первый элемент
            for(let i = fixedStickyNumber; i <= fixedStickyNumber + 1; i++) {
                let elemTopPosition = stickyElems[i].getBoundingClientRect().top;
                if(elemTopPosition - topPosition <= 0) {
                    checkSticky(stickyElems[i], i, topPosition);
                }
            }
            break;
        }
        case stickyElems.length - 1: { // фиксированн последний элемент
            for (let i = stickyElems.length - 2; i <= stickyElems.length - 1; i++ ) {
                let elemTopPosition = stickyElems[i].getBoundingClientRect().top;
                if(elemTopPosition - topPosition <= 0) {
                    checkSticky(stickyElems[i], i, topPosition);
                }
            }
            break;
        }
        default: {
            for(let i = fixedStickyNumber - 1; i <= fixedStickyNumber + 1; i++) {
                let elemTopPosition = stickyElems[i].getBoundingClientRect().top;
                if(elemTopPosition - topPosition <= 0) {
                    checkSticky(stickyElems[i], i, topPosition);
                }
            }
            break;
        }
    }

    /* for(let i = 0; i < stickyElems.length; i++) {
        let elemTopPosition = stickyElems[i].getBoundingClientRect().top;
        if(elemTopPosition - topPosition <= 0) {
            checkSticky(stickyElems[i], i , topPosition);
        }
    } */
});

function checkSticky(elem, number, position) {
    // проверяем является ли элемент sticky
    if(!elem.stickyFixed) {

        // создаем якорь который заменит sticky элемент в DOM на время его sticky)
        // использование элемента якоря вместо изменения padding и margin обуславливается тем что
        // padding или margin уже могут быть настроены и мы таким образом сломаем верстку
        let anchorElem = document.createElement('div');
        anchorElem.style.visibility = 'hidden';
        anchorElem.style.height = `${elem.offsetHeight}px`;
        anchorElem.setAttribute('data-sticky-anchor', 'set');
        elem.stickyFixed = true;

        elem.parentElement.prepend(anchorElem);

        elem.style.position = 'fixed';
        elem.style.top = `${position}px`;
        elem.style.width = stickyContainer.cssProps.width;
        stickyNumber = number;

    } else {
        //если элемент sticky возвращаем ему его позицию в DOM, получаем его якорь и удаляем его
        let anchorElem = elem.parentElement.querySelector('[data-sticky-anchor]');
        let anchorTopPosition = anchorElem.getBoundingClientRect().top;

        if(anchorTopPosition - position > 0) {
            elem.parentElement.removeChild(anchorElem);

            elem.style.position = '';
            elem.style.top = '';
            elem.style.width = '';
            elem.stickyFixed = false;
            stickyNumber = number - 1;
        }
    }
}

window.addEventListener('resize', function () {
    // при изменении окна браузера делаем пересчет размеров и ручную прокрутку чтобы инициализировать корректное стикирование элементов
    let topContainerPosition = stickyContainer.getBoundingClientRect().top;
    stickyContainer.cssProps = window.getComputedStyle(stickyContainer);

    stickyElems.forEach(function (elem) {
        if(elem.stickyFixed) {
            elem.style.top = `${topContainerPosition}px`;
            elem.style.width = stickyContainer.cssProps.width;
        }
    });

    stickyContainer.scrollTop -= 1;
});