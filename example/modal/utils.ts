const MODAL_UTILS_CONFIG = {
    enable_debug: true
}

const debugLog = (...data: any[]) => {
    if(!MODAL_UTILS_CONFIG.enable_debug) return;
    console.log(...data);
}

export {
    debugLog
}