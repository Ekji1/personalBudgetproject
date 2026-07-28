import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/authcontext';
import api from "../services/api";

function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const { data } = await api.post('/login', { email, senha });
            login(data.token);
            navigate('/dashboard');
        } catch(err) {
            setErro(err.response?.data?.mensagem || 'Erro ao fazer login.');
        }
    }

    return (
        <div className="min-h-screen bg-blue-400 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
                {erro && <p className="text-red-500 text-sm mb-4">{erro}</p>}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} 
                    className="border border-gray-300 rounded p-2 focus:outline-none"/>
                    <input type="password" placeholder="Senha" value={senha} onChange={e => setSenha(e.target.value)} 
                    className="border border-gray-300 rounded p-2 focus:outline-none"/>
                    <button type="submit"
                    className="bg-blue-500 text-white font-bold py-2 rounded hover:bg-blue-600 cursor-pointer">Entrar</button>
                </form>
                <p className="text-center text-sm mt-4"> Não tem conta? <a href="/register" className="text-blue-500 hover:underline">Cadastrar</a></p>
            </div>
        </div>
    );

}

export default Login;