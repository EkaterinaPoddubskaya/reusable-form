webix.protoUI({
  name: 'autoForm',
  defaults: {
    labelWidth: 140,
    getButtonDefaultMessage: name => webix.message(`${name} button was clicked (default message)`),
    saveAction() { return this.getButtonDefaultMessage('Save'); },
    cancelAction() { return this.getButtonDefaultMessage('Cancel'); }
  },

  getErrorMessage: name => `${name} is defined incorrectly`,

  fields_setter(value) {
    if (!webix.isArray(value)) value = [value];
    if (!value.length) throw new Error(this.getErrorMessage('fields'));
    for (let i = 0; i < value.length; ++i) {
      if (typeof value[i] !== 'string' || !value[i]) {
        throw new Error(this.getErrorMessage('fields'));
      }
    }
    return value;
  },
  saveAction_setter(value) {
    if (typeof value !== 'function') { throw new Error(this.getErrorMessage('saveAction')); }
    return value;
  },
  cancelAction_setter(value) {
    if (typeof value !== 'function') { throw new Error(this.getErrorMessage('cancelAction')); }
    return value;
  },
  labelWidth_setter(value) {
    if (typeof value !== 'number') { throw new Error(this.getErrorMessage('labelWidth')); }
    return value;
  },

  getAutoFormField: fieldName => ({
    view: 'text',
    label: fieldName,
    name: fieldName,
    invalidMessage: `${fieldName} must not be empty`
  }),
  getSaveButton: formThis => ({
    view: 'button',
    id: 'saveButton',
    label: 'Save',
    css: 'webix_primary',
    click() { return formThis.config.saveAction(); }
  }),
  getCancelButton: formThis => ({
    view: 'button',
    id: 'cancelButton',
    label: 'Cancel',
    css: 'webix_secondary',
    click() { return formThis.config.cancelAction(); }
  }),
  getFormElements(config) {
    const fieldNames = config.fields;
    const fullForm = fieldNames.map(name => this.getAutoFormField(name));
    fullForm.push({cols: [this.getCancelButton(this), this.getSaveButton(this)], margin: 15});
    return fullForm;
  },
  getFormElementsConfig(config) {
    return {
      labelWidth: config.labelWidth || this.defaults.labelWidth,
      validate: webix.rules.isNotEmpty,
      on: {
        onTimedKeyPress() {
          this.validate();
        }
      }
    };
  },

  $init(config) {
    config.elements = this.getFormElements(config);
    config.elementsConfig = this.getFormElementsConfig(config);
  }
}, webix.ui.form);
