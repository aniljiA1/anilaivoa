import React from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import LogInteractionScreen from "./components/LogInteractionScreen";

function App() {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-slate-100 py-10">
        <header className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-blue-900 italic">
            AIVOA
          </h1>
          <p className="text-gray-600">AI-First HCP Module</p>
        </header>
        <LogInteractionScreen />
      </div>
    </Provider>
  );
}

export default App;
