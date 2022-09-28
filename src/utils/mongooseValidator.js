export async function isUnique(field) {
  return {
    validator: async function (value) {
      const user = await this.contructor.findOne({ [field]: email });
      if (user) {
        return false;
      }
      return true;
    },
    message: (props) => `${props.value}  field already exist`,
  };
}
