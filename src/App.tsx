import { Routes, Route } from 'react-router-dom';
import BookListPage from './pages/BookListPage';
import BookDetailsPage from './pages/BookDetailsPage';


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<BookListPage />} />
      <Route path="/books/:id/details" element={<BookDetailsPage />} />
    </Routes>
  );
}
