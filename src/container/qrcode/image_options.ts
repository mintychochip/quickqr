export const CrossOriginType = {
  ANONYMOUS: 'anonymous',
  CREDENTIALS: 'credentials'
};
export type CrossOriginType = typeof CrossOriginType[keyof typeof CrossOriginType];

export class ImageOptions {
  hideBackgroundDots: boolean = true
  imageSize: number = 0.4
  margin: number = 0
  crossOrigin: CrossOriginType | null = null
  saveAsBlob: boolean = true

  private constructor() {

  }

  static builder():

  static create(): ImageOptions {
    return new ImageOptions();
  }
}

class ImageOptionsBuilder {

}
