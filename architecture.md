# Архитектурные требования для Network Topology Visualizer

## Структура проекта

Проект использует монорепозиторий со следующей структурой:
```
Network-Topology-Visualizer/
├── 📦 frontend/ # Основное приложение
│ ├── src/
│ │ ├── components/
│ │ │ ├── Canvas/ # Компоненты холста
│ │ │ │ ├── NetworkCanvas.tsx
│ │ │ │ ├── Toolbar.tsx
│ │ │ │ └── CustomNodes/
│ │ │ │ ├── RouterNode.tsx
│ │ │ │ ├── SwitchNode.tsx
│ │ │ │ ├── ServerNode.tsx
│ │ │ │ ├── WorkstationNode.tsx
│ │ │ │ └── NetworkNode.tsx
│ │ │ ├── Layout/ # Компоненты макета
│ │ │ │ ├── Header.tsx
│ │ │ │ ├── Sidebar.tsx
│ │ │ │ └── AuthGuard.tsx
│ │ │ └── UI/ # Базовые UI компоненты
│ │ │ ├── Button.tsx
│ │ │ ├── Modal.tsx
│ │ │ └── FileUpload.tsx
│ │ ├── pages/ # Страницы приложения
│ │ │ ├── Login.tsx
│ │ │ ├── Dashboard.tsx
│ │ │ ├── Editor.tsx
│ │ │ ├── Account.tsx
│ │ │ └── Admin.tsx
│ │ ├── utils/ # Вспомогательные функции
│ │ │ ├── connectionLogic.ts
│ │ │ ├── ipValidation.ts
│ │ │ ├── projectService.ts
│ │ │ ├── exportUtils.ts
│ │ │ └── validation.ts
│ │ ├── contexts/ # React контексты
│ │ │ ├── AuthContext.tsx
│ │ │ └── ProjectContext.tsx
│ │ ├── hooks/ # Кастомные хуки
│ │ │ ├── useLocalStorage.ts
│ │ │ ├── useNetworkValidation.ts
│ │ │ └── useUndoRedo.ts
│ │ ├── constants/ # Константы
│ │ │ ├── deviceTypes.ts
│ │ │ ├── connectionTypes.ts
│ │ │ └── userRoles.ts
│ │ ├── styles/ # Стили
│ │ │ ├── main.css
│ │ │ ├── components.css
│ │ │ └── responsive.css
│ │ ├── App.jsx # Корневой компонент
│ │ └── main.jsx # Точка входа
│ ├── public/ # Статические файлы
│ │ ├── index.html
│ │ └── favicon.ico
│ ├── package.json
│ ├── vite.config.js
│ └── tsconfig.json
│
├── 📚 ui-library/ # Библиотека общих компонентов
│ ├── src/
│ │ ├── Button/
│ │ │ ├── Button.tsx
│ │ │ └── Button.module.css
│ │ ├── Modal/
│ │ │ ├── Modal.tsx
│ │ │ └── Modal.css
│ │ ├── FileUpload/
│ │ │ ├── FileUpload.tsx
│ │ │ └── FileUpload.css
│ │ ├── Input/
│ │ │ ├── Input.tsx
│ │ │ └── Input.module.css
│ │ ├── Select/
│ │ │ ├── Select.tsx
│ │ │ └── Select.module.css
│ │ └── index.ts # Точка входа
│ ├── package.json
│ ├── vite.config.ts
│ └── tsconfig.json
│
└── 📄 Документация
├── README.md
├── SETUP.md
├── NETWORK_LOGIC.md
└── CHECKLIST.md
```

## Используемые библиотеки

### Основное приложение (frontend)


  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.14.1",
  "reactflow": "^11.7.0",
  "vite": "^4.5.0",
  "axios": "^1.4.0"


## Библиотека компонентов (ui-library)


  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "typescript": "^4.9.5",
  "lucide-react": "^0.263.1"


## Назначение библиотек:

react - основной фреймворк для построения UI

react-router-dom - клиентская маршрутизация

reactflow - визуализация графов и сетевых топологий

vite - сборка и development server

axios - HTTP-запросы для будущей интеграции с бэкендом

typescript - статическая типизация

lucide-react - иконки для UI

## Компоненты приложения

Основное приложение (frontend)
Компоненты холста:
NetworkCanvas - основной компонент React Flow для отрисовки топологии

Toolbar - панель инструментов для работы с топологией

Custom Nodes:

RouterNode - узел для маршрутизаторов

SwitchNode - узел для коммутаторов

ServerNode - узел для серверов

WorkstationNode - узел для рабочих станций

NetworkNode - узел для внешних сетей

Компоненты макета:
Header - навигационная панель с меню

Sidebar - боковая панель для свойств устройств

AuthGuard - компонент защиты маршрутов

Базовые UI компоненты:
Button - кнопки с вариантами стилей

Modal - модальные окна

FileUpload - загрузка файлов

Страницы:
Login - страница аутентификации

Dashboard - главная страница

Editor - редактор сетевой топологии

Account - управление профилем и проектами

Admin - панель администратора

## Библиотека компонентов (ui-library)
Button - переиспользуемая кнопка с вариантами (primary, secondary, danger)

Modal - модальное окно с анимациями

FileUpload - компонент загрузки файлов с валидацией

Input - поле ввода с поддержкой валидации

Select - выпадающий список


## Структура роутинга
const routes = [
  {
    path: '/',
    component: Dashboard,
    public: true
  },
  {
    path: '/login',
    component: Login,
    public: true
  },
  {
    path: '/editor',
    component: Editor,
    roles: ['user', 'engineer', 'administrator']
  },
  {
    path: '/editor/:projectId',
    component: Editor,
    roles: ['user', 'engineer', 'administrator']
  },
  {
    path: '/account',
    component: Account,
    roles: ['user', 'engineer', 'administrator']
  },
  {
    path: '/admin',
    component: Admin,
    roles: ['administrator']
  }
]

## Отображаемые страницы:
/ - Главная страница (Dashboard)

/login - Страница входа

/editor - Редактор топологии (создание нового проекта)

/editor/:projectId - Редактор топологии (редактирование существующего проекта)

/account - Управление аккаунтом и проектами

/admin - Панель администратора (только для администраторов)
