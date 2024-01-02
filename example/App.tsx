import { useMemo, useState } from "react";

function App() {
    const [ state, setState ] = useState(1)

    const mod2 = useMemo(() => {
        return state
    }, [ state % 2 ])

    return (
        <div>
            <p>@gladiolus/modal</p>

            <p>state: { state }</p>
            <p key={ state % 2 }>state: { state }</p>
            <p>mod2: { mod2 }</p>

            <button onClick={ () => setState(1) }>set to 1</button>
            <button onClick={ () => setState(2) }>set to 2</button>
            <button onClick={ () => setState(3) }>set to 3</button>
            <button onClick={ () => setState(4) }>set to 4</button>
        </div>
    )
}

export default App
