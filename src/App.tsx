import './index.css';
import Board from './Board'

export default function App() {
    return (
        <div>
            <Board Width={window.innerWidth} Height={window.innerHeight} />
        </div>
    )
}
