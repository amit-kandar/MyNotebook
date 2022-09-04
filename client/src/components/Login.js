import {React, useState} from 'react'
import { useNavigate } from "react-router-dom";

function Login(props) {
    const host = "http://localhost:5000"

    const [credential, setCredential] = useState({ email: "", password: "" })
    let navigate = useNavigate();

    const handleSubmit= async(e)=>{
        e.preventDefault()
        const response = await fetch(`${host}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: credential.email, password: credential.password })
        });

        const json = await response.json();
        console.log(json);
        if (json.success) {
            localStorage.setItem('token', json.authtoken)
            navigate('/')
            props.showAlert("success", "Successfully Logged in")
        } else {
            props.showAlert("danger", "Invalid Credentials")
        }
    }

    const onChange = (e) => {
        setCredential({ ...credential, [e.target.name]: e.target.value })
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" value={credential.email} name="email" id="email" aria-describedby="emailHelp" onChange={ onChange } />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" value={credential.password} name="password" id="password" onChange={ onChange } autoComplete="on" />
                </div>
                <button type="submit" className="btn btn-primary" >Log in</button>
            </form>
        </div>
    )
}

export default Login