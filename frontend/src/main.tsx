import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import BlogList from './pages/BlogList.tsx'
import BlogDetail from './pages/BlogDetail.tsx'
import Login from './pages/Login.tsx'
import Write from './pages/Write.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<BlogList />} />
          <Route path="blog" element={<BlogList />} />
          <Route path="blog/:slug" element={<BlogDetail />} />
          <Route path="login" element={<Login />} />
          <Route path="write" element={<Write />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
