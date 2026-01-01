import { Routes, Route } from 'react-router-dom';
import BookListPage from './pages/BookListPage';
import BookDetailsPage from './pages/BookDetailsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import AuthorsPage from './pages/Authors';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/authors" element={<AuthorsPage />} />
      <Route path="/books" element={<BookListPage />} />
      <Route path="/books/:id/details" element={<BookDetailsPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
    </Routes>
  );
}
