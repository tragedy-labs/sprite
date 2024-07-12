import { SpriteCommand } from '@/SpriteCommand';

describe('SpriteCommand constructor', () => {
  it('should accept an `initial` string as a parameter within the config object, and append it to the command', () => {
    /* Arrange */
    const command = new SpriteCommand({
      initial: 'INITIAL',
    });
    /* Assert */
    expect(command.toString()).toBe(`INITIAL`);
  });
});
