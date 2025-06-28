// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Navbar from './components/Navbar';
// import Home from './pages/Home';
// import UploadPage from './pages/UploadPage';
// import ResultsPage from './pages/ResultsPage';
// import Dashboard from './components/Dashboard';
// import Docs from './pages/Docs';
// import Footer from './components/Footer';

// export default function App() {
//   return (
//     <Router>
//       <Navbar />
      
//       {/* Main Content */}
//       <div className="min-h-screen flex flex-col justify-between">
//         <div className="flex-grow">
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route
//               path="/upload"
//               element={
//                 <div  >
//                   <UploadPage />
//                 </div>
//               }
//             />
//             <Route
//               path="/results"
//               element={
//                 <div className="">
//                   <ResultsPage />
//                 </div>
//               }
//             />
//             <Route
//               path="/dashboard"
//               element={
//                 <div className="">
//                   <Dashboard />
//                 </div>
//               }
//             />
//             <Route
//               path="/docs"
//               element={
//                 <div className="">
//                   <Docs />
//                 </div>
//               }
//             />
//           </Routes>
//         </div>

//         {/* Global Footer */}
//         <Footer />
//       </div>
//     </Router>
//   );
// }








import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import UploadPage from './pages/UploadPage';
import ResultsPage from './pages/ResultsPage';
import Dashboard from './components/Dashboard';
import Docs from './pages/Docs';
import Footer from './components/Footer';
import SmoothExperience from './components/SmoothExperience';

export default function App() {
  return (
    <Router>
      <SmoothExperience>
        <Navbar />

        {/* Main Content */}
        {/* <div className="min-h-screen flex flex-col justify-between"> */}
        <div className="flex flex-col justify-between">


          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/results" element={<ResultsPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/docs" element={<Docs />} />
            </Routes>
          </div>

          {/* Global Footer */}
          <Footer />
        </div>
      </SmoothExperience>
    </Router>
  );
}
