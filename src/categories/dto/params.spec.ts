import { BaseParams } from '../../params/baseParams';

describe('Params', () => {
  it('should be defined', () => {
    expect(new BaseParams()).toBeDefined();
  });
});
