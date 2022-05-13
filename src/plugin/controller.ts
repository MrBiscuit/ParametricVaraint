import {handleEvent} from './codeMessageHandler';
import {createParametricComponentSet, getPCSFromComponentSetNode} from './utilComponentSetSession';
import {ParametricComponentSetSession} from './ComponentSetSession';
import {getParametricComponentSet} from './helper';

figma.showUI(__html__);

const interval = setInterval(() => {
    session?.updateLayout();
}, 100);

let session: ParametricComponentSetSession;

handleEvent('createComponentSet', () => {
    session = createParametricComponentSet();

    figma.currentPage.selection = [session.rootNode];
    figma.viewport.scrollAndZoomIntoView([session.getBaseFrame()]);
});

figma.on('selectionchange', () => {
    const sel = figma.currentPage.selection[0];
    if (!sel) {
        if (session) {
            session.childSelection = null;
        }
        return;
    }
    console.log('selectionchange', sel);
    const parametricComponentSet = getParametricComponentSet(sel);
    if (parametricComponentSet.type !== 'COMPONENT_SET') {
        session = null;
        return;
    }
    const sess = getPCSFromComponentSetNode(parametricComponentSet);

    // 如果创建成功
    if (sess) {
        session = sess;
        session.childSelection = sel;
    } else {
        // TODO: UI上提示是否转换
        session = null;
    }
});

figma.on('close', () => {
    clearInterval(interval);
});
