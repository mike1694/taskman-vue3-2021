# Аудит стилей проекта на соответствие БЭМ

Дата: 2026-10-29
Статус: аудит; по разделам 1–6 выполнен рефакторинг кода (теги → блоки `.btn`/`.field`, добавлены модификаторы `task-item--closed/hot` и `task-list--*`, снята кросс-компонентная связка TaskItem/TaskList, удалён мёртвый код), изменения внесены и проверены (`npm run lint`, `npm run format:check`, `npm run build`).

## Методология

Проверка по официальной методологии БЭМ (yandex.github.io/bem):

1. **Именование**: `block`, `block__element`, `block--modifier`, `block__element--modifier`.
2. **Только классы**: селекторы по тегам, `id` и атрибутам для стилизации запрещены (кроме reset/base и классов фреймворка вроде `router-link-exact-active`, `.fade-*`).
3. **Без вложенности вне блока**: каждый класс должен описывать свой блок/элемент; вложенные селекторы (`ul li`, `parent child`) — нарушение, кроме разрешённых `&__element`-вложений внутри блока и модификаторов.
4. **Инкапсуляция**: один компонент не должен стилизоваться классами, приходящими из родителя.
5. **Модификаторы** выражают состояние/вариант блока (`--hot`, `--closed`), а не отдельные классы-флаги.
6. Утилитарный (атомарный) CSS вне БЭМ-парадигмы: допускается как отдельный слой, но в БЭМ-блоках не смешивается.

## Охват проверки

| Область | Файлы |
|---|---|
| Глобальный CSS | `src/assets/css/*.css` (10 файлов) + пустой `src/assets/scss/main.scss` |
| Scoped-стили компонентов | 10 компонентов из `src/components/` |
| Приложение | `src/App.vue`, виды `src/views/*.vue` (стилей не содержат) |

---

## 1. Селекторы по тегам и id (грубое нарушение БЭМ)

### 1.1 `src/assets/css/button.css`
- [:1](src/assets/css/button.css:1) `button` — стилизация всех кнопок приложения глобально (нет блока `button`);
- [:17](src/assets/css/button.css:17) `button:hover`;
- [:23](src/assets/css/button.css:23) `button:active`.

### 1.2 `src/assets/css/input_form.css`
- [:1](src/assets/css/input_form.css:1) `input[type='date'], input[type='time'], input[type='text'], textarea, select` — стилизация по тегам/атрибутам;
- [:26](src/assets/css/input_form.css:26) `select`;
- [:31](src/assets/css/input_form.css:31) `:focus`-варианты по тем же тегам.

### 1.3 `src/components/TaskList.vue`
- [:166](src/components/TaskList.vue:166) `ul` — глобальный (scoped) селектор тега;
- [:167-170](src/components/TaskList.vue:167) `ul { display:flex; justify-content:center; ... }`;
- [:171](src/components/TaskList.vue:171) `ul li { ... }` — вложенность + тег;
- [:209](src/components/TaskList.vue:209) `li:hover .task-list__delete` — вложенность.

### 1.4 `src/components/TasksComponent.vue`
- [:118-132](src/components/TasksComponent.vue:118) `h3`, `ul`, `li`, `a` — мёртвые теговые стили (в шаблоне компонента этих тегов нет, кроме `a` внутри `router-link`), дублируют глобальные.

### 1.5 `src/App.vue`
- [:34](src/App.vue:34) `#app` — селектор по `id`;
- [:57](src/App.vue:57) `#nav` — селектор по `id` + вложенные `a` ([:61](src/App.vue:61)), `&.router-link-exact-active` ([:66](src/App.vue:66));
- `.wallpaper` ([:42](src/App.vue:42)) — неиспользуемый класс (закомментирован в шаблоне).

### 1.6 `src/components/ConfirmDialog.vue`
- [:77](src/components/ConfirmDialog.vue:77) `.confirm-dialog__content p` — селектор тега внутри элемента.

### 1.7 `src/assets/css/global.css`
- [:13](src/assets/css/global.css:13) `*`, [:19](src/assets/css/global.css:19) `body`, [:23](src/assets/css/global.css:23) `hr` — reset/base, приемлемо по правилу 2.

## 2. Утилитарный (атомарный) CSS — слой вне БЭМ

Файлы образуют самостоятельный слой утилит (используется как «сетка/спейсинг»). Формально БЭМ не запрещает утилиты, но их **массовое смешивание с БЭМ-классами в шаблонах** размывает модель блоков и создаёт жёсткую связь разметки с глобальным CSS.

| Файл | Классы | Использование (примеры) |
|---|---|---|
| `src/assets/css/margin.css` | `.mb2 .mr2 .ml2 .mt2 .mb4 .mr4 .ml4 .mt4` (с `!important`) | в 9 компонентах + `App.vue:2` |
| `src/assets/css/padding.css` | `.p10 .p5 .p4 .p3 .p2 .p1` | `TaskCreate.vue:7`, `HistoryForm.vue:69`, `HistoryItem.vue:12` |
| `src/assets/css/text.css` | `.text-left .text-right .text-center .bold` | `TaskItem.vue:24`, `HistoryItem.vue:6,43` |
| `src/assets/css/flex.css` | `.flex .flex-center .flex-wrap .flex-50-item .flex-h-center .flex-v-center .flex-space .flex-between .flex-col` | `TaskForm.vue:26,47`, `HistoryForm.vue:33`, `HistoryItem.vue:4,9,50` |
| `src/assets/css/width.css` | `.w100 .w50 .w30` (`!important`) | `TaskForm.vue:48,56` (только `w100`) |
| `src/assets/css/float.css` | `.float-right .float-left` | **не используется** ни в одном шаблоне (мёртвый код) |
| `src/assets/css/label.css` | `.info-label .success-label .primary-label` | `TaskItem.vue:16,25,32`, `HistoryItem.vue:12,20,43,57` |

Замечания к утилитам:
- `!important` в `margin.css:2-22` и `width.css:1-11` — сильное нарушение специфичности, связано с глобальным `* { margin:0; padding:0 }` в `global.css:14`.
- `label.css` — по сути псевдо-блок «бейдж», используется поверх элементов БЭМ (`history-item__length`, `task-item__end-date`).
- Класс `.text-left` навешен на `<input type="checkbox">` в `TaskForm.vue:30` — не работает (text-align на чекбоксе не применяется).

## 3. Чужие и осиротевшие классы

| Класс | Где используется | Проблема |
|---|---|---|
| `create-task-modal__header--input` | `TaskForm.vue:8`, `HistoryForm.vue:8` | Ссылка на **удалённый блок** `create-task-modal`; не определён нигде в проекте |
| `create-task-modal__header--textarea` | `TaskForm.vue:74,85` | То же |
| `row`, `col` | `TaskForm.vue:14-15` | Классы без определений в проекте (остатки сторонней сетки) |
| `history-header` | `HistoryComponent.vue:2` | Не стилизован нигде — орфан |
| `.finished-tasks h4`, `.finished-tasks label` | `TaskItem.vue:91-99` | Стиль **дочернего** компонента зависит от класса родителя (см. п. 5) |
| `edit`, `cancel`, `edit-task` | `TaskList.vue:13,16,24` (+ `::after`-хак, [:215](src/components/TaskList.vue:215)) | Классы-состояния без БЭМ-иерархии; `.edit`/`.cancel` — слишком общие имена |

## 4. Отсутствие модификаторов

Состояния/варианты блоков нигде не выражены БЭМ-модификаторами:

- `TaskItem.vue` — `props.item.type === 'hot'` (шаблон [:15](src/components/TaskItem.vue:15)) и `closed`/`reopen` не имеют классов `task-item--hot`, `task-item--closed`, `task-item--reopen`;
- `TasksComponent.vue` — варианты списков передаются строками-классами через prop `className` (`hot-tasks`, `current-tasks`, `finished-tasks`, `finished-tasks-by-date`, шаблон [:2](src/components/TasksComponent.vue:2), вызовы [:8-38](src/components/TasksComponent.vue:8)); корректнее `task-list--hot` и т.п.;
- `TaskList.vue:13` `:class="{ 'edit-task': ... }"` — корректный БЭМ-вид: `task-list__item--edit`;
- `ConfirmDialog.vue` — единственный образцовый пример с модификаторами `--yes`/`--no` ([`:10-21`](src/components/ConfirmDialog.vue:10)).

## 5. Кросс-компонентная связка стилей

- `TaskItem.vue:91-99` — `.finished-tasks h4, .finished-tasks label` в scoped-стилях `TaskItem` полагаются на класс, который в рантайме подставляет `TaskList` через prop `props.className` (которому его передаёт `TasksComponent`). Нарушение инкапсуляции, хрупкая связь: изменение строки-класса в родителе ломает стиль дочернего компонента.

## 6. Прочие дефекты (заодно с БЭМ-аудитом)

| Файл | Строки | Дефект |
|---|---|---|
| `src/components/TaskList.vue` | [:176-179](src/components/TaskList.vue:176) | `padding: 10px` указан дважды |
| `src/components/HistoryItem.vue` | [:178-181](src/components/HistoryItem.vue:178) | `padding: 10px` указан дважды |
| `src/components/HistoryForm.vue` | [:115-118](src/components/HistoryForm.vue:115) | `padding: 10px` указан дважды |
| `src/components/TaskItem.vue` | [:91-99](src/components/TaskItem.vue:91) | `text-decoration: line-through` у `label` в `finished-tasks` не срабатывает при `display:flex` (стиль навешен на label, а не на текст) |
| `src/components/TaskItem.vue` | [:83](src/components/TaskItem.vue:83) | `new Date(maxDate + ' ' + (maxTime || '00:00'))` — без `maxDate` возвращает Invalid Date (недавно добавлена защита выше, ок) |

## 7. Что соответствует БЭМ (не трогать / эталон)

- `ConfirmDialog.vue` — полный БЭМ: блок `confirm-dialog`, элементы `__content`, `__actions`, `__btn`, модификаторы `--yes`, `--no`;
- `TaskItem.vue` — структура блока корректна: `task-item`, `task-item__container|label|checkbox|end-date|content|info-block|result|date-block` (кроме кросс-селекторов и утилит);
- `HistoryItem.vue` — блок и элементы `history-item__header|title|length|text|path|delete` корректны;
- `TaskForm.vue`, `HistoryForm.vue`, `TaskCreate.vue`, `HistoryCreate.vue`, `HistoryComponent.vue`, `TasksComponent.vue` — базовые блоки (`task-form`, `history-form`, `task-create`, `history-create`, `history-component`, `tasks-component`) на месте;
- `transition.css` — классы переходов Vue (конвенция фреймворка, вне БЭМ).

## 8. Сводная таблица нарушений

| # | Категория | Файлы | Серьёзность |
|---|---|---|---|
| 1 | Селекторы тегов/id/атрибутов | `button.css:1,17,23`, `input_form.css:1,26,31`, `TaskList.vue:166-209`, `TasksComponent.vue:118-132`, `App.vue:34,57`, `ConfirmDialog.vue:77` | высокая |
| 2 | Утилиты вне БЭМ в шаблонах | 7 файлов `src/assets/css/` + 9 компонентов | средняя |
| 3 | Чужие/осиротевшие классы | `TaskForm.vue:8,74,85`, `HistoryForm.vue:8`, `TaskForm.vue:14-15`, `HistoryComponent.vue:2` | высокая |
| 4 | Нет модификаторов | `TaskItem.vue`, `TasksComponent.vue`, `TaskList.vue:13` | средняя |
| 5 | Кросс-компонентные селекторы | `TaskItem.vue:91-99` | высокая |
| 6 | Мёртвый код | `float.css` (целиком), `TasksComponent.vue:118-132`, `App.vue:42` | низкая |
| 7 | Дубликаты свойств | `TaskList.vue:176-179`, `HistoryItem.vue:178-181`, `HistoryForm.vue:115-118` | низкая |

## 9. Рекомендации (справочно, на будущий рефакторинг — в текущий аудит не входит)

1. Ввести конвенцию БЭМ в `AGENTS.md` (именование `block__elem--mod`, запрет теговых селекторов, запрет утилит в шаблонах).
2. Заменить теговые стили: `button.css` → блок `.btn`, `input_form.css` → блок `.field` (учитывая, что утилиты `w100`, `mb2` и т.п. используются в связке).
3. Заменить `create-task-modal__header--input/textarea` на элементы блоков `task-form__input/textarea`, `history-form__input/textarea`.
4. Добавить модификаторы `task-item--hot`, `task-item--closed`, `task-list--hot/current/finished/finished-by-date`.
5. Убрать `.finished-tasks h4/label` из `TaskItem.vue`, перенеся оформление в состояние внутри блока `task-item`.
6. Утилиты оставить отдельным слоем, но запретить их использование в новых компонентах, либо инкапсулировать в БЭМ-блоки компонентов.
7. Удалить `float.css`, мёртвые стили `TasksComponent.vue`, `.wallpaper`.
8. После рефакторинга прогонять `npm run lint` и `npm run format:check` (конвенции репозитория из `AGENTS.md`).