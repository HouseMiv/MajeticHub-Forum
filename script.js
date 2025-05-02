const punishStack = () => {
    const field = document.getElementById('id_punishField');
    const resultTable = document.getElementById('id_resultTable');
    const resultsContainer = document.getElementById('id_resultsContainer');
    const copyButton = document.querySelector('.copy-button');
    const resultsCase = document.querySelector('.results-case');
    
    // Очищаем только содержимое таблицы
    resultTable.innerHTML = '';
    // Не скрываем блок результатов и кнопку копирования сразу
    // copyButton.style.display = 'none';
    // resultsContainer.classList.remove('visible');
    // resultsCase.classList.remove('visible');
    
    // Validate input
    if (!field.value.trim()) {
        copyButton.style.display = 'none';
        resultsContainer.classList.remove('visible');
        resultsCase.classList.remove('visible');
        showError('Пожалуйста, введите данные');
        return;
    }

    const regex = /(?:(?:ID|PUNISH|TIME|NAME):[^;]*;){4}/gm;
    let m, result = '';

    while ((m = regex.exec(field.value)) !== null) {
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        m.forEach((match) => {
            // Проверяем, что строка не состоит только из пустых значений
            if (!match.match(/ID:;PUNISH:;TIME:;NAME:;/)) {
            result += match;
            }
        });
    }

    if (!result) {
        showError('Неверный формат данных');
        return;
    }

    let fieldArr = result.split(';').filter(Boolean);
    let idArr = [];
    let punishArr = [];
    let timeArr = [];
    let nameArr = [];
    let resultArr = [];

    for (let i = 0; i < fieldArr.length; i++) {
        if (fieldArr[i].includes('ID:')) {
            const id = fieldArr[i].split(':')[1]?.trim();
            if (id) idArr.push(fieldArr[i]);
        }
        else if (fieldArr[i].includes('PUNISH:')) {
            const punish = fieldArr[i].split(':')[1]?.trim();
            if (punish) punishArr.push(fieldArr[i]);
        }
        else if (fieldArr[i].includes('TIME:')) timeArr.push(fieldArr[i]);
        else if (fieldArr[i].includes('NAME:')) {
            const name = fieldArr[i].split(':')[1]?.trim();
            if (name) nameArr.push(fieldArr[i]);
        }
    }

    // Validate arrays length
    if (idArr.length !== punishArr.length || idArr.length !== nameArr.length) {
        showError('Неверный формат данных');
        return;
    }

    for (let i = 0; i < idArr.length; i++) {
        let id = idArr[i].split(':')[1]?.trim();
        let punish = punishArr[i].split(':')[1]?.trim();
        let time = timeArr[i]?.split(':')[1]?.trim();
        time = time ? parseInt(time) : null;

        // Validate ID and punish
        if (!id || !punish) {
            continue; // Пропускаем невалидные записи вместо вывода ошибки
        }

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
            resultArr[index].time += time;
            resultArr[index].name.push(nameArr[i].split(':')[1]?.trim());
        } else {
            resultArr.push({ id, punish, time, name: [nameArr[i].split(':')[1]?.trim()] });
        }
    }

    // Сортировка наказаний в заданном порядке
    const order = ['ajail', 'ban', 'hardban', 'gunban', 'mute', 'warn'];
    resultArr.sort((a, b) => {
        if (a.punish === 'ajail' && b.punish === 'ajail') {
            return b.time - a.time;
        } else {
            return order.indexOf(a.punish) - order.indexOf(b.punish);
        }
    });

    // Отображение результатов
    for (let i = 0; i < resultArr.length; i++) {
        let { id, punish, time, name } = resultArr[i];
        let plural = name.length === 1 ? 'Жалоба' : 'Жалобы';
        
        let row = document.createElement('tr');
        row.className = 'table__row';
        row.style.opacity = '0';
        row.style.transform = 'translateY(20px)';
        
        let cell = document.createElement('td');
        let commandText = '';
        if (punish === 'warn' || punish === '/warn') {
            commandText = `/${punish} ${id} ${plural} ${name.join(', ')}`;
        } else {
            commandText = `/${punish} ${id} ${punish === '/gunban' ? 'бесконечно' : time.toString()} ${plural} ${name.join(', ')}`;
        }
        cell.textContent = commandText;
        row.appendChild(cell);
        resultTable.appendChild(row);
        
        // Анимация появления строки
        setTimeout(() => {
            row.style.transition = 'all 0.3s ease';
            row.style.opacity = '1';
            row.style.transform = 'translateY(0)';
        }, i * 100);
    }

    // Добавляем кнопку копирования всех наказаний
    const resultsHeader = document.querySelector('.results__header');
    resultsHeader.innerHTML = ""; // Очищаем заголовок перед добавлением кнопки

    const copyAllButton = document.createElement('button');
    copyAllButton.className = 'copy-all-button';
    copyAllButton.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg> Копировать все';
    copyAllButton.title = 'Копировать все наказания';
    copyAllButton.onclick = copyAllPunishments;
    
    resultsHeader.appendChild(copyAllButton);

    // Если есть результаты, показываем кнопку копирования и блок
    if (resultArr.length > 0) {
        copyButton.style.display = '';
        setTimeout(() => {
            resultsContainer.classList.add('visible');
            resultsCase.classList.add('visible');
        }, 100);
    } else {
        copyButton.style.display = 'none';
        resultsContainer.classList.remove('visible');
        resultsCase.classList.remove('visible');
    }
};

const copyResult = () => {
    const resultTable = document.getElementById('id_resultTable');
    const rows = resultTable.getElementsByTagName('tr');
    let text = '';
    
    for (let row of rows) {
        text += row.textContent + '\n';
    }
    
    navigator.clipboard.writeText(text).then(() => {
        const copyButton = document.querySelector('.copy-button');
        const originalText = copyButton.textContent;
        copyButton.textContent = 'Скопировано!';
        copyButton.classList.add('success');
        
        setTimeout(() => {
            copyButton.textContent = originalText;
            copyButton.classList.remove('success');
        }, 2000);
    }).catch(err => {
        showError('Не удалось скопировать текст');
    });
};

const copyAllPunishments = () => {
    const resultTable = document.getElementById('id_resultTable');
    const rows = resultTable.querySelectorAll('tr');
    let allCommands = '';
    
    rows.forEach(row => {
        const cell = row.querySelector('td');
        if (cell) {
            const commandText = cell.textContent.trim();
            allCommands += commandText + '\n';
        }
    });
    
    if (allCommands) {
        navigator.clipboard.writeText(allCommands).then(() => {
            const copyAllButton = document.querySelector('.copy-all-button');
            copyAllButton.classList.add('success');
            setTimeout(() => {
                copyAllButton.classList.remove('success');
            }, 1000);
        }).catch(err => {
            console.error('Ошибка при копировании:', err);
        });
    }
};

const showError = (message) => {
    const resultTable = document.getElementById('id_resultTable');
    const resultsContainer = document.getElementById('id_resultsContainer');
    const resultsCase = document.querySelector('.results-case');
    
    resultTable.innerHTML = `<tr class="table__row error-row"><td style="color: #fd1b54; text-align: center;">${message}</td></tr>`;
    
    // Показываем блок результатов с ошибкой
    setTimeout(() => {
        resultsContainer.classList.add('visible');
        resultsCase.classList.add('visible');
    }, 100);
};

// Добавляем обработчик нажатия Enter в поле ввода
document.getElementById('id_punishField').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        punishStack();
    }
});

window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => preloader.remove(), 500);
        }
    }, 1500);
});
