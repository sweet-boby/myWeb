import { getImgUtils } from "../Util/ImgUtil";
import { getAudioUtils } from "../Util/AudioUtils";
import concurRequest from "../Util/concurRequest";
import { GameObject } from "./GameObject";
import { Animation } from "../component/Animation";
import { table } from "console";
export class Atlas {
  private images: HTMLImageElement[] = [];

  constructor(imgs?: HTMLImageElement[]) {
    if (imgs) {
      this.images = imgs;
    }
  }

  clear() {
    this.images = [];
  }

  getlen() {
    return this.images.length;
  }

  getImage(index: number): HTMLImageElement {
    return this.images[index];
  }
  addImage(image: HTMLImageElement) {
    this.images.push(image);
  }
}

export class ResourcesManager {
  private static _instance: ResourcesManager;
  private atlas: Map<string, Atlas> = new Map();
  private images: Map<string, HTMLImageElement> = new Map();
  private audios: Map<string, AudioBuffer> = new Map();
  private fonts: Map<string, FontFace> = new Map();
  private imgUtil = getImgUtils();
  private audioUtil = getAudioUtils();
  private constructor() {}

  public static getInstance(): ResourcesManager {
    if (!ResourcesManager._instance) {
      ResourcesManager._instance = new ResourcesManager();
    }
    return ResourcesManager._instance;
  }

  async getloadfileUrl(src: string) {
    const res = await fetch(`api/fs?path=${src}`, {
      method: "GET",
    });
    const data = await res.json();
    const urls = [...data.data];
    return urls.map((url) => {
      return src + "/" + url;
    });
  }

  async loadfile(urls: string[]) {
    let isFail = false;
    const resq = await concurRequest(urls, 30, async (url) => {
      if (url.endsWith(".png") || url.endsWith(".jpg")) {
        return this.imgUtil.loadImage(url);
      } else if (url.endsWith(".mp3") || url.endsWith(".wav")) {
        return this.audioUtil.loadAudioBuffer(url);
      } else if (url.endsWith(".ttf") || url.endsWith(".otf")) {
        return new FontFace(url, `url(${url})`).load();
      }
    });
    const failResUrl: string[] = [];
    resq.map((res, index) => {
      if (res instanceof Event) {
        if (res.type === "error") {
          isFail = true;
          failResUrl.push(urls[index]);
        }
      }
    });
    resq.forEach((res, i) => {
      if (res instanceof HTMLImageElement) {
        this.images.set(urls[i], res);
      } else if (res instanceof AudioBuffer) {
        this.audios.set(urls[i], res);
      } else if (res instanceof FontFace) {
        this.fonts.set(urls[i], res);
      }
    });
    return {
      isFail,
      failResUrl,
      resq,
      urls,
    };
  }

  async imageToAtlas(imgSrc: string, num: number, atlasSrc: string) {
    const { imageToAtlas } = this.imgUtil;
    const img = this.images.get(imgSrc);
    if (!img) return;
    const atlas = await imageToAtlas(img, num);
    this.addAtlas(atlasSrc, atlas);
    return atlas;
  }

  async flipAtlas(src: string, newSrc: string) {
    const { filpAtlas } = this.imgUtil;
    const atlas = this.atlas.get(src);
    if (!atlas) return;
    const newAtlas = await filpAtlas(atlas);
    this.addAtlas(newSrc, newAtlas);
    return newAtlas;
  }

  atlasToAnimation(src: string, gameObject: GameObject) {
    const animation = new Animation(gameObject);
    const atlas = this.atlas.get(src);
    if (!atlas) return;
    animation.setAtlas(atlas);
    return animation;
  }

  async imageToAnimation(
    gameObject: GameObject,
    ...arg: Parameters<typeof this.imageToAtlas>
  ) {
    await this.imageToAtlas(...arg);
    const animation = this.atlasToAnimation(arg[2], gameObject);
    if (animation) return animation;
  }

  async flipAtlasToAnimation(
    gameObject: GameObject,
    ...arg: Parameters<typeof this.flipAtlas>
  ) {
    await this.flipAtlas(...arg);
    const aniamtion = this.atlasToAnimation(arg[1], gameObject);
    if (aniamtion) return aniamtion;
  }

  getImageUrlsByInclude(str: string) {
    const urls = [];
    for (let i of this.images.keys()) {
      if (i.includes(str)) urls.push(i);
    }
    return urls;
  }

  imageUrlsToAtlas(urls: string[], atlasName: string) {
    const images = urls.map((i) => {
      return this.images.get(i);
    });
    const atlas = new Atlas(
      images.filter((img): img is HTMLImageElement => img !== undefined)
    );
    this.atlas.set(atlasName, atlas);
    return atlas;
  }

  filePathToAtlas(path: string, atlasName: string) {
    const urls = this.getImageUrlsByInclude(path);
    urls.sort((a, b) => {
      const aa = a.split("/");
      const bb = b.split("/");
      const anum = Number(
        aa[aa.length - 1].replace(".png", "").replace(".jpg", "")
      );
      const bnum = Number(
        bb[bb.length - 1].replace(".png", "").replace(".jpg", "")
      );
      return anum - bnum;
    });
    const atlas = this.imageUrlsToAtlas(urls, atlasName);
    return atlas;
  }

  getAudioSource(key: string) {
    const audio = this.audios.get(key);
    if (!audio) return;
    const source = this.audioUtil.getAudioSource(audio);
    return source;
  }

  playAudioSource(source: AudioBufferSourceNode, loop: boolean = false) {
    this.audioUtil.playSound(source, loop);
  }

  stopAudioSource(source: AudioBufferSourceNode) {
    this.audioUtil.stopSound(source);
  }

  //关闭所有音频
  closeAllAudio() {
    this.audioUtil.closeAudioContext();
  }

  getAtlas(key: string) {
    return this.atlas.get(key);
  }
  addAtlas(key: string, atlas: Atlas) {
    this.atlas.set(key, atlas);
  }

  getImages() {
    return this.images;
  }
  getImage(key: string) {
    return this.images.get(key);
  }

  getAudios() {
    return this.audios;
  }
  getAudio(key: string) {
    return this.audios.get(key);
  }
  getFonts() {
    return this.fonts;
  }
  getFont(key: string) {
    return this.fonts.get(key);
  }
}
