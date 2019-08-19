export const createEntity = (id = null, name = 'Empty', components = {}) => {
  let entity = {
    id,
    name,
    components,
    sendEvent: (target, message, eventType, parameters) => sendEvent(target, message, eventType, parameters),
  };
  return entity
}

export const sendEvent = (target = null, eventType = null, parameters = null) => {
  let success = false;
  for (let key in target.components) {
    let component = target.components[key]
    if (component.hasOwnProperty(eventType)) {
      console.log('SUCCESSFUL EVENT: ', eventType)
      success = true
      component[eventType]({ ...parameters, self: target, component: component });
    }
  }
  if (!success) {
    console.log('FAILED EVENT')
  }
};