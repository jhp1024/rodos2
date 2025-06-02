import React from 'react';
import { Routes, Route, NavLink, useMatch } from 'react-router-dom';
import IDE from './pages/IDE';

function App() {
  // useMatch로 현재 경로가 루트(/)인지 확인
  const isRoot = useMatch({ path: "/", end: true });

  return (
    <div className="App">
      {/* 루트(/)에서만 버튼 보이기 */}
      {isRoot && (
        <div className="button-container">
          <NavLink
            to="/ide"
            className={({ isActive }) =>
              "main-button" + (isActive ? " active" : "")
            }
          >
            IDE
          </NavLink>
          <NavLink
            to="/ime"
            className={({ isActive }) =>
              "main-button" + (isActive ? " active" : "")
            }
          >
            IME
          </NavLink>
        </div>
      )}
      <Routes>
        <Route path="/ide" element={<IDE />} />
        {/* <Route path="/ime" element={<IME />} /> */}
      </Routes>
    </div>
  );
}

export default App;