import {handleEvent} from './codeMessageHandler';
import {createParametricComponentSet, getPCSFromComponentSetNode} from './utilComponentSetSession';
import {ParametricComponentSetSession} from './ComponentSetSession';
import {getParametricComponentSet} from './helper';

figma.showUI(__html__, {width: 240, height: 240});

const interval = setInterval(() => {
    session?.updateLayout();
}, 100);

let session: ParametricComponentSetSession;

handleEvent('createComponentSet', () => {
    session = createParametricComponentSet();

    figma.currentPage.selection = [session.rootNode];
    figma.viewport.scrollAndZoomIntoView([session.getBaseVariant()]);
});

handleEvent('createVariant', (row) => {
    session?.createRow({
        type: row.type,
        name: row.name,
        defaultValue:row.value,
        
    });
    // TODO 创建时处理value
});

figma.on('selectionchange', () => {
    const sel = figma.currentPage.selection[0];

    console.log('selectionchange', sel);

    if (!sel && session && !session.rootNode.parent) {
        session.remove();
        session = null;
        return;
    }

    const pcs = getParametricComponentSet(sel);
    if (!session || session.rootNode.id !== pcs?.id) {
        const sess = getPCSFromComponentSetNode(pcs);

        // 如果选中的是一个ParametricComponentSet
        if (sess) {
            session?.close();
            session = sess;
            session.setChildSelection(sel);
        } else {
            // 选中的不是ParametricComponentSet
            // 关闭这个session
            session?.close();
            session = null;
            // TODO UI
        }
    } else {
        session.setChildSelection(sel);
    }
});

figma.on('close', () => {
    clearInterval(interval);
});
