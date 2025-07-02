# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Frontend File Structure and Description

This project is built with React and Vite. Below is an overview of the folder structure and a description of what each main file and folder does.

## File Structure

```
frontend/
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── README.md
├── vite.config.js
├── public/
│   └── vite.svg
└── src/
    ├── App.jsx
    ├── index.css
    ├── main.jsx
    ├── components/
    │   ├── Button/
    │   │   ├── Button.jsx
    │   │   └── Button.module.css
    │   ├── JournalEntry/
    │   │   ├── JournalEntry.jsx
    │   │   └── JournalEntry.module.css
    │   ├── JournalEntryWrapper/
    │   │   └── JournalEntryWrapper.jsx
    │   ├── KeywordList/
    │   │   └── KeywordList.jsx
    │   ├── NavBar/
    │   │   ├── NavBar.jsx
    │   │   └── NavBar.module.css
    │   ├── Search/
    │   │   └── ...
    │   ├── SearchResults/
    │   │   └── SearchResults.jsx
    │   └── ShowEntries/
    │       ├── ShowEntries.jsx
    │       └── ShowEntries.module.css
    ├── pages/
    │   ├── AddEntry/
    │   │   ├── AddEntry.jsx
    │   │   └── AddEntry.module.css
    │   ├── Error/
    │   │   └── ErrorPage.jsx
    │   ├── Home/
    │   │   ├── Home.jsx
    │   │   └── Home.module.css
    │   └── UpdateEntry/
    │       ├── UpdateEntry.jsx
    │       └── UpdateEntry.module.css
    └── services/
        └── api.js
```

---

## File and Folder Descriptions

### Root

- **index.html**  
  The entry point for the app, contains `<div id="root"></div>` where React mounts.

- **package.json**  
  Project dependencies and scripts.

- **vite.config.js**  
  Vite configuration, including any backend proxy settings.

- **eslint.config.js**  
  Linting configuration for the project.

---

### `src/`  
All React code lives here.

- **main.jsx**  
  The main entry point for React. Sets up routing and mounts the app to the DOM.

- **App.jsx**  
  The top-level component containing the navbar and the `<Outlet />` for page content.

- **index.css**  
  Global CSS for the entire app.

---

### `src/components/`  
Reusable components.

- **Button/**  
  - `Button.jsx`: Reusable button component.
  - `Button.module.css`: Styles for the button.

- **JournalEntry/**  
  - `JournalEntry.jsx`: Displays a single journal entry.
  - `JournalEntry.module.css`: Styles for the journal entry.

- **JournalEntryWrapper/**  
  - `JournalEntryWrapper.jsx`: Wrapper to fetch `id` from the URL and display `JournalEntry`.

- **KeywordList/**  
  - `KeywordList.jsx`: Displays all used keywords, with a counter and link to search.

- **NavBar/**  
  - `NavBar.jsx`: Navigation bar with search field.
  - `NavBar.module.css`: Styles for the navbar.

- **Search/**  
  - `Search.jsx`: (Possibly unused, or for direct search in a component.)

- **SearchResults/**  
  - `SearchResults.jsx`: Displays search results for keyword or title searches.

- **ShowEntries/**  
  - `ShowEntries.jsx`: Lists all journal entries.
  - `ShowEntries.module.css`: Styles for the entry list.

---

### `src/pages/`  
Pages corresponding to different routes in the app.

- **AddEntry/**  
  - `AddEntry.jsx`: Page for adding a new journal entry.
  - `AddEntry.module.css`: Styles for this page.

- **Error/**  
  - `ErrorPage.jsx`: Shown on error or when a route is not found.

- **Home/**  
  - `Home.jsx`: The front page, shows welcome, keywords, and entry overview.
  - `Home.module.css`: Styles for the front page.

- **UpdateEntry/**  
  - `UpdateEntry.jsx`: Page for updating an existing journal entry.
  - `UpdateEntry.module.css`: Styles for this page.

---

### `src/services/`

- **api.js**  
  Functions for communicating with the backend (e.g., `addEntry`, `getEntries`).

---

## Other Files and Folders

- **public/**  
  Static assets, e.g., favicon.

---

## Typical Flow

- **Navbar** is shown at the top of all pages.
- **Home** displays a welcome, keywords, and entry overview.
- **Search** results are shown on the same page, below the search field.
- **AddEntry** and **UpdateEntry** pages contain forms for entry details.
- **Error** page is shown for unknown routes or errors.
