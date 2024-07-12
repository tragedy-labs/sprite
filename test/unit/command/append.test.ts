import { SpriteCommand } from '@/SpriteCommand';

describe('SpriteCommand.append', () => {
  it('should append the return value of a node to the command, and add a seperator', () => {
    /* Arrange */
    const command = new SpriteCommand();
    const node = (input: string) => input;
    const input = 'KEYWORD';
    /* Act */
    command.append(node, input);
    /* Assert */
    expect(command.toString()).toBe(` ${input}`);
  });
});
