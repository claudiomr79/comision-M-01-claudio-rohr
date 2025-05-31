
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Main from './components/Main';
import Register from './components/Register';
import StartSession from './components/StartSession';
import ProtectedRoute from './components/ProtectedRoute';
import CreatePostPage from './pages/CreatePostPage';
import SinglePostPage from './pages/SinglePostPage';
import EditPostPage from './pages/EditPostPage'; // Import EditPostPage
// import Post from './components/Post';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="main-content">
        <Routes>
          {/* Public routes */}
          <Route path="/signup" element={<Register />} />
          <Route path="/login" element={<StartSession />} />
          <Route path="/posts/:postId" element={<SinglePostPage />} /> {/* Public single post view */}

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Main /> {/* Main now lists posts */}
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-post"
            element={
              <ProtectedRoute>
                <CreatePostPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/posts/:postId/edit"
            element={
              <ProtectedRoute>
                <EditPostPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
