const userForm = {
  view: 'autoForm',
  fields: ['First name', 'Second name', 'Address'],
  saveAction: () => {
    webix.message('Save button was clicked (original message)');
  },
  clearAction: () => {},
  width: 400,
  labelWidth: 120
};

webix.ui({
  cols: [userForm]
});
