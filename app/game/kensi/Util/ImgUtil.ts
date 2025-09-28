import { Atlas } from "../common/ResourcesManager";

export function getImgUtils() {
  const canvas = document.createElement("canvas");
  const hiddenCtx = canvas.getContext("2d", { willReadFrequently: true });

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(err);
      img.src = src;
    });
  };

  const getImgData = (image: HTMLImageElement) => {
    canvas.width = image.width;
    canvas.height = image.height;
    if (!hiddenCtx) return;
    hiddenCtx.clearRect(0, 0, image.width, image.height);
    hiddenCtx.drawImage(image, 0, 0);
    return hiddenCtx.getImageData(0, 0, image.width, image.height);
  };

  const letImageBeWihte = (
    ctx: CanvasRenderingContext2D,
    image: HTMLImageElement,
    dx: number,
    dy: number
  ) => {
    const imageData = getImgData(image);
    if (!imageData) return;
    const data = imageData.data;
    // 降低亮度
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255; // Red
      data[i + 1] = 255; // Green
      data[i + 2] = 255; // Blue
      // data[i + 3] 是 Alpha 通道，不需要修改
    }

    ctx.putImageData(imageData, dx, dy);
  };

  const splitImageHorizontally = (
    image: HTMLImageElement,
    numFrames: number
  ): HTMLCanvasElement[] => {
    const frames: HTMLCanvasElement[] = [];
    const frameWidth = Math.floor(image.width / numFrames);
    const frameHeight = image.height;

    for (let i = 0; i < numFrames; i++) {
      const frameCanvas = document.createElement("canvas");
      frameCanvas.width = frameWidth;
      frameCanvas.height = frameHeight;
      const frameCtx = frameCanvas.getContext("2d");
      if (frameCtx) {
        frameCtx.drawImage(
          image,
          i * frameWidth, // Source X
          0, // Source Y
          frameWidth, // Source Width
          frameHeight, // Source Height
          0, // Destination X
          0, // Destination Y
          frameWidth, // Destination Width
          frameHeight // Destination Height
        );
      }
      frames.push(frameCanvas);
    }
    return frames;
  };

  const canvasesToImages = async (canvases: HTMLCanvasElement[]) => {
    return await Promise.all(
      canvases.map(async (canvas) => {
        return new Promise<HTMLImageElement>((resolve, reject) => {
          const image = new Image();
          image.onload = () => resolve(image);
          image.onerror = (err) => reject(err);
          image.src = canvas.toDataURL();
        });
      })
    );
  };

  const imageToAtlas = async (image: HTMLImageElement, numFrames: number) => {
    const canvases = splitImageHorizontally(image, numFrames);
    const images = await canvasesToImages(canvases);
    const atlas: Atlas = new Atlas(images);
    return atlas;
  };

  const flipImageHorizontally = async (image: HTMLImageElement) => {
    return new Promise<HTMLImageElement>(async (resolve, reject) => {
      const flippedCanvas = canvas;
      flippedCanvas.width = image.width;
      flippedCanvas.height = image.height;
      const flippedCtx = hiddenCtx;
      if (flippedCtx) {
        flippedCtx.translate(image.width, 0);
        flippedCtx.scale(-1, 1);
        flippedCtx.drawImage(image, 0, 0);
      }
      const flippedImage = new Image();
      flippedImage.onload = () => resolve(flippedImage);
      flippedImage.onerror = (err) => reject(err);
      flippedImage.src = flippedCanvas.toDataURL();
      // await flippedImage.decode();
      // return flippedImage;
    });
  };

  const filpAtlas = async (atlas: Atlas) => {
    const flippedAtlas: Atlas = new Atlas();
    for (let index = 0; index < atlas.getlen(); index++) {
      const image = atlas.getImage(index);
      const flippedImage = await flipImageHorizontally(image);
      flippedAtlas.addImage(flippedImage);
    }
    return flippedAtlas;
  };

  return {
    getImgData,
    loadImage,
    letImageBeWihte,
    splitImageHorizontally,
    canvasesToImages,
    imageToAtlas,
    flipImageHorizontally,
    filpAtlas,
  };
}
