import './App.css'
import Home from './pages/Home';
import { Routes, Route } from "react-router-dom"


function App() {
  	const wrapper = 'flex h-screen justify-center items-start bg-background select-none';
	const content = 'flex items-center mobile:flex-col-reverse';
	return (
		<div className={wrapper}>
			<div className={content}>
				<Routes>
					<Route path="/" element={<Home />} />
				</Routes>
			</div>
		</div>
	);
}

export default App
