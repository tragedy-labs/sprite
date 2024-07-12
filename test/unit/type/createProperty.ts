describe('SpriteType.createProperty', () => {
  // it("send a properly formatted command via SpriteDatabase.command", async () => {
  //   jest.spyOn(SpriteDatabase, "command").mockResolvedValueOnce({
  //     result: [{}],
  //   } as any);
  //   const options = {
  //     constraints: {
  //       default: "string",
  //       min: 6,
  //       max: 8,
  //     },
  //     embeddedType: "false",
  //     ifNotExists: true,
  //   };
  //   await client.createProperty("aProperty", "string", testTransaction, {
  //     constraints: { min: 0, max: 1, default: "string" },
  //   });
  //   expect(SpriteDatabase.command).toHaveBeenCalledWith(
  //     "sql",
  //     `CREATE PROPERTY aDocument.aProperty STRING (min 0, max 1, default string)`,
  //     testTransaction
  //   );
  // });
  // it('should handle ifNotExists option by appending "IFNOTEXISTS" to the command', async () => {
  //   jest.spyOn(SpriteDatabase, "command").mockResolvedValueOnce({
  //     result: [{}],
  //   } as any);
  //   await client.createProperty("aProperty", "string", testTransaction, {
  //     constraints: { min: 0, max: 1, default: "string" },
  //     ifNotExists: true,
  //   });
  //   expect(SpriteDatabase.command).toHaveBeenCalledWith(
  //     "sql",
  //     `CREATE PROPERTY aDocument.aProperty IF NOT EXISTS STRING (min 0, max 1, default string)`,
  //     testTransaction
  //   );
  // });
  // it('should handle embeddedType option by appending "" to the command', async () => {
  //   jest.spyOn(SpriteDatabase, "command").mockResolvedValueOnce({
  //     result: [{}],
  //   } as any);
  //   await client.createProperty("bProperty", "float", testTransaction, {
  //     constraints: { default: 4.1 },
  //   });
  //   expect(SpriteDatabase.command).toHaveBeenCalledWith(
  //     "sql",
  //     `CREATE PROPERTY aDocument.aProperty STRING (min 0, max 1, default string)`,
  //     testTransaction
  //   );
  // });
});
