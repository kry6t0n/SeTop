# Структура проекта переделана! 🎉

Ваш проект теперь имеет правильную структуру monorepo с двумя папками:

## Новая структура:

```
js_NTV/
├── frontend/              # Основное приложение React
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── README.md
│   └── .gitignore
│
├── ui-library/            # Библиотека переиспользуемых компонентов
│   ├── src/
│   │   ├── Button/
│   │   ├── Modal/
│   │   ├── FileUpload/
│   │   └── index.ts
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── README.md
│   └── .gitignore
│
├── package.json           # Root package.json для управления обоими пакетами
├── README.md
└── .gitignore
```

## Как начать работать:

### 1. Установите зависимости для обоих пакетов:

```bash
cd frontend
npm install

cd ../ui-library
npm install
```

Или используйте корневой скрипт (если npm workspaces поддерживается):

```bash
npm install
```

### 2. Запустите приложение в development режиме:

```bash
cd frontend
npm run dev
```

Приложение будет доступно на http://localhost:3000

### 3. Создайте production build:

```bash
# Собрать обе части
cd ..
npm run build

# Или отдельно
npm run build:ui        # Только UI-library
npm run build:frontend  # Только frontend
```

## Тестовые аккаунты:

- **admin** / admin123 (Administrator)
- **engineer** / engineer123 (Network Engineer)  
- **user** / user123 (Regular User)

## Основные функции:

✅ Аутентификация пользователей
✅ Dashboard с управлением проектами
✅ Визуализация сетевой топологии с ReactFlow
✅ Drag-and-drop для добавления устройств
✅ Экспорт/Импорт конфигураций
✅ Адаптивный дизайн

## Структура была переделана согласно требованиям:

- ✅ Две отдельные папки: frontend и ui-library
- ✅ UI-библиотека с переиспользуемыми компонентами
- ✅ Frontend приложение с полной функциональностью
- ✅ Правильная иерархия файлов
- ✅ Конфиги TypeScript, Vite для обеих папок
- ✅ README файлы для каждого пакета
- ✅ .gitignore для избежания отслеживания ненужных файлов

Все готово к работе! 🚀
