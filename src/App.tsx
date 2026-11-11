
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';

// Placeholder components for routes we haven't built yet
import { CalorieCalculator } from './features/calculator';
import { AIFoodScanner } from './features/scanner';
import { SymptomChecker } from './features/symptoms';
import { BlogLayout } from './features/blog/BlogLayout';
import { BlogPost } from './features/blog/BlogPost';
import About from './pages/About';
import { ExternalSource } from './pages/ExternalSource';

// Admin Components
import { Login } from './features/admin/Login';
import { AdminLayout } from './features/admin/AdminLayout';
import { Dashboard } from './features/admin/Dashboard';
import { ArticleList } from './features/admin/ArticleList';
import { ArticleEditor } from './features/admin/ArticleEditor';
import { SocialPostManager } from './features/admin/SocialPostManager';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="calculator" element={<CalorieCalculator />} />
          <Route path="scan" element={<AIFoodScanner />} />
          <Route path="symptoms" element={<SymptomChecker />} />
          <Route path="blog" element={<BlogLayout />} />
          <Route path="blog/:slug" element={<BlogPost />} />
          <Route path="article/source/:id" element={<ExternalSource />} />
          <Route path="about" element={<About />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="articles" element={<ArticleList />} />
          <Route path="articles/new" element={<ArticleEditor />} />
          <Route path="articles/edit/:id" element={<ArticleEditor />} />
          <Route path="social" element={<SocialPostManager />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
