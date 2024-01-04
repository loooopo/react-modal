import { ModalBodyBuilder } from "./builder.tsx";
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
    /**
     * **Hook:** useShowModal
     */
    public useShowModal = (): <ModalName extends keyof PayloadMap>(name: ModalName, payload: PayloadMap[ModalName]) => void => {
        const { showWithPayload } = useContext(ctx);

        return <ModalName extends keyof PayloadMap>(name: ModalName, payload: PayloadMap[ModalName]) => {
            const priority = ModalManager.instance!.priorityOf(name)
            if(priority === undefined) throw new Error(`The modal "${ name as string }" is not registered!`)
            showWithPayload(priority, payload)
        }
    }

    /**
     * **Hook:** useHideModal
     */
    public useHideModal() {
        const { hideSpec } = useContext(ctx);

        return <ModalName extends keyof PayloadMap>(name: ModalName) => {
            const priority = ModalManager.instance!.priorityOf(name)
            if(priority === undefined) throw new Error(`The modal "${ name as string }" is not registered!`)
            hideSpec(priority)
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
     */
    static #zLimit: number = 1000;

    /**
     * The maximum z-index of the modal. (The z-index of the modal is 'ZLimit - priority')
     *
     * This should be modified as early as possible (if necessary).
     *
     * @default 1000
     */
    public static get zLimit() {
        return ModalManager.#zLimit;
    }

    public static set zLimit(value: number) {
        sealingCheck();

        if(value <= 0) throw new Error('The zLimit must be greater than 0!');

        ModalManager.#zLimit = value;
    }

    public setZLimit(value: number) {
        ModalManager.zLimit = value;
    }

    /**
     * The priority of the modal.
     * - start from 0, the lower the priority, the higher the level of display
     * - the z-index of the modal is 'ZLimit - priority'
     */
    #priority = new Map<keyof PayloadMap, number>();

    /**
     * Get the priority of the modal. If the modal is not registered, return -1.
     * @param name The name of the modal.
     */
    public priorityOf(name: keyof PayloadMap): number | undefined {
        return this.#priority.get(name);
    }

    /**
     * The map of modals' names and their Body builders.
     */
    #modalMap: { [name in keyof PayloadMap]: ModalBodyBuilder<PayloadMap[name]> } = {} as any;
    public get modalMap(): { [name in keyof PayloadMap]: ModalBodyBuilder<PayloadMap[name]> } {
        return { ...(this.#modalMap) };
    }

    /**
     * Register the stack of modals' names.
     * The higher the name is, the higher the level of display is.
     *
     * @param modalMap A map of modals' names and their FCs.
     */
    public register(modalMap: { [name in keyof PayloadMap]: ModalBodyBuilder<PayloadMap[name]> }) {
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