import React from 'react';
import ReactDOM from 'react-dom/client';
//import './index.css';
import './App.css';
import reportWebVitals from './reportWebVitals';

import 'bootstrap/dist/css/bootstrap.min.css'
import { Button, FormControl } from 'react-bootstrap'

import { useForm, useFieldArray } from "react-hook-form"

function Form() {
  const { register, handleSubmit, setValue, getValues, control } = useForm({
    defaultValues: {
      repl: [
        {
            from: '',
            to: ''
        }
      ],
      chec: [
        {
            body: ''
        }
      ],
    }
  });
  const { fields: repl_fields, append: repl_append, remove: repl_remove } = useFieldArray({
    control,
    name: 'repl'
  });
  const { fields: chec_fields, append: chec_append, remove: chec_remove } = useFieldArray({
    control,
    name: 'chec'
  });
  
  const onSubmit = (data) => {
    console.log(data);

    let mailBody = getValues('body');
    let repls = getValues('repl');
    for (let i = 0; i < repls.length; i++) {
      let pair = repls[i];
      mailBody = mailBody.split(pair.from).join(pair.to);
    }
    mailBody = mailBody + "\n";

    let checBody = "";
    let checs = getValues('chec');
    for (let i = 0; i < checs.length; i++) {
      let chec = checs[i];
      checBody += "- " + chec.body + "\n";
    }

    // let result = "```\n" + mailBody + "\n```\n";
    // result += "以下の項目のうち、上記の文章に含まれていない項目を挙げてください。\n";
    // result += checBody;

    let result = "#命令書\n";
    result += "- 次のメール本文にチェックリストの項目が漏れなく記述されているか教えてください。\n\n";
    result += "#メール本文\n" + mailBody + "\n";
    result += "#チェックリスト\n" + checBody;

    setValue('result', result);

    copyToClipboard(result)
  };

  const copyToClipboard = async (text) => {
    await global.navigator.clipboard.writeText(text);
  };

  return (
    <div class="container-fluid">
      <h1>ChatGPTにメールの記入漏れを判断させる</h1>
      <p><label>
        本文：<br />
        <FormControl as="textarea" rows={10} cols={100} {...register('body')} />
      </label></p>
      <p>
        置き換え：<br />
        <table>
          {repl_fields.map((field, index) => (
            <tr key={field.id}>
              <td><FormControl as="textarea" cols={40} {...register(`repl.${index}.from`)} /></td>
              <td>=&gt;</td>
              <td><FormControl as="textarea" cols={40} {...register(`repl.${index}.to`)} /></td>
              <td><Button onClick={() => repl_remove(index)}>削除</Button></td>
            </tr>
          ))}
          <Button type="button" onClick={() => repl_append({from: '', key: ''})}>
            置き換えを追加
          </Button>
        </table>
      </p>
      <p>
        チェックリスト：<br />
        <table>
          {chec_fields.map((field, index) => (
            <tr key={field.id}>
              <td><FormControl type="text" {...register(`chec.${index}.body`)} /></td>
              <td><Button onClick={() => chec_remove(index)}>削除</Button></td>
            </tr>
          ))}
          <Button type="button" onClick={() => chec_append({body: ''})}>
            チェック項目を追加
          </Button>
        </table>
      </p>
      <p>
        <Button onClick={handleSubmit(onSubmit)}>出力</Button>　
        <Button onClick={handleSubmit(onSubmit)}>出力してコピー</Button>
      </p>
      <hr />
      <p>
        <h2>ChatGPT</h2>
        <FormControl as="textarea" rows={10} cols={100} {...register('result')} />
      </p>
      <div class="footer-margin"></div>
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
