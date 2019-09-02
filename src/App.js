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
    const newPages =
      !data.pages || !Array.isArray(data.pages)
        ? {}
        : data.pages.reduce((obj, page) => {
            if (!page.denomination) {
              return obj;
            }
            const newQuestions =
              !page.questions ||
              !Array.isArray(page.questions) ||
              page.questions.length === 0
                ? {}
                : page.questions.reduce((result, question) => {
                    const { identifier, ...newQuestion } = question;
                    result[identifier] = newQuestion;
                    return result;
                  }, {});
            obj[page.denomination] = newQuestions;
            return obj;
          }, {});
    const newResults =
      !data.results || !Array.isArray(data.results) || data.results.length === 0
        ? {}
        : data.results.reduce((obj, result) => {
            if (!result.denomination) {
              return obj;
            }
            const { denomination, ...newResult } = result;
            obj[denomination] = newResult;
            return obj;
          }, {});
    return Object.assign({}, data, { pages: newPages, results: newResults });
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
