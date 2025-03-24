import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor } from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';
import { plugins, toolbar } from './Toolbar';
import { Form } from 'antd';

type PropsType = {
  name: string;
  label?: string;
  form: any; // Form instance must be passed
  [key: string]: any;
};
const TextEditor = ({ name, label, form, ...formItemProps }: PropsType) => {
  const value = Form.useWatch(name, form) || '';

  return (
    <Form.Item name={name} label={label} {...formItemProps}>
      <CKEditor
        editor={ClassicEditor}
        config={{
          licenseKey: 'GPL',
          toolbar: { items: toolbar },
          plugins,
        }}
        data={value}
        onChange={(_, editor) => {
          const markdownData = editor.getData();
          form.setFieldsValue({ [name]: markdownData });
        }}
      />
    </Form.Item>
  );
};

export default TextEditor;
