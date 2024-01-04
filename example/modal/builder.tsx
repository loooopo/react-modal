import { FC, useRef } from "react";
import { createPortal } from "react-dom";
import { ModalManager } from "./manager.ts";

/**
 * A modal builder.
 *
 * @param payload The payload passed to the modal when it is shown.
 * @param close A function to close the modal.
 */
type ModalBuilder<Payload> = FC<{ payload: Payload, hide: VoidFunction }>

/**
 * Render a modal using the builder. Configure the priority and visibility of the modal.
 *
 * ---
 *
 * Internal-use only.
 */
function ModalRenderer<Payload = unknown>({ visible, priority, hide, builder, payload }: {
    visible: boolean,
    priority: number,
    hide: VoidFunction
    builder: ModalBuilder<Payload>
    payload: Payload
}) {
    const ref = useRef<HTMLDivElement>(null)

    // TODO: support any target element to attach to, or pass 'null' as is
    return visible ? createPortal(
        <div ref={ ref } className={ 'modal-wrapper' }
             style={ { zIndex: ModalManager.zLimit - priority } }>
            { builder({ payload, hide }) }
        </div>,
        document.body
    ) : null
}

export type { ModalBuilder }
export { ModalRenderer }
