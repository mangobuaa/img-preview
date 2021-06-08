
export interface ImagePreviewOptions {
    step: number,
}
export class ImagePreview {
    // 包裹图片及 outer 的父元素
    private wrap: HTMLElement;
    private wrapWidth: number = 0;
    private wrapHeight: number = 0;
    // 包裹 图片 的 父元素
    private imageOuter: HTMLElement;
    // 图片元素
    private image: HTMLImageElement;
    // 放大比例
    private scale = 1;
    // 图片源
    private src: string;
    // 放大快慢，灵敏度
    private step = 0.1;
    // 默认配置项
    private options: ImagePreviewOptions = {
        step: 0.1
    }
    private imgOuterTranslateX = 0;
    private imgOuterTranslateY = 0;
    private rotate = 0;
    private length: number = 0;
    constructor (wrap: HTMLElement, src: string, options: Partial<ImagePreviewOptions> = {}) {
        this.wrap = wrap;
        this.src = src;
        Object.assign(this.options, options);
        this.step = this.options.step;
        this.init();
    }

    /** 放大 */
    public zoomIn () {
        this.scale += this.step;
        this.resize();
    }

    /** 缩小 */
    public zoomOut() {
        this.scale -= this.step;
        if (this.scale > 0.001) {
            this.resize();
        } else {
            this.scale += this.step;
        }
    }

    /** 向右旋转 */
    public rotateRight () {
        this.rotate += 90;
        this.imageOuter.style.transformOrigin = 'center center';
        this.transformImgOuter();
    }
    /** 向左旋转 */
    public rotateLeft () {

    }

    private init () {
        // 清空父容器所有子元素
        this.resetWrap();


        // 创建图片
        this.createImage(() => {
            // 创建 imageOuter，并设置样式
            this.createImgOuter();
        });
    }

    /** 缩放图片，其实缩放的是 imageOuter */
    private resize() {
        const { wRatio, hRatio } = this.getRatio();

        this.resizeImageOuter(wRatio, hRatio);
        this.resizeImage();
    }

    private imgResize = true;
    private resizeImage() {
        const { clientWidth, clientHeight } = this.image;
        if (clientWidth < this.imageOuter.clientWidth-1 && clientHeight < this.imageOuter.clientHeight-1 && this.imgResize) {
            this.image.style.transform = `translate(-50%, -50%) scale(${this.scale})`;
        } else if (clientWidth < this.imageOuter.clientWidth-1 && clientHeight < this.imageOuter.clientHeight-1 && !this.imgResize) {
            this.image.style.maxHeight = 'none';
            this.image.style.maxWidth = 'none';
            this.image.style.width = '100%';
            this.image.style.height = '100%';
        } else {
            this.imgResize = false;
        }

    }

    private resizeImageOuter (wRatio: number, hRatio: number) {
        console.log('wRation: ' + wRatio + ', hRatio:' + hRatio);
        this.imageOuter.style.width = this.scale * this.length +  'px';
        this.imageOuter.style.height = this.scale * this.length + 'px';

        const {scrollHeight, scrollWidth } = this.imageOuter;
        if (scrollHeight < this.wrapHeight || scrollWidth < this.wrapWidth) {
            this.imgOuterTranslateY = (scrollHeight < this.wrapHeight) ? ((this.wrapHeight - scrollHeight) / 2) : 0;
            this.imgOuterTranslateX = (scrollWidth < this.wrapWidth) ? ((this.wrapWidth - scrollWidth) / 2) : 0;
            this.transformImgOuter();
        } else {
            this.imgOuterTranslateX = 0;
            this.imgOuterTranslateY = 0;
            this.transformImgOuter();
        }
        this.wrap.scrollTop = (this.imageOuter.scrollHeight - this.wrapHeight) * hRatio / (hRatio + 1);
        this.wrap.scrollLeft = (this.imageOuter.scrollWidth - this.wrapWidth) * wRatio / (wRatio + 1); 
    }


    private getRatio(): {wRatio: number, hRatio: number} {
        const { scrollTop, scrollLeft, clientHeight, clientWidth } = this.wrap;
        const { scrollHeight, scrollWidth } = this.imageOuter;
        let wRatio = 1;
        let hRatio = 1;

        if (scrollHeight) {
            let up = scrollTop;
            let bottom = scrollHeight - clientHeight - up;
            console.log('up: ' + up + ', bottom: ' + bottom);
            if (bottom < 0.001) {
                bottom = 0.001;
            }
            if (bottom) {
                hRatio = up/bottom;
            }

            if (scrollHeight < clientHeight) {
                console.log('scrollHeight < clientHeight');
                hRatio = 1;
            }
        }
        if (scrollWidth) {
            let left = scrollLeft;
            let right = scrollWidth - clientWidth - left;

            if (left === 0 && right < 0.001) {
                wRatio = 1;
            } else {
                if (right < 0.001) {
                    right = 0.001;
                }
                if (right) {
                    wRatio = left/right;
                }
            }


            if (scrollWidth < clientWidth) {
                console.log('scrollWidth < clientWidth');
                wRatio = 1;
            }
        }

        return { wRatio, hRatio };
    }

    private transformImgOuter () {
        this.imageOuter.style.transform = `translate(${this.imgOuterTranslateX}px, ${this.imgOuterTranslateY}px) rotate(${this.rotate}deg)`;
    }

    /** 重置父容器 */
    private resetWrap () {
        this.wrap.innerHTML = '';
        this.wrap.style.overflow = 'auto';
        this.calWrapSize();
    }

    /** 计算父容器的大小 */
    private calWrapSize () {
        this.wrapWidth = this.wrap.clientWidth;
        this.wrapHeight = this.wrap.clientHeight;
    }

    /** 创建 ImageOuter */
    private createImgOuter () {
        const { clientWidth, clientHeight } = this.wrap;
        this.imageOuter = document.createElement('div');
        this.imageOuter.style.position = 'relative';

        this.length = Math.max(clientHeight, clientWidth);
        this.imageOuter.style.width = this.length + 'px';
        this.imageOuter.style.height = this.length + 'px';

        this.imageOuter.appendChild(this.image);
        this.wrap.appendChild(this.imageOuter);
        this.resizeImageOuter(1, 1);
        this.resizeImage();
    }

    /** 创建图片 */
    private createImage (callback: Function) {
        this.image = document.createElement('img');
        this.image.src = this.src;
        this.image.style.position = 'absolute';
        this.image.style.left = '50%';
        this.image.style.top = '50%';
        this.image.style.transformOrigin = 'center center';
        this.image.style.transform = 'translate(-50%, -50%)';
        this.image.style.maxWidth = '100%';
        this.image.style.maxHeight = '100%';
        this.image.style.objectFit = 'contain';
        this.image.onload = () => {
            callback();
        }
    }
}