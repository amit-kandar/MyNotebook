import {React, useState} from 'react'
import { useNavigate } from "react-router-dom";

function Signup(props) {
    const host = "http://localhost:5000"

    const [credential, setCredential] = useState({ name: "", email: "", password: "", cpassword: "" })
    let navigate = useNavigate();

    const handleSubmit= async(e)=>{
        e.preventDefault()
        const response = await fetch(`${host}/api/auth/createuser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: credential.name, email: credential.email, password: credential.password })
        });

        const json = await response.json();
        console.log(json);
        if (json.success) {
            localStorage.setItem('token', json.authtoken)
            navigate('/')
            props.showAlert("success", "Successfully created your account")
        } else {
            props.showAlert("danger", "Invalid Credential!")
        }
    }

    const onChange = (e) => {
        setCredential({ ...credential, [e.target.name]: e.target.value })
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" value={credential.name} name="name" id="name" aria-describedby="emailHelp" onChange={ onChange } required />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" value={credential.email} name="email" id="email" aria-describedby="emailHelp" onChange={ onChange } required />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" autoComplete="on" value={credential.password} name="password" id="password" onChange={ onChange } minLength={5} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                    <input type="password" className="form-control" autoComplete="on" value={credential.cpassword} name="cpassword" id="cpassword" onChange={ onChange } minLength={5} required />
                </div>
                <button type="submit" className="btn btn-primary" >Submit</button>
            </form>
        </div>
    )
}

export default Signup