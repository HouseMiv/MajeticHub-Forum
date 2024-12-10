const punishStack = () => {
    const field = document.getElementById('id_punishField').value;
    const regex = /(?:(?:ID|PUNISH|TIME|NAME):[^;]*;){4}/gm; // Допущено, что TIME может быть пустым
    let m, result = '';

    while ((m = regex.exec(field)) !== null) {
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        m.forEach((match) => {
            result += match;
        });
    }

    let fieldArr = result.split(';').filter(Boolean); // Удаляем пустые элементы массива
    let idArr = [];
    let punishArr = [];
    let timeArr = [];
    let nameArr = [];
    let resultArr = [];

    for (let i = 0; i < fieldArr.length; i++) {
        if (fieldArr[i].includes('ID:')) idArr.push(fieldArr[i]);
        else if (fieldArr[i].includes('PUNISH:')) punishArr.push(fieldArr[i]);
        else if (fieldArr[i].includes('TIME:')) timeArr.push(fieldArr[i]);
        else if (fieldArr[i].includes('NAME:')) nameArr.push(fieldArr[i]);
    }

    for (let i = 0; i < idArr.length; i++) {
        let id = idArr[i].split(':')[1]?.trim(); // Получаем значение ID
        let punish = punishArr[i].split(':')[1]?.trim(); // Получаем значение наказания
        let time = timeArr[i]?.split(':')[1]?.trim(); // Получаем значение TIME (может быть пустым)
        time = time ? parseInt(time) : null; // Преобразуем время в число или оставляем null

        // Ограничения времени для различных наказаний
        if (punish === '/ajail' && time > 720) time = 720;
        else if ((punish === '/ban' || punish === '/hardban' || punish === '/gunban') && time > 9999) time = 9999;
        else if (punish === '/mute' && time > 720) time = 720;

        // Обработка случая для warn
        if (punish === 'warn' || punish === '/warn') {
            resultArr.push({ id, punish, time: null, name: [nameArr[i].split(':')[1]?.trim()] });
            continue;
        }

        // Для остальных наказаний проверяем на совпадение ID и типа наказания
        let index = resultArr.findIndex(item => item.id === id && item.punish === punish);

        if (index !== -1) {
            resultArr[index].time += time; // Суммируем время для одинаковых наказаний и ID
            resultArr[index].name.push(nameArr[i].split(':')[1]?.trim()); // Добавляем новую жалобу к уже существующему списку
        } else {
            resultArr.push({ id, punish, time, name: [nameArr[i].split(':')[1]?.trim()] });
        }
    }

    // Сортировка наказаний в заданном порядке
    const order = ['ajail', 'ban', 'hardban', 'gunban', 'mute', 'warn'];
    resultArr.sort((a, b) => {
        if (a.punish === 'ajail' && b.punish === 'ajail') {
            return b.time - a.time; // Сортируем от большего к меньшему времени для ajail
        } else {
            return order.indexOf(a.punish) - order.indexOf(b.punish);
        }
    });

    // Отображение результатов
    let output = '';
    for (let i = 0; i < resultArr.length; i++) {
        let { id, punish, time, name } = resultArr[i];

        let plural = name.length === 1 ? 'Жалоба' : 'Жалобы';
        if (punish === 'warn' || punish === '/warn') {
            // Отображение для warn без времени
            output += '<tr class="table__row"><td>/' + punish + ' ' + id + ' ' + plural + ' ' + name.join(', ') + '</td></tr>';
        } else {
            // Отображение для остальных типов наказаний
            output += '<tr class="table__row"><td>/' + punish + ' ' + id + ' ' + (punish === '/gunban' ? 'бесконечно' : time.toString()) + ' ' + plural + ' ' + name.join(', ') + '</td></tr>';
        }
    }
    document.getElementById('id_resultTable').innerHTML = output;
};
