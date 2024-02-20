import React, { useState } from "react";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const [sujet, setSujet] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState(null);
    const [msg, setMsg] = useState("");

    const upload = () => {
        // Validate form fields
        if (!sujet || !description || !file) {
            setMsg("Please fill in all fields");
            return;
        }

        const formData = new FormData();
        formData.append("sujet", sujet);
        formData.append("description", description);
        formData.append('file', file);

        axios.post('http://localhost:3001/create', formData)
            .then((response) => {
                console.log(response);
                if (response.data.Status === 'Success') {
                    setMsg("File Successfully Uploaded");
                } else {
                    setMsg("Error: " + response.data.Error || "Unknown error");
                }
            })
            .catch(err => {
                console.log(err);
                setMsg("Error: Something went wrong");
            });
    }

    return (
        <div className="container" style={{ paddingTop: 60 }}>
            <div className="row">
                <h1> Entrez les informations dans les champs appropriés</h1>
                <div className="col-12">
                    <label className="form-label">Sujet</label>
                    <input type="text" className="form-control" placeholder='Enter Sujet' autoComplete='off'
                        onChange={(e) => setSujet(e.target.value)} />
                </div>
                <div className="col-12">
                    <label className="form-label">Description</label>
                    <input type="text" style={{ height: '140px' }} className="form-control" placeholder='Enter Description' autoComplete='off'
                        onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div className="col-12">
                    <label className="form-label">Upload File</label>
                    <input className="form-control form-control-lg" type="file" onChange={(e) => setFile(e.target.files[0])} />
                </div>
                <button type="button" className="btn btn-primary btn-lg" onClick={upload} style={{ marginTop: '20px' }}>Upload</button>
                <h1 style={{ fontSize: '15px', textAlign: 'center', marginTop: '20px', color: msg.includes("Error") ? 'red' : 'green' }}>{msg}</h1>
            </div>
        </div>
    );
}

export default App;
