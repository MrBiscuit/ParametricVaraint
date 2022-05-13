import {handleEvent} from './codeMessageHandler';
import {createParametricComponentSet, ParametricComponentSetSession} from './ComponentSetSession';

figma.showUI(__html__);

const interval = setInterval(() => {
    updateLayout();
}, 100);

let session: ParametricComponentSetSession;

handleEvent('createComponentSet', () => {
    session = createParametricComponentSet();

    figma.currentPage.selection = [session.rootNode];
    figma.viewport.scrollAndZoomIntoView([session.rootNode]);
});

figma.on('selectionchange', () => {
    const sel = figma.currentPage.selection[0];
    if (!sel) return;
    console.log(sel);
    /* if (sel.type === 'COMPONENT') {
        if (lastSelection) {
            console.log(diff(sel, lastSelection));
        }
        lastSelection = sel;
    } */
});

figma.on('close', () => {
    clearInterval(interval);
});

function updateLayout() {}
