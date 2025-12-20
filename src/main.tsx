import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import {Provider} from "react-redux";
import {persistor, store} from "@/store";
import { PersistGate } from 'redux-persist/integration/react';
import Review from "@/pages/review/review.tsx";

createRoot(document.getElementById("root")!).render(
  // <Router>
    <Provider store={store}>
        <PersistGate persistor={persistor}>
            <App />
            {/*<Review/>*/}
        </PersistGate>
    </Provider>
  // </Router>
);
