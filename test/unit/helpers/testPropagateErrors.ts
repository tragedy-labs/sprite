/**
 * Verifies that the actor propagates upstream errors
 * @param {(params?: unknown) => void} actor The function to check the return functionality of
 * @returns {Promise<void>}
 * @example
 * describe(...
 *   testPropagateErrros(server.restJson);
 * );
 */
export const testPropagateErrors = (
  actor: (params?: unknown) => void,
  params?: unknown
) =>
  it('should propagate errors from internal methods', async () => {
    // Arrange
    jest
      .spyOn(global, 'fetch')
      .mockRejectedValueOnce(new TypeError('fetch failed'));

    // Assert & Act
    await expect(actor(params)).rejects.toMatchSnapshot();
  });
