import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
//import App from './App';
import reportWebVitals from './reportWebVitals';

import { useForm, useFieldArray } from "react-hook-form"

function Form() {
  const { register, handleSubmit, control, reset } = useForm({
      defaultValues: {
        sample: [
          {
              title: ''
          }
        ] 
      }
  });
  const { fields, prepend, append, remove } = useFieldArray({
      control,
      name: 'sample'
  });
  
  const onSubmit = (data) => {
      console.log(data);

      // フォームを空にする。
      reset();
  };

  return (
    <div>
      <p><label>
        本文：
        <textarea {...register('body')} />
      </label></p>
      <p>
        エスケープ：<br />
        {fields.map((field, index) => (
          <div key={field.id}>
            <input {...register(`sample.${index}.title`)} />
            =&gt;
            <input {...register(`sample.${index}.title`)} />
            <button onClick={() => remove(index)}>削除</button>
          </div>
        ))}
        <button type="button" onClick={() => append({title: ''})}>
          後ろに追加
        </button>
      </p>
      <input type='submit' onClick={handleSubmit(onSubmit)} />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Form />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
