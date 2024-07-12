import { SpriteCommand } from '@/SpriteCommand';

describe('SpriteCommand.toString', () => {
  it('returns the command as a string', () => {
    /* Arrange */
    const command = new SpriteCommand({
      initial: 'INITIAL'
    });

    const string = command.toString();

    /* Assert */
    expect(string).toBe(`INITIAL`);
  });
});
