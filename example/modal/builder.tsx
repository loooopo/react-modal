import { FC, useRef } from "react";
import { createPortal } from "react-dom";
import { ModalManager } from "./manager.ts";

/**
 * A modal builder.
 *
 * @param payload The payload passed to the modal when it is shown.
 * @param close A function to close the modal.
 */
type ModalBodyBuilder<Payload> = FC<{ payload: Payload, hide: VoidFunction }>

/**
 * Render a modal using the builder. Configure the priority and visibility of the modal.
 *
 * ---
 *
 * Internal-use only.
 */
function ModalRenderer<Payload = unknown>({ visible, priority, hide, BodyBuilder, payload }: {
    visible: boolean,
    priority: number,
    hide: VoidFunction
    BodyBuilder: ModalBodyBuilder<Payload>
    payload: Payload
}) {
    const ref = useRef<HTMLDivElement>(null)

    // TODO: support any target element to attach to, or pass 'null' as is
    return visible ? createPortal(
        <div ref={ ref } className={ 'modal-wrapper' }
             style={ { zIndex: ModalManager.zLimit - priority } }>
            {/* use as component rather than function, to avoid react reporting an error on hook call */ }
            <BodyBuilder payload={ payload } hide={ hide }/>
        </div>,
        document.body
    ) : null
}

export type { ModalBodyBuilder }
export { ModalRenderer }
