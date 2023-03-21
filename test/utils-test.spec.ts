import { generateSlug } from '../src/utils/mongooseValidator';

describe('testing utilities', () => {
  it('test slug is working fine', async () => {
    const model = {
      find: () => {
        return [];
      },
    };

    const slug = await generateSlug('home sound', model);

    expect(slug).toBe('home_sound');
  });
});
