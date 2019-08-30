import React, { useState } from "react";
import yaml from "js-yaml";
import "./App.css";
import Form from "react-jsonschema-form";
import schema from "./questy-schema.json";

function App() {
  const storedData = localStorage.getItem("formData");
  const data = storedData ? JSON.parse(storedData) : {};
  const [formData, setFormData] = useState(data);
  console.log(formData);
  const onChange = ({ formData }, e) => {
    setFormData(formData);
    localStorage.setItem("formData", JSON.stringify(formData));
  };
  const clear = () => {
    localStorage.removeItem("formData");
    setFormData({});
  };

  const prettifySchema = data => {
    const pages = data.pages;
    if (!pages || !Array.isArray(pages)) {
      return data;
    }
    const newPages = pages.reduce((obj, page) => {
      if (!page.questions || !Array.isArray(page.questions)) {
        obj[page.denomination] = {};
        return obj;
      }
      const newQuestions = page.questions.reduce((result, question) => {
        const { identifier, ...newQuestion } = question;
        result[identifier] = question;
        return result;
      }, {});
      obj[page.denomination] = newQuestions;
      return obj;
    }, {});
    return Object.assign({}, data, { pages: newPages });
  };

  return (
    <div className="App container-fluid">
      <Form
        schema={schema}
        formData={formData}
        onChange={onChange}
        liveValidate={true}
      >
        <pre>
          <code className="language-yaml">
            {yaml.safeDump(prettifySchema(formData), { skipInvalid: true })}
          </code>
        </pre>
      </Form>
      <button className="btn btn-default" onClick={clear}>
        Clear Data
      </button>
    </div>
  );
}

export default App;
