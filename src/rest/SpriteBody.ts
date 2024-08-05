export type SpriteRestBody = object | string | null;

class SpriteBody {
  public static compose(body: SpriteRestBody): BodyInit {
    return typeof body !== 'string' ? JSON.stringify(body) : body;
  }
}

export { SpriteBody };
