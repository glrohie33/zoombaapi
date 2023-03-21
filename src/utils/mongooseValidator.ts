import { Model } from 'mongoose';

export async function isUnique(field) {
  return {
    validator: async function (value) {
      const user = await this.contructor.findOne({ [field]: value });
      if (user) {
        return false;
      }
      return true;
    },
    message: (props) => `${props.value}  field already exist`,
  };
}

export async function generateSlug(
  name: string,
  model: any,
  field = 'title',
): Promise<string> {
  const items = await model.find({ [field]: name });
  const slugName = name.toLowerCase().replace(' ', '_');

  if (items.length === 0) {
    return slugName;
  }

  const lastItem = items[items.length - 1]['slug'];
  const number = lastItem.split('-')[1] || 0;
  return `${slugName}-${Number(number) + 1}`;
}
