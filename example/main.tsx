import './index.css'

import { createRoot } from 'react-dom/client'

import App from './App.tsx'

// usage of modal
import './modal/index.css'
import { ModalRoot } from "./modal";
import { manager, type PayloadMap } from "./modals.tsx";

createRoot(document.getElementById('root')!).render(
    <ModalRoot<PayloadMap> manager={ manager }>
        <App/>
    </ModalRoot>
)
