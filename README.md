The task is to create a reusable form with "Cancel" and "Save" buttons.

The hits are:
1) use webix.protoUI to inherit from UI form
2) in the $init method modify config (generate fields and buttons, set them as config.elements)
3) set default actions for Cancel and Save buttons (default actions should be called only if these actions are not reset in the configuration)