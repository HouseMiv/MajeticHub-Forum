const punishStack = () => {
    const field = document.getElementById('id_punishField').value;
    const regex = /(?:(?:ID|PUNISH|TIME|NAME):[^;]+;){4,}/gm;
    let m, result;

    while ((m = regex.exec(field)) !== null) {
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        
        m.forEach((match, groupIndex) => {
            result += match;
        });
    }

    let fieldArr = result.split(';');
    let idArr = [];
    let punishArr = [];
    let timeArr = [];
    let nameArr = [];
    let resultArr = [];

    for (let i = 0; i < fieldArr.length; i++) {
        if (fieldArr[i].includes('ID:')) idArr.push(fieldArr[i]);
        else if (fieldArr[i].includes('PUNISH:')) punishArr.push(fieldArr[i]);
        else if (fieldArr[i].includes('TIME:')) timeArr.push(fieldArr[i]);
        else nameArr.push(fieldArr[i]);
    }

    idArr = idArr.join('');
    idArr = idArr.split(' ');
    idArr = idArr.join('');
    idArr = idArr.split('ID:');

    punishArr = punishArr.join('');
    punishArr = punishArr.split(' ');
    punishArr = punishArr.join('');
    punishArr = punishArr.split('PUNISH:');

    timeArr = timeArr.join('');
    timeArr = timeArr.split(' ');
    timeArr = timeArr.join('');
    timeArr = timeArr.split('TIME:');

    nameArr = nameArr.join('');
    nameArr = nameArr.split(' ');
    nameArr = nameArr.join('');
    nameArr = nameArr.split('NAME:');

    for (let i = 1; i < idArr.length; i++) {
        // Проверка на наличие одинаковых ID
        if (idArr.indexOf(idArr[i]) !== i) continue;

        // Формирование строки с результатом для текущего ID
        let uniquePunishments = new Set(); // Для хранения уникальных наказаний для текущего ID
        let resultStr = '';

        for (let j = i; j < idArr.length; j++) {
            if (idArr[j] === idArr[i]) {
                let time = parseInt(timeArr[j]);
                if (punishArr[j] === '/ajail' && time > 720) time = 720;
                else if ((punishArr[j] === '/ban' || punishArr[j] === '/hardban') && time > 9999) time = 9999;
                else if (punishArr[j] === '/mute' && time > 720) time = 720;
                else if (punishArr[j] === '/gunban') time = '9999';

                if (!uniquePunishments.has(punishArr[j])) {
                    resultStr += "/"+punishArr[j]+" "+idArr[j]+" "+time+" Жалобы "+nameArr[j];
                    uniquePunishments.add(punishArr[j]);
                    if (j !== idArr.length - 1 && idArr[j + 1] === idArr[i]) resultStr += " + ";
                }
            }
        }
        resultArr.push(resultStr);
    }

    // Отображение результатов
    for (let i = 0; i < resultArr.length; i++) {
        document.getElementById('id_resultTable').innerHTML += '<tr class="table__row"><td>'+resultArr[i]+"</td></tr>";
    }
}
