import React, { useState } from "react";
import * as XLSX from "xlsx/xlsx.mjs";

const SheetJSApp = ({handleSubmit,Category,handleCreate}) => {
  const [data, setData] = useState([]);
  const [cols, setCols] = useState([]);

  const handleFile = (file) => {
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;

    reader.onload = (e) => {
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, { type: rABS ? "binary" : "array" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      setData(data);
      setCols(makeCols(ws["!ref"]));
    };

    if (rABS) reader.readAsBinaryString(file);
    else reader.readAsArrayBuffer(file);
  };


  return (
    <DragDropFile handleFile={handleFile}>
      <div className="row">
        <div className="col-xs-12">
          <DataInput handleFile={handleFile} />
        </div>
      </div>
      <div className="row">
        <div className="col-xs-12 mt-3">
          {console.log( data.length)}
          <button
            disabled={!data.length}
            className="btn btn-success"
            onClick={(e)=>Category?handleSubmit(e,true,data):handleCreate(e,true,data)}
          >
            Export
          </button>
        </div>
      </div>
      <div className="row">
        <div className="col-xs-12">
          <OutTable data={data} cols={cols} />
        </div>
      </div>
    </DragDropFile>
  );
};

const DragDropFile = ({ handleFile, children }) => {
  const suppress = (evt) => {
    evt.stopPropagation();
    evt.preventDefault();
  };

  const onDrop = (evt) => {
    evt.stopPropagation();
    evt.preventDefault();
    const files = evt.dataTransfer.files;
    if (files && files[0]) handleFile(files[0]);
  };

  return (
    <div onDrop={onDrop} onDragEnter={suppress} onDragOver={suppress}>
      {children}
    </div>
  );
};

const DataInput = ({ handleFile }) => {
  const handleChange = (e) => {
    const files = e.target.files;
    if (files && files[0]) handleFile(files[0]);
  };

  return (
    <form className="form-inline">
      <div className="form-group">
        <label htmlFor="file">Bulk Category Upload</label>
        <input
          type="file"
          className="form-control"
          id="file"
          accept={SheetJSFT}
          onChange={handleChange}
        />
      </div>
    </form>
  );
};

const OutTable = ({ data, cols }) => {
  return (
    <div className="table-responsive">
      <table className="table table-striped">
        <thead>
          <tr>
            {cols.map((c) => (
              <th key={c.key}>{c.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((r, i) => (
            <tr key={i}>
              {cols.map((c) => (
                <td key={c.key}>{r[c.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const SheetJSFT = [
  "xlsx",
  "xlsb",
  "xlsm",
  "xls",
  "xml",
  "csv",
  "txt",
  "ods",
  "fods",
  "uos",
  "sylk",
  "dif",
  "dbf",
  "prn",
  "qpw",
  "123",
  "wb*",
  "wq*",
  "html",
  "htm",
]
  .map((x) => "." + x)
  .join(",");

const makeCols = (refstr) => {
  const o = [];
  const C = XLSX.utils.decode_range(refstr).e.c + 1;
  for (let i = 0; i < C; ++i) o[i] = { name: XLSX.utils.encode_col(i), key: i };
  return o;
};

export default SheetJSApp;
