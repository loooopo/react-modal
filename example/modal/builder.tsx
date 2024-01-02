import { FC, useRef } from "react";

/**
 * A modal builder.
 *
 * @param payload The payload passed to the modal when it is shown.
 * @param close A function to close the modal.
 */
type ModalBuilder<Payload> = FC<{ payload: Payload, close: VoidFunction }>

function ModalTemplate<Payload = unknown>({ visible, priority, close, builder, payload }: {
    visible: boolean,
    priority: number,
    close: VoidFunction
    builder: ModalBuilder<Payload>
    payload: Payload
}) {
    const ref = useRef<HTMLDivElement>(null)

    return visible ? (
        <div ref={ ref } className={ 'modal-wrapper' } style={ { zIndex: priority } }>
            { builder({ payload, close }) }
        </div>
    ) : null
}

export type { ModalBuilder }
export { ModalTemplate }
