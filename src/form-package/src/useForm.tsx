import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
  useRef
} from 'react';
import './form.scss';

import { validateField, isFormValid } from './validation';
import { flatFields } from './utils';

import { Input } from './fields';
import { Checkbox } from './fields/checkbox';
import { Select } from './fields/select';
import { MultipleSelect } from './fields/multiple-select';
import { Range } from './fields/range';
import { List } from './fields/list';
import { Date } from './fields/date';

let forms = {};
let lists = {};

const removeForm = formId => {
  delete forms[formId];
};

const getFormValues = form => {
  const { name, fields } = form;
  const assignValue = (passedFields, prefix) =>
    Object.keys(passedFields).reduce((res, field) => {
      const thisField = passedFields[field];
      const id = prefix + field;
      if (thisField.type === 'group') {
        return {
          ...res,
          [field]: assignValue(thisField.fields, id + '.')
        };
      } else {
        return {
          ...res,
          [field]: forms[name][id].value
        };
      }
    }, {});
  return assignValue(fields, '');
};

const setProperty = (formId, fieldId, property, value) => {
  const error =
    property === 'value'
      ? validateField(forms[formId][fieldId].validation, value)
      : forms[formId][fieldId].error;
  const formValidBefore = isFormValid(forms[formId]);
  forms = {
    ...forms,
    [formId]: {
      ...forms[formId],
      [fieldId]: {
        ...forms[formId][fieldId],
        [property]: value,
        error
      }
    }
  };
  const formValidAfter = isFormValid(forms[formId]);

  if (formValidBefore !== formValidAfter) {
    forms[formId].setValid(formValidAfter);
  }
  const setter = forms[formId][fieldId].setter;
  setter(forms[formId][fieldId]);
};

const useFieldSubscription = (formId, fieldId) => {
  const [state, setState] = useState(forms[formId][fieldId]);

  useEffect(() => {
    const field = forms[formId][fieldId];

    forms = {
      ...forms,
      [formId]: {
        ...forms[formId],
        [fieldId]: {
          ...field,
          id: fieldId,
          setter: setState
        }
      }
    };
  }, [fieldId, formId]);

  const onChange = useCallback(
    (field, value) => setProperty(formId, field, 'value', value),
    [formId]
  );
  const onBlur = useCallback(
    field =>
      !forms[formId][field].touched &&
      setProperty(formId, field, 'touched', true),
    [formId]
  );

  return {
    ...state,
    onChange,
    onBlur
  };
};

interface Fields {
  [key: string]: any;
}

interface Form {
  name: string;
  fields: Fields;
  initialValues?: any;
}

export default (form: Form) => {
  const [valid, setValid] = useState(false);
  const [resetCount, setResetCount] = useState(0);
  const initializedRef = useRef(false);

  const flattenedFields = useCallback(
    initialValues => flatFields(form.name, form.fields, initialValues),
    [form.name, form.fields]
  );

  const initForm = useCallback(
    initialValues => {
      if (forms.hasOwnProperty(form.name)) {
        console.log(`Form ${form.name} already exists`);
      } else {
        forms = {
          ...forms,
          [form.name]: {
            setValid,
            ...flattenedFields(initialValues)
          }
        };
      }
      if (isFormValid(forms[form.name])) {
        setValid(true);
      }
    },
    [form.name, flattenedFields]
  );

  useMemo(() => {
    if (!initializedRef.current) {
      initForm(form.initialValues);
      initializedRef.current = true;
    }
  }, [form.initialValues, initForm]);

  const resetForm = (values = {}) => {
    removeForm(form.name);
    initForm(values);
    setResetCount(resetCount + 1);
  };

  const Form = useMemo(
    () => () => (
      <FormComponent
        fields={flattenedFields(form.initialValues)}
        name={form.name}
      />
    ),
    [flattenedFields, form.initialValues, form.name]
  );

  const getValues = useCallback(() => getFormValues(form), [form]);

  return {
    valid,
    getValues,
    resetForm,
    Form
  };
};

const FormComponent = ({ fields, name }) => {
  const fieldArray = Object.keys(fields).map(field => ({
    ...fields[field],
    id: field
  }));

  return <Fields fields={fieldArray} type="form" id={name} prefix="" />;
};

export const Fields = ({ fields, type, id, prefix }) => {
  const rootFields =
    type === 'list-edit'
      ? fields
      : fields.filter(({ id: fieldId }) => {
          const idWithoutPrefix = fieldId
            .split('.')
            .slice(prefix.split('.').length, fieldId.split('.').length)
            .join('.');
          return prefix === ''
            ? !fieldId.includes('.')
            : !idWithoutPrefix.includes('.');
        });

  return (
    <div className={`rf-form rf-${type} ${type}-${id}`}>
      {rootFields.map((field, index) => {
        if (field.type === 'group') {
          const groupFields = fields.filter(({ id }) =>
            id.includes(field.id + '.')
          );
          return (
            <Fields
              key={index}
              type="group"
              fields={groupFields}
              id={field.id}
              prefix={field.id}
            />
          );
        } else {
          return <Field key={index} {...field} />;
        }
      })}
    </div>
  );
};

interface iField {
  formId: string;
  id: string;
  type: string;
  fields?: any[];
}

const Field = ({ formId, id, type, fields }: iField) => {
  const field = useFieldSubscription(formId, id);
  switch (type) {
    case 'input':
      return <Input {...field} />;
    case 'checkbox':
      return <Checkbox {...field} />;
    case 'select':
      return <Select {...field} />;
    case 'multiple-select':
      return <MultipleSelect {...field} />;
    case 'range':
      return <Range {...field} />;
    case 'list':
      return <List {...field} fields={fields} formId={formId} />;
    case 'date':
      return <Date {...field} />;
    default:
      return <div>Field Not specified</div>;
  }
};
