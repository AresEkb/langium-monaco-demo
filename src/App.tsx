import { HashRouter, NavLink, Route, Routes } from 'react-router';

import { AstPage } from './pages/AstPage';
import { EditorPage } from './pages/EditorPage';
import { GrammarPage } from './pages/GrammarPage';
import { ModelPage } from './pages/ModelPage';
import { PrintPage } from './pages/PrintPage';

import 'jsondiffpatch/formatters/styles/html.css';
import './App.css';

export function App() {
  return (
    <HashRouter>
      <header>
        <nav>
          <ul>
            <li>
              <NavLink to="/">Editor</NavLink>
            </li>
            <li>
              <NavLink to="/ast">AST</NavLink>
            </li>
            <li>
              <NavLink to="/print">Print</NavLink>
            </li>
            <li>
              <NavLink to="/grammar">Grammar</NavLink>
            </li>
            <li>
              <NavLink to="/model">Model</NavLink>
            </li>
          </ul>
        </nav>
      </header>
      <Routes>
        <Route index element={<EditorPage />} />
        <Route path="ast" element={<AstPage />} />
        <Route path="print" element={<PrintPage />} />
        <Route path="grammar" element={<GrammarPage />} />
        <Route path="model" element={<ModelPage />} />
      </Routes>
    </HashRouter>
  );
}
