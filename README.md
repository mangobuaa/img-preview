# img-preview
图片预览小组件。支持放大、缩小、旋转操作。


## Examples

```typescript
import { ImagePreview } from "image-preview-omg";

const container = document.querySelector('#container') as HTMLElement;
const preview = new ImagePreview(container, 'https://xxx.static.com/xxx.png', { step: 0.1});

// 放大
preview.zoomIn();

// 缩小
preview.zoomOut()

// 左旋转
preview.rotateLeft();

// 右旋转
preview.rotateRight();
```
