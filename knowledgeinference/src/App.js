import './App.css';
import Navbar from './navbar/Navbar';
import Chatpage from './page/Chatpage';
import Fact from './page/Fact';
import Rulepage from './page/Rulepage';
import Aboutus from './page/Aboutus';
import LoginPage from './page/LoginPage';
import { BrowserRouter,Route,Routes } from 'react-router-dom';
import SignupPage from './page/SignupPage';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Navbar/>
      <Routes>
      <Route path='/signup' element={<SignupPage/>}/>
        <Route path='/chatpage' element={<Chatpage/>}/>
        <Route path='/' element={<LoginPage/>}/>
        <Route path='/fact' element={<Fact/>}/>
        <Route path='/rule' element={<Rulepage/>}/>
        <Route path='/aboutus' element={<Aboutus/>}/>
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
