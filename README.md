MajeticHub-Forum
======================
## Описание

MajeticHub-Forum - это веб-проект который позволяет пользователям вводить данные о наказаниях (ID, тип наказания, время и имя) и автоматически обрабатывать их, суммируя повторяющиеся наказания для одного и того же ID и сортируя результаты в определенном порядке. Проект разработан с использованием HTML, JavaScript и CSS.

## Структура проекта
- `README.md` - файл с описанием проекта
- `favicon.ico` - иконка сайта
- `index.html` - Основная страница
- `script.js` - JavaScript-код для функциональности форума
- `styles.css` - стили для оформления форума

## Пример использования:
Предположим, у вас есть следующие данные в столбце "Punish List":
```
ID:123;PUNISH:/ajail;TIME:300;NAME:admin-001;
ID:123;PUNISH:/ajail;TIME:400;NAME:MIV-001;
ID:456;PUNISH:/ban;TIME:1000;NAME:MIV-003;
ID:789;PUNISH:/mute;TIME:600;NAME:MIV-004;
ID:123;PUNISH:/warn;NAME:MIV-005;
```

После обработки эти данные будут преобразованы в следующую таблицу:
```
/ajail 123 700 Жалобы admin-001, MIV-001
/ban 456 1000 Жалоба MIV-003
/mute 789 600 Жалоба MIV-004
/warn 123 Жалобы MIV-005
```
Этот инструмент помогает администраторам форума эффективно управлять и анализировать наказания, обеспечивая удобное представление информации и возможность быстрого принятия решений.

## Особенности
- Простой и интуитивно понятный интерфейс
- Адаптивный дизайн для различных устройств
- Возможность создания тем и обсуждений

## Использование

1. Перейти по ссылки:
  

## Автор
Developer Miv
