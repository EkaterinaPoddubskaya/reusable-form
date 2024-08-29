const getErrorMessage = name => `${name} is defined incorrectly`;
const getButtonDefaultMessage = name => webix.message(`${name} button was clicked (default message)`);

webix.protoUI({
  name: 'autoForm',
  defaults: {
    labelWidth: 140,
    saveAction: () => getButtonDefaultMessage('Save'),
    cancelAction: () => getButtonDefaultMessage('Cancel')
  },
  fields_setter: (value) => {
    if (!webix.isArray(value)) value = [value];
    for (let i = 0; i < value.length; ++i) {
      if (typeof value[i] !== 'string' || !value[i]) {
        throw new Error(getErrorMessage('fields'));
      }
    }
    return value;
  },
  saveAction_setter: (value) => {
    if (typeof value !== 'function') { throw new Error(getErrorMessage('saveAction')); }
    return value;
  },
  cancelAction_setter: (value) => {
    if (typeof value !== 'function') { throw new Error(getErrorMessage('cancelAction')); }
    return value;
  },
  labelWidth_setter: (value) => {
    if (typeof value !== 'number') { throw new Error(getErrorMessage('labelWidth')); }
    return value;
  },

  getAutoFormField: (fieldName, labelWidth) => ({
    view: 'text',
    label: fieldName,
    name: fieldName,
    labelWidth,
    invalidMessage: `${fieldName} must not be empty`,
    validate: webix.rules.isNotEmpty
  }),
  getSaveButton: () => ({view: 'button', id: 'saveButton', label: 'Save', css: 'webix_primary'}),
  getCancelButton: () => ({view: 'button', id: 'cancelButton', label: 'Cancel', css: 'webix_secondary'}),
  getFormElements(fieldNames, labelWidth) {
    const fullForm = [{rows: fieldNames.map(name => this.getAutoFormField(name, labelWidth))}];
    fullForm.push({cols: [this.getCancelButton(), this.getSaveButton()], margin: 15});
    return fullForm;
  },
  getFormElementsConfig() {
    return {
      on: {
        onTimedKeyPress() {
          this.validate();
        }
      }
    };
  },

  $init(config) {
    if (!config.labelWidth) config.labelWidth = this.defaults.labelWidth;
    config.elements = this.getFormElements(config.fields, config.labelWidth);
    config.elementsConfig = this.getFormElementsConfig();

    this.$ready.push(() => {
      const saveEventId = $$('saveButton').attachEvent('onItemClick', () => {
        this.config.saveAction();
      });
      const cancelEventId = $$('cancelButton').attachEvent('onItemClick', () => {
        this.config.cancelAction();
      });
      this.attachEvent('onDestruct', () => {
        this.detachEvent(saveEventId); // in case it will be connected to datatable as well
        this.detachEvent(cancelEventId);
      });
    });
  }
}, webix.ui.form);
