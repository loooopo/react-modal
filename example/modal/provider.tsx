import { createContext, ReactNode, useState } from "react";
import { ModalManager, seal } from "./manager.ts";
import { ModalBuilder, ModalRenderer } from "./builder.tsx";
import { debugLog } from "./utils.ts";

/**
 * An internal-maintainable state for the modal context.
 */
type ContextState<PayloadMap extends Record<string, unknown> = any> = {
    // ========== state ==========
    /**
     * A number, each bit of its binary representation represents the visibility of a modal.
     */
    visibility: number

    // ========== mutators ==========
    /**
     * setVisibility
     */
    setVisibility: (setter: ((prevState: number) => number) | number) => void

    /**
     * showWithPayload
     */
    showWithPayload<Payload>(priority: number, payload: Payload): void

    /**
     * hideSpec
     */
    hideSpec(priority: number): void

    // ========== pass-through ==========
    /**
     * A modal manager instance.
     *
     * ---
     *
     * FIXME: This is not a good practice to use `any` here.
     */
    manager: ModalManager<PayloadMap>
}

// @ts-expect-error There is no need to provide a default value.
const ctx = createContext<ContextState>(null)

function ModalRoot<ModalPayloadMap extends Record<string, unknown> = any>({ manager, children }: {
    manager: ModalManager<ModalPayloadMap>,
    children: ReactNode
}) {
    // ! seal the manager to prevent further modification
    seal();

    const [ visibility, setVisibility ] = useState<number>(0)

    // 不使用 useState 避免导致其他组件重新渲染
    let tmp: any = null
    const showWithPayload = (priority: number, payload: unknown) => {
        debugLog(`[ModalRoot] show | priority=${ priority }, payload=`, payload)
        tmp = payload
        setVisibility(prevState => prevState | (0b1 << priority))
    }

    const hideSpec = (priority: number) => {
        debugLog(`[ModalRoot] hide | priority=${ priority }`)
        setVisibility(prevState => prevState & ~(0b1 << priority))
    }

    return (
        <ctx.Provider value={ {
            visibility,
            setVisibility,
            showWithPayload,
            hideSpec,
            manager: manager,
        } }>
            { children }

            {
                Object.entries(manager.modalMap).map(([ name, builder ], idx) => {
                    return (
                        <ModalRenderer
                            key={ `modal-${ name }` }
                            visible={ (visibility & (0b1 << idx)) !== 0 }
                            priority={ idx }
                            hide={ () => hideSpec(idx) }
                            builder={ builder as ModalBuilder<unknown> }
                            payload={ tmp }/>
                    )
                })
            }
        </ctx.Provider>
    )
}

export {
    type ContextState,
    ctx,
    ModalRoot
}