# Interactive Research Portfolio

This portfolio is designed as a research surface rather than a marketing page. The 3D environment stays in the background and the tablet interface carries the work.

## Design Constraints

- Preserve readable research content.
- Keep 3D geometry performant.
- Avoid exact copyrighted assets or logos.
- Use material contrast instead of visual noise.
- Make every card resolve to a document.

The scene is assembled from reusable modules: camera controls, lighting, command-center geometry, content loading, Markdown rendering, and panel interaction.

```js
import {initPanels} from './panels.js';
import {createWorkstation} from './scene.js';

initPanels();
createWorkstation(document.getElementById('scene-canvas'));
```

## Why This Works

The environment gives context, but the portfolio stays functional. The command display and consoles make the work feel like part of an operating system instead of floating web cards.
