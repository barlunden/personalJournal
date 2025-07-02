import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
import './index.css'
import App from './App.jsx'

// Pages & Components on display
import Home from './pages/Home/Home.jsx'
import AddEntry from './pages/AddEntry/AddEntry.jsx'
import ShowEntries from './components/ShowEntries/showEntries.jsx'
import ErrorPage from './pages/Error/ErrorPage.jsx'
import JournalEntryWrapper from './components/JournalEntryWrapper/JournalEntryWrapper.jsx'
import UpdateEntry from './pages/UpdateEntry/UpdateEntry.jsx'
import SearchResults from './components/SearchResults/SearchResults.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "add", element: <AddEntry /> },
      { path: "read", element: <ShowEntries /> },
      { path: "entry/:entryId", element: <JournalEntryWrapper /> },
      { path: "update-entry/:entryId", element: <UpdateEntry /> },
      { path: "search", element: <SearchResults /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);