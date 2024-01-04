import { manager } from "./modals.tsx";

function App() {
    const showModal = manager.useShowModal()

    return (
        <div style={ { width: '100%' } }>
            <button onClick={ () => showModal('modal1', 'a') }>show modal1</button>
            <button onClick={ () => showModal('modal2', undefined) }>show modal2</button>
        </div>
    )
}

export default App
