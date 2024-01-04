import { ModalBuilder } from "./builder.tsx";
import { useContext } from "react";
import { ctx } from "./provider.tsx";

// ========== ========== Sealing ========== ==========

/**
 * guard
 */
let sealed = false

const sealingCheck = () => {
    if(sealed) {
        throw new Error('All modifications must be completed before being passed to "ModalRoot"!')
    }
}

const seal = () => {
    sealed = true
}

// ========== ========== ModalManager ========== ==========

class ModalManager<PayloadMap extends Record<string, unknown> = {}> {
    // bind hooks on the manager instance
    public useShowModal = () => {
        const { showWithPayload } = useContext(ctx);

        return <ModalName extends keyof PayloadMap>(name: ModalName, payload: PayloadMap[ModalName]) => {
            const priority = ModalManager.instance!.priorityOf(name)
            showWithPayload(priority, payload)
        }
    }

    // ========== SEPARATOR ==========

    /**
     * Internal-use only.
     * @private
     */
    static #instantiated: boolean = false;
    static #instance: ModalManager<any> | null = null;
    static get instance(): ModalManager<any> | null {
        return ModalManager.#instance
    }

    constructor() {
        if(ModalManager.#instantiated) {
            throw new Error('You can only instantiate "ModalManager" once!');
        }
        ModalManager.#instantiated = true;
        ModalManager.#instance = this;
    }

    /**
     * Internal-use only.
     * @private
     */
    #zLimit = 1000;

    /**
     * The maximum z-index of the modal. (The z-index of the modal is 'ZLimit - priority')
     *
     * This should be modified as early as possible (if necessary).
     */
    public get zLimit() {
        return this.#zLimit
    }

    public set zLimit(value: number) {
        sealingCheck();

        this.#zLimit = value;
    }

    #priority = new Map<keyof PayloadMap, number>();

    /**
     * Get the priority of the modal. If the modal is not registered, return -1.
     * @param name The name of the modal.
     */
    public priorityOf(name: keyof PayloadMap): number {
        return this.#priority.get(name) ?? -1;
    }

    /**
     * The stack of modals' names.
     */
    #modalMap: { [name in keyof PayloadMap]: ModalBuilder<PayloadMap[name]> } = {} as any;
    public get modalMap(): { [name in keyof PayloadMap]: ModalBuilder<PayloadMap[name]> } {
        return { ...(this.#modalMap) };
    }

    /**
     * Register the stack of modals' names.
     * The higher the name is, the higher the level of display is.
     *
     * @param modalMap A map of modals' names and their FCs.
     */
    public register(modalMap: { [name in keyof PayloadMap]: ModalBuilder<PayloadMap[name]> }) {
        sealingCheck();

        this.#priority = new Map<keyof PayloadMap, number>(
            Object.keys(modalMap).map((name, index) => [ name as keyof PayloadMap, index ])
        );
        this.#modalMap = { ...modalMap };
    }
}

export {
    seal,
    ModalManager
}