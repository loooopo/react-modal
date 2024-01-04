/**
 * Misc config flags
 */
const MODAL_UTILS_CONFIG = {
    /**
     * Whether the debug log is enabled
     *
     * @default true
     */
    enable_debug: true
}

const debugLog = (...data: any[]) => {
    if(!MODAL_UTILS_CONFIG.enable_debug) return;
    console.log(...data);
}

export {
    MODAL_UTILS_CONFIG,
    debugLog
}