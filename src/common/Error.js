import { union } from "./Functions";

const getErrors = (validate) => {
  let errors = [];

  if (validate.error) {
    validate.error.details.forEach((error) => {
      // if exists push new message to array message
      const e = errors.find((err) => err.label == error.context.label);
      if (e) {
        e.messages = [...e.messages, error.message];
      } else {
        errors.push({ label: error.context.label, messages: [error.message] });
      }
    });
  }
  return errors;
};

// catch error when input change
const catchErrors = (labelInputs, validate, errors) => {
  let errorsResult = [];
  let errs = getErrors(validate);

  // check item in origin errors
  // if not exist current errors -> remove
  errors = errors.filter((err) => {
    return errs.find((e) => e.label === err.label);
  });

  if (validate.error) {
    // new error
    errorsResult = errs.filter((err) => labelInputs.indexOf(err.label) > -1);
  }

  if (errorsResult.length == 0) {
    // not error
    // remove error to origin errors when true
    errors = errors.filter((err) => labelInputs.indexOf(err.label) == -1);
  } else {
    // merge de duplicate by label field
    // add new error to origin errors
    errors = union([errors, errorsResult], "label");
  }

  return errors;
  // setErrors(errors);
};

const showError = (errors, label) => {
  const data = errors.find((error) => error.label == label);
  return data;
};
export { getErrors, catchErrors, showError };
