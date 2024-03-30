import React, { createContext } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import QuestionAnswer from "./components/QuestionAnswer";
import AddDocuments from "./components/AddDocuments";

// Setting up the routes for the application
const router = createBrowserRouter([
    {
        path: "/",
        element: <QuestionAnswer />,
    },
    {
        path: "/add-documents",
        element: <AddDocuments />,
    },
]);

const App = () => {
    return <RouterProvider router={router} />;
};

export const DataContext = createContext();

export default App;