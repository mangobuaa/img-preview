export interface ImagePreviewOptions {
    step: number;
}
export declare class ImagePreview {
    private wrap;
    private wrapWidth;
    private wrapHeight;
    private imageOuter;
    private image;
    private scale;
    private src;
    private step;
    private options;
    private imgOuterTranslateX;
    private imgOuterTranslateY;
    private rotate;
    private length;
    constructor(wrap: HTMLElement, src: string, options?: Partial<ImagePreviewOptions>);
    /** 放大 */
    zoomIn(): void;
    /** 缩小 */
    zoomOut(): void;
    /** 向右旋转 */
    rotateRight(): void;
    /** 向左旋转 */
    rotateLeft(): void;
    private init;
    /** 缩放图片，其实缩放的是 imageOuter */
    private resize;
    private imgResize;
    private resizeImage;
    private resizeImageOuter;
    private getRatio;
    private transformImgOuter;
    /** 重置父容器 */
    private resetWrap;
    /** 计算父容器的大小 */
    private calWrapSize;
    /** 创建 ImageOuter */
    private createImgOuter;
    /** 创建图片 */
    private createImage;
}
