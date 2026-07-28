import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from '../services/api';

function Register() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await api.post('/register', { nome, email, senha });
            navigate('/login');
        } catch(err) {
            setErro(err.response?.data?.mensagem || 'Erro ao criar conta.');
        }
    }

    return (
        <div className="min-h-screen bg-blue-400 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-6">Criar conta</h1>
                {erro && <p>{erro}</p>}
                <form onSubmit={handleSubmit} className= "flex flex-col gap-4" >
                    <input type ="text" placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} 
                    className="border border-gray-300 rounded p-2 focus:outline-none "/> 
                    <input type ="text" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} 
                    className="border border-gray-300 rounded p-2 focus:outline-none "/>
                    <input type ="text" placeholder="Senha" value={senha} onChange={e => setSenha(e.target.value)} 
                    className="border border-gray-300 rounded p-2 focus:outline-none "/>
                    <button type = "submit" className="bg-blue-500 text-white font-bold py-2 rounded hover:bg-blue-600 cursor-pointer w-full"
                    >Cadastrar</button>
                </form>
                <p className="text-center text-sm mt-4">Já tem conta? <a href="/login" className="text-blue-500 hover:underline">Entrar</a></p>
            </div>
        </div>
    );
}

export default Register;