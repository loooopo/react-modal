import { ModalManager } from "./modal";

type PayloadMap = {
    modal1: string
    modal2: undefined
}

// create a manager
// pass a generic argument to specify the payload type,
// this can help you get better type indication when using hooks on manager
const manager = new ModalManager<PayloadMap>()
// manually set z-index limit
manager.setZLimit(100)
// register modals
manager.register({
    modal1: ({ payload, hide }) => {
        return (
            <div>
                <div>Modal 1</div>
                <div>{ payload }</div>
                <button onClick={ hide }>Click to Close</button>
            </div>
        )
    },
    modal2: ({ payload, hide }) => {
        return (
            <div>
                <div>Modal 2</div>
                <div>{ payload }</div>
                <button onClick={ hide }>Click to Close</button>
            </div>
        )
    },
})

export {
    type PayloadMap,
    manager
}