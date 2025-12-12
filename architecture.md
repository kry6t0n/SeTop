# Архитектура и фактическая структура репозитория

Я обновил документ, чтобы он отражал текущее состояние кода в репозитории (файлы и папки были прочитаны из рабочего дерева). Ниже — реальная структура и комментарии о расхождениях с желаемой/плановой структурой.

## Структура (фактическая)

Network-Topology-Visualizer/
- frontend/
  - src/
    - App.tsx
    - main.tsx
    - components/
      - Canvas/
        - CustomNodes/  (пустая папка в репозитории)
      - Header/
        - Header.tsx
        - Header.css
        - Header.test.tsx
      - Layout/ (папка существует, но пуста)
    - pages/
      - Dashboar.tsx       (файл с опечаткой в имени)
      - Dashboard.test.tsx
      - Dashboard.extra.test.tsx
      - Editor.tsx
      - Editor.test.tsx
      - Editor.extra.test.tsx
      - Login.tsx
      - Login.test.tsx
      - Login.extra.test.tsx
      - Account.tsx
      - Account.test.tsx
      - Account.extra.test.tsx
      - Account.extra2.test.tsx
      - Admin.tsx
      - Admin.test.tsx
      - Admin.extra.test.tsx
    - utils/
      - connectionLogic.ts
      - connectionLogic.test.ts
      - projectService.ts
      - projectService.test.ts
      - validation.ts
      - validation.test.tsx
    - hooks/
      - useLocalStorage.ts
      - useLocalStorage.test.ts
    - contexts/
      - AuthContext.tsx
      - ProjectContext.tsx
    - styles/
    - setupTests.ts

- ui-library/
  - src/
    - index.ts
    - Button/
      - Button.tsx
      - Button.module.css
    - Modal/
      - Modal.tsx
      - Modal.css
    - FileUpload/
      - FileUpload.tsx
      - FileUpload.css
    - Canvas/
      - NetworkCanvas.tsx
      - Toolbar.tsx
      - CustomNodes/
        - CustomNode.tsx
      - __tests__/
    - Layout/
      - Header.tsx
      - __tests__/
    - utils/
      - __tests__/

## Важные замечания и расхождения

- Документация раньше указывала, что в `frontend/src/components/Canvas` присутствуют `NetworkCanvas.tsx` и `Toolbar.tsx`. В текущей кодовой базе эти файлы находятся в `ui-library/src/Canvas` (т.е. реализованы в `ui-library`, а в `frontend` папка `Canvas/CustomNodes` пустая).
- В `frontend/src/pages/` присутствует `Dashboar.tsx` (без буквы 'd' в конце) — вероятно опечатка; фактически приложение импортирует/использует этот файл (тесты адаптированы к нему).
- В `ui-library` реализованы `NetworkCanvas.tsx` и `Toolbar.tsx`, т.е. часть функциональности холста вынесена в библиотеку компонентов.
- Я не менял архитектурный документ ранее; я редактировал тестовые файлы и тестовые моки. Сейчас документ приведён в соответствие с реальной структурой.

## Рекомендации

- Если хочешь, чтобы `architecture.md` описывал желаемую/плановую структуру (а не фактическую), отмечай это явно и держи документ как «spec» (плюс — укажем отличия). Сейчас файл отражает текущее состояние.
- Предлагаю:
  1. Исправить опечатку `Dashboar.tsx` → `Dashboard.tsx` (если это не ломает импорты/тесты). Это сделает код и документацию последовательными.
  2. Если `NetworkCanvas`/`Toolbar` предполагалось держать в `frontend`, можно переместить реализацию из `ui-library/src/Canvas` в `frontend/src/components/Canvas` или наоборот — задокументировать, что Canvas вынесен в `ui-library`.

Если подтверждаешь, я могу сразу:
- Исправить `Dashboar.tsx` → `Dashboard.tsx` (переименовать файл и обновить все импорты/тесты).
- Или пометить `architecture.md` как "spec vs reality" и разместить желаемую структуру отдельно.

Скажи, что предпочитаешь (переименовать файл сейчас или сохранить как есть и пометить документ). 


