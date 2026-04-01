import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import FlagQuiz from './pages/FlagQuiz';
import ContinentChallenge from './pages/ContinentChallenge';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/quiz" element={<FlagQuiz />} />
          <Route path="/challenge" element={<ContinentChallenge />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
